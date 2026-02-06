export type CategorySlug =
  | 'dj'
  | 'magician'
  | 'comedian'
  | 'singer'
  | 'bartender'
  | 'kids-animator'
  | 'face-painter'
  | 'kids-magician'
  | 'dancer'
  | 'clown';

export type PageType = 'book' | 'become';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryContent {
  slug: CategorySlug;
  type: 'adult' | 'kids';
  icon: string;
  book: {
    en: {
      title: string;
      metaDescription: string;
      h1: string;
      heroDescription: string;
      descriptionBlock: {
        whatIsIt: string;
        events: string;
        format: string;
      };
      benefits: string[];
      faq: FAQItem[];
      crossLinkText: string;
    };
    he: {
      title: string;
      metaDescription: string;
      h1: string;
      heroDescription: string;
      descriptionBlock: {
        whatIsIt: string;
        events: string;
        format: string;
      };
      benefits: string[];
      faq: FAQItem[];
      crossLinkText: string;
    };
  };
  become: {
    en: {
      title: string;
      metaDescription: string;
      h1: string;
      heroDescription: string;
      descriptionBlock: {
        whatIsIt: string;
        events: string;
        format: string;
      };
      benefits: string[];
      faq: FAQItem[];
      crossLinkText: string;
    };
    he: {
      title: string;
      metaDescription: string;
      h1: string;
      heroDescription: string;
      descriptionBlock: {
        whatIsIt: string;
        events: string;
        format: string;
      };
      benefits: string[];
      faq: FAQItem[];
      crossLinkText: string;
    };
  };
}

export const HOW_IT_WORKS = {
  book: {
    en: [
      { step: 1, title: 'Choose performer', description: 'Browse verified professionals in your category' },
      { step: 2, title: 'Send request', description: 'Describe your event and get a personalized quote' },
      { step: 3, title: 'Confirm & enjoy', description: 'Book securely and enjoy your event' },
    ],
    he: [
      { step: 1, title: 'בחר מבצע', description: 'עיין במקצוענים מאומתים בקטגוריה שלך' },
      { step: 2, title: 'שלח בקשה', description: 'תאר את האירוע שלך וקבל הצעת מחיר מותאמת' },
      { step: 3, title: 'אשר ותיהנה', description: 'הזמן בצורה מאובטחת ותיהנה מהאירוע' },
    ],
  },
  become: {
    en: [
      { step: 1, title: 'Create gig', description: 'Set up your professional profile and showcase your talent' },
      { step: 2, title: 'Get requests', description: 'Receive booking requests from clients in your area' },
      { step: 3, title: 'Perform & get paid', description: 'Do what you love and earn what you deserve' },
    ],
    he: [
      { step: 1, title: 'צור גיג', description: 'הגדר את הפרופיל המקצועי שלך והצג את הכישרון שלך' },
      { step: 2, title: 'קבל בקשות', description: 'קבל בקשות הזמנה מלקוחות באזור שלך' },
      { step: 3, title: 'הופע וקבל תשלום', description: 'עשה את מה שאתה אוהב והרוויח את מה שמגיע לך' },
    ],
  },
};

export const CATEGORIES: CategoryContent[] = [
  // ===== ADULT CATEGORIES =====
  {
    slug: 'dj',
    type: 'adult',
    icon: '🎧',
    book: {
      en: {
        title: 'Book a DJ in Israel',
        metaDescription: 'Find and book the best DJs for weddings, parties, and corporate events in Israel. Verified professionals, instant booking on Talentr.',
        h1: 'Book a Professional DJ for Your Event',
        heroDescription: 'Find verified, top-rated DJs for weddings, parties, bar mitzvahs, and corporate events across Israel.',
        descriptionBlock: {
          whatIsIt: 'A professional DJ brings the perfect soundtrack to your event — from elegant cocktail sets to high-energy dance floors.',
          events: 'Weddings, birthday parties, bar/bat mitzvahs, corporate events, private parties, and nightlife events.',
          format: 'Full DJ setup with professional sound and lighting. Customizable playlists, live mixing, and MC services available.',
        },
        benefits: [
          'Verified and rated professionals only',
          'Browse portfolios with real event photos and mixes',
          'Direct communication — no middleman fees',
          'Flexible booking for any event size',
          'Secure payment protection',
        ],
        faq: [
          { question: 'How far in advance should I book a DJ?', answer: 'We recommend booking at least 2-4 weeks in advance, especially for weekend events. For weddings and large events, 1-3 months ahead is ideal.' },
          { question: 'What equipment does the DJ provide?', answer: 'Most DJs on Talentr come fully equipped with professional sound systems, mixers, and lighting. Specific equipment details are listed on each DJ\'s profile.' },
          { question: 'Can I request specific songs or genres?', answer: 'Absolutely! You can share your playlist preferences and must-play songs directly with the DJ before your event.' },
          { question: 'What is the average cost of hiring a DJ in Israel?', answer: 'DJ rates vary based on event duration, equipment needs, and experience level. Browse profiles on Talentr to compare rates and find the best fit for your budget.' },
        ],
        crossLinkText: 'Are you a DJ? Join Talentr',
      },
      he: {
        title: 'הזמן DJ בישראל',
        metaDescription: 'מצא והזמן את הדיג\'ייים הטובים ביותר לחתונות, מסיבות ואירועים עסקיים בישראל. מקצוענים מאומתים, הזמנה מיידית ב-Talentr.',
        h1: 'הזמן DJ מקצועי לאירוע שלך',
        heroDescription: 'מצא דיג\'ייים מאומתים ומדורגים לחתונות, מסיבות, בר/בת מצוות ואירועים עסקיים בכל רחבי ישראל.',
        descriptionBlock: {
          whatIsIt: 'DJ מקצועי מביא את הפסקול המושלם לאירוע שלך — מסט קוקטייל אלגנטי ועד רחבת ריקודים אנרגטית.',
          events: 'חתונות, מסיבות יום הולדת, בר/בת מצוות, אירועים עסקיים, מסיבות פרטיות ואירועי לילה.',
          format: 'ציוד DJ מלא עם מערכת הגברה ותאורה מקצועית. פלייליסטים מותאמים אישית, מיקס חי ושירותי MC.',
        },
        benefits: [
          'מקצוענים מאומתים ומדורגים בלבד',
          'עיין בתיקי עבודות עם תמונות אמיתיות ומיקסים',
          'תקשורת ישירה — ללא עמלות מתווך',
          'הזמנה גמישה לכל גודל אירוע',
          'הגנת תשלום מאובטחת',
        ],
        faq: [
          { question: 'כמה זמן מראש כדאי להזמין DJ?', answer: 'מומלץ להזמין לפחות 2-4 שבועות מראש, במיוחד לאירועי סוף שבוע. לחתונות ואירועים גדולים, 1-3 חודשים מראש.' },
          { question: 'איזה ציוד ה-DJ מביא?', answer: 'רוב הדיג\'ייים ב-Talentr מגיעים עם ציוד מלא כולל מערכת הגברה, מיקסר ותאורה מקצועית. פרטי הציוד מופיעים בפרופיל של כל DJ.' },
          { question: 'אפשר לבקש שירים או סגנונות ספציפיים?', answer: 'בהחלט! תוכל לשתף את העדפות הפלייליסט והשירים החובה ישירות עם ה-DJ לפני האירוע.' },
          { question: 'מה העלות הממוצעת לשכירת DJ בישראל?', answer: 'מחירי DJ משתנים לפי משך האירוע, צרכי ציוד ורמת ניסיון. עיין בפרופילים ב-Talentr כדי להשוות מחירים ולמצוא את ההתאמה הטובה ביותר.' },
        ],
        crossLinkText: 'אתה DJ? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a DJ on Talentr',
        metaDescription: 'Join Talentr as a DJ. Create your gig, get bookings from clients across Israel, and grow your DJ career.',
        h1: 'Start Your DJ Career on Talentr',
        heroDescription: 'Create your professional DJ profile, get discovered by event planners, and book more gigs across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects you with clients looking for DJs for weddings, parties, corporate events, and more.',
          events: 'Get booked for weddings, birthday parties, bar/bat mitzvahs, nightclub events, corporate functions, and private celebrations.',
          format: 'Set your own rates, showcase your mixes and past events, and manage bookings through our simple dashboard.',
        },
        benefits: [
          'Free profile creation — no upfront costs',
          'Direct client communication',
          'Set your own rates and availability',
          'Build your reputation with verified reviews',
          'Get discovered by thousands of event planners',
        ],
        faq: [
          { question: 'Is it free to create a DJ profile?', answer: 'Yes! Creating your profile and gig listing on Talentr is completely free. You only pay a small service fee when you get booked.' },
          { question: 'How do I get my first bookings?', answer: 'Complete your profile with high-quality photos, demo mixes, and a detailed description. Active profiles with reviews rank higher in search results.' },
          { question: 'Can I set my own prices?', answer: 'Yes, you have full control over your pricing. You can set different rates for different event types and durations.' },
          { question: 'What areas can I serve?', answer: 'You can specify your service areas across Israel. Clients in your area will see your profile when searching for DJs.' },
        ],
        crossLinkText: 'See how clients book DJs',
      },
      he: {
        title: 'הפוך ל-DJ ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כ-DJ. צור את הגיג שלך, קבל הזמנות מלקוחות בכל ישראל, וקדם את הקריירה שלך.',
        h1: 'התחל את קריירת ה-DJ שלך ב-Talentr',
        heroDescription: 'צור פרופיל DJ מקצועי, תתגלה על ידי מארגני אירועים, והזמן יותר גיגים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר אותך עם לקוחות שמחפשים דיג\'ייים לחתונות, מסיבות, אירועים עסקיים ועוד.',
          events: 'קבל הזמנות לחתונות, מסיבות יום הולדת, בר/בת מצוות, מועדונים, אירועים עסקיים וחגיגות פרטיות.',
          format: 'קבע את המחירים שלך, הצג את המיקסים והאירועים הקודמים שלך, ונהל הזמנות דרך הדשבורד הפשוט שלנו.',
        },
        benefits: [
          'יצירת פרופיל חינם — ללא עלויות מראש',
          'תקשורת ישירה עם לקוחות',
          'קבע את המחירים והזמינות שלך',
          'בנה את המוניטין שלך עם ביקורות מאומתות',
          'תתגלה על ידי אלפי מארגני אירועים',
        ],
        faq: [
          { question: 'האם יצירת פרופיל DJ היא חינם?', answer: 'כן! יצירת הפרופיל והגיג שלך ב-Talentr היא חינם לגמרי. אתה משלם עמלת שירות קטנה רק כשמקבלים הזמנה.' },
          { question: 'איך אני מקבל את ההזמנות הראשונות?', answer: 'השלם את הפרופיל שלך עם תמונות איכותיות, דמו מיקסים ותיאור מפורט. פרופילים פעילים עם ביקורות מדורגים גבוה יותר בתוצאות החיפוש.' },
          { question: 'אני יכול לקבוע את המחירים שלי?', answer: 'כן, יש לך שליטה מלאה על התמחור. אתה יכול לקבוע מחירים שונים לסוגי אירועים ומשכי זמן שונים.' },
          { question: 'באילו אזורים אני יכול לתת שירות?', answer: 'אתה יכול לציין את אזורי השירות שלך בכל ישראל. לקוחות באזור שלך יראו את הפרופיל שלך כשהם מחפשים דיג\'ייים.' },
        ],
        crossLinkText: 'ראה איך לקוחות מזמינים DJs',
      },
    },
  },

  {
    slug: 'magician',
    type: 'adult',
    icon: '🎩',
    book: {
      en: {
        title: 'Book a Magician in Israel',
        metaDescription: 'Hire a professional magician for your event in Israel. Close-up magic, stage shows, and mentalism for weddings, parties, and corporate events.',
        h1: 'Book a Professional Magician for Your Event',
        heroDescription: 'Find verified magicians for unforgettable close-up magic, stage illusions, and mentalism shows across Israel.',
        descriptionBlock: {
          whatIsIt: 'A professional magician adds wonder and excitement to any event with mind-bending illusions, close-up card tricks, and interactive performances.',
          events: 'Corporate events, weddings, birthday parties, product launches, bar/bat mitzvahs, and private gatherings.',
          format: 'Close-up roaming magic, stage shows, mentalism performances. Duration and style tailored to your event.',
        },
        benefits: [
          'Verified performers with video demos',
          'Multiple magic styles to choose from',
          'Perfect ice-breaker for corporate events',
          'Interactive entertainment for all ages',
          'Flexible packages for any budget',
        ],
        faq: [
          { question: 'What types of magic shows are available?', answer: 'Talentr magicians offer close-up/table magic, stage illusions, mentalism, comedy magic, and interactive shows. Each performer lists their specialties.' },
          { question: 'How long does a magic show typically last?', answer: 'Shows range from 15-minute close-up sets to full 60-minute stage performances. Many magicians offer flexible packages.' },
          { question: 'Is the magic suitable for corporate events?', answer: 'Absolutely! Many of our magicians specialize in corporate entertainment with clean, professional shows perfect for team events and client functions.' },
          { question: 'Can the magician incorporate my brand or product?', answer: 'Many performers offer custom routines that can incorporate your brand messaging or product reveals. Discuss options directly with the magician.' },
        ],
        crossLinkText: 'Are you a magician? Join Talentr',
      },
      he: {
        title: 'הזמן קוסם בישראל',
        metaDescription: 'שכור קוסם מקצועי לאירוע שלך בישראל. קסמי קלוז-אפ, מופעי במה ומנטליזם לחתונות, מסיבות ואירועים עסקיים.',
        h1: 'הזמן קוסם מקצועי לאירוע שלך',
        heroDescription: 'מצא קוסמים מאומתים למופעי קלוז-אפ בלתי נשכחים, אשליות במה ומנטליזם בכל רחבי ישראל.',
        descriptionBlock: {
          whatIsIt: 'קוסם מקצועי מוסיף פליאה והתרגשות לכל אירוע עם אשליות מרהיבות, טריקים עם קלפים ומופעים אינטראקטיביים.',
          events: 'אירועים עסקיים, חתונות, מסיבות יום הולדת, השקות מוצרים, בר/בת מצוות ומפגשים פרטיים.',
          format: 'קסמי קלוז-אפ, מופעי במה, מנטליזם. משך וסגנון מותאמים לאירוע שלך.',
        },
        benefits: [
          'מבצעים מאומתים עם דמואים בווידאו',
          'מגוון סגנונות קסם לבחירה',
          'שובר קרח מושלם לאירועים עסקיים',
          'בידור אינטראקטיבי לכל הגילאים',
          'חבילות גמישות לכל תקציב',
        ],
        faq: [
          { question: 'אילו סוגי מופעי קסמים זמינים?', answer: 'קוסמי Talentr מציעים קסמי קלוז-אפ, אשליות במה, מנטליזם, קסמי קומדיה ומופעים אינטראקטיביים. כל מבצע מפרט את ההתמחויות שלו.' },
          { question: 'כמה זמן נמשך מופע קסמים?', answer: 'מופעים נעים מסטים של 15 דקות קלוז-אפ ועד מופעי במה מלאים של 60 דקות. קוסמים רבים מציעים חבילות גמישות.' },
          { question: 'האם הקסמים מתאימים לאירועים עסקיים?', answer: 'בהחלט! קוסמים רבים שלנו מתמחים בבידור עסקי עם מופעים מקצועיים ונקיים מושלמים לאירועי צוות ולקוחות.' },
          { question: 'האם הקוסם יכול לשלב את המותג או המוצר שלי?', answer: 'מבצעים רבים מציעים שגרות מותאמות שיכולות לשלב את המסרים של המותג שלך או חשיפת מוצרים. דון באפשרויות ישירות עם הקוסם.' },
        ],
        crossLinkText: 'אתה קוסם? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Magician on Talentr',
        metaDescription: 'Join Talentr as a magician. Showcase your magic, get booked for events across Israel, and grow your performance career.',
        h1: 'Grow Your Magic Career on Talentr',
        heroDescription: 'Create your magician profile, showcase your performances, and connect with clients looking for magic entertainment.',
        descriptionBlock: {
          whatIsIt: 'Talentr is Israel\'s premier platform for event magicians to connect with clients and grow their booking calendar.',
          events: 'Get booked for corporate events, weddings, private parties, product launches, and children\'s events.',
          format: 'List your specialties (close-up, stage, mentalism), set rates, and showcase your best performances.',
        },
        benefits: [
          'Showcase your magic with video demos',
          'Reach thousands of potential clients',
          'Control your schedule and pricing',
          'Build credibility with client reviews',
          'No upfront costs to join',
        ],
        faq: [
          { question: 'What types of magic can I list?', answer: 'You can list any style: close-up, stage, mentalism, comedy magic, kids shows, corporate entertainment, and more.' },
          { question: 'Do I need professional equipment?', answer: 'You should have your own performance equipment. Having professional photos and video demos significantly improves your profile visibility.' },
          { question: 'How does payment work?', answer: 'You set your own rates and receive payment securely through Talentr after each event. A small service fee applies.' },
          { question: 'Can I offer different packages?', answer: 'Yes! You can create multiple gig listings with different packages, durations, and price points to suit various event types.' },
        ],
        crossLinkText: 'See how clients book magicians',
      },
      he: {
        title: 'הפוך לקוסם ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כקוסם. הצג את הקסמים שלך, קבל הזמנות לאירועים בכל ישראל, וקדם את הקריירה שלך.',
        h1: 'קדם את קריירת הקסמים שלך ב-Talentr',
        heroDescription: 'צור פרופיל קוסם, הצג את המופעים שלך, והתחבר עם לקוחות שמחפשים בידור קסמים.',
        descriptionBlock: {
          whatIsIt: 'Talentr היא הפלטפורמה המובילה בישראל לקוסמי אירועים להתחבר עם לקוחות ולהגדיל את לוח ההזמנות שלהם.',
          events: 'קבל הזמנות לאירועים עסקיים, חתונות, מסיבות פרטיות, השקות מוצרים ואירועי ילדים.',
          format: 'רשום את ההתמחויות שלך (קלוז-אפ, במה, מנטליזם), קבע מחירים, והצג את המופעים הטובים ביותר שלך.',
        },
        benefits: [
          'הצג את הקסמים שלך עם דמואים בווידאו',
          'הגע לאלפי לקוחות פוטנציאליים',
          'שלוט בלוח הזמנים והמחירים שלך',
          'בנה אמינות עם ביקורות לקוחות',
          'ללא עלויות מראש להצטרפות',
        ],
        faq: [
          { question: 'אילו סוגי קסמים אני יכול לרשום?', answer: 'אתה יכול לרשום כל סגנון: קלוז-אפ, במה, מנטליזם, קסמי קומדיה, מופעי ילדים, בידור עסקי ועוד.' },
          { question: 'האם אני צריך ציוד מקצועי?', answer: 'כדאי שיהיה לך ציוד הופעה משלך. תמונות וסרטוני דמו מקצועיים משפרים משמעותית את נראות הפרופיל שלך.' },
          { question: 'איך עובד התשלום?', answer: 'אתה קובע את המחירים שלך ומקבל תשלום באופן מאובטח דרך Talentr אחרי כל אירוע. עמלת שירות קטנה חלה.' },
          { question: 'אני יכול להציע חבילות שונות?', answer: 'כן! אתה יכול ליצור מספר רישומי גיגים עם חבילות, משכי זמן ומחירים שונים להתאמה לסוגי אירועים שונים.' },
        ],
        crossLinkText: 'ראה איך לקוחות מזמינים קוסמים',
      },
    },
  },

  {
    slug: 'comedian',
    type: 'adult',
    icon: '😂',
    book: {
      en: {
        title: 'Book a Comedian in Israel',
        metaDescription: 'Hire a stand-up comedian for your event in Israel. Professional comedy for corporate events, weddings, and private parties on Talentr.',
        h1: 'Book a Stand-Up Comedian for Your Event',
        heroDescription: 'Find professional comedians for corporate events, weddings, and private parties across Israel.',
        descriptionBlock: {
          whatIsIt: 'A professional comedian delivers custom comedy sets that entertain your guests and create memorable moments.',
          events: 'Corporate events, team-building, weddings, milestone birthdays, holiday parties, and private celebrations.',
          format: 'Stand-up sets, roast-style comedy, MC/hosting with comedy, and interactive comedy shows. Content tailored to your audience.',
        },
        benefits: [
          'Preview comedians with video clips',
          'Content customized to your event',
          'Clean or adult comedy options',
          'Professional MC and hosting available',
          'Perfect for corporate team events',
        ],
        faq: [
          { question: 'Can the comedian customize their set for my event?', answer: 'Yes! Most comedians on Talentr offer personalized sets. Share details about your guests and event theme for a tailored experience.' },
          { question: 'Is the comedy clean or adult-oriented?', answer: 'Both options are available. Each comedian\'s profile indicates their style. You can discuss content boundaries directly before booking.' },
          { question: 'How long is a typical comedy set?', answer: 'Sets range from 15-minute openers to full 45-60 minute shows. Many comedians also offer MC/hosting for the entire event.' },
          { question: 'Do comedians perform in multiple languages?', answer: 'Many of our comedians perform in Hebrew, English, Russian, and other languages. Check each profile for language availability.' },
        ],
        crossLinkText: 'Are you a comedian? Join Talentr',
      },
      he: {
        title: 'הזמן קומיקאי בישראל',
        metaDescription: 'שכור סטנדאפיסט לאירוע שלך בישראל. קומדיה מקצועית לאירועים עסקיים, חתונות ומסיבות פרטיות ב-Talentr.',
        h1: 'הזמן סטנדאפיסט לאירוע שלך',
        heroDescription: 'מצא קומיקאים מקצועיים לאירועים עסקיים, חתונות ומסיבות פרטיות בכל רחבי ישראל.',
        descriptionBlock: {
          whatIsIt: 'קומיקאי מקצועי מעביר סטים מותאמים שמבדרים את האורחים ויוצרים רגעים בלתי נשכחים.',
          events: 'אירועים עסקיים, גיבוש צוות, חתונות, ימי הולדת משמעותיים, מסיבות חג וחגיגות פרטיות.',
          format: 'סטים של סטנדאפ, קומדיה בסגנון רוסט, הנחיה עם קומדיה, ומופעי קומדיה אינטראקטיביים. התוכן מותאם לקהל שלך.',
        },
        benefits: [
          'צפה בקליפים של קומיקאים מראש',
          'תוכן מותאם אישית לאירוע שלך',
          'אפשרויות קומדיה נקייה או למבוגרים',
          'הנחיה מקצועית זמינה',
          'מושלם לאירועי צוות עסקיים',
        ],
        faq: [
          { question: 'האם הקומיקאי יכול להתאים את הסט לאירוע שלי?', answer: 'כן! רוב הקומיקאים ב-Talentr מציעים סטים מותאמים אישית. שתף פרטים על האורחים ונושא האירוע לחוויה מותאמת.' },
          { question: 'האם הקומדיה נקייה או למבוגרים?', answer: 'שתי האפשרויות זמינות. הפרופיל של כל קומיקאי מציין את הסגנון שלו. ניתן לדון בגבולות התוכן ישירות לפני ההזמנה.' },
          { question: 'כמה זמן נמשך סט קומדיה טיפוסי?', answer: 'סטים נעים מפתיחות של 15 דקות ועד מופעים מלאים של 45-60 דקות. קומיקאים רבים מציעים גם הנחיה לכל האירוע.' },
          { question: 'האם קומיקאים מופיעים בכמה שפות?', answer: 'קומיקאים רבים שלנו מופיעים בעברית, אנגלית, רוסית ושפות נוספות. בדוק כל פרופיל לזמינות שפות.' },
        ],
        crossLinkText: 'אתה קומיקאי? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Comedian on Talentr',
        metaDescription: 'Join Talentr as a comedian. Get booked for events, showcase your comedy, and grow your performance career in Israel.',
        h1: 'Launch Your Comedy Career on Talentr',
        heroDescription: 'Join Israel\'s top platform for comedians. Get discovered, get booked, and get paid for doing what you love.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects comedians with event organizers looking for professional entertainment across Israel.',
          events: 'Get booked for corporate events, weddings, private parties, holiday celebrations, and comedy nights.',
          format: 'Create your profile, upload performance clips, set your rates, and start receiving booking requests.',
        },
        benefits: [
          'Upload comedy clips to showcase your style',
          'Reach corporate and private event planners',
          'Full control over your rates and schedule',
          'Build your fanbase with client reviews',
          'Zero cost to get started',
        ],
        faq: [
          { question: 'Do I need professional experience?', answer: 'While professional experience helps, we welcome comedians at all career stages. Strong demo videos and a complete profile are key.' },
          { question: 'Can I offer different types of shows?', answer: 'Yes! Create separate gig listings for stand-up, MC hosting, roasts, corporate comedy, and other formats.' },
          { question: 'How do clients find me?', answer: 'Clients search by category, location, and budget. Complete profiles with videos and reviews rank higher in results.' },
          { question: 'What languages should I perform in?', answer: 'List all languages you can perform in. Hebrew and English are most requested, but Russian and Arabic performers are also in demand.' },
        ],
        crossLinkText: 'See how clients book comedians',
      },
      he: {
        title: 'הפוך לקומיקאי ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כקומיקאי. קבל הזמנות לאירועים, הצג את הקומדיה שלך, וקדם את הקריירה שלך בישראל.',
        h1: 'השק את קריירת הקומדיה שלך ב-Talentr',
        heroDescription: 'הצטרף לפלטפורמה המובילה בישראל לקומיקאים. תתגלה, קבל הזמנות, וקבל תשלום על מה שאתה אוהב.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר קומיקאים עם מארגני אירועים שמחפשים בידור מקצועי בכל ישראל.',
          events: 'קבל הזמנות לאירועים עסקיים, חתונות, מסיבות פרטיות, חגיגות חג ולילות קומדיה.',
          format: 'צור את הפרופיל שלך, העלה קליפים של הופעות, קבע את המחירים שלך, והתחל לקבל בקשות הזמנה.',
        },
        benefits: [
          'העלה קליפי קומדיה להצגת הסגנון שלך',
          'הגע למארגני אירועים עסקיים ופרטיים',
          'שליטה מלאה על המחירים והלוח זמנים שלך',
          'בנה את קהל המעריצים שלך עם ביקורות לקוחות',
          'ללא עלות להתחלה',
        ],
        faq: [
          { question: 'האם אני צריך ניסיון מקצועי?', answer: 'בעוד שניסיון מקצועי עוזר, אנחנו מקבלים קומיקאים בכל שלבי הקריירה. סרטוני דמו חזקים ופרופיל מלא הם המפתח.' },
          { question: 'אני יכול להציע סוגי מופעים שונים?', answer: 'כן! צור רישומי גיג נפרדים לסטנדאפ, הנחיה, רוסטים, קומדיה עסקית ופורמטים אחרים.' },
          { question: 'איך לקוחות מוצאים אותי?', answer: 'לקוחות מחפשים לפי קטגוריה, מיקום ותקציב. פרופילים מלאים עם סרטונים וביקורות מדורגים גבוה יותר.' },
          { question: 'באילו שפות כדאי להופיע?', answer: 'רשום את כל השפות שאתה יכול להופיע בהן. עברית ואנגלית הם הנדרשים ביותר, אבל גם מבצעים ברוסית וערבית מבוקשים.' },
        ],
        crossLinkText: 'ראה איך לקוחות מזמינים קומיקאים',
      },
    },
  },

  {
    slug: 'singer',
    type: 'adult',
    icon: '🎤',
    book: {
      en: {
        title: 'Book a Singer in Israel',
        metaDescription: 'Hire professional singers and vocalists for your event in Israel. Live music for weddings, corporate events, and private parties on Talentr.',
        h1: 'Book a Professional Singer for Your Event',
        heroDescription: 'Find talented singers and vocalists for live performances at weddings, parties, and events across Israel.',
        descriptionBlock: {
          whatIsIt: 'A professional singer brings live vocal performances that elevate any event — from intimate acoustic sets to full band performances.',
          events: 'Weddings, engagement parties, corporate events, cocktail hours, memorial ceremonies, and private celebrations.',
          format: 'Solo acoustic, with backing tracks, or with a full band. Genres include pop, jazz, soul, Middle Eastern, classical, and more.',
        },
        benefits: [
          'Listen to audio samples before booking',
          'Wide range of genres and styles',
          'Solo or with band options',
          'Custom song lists for your event',
          'Professional sound equipment included',
        ],
        faq: [
          { question: 'What genres do singers cover?', answer: 'Our singers cover pop, rock, jazz, soul, R&B, classical, Middle Eastern, Israeli hits, and more. Each profile lists their repertoire.' },
          { question: 'Can the singer learn specific songs for my event?', answer: 'Most singers are happy to learn special requests. Discuss specific songs when you contact them to confirm availability.' },
          { question: 'Does the singer provide sound equipment?', answer: 'Many singers come with their own PA system and microphones. Equipment details are listed on each profile. Additional setup can be arranged.' },
          { question: 'Can I book a singer with a band?', answer: 'Yes! Many singers offer solo, duo, or full band configurations. Pricing varies by ensemble size.' },
        ],
        crossLinkText: 'Are you a singer? Join Talentr',
      },
      he: {
        title: 'הזמן זמר בישראל',
        metaDescription: 'שכור זמרים וווקליסטים מקצועיים לאירוע שלך בישראל. מוזיקה חיה לחתונות, אירועים עסקיים ומסיבות פרטיות ב-Talentr.',
        h1: 'הזמן זמר מקצועי לאירוע שלך',
        heroDescription: 'מצא זמרים וווקליסטים מוכשרים להופעות חיות בחתונות, מסיבות ואירועים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'זמר מקצועי מביא הופעות שירה חיות שמעלות כל אירוע — מסטים אקוסטיים אינטימיים ועד הופעות עם להקה מלאה.',
          events: 'חתונות, מסיבות אירוסין, אירועים עסקיים, שעות קוקטייל, טקסי זיכרון וחגיגות פרטיות.',
          format: 'סולו אקוסטי, עם פסקולים או עם להקה מלאה. ז\'אנרים כוללים פופ, ג\'אז, סול, מזרחית, קלאסית ועוד.',
        },
        benefits: [
          'הקשב לדוגמאות שמע לפני ההזמנה',
          'מגוון רחב של ז\'אנרים וסגנונות',
          'אפשרויות סולו או עם להקה',
          'רשימות שירים מותאמות לאירוע שלך',
          'ציוד הגברה מקצועי כלול',
        ],
        faq: [
          { question: 'אילו ז\'אנרים הזמרים מכסים?', answer: 'הזמרים שלנו מכסים פופ, רוק, ג\'אז, סול, R&B, קלאסי, מזרחי, להיטים ישראליים ועוד. כל פרופיל מפרט את הרפרטואר.' },
          { question: 'האם הזמר יכול ללמוד שירים ספציפיים לאירוע שלי?', answer: 'רוב הזמרים שמחים ללמוד בקשות מיוחדות. דון בשירים ספציפיים כשאתה יוצר קשר לאישור זמינות.' },
          { question: 'האם הזמר מספק ציוד הגברה?', answer: 'זמרים רבים מגיעים עם מערכת PA ומיקרופונים משלהם. פרטי הציוד מפורטים בכל פרופיל. ניתן לסדר ציוד נוסף.' },
          { question: 'אפשר להזמין זמר עם להקה?', answer: 'כן! זמרים רבים מציעים הרכבי סולו, דואו או להקה מלאה. המחירים משתנים לפי גודל ההרכב.' },
        ],
        crossLinkText: 'אתה זמר? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Singer on Talentr',
        metaDescription: 'Join Talentr as a singer. Get booked for live performances at events across Israel and grow your music career.',
        h1: 'Grow Your Singing Career on Talentr',
        heroDescription: 'Create your singer profile, share your music, and get booked for events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects singers with clients looking for live vocal performances for weddings, events, and celebrations.',
          events: 'Get booked for weddings, corporate events, private parties, cocktail hours, and special ceremonies.',
          format: 'Upload audio/video demos, list your genres and repertoire, set your rates, and manage your bookings.',
        },
        benefits: [
          'Share audio and video demos on your profile',
          'Get discovered by event planners',
          'Set your own rates and availability',
          'Offer different performance configurations',
          'Free to join — pay only when booked',
        ],
        faq: [
          { question: 'What do I need to create a profile?', answer: 'High-quality audio or video demos, professional photos, your repertoire list, and a description of your performance style.' },
          { question: 'Can I list multiple genres?', answer: 'Yes! List all genres you perform and create separate gig listings for different performance types (acoustic, with band, etc.).' },
          { question: 'Do I need my own equipment?', answer: 'Having your own microphone and basic PA is recommended but not required. Many clients provide venue sound systems.' },
          { question: 'How do I stand out from other singers?', answer: 'Professional demos, a complete profile with photos, active response to inquiries, and collecting client reviews all help you rank higher.' },
        ],
        crossLinkText: 'See how clients book singers',
      },
      he: {
        title: 'הפוך לזמר ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כזמר. קבל הזמנות להופעות חיות באירועים בכל ישראל וקדם את קריירת המוזיקה שלך.',
        h1: 'קדם את קריירת הזמרה שלך ב-Talentr',
        heroDescription: 'צור פרופיל זמר, שתף את המוזיקה שלך, וקבל הזמנות לאירועים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר זמרים עם לקוחות שמחפשים הופעות שירה חיות לחתונות, אירועים וחגיגות.',
          events: 'קבל הזמנות לחתונות, אירועים עסקיים, מסיבות פרטיות, שעות קוקטייל וטקסים מיוחדים.',
          format: 'העלה דמואים של אודיו/וידאו, רשום את הז\'אנרים והרפרטואר שלך, קבע מחירים ונהל הזמנות.',
        },
        benefits: [
          'שתף דמואים של אודיו ווידאו בפרופיל שלך',
          'תתגלה על ידי מארגני אירועים',
          'קבע את המחירים והזמינות שלך',
          'הצע הרכבי הופעה שונים',
          'חינם להצטרפות — שלם רק כשמזמינים',
        ],
        faq: [
          { question: 'מה אני צריך כדי ליצור פרופיל?', answer: 'דמואים איכותיים של אודיו או וידאו, תמונות מקצועיות, רשימת רפרטואר ותיאור של סגנון ההופעה שלך.' },
          { question: 'אני יכול לרשום כמה ז\'אנרים?', answer: 'כן! רשום את כל הז\'אנרים שאתה מבצע וצור רישומי גיג נפרדים לסוגי הופעות שונים (אקוסטי, עם להקה וכו\').' },
          { question: 'האם אני צריך ציוד משלי?', answer: 'מומלץ שיהיה לך מיקרופון ו-PA בסיסי אבל זה לא חובה. לקוחות רבים מספקים מערכות הגברה של המקום.' },
          { question: 'איך אני בולט מזמרים אחרים?', answer: 'דמואים מקצועיים, פרופיל מלא עם תמונות, תגובה פעילה לפניות ואיסוף ביקורות לקוחות עוזרים לך לדרג גבוה יותר.' },
        ],
        crossLinkText: 'ראה איך לקוחות מזמינים זמרים',
      },
    },
  },

  {
    slug: 'bartender',
    type: 'adult',
    icon: '🍸',
    book: {
      en: {
        title: 'Book a Bartender in Israel',
        metaDescription: 'Hire professional bartenders and mixologists for your event in Israel. Cocktail bars, flair bartending, and bar catering on Talentr.',
        h1: 'Book a Professional Bartender for Your Event',
        heroDescription: 'Find skilled bartenders and mixologists for cocktail bars, flair shows, and full bar service at your event.',
        descriptionBlock: {
          whatIsIt: 'A professional bartender brings a premium bar experience to your event with crafted cocktails, flair bartending, and full bar management.',
          events: 'Weddings, corporate events, house parties, product launches, cocktail evenings, and private celebrations.',
          format: 'Mobile bar setup, craft cocktails, flair bartending shows, and full drink service. All equipment and glassware provided.',
        },
        benefits: [
          'Professional mobile bar setup included',
          'Custom cocktail menus for your event',
          'Flair bartending shows available',
          'Full bar management and staff',
          'Licensed and insured professionals',
        ],
        faq: [
          { question: 'Does the bartender provide the bar setup?', answer: 'Most bartenders on Talentr offer a full mobile bar package including bar counter, glassware, tools, and garnishes. Specific inclusions are listed per profile.' },
          { question: 'Can I create a custom cocktail menu?', answer: 'Yes! Work with your bartender to design a signature cocktail menu tailored to your event theme and preferences.' },
          { question: 'Do I need to provide the alcohol?', answer: 'This varies by bartender. Some offer all-inclusive packages with spirits, while others work with alcohol you provide. Check each listing.' },
          { question: 'Are the bartenders licensed?', answer: 'All bartenders on Talentr are verified professionals. Check individual profiles for licensing and insurance details.' },
        ],
        crossLinkText: 'Are you a bartender? Join Talentr',
      },
      he: {
        title: 'הזמן ברמן בישראל',
        metaDescription: 'שכור ברמנים ומיקסולוגים מקצועיים לאירוע שלך בישראל. ברים לקוקטיילים, ברמנות פלייר וקייטרינג בר ב-Talentr.',
        h1: 'הזמן ברמן מקצועי לאירוע שלך',
        heroDescription: 'מצא ברמנים ומיקסולוגים מיומנים לברי קוקטיילים, מופעי פלייר ושירות בר מלא באירוע שלך.',
        descriptionBlock: {
          whatIsIt: 'ברמן מקצועי מביא חוויית בר פרימיום לאירוע שלך עם קוקטיילים יצירתיים, ברמנות פלייר וניהול בר מלא.',
          events: 'חתונות, אירועים עסקיים, מסיבות בית, השקות מוצרים, ערבי קוקטיילים וחגיגות פרטיות.',
          format: 'הקמת בר נייד, קוקטיילים יצירתיים, מופעי ברמנות פלייר ושירות משקאות מלא. כל הציוד והכוסות מסופקים.',
        },
        benefits: [
          'הקמת בר נייד מקצועי כלולה',
          'תפריטי קוקטיילים מותאמים לאירוע שלך',
          'מופעי ברמנות פלייר זמינים',
          'ניהול בר וצוות מלא',
          'מקצוענים מורשים ומבוטחים',
        ],
        faq: [
          { question: 'האם הברמן מספק את הקמת הבר?', answer: 'רוב הברמנים ב-Talentr מציעים חבילת בר נייד מלאה כולל דלפק בר, כוסות, כלים וגרנישים. הפרטים מפורטים בכל פרופיל.' },
          { question: 'אפשר ליצור תפריט קוקטיילים מותאם?', answer: 'כן! עבוד עם הברמן שלך לעיצוב תפריט קוקטיילים ייחודי מותאם לנושא האירוע והעדפותיך.' },
          { question: 'האם אני צריך לספק את האלכוהול?', answer: 'זה משתנה לפי ברמן. חלקם מציעים חבילות all-inclusive עם משקאות, בעוד אחרים עובדים עם אלכוהול שאתה מספק. בדוק כל רישום.' },
          { question: 'האם הברמנים מורשים?', answer: 'כל הברמנים ב-Talentr הם מקצוענים מאומתים. בדוק פרופילים בודדים לפרטי רישוי וביטוח.' },
        ],
        crossLinkText: 'אתה ברמן? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Bartender on Talentr',
        metaDescription: 'Join Talentr as a bartender. Get booked for events, showcase your cocktail skills, and grow your bartending career in Israel.',
        h1: 'Grow Your Bartending Career on Talentr',
        heroDescription: 'Create your bartender profile, showcase your cocktail expertise, and get booked for events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects bartenders and mixologists with clients looking for professional bar service at their events.',
          events: 'Get booked for weddings, corporate events, house parties, product launches, and private celebrations.',
          format: 'List your specialties, bar setup options, cocktail menus, and set your own rates and availability.',
        },
        benefits: [
          'Showcase your cocktail creations',
          'Reach premium event clients',
          'Set your own rates and packages',
          'Build your brand with reviews',
          'Free to create your profile',
        ],
        faq: [
          { question: 'Do I need my own bar equipment?', answer: 'Having your own mobile bar setup is a plus but not required. Some clients provide venue bars. List what equipment you bring.' },
          { question: 'Can I offer different service levels?', answer: 'Yes! Create packages for basic bartending, craft cocktail service, flair shows, and full bar management.' },
          { question: 'How is payment handled?', answer: 'You set your rates and receive secure payment through Talentr after each event. Tips are kept by you.' },
          { question: 'Do I need certifications?', answer: 'Professional certifications are recommended and can be displayed on your profile. They help build client trust.' },
        ],
        crossLinkText: 'See how clients book bartenders',
      },
      he: {
        title: 'הפוך לברמן ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כברמן. קבל הזמנות לאירועים, הצג את מיומנויות הקוקטיילים שלך, וקדם את הקריירה שלך בישראל.',
        h1: 'קדם את קריירת הברמנות שלך ב-Talentr',
        heroDescription: 'צור פרופיל ברמן, הצג את המומחיות שלך בקוקטיילים, וקבל הזמנות לאירועים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר ברמנים ומיקסולוגים עם לקוחות שמחפשים שירות בר מקצועי באירועים שלהם.',
          events: 'קבל הזמנות לחתונות, אירועים עסקיים, מסיבות בית, השקות מוצרים וחגיגות פרטיות.',
          format: 'רשום את ההתמחויות שלך, אפשרויות הקמת בר, תפריטי קוקטיילים, וקבע את המחירים והזמינות שלך.',
        },
        benefits: [
          'הצג את יצירות הקוקטיילים שלך',
          'הגע ללקוחות אירועים פרימיום',
          'קבע את המחירים והחבילות שלך',
          'בנה את המותג שלך עם ביקורות',
          'חינם ליצירת הפרופיל שלך',
        ],
        faq: [
          { question: 'האם אני צריך ציוד בר משלי?', answer: 'הקמת בר נייד משלך היא יתרון אבל לא חובה. חלק מהלקוחות מספקים ברי מקום. רשום איזה ציוד אתה מביא.' },
          { question: 'אני יכול להציע רמות שירות שונות?', answer: 'כן! צור חבילות לברמנות בסיסית, שירות קוקטיילים יצירתי, מופעי פלייר וניהול בר מלא.' },
          { question: 'איך מתבצע התשלום?', answer: 'אתה קובע את המחירים שלך ומקבל תשלום מאובטח דרך Talentr אחרי כל אירוע. טיפים נשארים אצלך.' },
          { question: 'האם אני צריך הסמכות?', answer: 'הסמכות מקצועיות מומלצות וניתן להציגן בפרופיל שלך. הן עוזרות לבנות אמון לקוחות.' },
        ],
        crossLinkText: 'ראה איך לקוחות מזמינים ברמנים',
      },
    },
  },

  // ===== KIDS CATEGORIES =====
  {
    slug: 'kids-animator',
    type: 'kids',
    icon: '🎪',
    book: {
      en: {
        title: 'Book a Kids Animator in Israel',
        metaDescription: 'Find and book the best kids entertainers and animators for birthday parties and children\'s events in Israel on Talentr.',
        h1: 'Book a Kids Animator for Your Child\'s Party',
        heroDescription: 'Find fun, professional kids animators for birthday parties, school events, and family celebrations.',
        descriptionBlock: {
          whatIsIt: 'A kids animator leads interactive entertainment including games, dancing, balloon art, and themed activities that keep children engaged and happy.',
          events: 'Birthday parties, school events, family days, holiday celebrations, daycare events, and community gatherings.',
          format: 'Interactive games, music and dancing, balloon twisting, face painting coordination, and themed character performances.',
        },
        benefits: [
          'Experienced with children of all ages',
          'Themed party entertainment available',
          'All props and materials included',
          'Safe, verified professionals',
          'Flexible packages for any party size',
        ],
        faq: [
          { question: 'What age groups do animators work with?', answer: 'Our animators work with children from ages 2-12. Each profile specifies their preferred age ranges and specialties.' },
          { question: 'Can the animator do a themed party?', answer: 'Yes! Many animators offer themed entertainment including princesses, superheroes, pirates, and more. Check individual profiles for options.' },
          { question: 'How long is a typical kids animation session?', answer: 'Sessions typically run 1-3 hours. Most animators offer flexible packages that can be customized to your party schedule.' },
          { question: 'What activities are included?', answer: 'Activities vary by animator but typically include interactive games, music, dancing, balloon art, and sometimes face painting or magic tricks.' },
        ],
        crossLinkText: 'Are you a kids animator? Join Talentr',
      },
      he: {
        title: 'הזמן אנימטור לילדים בישראל',
        metaDescription: 'מצא והזמן את המפעילים והאנימטורים הטובים ביותר למסיבות ילדים ואירועי ילדים בישראל ב-Talentr.',
        h1: 'הזמן אנימטור למסיבת הילדים שלך',
        heroDescription: 'מצא אנימטורים מקצועיים ומהנים למסיבות יום הולדת, אירועי בית ספר וחגיגות משפחתיות.',
        descriptionBlock: {
          whatIsIt: 'אנימטור לילדים מוביל בידור אינטראקטיבי כולל משחקים, ריקוד, בלונים ופעילויות נושאיות שמשאירים ילדים מרותקים ושמחים.',
          events: 'מסיבות יום הולדת, אירועי בית ספר, ימי משפחה, חגיגות חג, אירועי גן ומפגשים קהילתיים.',
          format: 'משחקים אינטראקטיביים, מוזיקה וריקודים, פיתול בלונים, תיאום ציורי פנים והופעות דמויות נושאיות.',
        },
        benefits: [
          'ניסיון עם ילדים בכל הגילאים',
          'בידור למסיבות נושאיות זמין',
          'כל האביזרים והחומרים כלולים',
          'מקצוענים בטוחים ומאומתים',
          'חבילות גמישות לכל גודל מסיבה',
        ],
        faq: [
          { question: 'עם אילו קבוצות גיל אנימטורים עובדים?', answer: 'האנימטורים שלנו עובדים עם ילדים בגילאי 2-12. כל פרופיל מפרט את טווחי הגיל המועדפים וההתמחויות.' },
          { question: 'האם האנימטור יכול לעשות מסיבה נושאית?', answer: 'כן! אנימטורים רבים מציעים בידור נושאי כולל נסיכות, גיבורי-על, פיראטים ועוד. בדוק פרופילים בודדים לאפשרויות.' },
          { question: 'כמה זמן נמשכת הפעלה טיפוסית?', answer: 'הפעלות נמשכות בדרך כלל 1-3 שעות. רוב האנימטורים מציעים חבילות גמישות שניתן להתאים ללוח הזמנים של המסיבה.' },
          { question: 'אילו פעילויות כלולות?', answer: 'הפעילויות משתנות לפי אנימטור אבל כוללות בדרך כלל משחקים אינטראקטיביים, מוזיקה, ריקודים, אמנות בלונים ולפעמים ציורי פנים או טריקי קסמים.' },
        ],
        crossLinkText: 'אתה אנימטור לילדים? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Kids Animator on Talentr',
        metaDescription: 'Join Talentr as a kids animator. Get booked for children\'s parties and events across Israel.',
        h1: 'Start Entertaining Kids on Talentr',
        heroDescription: 'Create your kids animator profile and get booked for birthday parties and children\'s events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects kids animators with parents looking for professional children\'s entertainment for their events.',
          events: 'Get booked for birthday parties, school events, family days, holiday celebrations, and community gatherings.',
          format: 'Showcase your themes, activities, and performance style. Set rates and manage your booking calendar.',
        },
        benefits: [
          'Access to a growing market of parents',
          'Showcase your unique entertainment style',
          'Flexible scheduling around your availability',
          'Build a strong review portfolio',
          'Free to join and list your services',
        ],
        faq: [
          { question: 'What qualifications do I need?', answer: 'Experience working with children is essential. Relevant certifications (first aid, child safety) are recommended and boost your profile.' },
          { question: 'Can I offer themed packages?', answer: 'Yes! Create separate listings for different themes (princess, superhero, pirate, etc.) with custom pricing.' },
          { question: 'How much can I earn?', answer: 'Rates vary by location, duration, and package type. You set your own prices and have full control over your earnings.' },
          { question: 'Do I need to provide props and materials?', answer: 'Most animators provide their own props, costumes, and activity materials. List what you include in your service.' },
        ],
        crossLinkText: 'See how parents book kids animators',
      },
      he: {
        title: 'הפוך לאנימטור ילדים ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כאנימטור ילדים. קבל הזמנות למסיבות ילדים ואירועים בכל ישראל.',
        h1: 'התחל לבדר ילדים ב-Talentr',
        heroDescription: 'צור פרופיל אנימטור ילדים וקבל הזמנות למסיבות יום הולדת ואירועי ילדים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר אנימטורים לילדים עם הורים שמחפשים בידור ילדים מקצועי לאירועים שלהם.',
          events: 'קבל הזמנות למסיבות יום הולדת, אירועי בית ספר, ימי משפחה, חגיגות חג ומפגשים קהילתיים.',
          format: 'הצג את הנושאים, הפעילויות וסגנון ההופעה שלך. קבע מחירים ונהל את לוח ההזמנות שלך.',
        },
        benefits: [
          'גישה לשוק הולך וגדל של הורים',
          'הצג את סגנון הבידור הייחודי שלך',
          'תזמון גמיש סביב הזמינות שלך',
          'בנה תיק ביקורות חזק',
          'חינם להצטרפות ולרישום השירותים שלך',
        ],
        faq: [
          { question: 'אילו כישורים אני צריך?', answer: 'ניסיון בעבודה עם ילדים הוא חיוני. הסמכות רלוונטיות (עזרה ראשונה, בטיחות ילדים) מומלצות ומחזקות את הפרופיל שלך.' },
          { question: 'אני יכול להציע חבילות נושאיות?', answer: 'כן! צור רישומים נפרדים לנושאים שונים (נסיכה, גיבור-על, פיראט וכו\') עם תמחור מותאם.' },
          { question: 'כמה אני יכול להרוויח?', answer: 'המחירים משתנים לפי מיקום, משך וסוג חבילה. אתה קובע את המחירים שלך ויש לך שליטה מלאה על ההכנסות שלך.' },
          { question: 'האם אני צריך לספק אביזרים וחומרים?', answer: 'רוב האנימטורים מספקים אביזרים, תחפושות וחומרי פעילות משלהם. רשום מה כלול בשירות שלך.' },
        ],
        crossLinkText: 'ראה איך הורים מזמינים אנימטורים',
      },
    },
  },

  {
    slug: 'face-painter',
    type: 'kids',
    icon: '🎨',
    book: {
      en: {
        title: 'Book a Face Painter in Israel',
        metaDescription: 'Hire professional face painters for kids birthday parties, festivals, and events in Israel. Safe, hypoallergenic paints on Talentr.',
        h1: 'Book a Professional Face Painter for Your Event',
        heroDescription: 'Find talented face painters for birthday parties, school events, and family celebrations with safe, professional-grade paints.',
        descriptionBlock: {
          whatIsIt: 'Professional face painting transforms children into their favorite characters with colorful, safe designs that delight kids and parents alike.',
          events: 'Birthday parties, school fairs, community events, festivals, holiday celebrations, and family days.',
          format: 'Individual face painting, glitter tattoos, arm/hand designs, and full-face transformations using hypoallergenic, water-based paints.',
        },
        benefits: [
          'Safe, hypoallergenic professional paints',
          'Hundreds of designs for all ages',
          'Quick service — minimal wait times',
          'Clean, organized setup',
          'Perfect complement to any kids event',
        ],
        faq: [
          { question: 'Are the face paints safe for children?', answer: 'All our face painters use professional-grade, hypoallergenic, water-based paints that are safe for sensitive skin and easy to remove.' },
          { question: 'How many kids can be painted per hour?', answer: 'Typically 8-15 children per hour depending on design complexity. Simple designs take 3-5 minutes, elaborate ones 8-12 minutes.' },
          { question: 'What designs are available?', answer: 'Designs range from butterflies and superheroes to princesses and animals. Most painters have extensive catalogs and can do custom requests.' },
          { question: 'How long does the face paint last?', answer: 'Professional face paint lasts 4-8 hours under normal conditions. It washes off easily with soap and water.' },
        ],
        crossLinkText: 'Are you a face painter? Join Talentr',
      },
      he: {
        title: 'הזמן ציירת פנים בישראל',
        metaDescription: 'שכור ציירי פנים מקצועיים למסיבות יום הולדת, פסטיבלים ואירועים בישראל. צבעים בטוחים והיפואלרגניים ב-Talentr.',
        h1: 'הזמן צייר פנים מקצועי לאירוע שלך',
        heroDescription: 'מצא ציירי פנים מוכשרים למסיבות יום הולדת, אירועי בית ספר וחגיגות משפחתיות עם צבעים מקצועיים ובטוחים.',
        descriptionBlock: {
          whatIsIt: 'ציור פנים מקצועי הופך ילדים לדמויות האהובות עליהם עם עיצובים צבעוניים ובטוחים שמשמחים ילדים והורים כאחד.',
          events: 'מסיבות יום הולדת, ירידי בית ספר, אירועים קהילתיים, פסטיבלים, חגיגות חג וימי משפחה.',
          format: 'ציור פנים אישי, קעקועי נצנצים, עיצובים על ידיים/זרועות והפיכות פנים מלאות בשימוש בצבעים היפואלרגניים על בסיס מים.',
        },
        benefits: [
          'צבעים מקצועיים בטוחים והיפואלרגניים',
          'מאות עיצובים לכל הגילאים',
          'שירות מהיר — זמני המתנה מינימליים',
          'הקמה נקייה ומאורגנת',
          'השלמה מושלמת לכל אירוע ילדים',
        ],
        faq: [
          { question: 'האם צבעי הפנים בטוחים לילדים?', answer: 'כל ציירי הפנים שלנו משתמשים בצבעים מקצועיים, היפואלרגניים על בסיס מים שבטוחים לעור רגיש וקלים להסרה.' },
          { question: 'כמה ילדים ניתן לצבוע בשעה?', answer: 'בדרך כלל 8-15 ילדים בשעה בהתאם למורכבות העיצוב. עיצובים פשוטים לוקחים 3-5 דקות, מורכבים 8-12 דקות.' },
          { question: 'אילו עיצובים זמינים?', answer: 'עיצובים נעים מפרפרים וגיבורי-על ועד נסיכות וחיות. לרוב הציירים יש קטלוגים נרחבים ויכולים לעשות בקשות מותאמות.' },
          { question: 'כמה זמן מחזיק ציור הפנים?', answer: 'ציור פנים מקצועי מחזיק 4-8 שעות בתנאים רגילים. הוא נשטף בקלות עם סבון ומים.' },
        ],
        crossLinkText: 'אתה צייר פנים? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Face Painter on Talentr',
        metaDescription: 'Join Talentr as a face painter. Get booked for kids parties and events across Israel.',
        h1: 'Start Your Face Painting Career on Talentr',
        heroDescription: 'Create your face painter profile, showcase your designs, and get booked for events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects face painters with parents and event organizers looking for professional face painting entertainment.',
          events: 'Get booked for birthday parties, school events, festivals, community events, and corporate family days.',
          format: 'Upload your design portfolio, set your rates per hour or per event, and manage your booking calendar.',
        },
        benefits: [
          'Showcase your design portfolio',
          'Steady stream of party bookings',
          'Set your own rates and schedule',
          'Grow with client reviews and ratings',
          'Free to join — no monthly fees',
        ],
        faq: [
          { question: 'What supplies do I need?', answer: 'You should have professional face paints (hypoallergenic, water-based), brushes, sponges, glitter, and a design portfolio. List your materials on your profile.' },
          { question: 'How do I price my services?', answer: 'Most face painters charge per hour or per event. You set your own rates based on your experience and the services you offer.' },
          { question: 'Can I offer glitter tattoos and other services?', answer: 'Yes! Create comprehensive listings that include face painting, glitter tattoos, arm designs, and any additional services.' },
          { question: 'How do I build my portfolio?', answer: 'Upload high-quality photos of your best designs. Before/after shots and photos from real events perform especially well.' },
        ],
        crossLinkText: 'See how parents book face painters',
      },
      he: {
        title: 'הפוך לצייר פנים ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כצייר פנים. קבל הזמנות למסיבות ילדים ואירועים בכל ישראל.',
        h1: 'התחל את קריירת ציור הפנים שלך ב-Talentr',
        heroDescription: 'צור פרופיל צייר פנים, הצג את העיצובים שלך, וקבל הזמנות לאירועים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר ציירי פנים עם הורים ומארגני אירועים שמחפשים בידור ציור פנים מקצועי.',
          events: 'קבל הזמנות למסיבות יום הולדת, אירועי בית ספר, פסטיבלים, אירועים קהילתיים וימי משפחה עסקיים.',
          format: 'העלה את תיק העיצובים שלך, קבע מחירים לשעה או לאירוע, ונהל את לוח ההזמנות שלך.',
        },
        benefits: [
          'הצג את תיק העיצובים שלך',
          'זרם קבוע של הזמנות למסיבות',
          'קבע את המחירים והלוח זמנים שלך',
          'צמח עם ביקורות ודירוגי לקוחות',
          'חינם להצטרפות — ללא דמי מנוי חודשיים',
        ],
        faq: [
          { question: 'אילו חומרים אני צריך?', answer: 'כדאי שיהיו לך צבעי פנים מקצועיים (היפואלרגניים, על בסיס מים), מכחולים, ספוגים, נצנצים ותיק עיצובים. רשום את החומרים שלך בפרופיל.' },
          { question: 'איך אני מתמחר את השירותים שלי?', answer: 'רוב ציירי הפנים גובים לשעה או לאירוע. אתה קובע את המחירים שלך בהתאם לניסיון ולשירותים שאתה מציע.' },
          { question: 'אני יכול להציע קעקועי נצנצים ושירותים נוספים?', answer: 'כן! צור רישומים מקיפים שכוללים ציור פנים, קעקועי נצנצים, עיצובי זרועות וכל שירות נוסף.' },
          { question: 'איך אני בונה את תיק העבודות שלי?', answer: 'העלה תמונות איכותיות של העיצובים הטובים ביותר שלך. תמונות לפני/אחרי ותמונות מאירועים אמיתיים מצליחות במיוחד.' },
        ],
        crossLinkText: 'ראה איך הורים מזמינים ציירי פנים',
      },
    },
  },

  {
    slug: 'kids-magician',
    type: 'kids',
    icon: '✨',
    book: {
      en: {
        title: 'Book a Kids Magician in Israel',
        metaDescription: 'Hire a kids magician for birthday parties and children\'s events in Israel. Fun, interactive magic shows for all ages on Talentr.',
        h1: 'Book a Kids Magician for Your Child\'s Party',
        heroDescription: 'Find fun, engaging magicians who specialize in children\'s entertainment for birthday parties and kids events.',
        descriptionBlock: {
          whatIsIt: 'A kids magician delivers age-appropriate, interactive magic shows with comedy, audience participation, and wonder that captivates young audiences.',
          events: 'Birthday parties, school shows, daycare events, family celebrations, holiday parties, and community events.',
          format: 'Interactive magic shows with comedy, balloon animals, puppet shows, and audience participation. Safe and age-appropriate content.',
        },
        benefits: [
          'Age-appropriate, interactive entertainment',
          'Keeps kids engaged for the entire show',
          'Comedy and magic combined',
          'Birthday child becomes the star',
          'All props and materials provided',
        ],
        faq: [
          { question: 'What age is the magic show suitable for?', answer: 'Most kids magicians perform for ages 3-12. Each performer specifies their ideal age range on their profile.' },
          { question: 'How long is a kids magic show?', answer: 'Shows typically last 30-60 minutes. Many magicians include balloon twisting or face painting as add-on activities.' },
          { question: 'Can the birthday child be part of the show?', answer: 'Yes! Most kids magicians make the birthday child the star of the show with special tricks and audience participation.' },
          { question: 'Is the content safe and appropriate?', answer: 'All kids magicians on Talentr perform age-appropriate, family-friendly content. Safety is a top priority in every performance.' },
        ],
        crossLinkText: 'Are you a kids magician? Join Talentr',
      },
      he: {
        title: 'הזמן קוסם לילדים בישראל',
        metaDescription: 'שכור קוסם לילדים למסיבות יום הולדת ואירועי ילדים בישראל. מופעי קסמים מהנים ואינטראקטיביים לכל הגילאים ב-Talentr.',
        h1: 'הזמן קוסם למסיבת הילדים שלך',
        heroDescription: 'מצא קוסמים מהנים ומרתקים שמתמחים בבידור ילדים למסיבות יום הולדת ואירועי ילדים.',
        descriptionBlock: {
          whatIsIt: 'קוסם לילדים מעביר מופעי קסמים אינטראקטיביים מותאמי גיל עם קומדיה, השתתפות קהל ופליאה שמכשפת קהלים צעירים.',
          events: 'מסיבות יום הולדת, מופעי בית ספר, אירועי גן, חגיגות משפחתיות, מסיבות חג ואירועים קהילתיים.',
          format: 'מופעי קסמים אינטראקטיביים עם קומדיה, חיות בלונים, מופעי בובות והשתתפות קהל. תוכן בטוח ומותאם לגיל.',
        },
        benefits: [
          'בידור אינטראקטיבי מותאם לגיל',
          'משאיר ילדים מרותקים למשך כל המופע',
          'שילוב של קומדיה וקסמים',
          'ילד יום ההולדת הופך לכוכב',
          'כל האביזרים והחומרים מסופקים',
        ],
        faq: [
          { question: 'לאיזה גיל מתאים מופע הקסמים?', answer: 'רוב קוסמי הילדים מופיעים לגילאי 3-12. כל מבצע מפרט את טווח הגיל האידיאלי בפרופיל שלו.' },
          { question: 'כמה זמן נמשך מופע קסמים לילדים?', answer: 'מופעים נמשכים בדרך כלל 30-60 דקות. קוסמים רבים כוללים פיתול בלונים או ציור פנים כפעילויות נוספות.' },
          { question: 'האם ילד יום ההולדת יכול להיות חלק מהמופע?', answer: 'כן! רוב קוסמי הילדים הופכים את ילד יום ההולדת לכוכב המופע עם טריקים מיוחדים והשתתפות קהל.' },
          { question: 'האם התוכן בטוח ומתאים?', answer: 'כל קוסמי הילדים ב-Talentr מעבירים תוכן מותאם לגיל וידידותי למשפחה. בטיחות היא עדיפות עליונה בכל הופעה.' },
        ],
        crossLinkText: 'אתה קוסם לילדים? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Kids Magician on Talentr',
        metaDescription: 'Join Talentr as a kids magician. Get booked for children\'s parties and events across Israel.',
        h1: 'Start Performing Kids Magic on Talentr',
        heroDescription: 'Create your kids magician profile and get booked for birthday parties and children\'s events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects kids magicians with parents looking for professional, safe, and fun entertainment for their children\'s events.',
          events: 'Get booked for birthday parties, school events, daycare shows, family celebrations, and community events.',
          format: 'Create your profile, upload show videos, list your packages, and start receiving booking requests from parents.',
        },
        benefits: [
          'Growing demand for kids entertainment',
          'Weekend-focused earning opportunities',
          'Build your reputation with parent reviews',
          'Set your own rates and packages',
          'Free to join — no subscription fees',
        ],
        faq: [
          { question: 'Do I need kids-specific experience?', answer: 'Experience performing for children is strongly recommended. Kids shows require different skills than adult performances — energy, patience, and engagement.' },
          { question: 'What should I include in my show?', answer: 'Popular elements include interactive tricks, comedy, balloon animals, audience participation, and making the birthday child the star.' },
          { question: 'How do I get parent reviews?', answer: 'After each event, parents can leave reviews. High-quality performances and professional communication lead to great reviews.' },
          { question: 'Can I also list adult magic shows?', answer: 'Yes! Create separate gig listings for kids shows and adult/corporate shows to reach different audiences.' },
        ],
        crossLinkText: 'See how parents book kids magicians',
      },
      he: {
        title: 'הפוך לקוסם ילדים ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כקוסם ילדים. קבל הזמנות למסיבות ילדים ואירועים בכל ישראל.',
        h1: 'התחל להופיע עם קסמי ילדים ב-Talentr',
        heroDescription: 'צור פרופיל קוסם ילדים וקבל הזמנות למסיבות יום הולדת ואירועי ילדים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר קוסמי ילדים עם הורים שמחפשים בידור מקצועי, בטוח ומהנה לאירועי הילדים שלהם.',
          events: 'קבל הזמנות למסיבות יום הולדת, אירועי בית ספר, מופעי גן, חגיגות משפחתיות ואירועים קהילתיים.',
          format: 'צור את הפרופיל שלך, העלה סרטוני מופע, רשום את החבילות שלך, והתחל לקבל בקשות הזמנה מהורים.',
        },
        benefits: [
          'ביקוש גובר לבידור ילדים',
          'הזדמנויות הכנסה בסופי שבוע',
          'בנה את המוניטין שלך עם ביקורות הורים',
          'קבע את המחירים והחבילות שלך',
          'חינם להצטרפות — ללא דמי מנוי',
        ],
        faq: [
          { question: 'האם אני צריך ניסיון ספציפי עם ילדים?', answer: 'ניסיון בהופעות לילדים מומלץ מאוד. מופעי ילדים דורשים כישורים שונים מהופעות למבוגרים — אנרגיה, סבלנות ומעורבות.' },
          { question: 'מה כדאי לכלול במופע שלי?', answer: 'אלמנטים פופולריים כוללים טריקים אינטראקטיביים, קומדיה, חיות בלונים, השתתפות קהל והפיכת ילד יום ההולדת לכוכב.' },
          { question: 'איך אני מקבל ביקורות מהורים?', answer: 'אחרי כל אירוע, הורים יכולים להשאיר ביקורות. הופעות איכותיות ותקשורת מקצועית מובילות לביקורות מצוינות.' },
          { question: 'אני יכול גם לרשום מופעי קסמים למבוגרים?', answer: 'כן! צור רישומי גיג נפרדים למופעי ילדים ולמופעים למבוגרים/עסקיים כדי להגיע לקהלים שונים.' },
        ],
        crossLinkText: 'ראה איך הורים מזמינים קוסמי ילדים',
      },
    },
  },

  {
    slug: 'dancer',
    type: 'kids',
    icon: '💃',
    book: {
      en: {
        title: 'Book a Dancer in Israel',
        metaDescription: 'Hire professional dancers for events, parties, and celebrations in Israel. Dance performances, workshops, and shows on Talentr.',
        h1: 'Book Professional Dancers for Your Event',
        heroDescription: 'Find talented dancers for performances, workshops, and interactive dance entertainment at your event.',
        descriptionBlock: {
          whatIsIt: 'Professional dancers bring energy and artistry to your event with choreographed performances, interactive workshops, and show-stopping dance acts.',
          events: 'Weddings, birthday parties, corporate events, school shows, cultural celebrations, and kids parties.',
          format: 'Choreographed performances, dance workshops, flash mobs, interactive dance games, and kids dance parties.',
        },
        benefits: [
          'Multiple dance styles available',
          'Solo or group performances',
          'Interactive workshops for guests',
          'Choreography for special moments',
          'Great for kids and adult events',
        ],
        faq: [
          { question: 'What dance styles are available?', answer: 'Our dancers offer hip-hop, contemporary, ballet, Middle Eastern, Latin, breakdancing, and more. Check each profile for specialties.' },
          { question: 'Can dancers lead a workshop for guests?', answer: 'Yes! Many dancers offer interactive workshops where your guests learn basic choreography or dance moves as a fun group activity.' },
          { question: 'How many dancers can I book?', answer: 'You can book solo performers, duos, or full dance groups. Pricing varies by the number of performers.' },
          { question: 'Can dancers perform for kids parties?', answer: 'Absolutely! Many dancers specialize in kids entertainment with age-appropriate dance games, music, and interactive activities.' },
        ],
        crossLinkText: 'Are you a dancer? Join Talentr',
      },
      he: {
        title: 'הזמן רקדן בישראל',
        metaDescription: 'שכור רקדנים מקצועיים לאירועים, מסיבות וחגיגות בישראל. הופעות ריקוד, סדנאות ומופעים ב-Talentr.',
        h1: 'הזמן רקדנים מקצועיים לאירוע שלך',
        heroDescription: 'מצא רקדנים מוכשרים להופעות, סדנאות ובידור ריקוד אינטראקטיבי באירוע שלך.',
        descriptionBlock: {
          whatIsIt: 'רקדנים מקצועיים מביאים אנרגיה ואמנות לאירוע שלך עם הופעות כוריאוגרפיות, סדנאות אינטראקטיביות ומופעי ריקוד.',
          events: 'חתונות, מסיבות יום הולדת, אירועים עסקיים, מופעי בית ספר, חגיגות תרבותיות ומסיבות ילדים.',
          format: 'הופעות כוריאוגרפיות, סדנאות ריקוד, פלאש מובים, משחקי ריקוד אינטראקטיביים ומסיבות ריקוד לילדים.',
        },
        benefits: [
          'מגוון סגנונות ריקוד זמינים',
          'הופעות סולו או קבוצתיות',
          'סדנאות אינטראקטיביות לאורחים',
          'כוריאוגרפיה לרגעים מיוחדים',
          'מצוין לאירועי ילדים ומבוגרים',
        ],
        faq: [
          { question: 'אילו סגנונות ריקוד זמינים?', answer: 'הרקדנים שלנו מציעים היפ-הופ, עכשווי, בלט, מזרחי, לטיני, ברייקדאנס ועוד. בדוק כל פרופיל להתמחויות.' },
          { question: 'האם רקדנים יכולים להוביל סדנה לאורחים?', answer: 'כן! רקדנים רבים מציעים סדנאות אינטראקטיביות שבהן האורחים לומדים כוריאוגרפיה בסיסית כפעילות קבוצתית מהנה.' },
          { question: 'כמה רקדנים אפשר להזמין?', answer: 'ניתן להזמין מבצעים סולו, דואו או קבוצות ריקוד מלאות. המחירים משתנים לפי מספר המבצעים.' },
          { question: 'האם רקדנים מופיעים במסיבות ילדים?', answer: 'בהחלט! רקדנים רבים מתמחים בבידור ילדים עם משחקי ריקוד, מוזיקה ופעילויות אינטראקטיביות מותאמות לגיל.' },
        ],
        crossLinkText: 'אתה רקדן? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Dancer on Talentr',
        metaDescription: 'Join Talentr as a dancer. Get booked for performances, workshops, and events across Israel.',
        h1: 'Launch Your Dance Career on Talentr',
        heroDescription: 'Create your dancer profile, showcase your performances, and get booked for events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects dancers with clients looking for professional dance performances and entertainment for their events.',
          events: 'Get booked for weddings, corporate events, kids parties, school shows, and cultural celebrations.',
          format: 'Upload performance videos, list your dance styles, set your rates, and start receiving booking requests.',
        },
        benefits: [
          'Showcase your talent with video portfolios',
          'Reach diverse event clients',
          'Offer solo or group performances',
          'Set your own rates and schedule',
          'Free to create your profile',
        ],
        faq: [
          { question: 'What dance styles are in demand?', answer: 'All styles are welcome! Hip-hop, contemporary, Middle Eastern, Latin, and kids dance entertainment are especially popular for events.' },
          { question: 'Can I offer both performances and workshops?', answer: 'Yes! Create separate listings for stage performances, interactive workshops, kids entertainment, and choreography services.' },
          { question: 'Do I need a dance troupe?', answer: 'No! Solo dancers are very popular. You can also connect with other dancers on the platform if you want to offer group performances.' },
          { question: 'How do I get started?', answer: 'Create your profile, upload performance videos, set your rates, and describe your dance style and experience. Complete profiles get more bookings.' },
        ],
        crossLinkText: 'See how clients book dancers',
      },
      he: {
        title: 'הפוך לרקדן ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כרקדן. קבל הזמנות להופעות, סדנאות ואירועים בכל ישראל.',
        h1: 'השק את קריירת הריקוד שלך ב-Talentr',
        heroDescription: 'צור פרופיל רקדן, הצג את ההופעות שלך, וקבל הזמנות לאירועים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר רקדנים עם לקוחות שמחפשים הופעות ריקוד מקצועיות ובידור לאירועים שלהם.',
          events: 'קבל הזמנות לחתונות, אירועים עסקיים, מסיבות ילדים, מופעי בית ספר וחגיגות תרבותיות.',
          format: 'העלה סרטוני הופעות, רשום את סגנונות הריקוד שלך, קבע מחירים והתחל לקבל בקשות הזמנה.',
        },
        benefits: [
          'הצג את הכישרון שלך עם תיקי וידאו',
          'הגע ללקוחות אירועים מגוונים',
          'הצע הופעות סולו או קבוצתיות',
          'קבע את המחירים והלוח זמנים שלך',
          'חינם ליצירת הפרופיל שלך',
        ],
        faq: [
          { question: 'אילו סגנונות ריקוד מבוקשים?', answer: 'כל הסגנונות מתקבלים! היפ-הופ, עכשווי, מזרחי, לטיני ובידור ריקוד לילדים פופולריים במיוחד לאירועים.' },
          { question: 'אני יכול להציע גם הופעות וגם סדנאות?', answer: 'כן! צור רישומים נפרדים להופעות במה, סדנאות אינטראקטיביות, בידור ילדים ושירותי כוריאוגרפיה.' },
          { question: 'האם אני צריך להקת ריקוד?', answer: 'לא! רקדני סולו מאוד פופולריים. אתה יכול גם להתחבר עם רקדנים אחרים בפלטפורמה אם תרצה להציע הופעות קבוצתיות.' },
          { question: 'איך אני מתחיל?', answer: 'צור את הפרופיל שלך, העלה סרטוני הופעות, קבע מחירים, ותאר את סגנון הריקוד והניסיון שלך. פרופילים מלאים מקבלים יותר הזמנות.' },
        ],
        crossLinkText: 'ראה איך לקוחות מזמינים רקדנים',
      },
    },
  },

  {
    slug: 'clown',
    type: 'kids',
    icon: '🤡',
    book: {
      en: {
        title: 'Book a Clown in Israel',
        metaDescription: 'Hire professional clowns for kids birthday parties and events in Israel. Fun, colorful entertainment for children on Talentr.',
        h1: 'Book a Professional Clown for Your Kid\'s Party',
        heroDescription: 'Find fun, professional clowns for birthday parties, school events, and family celebrations that kids will love.',
        descriptionBlock: {
          whatIsIt: 'A professional clown brings laughter and joy to children\'s events with comedy, slapstick, balloon art, games, and interactive entertainment.',
          events: 'Birthday parties, school events, family days, holiday celebrations, community events, and festivals.',
          format: 'Comedy routines, balloon twisting, interactive games, juggling, stilt-walking, and character performances.',
        },
        benefits: [
          'Colorful, engaging entertainment',
          'Keeps children laughing and active',
          'Balloon art and games included',
          'Safe, experienced performers',
          'Packages for all party sizes',
        ],
        faq: [
          { question: 'What does a clown show include?', answer: 'Shows typically include comedy, balloon animals, interactive games, music, and sometimes juggling or magic. Each clown lists their specific offerings.' },
          { question: 'What ages are clown shows best for?', answer: 'Clown shows work best for ages 3-10. Each performer specifies their preferred age ranges on their profile.' },
          { question: 'How long does a clown show last?', answer: 'Shows typically run 45 minutes to 2 hours, including interactive activities. Packages can be customized to your event schedule.' },
          { question: 'Can the clown do balloon animals for each child?', answer: 'Yes! Most clowns include balloon twisting as part of their show. Individual balloon animals for each child can be arranged.' },
        ],
        crossLinkText: 'Are you a clown? Join Talentr',
      },
      he: {
        title: 'הזמן ליצן בישראל',
        metaDescription: 'שכור ליצנים מקצועיים למסיבות יום הולדת ואירועי ילדים בישראל. בידור צבעוני ומהנה לילדים ב-Talentr.',
        h1: 'הזמן ליצן מקצועי למסיבת הילדים שלך',
        heroDescription: 'מצא ליצנים מקצועיים ומהנים למסיבות יום הולדת, אירועי בית ספר וחגיגות משפחתיות שילדים יאהבו.',
        descriptionBlock: {
          whatIsIt: 'ליצן מקצועי מביא צחוק ושמחה לאירועי ילדים עם קומדיה, סלפסטיק, אמנות בלונים, משחקים ובידור אינטראקטיבי.',
          events: 'מסיבות יום הולדת, אירועי בית ספר, ימי משפחה, חגיגות חג, אירועים קהילתיים ופסטיבלים.',
          format: 'שגרות קומדיה, פיתול בלונים, משחקים אינטראקטיביים, ז\'נגלינג, הליכה על קביים והופעות דמויות.',
        },
        benefits: [
          'בידור צבעוני ומרתק',
          'משאיר ילדים צוחקים ופעילים',
          'אמנות בלונים ומשחקים כלולים',
          'מבצעים בטוחים ומנוסים',
          'חבילות לכל גודל מסיבה',
        ],
        faq: [
          { question: 'מה כולל מופע ליצנים?', answer: 'מופעים כוללים בדרך כלל קומדיה, חיות בלונים, משחקים אינטראקטיביים, מוזיקה ולפעמים ז\'נגלינג או קסמים. כל ליצן מפרט את ההצעות הספציפיות שלו.' },
          { question: 'לאיזה גילאים מופעי ליצנים הכי מתאימים?', answer: 'מופעי ליצנים עובדים הכי טוב לגילאי 3-10. כל מבצע מפרט את טווחי הגיל המועדפים בפרופיל שלו.' },
          { question: 'כמה זמן נמשך מופע ליצנים?', answer: 'מופעים נמשכים בדרך כלל 45 דקות עד שעתיים, כולל פעילויות אינטראקטיביות. ניתן להתאים חבילות ללוח הזמנים של האירוע.' },
          { question: 'האם הליצן יכול לעשות חיות בלונים לכל ילד?', answer: 'כן! רוב הליצנים כוללים פיתול בלונים כחלק מהמופע שלהם. ניתן לסדר חיות בלונים אישיות לכל ילד.' },
        ],
        crossLinkText: 'אתה ליצן? הצטרף ל-Talentr',
      },
    },
    become: {
      en: {
        title: 'Become a Clown on Talentr',
        metaDescription: 'Join Talentr as a clown. Get booked for kids parties and events across Israel.',
        h1: 'Start Clowning on Talentr',
        heroDescription: 'Create your clown profile and get booked for birthday parties and children\'s events across Israel.',
        descriptionBlock: {
          whatIsIt: 'Talentr connects clowns with parents looking for fun, professional children\'s entertainment for their events.',
          events: 'Get booked for birthday parties, school events, family days, festivals, and community celebrations.',
          format: 'Create your profile, showcase your act, set your rates, and start receiving booking requests from parents.',
        },
        benefits: [
          'High demand for kids party entertainers',
          'Consistent weekend bookings',
          'Set your own rates and packages',
          'Build reputation through reviews',
          'Free to join and list your services',
        ],
        faq: [
          { question: 'Do I need a professional costume?', answer: 'A professional, clean costume is important. Your profile photos should showcase your character and costume clearly.' },
          { question: 'What skills should I highlight?', answer: 'Highlight balloon twisting, juggling, face painting, comedy, game leadership, and any character performances you offer.' },
          { question: 'Can I also offer other services?', answer: 'Yes! Many clowns also offer face painting, balloon decorations, and magic tricks. Create comprehensive listings.' },
          { question: 'How much can I earn per show?', answer: 'You set your own rates. Earnings vary by location, show duration, and the services included in your package.' },
        ],
        crossLinkText: 'See how parents book clowns',
      },
      he: {
        title: 'הפוך לליצן ב-Talentr',
        metaDescription: 'הצטרף ל-Talentr כליצן. קבל הזמנות למסיבות ילדים ואירועים בכל ישראל.',
        h1: 'התחל להופיע כליצן ב-Talentr',
        heroDescription: 'צור פרופיל ליצן וקבל הזמנות למסיבות יום הולדת ואירועי ילדים בכל ישראל.',
        descriptionBlock: {
          whatIsIt: 'Talentr מחבר ליצנים עם הורים שמחפשים בידור ילדים מקצועי ומהנה לאירועים שלהם.',
          events: 'קבל הזמנות למסיבות יום הולדת, אירועי בית ספר, ימי משפחה, פסטיבלים וחגיגות קהילתיות.',
          format: 'צור את הפרופיל שלך, הצג את המופע שלך, קבע מחירים והתחל לקבל בקשות הזמנה מהורים.',
        },
        benefits: [
          'ביקוש גבוה למבדרי מסיבות ילדים',
          'הזמנות קבועות בסופי שבוע',
          'קבע את המחירים והחבילות שלך',
          'בנה מוניטין דרך ביקורות',
          'חינם להצטרפות ולרישום השירותים שלך',
        ],
        faq: [
          { question: 'האם אני צריך תחפושת מקצועית?', answer: 'תחפושת מקצועית ונקייה חשובה. תמונות הפרופיל שלך צריכות להציג את הדמות והתחפושת שלך בבירור.' },
          { question: 'אילו כישורים כדאי להדגיש?', answer: 'הדגש פיתול בלונים, ז\'נגלינג, ציור פנים, קומדיה, הובלת משחקים וכל הופעות דמויות שאתה מציע.' },
          { question: 'אני יכול להציע גם שירותים אחרים?', answer: 'כן! ליצנים רבים מציעים גם ציור פנים, קישוטי בלונים וטריקי קסמים. צור רישומים מקיפים.' },
          { question: 'כמה אני יכול להרוויח למופע?', answer: 'אתה קובע את המחירים שלך. ההכנסות משתנות לפי מיקום, משך המופע והשירותים הכלולים בחבילה שלך.' },
        ],
        crossLinkText: 'ראה איך הורים מזמינים ליצנים',
      },
    },
  },
];

export function getCategoryBySlug(slug: string): CategoryContent | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getAllCategorySlugs(): CategorySlug[] {
  return CATEGORIES.map(c => c.slug);
}
