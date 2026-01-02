export type MoodTag = 'fun' | 'chill' | 'romantic' | 'wow' | 'artsy';

export interface GigPackage {
    id: string;
    title: { en: string; he: string; ru: string };
    subtitle: { en: string; he: string; ru: string };
    moodTags: MoodTag[];
    emoji: string;
    duration: string;
    priceHint: string;
    image: string;
}

// Micro-entertainment “ready-to-go” sets
export const gigPackages: GigPackage[] = [
    {
        id: 'pkg-1',
        title: { en: 'Balcony Street-Art', he: 'סטריט ארט במרפסת', ru: 'Стрит-арт на балконе' },
        subtitle: { en: 'Spray live mural with your story', he: 'גרפיטי לייב עם הסיפור שלכם', ru: 'Живой граффити под вашу историю' },
        moodTags: ['artsy', 'wow'],
        emoji: '🎨',
        duration: '45m',
        priceHint: 'from ₪300',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-2',
        title: { en: 'Romantic Acoustic', he: 'אקוסטי רומנטי', ru: 'Романтический акустик' },
        subtitle: { en: 'For two · candle vibe', he: 'לשניים · אווירת נרות', ru: 'Для двоих · свечи и гитара' },
        moodTags: ['romantic', 'chill'],
        emoji: '🎸',
        duration: '40m',
        priceHint: 'from ₪320',
        image: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-3',
        title: { en: 'Standup for 2–4', he: 'סטנדאפ זוגי/חברים', ru: 'Стендап для двоих/четырёх' },
        subtitle: { en: 'Private comedy shot', he: 'שוט קומי פרטי', ru: 'Приватный мини-стендап' },
        moodTags: ['fun'],
        emoji: '😂',
        duration: '25m',
        priceHint: 'from ₪250',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-4',
        title: { en: 'Loft DJ Mini-set', he: 'סט דיג׳יי לופט', ru: 'DJ мини-сет в лофте' },
        subtitle: { en: 'House/90s/indie — you pick', he: 'האוס/ניינטיז/אינדי לבחירתך', ru: 'Хаус/90е/инди — выбирай' },
        moodTags: ['fun', 'wow'],
        emoji: '🎧',
        duration: '35m',
        priceHint: 'from ₪380',
        image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-5',
        title: { en: 'Focus & Chill Yoga + Live', he: 'יוגה + לייב צ׳יל', ru: 'Йога + лайв чилл' },
        subtitle: { en: 'Instructor + live guitar pad', he: 'מדריכה + גיטרה לייב', ru: 'Инструктор + лайв гитара' },
        moodTags: ['chill', 'romantic'],
        emoji: '🧘‍♂️',
        duration: '50m',
        priceHint: 'from ₪340',
        image: 'https://images.unsplash.com/photo-1554344058-8d1d1bc07a26?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-6',
        title: { en: 'Interactive Magic', he: 'קסמים אינטראקטיביים', ru: 'Интерактивная магия' },
        subtitle: { en: 'Close-up tricks for friends', he: 'קלוז-אפ לחברים', ru: 'Клоуз-ап для компании' },
        moodTags: ['wow', 'fun'],
        emoji: '🎩',
        duration: '30m',
        priceHint: 'from ₪290',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-7',
        title: { en: 'Sound Bath + Handpan', he: 'סאונד באת׳ והנדפאן', ru: 'Саунд-батх и хэндпан' },
        subtitle: { en: 'Deep relax session', he: 'סשן רילקס עמוק', ru: 'Глубокий релакс' },
        moodTags: ['chill', 'artsy'],
        emoji: '🔮',
        duration: '40m',
        priceHint: 'from ₪360',
        image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-8',
        title: { en: 'Street Music Pop-up', he: 'פופ-אפ מוזיקה ברחוב', ru: 'Стрит-попап музыки' },
        subtitle: { en: 'Mini concert by your window', he: 'מיני הופעה מתחת לחלון', ru: 'Мини-концерт под окном' },
        moodTags: ['wow', 'fun'],
        emoji: '🎺',
        duration: '20m',
        priceHint: 'from ₪220',
        image: 'https://images.unsplash.com/photo-1454922915609-78549ad709bb?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-9',
        title: { en: 'Indie Storyteller', he: 'אינדי סטוריטלר', ru: 'Инди-сторителлер' },
        subtitle: { en: 'Songs + stories tailored to you', he: 'שירים + סיפורים עליך', ru: 'Песни и истории под вас' },
        moodTags: ['romantic', 'artsy'],
        emoji: '📖',
        duration: '35m',
        priceHint: 'from ₪300',
        image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-10',
        title: { en: 'Balcony Barista Jam', he: 'באלקוני קפה לייב', ru: 'Балконный бариста-джем' },
        subtitle: { en: 'Latte art + chill beats', he: 'לאטה ארט + ביטים צ׳יל', ru: 'Латте-арт + чилл биты' },
        moodTags: ['chill', 'fun'],
        emoji: '☕️',
        duration: '30m',
        priceHint: 'from ₪240',
        image: 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-11',
        title: { en: '90s Guitar Flashback', he: 'גיטרת ניינטיז', ru: 'Гитарный флэшбек 90-х' },
        subtitle: { en: 'Sing-along hits on demand', he: 'להיטי ניינטיז לשירה', ru: 'Хиты 90-х под подпев' },
        moodTags: ['fun', 'romantic'],
        emoji: '🎤',
        duration: '30m',
        priceHint: 'from ₪260',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-12',
        title: { en: 'Silent Disco Duo', he: 'סיילנט דיסקו זוגי', ru: 'Сайлент-диско для двоих' },
        subtitle: { en: 'Two headsets · curated playlist', he: '2 אוזניות · פלייליסט אוצר', ru: '2 наушника · плейлист-кьюрейшн' },
        moodTags: ['fun', 'romantic'],
        emoji: '🎧',
        duration: '30m',
        priceHint: 'from ₪280',
        image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-13',
        title: { en: 'Street Chef Tapas', he: 'שף סטריט טאפס', ru: 'Стрит-тапас шеф' },
        subtitle: { en: '5 bites + live plating', he: '5 ביסים + פלייטינג לייב', ru: '5 тапасов + лайв подача' },
        moodTags: ['wow', 'fun'],
        emoji: '🍣',
        duration: '35m',
        priceHint: 'from ₪420',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-14',
        title: { en: 'Balcony Sax Sunset', he: 'סקסופון שקיעה במרפסת', ru: 'Закатный сакс на балконе' },
        subtitle: { en: 'Jazz/lofi set for two', he: 'ג׳אז/לופי לזוג', ru: 'Джаз/лоуфай сет для двоих' },
        moodTags: ['romantic', 'chill'],
        emoji: '🎷',
        duration: '30m',
        priceHint: 'from ₪330',
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-15',
        title: { en: 'Photo-Meme Session', he: 'סשן ממים אישי', ru: 'Фотомем-сессия' },
        subtitle: { en: 'Photographer + meme captions', he: 'צלם + כותרות מם', ru: 'Фотограф + мем-подписи' },
        moodTags: ['fun', 'artsy'],
        emoji: '📸',
        duration: '25m',
        priceHint: 'from ₪210',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-16',
        title: { en: 'Handpoke Micro Tattoo', he: 'טאטו מיקרו הנדפוק', ru: 'Микро-тату хэндпоук' },
        subtitle: { en: 'Tiny line art on balcony', he: 'ליינארט זעיר במרפסת', ru: 'Мини тату на балконе' },
        moodTags: ['artsy', 'wow'],
        emoji: '🖋️',
        duration: '30m',
        priceHint: 'from ₪350',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-17',
        title: { en: 'Micro Karaoke Battle', he: 'קריוקי מיקרו בטל', ru: 'Микро караоке-баттл' },
        subtitle: { en: 'Host + judge + sound', he: 'מנחה + שופט + סאונד', ru: 'Хост + судья + звук' },
        moodTags: ['fun'],
        emoji: '🎤',
        duration: '25m',
        priceHint: 'from ₪230',
        image: 'https://images.unsplash.com/photo-1438557068880-c5f474830377?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-18',
        title: { en: 'Live Cartoonist', he: 'קריקטוריסט לייב', ru: 'Карикатурист лайв' },
        subtitle: { en: 'Fast funny sketches of you', he: 'סקיצות מהירות שלכם', ru: 'Скорые скетчи гостей' },
        moodTags: ['fun', 'artsy'],
        emoji: '✏️',
        duration: '30m',
        priceHint: 'from ₪240',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-19',
        title: { en: 'Pocket Fire Show', he: 'פוקט פייר שואו', ru: 'Покет фаер-шоу' },
        subtitle: { en: 'Compact outdoor wow', he: 'וואו קומפקטי בחוץ', ru: 'Компактное уличное шоу' },
        moodTags: ['wow'],
        emoji: '🔥',
        duration: '20m',
        priceHint: 'from ₪300',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-20',
        title: { en: 'Emoji Surprise Box', he: 'תיבת אמוג׳י הפתעה', ru: 'Эмодзи-сюрприз' },
        subtitle: { en: 'Bot picks random thrill', he: 'הבוט בוחר הפתעה כיפית', ru: 'Бот выберет рандомный кайф' },
        moodTags: ['fun', 'wow', 'chill', 'romantic', 'artsy'],
        emoji: '🎁',
        duration: 'random',
        priceHint: 'mystery',
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500&h=500&fit=crop&q=80'
    },
];

export function pickPackages(tags: MoodTag[], limit = 3): GigPackage[] {
    const pool = gigPackages.filter(pkg => pkg.moodTags.some(tag => tags.includes(tag)));
    const source = pool.length > 0 ? pool : gigPackages;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
}

