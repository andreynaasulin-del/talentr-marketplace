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
        id: 'pkg-live-musician',
        title: {
            en: 'Live Musician Experience',
            he: 'חוויית מוזיקאי חי'
        },
        description: {
            en: 'Intimate live guitar & vocals. Perfect for proposals, anniversaries, or a surprise date night.',
            he: 'גיטרה ושירה חיים. מושלם להצעת נישואין, יום נישואין או הפתעה רומנטית.'
        },
        talentId: 'talent-001',
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
        talentId: 'talent-002',
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
        talentId: 'talent-003',
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
        talentId: 'talent-004',
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
        talentId: 'talent-005',
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
        talentId: 'talent-006',
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
        talentId: 'talent-007',
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
    {
        id: 'pkg-tribal-fire',
        title: {
            en: 'Tribal Fire Show',
            he: 'מופע אש שבטי'
        },
        description: {
            en: 'An energetic and mystical fire performance inspired by ancient rituals. High impact.',
            he: 'מופע אש אנרגטי ומיסטי בהשראת טקסים עתיקים. השפעה חזקה.'
        },
        talentId: 'talent-008',
        talentName: { en: 'Inferno Crew', he: 'צוות אינפרנו' },
        category: 'Performer',
        image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop&q=80',
        fixedPrice: 2800,
        duration: 20,
        includes: {
            en: ['20 min fire performance', 'Safety team included', 'LED finale'],
            he: ['20 דקות מופע אש', 'צוות בטיחות כלול', 'פינאלה LED']
        }
    },
    {
        id: 'pkg-jazz-breakfast',
        title: {
            en: 'Jazz Breakfast',
            he: 'ארוחת בוקר ג\'אז'
        },
        description: {
            en: 'Live smooth jazz trio for your morning event or corporate brunch. Sophisticated vibes.',
            he: 'טריו ג\'אז חי לאירוע הבוקר שלכם או בראנץ\' עסקי. וייבס מתוחכמים.'
        },
        talentId: 'talent-009',
        talentName: { en: 'Smooth Notes', he: 'הערות חלקות' },
        category: 'Musician',
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop&q=80',
        fixedPrice: 3200,
        duration: 120,
        includes: {
            en: ['120 min jazz performance', 'Live trio (piano, sax, bass)', 'Elegant setup'],
            he: ['120 דקות הופעת ג\'אז', 'טריו חי (פסנתר, סקסופון, בס)', 'סידור אלגנטי']
        }
    },
    {
        id: 'pkg-techno-yoga',
        title: {
            en: 'Techno Yoga',
            he: 'טכנו יוגה'
        },
        description: {
            en: 'Yoga session with a live DJ playing melodic techno. A unique spiritual-dance journey.',
            he: 'סשן יוגה עם DJ חי שמנגן טכנו מלודי. מסע רוחני-ריקודי ייחודי.'
        },
        talentId: 'talent-010',
        talentName: { en: 'Zen Beats', he: 'זן ביטס' },
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&q=80',
        fixedPrice: 1500,
        duration: 75,
        includes: {
            en: ['75 min yoga & DJ set', 'Certified instructor', 'Atmospheric lighting'],
            he: ['75 דקות יוגה ודיג\'יי', 'מדריך מוסמך', 'תאורה אטמוספרית']
        }
    },
    {
        id: 'pkg-samba-carnival',
        title: {
            en: 'Samba Carnival',
            he: 'קרנבל סמבה'
        },
        description: {
            en: 'Brazilian dancers and drummers bring Rio to your event. Explosive energy and color.',
            he: 'רקדנים ומתופפים ברזילאים מביאים את ריו לאירוע שלכם. אנרגיה וצבע מתפרצים.'
        },
        talentId: 'talent-011',
        talentName: { en: 'Rio Spirit', he: 'רוח ריו' },
        category: 'Dancer',
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop&q=80',
        fixedPrice: 4500,
        duration: 30,
        includes: {
            en: ['30 min high-energy show', 'Authentic costumes', 'Audience participation'],
            he: ['30 דקות מופע אנרגטי', 'תלבושות אותנטיות', 'השתתפות הקהל']
        }
    },
    {
        id: 'pkg-sound-healing-bath',
        title: {
            en: 'Sound Healing Bath',
            he: 'אמבטיית ריפוי בצליל'
        },
        description: {
            en: 'Deep relaxation with crystal bowls and gongs. Perfect for mindfulness retreats or chill house parties.',
            he: 'הרפיה עמוקה עם קערות קריסטל וגונגים. מושלם לריטריטים של מיינדפולנס או מסיבות בית רגועות.'
        },
        talentId: 'talent-012',
        talentName: { en: 'Luna Sounds', he: 'לונה סאונדס' },
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop&q=80',
        fixedPrice: 1200,
        duration: 60,
        includes: {
            en: ['60 min sound healing', 'Crystal bowls & gongs', 'Guided meditation'],
            he: ['60 דקות ריפוי בצליל', 'קערות קריסטל וגונגים', 'מדיטציה מודרכת']
        }
    },
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
        talentId: 'talent-013',
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
    {
        id: 'pkg-electric-violin',
        title: {
            en: 'Electric Violin Glow',
            he: 'כינור חשמלי זוהר'
        },
        description: {
            en: 'Modern hits and classical mashups played on a glowing electric violin. High-tech elegance.',
            he: 'להיטים מודרניים ומאשאפים קלאסיים המנוגנים בכינור חשמלי זוהר. אלגנטיות הייטק.'
        },
        talentId: 'talent-014',
        talentName: { en: 'Elena Glow', he: 'אלנה גלאו' },
        category: 'Musician',
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop&q=80',
        fixedPrice: 1900,
        duration: 45,
        includes: {
            en: ['45 min live performance', 'LED electric violin', 'Custom setlist'],
            he: ['45 דקות הופעה חיה', 'כינור חשמלי LED', 'פלייליסט מותאם']
        }
    },
    {
        id: 'pkg-street-magic-tlv',
        title: {
            en: 'TLV Street Magic',
            he: 'קסמי רחוב תל אביב'
        },
        description: {
            en: 'Gritty, fast-paced, and modern magic. Like David Blaine, but in your living room.',
            he: 'קסם רחוב מחוספס, מהיר ומודרני. כמו דייויד בליין, אבל בסלון שלכם.'
        },
        talentId: 'talent-015',
        talentName: { en: 'The Urban Mage', he: 'הקוסם העירוני' },
        category: 'Magician',
        image: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800&h=600&fit=crop&q=80',
        fixedPrice: 1300,
        duration: 50,
        includes: {
            en: ['50 min urban magic', 'Close-up interaction', 'Impossible coin & card tricks'],
            he: ['50 דקות קסם עירוני', 'אינטראקציה מקרוב', 'טריקים בלתי אפשריים עם מטבעות וקלפים']
        }
    },
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
        talentId: 'talent-016',
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
    {
        id: 'pkg-burlesque-night',
        title: {
            en: 'Burlesque Night',
            he: 'ערב בורלסק'
        },
        description: {
            en: 'Vintage glamour and theatrical dance. A classy and provocative show for adult events.',
            he: 'זוהר וינטג\' וריקוד תיאטרלי. מופע קלאסי ופרובוקטיבי לאירועי מבוגרים.'
        },
        talentId: 'talent-017',
        talentName: { en: 'Velvet Rose', he: 'ורד הקטיפה' },
        category: 'Performer',
        image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&h=600&fit=crop&q=80',
        fixedPrice: 3500,
        duration: 40,
        includes: {
            en: ['40 min theatrical performance', 'Elaborate costumes', 'Interactive hosting'],
            he: ['40 דקות הופעה תיאטרלית', 'תלבושות מושקעות', 'הנחיה אינטראקטיבית']
        }
    },
    {
        id: 'pkg-caricature-battle',
        title: {
            en: 'Caricature Battle',
            he: 'קרב קריקטורות'
        },
        description: {
            en: 'Fast-paced, hilarious drawing. The artist creates portraits in under 3 minutes.',
            he: 'ציור מצחיק ומהיר. האמן יוצר פורטרטים בפחות מ-3 דקות.'
        },
        talentId: 'talent-018',
        talentName: { en: 'Sketch Master', he: 'מאסטר הסקיצות' },
        category: 'Artist',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1100,
        duration: 120,
        includes: {
            en: ['2 hours of fast caricatures', 'Hilarious interactions', 'Digital copies included'],
            he: ['שעתיים של קריקטורות מהירות', 'אינטראקציות מצחיקות', 'עותקים דיגיטליים כלולים']
        }
    },
    {
        id: 'pkg-whisky-tasting',
        title: {
            en: 'Elite Whisky Tasting',
            he: 'טעימות וויסקי עלית'
        },
        description: {
            en: 'Explore rare malts with a professional sommelier. A deep dive into the world of luxury spirits.',
            he: 'חקרו מאלטים נדירים עם סומלייה מקצועי. צלילה עמוקה לעולם המשקאות היוקרתיים.'
        },
        talentId: 'talent-019',
        talentName: { en: 'The Dram Society', he: 'חברת הדראם' },
        category: 'Sommelier',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=600&fit=crop&q=80',
        fixedPrice: 3800,
        duration: 90,
        includes: {
            en: ['90 min tasting session', '5 rare whisky expressions', 'Glencairn glasses provided', 'Food pairing bites'],
            he: ['90 דקות סשן טעימות', '5 סוגי וויסקי נדירים', 'כוסות גלנקרן מסופקות', 'נשנושים מותאמים']
        }
    },
    {
        id: 'pkg-harp-serenity',
        title: {
            en: 'Harp Serenity',
            he: 'שלוות הנבל'
        },
        description: {
            en: 'Ethereal live harp performance. Transforms any space into a peaceful sanctuary.',
            he: 'הופעת נבל חיה שמימית. הופכת כל חלל למקלט של שלווה.'
        },
        talentId: 'talent-020',
        talentName: { en: 'Anat Harpist', he: 'ענת הנבלנית' },
        category: 'Musician',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80',
        fixedPrice: 2200,
        duration: 60,
        includes: {
            en: ['60 min live harp', 'Modern & classical repertoire', 'Full setup & transport'],
            he: ['60 דקות נבל חי', 'רפרטואר מודרני וקלאסי', 'סידור מלא והובלה']
        }
    },
];
