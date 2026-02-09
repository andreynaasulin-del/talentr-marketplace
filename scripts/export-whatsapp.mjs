import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Короткая ссылка на ONBOARDING
// Создай на goo.su для: https://talentr.co.il/onboarding
const SHORT_LINK = 'https://goo.su/talentr'; // Замени на реальную!

// Короткий вежливый текст на иврите
const MESSAGE_TEMPLATE = `שלום! 👋
ראיתי שאתה פעיל בתחום האירועים.
אנחנו משיקים פלטפורמה חדשה לטאלנטים - Talentr.
AI שמחבר בין אמנים ללקוחות אוטומטית.

בטא בחינם 🎁
מעניין? ${SHORT_LINK}`;

async function exportForWhatsApp() {
    console.log('📱 מכין קבצים לשליחה ידנית...\n');

    // Получаем pending контакты
    const { data: contacts, error } = await supabase
        .from('pending_vendors')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Ошибка:', error.message);
        return;
    }

    console.log(`✅ Найдено ${contacts.length} pending контактов\n`);

    if (!fs.existsSync('./export')) {
        fs.mkdirSync('./export');
    }

    const encodedMessage = encodeURIComponent(MESSAGE_TEMPLATE);

    // HTML с кликабельными ссылками
    const contactCards = contacts.map((c, i) => {
        const phone = c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone;
        const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;
        return `
        <div class="card">
            <div class="number">${i + 1}</div>
            <div class="info">
                <strong>${c.name || 'Talent'}</strong>
                <span class="category">${c.category || ''}</span>
                <span class="phone">+${phone}</span>
            </div>
            <a href="${waLink}" target="_blank" class="btn">📱 שלח</a>
        </div>`;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Talentr Outreach</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container { max-width: 500px; margin: 0 auto; }
        h1 { color: white; text-align: center; margin-bottom: 10px; }
        .stats { 
            background: rgba(255,255,255,0.95); 
            padding: 15px 20px; 
            border-radius: 12px; 
            margin-bottom: 20px;
            text-align: center;
        }
        .message-preview {
            background: #DCF8C6;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            white-space: pre-wrap;
            direction: rtl;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .number {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
        }
        .info { flex: 1; }
        .info strong { display: block; margin-bottom: 4px; }
        .category { 
            background: #f0f0f0; 
            padding: 2px 8px; 
            border-radius: 10px; 
            font-size: 11px; 
            margin-left: 5px;
        }
        .phone { color: #666; font-size: 13px; display: block; margin-top: 4px; }
        .btn {
            background: #25D366;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            white-space: nowrap;
        }
        .btn:hover { background: #128C7E; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Talentr Outreach</h1>
        <div class="stats">
            <strong>${contacts.length}</strong> אנשי קשר לשליחה
        </div>
        <div class="message-preview">
            <strong>ההודעה שתישלח:</strong><br><br>
${MESSAGE_TEMPLATE}
        </div>
        ${contactCards}
    </div>
</body>
</html>`;

    fs.writeFileSync('./export/outreach.html', html);
    console.log('📁 Сохранено: ./export/outreach.html');

    // Текстовый файл с сообщением для копирования
    fs.writeFileSync('./export/message.txt', MESSAGE_TEMPLATE);
    console.log('📁 Сохранено: ./export/message.txt');

    // Список wa.me ссылок
    const links = contacts.map(c => {
        const phone = c.phone.startsWith('0') ? '972' + c.phone.slice(1) : c.phone;
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    }).join('\n');
    fs.writeFileSync('./export/links.txt', links);
    console.log('📁 Сохранено: ./export/links.txt');

    console.log(`\n✅ Готово!`);
    console.log(`\n📝 Текст сообщения:\n`);
    console.log(MESSAGE_TEMPLATE);
    console.log(`\n⚠️  Не забудь создать короткую ссылку на goo.su!`);
    console.log(`   Оригинал: https://talentr.co.il/join`);
    console.log(`   Замени SHORT_LINK в скрипте на реальную ссылку.`);
}

exportForWhatsApp();
