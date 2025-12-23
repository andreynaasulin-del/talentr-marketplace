export type Language = 'en' | 'ru' | 'he';

interface Translations {
    [key: string]: {
        en: string;
        ru: string;
        he: string;
    };
}

export const translations: Translations = {
    // ===== NAVBAR & SEARCH =====
    searchPlaceholder: {
        en: 'Search for photographers, DJs, MCs...',
        ru: 'Поиск фотографов, диджеев, ведущих...',
        he: 'חיפוש צלמים, תקליטנים, מנחים...',
    },
    signOut: {
        en: 'Sign Out',
        ru: 'Выйти',
        he: 'התנתק',
    },

    // ===== PRICING =====
    fromPrice: {
        en: 'From',
        ru: 'От',
        he: 'החל מ',
    },


    // ===== CATEGORIES =====
    'Photographer': {
        en: 'Photographer',
        ru: 'Фотограф',
        he: 'צלם',
    },
    'Photographers': {
        en: 'Photographers',
        ru: 'Фотографы',
        he: 'צלמים',
    },
    'Videographer': {
        en: 'Videographer',
        ru: 'Видеограф',
        he: 'צלם וידאו',
    },
    'Videographers': {
        en: 'Videographers',
        ru: 'Видеографы',
        he: 'צלמי וידאו',
    },
    'DJ': {
        en: 'DJ',
        ru: 'Диджей',
        he: 'תקליטן',
    },
    'DJs': {
        en: 'DJs',
        ru: 'Диджеи',
        he: 'תקליטנים',
    },
    'MC': {
        en: 'MC',
        ru: 'Ведущий',
        he: 'מנחה',
    },
    'MCs': {
        en: 'MCs',
        ru: 'Ведущие',
        he: 'מנחים',
    },
    'Magician': {
        en: 'Magician',
        ru: 'Фокусник',
        he: 'קוסם',
    },
    'Magicians': {
        en: 'Magicians',
        ru: 'Фокусники',
        he: 'קוסמים',
    },
    'Singer': {
        en: 'Singer',
        ru: 'Певец',
        he: 'זמר',
    },
    'Singers': {
        en: 'Singers',
        ru: 'Певцы',
        he: 'זמרים',
    },
    'Musician': {
        en: 'Musician',
        ru: 'Музыкант',
        he: 'נגן',
    },
    'Musicians': {
        en: 'Musicians',
        ru: 'Музыканты',
        he: 'נגנים',
    },
    'Comedian': {
        en: 'Comedian',
        ru: 'Комик',
        he: 'קומיקאי',
    },
    'Comedians': {
        en: 'Comedians',
        ru: 'Комики',
        he: 'קומיקאים',
    },
    'Dancer': {
        en: 'Dancer',
        ru: 'Танцор',
        he: 'רקדן',
    },
    'Dancers': {
        en: 'Dancers',
        ru: 'Танцоры',
        he: 'רקדנים',
    },
    'Bartender': {
        en: 'Bartender',
        ru: 'Бармен',
        he: 'ברמן',
    },
    'Bartenders': {
        en: 'Bartenders',
        ru: 'Бармены',
        he: 'ברמנים',
    },
    'Bar Show': {
        en: 'Bar Show',
        ru: 'Барное шоу',
        he: 'מופע בר',
    },
    'Bar Shows': {
        en: 'Bar Shows',
        ru: 'Барные шоу',
        he: 'מופעי בר',
    },
    'Event Decor': {
        en: 'Event Decor',
        ru: 'Декор',
        he: 'עיצוב אירועים',
    },
    'Kids Animator': {
        en: 'Kids Animator',
        ru: 'Аниматор',
        he: 'аниматор לילדים',
    },
    'Kids Animators': {
        en: 'Kids Animators',
        ru: 'Аниматоры',
        he: 'אנימטורים לילדים',
    },
    'Face Painter': {
        en: 'Face Painter',
        ru: 'Аквагрим',
        he: 'ציור פנים',
    },
    'Face Painters': {
        en: 'Face Painters',
        ru: 'Аквагрим',
        he: 'ציורי פנים',
    },
    'Piercing/Tattoo': {
        en: 'Piercing/Tattoo',
        ru: 'Пирсинг/Тату',
        he: 'פירסינג/קעקוע',
    },
    'Chef': {
        en: 'Chef',
        ru: 'Шеф-повар',
        he: 'שף',
    },
    'Chefs/Catering': {
        en: 'Chefs/Catering',
        ru: 'Шеф-повар/Кейтеринг',
        he: 'שפים/קייטרינג',
    },
    'All': {
        en: 'All',
        ru: 'Все',
        he: 'הכל',
    },

    // ===== HERO SECTION =====
    'Find the best talent.': {
        en: 'Find the best talent.',
        ru: 'Найдите лучших специалистов.',
        he: 'מצא את המוכשרים הטובים ביותר.',
    },
    'Connect with top-rated professionals for your events': {
        en: 'Connect with top-rated professionals for your events',
        ru: 'Свяжитесь с лучшими профессионалами для ваших мероприятий',
        he: 'התחבר לאנשי מקצוע מובילים לאירועים שלך',
    },

    // ===== CITIES =====
    'Tel Aviv': {
        en: 'Tel Aviv',
        ru: 'Тель-Авив',
        he: 'תל אביב',
    },
    'Haifa': {
        en: 'Haifa',
        ru: 'Хайфа',
        he: 'חיפה',
    },
    'Jerusalem': {
        en: 'Jerusalem',
        ru: 'Иерусалим',
        he: 'ירושלים',
    },
    'Eilat': {
        en: 'Eilat',
        ru: 'Эйлат',
        he: 'אילת',
    },
    'Rishon LeZion': {
        en: 'Rishon LeZion',
        ru: 'Ришон-ле-Цион',
        he: 'ראשון לציון',
    },
    'Netanya': {
        en: 'Netanya',
        ru: 'Нетания',
        he: 'נתניה',
    },
    'Ashdod': {
        en: 'Ashdod',
        ru: 'Ашдод',
        he: 'אשדוד',
    },

    // ===== TAGS =====
    'Wedding': {
        en: 'Wedding',
        ru: 'Свадьба',
        he: 'חתונה',
    },
    'Bar Mitzvah': {
        en: 'Bar Mitzvah',
        ru: 'Бар-мицва',
        he: 'בר מצווה',
    },
    'Corporate': {
        en: 'Corporate',
        ru: 'Корпоратив',
        he: 'אירוע עסקי',
    },
    'Birthday': {
        en: 'Birthday',
        ru: 'День рождения',
        he: 'יום הולדת',
    },
    'Club Night': {
        en: 'Club Night',
        ru: 'Клубная вечеринка',
        he: 'ערב מועדון',
    },
    'Kids Party': {
        en: 'Kids Party',
        ru: 'Детский праздник',
        he: 'מסיבת ילדים',
    },
    'Engagement': {
        en: 'Engagement',
        ru: 'Помолвка',
        he: 'אירוסין',
    },
    'Family': {
        en: 'Family',
        ru: 'Семейная съемка',
        he: 'משפחה',
    },
    'Private Party': {
        en: 'Private Party',
        ru: 'Частная вечеринка',
        he: 'מסיבה פרטית',
    },
    'Gala': {
        en: 'Gala',
        ru: 'Гала-вечер',
        he: 'ערב גאלה',
    },
    'Beach Party': {
        en: 'Beach Party',
        ru: 'Пляжная вечеринка',
        he: 'מסיבת חוף',
    },
    'Fashion': {
        en: 'Fashion',
        ru: 'Мода',
        he: 'אופנה',
    },
    'Brit Milah': {
        en: 'Brit Milah',
        ru: 'Брит-мила',
        he: 'ברית מילה',
    },

    // ===== VENDOR DESCRIPTIONS (Mock Data) =====
    'Professional wedding and event photographer with 10+ years experience': {
        en: 'Professional wedding and event photographer with 10+ years experience',
        ru: 'Профессиональный свадебный и событийный фотограф с опытом более 10 лет',
        he: 'צלם חתונות ואירועים מקצועי עם ניסיון של למעלה מ-10 שנים',
    },
    'High-energy DJ specializing in EDM and Top 40 hits': {
        en: 'High-energy DJ specializing in EDM and Top 40 hits',
        ru: 'Энергичный диджей, специализирующийся на EDM и хитах Top 40',
        he: 'תקליטן אנרגטי המתמחה ב-EDM ולהיטי Top 40',
    },
    'Charismatic host making your event unforgettable': {
        en: 'Charismatic host making your event unforgettable',
        ru: 'Харизматичный ведущий, делающий ваше мероприятие незабываемым',
        he: 'מנחה כריזמטי שהופך את האירוע שלך לבלתי נשכח',
    },
    'Award-winning magician specializing in close-up and stage magic': {
        en: 'Award-winning magician specializing in close-up and stage magic',
        ru: 'Фокусник-лауреат, специализирующийся на микромагии и сценических шоу',
        he: 'קוסם עטור פרסים המתמחה בקסמים מקרוב ובקסמי במה',
    },
    'Capturing authentic emotions and timeless moments': {
        en: 'Capturing authentic emotions and timeless moments',
        ru: 'Запечатление подлинных эмоций и вечных моментов',
        he: 'לוכד רגשות אותנטיים ורגעים נצחיים',
    },
    'Versatile DJ with extensive music library and professional equipment': {
        en: 'Versatile DJ with extensive music library and professional equipment',
        ru: 'Универсальный диджей с обширной музыкальной библиотекой и профессиональным оборудованием',
        he: 'תקליטן רב-תכליתי עם ספריית מוזיקה נרחבת וציוד מקצועי',
    },
    'Professional event host with bilingual capabilities (Hebrew/English)': {
        en: 'Professional event host with bilingual capabilities (Hebrew/English)',
        ru: 'Профессиональный ведущий мероприятий с двуязычными возможностями (иврит/английский)',
        he: 'מנחה אירועים מקצועי עם יכולות דו-לשוניות (עברית/אנגלית)',
    },
    'Interactive magic shows that engage audiences of all ages': {
        en: 'Interactive magic shows that engage audiences of all ages',
        ru: 'Интерактивные магические шоу, увлекающие зрителей всех возрастов',
        he: 'מופעי קסמים אינטראקטיביים המרתקים קהל מכל הגילאים',
    },
    'Creative photography with cinematic style and artistic vision': {
        en: 'Creative photography with cinematic style and artistic vision',
        ru: 'Креативная фотография с кинематографическим стилем и художественным видением',
        he: 'צילום יצירתי בסגנון קולנועי וחזון אמנותי',
    },
    'Premium DJ services with state-of-the-art sound and lighting': {
        en: 'Premium DJ services with state-of-the-art sound and lighting',
        ru: 'Премиум услуги диджея с современным звуком и освещением',
        he: 'שירותי תקליטן פרימיום עם סאונד ותאורה מתקדמים',
    },
    'Cinematic wedding films and event videography with drone footage': {
        en: 'Cinematic wedding films and event videography with drone footage',
        ru: 'Кинематографические свадебные фильмы и съемка мероприятий с дронами',
        he: 'סרטי חתונות קולנועיים וצילום אירועים עם רחפן',
    },
    'Award-winning videographers creating emotional event stories': {
        en: 'Award-winning videographers creating emotional event stories',
        ru: 'Видеографы-лауреаты, создающие эмоциональные истории событий',
        he: 'צלמי וידאו עטורי פרסים היוצרים סיפורי אירועים רגשיים',
    },
    'Professional vocalist with repertoire from jazz to pop classics': {
        en: 'Professional vocalist with repertoire from jazz to pop classics',
        ru: 'Профессиональный вокалист с репертуаром от джаза до поп-классики',
        he: 'זמר מקצועי עם רפרטואר מג\'אז ועד קלאסיקות הפופ',
    },
    'Soulful voice bringing emotions to every celebration': {
        en: 'Soulful voice bringing emotions to every celebration',
        ru: 'Душевный голос, приносящий эмоции на каждое празднование',
        he: 'קול נשמתי המביא רגשות לכל חגיגה',
    },
    'Violin and saxophone duo creating sophisticated ambiance': {
        en: 'Violin and saxophone duo creating sophisticated ambiance',
        ru: 'Дуэт скрипки и саксофона, создающий изысканную атмосферу',
        he: 'צמד כינור וסקסופון היוצר אווירה מתוחכמת',
    },
    'Live jazz band for upscale events and celebrations': {
        en: 'Live jazz band for upscale events and celebrations',
        ru: 'Живая джаз-группа для престижных мероприятий и празднований',
        he: 'להקת ג\'אז חיה לאירועים וחגיגות יוקרתיים',
    },
    'Stand-up comedian bringing laughter and energy to events': {
        en: 'Stand-up comedian bringing laughter and energy to events',
        ru: 'Стендап-комик, приносящий смех и энергию на мероприятия',
        he: 'קומיקאי סטנד-אפ המביא צחוק ואנרגיה לאירועים',
    },
    'Clean comedy for professional and family events': {
        en: 'Clean comedy for professional and family events',
        ru: 'Чистая комедия для профессиональных и семейных мероприятий',
        he: 'קומדיה נקייה לאירועים מקצועיים ומשפחתיים',
    },
    'Professional dance troupe for spectacular event entertainment': {
        en: 'Professional dance troupe for spectacular event entertainment',
        ru: 'Профессиональная танцевальная труппа для захватывающих развлечений',
        he: 'להקת מחול מקצועית לבידור אירועים מרהיב',
    },
    'Latin dance performances bringing rhythm and passion': {
        en: 'Latin dance performances bringing rhythm and passion',
        ru: 'Латиноамериканские танцевальные выступления с ритмом и страстью',
        he: 'מופעי ריקוד לטיני המביאים קצב ותשוקה',
    },
    'Professional bartenders crafting signature cocktails for events': {
        en: 'Professional bartenders crafting signature cocktails for events',
        ru: 'Профессиональные бармены, создающие фирменные коктейли для мероприятий',
        he: 'ברמנים מקצועיים המכינים קוקטיילים ייחודיים לאירועים',
    },
    'Creative mixology with molecular gastronomy techniques': {
        en: 'Creative mixology with molecular gastronomy techniques',
        ru: 'Креативная миксология с техниками молекулярной гастрономии',
        he: 'מיקסולוגיה יצירתית עם טכניקות גסטרונומיה מולקולרית',
    },
    'Spectacular flair bartending performances with fire tricks': {
        en: 'Spectacular flair bartending performances with fire tricks',
        ru: 'Захватывающие флейр-шоу с огненными трюками',
        he: 'מופעי ברמנות מרהיבים עם טריקים של אש',
    },
    'Theatrical bar performance combining art and mixology': {
        en: 'Theatrical bar performance combining art and mixology',
        ru: 'Театральное барное шоу, сочетающее искусство и миксологию',
        he: 'מופע בר תיאטרלי המשלב אמנות ומיקסולוגיה',
    },
    'Transforming venues into magical spaces with premium decor': {
        en: 'Transforming venues into magical spaces with premium decor',
        ru: 'Превращение залов в волшебные пространства с премиум декором',
        he: 'הפיכת אולמות לחללים קסומים עם עיצוב פרימיום',
    },
    'Elegant floral arrangements and complete event styling': {
        en: 'Elegant floral arrangements and complete event styling',
        ru: 'Элегантные цветочные композиции и полное оформление мероприятий',
        he: 'עיצובי פרחים אלגנטיים ועיצוב אירועים מלא',
    },
    'Professional kids entertainers with games, music, and fun': {
        en: 'Professional kids entertainers with games, music, and fun',
        ru: 'Профессиональные детские аниматоры с играми, музыкой и весельем',
        he: 'מבדרי ילדים מקצועיים עם משחקים, מוזיקה וכיף',
    },
    'Themed party animation with costumes and interactive shows': {
        en: 'Themed party animation with costumes and interactive shows',
        ru: 'Тематическая анимация с костюмами и интерактивными шоу',
        he: 'אנימציית מסיבה נושאית עם תחפושות ומופעים אינטראקטיביים',
    },
    'Creative face painting transforming kids into their favorite characters': {
        en: 'Creative face painting transforming kids into their favorite characters',
        ru: 'Креативный аквагрим, превращающий детей в их любимых персонажей',
        he: 'ציור פנים יצירתי המהפך ילדים לדמויות האהובות עליהם',
    },
    'Professional body art and face painting for all ages': {
        en: 'Professional body art and face painting for all ages',
        ru: 'Профессиональный боди-арт и аквагрим для всех возрастов',
        he: 'אמנות גוף וציור פנים מקצועי לכל הגילאים',
    },
    'Temporary tattoos and glitter art station for events': {
        en: 'Temporary tattoos and glitter art station for events',
        ru: 'Временные татуировки и блестки для мероприятий',
        he: 'תחנת קעקועים זמניים ואומנות נוצצים לאירועים',
    },
    'Traditional and modern henna art for special celebrations': {
        en: 'Traditional and modern henna art for special celebrations',
        ru: 'Традиционное и современное искусство хны для особых торжеств',
        he: 'אומנות חינה מסורתית ומודרנית לחגיגות מיוחדות',
    },
    'Premium catering with Michelin-star trained chefs': {
        en: 'Premium catering with Michelin-star trained chefs',
        ru: 'Премиум кейтеринг с шеф-поварами со звездами Мишлен',
        he: 'קייטרינג פרימיום עם שפים שהוכשרו בכוכבי מישלן',
    },
    'Fresh Mediterranean cuisine with live cooking stations': {
        en: 'Fresh Mediterranean cuisine with live cooking stations',
        ru: 'Свежая средиземноморская кухня с живыми кулинарными станциями',
        he: 'מטבח ים תיכוני טרי עם תחנות בישול חי',
    },

    // ===== DASHBOARD =====
    'Good morning': {
        en: 'Good morning',
        ru: 'Доброе утро',
        he: 'בוקר טוב',
    },
    'Good afternoon': {
        en: 'Good afternoon',
        ru: 'Добрый день',
        he: 'אחר הצהריים טובים',
    },
    'Good evening': {
        en: 'Good evening',
        ru: 'Добрый вечер',
        he: 'ערב טוב',
    },
    'Available for bookings': {
        en: 'Available for bookings',
        ru: 'Доступен для бронирования',
        he: 'זמין להזמנות',
    },
    'Total Earnings': {
        en: 'Total Earnings',
        ru: 'Общий доход',
        he: 'סך הכנסות',
    },
    'Profile Views': {
        en: 'Profile Views',
        ru: 'Просмотры профиля',
        he: 'צפיות בפרופיל',
    },
    'Active Requests': {
        en: 'Active Requests',
        ru: 'Активные запросы',
        he: 'בקשות פעילות',
    },
    'Incoming Inquiries': {
        en: 'Incoming Inquiries',
        ru: 'Входящие запросы',
        he: 'פניות נכנסות',
    },
    'Recent Activity': {
        en: 'Recent Activity',
        ru: 'Недавняя активность',
        he: 'פעילות אחרונה',
    },
    'Event Type': {
        en: 'Event Type',
        ru: 'Тип мероприятия',
        he: 'סוג אירוע',
    },
    'Client': {
        en: 'Client',
        ru: 'Клиент',
        he: 'לקוח',
    },
    'Budget': {
        en: 'Budget',
        ru: 'Бюджет',
        he: 'תקציב',
    },
    'Accept': {
        en: 'Accept',
        ru: 'Принять',
        he: 'קבל',
    },
    'Decline': {
        en: 'Decline',
        ru: 'Отклонить',
        he: 'דחה',
    },
    'Confirmed': {
        en: 'Confirmed',
        ru: 'Подтверждено',
        he: 'אושר',
    },
    'Pending': {
        en: 'Pending',
        ru: 'В ожидании',
        he: 'ממתין',
    },

    // ===== AUTH PAGES =====
    // Sign In
    signInTitle: {
        en: 'Sign In',
        ru: 'Вход',
        he: 'התחברות',
    },
    signInSubtitle: {
        en: 'Access your professional dashboard',
        ru: 'Войдите в личный кабинет',
        he: 'גישה לאזור האישי',
    },
    welcomeBack: {
        en: 'Welcome back to Talentr.',
        ru: 'Добро пожаловать в Talentr.',
        he: 'ברוך שובך ל-Talentr.',
    },
    emailLabel: {
        en: 'Email Address',
        ru: 'Email адрес',
        he: 'כתובת אימייל',
    },
    emailPlaceholder: {
        en: 'you@example.com',
        ru: 'ваш@email.com',
        he: 'you@example.com',
    },
    passwordLabel: {
        en: 'Password',
        ru: 'Пароль',
        he: 'סיסמה',
    },
    passwordPlaceholder: {
        en: 'Enter your password',
        ru: 'Введите пароль',
        he: 'הכנס סיסמה',
    },
    forgotPassword: {
        en: 'Forgot password?',
        ru: 'Забыли пароль?',
        he: 'שכחת סיסמה?',
    },
    signInBtn: {
        en: 'Sign In',
        ru: 'Войти',
        he: 'היכנס',
    },
    signingIn: {
        en: 'Signing in...',
        ru: 'Вход...',
        he: 'מתחבר...',
    },
    orDivider: {
        en: 'or',
        ru: 'или',
        he: 'או',
    },
    googleBtn: {
        en: 'Continue with Google',
        ru: 'Войти через Google',
        he: 'המשך עם Google',
    },
    testModeBtn: {
        en: '🚀 Test Mode - Quick Access',
        ru: '🚀 Тестовый режим - Быстрый вход',
        he: '🚀 מצב בדיקה - כניסה מהירה',
    },
    noAccount: {
        en: "Don't have an account?",
        ru: 'Нет аккаунта?',
        he: 'אין לך חשבון?',
    },
    signUpLink: {
        en: 'Sign up',
        ru: 'Регистрация',
        he: 'הרשמה',
    },
    vendorLinkText: {
        en: 'Are you a service provider?',
        ru: 'Вы исполнитель?',
        he: 'האם אתה ספק שירות?',
    },
    joinVendorLink: {
        en: 'Join as a vendor',
        ru: 'Стать исполнителем',
        he: 'הצטרף כספק',
    },

    // Sign Up (Client)
    signUpTitle: {
        en: 'Find the perfect talent',
        ru: 'Найдите идеального исполнителя',
        he: 'מצא את הכישרון המושלם',
    },
    signUpSubtitle: {
        en: 'for your event',
        ru: 'для вашего мероприятия',
        he: 'לאירוע שלך',
    },
    fullNameLabel: {
        en: 'Full Name',
        ru: 'Полное имя',
        he: 'שם מלא',
    },
    fullNamePlaceholder: {
        en: 'John Doe',
        ru: 'Иван Иванов',
        he: 'ישראל ישראלי',
    },
    createAccountBtn: {
        en: 'Create Account',
        ru: 'Создать аккаунт',
        he: 'צור חשבון',
    },
    creatingAccount: {
        en: 'Creating account...',
        ru: 'Создание аккаунта...',
        he: 'יוצר חשבון...',
    },
    alreadyHaveAccount: {
        en: 'Already have an account?',
        ru: 'Уже есть аккаунт?',
        he: 'כבר יש לך חשבון?',
    },
    signInLink: {
        en: 'Sign in',
        ru: 'Войти',
        he: 'התחבר',
    },
    atLeast6chars: {
        en: 'At least 6 characters',
        ru: 'Минимум 6 символов',
        he: 'לפחות 6 תווים',
    },
    orContinueWithEmail: {
        en: 'Or continue with email',
        ru: 'Или продолжить с email',
        he: 'או המשך עם אימייל',
    },

    // Join (Vendor)
    joinTitle: {
        en: 'Join as a Pro.',
        ru: 'Присоединяйтесь как профессионал.',
        he: 'הצטרף כמקצוען.',
    },
    joinSubtitle: {
        en: 'Get more bookings, secure payments, and less admin work.',
        ru: 'Получайте больше заказов, безопасные платежи и меньше бумажной работы.',
        he: 'קבל יותר הזמנות, תשלומים מאובטחים ופחות עבודה אדמיניסטרטיבית.',
    },
    growBusiness: {
        en: 'Grow your business with Talentr.',
        ru: 'Развивайте свой бизнес с Talentr.',
        he: 'הגדל את העסק שלך עם Talentr.',
    },
    serviceCategoryLabel: {
        en: 'Service Category',
        ru: 'Категория услуг',
        he: 'קטגוריית שירות',
    },
    selectCategory: {
        en: 'Select your category',
        ru: 'Выберите категорию',
        he: 'בחר קטגוריה',
    },
    baseCityLabel: {
        en: 'Base City',
        ru: 'Город',
        he: 'עיר בסיס',
    },
    selectCity: {
        en: 'Select your city',
        ru: 'Выберите город',
        he: 'בחר עיר',
    },
    phoneLabel: {
        en: 'Phone Number',
        ru: 'Номер телефона',
        he: 'מספר טלפון',
    },
    portfolioLabel: {
        en: 'Portfolio Link (Optional)',
        ru: 'Ссылка на портфолио (по желанию)',
        he: 'קישור לתיק עבודות (אופציונלי)',
    },
    portfolioPlaceholder: {
        en: 'https://your-portfolio.com',
        ru: 'https://ваше-портфолио.com',
        he: 'https://portfolio.co.il',
    },
    alreadyPartner: {
        en: 'Already a partner?',
        ru: 'Уже партнер?',
        he: 'כבר שותף?',
    },

    // Test Mode
    'Sign in to talentr': {
        en: 'Sign in to talentr',
        ru: 'Войти в talentr',
        he: 'התחבר ל-talentr',
    },
    'Continue with Google': {
        en: 'Continue with Google',
        ru: 'Продолжить с Google',
        he: 'המשך עם Google',
    },
    'Test Mode - Quick Access': {
        en: 'Test Mode - Quick Access',
        ru: 'Тестовый режим - Быстрый доступ',
        he: 'מצב בדיקה - גישה מהירה',
    },
    'Test Mode Active': {
        en: 'Test Mode Active',
        ru: 'Тестовый режим активен',
        he: 'מצב בדיקה פעיל',
    },
    "You're using a temporary test account. No real authentication required.": {
        en: "You're using a temporary test account. No real authentication required.",
        ru: 'Вы используете временный тестовый аккаунт. Реальная аутентификация не требуется.',
        he: 'אתה משתמש בחשבון בדיקה זמני. אין צורך באימות אמיתי.',
    },

    // ===== VENDOR PROFILE PAGE =====
    'Vendor not found': {
        en: 'Vendor not found',
        ru: 'Специалист не найден',
        he: 'הספק לא נמצא',
    },
    "The vendor you're looking for doesn't exist.": {
        en: "The vendor you're looking for doesn't exist.",
        ru: 'Специалист, которого вы ищете, не существует.',
        he: 'הספק שאתה מחפש לא קיים.',
    },
    'reviews': {
        en: 'reviews',
        ru: 'отзывов',
        he: 'ביקורות',
    },
    'About': {
        en: 'About',
        ru: 'О специалисте',
        he: 'אודות',
    },
    'Portfolio': {
        en: 'Portfolio',
        ru: 'Портфолио',
        he: 'תיק עבודות',
    },
    'Reviews': {
        en: 'Reviews',
        ru: 'Отзывы',
        he: 'ביקורות',
    },
    'Starting from': {
        en: 'Starting from',
        ru: 'Начиная от',
        he: 'החל מ',
    },
    'Check Availability': {
        en: 'Check Availability',
        ru: 'Проверить доступность',
        he: 'בדוק זמינות',
    },
    'Safe Deal protected': {
        en: 'Safe Deal protected',
        ru: 'Защищенная сделка',
        he: 'עסקה מאובטחת',
    },
    'Money-back guarantee': {
        en: 'Money-back guarantee',
        ru: 'Гарантия возврата денег',
        he: 'החזר כספי מובטח',
    },
    'Verified professional': {
        en: 'Verified professional',
        ru: 'Проверенный специалист',
        he: 'מקצוען מאומת',
    },
    'Secure payment': {
        en: 'Secure payment',
        ru: 'Безопасная оплата',
        he: 'תשלום מאובטח',
    },

    // ===== MODAL - CONTACT REQUEST =====
    'Contact Request': {
        en: 'Contact Request',
        ru: 'Запрос на контакт',
        he: 'בקשת יצירת קשר',
    },
    'To communicate with this talent and see the phone number, a': {
        en: 'To communicate with this talent and see the phone number, a',
        ru: 'Для связи с этим специалистом и просмотра номера телефона требуется',
        he: 'כדי ליצור קשר עם המוכשר הזה ולראות את מספר הטלפון, נדרש',
    },
    '20% security deposit': {
        en: '20% security deposit',
        ru: 'залог 20%',
        he: 'פיקדון ביטחון של 20%',
    },
    'is required.': {
        en: 'is required.',
        ru: '.',
        he: '.',
    },
    'Deposit amount': {
        en: 'Deposit amount',
        ru: 'Сумма залога',
        he: 'סכום הפיקדון',
    },
    'Pay Deposit (Simulation)': {
        en: 'Pay Deposit (Simulation)',
        ru: 'Оплатить залог (Симуляция)',
        he: 'שלם פיקדון (סימולציה)',
    },
    "This deposit is fully refundable if the talent doesn't accept your request": {
        en: "This deposit is fully refundable if the talent doesn't accept your request",
        ru: 'Этот залог полностью возвращается, если специалист не примет ваш запрос',
        he: 'הפיקדון הזה ניתן להחזר מלא אם המוכשר לא יקבל את בקשתך',
    },
    'Success!': {
        en: 'Success!',
        ru: 'Успешно!',
        he: 'הצלחה!',
    },
    "Your request has been sent. Here's the contact information:": {
        en: "Your request has been sent. Here's the contact information:",
        ru: 'Ваш запрос отправлен. Вот контактная информация:',
        he: 'הבקשה שלך נשלחה. הנה פרטי הקשר:',
    },
    'Phone Number': {
        en: 'Phone Number',
        ru: 'Номер телефона',
        he: 'מספר טלפון',
    },
    'Close': {
        en: 'Close',
        ru: 'Закрыть',
        he: 'סגור',
    },

    // ===== MOCK REVIEWS =====
    'Absolutely amazing experience! Professional and creative.': {
        en: 'Absolutely amazing experience! Professional and creative.',
        ru: 'Потрясающий опыт! Профессионально и креативно.',
        he: 'חוויה מדהימה לחלוטין! מקצועי ויצירתי.',
    },
    'Best decision for our wedding. Highly recommended!': {
        en: 'Best decision for our wedding. Highly recommended!',
        ru: 'Лучшее решение для нашей свадьбы. Очень рекомендую!',
        he: 'ההחלטה הטובה ביותר לחתונה שלנו. מומלץ בחום!',
    },
    'Great service, very responsive and talented.': {
        en: 'Great service, very responsive and talented.',
        ru: 'Отличный сервис, очень отзывчивый и талантливый.',
        he: 'שירות מעולה, מגיב מאוד ומוכשר.',
    },

    // ===== BOOKING MODAL =====
    bookingTitle: {
        en: 'Book this Vendor',
        ru: 'Забронировать исполнителя',
        he: 'הזמן את הספק',
    },
    selectDate: {
        en: 'Select Date',
        ru: 'Выберите дату',
        he: 'בחר תאריך',
    },
    eventTypeLabel: {
        en: 'Event Type',
        ru: 'Тип события',
        he: 'סוג האירוע',
    },
    messageToVendor: {
        en: 'Message to Vendor',
        ru: 'Сообщение исполнителю',
        he: 'הודעה לספק',
    },
    sendRequestBtn: {
        en: 'Send Request',
        ru: 'Отправить запрос',
        he: 'שלח בקשה',
    },
    bookingSuccess: {
        en: 'Booking request sent successfully!',
        ru: 'Запрос на бронирование успешно отправлен!',
        he: 'בקשת ההזמנה נשלחה בהצלחה!',
    },
    sending: {
        en: 'Sending...',
        ru: 'Отправка...',
        he: 'שולח...',
    },
    loginRequired: {
        en: 'Please sign in to book a vendor',
        ru: 'Пожалуйста, войдите, чтобы забронировать исполнителя',
        he: 'אנא התחבר כדי להזמין ספק',
    },
    'Corporate Event': {
        en: 'Corporate Event',
        ru: 'Корпоративное мероприятие',
        he: 'אירוע עסקי',
    },
    'Birthday Party': {
        en: 'Birthday Party',
        ru: 'День рождения',
        he: 'מסיבת יום הולדת',
    },
    'Other': {
        en: 'Other',
        ru: 'Другое',
        he: 'אחר',
    },
    'Tell the pro more about your event...': {
        en: 'Tell the pro more about your event...',
        ru: 'Расскажите исполнителю больше о вашем событии...',
        he: 'ספר לספק יותר על האירוע שלך...',
    },

    // ===== VENDOR CARD & UI =====
    'Verified': {
        en: 'Verified',
        ru: 'Проверен',
        he: 'מאומת',
    },
    'Fast reply': {
        en: 'Fast reply',
        ru: 'Быстрый ответ',
        he: 'תגובה מהירה',
    },
    'Chat on WhatsApp': {
        en: 'Chat on WhatsApp',
        ru: 'Написать в WhatsApp',
        he: 'שלח הודעה בוואטסאפ',
    },
    'More options': {
        en: 'More options',
        ru: 'Больше вариантов',
        he: 'עוד אפשרויות',
    },
    'Different city': {
        en: 'Different city',
        ru: 'Другой город',
        he: 'עיר אחרת',
    },
    'Sign In': {
        en: 'Sign In',
        ru: 'Войти',
        he: 'התחבר',
    },
    'Book Now': {
        en: 'Book Now',
        ru: 'Забронировать',
        he: 'הזמן עכשיו',
    },
    'Send Message': {
        en: 'Send Message',
        ru: 'Написать сообщение',
        he: 'שלח הודעה',
    },
    'Safe Deal': {
        en: 'Safe Deal',
        ru: 'Безопасная сделка',
        he: 'עסקה בטוחה',
    },
    '100% Protection': {
        en: '100% Protection',
        ru: '100% Защита',
        he: '100% הגנה',
    },
    'Instant availability check': {
        en: 'Instant availability check',
        ru: 'Мгновенная проверка доступности',
        he: 'בדיקת זמינות מיידית',
    },
    'Free cancellation in 24h': {
        en: 'Free cancellation in 24h',
        ru: 'Бесплатная отмена в течение 24ч',
        he: 'ביטול חינם תוך 24 שעות',
    },
    'Professional contract': {
        en: 'Professional contract',
        ru: 'Профессиональный договор',
        he: 'חוזה מקצועי',
    },
    'Why choose them?': {
        en: 'Why choose them?',
        ru: 'Почему выбрать их?',
        he: 'למה לבחור בהם?',
    },
    'Their attention to detail is unmatched in the industry today.': {
        en: 'Their attention to detail is unmatched in the industry today.',
        ru: 'Их внимание к деталям не имеет себе равных в индустрии.',
        he: 'תשומת הלב שלהם לפרטים היא ללא תחרות בתעשייה כיום.',
    },
    'Quick Response': {
        en: 'Quick Response',
        ru: 'Быстрый ответ',
        he: 'תגובה מהירה',
    },
    'Experience': {
        en: 'Experience',
        ru: 'Опыт',
        he: 'ניסיון',
    },
    'Completed Events': {
        en: 'Completed Events',
        ru: 'Проведено мероприятий',
        he: 'אירועים שהושלמו',
    },
    'Works': {
        en: 'Works',
        ru: 'Работ',
        he: 'עבודות',
    },
    'What clients say about workers': {
        en: 'What clients say about this pro',
        ru: 'Что говорят клиенты об этом специалисте',
        he: 'מה לקוחות אומרים על המקצוען',
    },
    'ratings': {
        en: 'ratings',
        ru: 'оценок',
        he: 'דירוגים',
    },
    'Read all reviews': {
        en: 'Read all reviews',
        ru: 'Читать все отзывы',
        he: 'קרא את כל הביקורות',
    },
    'TOP RATED': {
        en: 'TOP RATED',
        ru: 'ТОП РЕЙТИНГ',
        he: 'דירוג גבוה',
    },
    'VERIFIED': {
        en: 'VERIFIED',
        ru: 'ПРОВЕРЕН',
        he: 'מאומת',
    },
    'event': {
        en: 'event',
        ru: 'событие',
        he: 'אירוע',
    },
};

// Helper function to get translation
export function getTranslation(key: string, language: Language): string {
    const translation = translations[key];
    if (!translation) {
        return key; // Fallback to original key if not found
    }
    return translation[language] || translation.en || key;
}
