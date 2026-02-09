import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import crypto from 'crypto';
import OpenAI from 'openai';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const TARGET_GROUPS = [
    'https://www.facebook.com/groups/1685622221742451',
    'https://www.facebook.com/groups/673174389991885',
    'https://www.facebook.com/groups/293555797750114',
    'https://www.facebook.com/groups/277964673341557',
];

const PHONE_PATTERNS = [
    /05\d{1}[-\s]?\d{7}/g,
    /\+972[-\s]?5\d{1}[-\s]?\d{7}/g,
    /972[-\s]?5\d{1}[-\s]?\d{7}/g,
];

function extractPhones(text) {
    const phones = new Set();

    for (const pattern of PHONE_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(phone => {
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

// ============== AI ANALYSIS ==============

async function analyzePostWithAI(text) {
    if (!text || text.length < 10) return null;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert filter for finding TALENT for events in Israel.
Your goal is to identify if the post author is a PERFORMING ARTIST or CREATIVE TALENT.

✅ ACCEPT ONLY these categories:
- DJ / דיג'יי
- MC / Host / ווידע / מנחה
- Comedian / קומיקאי / סטנדאפיסט
- Musician / מוזיקאי / נגן
- Singer / זמר / זמרת
- Makeup Artist / מאפרת / ויזאגיסט
- Dancer / רקדנית / רקדן
- Magician / קוסם
- Photographer / צלם (portrait/event)
- Videographer / צלם וידאו

❌ STRICTLY REJECT:
- Equipment rental / השכרת ציוד
- Decorators / עיצוב / בלונים / פרחים
- Event Planners / הפקות / מתכננים
- Caterers / קייטרינג / אוכל
- Technicians / טכנאי / הגברה / תאורה
- Venues / אולמות / גני אירועים
- Rabbis / רבנים
- Transportation / הסעות
- People LOOKING for services
- People SELLING equipment

Return JSON:
{
    "is_talent": boolean,
    "name": "Extracted Name or null",
    "category": "DJ/MC/Comedian/Musician/Singer/Makeup Artist/Dancer/Magician/Photographer/Videographer",
    "city": "City if mentioned",
    "description": "Short summary (max 100 chars)",
    "confidence": 0-100
}`
                },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        return result.is_talent ? result : null;
    } catch (e) {
        console.error('  ⚠️ AI Error:', e.message);
        return null;
    }
}

// =========================================

async function saveToCSV(vendors, filename = 'scraped_vendors.csv') {
    const csvPath = `./scraped_data/${filename}`;

    // Создаем папку если нет
    if (!fs.existsSync('./scraped_data')) {
        fs.mkdirSync('./scraped_data');
    }

    const headers = 'Name,Phone,Category,City,Description,Source URL\n';
    const rows = vendors.map(v =>
        `"${v.name}","${v.phone}","${v.category || ''}","${v.city || ''}","${v.description?.replace(/"/g, '""').slice(0, 200) || ''}","${v.source_url}"`
    ).join('\n');

    fs.writeFileSync(csvPath, headers + rows, 'utf-8');
    console.log(`\n📄 CSV сохранен: ${csvPath}`);
}

async function scrapeGroup(page, groupUrl) {
    console.log(`\n📊 Парсим группу: ${groupUrl}`);

    try {
        await page.goto(groupUrl);
        await page.waitForTimeout(5000);
    } catch (e) {
        console.error(`  ❌ Не удалось открыть группу: ${e.message}`);
        return [];
    }

    const vendors = [];
    const allFoundNumbers = []; // Все найденные номера (даже отклоненные)
    let scrollCount = 0;
    const MAX_SCROLLS = 500; // 500 скроллов
    const processedPostElements = new Set();

    while (scrollCount < MAX_SCROLLS) {
        try {
            const posts = await page.$$('[role="article"]');
            console.log(`  🔍 Скролл ${scrollCount + 1}/${MAX_SCROLLS}: ${posts.length} постов`);

            let newPostsCount = 0;

            for (const post of posts) {
                // Используем уникальный идентификатор элемента
                const postId = await post.evaluate(el => {
                    // Пытаемся найти уникальный атрибут или создаем свой
                    if (!el.dataset.scraperId) {
                        el.dataset.scraperId = 'post_' + Math.random().toString(36).substr(2, 9);
                    }
                    return el.dataset.scraperId;
                });

                if (processedPostElements.has(postId)) continue;
                processedPostElements.add(postId);
                newPostsCount++;

                const text = await post.innerText().catch(() => '');
                if (!text || text.length < 20) continue;

                const phones = extractPhones(text);

                if (phones.length > 0) {
                    process.stdout.write(`  📞 ${phones[0]}... `);

                    // Логируем ВСЕ найденные номера
                    allFoundNumbers.push({
                        phone: phones[0],
                        text: text.slice(0, 300),
                        source: groupUrl
                    });

                    const analysis = await analyzePostWithAI(text);

                    if (analysis && analysis.is_talent) {
                        console.log(`✅ ${analysis.category}`);

                        let finalName = analysis.name;
                        if (!finalName) {
                            const authorEl = await post.$('strong, h2, h3').catch(() => null);
                            finalName = authorEl ? await authorEl.innerText().catch(() => 'Unknown') : 'Unknown';
                        }

                        vendors.push({
                            name: finalName,
                            phone: phones[0],
                            category: analysis.category,
                            city: analysis.city,
                            source_url: groupUrl,
                            description: analysis.description || text.slice(0, 500),
                        });
                    } else {
                        console.log(`❌ Мусор`);
                    }
                }
            }

            console.log(`    → Новых: ${newPostsCount}`);

            if (newPostsCount === 0 && scrollCount > 10) { // Даем шанс прогрузиться в начале
                // Если 3 раза подряд по 0, то выходим (тут упрощено до 1 но можно усложнить)
                // Но Facebook может долго грузить, поэтому просто подождем подольше
                console.log(`    ⏳ Ждем подгрузки...`);
                await page.waitForTimeout(5000);
            }

        } catch (e) {
            console.error(`  ⚠️ Ошибка: ${e.message}`);
        }

        // === Человеческое поведение ===

        // 1. Рандомная дистанция скролла (0.8 - 1.5 экрана)
        const scrollDistance = await page.evaluate(() => window.innerHeight * (0.8 + Math.random() * 0.7));
        await page.evaluate((dist) => window.scrollBy(0, dist), scrollDistance);

        // 2. Рандомная задержка (2-5 сек)
        const delay = 2000 + Math.random() * 3000;
        await page.waitForTimeout(delay);

        // 3. Отдых каждые 20 скроллов
        if (scrollCount > 0 && scrollCount % 20 === 0) {
            const longPause = 10000 + Math.random() * 10000;
            console.log(`  ☕️ Пауза на отдых (${Math.round(longPause / 1000)} сек)...`);
            await page.waitForTimeout(longPause);
        }

        scrollCount++;
    }

    // Сохраняем ВСЕ найденные номера в отдельный файл
    if (allFoundNumbers.length > 0) {
        // Создаем папку если нет
        if (!fs.existsSync('./scraped_data')) {
            fs.mkdirSync('./scraped_data');
        }
        const logPath = `./scraped_data/all_numbers_${Date.now()}.json`;
        fs.writeFileSync(logPath, JSON.stringify(allFoundNumbers, null, 2));
        console.log(`\n📋 Все найденные номера: ${logPath}`);
    }

    return vendors;
}

async function saveToSupabase(vendors) {
    console.log(`\n💾 Сохраняем ${vendors.length} подтвержденных вендоров...`);

    for (const vendor of vendors) {
        const { data: existing } = await supabase
            .from('pending_vendors')
            .select('id')
            .eq('phone', vendor.phone)
            .single();

        if (existing) {
            console.log(`  ⏭️  ${vendor.name} уже есть в базе`);
            continue;
        }

        const { error } = await supabase
            .from('pending_vendors')
            .insert({
                name: vendor.name,
                phone: vendor.phone,
                category: vendor.category,
                city: vendor.city,
                description: vendor.description,
                source_type: 'facebook',
                source_url: vendor.source_url,
                status: 'pending',
                confirmation_token: crypto.randomUUID(),
            });

        if (error) {
            console.error(`  ❌ Ошибка БД: ${error.message} (Телефон: ${vendor.phone})`);
        } else {
            console.log(`  ✅ Сохранен: ${vendor.name}`);
        }
    }
}

async function main() {
    console.log('🦞 Facebook AI Scraper v2.0\n');
    console.log('1. Откроется Chrome');
    console.log('2. Залогинься вручную');
    console.log('3. Нажми Enter в терминале');

    const browser = await chromium.launch({
        headless: false,
        args: ['--disable-notifications']
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    try {
        await page.goto('https://www.facebook.com/');

        console.log('\n⏳ Жду логина... Нажми Enter когда будешь готов.');
        await new Promise(resolve => process.stdin.once('data', resolve));

        console.log('\n🚀 Поехали! AI фильтрация включена.\n');

        const allVendors = [];

        for (const groupUrl of TARGET_GROUPS) {
            const vendors = await scrapeGroup(page, groupUrl);
            allVendors.push(...vendors);
        }

        console.log(`\n📈 Итого найдено: ${allVendors.length} целевых вендоров.`);

        if (allVendors.length > 0) {
            await saveToSupabase(allVendors);
        }

        console.log('\n✅ Работа завершена.');

    } catch (error) {
        console.error('❌ Критическая ошибка:', error);
    } finally {
        await browser.close();
    }
}

main();
