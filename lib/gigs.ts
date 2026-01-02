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

export const gigPackages: GigPackage[] = [
    // FUN
    {
        id: 'pkg-1',
        title: { en: 'Living Room Comedy', he: 'סטנדאפ בסלון' },
        subtitle: { en: 'Private standup just for your crew', he: 'קומיקאי רק לחבורה שלכם' },
        moodTags: ['fun', 'wow'],
        emoji: '😂',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-2',
        title: { en: 'Karaoke Party', he: 'ערב קריוקי' },
        subtitle: { en: 'Pro DJ + endless hits', he: "דיג'יי + להיטים אינסופיים" },
        moodTags: ['fun'],
        emoji: '🎤',
        duration: '2h',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=500&fit=crop&q=80'
    },
    
    // CHILL
    {
        id: 'pkg-3',
        title: { en: 'Balcony Acoustic', he: 'אקוסטי במרפסת' },
        subtitle: { en: 'Sunset vibes with live guitar', he: 'וייבס שקיעה עם גיטרה חיה' },
        moodTags: ['chill', 'romantic'],
        emoji: '🎸',
        duration: '60m',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-4',
        title: { en: 'Sound Healing', he: 'ריפוי בצלילים' },
        subtitle: { en: 'Deep relaxation journey', he: 'מסע הרפיה עמוק' },
        moodTags: ['chill'],
        emoji: '🧘',
        duration: '45m',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-5',
        title: { en: 'Jazz Night In', he: 'ערב ג׳אז בבית' },
        subtitle: { en: 'Smooth trio for intimate vibes', he: 'טריו חלק לוייבס אינטימי' },
        moodTags: ['chill', 'romantic'],
        emoji: '🎷',
        duration: '90m',
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&h=500&fit=crop&q=80'
    },

    // ROMANTIC
    {
        id: 'pkg-6',
        title: { en: 'Candlelight Serenade', he: 'סרנדה לאור נרות' },
        subtitle: { en: 'Singer + roses at your door', he: 'זמר + ורדים בדלת שלך' },
        moodTags: ['romantic'],
        emoji: '🌹',
        duration: '20m',
        image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-7',
        title: { en: 'Private Chef Date', he: 'שף פרטי לדייט' },
        subtitle: { en: '5-course dinner at home', he: 'ארוחת 5 מנות בבית' },
        moodTags: ['romantic', 'wow'],
        emoji: '👨‍🍳',
        duration: '2h',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=500&fit=crop&q=80'
    },

    // WOW
    {
        id: 'pkg-8',
        title: { en: 'Close-Up Magic', he: 'קסמים מקרוב' },
        subtitle: { en: 'Mind-blowing table tricks', he: 'טריקים מדהימים על השולחן' },
        moodTags: ['wow', 'fun'],
        emoji: '✨',
        duration: '40m',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-9',
        title: { en: 'Fire Show', he: 'מופע אש' },
        subtitle: { en: 'Epic flames for your party', he: 'להבות אפיות למסיבה שלך' },
        moodTags: ['wow'],
        emoji: '🔥',
        duration: '15m',
        image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-10',
        title: { en: 'Cocktail Show', he: 'מופע קוקטיילים' },
        subtitle: { en: 'Flair bartender + 10 drinks', he: 'ברמן פליר + 10 משקאות' },
        moodTags: ['wow', 'fun'],
        emoji: '🍸',
        duration: '60m',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=500&fit=crop&q=80'
    },

    // ARTSY
    {
        id: 'pkg-11',
        title: { en: 'Balcony Street Art', he: 'סטריט ארט במרפסת' },
        subtitle: { en: 'Live mural with your story', he: 'ציור קיר לייב עם הסיפור שלכם' },
        moodTags: ['artsy', 'wow'],
        emoji: '🎨',
        duration: '90m',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-12',
        title: { en: 'Sushi Masterclass', he: 'סדנת סושי' },
        subtitle: { en: 'Roll with a pro chef', he: 'גלגול עם שף מקצועי' },
        moodTags: ['artsy', 'fun'],
        emoji: '🍣',
        duration: '90m',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-13',
        title: { en: 'Pottery Night', he: 'ערב קדרות' },
        subtitle: { en: 'Ghost-style wheel session', he: 'סשן אופניים סטייל Ghost' },
        moodTags: ['artsy', 'romantic'],
        emoji: '🏺',
        duration: '2h',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-14',
        title: { en: 'Face Art Party', he: 'ציורי פנים למסיבה' },
        subtitle: { en: 'Pro painter for all guests', he: 'צייר מקצועי לכל האורחים' },
        moodTags: ['artsy', 'fun'],
        emoji: '🎭',
        duration: '2h',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop&q=80'
    },

    // MIXED / SPECIAL
    {
        id: 'pkg-15',
        title: { en: 'Drag Brunch', he: 'ארוחת בוקר עם דראג' },
        subtitle: { en: 'Fabulous show + mimosas', he: 'מופע מרהיב + מימוזה' },
        moodTags: ['fun', 'wow'],
        emoji: '👑',
        duration: '2h',
        image: 'https://images.unsplash.com/photo-1559034750-cdab70a66b8e?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-16',
        title: { en: 'Silent Disco', he: 'דיסקו שקט' },
        subtitle: { en: '3 channels, one epic night', he: '3 ערוצים, לילה אחד אפי' },
        moodTags: ['fun'],
        emoji: '🎧',
        duration: '3h',
        image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&h=500&fit=crop&q=80'
    },
];
