import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = 'https://talentr.co.il';

// Короткий текст (ссылку добавишь после укорачивания)
const MESSAGE_TEMPLATE = `שלום! 👋
ראיתי שאתה פעיל בתחום האירועים.
Talentr - פלטפורמה חדשה לטאלנטים.
AI שמחבר אמנים ללקוחות אוטומטית.
בטא בחינם 🎁
הרשמה:`;

async function exportPersonalLinks() {
    console.log('📱 יוצר קישורים אישיים לכל איש קשר...\n');

    const { data: contacts, error } = await supabase
        .from('pending_vendors')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ שגיאה:', error.message);
        return;
    }

    console.log(`✅ נמצאו ${contacts.length} אנשי קשר\n`);

    if (!fs.existsSync('./export')) {
        fs.mkdirSync('./export');
    }

    // CSV с персональными ссылками
    const csvRows = ['Phone,Name,Category,Personal Link'];
    contacts.forEach(c => {
        const phone = c.phone.startsWith('0') ? '+972' + c.phone.slice(1) : '+' + c.phone;
        const link = `${BASE_URL}/onboarding?invite=${c.confirmation_token}`;
        csvRows.push(`"${phone}","${c.name || ''}","${c.category || ''}","${link}"`);
    });
    fs.writeFileSync('./export/personal_links.csv', csvRows.join('\n'));
    console.log('📁 Сохранено: ./export/personal_links.csv');

    // Текстовый файл для копирования
    const textRows = contacts.map(c => {
        const phone = c.phone.startsWith('0') ? '+972' + c.phone.slice(1) : '+' + c.phone;
        const link = `${BASE_URL}/onboarding?invite=${c.confirmation_token}`;
        return `${phone}\n${link}\n`;
    });
    fs.writeFileSync('./export/links_to_shorten.txt', textRows.join('\n'));
    console.log('📁 Сохранено: ./export/links_to_shorten.txt');

    // HTML для удобного копирования
    const htmlRows = contacts.map((c, i) => {
        const phone = c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone;
        const link = `${BASE_URL}/onboarding?invite=${c.confirmation_token}`;
        return `
        <div class="card">
            <div class="num">${i + 1}</div>
            <div class="info">
                <strong>${c.name || 'Talent'}</strong>
                <span class="cat">${c.category || ''}</span>
                <div class="phone">+${phone}</div>
            </div>
            <div class="actions">
                <input type="text" value="${link}" readonly onclick="this.select(); document.execCommand('copy');">
                <button onclick="window.open('https://goo.su/page/ukorotit-ssilku-google', '_blank')">🔗 goo.su</button>
            </div>
        </div>`;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Talentr - קישורים אישיים</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: -apple-system, sans-serif; 
            background: #f5f5f5;
            margin: 0; padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { text-align: center; color: #333; }
        .stats { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .message { background: #DCF8C6; padding: 15px; border-radius: 8px; margin-bottom: 20px; white-space: pre-wrap; }
        .card { background: white; border-radius: 8px; padding: 15px; margin-bottom: 10px; display: flex; align-items: center; gap: 15px; }
        .num { background: #667eea; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0; }
        .info { flex: 1; min-width: 150px; }
        .info strong { display: block; }
        .cat { background: #f0f0f0; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
        .phone { color: #666; font-size: 13px; margin-top: 4px; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .actions input { width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px; }
        .actions button { background: #4285f4; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
        .actions button:hover { background: #3367d6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 קישורים אישיים</h1>
        <div class="stats"><strong>${contacts.length}</strong> אנשי קשר</div>
        <div class="message"><strong>הודעה לשליחה:</strong>\n\n${MESSAGE_TEMPLATE}\n[הוסף קישור מקוצר]</div>
        <p>לחץ על הקישור כדי להעתיק, ואז לחץ "goo.su" לקיצור</p>
        ${htmlRows}
    </div>
</body>
</html>`;

    fs.writeFileSync('./export/personal_links.html', html);
    console.log('📁 Сохранено: ./export/personal_links.html\n');

    console.log('📝 Текст сообщения (без ссылки):');
    console.log(MESSAGE_TEMPLATE);
    console.log('\n✅ Готово! Открой personal_links.html');
}

exportPersonalLinks();
