// Premium Package Schema - Elite Closed Club Standard
export interface Package {
    id: string;
    title: { en: string; he: string };
    description: { en: string; he: string };
    talentId: string;
    talentName: { en: string; he: string };
    category: string;
    image: string;
    fixedPrice: number; // NIS
    duration: number; // minutes
    maxGuests?: number;
    includes: { en: string[]; he: string[] };
}

export const packages: Package[] = [
    // 1. Poker Croupier
    {
        id: 'pkg-poker-croupier',
        title: {
            en: 'Professional Poker Croupier',
            he: 'קרופייר פוקר מקצועי'
        },
        description: {
            en: 'Professional poker dealer for your private game night. Casino-level experience at home.',
            he: 'מחלק פוקר מקצועי לערב המשחק הפרטי שלכם. חוויה ברמת קזינו בבית.'
        },
        talentId: 'talent-001',
        talentName: { en: 'Ace Dealer', he: 'מחלק אס' },
        category: 'Poker Croupier',
        image: '/categories/poker-croupier.jpg',
        fixedPrice: 1800,
        duration: 180,
        includes: {
            en: ['3 hours professional dealing', 'Casino-grade cards & chips', 'Multiple poker variants'],
            he: ['3 שעות חלוקה מקצועית', 'קלפים ופישים ברמת קזינו', 'מספר סוגי פוקר']
        }
    },
    // 2. Private Chef
    {
        id: 'pkg-private-chef',
        title: {
            en: 'Private Chef Experience',
            he: 'חוויית שף פרטי'
        },
        description: {
            en: 'Private sushi bar at your home. The chef prepares premium rolls and sashimi right in front of you.',
            he: 'בר סושי פרטי בביתכם. השף מכין רולים וסשימי פרימיום ממש מולכם.'
        },
        talentId: 'talent-002',
        talentName: { en: 'Chef Kenji', he: 'שף קנג׳י' },
        category: 'Private Chef',
        image: '/categories/private-chef.jpg',
        fixedPrice: 2200,
        duration: 90,
        maxGuests: 12,
        includes: {
            en: ['90 min workshop', 'All ingredients included', '30 pieces per person', 'Sake pairing'],
            he: ['90 דקות סדנה', 'כל החומרים כלולים', '30 יחידות לאדם', 'יין סאקה']
        }
    },
    // 3. Bartender
    {
        id: 'pkg-bartender',
        title: {
            en: 'Professional Bartender',
            he: 'ברמן מקצועי'
        },
        description: {
            en: 'Two bartenders compete to create the best drinks for your group. You are the judges.',
            he: 'שני ברמנים מתחרים ביניהם כדי ליצור את המשקאות הטובים ביותר לקבוצה שלכם. אתם השופטים.'
        },
        talentId: 'talent-003',
        talentName: { en: 'Bar Masters TLV', he: 'בר מאסטרס תל אביב' },
        category: 'Bartender',
        image: '/categories/Bartender.jpg',
        fixedPrice: 1600,
        duration: 60,
        maxGuests: 40,
        includes: {
            en: ['60 min flair show', '10 signature cocktails', 'All premium spirits included'],
            he: ['60 דקות מופע פליר', '10 קוקטיילים ייחודיים', 'כל המשקאות הפרימיום כלולים']
        }
    },
    // 4. DJ
    {
        id: 'pkg-dj',
        title: {
            en: 'Professional DJ Experience',
            he: 'חוויית DJ מקצועי'
        },
        description: {
            en: 'Deep house and sunset vibes. Perfect for private rooftop parties or stylish terrace gatherings.',
            he: 'דיפ האוס ווייבס של שקיעה. מושלם למסיבות גג פרטיות או מפגשי מרפסת מסוגננים.'
        },
        talentId: 'talent-004',
        talentName: { en: 'DJ Omer', he: "דיג'יי עומר" },
        category: 'DJ',
        image: '/categories/DJ.jpg',
        fixedPrice: 2500,
        duration: 180,
        maxGuests: 100,
        includes: {
            en: ['3-hour DJ set', 'Professional sound system', 'Lighting setup', 'Custom playlist'],
            he: ['3 שעות DJ סט', 'מערכת הגברה מקצועית', 'תאורה', 'פלייליסט מותאם']
        }
    },
    // 5. Live Musician
    {
        id: 'pkg-live-musician',
        title: {
            en: 'Live Musician Experience',
            he: 'חוויית מוזיקאי חי'
        },
        description: {
            en: 'Intimate live guitar & vocals. Perfect for proposals, anniversaries, or a surprise date night.',
            he: 'גיטרה ושירה חיים. מושלם להצעת נישואין, יום נישואין או הפתעה רומנטית.'
        },
        talentId: 'talent-005',
        talentName: { en: 'Yoni Acoustic', he: 'יוני אקוסטיק' },
        category: 'Live Musician',
        image: '/categories/live-musician.jpg',
        fixedPrice: 850,
        duration: 45,
        maxGuests: 20,
        includes: {
            en: ['45 min live performance', 'Personal song requests', 'Professional sound system'],
            he: ['45 דקות הופעה חיה', 'בקשות שירים אישיות', 'מערכת הגברה מקצועית']
        }
    },
    // 6. Stand-up Comedian
    {
        id: 'pkg-standup-comedian',
        title: {
            en: 'Stand-up Comedian Show',
            he: 'מופע סטנד-אפ'
        },
        description: {
            en: 'A customized comedy roast. The comedian targets your guests with sharp, funny, and safe humor.',
            he: 'מופע קומדיה מותאם אישית. הקומיקאי מכוון לאורחים שלכם עם הומור חד, מצחיק ובטוח.'
        },
        talentId: 'talent-006',
        talentName: { en: 'Amit Cohen', he: 'עמית כהן' },
        category: 'Stand-up Comedian',
        image: '/categories/stand-up-comedian.jpg',
        fixedPrice: 1800,
        duration: 40,
        maxGuests: 50,
        includes: {
            en: ['40 min stand-up set', 'Personalized jokes', 'Meet & greet'],
            he: ['40 דקות סטנדאפ', 'בדיחות מותאמות אישית', 'מפגש אחרי ההופעה']
        }
    },
    // 7. Illusionist
    {
        id: 'pkg-illusionist',
        title: {
            en: 'Professional Illusionist',
            he: 'אשליונאי מקצועי'
        },
        description: {
            en: 'Interactive close-up illusions designed for small house parties and gatherings. Mind-blowing interaction.',
            he: 'אשליות אינטראקטיביות מקרוב המיועדות למסיבות בית קטנות ומפגשים. אינטראקציה מדהימה.'
        },
        talentId: 'talent-007',
        talentName: { en: 'David The Illusionist', he: 'דויד האשליונאי' },
        category: 'Illusionist',
        image: '/categories/Illusionist.jpg',
        fixedPrice: 1200,
        duration: 60,
        maxGuests: 15,
        includes: {
            en: ['60 min close-up magic', 'Interactive tricks', 'Photo moments'],
            he: ['60 דקות קסמים מקרוב', 'טריקים אינטראקטיביים', 'רגעי צילום']
        }
    },
    // 8. Content Creator (Videographer/Photographer)
    {
        id: 'pkg-content-creator',
        title: {
            en: 'Content Creator Pro',
            he: 'יוצר תוכן מקצועי'
        },
        description: {
            en: 'Professional content creation for your event. High-quality photos and videos for social media.',
            he: 'יצירת תוכן מקצועית לאירוע שלכם. תמונות וסרטונים באיכות גבוהה לרשתות חברתיות.'
        },
        talentId: 'talent-008',
        talentName: { en: 'Maya Content', he: 'מאיה תוכן' },
        category: 'Content Creator',
        image: '/categories/content-creator.jpg',
        fixedPrice: 1400,
        duration: 120,
        maxGuests: 30,
        includes: {
            en: ['2 hours coverage', 'Professional editing', 'Social media ready content'],
            he: ['2 שעות סיקור', 'עריכה מקצועית', 'תוכן מוכן לרשתות חברתיות']
        }
    },
    // 9. Rollerblade Coach
    {
        id: 'pkg-rollerblade-coach',
        title: {
            en: 'Rollerblade Coach',
            he: 'מאמן רולרבלייד'
        },
        description: {
            en: 'Professional rollerblade coaching for all levels. Fun outdoor activity for groups.',
            he: 'אימון רולרבלייד מקצועי לכל הרמות. פעילות חוץ מהנה לקבוצות.'
        },
        talentId: 'talent-009',
        talentName: { en: 'Blade Master', he: 'מאסטר הגלגיליות' },
        category: 'Rollerblade Coach',
        image: '/categories/rollerblade-coach.jpg',
        fixedPrice: 1200,
        duration: 90,
        includes: {
            en: ['90 min coaching session', 'Safety equipment provided', 'Beginner to advanced techniques'],
            he: ['90 דקות סשן אימון', 'ציוד בטיחות מסופק', 'טכניקות ממתחילים למתקדמים']
        }
    },
];
