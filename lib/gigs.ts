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
    {
        id: 'pkg-poker-croupier',
        title: {
            en: 'Poker Croupier',
            he: 'קרופייר לפוקר'
        },
        description: {
            en: 'Professional croupier for your private poker night. Authentic casino atmosphere at your home.',
            he: 'קרופייר מקצועי לערב פוקר פרטי. אווירת קזינו אותנטית בבית שלכם.'
        },
        talentId: 'talent-001',
        talentName: { en: 'Casino Pro', he: 'קזינו פרו' },
        category: 'Croupier',
        image: '',
        fixedPrice: 1500,
        duration: 180,
        maxGuests: 10,
        includes: {
            en: ['3 hours of professional dealing', 'Poker chips & cards', 'Texas Hold\'em or Omaha'],
            he: ['3 שעות חלוקה מקצועית', 'צ\'יפים וקלפים', 'טקסס הולדם או אומהה']
        }
    },
    {
        id: 'pkg-private-chef',
        title: {
            en: 'Private Chef',
            he: 'שף פרטי'
        },
        description: {
            en: 'Gourmet dining experience at your home. The chef prepares an exclusive menu right in front of you.',
            he: 'חוויית אוכל גורמה בבית שלכם. השף מכין תפריט בלעדי ממש מולכם.'
        },
        talentId: 'talent-002',
        talentName: { en: 'Chef Elite', he: 'שף אליט' },
        category: 'Chef',
        image: '',
        fixedPrice: 2500,
        duration: 180,
        maxGuests: 12,
        includes: {
            en: ['3-course gourmet menu', 'All ingredients included', 'Wine pairing recommendations'],
            he: ['תפריט גורמה 3 מנות', 'כל החומרים כלולים', 'המלצות ליין']
        }
    },
    {
        id: 'pkg-bartender',
        title: {
            en: 'Bartender',
            he: 'ברמן'
        },
        description: {
            en: 'Professional mixologist for your private event. Signature cocktails and flair bartending.',
            he: 'מיקסולוג מקצועי לאירוע הפרטי שלכם. קוקטיילים ייחודיים ומופע פליר.'
        },
        talentId: 'talent-003',
        talentName: { en: 'Bar Masters', he: 'בר מאסטרס' },
        category: 'Bartender',
        image: '',
        fixedPrice: 1800,
        duration: 180,
        maxGuests: 50,
        includes: {
            en: ['3-hour bar service', 'Signature cocktails', 'All premium spirits included'],
            he: ['3 שעות שירות בר', 'קוקטיילים ייחודיים', 'כל המשקאות הפרימיום כלולים']
        }
    },
    {
        id: 'pkg-dj',
        title: {
            en: 'DJ',
            he: 'DJ'
        },
        description: {
            en: 'Professional DJ for your party. From deep house to mainstream hits — custom vibes for your event.',
            he: 'DJ מקצועי למסיבה שלכם. מדיפ האוס ועד להיטים — וייבס מותאם לאירוע.'
        },
        talentId: 'talent-004',
        talentName: { en: 'DJ Pro', he: 'DJ פרו' },
        category: 'DJ',
        image: '',
        fixedPrice: 2500,
        duration: 240,
        maxGuests: 100,
        includes: {
            en: ['4-hour DJ set', 'Professional sound system', 'Lighting setup', 'Custom playlist'],
            he: ['4 שעות DJ סט', 'מערכת הגברה מקצועית', 'תאורה', 'פלייליסט מותאם']
        }
    },
    {
        id: 'pkg-live-musician',
        title: {
            en: 'Live Musician',
            he: 'מוזיקאי חי'
        },
        description: {
            en: 'Intimate live performance. Guitar, vocals, or piano — perfect for romantic evenings and special moments.',
            he: 'הופעה חיה אינטימית. גיטרה, שירה או פסנתר — מושלם לערבים רומנטיים ורגעים מיוחדים.'
        },
        talentId: 'talent-005',
        talentName: { en: 'Live Notes', he: 'נגינה חיה' },
        category: 'Musician',
        image: '',
        fixedPrice: 1200,
        duration: 60,
        maxGuests: 30,
        includes: {
            en: ['60 min live performance', 'Personal song requests', 'Professional sound system'],
            he: ['60 דקות הופעה חיה', 'בקשות שירים אישיות', 'מערכת הגברה מקצועית']
        }
    },
    {
        id: 'pkg-standup-comedian',
        title: {
            en: 'Stand-up Comedian',
            he: 'סטנדאפיסט'
        },
        description: {
            en: 'Private stand-up show tailored to your audience. Sharp humor and unforgettable laughs.',
            he: 'מופע סטנדאפ פרטי מותאם לקהל שלכם. הומור חד וצחוקים בלתי נשכחים.'
        },
        talentId: 'talent-006',
        talentName: { en: 'Comedy Club', he: 'מועדון קומדיה' },
        category: 'Comedian',
        image: '',
        fixedPrice: 2000,
        duration: 45,
        maxGuests: 50,
        includes: {
            en: ['45 min stand-up set', 'Personalized jokes about guests', 'Meet & greet'],
            he: ['45 דקות סטנדאפ', 'בדיחות מותאמות על האורחים', 'מפגש אחרי ההופעה']
        }
    },
    {
        id: 'pkg-illusionist',
        title: {
            en: 'Illusionist',
            he: 'אשליונאי'
        },
        description: {
            en: 'Mind-blowing close-up magic and grand illusions. Interactive performance that amazes everyone.',
            he: 'קסמים מקרוב ואשליות גדולות שמפוצצות את הראש. הופעה אינטראקטיבית שמדהימה את כולם.'
        },
        talentId: 'talent-007',
        talentName: { en: 'The Illusionist', he: 'האשליונאי' },
        category: 'Magician',
        image: '',
        fixedPrice: 1500,
        duration: 60,
        maxGuests: 30,
        includes: {
            en: ['60 min magic show', 'Close-up & stage illusions', 'Photo moments'],
            he: ['60 דקות מופע קסמים', 'אשליות מקרוב ובמה', 'רגעי צילום']
        }
    },
    {
        id: 'pkg-content-creator',
        title: {
            en: 'Content Creator',
            he: 'יוצר תוכן'
        },
        description: {
            en: 'Professional videographer and photographer for your event. Cinematic content for social media.',
            he: 'צלם וידאו ופוטו מקצועי לאירוע שלכם. תוכן קולנועי לרשתות חברתיות.'
        },
        talentId: 'talent-008',
        talentName: { en: 'Creative Studio', he: 'סטודיו קריאטיב' },
        category: 'Videographer',
        image: '',
        fixedPrice: 1800,
        duration: 180,
        includes: {
            en: ['3 hours of coverage', 'Photo + video package', 'Edited reels for social media', 'Same-day preview'],
            he: ['3 שעות צילום', 'חבילת פוטו + וידאו', 'רילסים ערוכים לסושיאל', 'תצוגה מקדימה באותו יום']
        }
    },
    {
        id: 'pkg-rollerblade-coach',
        title: {
            en: 'Rollerblade Coach',
            he: 'מאמן רולרבליידס'
        },
        description: {
            en: 'Private rollerblading lessons for all levels. Learn to skate or improve your skills with a pro.',
            he: 'שיעורי רולרבליידס פרטיים לכל הרמות. למדו להחליק או שפרו את הכישורים עם מקצוען.'
        },
        talentId: 'talent-009',
        talentName: { en: 'Skate Pro', he: 'סקייט פרו' },
        category: 'Coach',
        image: '',
        fixedPrice: 350,
        duration: 60,
        maxGuests: 4,
        includes: {
            en: ['60 min private lesson', 'Equipment provided', 'Safety gear included', 'All skill levels'],
            he: ['60 דקות שיעור פרטי', 'ציוד מסופק', 'ציוד בטיחות כלול', 'כל הרמות']
        }
    },
];
