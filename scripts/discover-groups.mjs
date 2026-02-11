import { chromium } from 'playwright';
import fs from 'fs';

async function discoverGroups() {
    console.log('🔍 Запускаю поиск новых групп в Facebook...');

    const context = await chromium.launchPersistentContext(
        './browser_data',
        {
            headless: false,
            viewport: { width: 1280, height: 800 },
        }
    );

    const page = await context.newPage();
    const keywords = [
        'ספקים לאירועים',
        'דיג\'יי לאירועים',
        'צלמים לחתונה',
        'מוזיקה לאירועים',
        'מאפרות מקצועיות',
        'חתונה ישראל',
        'הפקת אירועים',
        'ציוד לאиרועים',
        'בר/בת מצווה ספקים',
        'אטרקציות לאירועים',
        'חינה ספקים',
        'מנחים לאירועים'
    ];

    const foundGroups = new Set();

    for (const kw of keywords) {
        console.log(`🔎 Ищу по запросу: ${kw}`);
        try {
            await page.goto(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(kw)}`);
            await page.waitForTimeout(5000);

            // Прокрутим немного вниз
            for (let i = 0; i < 5; i++) {
                await page.evaluate(() => window.scrollBy(0, 800));
                await page.waitForTimeout(2000);
            }

            const links = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a[href*="/groups/"]'));
                return anchors.map(a => {
                    const match = a.href.match(/facebook\.com\/groups\/[^\/\?]+/);
                    return match ? match[0] : null;
                }).filter(Boolean);
            });

            links.forEach(link => {
                if (link.includes('/groups/')) {
                    const fullLink = link.startsWith('http') ? link : `https://${link}`;
                    foundGroups.add(fullLink);
                }
            });

            console.log(`✅ Найдено ${links.length} потенциальных групп`);

        } catch (e) {
            console.log(`⚠️ Ошибка поиска для "${kw}": ${e.message}`);
        }
    }

    const groupList = Array.from(foundGroups);
    fs.writeFileSync('./scraped_data/discovered_groups.json', JSON.stringify(groupList, null, 2));
    console.log(`\n🎉 Сбор завершен! Всего найдено уникальных групп: ${groupList.length}`);

    await context.close();
}

discoverGroups().catch(console.error);
