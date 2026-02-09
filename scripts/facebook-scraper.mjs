import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Конфигурация
const FACEBOOK_EMAIL = process.env.FACEBOOK_EMAIL;
const FACEBOOK_PASSWORD = process.env.FACEBOOK_PASSWORD;
const TARGET_GROUPS = [
    'https://www.facebook.com/groups/1685622221742451',
    'https://www.facebook.com/groups/673174389991885',
    'https://www.facebook.com/groups/293555797750114',
    'https://www.facebook.com/groups/277964673341557',
];

// Регулярки для поиска номеров
const PHONE_PATTERNS = [
    /05\d{1}[-\s]?\d{7}/g,  // Израильские мобильные: 05X-XXXXXXX
    /\+972[-\s]?5\d{1}[-\s]?\d{7}/g,  // +972-5X-XXXXXXX
    /972[-\s]?5\d{1}[-\s]?\d{7}/g,    // 972-5X-XXXXXXX
];

function extractPhones(text) {
    const phones = new Set();

    for (const pattern of PHONE_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(phone => {
                // Нормализация номера
                let normalized = phone.replace(/[-\s]/g, '');
                if (normalized.startsWith('972')) {
                    normalized = '0' + normalized.slice(3);
                } else if (normalized.startsWith('+972')) {
                    normalized = '0' + normalized.slice(4);
                }
                phones.add(normalized);
            });
        }
    }

    return Array.from(phones);
}

async function loginToFacebook(page) {
    console.log('🔐 Логинимся в Facebook...');

    await page.goto('https://www.facebook.com/');
    await page.waitForTimeout(3000);

    // Ищем поля для логина (разные варианты селекторов)
    try {
        await page.fill('input[name="email"]', FACEBOOK_EMAIL);
        await page.fill('input[name="pass"]', FACEBOOK_PASSWORD);
        await page.keyboard.press('Enter');

        // Ждем редиректа
        await page.waitForTimeout(5000);
        console.log('✅ Залогинились');
    } catch (err) {
        console.error('⚠️  Ошибка логина. Браузер остается открытым - залогинься вручную');
        console.log('После логина нажми Enter в терминале...');
        await new Promise(resolve => {
            process.stdin.once('data', resolve);
        });
    }
}

async function scrapeGroup(page, groupUrl) {
    console.log(`\n📊 Парсим группу: ${groupUrl}`);

    await page.goto(groupUrl);
    await page.waitForTimeout(3000);

    const vendors = [];
    let scrollCount = 0;
    const MAX_SCROLLS = 10; // Ограничение скроллов

    while (scrollCount < MAX_SCROLLS) {
        // Скроллим вниз
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(2000);

        // Извлекаем посты
        const posts = await page.$$('[role="article"]');

        for (const post of posts) {
            try {
                const text = await post.innerText();
                const phones = extractPhones(text);

                if (phones.length > 0) {
                    // Пытаемся извлечь имя автора
                    const authorElement = await post.$('a[role="link"] strong');
                    const name = authorElement ? await authorElement.innerText() : 'Unknown';

                    vendors.push({
                        name,
                        phone: phones[0], // Берем первый найденный номер
                        source_url: groupUrl,
                        description: text.slice(0, 500), // Первые 500 символов
                    });

                    console.log(`✓ Найден: ${name} - ${phones[0]}`);
                }
            } catch (err) {
                // Пропускаем проблемные посты
            }
        }

        scrollCount++;
    }

    return vendors;
}

async function saveToSupabase(vendors) {
    console.log(`\n💾 Сохраняем ${vendors.length} контактов в Supabase...`);

    for (const vendor of vendors) {
        // Проверяем, не существует ли уже
        const { data: existing } = await supabase
            .from('pending_vendors')
            .select('id')
            .eq('phone', vendor.phone)
            .single();

        if (existing) {
            console.log(`⏭️  Пропускаем ${vendor.phone} (уже существует)`);
            continue;
        }

        // Создаем pending vendor
        const { error } = await supabase
            .from('pending_vendors')
            .insert({
                name: vendor.name,
                phone: vendor.phone,
                description: vendor.description,
                source_type: 'facebook',
                source_url: vendor.source_url,
                status: 'pending',
                confirmation_token: crypto.randomUUID(),
            });

        if (error) {
            console.error(`❌ Ошибка сохранения ${vendor.phone}:`, error.message);
        } else {
            console.log(`✅ Сохранен: ${vendor.name} - ${vendor.phone}`);
        }
    }
}

async function main() {
    if (!FACEBOOK_EMAIL || !FACEBOOK_PASSWORD) {
        console.error('❌ Установи FACEBOOK_EMAIL и FACEBOOK_PASSWORD в .env.local');
        process.exit(1);
    }

    const browser = await chromium.launch({
        headless: false, // Показываем браузер для первого запуска
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    });

    const page = await context.newPage();

    try {
        await loginToFacebook(page);

        const allVendors = [];

        for (const groupUrl of TARGET_GROUPS) {
            const vendors = await scrapeGroup(page, groupUrl);
            allVendors.push(...vendors);
        }

        console.log(`\n📈 Всего найдено: ${allVendors.length} контактов`);

        if (allVendors.length > 0) {
            await saveToSupabase(allVendors);
        }

        console.log('\n✅ Парсинг завершен!');

    } catch (error) {
        console.error('❌ Ошибка:', error);
    } finally {
        await browser.close();
    }
}

main();
