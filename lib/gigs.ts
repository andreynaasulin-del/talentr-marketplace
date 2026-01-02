export type MoodTag = 'fun' | 'chill' | 'romantic' | 'wow' | 'artsy';

export interface GigPackage {
    id: string;
    title: { en: string; he: string };
    subtitle: { en: string; he: string };
    moodTags: MoodTag[];
    emoji: string;
    duration: string;
    image: string;
}

// Micro-entertainment “ready-to-go” sets
export const gigPackages: GigPackage[] = [
    {
        id: 'pkg-1',
        title: { en: 'Balcony Street-Art', he: 'סטריט ארט במרפסת' },
        subtitle: { en: 'Live mural — your vibe on the wall', he: 'ציור לייב — הווייב שלכם על הקיר' },
        moodTags: ['artsy', 'wow'],
        emoji: '🎨',
        duration: '45m',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-2',
        title: { en: 'Romantic Acoustic', he: 'אקוסטי רומנטי' },
        subtitle: { en: 'For two · candle vibe', he: 'לשניים · אווירת נרות' },
        moodTags: ['romantic', 'chill'],
        emoji: '🎸',
        duration: '40m',
        image: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-3',
        title: { en: 'Standup for 2–4', he: 'סטנדאפ לזוג/חברים' },
        subtitle: { en: 'A private comedy shot', he: 'שוט קומי פרטי' },
        moodTags: ['fun'],
        emoji: '😂',
        duration: '25m',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-4',
        title: { en: 'Loft DJ Mini-set', he: 'סט דיג׳יי לופט' },
        subtitle: { en: 'House / 90s / indie — you pick', he: 'האוס / ניינטיז / אינדי — אתם בוחרים' },
        moodTags: ['fun', 'wow'],
        emoji: '🎧',
        duration: '35m',
        image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-5',
        title: { en: 'Yoga + Live Music', he: 'יוגה + מוזיקה לייב' },
        subtitle: { en: 'Instructor + live guitar pad', he: 'מדריכה + גיטרה לייב' },
        moodTags: ['chill', 'romantic'],
        emoji: '🧘‍♂️',
        duration: '50m',
        image: 'https://images.unsplash.com/photo-1554344058-8d1d1bc07a26?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-6',
        title: { en: 'Interactive Magic', he: 'קסמים אינטראקטיביים' },
        subtitle: { en: 'Close-up tricks for friends', he: 'קלוז-אפ לחברים' },
        moodTags: ['wow', 'fun'],
        emoji: '🎩',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-7',
        title: { en: 'Sound Bath + Handpan', he: 'סאונד באת׳ והנדפאן' },
        subtitle: { en: 'Deep relax session', he: 'סשן רילקס עמוק' },
        moodTags: ['chill', 'artsy'],
        emoji: '🔮',
        duration: '40m',
        image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-8',
        title: { en: 'Street Music Pop-up', he: 'פופ-אפ מוזיקה ברחוב' },
        subtitle: { en: 'Mini concert by your window', he: 'מיני הופעה מתחת לחלון' },
        moodTags: ['wow', 'fun'],
        emoji: '🎺',
        duration: '20m',
        image: 'https://images.unsplash.com/photo-1454922915609-78549ad709bb?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-9',
        title: { en: 'Indie Storyteller', he: 'אינדי סטוריטלר' },
        subtitle: { en: 'Songs + stories tailored to you', he: 'שירים + סיפורים עליכם' },
        moodTags: ['romantic', 'artsy'],
        emoji: '📖',
        duration: '35m',
        image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-10',
        title: { en: 'Balcony Barista Jam', he: 'קפה לייב במרפסת' },
        subtitle: { en: 'Latte art + chill beats', he: 'לאטה ארט + ביטים צ׳יל' },
        moodTags: ['chill', 'fun'],
        emoji: '☕️',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-11',
        title: { en: '90s Guitar Flashback', he: 'גיטרת ניינטיז' },
        subtitle: { en: 'Sing-along hits on demand', he: 'להיטים לשירה ביחד' },
        moodTags: ['fun', 'romantic'],
        emoji: '🎤',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-12',
        title: { en: 'Silent Disco Duo', he: 'סיילנט דיסקו לזוג' },
        subtitle: { en: 'Two headsets · curated playlist', he: '2 אוזניות · פלייליסט מדויק' },
        moodTags: ['fun', 'romantic'],
        emoji: '🎧',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-13',
        title: { en: 'Sushi Chef', he: 'שף סושי' },
        subtitle: { en: 'So everyone leaves happy', he: 'כדי שכולם יצאו מרוצים' },
        moodTags: ['wow', 'fun'],
        emoji: '🍣',
        duration: '35m',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-14',
        title: { en: 'Balcony Sax Sunset', he: 'סקסופון בשקיעה' },
        subtitle: { en: 'Jazz / lo-fi set for two', he: 'ג׳אז / לופי לזוג' },
        moodTags: ['romantic', 'chill'],
        emoji: '🎷',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-15',
        title: { en: 'Photo-Meme Session', he: 'סשן ממים אישי' },
        subtitle: { en: 'Photos + meme captions', he: 'תמונות + כותרות מם' },
        moodTags: ['fun', 'artsy'],
        emoji: '📸',
        duration: '25m',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-16',
        title: { en: 'Micro Tattoo (Line Art)', he: 'מיקרו טאטו (ליינארט)' },
        subtitle: { en: 'Tiny line art at home', he: 'ליינארט זעיר בבית' },
        moodTags: ['artsy', 'wow'],
        emoji: '🖋️',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-17',
        title: { en: 'Micro Karaoke Battle', he: 'קריוקי מיקרו' },
        subtitle: { en: 'Host + sound — instant fun', he: 'מנחה + סאונד — כיף מיידי' },
        moodTags: ['fun'],
        emoji: '🎤',
        duration: '25m',
        image: 'https://images.unsplash.com/photo-1438557068880-c5f474830377?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-18',
        title: { en: 'Live Cartoonist', he: 'קריקטוריסט לייב' },
        subtitle: { en: 'Fast funny sketches of you', he: 'סקיצות מצחיקות ומהירות' },
        moodTags: ['fun', 'artsy'],
        emoji: '✏️',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-19',
        title: { en: 'Pocket Fire Show', he: 'פוקט פייר שואו' },
        subtitle: { en: 'Compact outdoor wow', he: 'וואו קומפקטי בחוץ' },
        moodTags: ['wow'],
        emoji: '🔥',
        duration: '20m',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-20',
        title: { en: 'Emoji Surprise Box', he: 'תיבת אמוג׳י הפתעה' },
        subtitle: { en: 'I’ll pick a random thrill', he: 'אני אבחר לכם הפתעה' },
        moodTags: ['fun', 'wow', 'chill', 'romantic', 'artsy'],
        emoji: '🎁',
        duration: 'random',
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500&h=500&fit=crop&q=80'
    },
];

export function pickPackages(tags: MoodTag[], limit = 3): GigPackage[] {
    const pool = gigPackages.filter(pkg => pkg.moodTags.some(tag => tags.includes(tag)));
    const source = pool.length > 0 ? pool : gigPackages;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
}

