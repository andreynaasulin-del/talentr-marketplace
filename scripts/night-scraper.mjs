import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ВСЕ группы для скрапинга
let TARGET_GROUPS = [
    // Старые группы
    'https://www.facebook.com/groups/1685622221742451',
    'https://www.facebook.com/groups/673174389991885',
    'https://www.facebook.com/groups/293555797750114',
    'https://www.facebook.com/groups/277964673341557',
    // Новые группы
    'https://www.facebook.com/share/g/17Deepgxns/',
    'https://www.facebook.com/share/g/1aDzQQFHdD/',
    'https://www.facebook.com/share/g/18CpYYXFa4/',
    'https://www.facebook.com/share/g/184T84ZTVJ/',
    'https://www.facebook.com/share/g/16wevHLdnU/',
];

// Добавляем свеженайденные группы
const DISCOVERED_FILE = './scraped_data/discovered_groups.json';
if (fs.existsSync(DISCOVERED_FILE)) {
    try {
        const discovered = JSON.parse(fs.readFileSync(DISCOVERED_FILE, 'utf-8'));
        TARGET_GROUPS = Array.from(new Set([...TARGET_GROUPS, ...discovered]));
        console.log(`📡 Загружено ${discovered.length} новых групп из автопоиска`);
    } catch (e) {
        console.log(`⚠️ Ошибка загрузки найденных групп: ${e.message}`);
    }
}

const PHONE_PATTERNS = [
    /05\d{1}[-\s]?\d{3}[-\s]?\d{4}/g,
    /05\d{1}[-\s]?\d{7}/g,
    /\+972[-\s]?5\d{1}[-\s]?\d{3}[-\s]?\d{4}/g,
    /972[-\s]?5\d{1}[-\s]?\d{7}/g,
];

const MAX_SCROLLS_PER_GROUP = 800; // ОЧЕНЬ ГЛУБОКИЙ СКРАПИНГ (~10-20 дней)
const SCROLL_DELAY_MIN = 800; // БЫСТРЕЕ (было 2000)
const SCROLL_DELAY_MAX = 2000; // БЫСТРЕЕ (было 5000)
const OUTPUT_FILE = './scraped_data/night_scrape_results.json';
const TARGET_LEADS = 1500; // Цель больше
const MAX_ROUNDS = 5; // Меньше раундов, но ГЛУБЖЕ каждый раз

let allResults = [];
let processedPosts = new Set();
let processedPhones = new Set();

function log(msg) {
    const time = new Date().toISOString();
    console.log(`[${time}] ${msg}`);
    fs.appendFileSync('./scraped_data/night_scrape_log.txt', `[${time}] ${msg}\n`);
}

function extractPhones(text) {
    const phones = new Set();
    for (const pattern of PHONE_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(phone => {
                let normalized = phone.replace(/[-\s]/g, '');
                if (normalized.startsWith('+972')) {
                    normalized = '0' + normalized.slice(4);
                } else if (normalized.startsWith('972')) {
                    normalized = '0' + normalized.slice(3);
                }
                if (normalized.length === 10 && normalized.startsWith('05')) {
                    phones.add(normalized);
                }
            });
        }
    }
    return Array.from(phones);
}

async function analyzeWithAI(text) {
    if (!text || text.length < 20) return null;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You filter TALENT for events in Israel.

✅ ACCEPT:
- DJ / דיג'יי
- MC / Host / מנחה / ведущий
- Comedian / קומיקאי / סטנדאפיסט
- Musician / מוזיקאי / נגן
- Singer / זמר / זמרת
- Makeup Artist / מאפרת
- Dancer / רקדנית / רקדן
- Magician / קוסם
- Photographer / צלם
- Videographer / צלם וידאו
- Caricaturist / קריקטוריסט
- Balloon Artist / אמן בלונים (only if talent/performance)
- Fire Show / מופע אש
- Circus / קרקס
- Virtual Reality / VR / עמדות מולטימדיה

❌ REJECT:
- Equipment rental / השכרת ציוד
- Decorators / עיצוב / בלונים
- Event Planners / הפקות
- Caterers / קייטרינג
- Technicians / טכנאי / הגברה / תאורה
- Venues / אולמות
- People LOOKING for services
- People SELLING equipment

Return JSON:
{
    "is_talent": boolean,
    "category": "DJ/MC/Musician/Singer/Makeup/Dancer/Magician/Photographer/Videographer/Performance/Other",
    "confidence": 0-100
}`
                },
                { role: 'user', content: text.slice(0, 500) }
            ],
            max_tokens: 100,
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (e) {
        log(`AI Error: ${e.message}`);
        return null;
    }
}

function saveResults() {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allResults, null, 2));
    log(`💾 Saved ${allResults.length} results to ${OUTPUT_FILE}`);
}

async function scrapeGroup(page, groupUrl) {
    log(`\n🔗 Opening group: ${groupUrl}`);

    try {
        await page.goto(groupUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000);
    } catch (e) {
        log(`❌ Failed to load group: ${e.message}`);
        return;
    }

    let scrollCount = 0;
    let noNewPostsCount = 0;
    let groupPhones = 0;

    while (scrollCount < MAX_SCROLLS_PER_GROUP && noNewPostsCount < 10) {
        try {
            // Получаем все посты
            const posts = await page.$$('div[data-ad-preview="message"]');
            let foundNew = false;

            for (const post of posts) {
                try {
                    const text = await post.textContent();
                    if (!text || text.length < 10) continue;

                    const postHash = text.slice(0, 100);
                    if (processedPosts.has(postHash)) continue;
                    processedPosts.add(postHash);
                    foundNew = true;

                    // Ищем телефоны в посте
                    const phones = extractPhones(text);

                    // Также парсим комментарии
                    const commentPhones = await parseComments(page, post);
                    phones.push(...commentPhones);

                    for (const phone of phones) {
                        if (processedPhones.has(phone)) continue;
                        processedPhones.add(phone);

                        // AI анализ
                        const analysis = await analyzeWithAI(text);

                        if (analysis && analysis.is_talent && analysis.confidence > 50) {
                            const result = {
                                phone,
                                category: analysis.category,
                                confidence: analysis.confidence,
                                text: text.slice(0, 200),
                                source: groupUrl,
                                timestamp: new Date().toISOString()
                            };

                            allResults.push(result);
                            groupPhones++;
                            log(`✅ [${allResults.length}] ${phone} - ${analysis.category} (${analysis.confidence}%)`);

                            // Сохраняем каждые 10 новых результатов
                            if (allResults.length % 10 === 0) {
                                saveResults();
                            }
                        } else {
                            log(`⏭️ Skipped: ${phone} (not talent or low confidence)`);
                        }
                    }
                } catch (e) {
                    // Ignore individual post errors
                }
            }

            if (!foundNew) {
                noNewPostsCount++;
            } else {
                noNewPostsCount = 0;
            }

            // Human-like scroll
            const scrollDistance = 500 + Math.random() * 1000;
            await page.evaluate((dist) => window.scrollBy(0, dist), scrollDistance);

            const delay = SCROLL_DELAY_MIN + Math.random() * (SCROLL_DELAY_MAX - SCROLL_DELAY_MIN);
            await page.waitForTimeout(delay);

            scrollCount++;

            if (scrollCount % 20 === 0) {
                log(`📜 Scrolled ${scrollCount}/${MAX_SCROLLS_PER_GROUP} in ${groupUrl.split('/').pop()}`);
            }

        } catch (e) {
            log(`⚠️ Scroll error: ${e.message}`);
            await page.waitForTimeout(5000);
        }
    }

    log(`✅ Group done: ${groupPhones} phones from ${groupUrl.split('/').pop()}`);
}

async function parseComments(page, postElement) {
    const phones = [];

    try {
        // Пробуем найти и кликнуть "View more comments"
        const viewMoreButtons = await postElement.$$('text="View more comments"');
        for (const btn of viewMoreButtons.slice(0, 2)) {
            try {
                await btn.click();
                await page.waitForTimeout(1000);
            } catch (e) { }
        }

        // Получаем все комментарии в посте
        const comments = await postElement.$$('div[dir="auto"]');
        for (const comment of comments) {
            try {
                const commentText = await comment.textContent();
                if (commentText) {
                    const commentPhones = extractPhones(commentText);
                    phones.push(...commentPhones);
                }
            } catch (e) { }
        }
    } catch (e) {
        // Ignore comment parsing errors
    }

    return phones;
}

async function main() {
    log('\n🚀 Starting night scrape session...');
    log(`📁 Output file: ${OUTPUT_FILE}`);
    log(`📋 Groups to scrape: ${TARGET_GROUPS.length}`);

    // Создаем папку если нет
    if (!fs.existsSync('./scraped_data')) {
        fs.mkdirSync('./scraped_data');
    }

    // Загружаем предыдущие результаты если есть
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            allResults = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            allResults.forEach(r => processedPhones.add(r.phone));
            log(`📂 Loaded ${allResults.length} existing results`);
        } catch (e) {
            allResults = [];
        }
    }

    const browser = await chromium.launchPersistentContext(
        './browser_data',
        {
            headless: false,
            viewport: { width: 1400, height: 900 },
            locale: 'he-IL',
        }
    );

    const page = await browser.newPage();

    // Проверяем логин
    await page.goto('https://www.facebook.com', { timeout: 30000 });
    await page.waitForTimeout(3000);

    const isLoggedIn = await page.locator('div[role="navigation"]').count() > 0;

    if (!isLoggedIn) {
        log('⚠️ Not logged in! Please login to Facebook manually...');
        await page.waitForTimeout(120000); // 2 минуты на логин
    }

    log('✅ Facebook session ready\n');

    // Скрапим все группы в цикле
    let round = 1;

    while (round <= MAX_ROUNDS && allResults.length < TARGET_LEADS) {
        log(`\n📍 ROUND ${round}/${MAX_ROUNDS} | Current: ${allResults.length}/${TARGET_LEADS}`);

        for (const groupUrl of TARGET_GROUPS) {
            await scrapeGroup(page, groupUrl);

            // Пауза между группами
            const pauseTime = 10000 + Math.random() * 20000;
            log(`⏸️ Pause ${Math.round(pauseTime / 1000)}s before next group...`);
            await page.waitForTimeout(pauseTime);

            // Проверяем цель
            if (allResults.length >= TARGET_LEADS) {
                log(`🎯 Target reached: ${allResults.length} results!`);
                break;
            }
        }

        round++;

        // Большая пауза между раундами
        if (round <= MAX_ROUNDS && allResults.length < TARGET_LEADS) {
            const bigPause = 60000 + Math.random() * 120000; // 1-3 мин
            log(`\n😴 Big pause: ${Math.round(bigPause / 60000)} min before round ${round}...`);
            await page.waitForTimeout(bigPause);
        }
    }

    saveResults();
    log(`\n🏁 FINISHED! Total: ${allResults.length} unique phones`);

    await browser.close();
}

main().catch(e => {
    log(`❌ FATAL ERROR: ${e.message}`);
    saveResults();
});
