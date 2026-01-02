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
        id: 'pkg-magic-friends',
        title: { 
            en: 'Magic For Friends', 
            he: 'קסמים לחברים' 
        },
        description: { 
            en: 'Interactive close-up illusions designed for small house parties and gatherings. Mind-blowing interaction.', 
            he: 'אשליות אינטראקטיביות מקרוב המיועדות למסיבות בית קטנות ומפגשים. אינטראקציה מדהימה.' 
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
        id: 'pkg-rooftop-beats',
        title: { 
            en: 'Rooftop Beats', 
            he: 'ביטים על הגג' 
        },
        description: { 
            en: 'Deep house and sunset vibes. Perfect for private rooftop parties or stylish terrace gatherings.', 
            he: 'דיפ האוס ווייבס של שקיעה. מושלם למסיבות גג פרטיות או מפגשי מרפסת מסוגננים.' 
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
        id: 'pkg-private-roast',
        title: { 
            en: 'Private Roast', 
            he: 'רוסט פרטי' 
        },
        description: { 
            en: 'A customized comedy roast. The comedian targets your guests with sharp, funny, and safe humor.', 
            he: 'מופע קומדיה מותאם אישית. הקומיקאי מכוון לאורחים שלכם עם הומור חד, מצחיק ובטוח.' 
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
        id: 'pkg-sushi-night',
        title: { 
            en: 'Chef\'s Sushi Night', 
            he: 'ליל סושי של השף' 
        },
        description: { 
            en: 'Private sushi bar at your home. The chef prepares premium rolls and sashimi right in front of you.', 
            he: 'בר סושי פרטי בביתכם. השף מכין רולים וסשימי פרימיום ממש מולכם.' 
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
        id: 'pkg-canvas-cocktails',
        title: { 
            en: 'Canvas & Cocktails', 
            he: 'קנבס וקוקטיילים' 
        },
        description: { 
            en: 'An artist-led painting session combined with premium mixology. Create and sip.', 
            he: 'סשן ציור בהנחיית אמן בשילוב עם מיקסולוגיה פרימיום. ליצור וללגום.' 
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
        id: 'pkg-mixology-duel',
        title: { 
            en: 'Mixology Duel', 
            he: 'דו-קרב מיקסולוגיה' 
        },
        description: { 
            en: 'Two bartenders compete to create the best drinks for your group. You are the judges.', 
            he: 'שני ברמנים מתחרים ביניהם כדי ליצור את המשקאות הטובים ביותר לקבוצה שלכם. אתם השופטים.' 
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
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=600&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=600&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1200,
        duration: 60,
        includes: { 
            en: ['60 min sound healing', 'Crystal bowls & gongs', 'Guided meditation'], 
            he: ['60 דקות ריפוי בצליל', 'קערות קריסטל וגונגים', 'מדיטציה מודרכת'] 
        }
    },
    {
        id: 'pkg-pizza-workshop',
        title: { 
            en: 'Neapolitan Pizza Art', 
            he: 'אמנות הפיצה הנפוליטנית' 
        },
        description: { 
            en: 'Learn to bake authentic pizza in your backyard. Portable wood-fired oven included.', 
            he: 'למדו לאפות פיצה אותנטית בחצר האחורית שלכם. כולל טאבון עצים נייד.' 
        },
        talentId: 'talent-013',
        talentName: { en: 'Chef Luca', he: 'שף לוקה' },
        category: 'Chef',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop&q=80',
        fixedPrice: 2800,
        duration: 120,
        includes: { 
            en: ['2 hours workshop', 'Mobile wood-fired oven', 'Premium Italian ingredients'], 
            he: ['סדנה של שעתיים', 'טאבון עצים נייד', 'מרכיבים איטלקיים פרימיום'] 
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
        image: 'https://images.unsplash.com/photo-1465821508027-561b82d5df75?w=600&h=600&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80',
        fixedPrice: 1300,
        duration: 50,
        includes: { 
            en: ['50 min urban magic', 'Close-up interaction', 'Impossible coin & card tricks'], 
            he: ['50 דקות קסם עירוני', 'אינטראקציה מקרוב', 'טריקים בלתי אפשריים עם מטבעות וקלפים'] 
        }
    },
    {
        id: 'pkg-graffiti-masterclass',
        title: { 
            en: 'Graffiti Masterclass', 
            he: 'מאסטרקלאס גרפיטי' 
        },
        description: { 
            en: 'Learn the secrets of street art. Create your own mural on a portable canvas.', 
            he: 'למדו את סודות אמנות הרחוב. צרו ציור קיר משלכם על קנבס נייד.' 
        },
        talentId: 'talent-016',
        talentName: { en: 'Spray Kings', he: 'מלכי הספריי' },
        category: 'Artist',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&h=600&fit=crop&q=80',
        fixedPrice: 2100,
        duration: 90,
        includes: { 
            en: ['90 min street art workshop', 'All paints & masks provided', 'Take-home canvas'], 
            he: ['90 דקות סדנת אמנות רחוב', 'כל הצבעים והמסכות מסופקים', 'קנבס לקחת הביתה'] 
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
        image: 'https://images.unsplash.com/photo-1514525253344-99a42999628a?w=600&h=600&fit=crop&q=80',
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
        image: 'https://images.unsplash.com/photo-1527281400828-ac737c6f5d53?w=600&h=600&fit=crop&q=80',
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
