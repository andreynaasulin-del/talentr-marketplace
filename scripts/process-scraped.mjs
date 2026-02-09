import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

dotenv.config({ path: '.env.local' });

const execPromise = util.promisify(exec);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Папка с данными
const DATA_DIR = './scraped_data';
// Файл для логов
const LOG_FILE = './scraped_data/processing_log.txt';

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

async function sendInvite(phone, name, category, sourceUrl) {
    // Сообщение без ссылок, компактное
    const message = `היי! ראיתי שאתה פעיל בתחום האירועים 🎤
אנחנו משיקים פלטפורמה חדשה - Talentr
יש לנו AI שמחבר בין טאלנטים ללקוחות אוטומטית
בלי לחפש בקבוצות, המערכת שולחת לך הזמנות מוכנות

כרגע בבטא ומחפשים פרופילים חזקים לכייל את האלגוריתם
רלוונטי לך?`;

    // Очистка номера
    const cleanPhone = phone.replace(/\D/g, '');
    let targetPhone = cleanPhone;
    if (targetPhone.startsWith('0')) {
        targetPhone = '972' + targetPhone.slice(1);
    }

    const command = `openclaw message send --target ${targetPhone} --message "${message.replace(/"/g, '\\"')}"`;

    try {
        log(`    📤 Отправка: ${phone}...`);
        const { stdout, stderr } = await execPromise(command);
        if (stderr && !stderr.includes('Debugger attached')) {
            log(`    ⚠️ Warning CLI: ${stderr}`);
        }
        log(`    ✅ Отправлено! ID: ${stdout.trim().match(/ID: (\S+)/)?.[1] || 'OK'}`);
        return true;
    } catch (error) {
        log(`    ❌ Ошибка: ${error.message}`);
        return false;
    }
}

async function main() {
    log('🚀 Start processing scraped data...');

    if (!fs.existsSync(DATA_DIR)) {
        log('❌ Папка с данными не найдена.');
        return;
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('all_numbers_') && f.endsWith('.json'));

    let allContacts = [];
    for (const file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
            allContacts = allContacts.concat(data);
        } catch (e) {
            log(`⚠️ Ошибка чтения файла ${file}: ${e.message}`);
        }
    }

    // Дедупликация
    const uniqueContacts = new Map();
    allContacts.forEach(c => {
        if (!uniqueContacts.has(c.phone)) {
            uniqueContacts.set(c.phone, c);
        }
    });

    log(`🔍 Найдено всего записей: ${allContacts.length}`);
    log(`✨ Уникальных номеров: ${uniqueContacts.size}`);

    let processedCount = 0;
    let inviteCount = 0;

    for (const contact of uniqueContacts.values()) {
        const { phone, text, source } = contact;

        // 1. Проверяем в Supabase
        const { data: existing, error: fetchError } = await supabase
            .from('pending_vendors')
            .select('id, status')
            .eq('phone', phone)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
            log(`❌ Ошибка DB при поиске ${phone}: ${fetchError.message}`);
            continue;
        }

        // Пропускаем только если уже invited или rejected
        if (existing && (existing.status === 'invited' || existing.status === 'rejected')) {
            log(`⏭️  Пропуск: ${phone} (Статус: ${existing.status})`);
            continue;
        }

        // 2. Определяем имя/категорию
        // В `all_numbers_*.json` мы сохраняли { phone, text, source }.

        // Для MVP возьмем имя как "Специалист" если не знаем.
        // Или попробуем найти в vendors array, если он был сохранен?
        // Увы, CSV с вендорами сохранялся отдельно.
        // Ладно, будем слать общее сообщение.

        const name = "מומחה"; // Специалист
        const category = "אירועים"; // Ивенты

        // 3. Сохраняем в Supabase (только если новый)
        if (!existing) {
            const { error: insertError } = await supabase
                .from('pending_vendors')
                .insert({
                    phone: phone,
                    name: name,
                    category: category,
                    description: text.slice(0, 200),
                    source_type: 'facebook',
                    source_url: source,
                    status: 'pending',
                });

            if (insertError) {
                log(`❌ Ошибка вставки ${phone}: ${insertError.message}`);
                continue;
            }

            log(`✅ Сохранен в БД: ${phone}`);
            processedCount++;
        } else {
            log(`📌 Уже в БД: ${phone} (Статус: ${existing.status}), отправляем инвайт...`);
        }

        // 4. Отправляем инвайт (ClawBot)
        const sent = await sendInvite(phone, '', category, source);

        if (sent) {
            // Обновляем статус
            await supabase
                .from('pending_vendors')
                .update({
                    status: 'invited',
                    // invited_at: new Date().toISOString() // Если поле добавим
                })
                .eq('phone', phone);

            inviteCount++;

            // Пауза чтобы не забанили (15-30 сек)
            const pause = Math.floor(Math.random() * 15000) + 15000;
            log(`    ⏳ Пауза ${Math.round(pause / 1000)} сек...`);
            await new Promise(r => setTimeout(r, pause));
        }
    }

    log(`🏁 Готово! Обработано новых: ${processedCount}. Отправлено инвайтов: ${inviteCount}.`);
}

main();
