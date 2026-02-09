import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Папка с данными
const DATA_DIR = './scraped_data';

async function syncToDatabase() {
    console.log('🔄 Синхронизирую все контакты в БД...\n');

    // Собираем все данные из JSON файлов
    const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('all_numbers_') && f.endsWith('.json'));

    let allContacts = [];
    for (const file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
            allContacts = allContacts.concat(data);
        } catch (e) {
            console.log(`⚠️ Ошибка чтения ${file}: ${e.message}`);
        }
    }

    // Также читаем vendors JSON если есть
    const vendorFiles = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('vendors_') && f.endsWith('.json'));
    for (const file of vendorFiles) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
            allContacts = allContacts.concat(data.map(v => ({
                phone: v.phone,
                text: v.description || '',
                source: v.source_url || '',
                name: v.name,
                category: v.category,
                city: v.city
            })));
        } catch (e) {
            console.log(`⚠️ Ошибка чтения ${file}: ${e.message}`);
        }
    }

    // Дедупликация по номеру телефона
    const uniqueContacts = new Map();
    allContacts.forEach(c => {
        const phone = c.phone?.replace(/\D/g, '');
        if (phone && phone.length >= 9 && !uniqueContacts.has(phone)) {
            uniqueContacts.set(phone, c);
        }
    });

    console.log(`📊 Всего записей: ${allContacts.length}`);
    console.log(`✨ Уникальных номеров: ${uniqueContacts.size}\n`);

    let added = 0;
    let skipped = 0;
    let errors = 0;

    for (const [phone, contact] of uniqueContacts) {
        // Проверяем есть ли уже в БД
        const { data: existing } = await supabase
            .from('pending_vendors')
            .select('id')
            .eq('phone', phone)
            .single();

        if (existing) {
            skipped++;
            continue;
        }

        // Добавляем новый контакт
        const { error } = await supabase
            .from('pending_vendors')
            .insert({
                phone: phone,
                name: contact.name || 'Talent',
                category: contact.category || 'Events',
                city: contact.city || null,
                description: (contact.text || contact.description || '').slice(0, 300),
                source_type: 'facebook',
                source_url: contact.source || '',
                status: 'pending',
                confirmation_token: crypto.randomUUID()
            });

        if (error) {
            console.log(`❌ Ошибка: ${phone} - ${error.message}`);
            errors++;
        } else {
            added++;
        }
    }

    console.log(`\n✅ Готово!`);
    console.log(`   ➕ Добавлено: ${added}`);
    console.log(`   ⏭️  Пропущено (дубликаты): ${skipped}`);
    console.log(`   ❌ Ошибок: ${errors}`);

    // Показываем общую статистику
    const { count } = await supabase
        .from('pending_vendors')
        .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Всего в БД: ${count} контактов`);
}

syncToDatabase();
