import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function exportContacts() {
    console.log('📊 Экспортирую контакты из базы данных...\n');

    // Получаем все pending контакты
    const { data: contacts, error } = await supabase
        .from('pending_vendors')
        .select('*')
        .in('status', ['pending', 'invited'])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Ошибка:', error.message);
        return;
    }

    console.log(`✅ Найдено ${contacts.length} контактов\n`);

    // Создаем папку если нет
    if (!fs.existsSync('./export')) {
        fs.mkdirSync('./export');
    }

    // 1. CSV для WhatsApp Business (формат для импорта контактов)
    const csvHeader = 'Name,Phone,Category,Status,Source\n';
    const csvRows = contacts.map(c => {
        const phone = c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone;
        return `"${c.name || 'Talent'}","+${phone}","${c.category || ''}","${c.status}","${c.source_type || ''}"`;
    }).join('\n');

    fs.writeFileSync('./export/contacts_whatsapp.csv', csvHeader + csvRows);
    console.log('📁 Сохранено: ./export/contacts_whatsapp.csv');

    // 2. Текстовый файл с номерами (для копирования)
    const phonesList = contacts.map(c => {
        const phone = c.phone.startsWith('0') ? '+972' + c.phone.slice(1) : '+' + c.phone;
        return phone;
    }).join('\n');

    fs.writeFileSync('./export/phones_list.txt', phonesList);
    console.log('📁 Сохранено: ./export/phones_list.txt');

    // 3. JSON для API
    const jsonData = contacts.map(c => ({
        phone: c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone,
        name: c.name || 'Talent',
        category: c.category,
        status: c.status
    }));

    fs.writeFileSync('./export/contacts.json', JSON.stringify(jsonData, null, 2));
    console.log('📁 Сохранено: ./export/contacts.json');

    // 4. Готовые WhatsApp ссылки для быстрой отправки
    const message = encodeURIComponent(`היי! ראיתי שאתה פעיל בתחום האירועים 🎤
אנחנו משיקים פלטפורמה חדשה - Talentr
יש לנו AI שמחבר בין טאלנטים ללקוחות אוטומטית
בלי לחפש בקבוצות, המערכת שולחת לך הזמנות מוכנות

כרגע בבטא ומחפשים פרופילים חזקים לכייל את האלגוריתם
רלוונטי לך?`);

    const waLinks = contacts.filter(c => c.status === 'pending').slice(0, 50).map(c => {
        const phone = c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone;
        return `https://wa.me/${phone}?text=${message}`;
    }).join('\n');

    fs.writeFileSync('./export/whatsapp_links.txt', waLinks);
    console.log('📁 Сохранено: ./export/whatsapp_links.txt (первые 50 pending)');

    // 5. HTML файл с кликабельными ссылками
    const htmlLinks = contacts.filter(c => c.status === 'pending').slice(0, 50).map((c, i) => {
        const phone = c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone;
        const waLink = `https://wa.me/${phone}?text=${message}`;
        return `<div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 8px;">
            <strong>${i + 1}. ${c.name || 'Talent'}</strong> (${c.category || 'Unknown'})<br>
            <span style="color: #666;">+${phone}</span><br>
            <a href="${waLink}" target="_blank" style="background: #25D366; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; display: inline-block; margin-top: 5px;">
                📱 Отправить в WhatsApp
            </a>
        </div>`;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Talentr Outreach - WhatsApp Links</title>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        h1 { color: #25D366; }
        .stats { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>📱 WhatsApp Outreach</h1>
    <div class="stats">
        <strong>Всего контактов:</strong> ${contacts.length}<br>
        <strong>Pending:</strong> ${contacts.filter(c => c.status === 'pending').length}<br>
        <strong>Invited:</strong> ${contacts.filter(c => c.status === 'invited').length}
    </div>
    <p>Нажми на кнопку чтобы открыть WhatsApp с готовым сообщением:</p>
    ${htmlLinks}
</body>
</html>`;

    fs.writeFileSync('./export/outreach.html', html);
    console.log('📁 Сохранено: ./export/outreach.html');

    console.log('\n✅ Готово! Открой ./export/outreach.html в браузере для отправки вручную.');
    console.log('   Или импортируй contacts_whatsapp.csv в WhatsApp Business.');
}

exportContacts();
