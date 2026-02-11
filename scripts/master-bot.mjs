import { execSync } from 'child_process';
import fs from 'fs';

function runStep(name, command) {
    console.log(`\n🚀 [MASTER] Запускаю: ${name}`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (e) {
        console.error(`❌ [MASTER] Ошибка в шаге ${name}: ${e.message}`);
    }
}

async function main() {
    console.log('🤖 СИСТЕМА АВТОНОМНОГО СКРАПИНГА ЗАПУЩЕНА');

    while (true) {
        // Шаг 1: Ищем новые группы
        runStep('Discovery', 'node scripts/discover-groups.mjs');

        // Шаг 2: Скрапим найденные группы
        runStep('Scraper', 'node scripts/night-scraper.mjs');

        // Шаг 3: Синхронизируем в БД
        runStep('Sync', 'node scripts/sync-to-db.mjs');

        console.log('\n😴 Цикл завершен. Отдыхаем 10 минут и начинаем заново...');
        await new Promise(resolve => setTimeout(resolve, 600000));
    }
}

main().catch(console.error);
