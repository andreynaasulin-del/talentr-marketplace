import fs from 'fs';

async function exportToText() {
    console.log('📦 Экспорт найденных контактов в TXT...\n');

    if (!fs.existsSync('./scraped_data')) {
        console.error('❌ Папка scraped_data пуста');
        return;
    }

    const files = fs.readdirSync('./scraped_data').filter(f => f.startsWith('all_numbers_') && f.endsWith('.json'));

    let allContacts = [];

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(`./scraped_data/${file}`, 'utf-8'));
        allContacts = allContacts.concat(data);
    }

    // Убираем дубликаты по телефону
    const uniqueContacts = new Map();
    allContacts.forEach(c => {
        if (!uniqueContacts.has(c.phone)) {
            uniqueContacts.set(c.phone, c);
        }
    });

    console.log(`🔍 Найдено всего записей: ${allContacts.length}`);
    console.log(`✨ Уникальных номеров: ${uniqueContacts.size}\n`);

    const outputContent = Array.from(uniqueContacts.values())
        .map(c => `----------------------------------------
Телефон: ${c.phone}
Источник: ${c.source}
Текст: ${c.text.replace(/\n/g, ' ')}
----------------------------------------`)
        .join('\n');

    fs.writeFileSync('SCRAIPED_RESULTS.txt', outputContent);
    console.log('✅ Результаты сохранены в файл: SCRAIPED_RESULTS.txt');
}

exportToText();
