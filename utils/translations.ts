export type Language = 'en' | 'he';

interface Translations {
    [key: string]: {
        en: string;
        he: string;
    };
}

export const translations: Translations = {
    // ===== NAVBAR & SEARCH =====
    searchPlaceholder: {
        en: 'Search for photographers, DJs, MCs...',
        he: 'חיפוש צלמים, תקליטנים, מנחים...',
    },
    signOut: {
        en: 'Sign Out',
        he: 'התנתק',
    },

    // ===== PRICING =====
    fromPrice: {
        en: 'From',
        he: 'החל מ',
    },


    // ===== CATEGORIES =====
    'Photographer': {
        en: 'Photographer',
        he: 'צלם',
    },
    'Photographers': {
        en: 'Photographers',
        he: 'צלמים',
    },
    'Videographer': {
        en: 'Videographer',
        he: 'צלם וידאו',
    },
    'Videographers': {
        en: 'Videographers',
        he: 'צלמי וידאו',
    },
    'DJ': {
        en: 'DJ',
        he: 'תקליטן',
    },
    'DJs': {
        en: 'DJs',
        he: 'תקליטנים',
    },
    'MC': {
        en: 'MC',
        he: 'מנחה',
    },
    'MCs': {
        en: 'MCs',
        he: 'מנחים',
    },
    'Magician': {
        en: 'Magician',
        he: 'קוסם',
    },
    'Magicians': {
        en: 'Magicians',
        he: 'קוסמים',
    },
    'Singer': {
        en: 'Singer',
        he: 'זמר',
    },
    'Singers': {
        en: 'Singers',
        he: 'זמרים',
    },
    'Musician': {
        en: 'Musician',
        he: 'נגן',
    },
    'Musicians': {
        en: 'Musicians',
        he: 'נגנים',
    },
    'Comedian': {
        en: 'Comedian',
        he: 'קומיקאי',
    },
    'Comedians': {
        en: 'Comedians',
        he: 'קומיקאים',
    },
    'Dancer': {
        en: 'Dancer',
        he: 'רקדן',
    },
    'Dancers': {
        en: 'Dancers',
        he: 'רקדנים',
    },
    'Bartender': {
        en: 'Bartender',
        he: 'ברמן',
    },
    'Bartenders': {
        en: 'Bartenders',
        he: 'ברמנים',
    },
    'Bar Show': {
        en: 'Bar Show',
        he: 'מופע בר',
    },
    'Bar Shows': {
        en: 'Bar Shows',
        he: 'מופעי בר',
    },
    'Event Decor': {
        en: 'Event Decor',
        he: 'עיצוב אירועים',
    },
    'Kids Animator': {
        en: 'Kids Animator',
        he: 'אנימטור לילדים',
    },
    'Kids Animators': {
        en: 'Kids Animators',
        he: 'אנימטורים לילדים',
    },
    'Face Painter': {
        en: 'Face Painter',
        he: 'ציור פנים',
    },
    'Face Painters': {
        en: 'Face Painters',
        he: 'ציורי פנים',
    },
    'Piercing/Tattoo': {
        en: 'Piercing/Tattoo',
        he: 'פירסינג/קעקוע',
    },
    'Chef': {
        en: 'Chef',
        he: 'שף',
    },
    'Chefs/Catering': {
        en: 'Chefs/Catering',
        he: 'שפים/קייטרינג',
    },
    'All': {
        en: 'All',
        he: 'הכל',
    },

    // ===== HERO SECTION =====
    'Find the best talent.': {
        en: 'Find the best talent.',
        he: 'מצא את המוכשרים הטובים ביותר.',
    },
    'Connect with top-rated professionals for your events': {
        en: 'Connect with top-rated professionals for your events',
        he: 'התחבר לאנשי מקצוע מובילים לאירועים שלך',
    },

    // ===== CITIES =====
    'Tel Aviv': {
        en: 'Tel Aviv',
        he: 'תל אביב',
    },
    'Haifa': {
        en: 'Haifa',
        he: 'חיפה',
    },
    'Jerusalem': {
        en: 'Jerusalem',
        he: 'ירושלים',
    },
    'Eilat': {
        en: 'Eilat',
        he: 'אילת',
    },
    'Rishon LeZion': {
        en: 'Rishon LeZion',
        he: 'ראשון לציון',
    },
    'Netanya': {
        en: 'Netanya',
        he: 'נתניה',
    },
    'Ashdod': {
        en: 'Ashdod',
        he: 'אשדוד',
    },

    // ===== TAGS =====
    'Wedding': {
        en: 'Wedding',
        he: 'חתונה',
    },
    'Bar Mitzvah': {
        en: 'Bar Mitzvah',
        he: 'בר מצווה',
    },
    'Corporate': {
        en: 'Corporate',
        he: 'אירוע עסקי',
    },
    'Birthday': {
        en: 'Birthday',
        he: 'יום הולדת',
    },
    'Club Night': {
        en: 'Club Night',
        he: 'ערב מועדון',
    },
    'Kids Party': {
        en: 'Kids Party',
        he: 'מסיבת ילדים',
    },
    'Engagement': {
        en: 'Engagement',
        he: 'אירוסין',
    },
    'Family': {
        en: 'Family',
        he: 'משפחה',
    },
    'Private Party': {
        en: 'Private Party',
        he: 'מסיבה פרטית',
    },
    'Gala': {
        en: 'Gala',
        he: 'ערב גאלה',
    },
    'Beach Party': {
        en: 'Beach Party',
        he: 'מסיבת חוף',
    },
    'Fashion': {
        en: 'Fashion',
        he: 'אופנה',
    },
    'Brit Milah': {
        en: 'Brit Milah',
        he: 'ברית מילה',
    },

    // ===== VENDOR DESCRIPTIONS (Mock Data) =====
    'Professional wedding and event photographer with 10+ years experience': {
        en: 'Professional wedding and event photographer with 10+ years experience',
        he: 'צלם חתונות ואירועים מקצועי עם ניסיון של למעלה מ-10 שנים',
    },
    'High-energy DJ specializing in EDM and Top 40 hits': {
        en: 'High-energy DJ specializing in EDM and Top 40 hits',
        he: 'תקליטן אנרגטי המתמחה ב-EDM ולהיטי Top 40',
    },
    'Charismatic host making your event unforgettable': {
        en: 'Charismatic host making your event unforgettable',
        he: 'מנחה כריזמטי שהופך את האירוע שלך לבלתי נשכח',
    },
    'Award-winning magician specializing in close-up and stage magic': {
        en: 'Award-winning magician specializing in close-up and stage magic',
        he: 'קוסם עטור פרסים המתמחה בקסמים מקרוב ובקסמי במה',
    },
    'Capturing authentic emotions and timeless moments': {
        en: 'Capturing authentic emotions and timeless moments',
        he: 'לוכד רגשות אותנטיים ורגעים נצחיים',
    },
    'Versatile DJ with extensive music library and professional equipment': {
        en: 'Versatile DJ with extensive music library and professional equipment',
        he: 'תקליטן רב-תכליתי עם ספריית מוזיקה נרחבת וציוד מקצועי',
    },
    'Professional event host with bilingual capabilities (Hebrew/English)': {
        en: 'Professional event host with bilingual capabilities (Hebrew/English)',
        he: 'מנחה אירועים מקצועי עם יכולות דו-לשוניות (עברית/אנגלית)',
    },
    'Interactive magic shows that engage audiences of all ages': {
        en: 'Interactive magic shows that engage audiences of all ages',
        he: 'מופעי קסמים אינטראקטיביים המרתקים קהל מכל הגילאים',
    },
    'Creative photography with cinematic style and artistic vision': {
        en: 'Creative photography with cinematic style and artistic vision',
        he: 'צילום יצירתי בסגנון קולנועי וחזון אמנותי',
    },
    'Premium DJ services with state-of-the-art sound and lighting': {
        en: 'Premium DJ services with state-of-the-art sound and lighting',
        he: 'שירותי תקליטן פרימיום עם סאונד ותאורה מתקדמים',
    },
    'Cinematic wedding films and event videography with drone footage': {
        en: 'Cinematic wedding films and event videography with drone footage',
        he: 'סרטי חתונות קולנועיים וצילום אירועים עם רחפן',
    },
    'Award-winning videographers creating emotional event stories': {
        en: 'Award-winning videographers creating emotional event stories',
        he: 'צלמי וידאו עטורי פרסים היוצרים סיפורי אירועים רגשיים',
    },
    'Professional vocalist with repertoire from jazz to pop classics': {
        en: 'Professional vocalist with repertoire from jazz to pop classics',
        he: 'זמר מקצועי עם רפרטואר מג\'אז ועד קלאסיקות הפופ',
    },
    'Soulful voice bringing emotions to every celebration': {
        en: 'Soulful voice bringing emotions to every celebration',
        he: 'קול נשמתי המביא רגשות לכל חגיגה',
    },
    'Violin and saxophone duo creating sophisticated ambiance': {
        en: 'Violin and saxophone duo creating sophisticated ambiance',
        he: 'צמד כינור וסקסופון היוצר אווירה מתוחכמת',
    },
    'Live jazz band for upscale events and celebrations': {
        en: 'Live jazz band for upscale events and celebrations',
        he: 'להקת ג\'אז חיה לאירועים וחגיגות יוקרתיים',
    },
    'Stand-up comedian bringing laughter and energy to events': {
        en: 'Stand-up comedian bringing laughter and energy to events',
        he: 'קומיקאי סטנד-אפ המביא צחוק ואנרגיה לאירועים',
    },
    'Clean comedy for professional and family events': {
        en: 'Clean comedy for professional and family events',
        he: 'קומדיה נקייה לאירועים מקצועיים ומשפחתיים',
    },
    'Professional dance troupe for spectacular event entertainment': {
        en: 'Professional dance troupe for spectacular event entertainment',
        he: 'להקת מחול מקצועית לבידור אירועים מרהיב',
    },
    'Latin dance performances bringing rhythm and passion': {
        en: 'Latin dance performances bringing rhythm and passion',
        he: 'מופעי ריקוד לטיני המביאים קצב ותשוקה',
    },
    'Professional bartenders crafting signature cocktails for events': {
        en: 'Professional bartenders crafting signature cocktails for events',
        he: 'ברמנים מקצועיים המכינים קוקטיילים ייחודיים לאירועים',
    },
    'Creative mixology with molecular gastronomy techniques': {
        en: 'Creative mixology with molecular gastronomy techniques',
        he: 'מיקסולוגיה יצירתית עם טכניקות גסטרונומיה מולקולרית',
    },
    'Spectacular flair bartending performances with fire tricks': {
        en: 'Spectacular flair bartending performances with fire tricks',
        he: 'מופעי ברמנות מרהיבים עם טריקים של אש',
    },
    'Theatrical bar performance combining art and mixology': {
        en: 'Theatrical bar performance combining art and mixology',
        he: 'מופע בר תיאטרלי המשלב אמנות ומיקסולוגיה',
    },
    'Transforming venues into magical spaces with premium decor': {
        en: 'Transforming venues into magical spaces with premium decor',
        he: 'הפיכת אולמות לחללים קסומים עם עיצוב פרימיום',
    },
    'Elegant floral arrangements and complete event styling': {
        en: 'Elegant floral arrangements and complete event styling',
        he: 'עיצובי פרחים אלגנטיים ועיצוב אירועים מלא',
    },
    'Professional kids entertainers with games, music, and fun': {
        en: 'Professional kids entertainers with games, music, and fun',
        he: 'מבדרי ילדים מקצועיים עם משחקים, מוזיקה וכיף',
    },
    'Themed party animation with costumes and interactive shows': {
        en: 'Themed party animation with costumes and interactive shows',
        he: 'אנימציית מסיבה נושאית עם תחפושות ומופעים אינטראקטיביים',
    },
    'Creative face painting transforming kids into their favorite characters': {
        en: 'Creative face painting transforming kids into their favorite characters',
        he: 'ציור פנים יצירתי המהפך ילדים לדמויות האהובות עליהם',
    },
    'Professional body art and face painting for all ages': {
        en: 'Professional body art and face painting for all ages',
        he: 'אמנות גוף וציור פנים מקצועי לכל הגילאים',
    },
    'Temporary tattoos and glitter art station for events': {
        en: 'Temporary tattoos and glitter art station for events',
        he: 'תחנת קעקועים זמניים ואומנות נוצצים לאירועים',
    },
    'Traditional and modern henna art for special celebrations': {
        en: 'Traditional and modern henna art for special celebrations',
        he: 'אומנות חינה מסורתית ומודרנית לחגיגות מיוחדות',
    },
    'Premium catering with Michelin-star trained chefs': {
        en: 'Premium catering with Michelin-star trained chefs',
        he: 'קייטרינג פרימיום עם שפים שהוכשרו בכוכבי מישלן',
    },
    'Fresh Mediterranean cuisine with live cooking stations': {
        en: 'Fresh Mediterranean cuisine with live cooking stations',
        he: 'מטבח ים תיכוני טרי עם תחנות בישול חי',
    },

    // ===== DASHBOARD =====
    'Good morning': {
        en: 'Good morning',
        he: 'בוקר טוב',
    },
    'Good afternoon': {
        en: 'Good afternoon',
        he: 'אחר הצהריים טובים',
    },
    'Good evening': {
        en: 'Good evening',
        he: 'ערב טוב',
    },
    'Available for bookings': {
        en: 'Available for bookings',
        he: 'זמין להזמנות',
    },
    'Total Earnings': {
        en: 'Total Earnings',
        he: 'סך הכנסות',
    },
    'Profile Views': {
        en: 'Profile Views',
        he: 'צפיות בפרופיל',
    },
    'Active Requests': {
        en: 'Active Requests',
        he: 'בקשות פעילות',
    },
    'Incoming Inquiries': {
        en: 'Incoming Inquiries',
        he: 'פניות נכנסות',
    },
    'Recent Activity': {
        en: 'Recent Activity',
        he: 'פעילות אחרונה',
    },
    'Event Type': {
        en: 'Event Type',
        he: 'סוג אירוע',
    },
    'Client': {
        en: 'Client',
        he: 'לקוח',
    },
    'Budget': {
        en: 'Budget',
        he: 'תקציב',
    },
    'Accept': {
        en: 'Accept',
        he: 'קבל',
    },
    'Decline': {
        en: 'Decline',
        he: 'דחה',
    },
    'Confirmed': {
        en: 'Confirmed',
        he: 'אושר',
    },
    'Pending': {
        en: 'Pending',
        he: 'ממתין',
    },

    // ===== AUTH PAGES =====
    // Sign In
    signInTitle: {
        en: 'Sign In',
        he: 'התחברות',
    },
    signInSubtitle: {
        en: 'Access your professional dashboard',
        he: 'גישה לאזור האישי',
    },
    welcomeBack: {
        en: 'Welcome back to Talentr.',
        he: 'ברוך שובך ל-Talentr.',
    },
    emailLabel: {
        en: 'Email Address',
        he: 'כתובת אימייל',
    },
    emailPlaceholder: {
        en: 'you@example.com',
        he: 'you@example.com',
    },
    passwordLabel: {
        en: 'Password',
        he: 'סיסמה',
    },
    passwordPlaceholder: {
        en: 'Enter your password',
        he: 'הכנס סיסמה',
    },
    forgotPassword: {
        en: 'Forgot password?',
        he: 'שכחת סיסמה?',
    },
    signInBtn: {
        en: 'Sign In',
        he: 'היכנס',
    },
    signingIn: {
        en: 'Signing in...',
        he: 'מתחבר...',
    },
    orDivider: {
        en: 'or',
        he: 'או',
    },
    googleBtn: {
        en: 'Continue with Google',
        he: 'המשך עם Google',
    },
    testModeBtn: {
        en: '🚀 Test Mode - Quick Access',
        he: '🚀 מצב בדיקה - כניסה מהירה',
    },
    noAccount: {
        en: "Don't have an account?",
        he: 'אין לך חשבון?',
    },
    signUpLink: {
        en: 'Sign up',
        he: 'הרשמה',
    },
    vendorLinkText: {
        en: 'Are you a service provider?',
        he: 'האם אתה ספק שירות?',
    },
    joinVendorLink: {
        en: 'Join as a vendor',
        he: 'הצטרף כספק',
    },

    // Sign Up (Client)
    signUpTitle: {
        en: 'Find the perfect talent',
        he: 'מצא את הכישרון המושלם',
    },
    signUpSubtitle: {
        en: 'for your event',
        he: 'לאירוע שלך',
    },
    fullNameLabel: {
        en: 'Full Name',
        he: 'שם מלא',
    },
    fullNamePlaceholder: {
        en: 'John Doe',
        he: 'ישראל ישראלי',
    },
    createAccountBtn: {
        en: 'Create Account',
        he: 'צור חשבון',
    },
    creatingAccount: {
        en: 'Creating account...',
        he: 'יוצר חשבון...',
    },
    alreadyHaveAccount: {
        en: 'Already have an account?',
        he: 'כבר יש לך חשבון?',
    },
    signInLink: {
        en: 'Sign in',
        he: 'התחבר',
    },
    atLeast6chars: {
        en: 'At least 6 characters',
        he: 'לפחות 6 תווים',
    },
    orContinueWithEmail: {
        en: 'Or continue with email',
        he: 'או המשך עם אימייל',
    },

    // Join (Vendor)
    joinTitle: {
        en: 'Join as a Pro.',
        he: 'הצטרף כמקצוען.',
    },
    joinSubtitle: {
        en: 'Get more bookings, secure payments, and less admin work.',
        he: 'קבל יותר הזמנות, תשלומים מאובטחים ופחות עבודה אדמיניסטרטיבית.',
    },
    growBusiness: {
        en: 'Grow your business with Talentr.',
        he: 'הגדל את העסק שלך עם Talentr.',
    },
    serviceCategoryLabel: {
        en: 'Service Category',
        he: 'קטגוריית שירות',
    },
    selectCategory: {
        en: 'Select your category',
        he: 'בחר קטגוריה',
    },
    baseCityLabel: {
        en: 'Base City',
        he: 'עיר בסיס',
    },
    selectCity: {
        en: 'Select your city',
        he: 'בחר עיר',
    },
    phoneLabel: {
        en: 'Phone Number',
        he: 'מספר טלפון',
    },
    portfolioLabel: {
        en: 'Portfolio Link (Optional)',
        he: 'קישור לתיק עבודות (אופציונלי)',
    },
    portfolioPlaceholder: {
        en: 'https://your-portfolio.com',
        he: 'https://portfolio.co.il',
    },
    alreadyPartner: {
        en: 'Already a partner?',
        he: 'כבר שותף?',
    },

    // Test Mode
    'Sign in to talentr': {
        en: 'Sign in to talentr',
        he: 'התחבר ל-talentr',
    },
    'Continue with Google': {
        en: 'Continue with Google',
        he: 'המשך עם Google',
    },
    'Test Mode - Quick Access': {
        en: 'Test Mode - Quick Access',
        he: 'מצב בדיקה - גישה מהירה',
    },
    'Test Mode Active': {
        en: 'Test Mode Active',
        he: 'מצב בדיקה פעיל',
    },
    "You're using a temporary test account. No real authentication required.": {
        en: "You're using a temporary test account. No real authentication required.",
        he: 'אתה משתמש בחשבון בדיקה זמני. אין צורך באימות אמיתי.',
    },

    // ===== VENDOR PROFILE PAGE =====
    'Vendor not found': {
        en: 'Vendor not found',
        he: 'הספק לא נמצא',
    },
    "The vendor you're looking for doesn't exist.": {
        en: "The vendor you're looking for doesn't exist.",
        he: 'הספק שאתה מחפש לא קיים.',
    },
    'reviews': {
        en: 'reviews',
        he: 'ביקורות',
    },
    'About': {
        en: 'About',
        he: 'אודות',
    },
    'Portfolio': {
        en: 'Portfolio',
        he: 'תיק עבודות',
    },
    'Reviews': {
        en: 'Reviews',
        he: 'ביקורות',
    },
    'Starting from': {
        en: 'Starting from',
        he: 'החל מ',
    },
    'Check Availability': {
        en: 'Check Availability',
        he: 'בדוק זמינות',
    },
    'Safe Deal protected': {
        en: 'Safe Deal protected',
        he: 'עסקה מאובטחת',
    },
    'Money-back guarantee': {
        en: 'Money-back guarantee',
        he: 'החזר כספי מובטח',
    },
    'Verified professional': {
        en: 'Verified professional',
        he: 'מקצוען מאומת',
    },
    'Secure payment': {
        en: 'Secure payment',
        he: 'תשלום מאובטח',
    },

    // ===== MODAL - CONTACT REQUEST =====
    'Contact Request': {
        en: 'Contact Request',
        he: 'בקשת יצירת קשר',
    },
    'To communicate with this talent and see the phone number, a': {
        en: 'To communicate with this talent and see the phone number, a',
        he: 'כדי ליצור קשר עם המוכשר הזה ולראות את מספר הטלפון, נדרש',
    },
    '20% security deposit': {
        en: '20% security deposit',
        he: 'פיקדון ביטחון של 20%',
    },
    'is required.': {
        en: 'is required.',
        he: '.',
    },
    'Deposit amount': {
        en: 'Deposit amount',
        he: 'סכום הפיקדון',
    },
    'Pay Deposit (Simulation)': {
        en: 'Pay Deposit (Simulation)',
        he: 'שלם פיקדון (סימולציה)',
    },
    "This deposit is fully refundable if the talent doesn't accept your request": {
        en: "This deposit is fully refundable if the talent doesn't accept your request",
        he: 'הפיקדון הזה ניתן להחזר מלא אם המוכשר לא יקבל את בקשתך',
    },
    'Success!': {
        en: 'Success!',
        he: 'הצלחה!',
    },
    "Your request has been sent. Here's the contact information:": {
        en: "Your request has been sent. Here's the contact information:",
        he: 'הבקשה שלך נשלחה. הנה פרטי הקשר:',
    },
    'Phone Number': {
        en: 'Phone Number',
        he: 'מספר טלפון',
    },
    'Close': {
        en: 'Close',
        he: 'סגור',
    },

    // ===== MOCK REVIEWS =====
    'Absolutely amazing experience! Professional and creative.': {
        en: 'Absolutely amazing experience! Professional and creative.',
        he: 'חוויה מדהימה לחלוטין! מקצועי ויצירתי.',
    },
    'Best decision for our wedding. Highly recommended!': {
        en: 'Best decision for our wedding. Highly recommended!',
        he: 'ההחלטה הטובה ביותר לחתונה שלנו. מומלץ בחום!',
    },
    'Great service, very responsive and talented.': {
        en: 'Great service, very responsive and talented.',
        he: 'שירות מעולה, מגיב מאוד ומוכשר.',
    },

    // ===== BOOKING MODAL =====
    bookingTitle: {
        en: 'Book this Vendor',
        he: 'הזמן את הספק',
    },
    selectDate: {
        en: 'Select Date',
        he: 'בחר תאריך',
    },
    eventTypeLabel: {
        en: 'Event Type',
        he: 'סוג האירוע',
    },
    messageToVendor: {
        en: 'Message to Vendor',
        he: 'הודעה לספק',
    },
    sendRequestBtn: {
        en: 'Send Request',
        he: 'שלח בקשה',
    },
    bookingSuccess: {
        en: 'Booking request sent successfully!',
        he: 'בקשת ההזמנה נשלחה בהצלחה!',
    },
    sending: {
        en: 'Sending...',
        he: 'שולח...',
    },
    loginRequired: {
        en: 'Please sign in to book a vendor',
        he: 'אנא התחבר כדי להזמין ספק',
    },
    'Corporate Event': {
        en: 'Corporate Event',
        he: 'אירוע עסקי',
    },
    'Birthday Party': {
        en: 'Birthday Party',
        he: 'מסיבת יום הולדת',
    },
    'Other': {
        en: 'Other',
        he: 'אחר',
    },
    'Tell the pro more about your event...': {
        en: 'Tell the pro more about your event...',
        he: 'ספר לספק יותר על האירוע שלך...',
    },

    // ===== VENDOR CARD & UI =====
    'Verified': {
        en: 'Verified',
        he: 'מאומת',
    },
    'Fast reply': {
        en: 'Fast reply',
        he: 'תגובה מהירה',
    },
    'Chat on WhatsApp': {
        en: 'Chat on WhatsApp',
        he: 'שלח הודעה בוואטסאפ',
    },
    'More options': {
        en: 'More options',
        he: 'עוד אפשרויות',
    },
    'Different city': {
        en: 'Different city',
        he: 'עיר אחרת',
    },
    'Sign In': {
        en: 'Sign In',
        he: 'התחבר',
    },
    'Book Now': {
        en: 'Book Now',
        he: 'הזמן עכשיו',
    },
    'Send Message': {
        en: 'Send Message',
        he: 'שלח הודעה',
    },
    'Safe Deal': {
        en: 'Safe Deal',
        he: 'עסקה בטוחה',
    },
    '100% Protection': {
        en: '100% Protection',
        he: '100% הגנה',
    },
    'Instant availability check': {
        en: 'Instant availability check',
        he: 'בדיקת זמינות מיידית',
    },
    'Free cancellation in 24h': {
        en: 'Free cancellation in 24h',
        he: 'ביטול חינם תוך 24 שעות',
    },
    'Professional contract': {
        en: 'Professional contract',
        he: 'חוזה מקצועי',
    },
    'Why choose them?': {
        en: 'Why choose them?',
        he: 'למה לבחור בהם?',
    },
    'Their attention to detail is unmatched in the industry today.': {
        en: 'Their attention to detail is unmatched in the industry today.',
        he: 'תשומת הלב שלהם לפרטים היא ללא תחרות בתעשייה כיום.',
    },
    'Quick Response': {
        en: 'Quick Response',
        he: 'תגובה מהירה',
    },
    'Experience': {
        en: 'Experience',
        he: 'ניסיון',
    },
    'Completed Events': {
        en: 'Completed Events',
        he: 'אירועים שהושלמו',
    },
    'Works': {
        en: 'Works',
        he: 'עבודות',
    },
    'What clients say about workers': {
        en: 'What clients say about this pro',
        he: 'מה לקוחות אומרים על המקצוען',
    },
    'ratings': {
        en: 'ratings',
        he: 'דירוגים',
    },
    'Read all reviews': {
        en: 'Read all reviews',
        he: 'קרא את כל הביקורות',
    },
    'TOP RATED': {
        en: 'TOP RATED',
        he: 'דירוג גבוה',
    },
    'VERIFIED': {
        en: 'VERIFIED',
        he: 'מאומת',
    },
    'event': {
        en: 'event',
        he: 'אירוע',
    },

    // ===== VENDOR CARD & PROFILE BADGES =====
    'Verified Pro': {
        en: 'Verified Pro',
        he: 'מאומת',
    },
    'Fast Reply': {
        en: 'Fast Reply',
        he: 'תגובה מהירה',
    },
    '✓ Verified': {
        en: '✓ Verified',
        he: '✓ מאומת',
    },
    'TOP': {
        en: 'TOP',
        he: 'מוביל',
    },

    // ===== HERO SECTION STATS =====
    'Verified Pros': {
        en: 'Verified Pros',
        he: 'בעלי מקצוע מאומתים',
    },
    'Happy Clients': {
        en: 'Happy Clients',
        he: 'לקוחות מרוצים',
    },
    'Events Completed': {
        en: 'Events Completed',
        he: 'אירועים שהושלמו',
    },

    // ===== REVIEWS SECTION =====
    'Client Reviews': {
        en: 'Client Reviews',
        he: 'ביקורות לקוחות',
    },
    'Write Review': {
        en: 'Write Review',
        he: 'כתוב ביקורת',
    },
    'Your Rating': {
        en: 'Your Rating',
        he: 'הדירוג שלך',
    },
    'Your Review': {
        en: 'Your Review',
        he: 'הביקורת שלך',
    },
    'Submit Review': {
        en: 'Submit Review',
        he: 'שלח ביקורת',
    },
    'Helpful': {
        en: 'Helpful',
        he: 'שימושי',
    },
    'Show all reviews': {
        en: 'Show all reviews',
        he: 'הצג את כל הביקורות',
    },

    // ===== SMARTFEED =====
    'What can I help you find?': {
        en: 'What can I help you find?',
        he: 'במה אוכל לעזור?',
    },
    'Ask me anything...': {
        en: 'Ask me anything...',
        he: 'שאל אותי כל דבר...',
    },

    // ===== HOW IT WORKS =====
    'How It Works': {
        en: 'How It Works',
        he: 'איך זה עובד',
    },
    'Simple steps to find your perfect professional': {
        en: 'Simple steps to find your perfect professional',
        he: 'צעדים פשוטים למציאת איש המקצוע המושלם',
    },

    // ===== FOOTER =====
    'All rights reserved': {
        en: 'All rights reserved',
        he: 'כל הזכויות שמורות',
    },
    'Privacy Policy': {
        en: 'Privacy Policy',
        he: 'מדיניות פרטיות',
    },
    'Terms of Service': {
        en: 'Terms of Service',
        he: 'תנאי שימוש',
    },
    'Contact Us': {
        en: 'Contact Us',
        he: 'צור קשר',
    },
    'Avg. Rating': {
        en: 'Avg. Rating',
        he: 'דירוג ממוצע',
    },
    'Popular': {
        en: 'Popular:',
        he: 'פופולרי:',
    },
    'How it works': {
        en: 'How it works',
        he: 'איך זה עובד',
    },
    'Search': {
        en: 'Search',
        he: 'חיפוש',
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
