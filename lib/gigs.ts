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
    {
        id: 'pkg-1',
        title: { en: 'Balcony Street-Art', he: 'סטריט ארט במרפסת' },
        subtitle: { en: 'Spray live mural with your story', he: 'גרפיטי לייב עם הסיפור שלכם' },
        moodTags: ['artsy', 'wow'],
        emoji: '🎨',
        duration: '45m',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-2',
        title: { en: 'Romantic Acoustic', he: 'אקוסטי רומנטי' },
        subtitle: { en: 'Intimate live music for special moments', he: 'מוזיקה חיה לרגעים מיוחדים' },
        moodTags: ['romantic', 'chill'],
        emoji: '🎸',
        duration: '60m',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-3',
        title: { en: 'Private Standup', he: 'סטנדאפ פרטי' },
        subtitle: { en: 'Comedian just for your crew', he: 'קומיקאי רק לחבורה שלכם' },
        moodTags: ['fun', 'wow'],
        emoji: '😂',
        duration: '30m',
        image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-4',
        title: { en: 'Sound Healing', he: 'ריפוי בצלילים' },
        subtitle: { en: 'Deep relaxation journey', he: 'מסע הרפיה עמוק' },
        moodTags: ['chill', 'artsy'],
        emoji: '🧘',
        duration: '45m',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-5',
        title: { en: 'Close-Up Magic', he: 'קסמים מקרוב' },
        subtitle: { en: 'Mind-blowing table magic', he: 'קסמים מדהימים מהקרוב' },
        moodTags: ['wow', 'fun'],
        emoji: '✨',
        duration: '40m',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&h=500&fit=crop&q=80'
    },
    {
        id: 'pkg-6',
        title: { en: 'Sushi Masterclass', he: 'סדנת סושי' },
        subtitle: { en: 'Roll with the chef', he: 'גלגול עם השף' },
        moodTags: ['fun', 'artsy'],
        emoji: '🍣',
        duration: '90m',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop&q=80'
    },
];

