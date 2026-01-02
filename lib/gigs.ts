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
        id: 'pkg-romantic-acoustic',
        title: { 
            en: 'Romantic Acoustic', 
            he: 'אקוסטי רומנטי' 
        },
        description: { 
            en: 'Intimate live guitar & vocals. Perfect for proposals, anniversaries, or a surprise date night.', 
            he: 'גיטרה ושירה חיים. מושלם להצעת נישואין, יום נישואין או הפתעה רומנטית.' 
        },
        talentId: 'talent-001',
        talentName: { en: 'Yoni Acoustic', he: 'יוני אקוסטיק' },
        category: 'Musician',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop&q=80',
        fixedPrice: 850,
        duration: 45,
        maxGuests: 20,
        includes: { 
            en: ['45 min live performance', 'Personal song requests', 'Professional sound system'], 
            he: ['45 דקות הופעה חיה', 'בקשות שירים אישיות', 'מערכת הגברה מקצועית'] 
        }
    },
    {
        id: 'pkg-magic-chaos',
        title: { 
            en: 'Magic Chaos', 
            he: 'בלגן קסום' 
        },
        description: { 
            en: 'Close-up magic that leaves everyone speechless. Interactive illusions for your private gathering.', 
            he: 'קסמים מקרוב שמשאירים את כולם ללא מילים. אשליות אינטראקטיביות לאירוע הפרטי שלכם.' 
        },
        talentId: 'talent-002',
        talentName: { en: 'David The Illusionist', he: 'דויד האשליונאי' },
        category: 'Magician',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1200,
        duration: 60,
        maxGuests: 15,
        includes: { 
            en: ['60 min close-up magic', 'Interactive tricks', 'Photo moments'], 
            he: ['60 דקות קסמים מקרוב', 'טריקים אינטראקטיביים', 'רגעי צילום'] 
        }
    },
    {
        id: 'pkg-dj-tlv-2026',
        title: { 
            en: 'DJ Set: TLV 2026', 
            he: 'DJ סט: תל אביב 2026' 
        },
        description: { 
            en: 'Underground house meets Mediterranean vibes. The sound of Tel Aviv\'s elite rooftops.', 
            he: 'האוס אנדרגראונד פוגש וייבס ים תיכוניים. הסאונד של גגות תל אביב.' 
        },
        talentId: 'talent-003',
        talentName: { en: 'DJ Omer', he: "דיג'יי עומר" },
        category: 'DJ',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=80',
        fixedPrice: 2500,
        duration: 180,
        maxGuests: 100,
        includes: { 
            en: ['3-hour DJ set', 'Professional sound system', 'Lighting setup', 'Custom playlist'], 
            he: ['3 שעות DJ סט', 'מערכת הגברה מקצועית', 'תאורה', 'פלייליסט מותאם'] 
        }
    },
    {
        id: 'pkg-private-comedy',
        title: { 
            en: 'Private Stand-Up', 
            he: 'סטנדאפ פרטי' 
        },
        description: { 
            en: 'Top-tier comedian performs exclusively for your group. Guaranteed laughter.', 
            he: 'קומיקאי מהשורה הראשונה מופיע רק לקבוצה שלכם. צחוק מובטח.' 
        },
        talentId: 'talent-004',
        talentName: { en: 'Amit Cohen', he: 'עמית כהן' },
        category: 'Comedian',
        image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1800,
        duration: 40,
        maxGuests: 50,
        includes: { 
            en: ['40 min stand-up set', 'Personalized jokes', 'Meet & greet'], 
            he: ['40 דקות סטנדאפ', 'בדיחות מותאמות אישית', 'מפגש אחרי ההופעה'] 
        }
    },
    {
        id: 'pkg-sushi-master',
        title: { 
            en: 'Sushi Masterclass', 
            he: 'מאסטרקלאס סושי' 
        },
        description: { 
            en: 'Learn from a real sushi chef. Roll, taste, and impress your guests.', 
            he: 'למדו משף סושי אמיתי. גלגלו, טעמו והרשימו את האורחים.' 
        },
        talentId: 'talent-005',
        talentName: { en: 'Chef Kenji', he: 'שף קנג׳י' },
        category: 'Chef',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=600&fit=crop&q=80',
        fixedPrice: 2200,
        duration: 90,
        maxGuests: 12,
        includes: { 
            en: ['90 min workshop', 'All ingredients included', '30 pieces per person', 'Sake pairing'], 
            he: ['90 דקות סדנה', 'כל החומרים כלולים', '30 יחידות לאדם', 'יין סאקה'] 
        }
    },
    {
        id: 'pkg-live-portrait',
        title: { 
            en: 'Live Portrait Session', 
            he: 'סשן פורטרט לייב' 
        },
        description: { 
            en: 'A professional artist creates portraits of your guests. Unique keepsake for everyone.', 
            he: 'אמן מקצועי יוצר פורטרטים של האורחים. מזכרת ייחודית לכולם.' 
        },
        talentId: 'talent-006',
        talentName: { en: 'Maya Artworks', he: 'מאיה יצירות' },
        category: 'Artist',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1400,
        duration: 120,
        maxGuests: 30,
        includes: { 
            en: ['2 hours of live portraits', 'Up to 15 portraits', 'Premium paper & materials'], 
            he: ['שעתיים פורטרטים לייב', 'עד 15 פורטרטים', 'נייר וחומרים פרימיום'] 
        }
    },
    {
        id: 'pkg-cocktail-show',
        title: { 
            en: 'Cocktail Show', 
            he: 'מופע קוקטיילים' 
        },
        description: { 
            en: 'Flair bartending meets mixology art. Premium drinks, premium entertainment.', 
            he: 'ברמנות פליר פוגשת אומנות קוקטיילים. משקאות פרימיום, בידור פרימיום.' 
        },
        talentId: 'talent-007',
        talentName: { en: 'Bar Masters TLV', he: 'בר מאסטרס תל אביב' },
        category: 'Bartender',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1600,
        duration: 60,
        maxGuests: 40,
        includes: { 
            en: ['60 min flair show', '10 signature cocktails', 'All premium spirits included'], 
            he: ['60 דקות מופע פליר', '10 קוקטיילים ייחודיים', 'כל המשקאות הפרימיום כלולים'] 
        }
    },
    {
        id: 'pkg-fire-show',
        title: { 
            en: 'Fire Performance', 
            he: 'מופע אש' 
        },
        description: { 
            en: 'Breathtaking fire dancing that transforms any venue into an unforgettable spectacle.', 
            he: 'ריקוד אש עוצר נשימה שהופך כל מקום למחזה בלתי נשכח.' 
        },
        talentId: 'talent-008',
        talentName: { en: 'Inferno Crew', he: 'צוות אינפרנו' },
        category: 'Performer',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop&q=80',
        fixedPrice: 2800,
        duration: 20,
        includes: { 
            en: ['20 min fire performance', 'Safety team included', 'LED finale'], 
            he: ['20 דקות מופע אש', 'צוות בטיחות כלול', 'פינאלה LED'] 
        }
    },
];
