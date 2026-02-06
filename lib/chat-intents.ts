/**
 * Intent Mapping: URL slug → chat scenario
 * Controls AI behavior, tone, and first messages per category landing page.
 */

export interface ChatIntent {
  intent: string;
  category: string;
  tone: string;
  firstMessage: {
    en: string;
    he: string;
  };
  systemContext: string; // Extra system prompt context for this intent
  suggestedQuestions: {
    en: string[];
    he: string[];
  };
}

export const INTENT_MAP: Record<string, ChatIntent> = {
  // ===== ADULT =====
  dj: {
    intent: 'book_dj',
    category: 'DJ',
    tone: 'energetic',
    firstMessage: {
      en: "Hey! 🎶 I'll help you find the perfect DJ for your event.\nTell me:\n1️⃣ When is your event?\n2️⃣ What type of event? (wedding, party, corporate)\n3️⃣ Any music style preferences?",
      he: "היי! 🎶 אעזור לך למצוא את הדיג'יי המושלם לאירוע שלך.\nספר לי:\n1️⃣ מתי האירוע?\n2️⃣ איזה סוג אירוע? (חתונה, מסיבה, עסקי)\n3️⃣ סגנון מוזיקה מועדף?",
    },
    systemContext: 'User wants to book a DJ. Focus on: event date, venue size, music style, equipment needs. If evening event — ask about dance floor vibe. If corporate — ask about atmosphere level. Suggest matching DJs quickly.',
    suggestedQuestions: {
      en: ['Wedding DJ with lights?', 'House/techno for a party?', 'Background music for corporate?'],
      he: ['DJ לחתונה עם תאורה?', 'האוס/טכנו למסיבה?', 'מוזיקת רקע לאירוע עסקי?'],
    },
  },

  magician: {
    intent: 'book_magician',
    category: 'Magician',
    tone: 'intriguing',
    firstMessage: {
      en: "Hey! ✨ Let's find a magician that'll blow your guests' minds.\nTell me:\n1️⃣ When is your event?\n2️⃣ What type? (close-up, stage show, mentalism)\n3️⃣ How many guests?",
      he: "היי! ✨ בוא נמצא קוסם שיפיל את הלסת לאורחים שלך.\nספר לי:\n1️⃣ מתי האירוע?\n2️⃣ איזה סוג? (קלוז-אפ, במה, מנטליזם)\n3️⃣ כמה אורחים?",
    },
    systemContext: 'User wants to book a magician. Focus on: event type, audience size, preferred magic style (close-up roaming vs stage show vs mentalism). For corporate — suggest brand integration. For kids — redirect to kids-magician.',
    suggestedQuestions: {
      en: ['Close-up magic for cocktail hour?', 'Stage show for 100+ guests?', 'Mentalism for corporate?'],
      he: ['קסמי קלוז-אפ לשעת קוקטייל?', 'מופע במה ל-100+ אורחים?', 'מנטליזם לאירוע עסקי?'],
    },
  },

  comedian: {
    intent: 'book_comedian',
    category: 'Comedian',
    tone: 'witty',
    firstMessage: {
      en: "Hey! 😄 Let's get your guests laughing!\nTell me:\n1️⃣ When is your event?\n2️⃣ What type of event?\n3️⃣ Clean comedy or no limits?",
      he: "היי! 😄 בוא נגרום לאורחים שלך לצחוק!\nספר לי:\n1️⃣ מתי האירוע?\n2️⃣ איזה סוג אירוע?\n3️⃣ קומדיה נקייה או בלי גבולות?",
    },
    systemContext: 'User wants to book a comedian. Focus on: event type, audience demographics, content boundaries (clean vs adult). For corporate — emphasize professional, appropriate content. Ask about language preferences (Hebrew, English, Russian).',
    suggestedQuestions: {
      en: ['Stand-up for a birthday?', 'MC + comedy for wedding?', 'Corporate team event?'],
      he: ['סטנדאפ ליום הולדת?', 'הנחיה + קומדיה לחתונה?', 'אירוע צוות עסקי?'],
    },
  },

  singer: {
    intent: 'book_singer',
    category: 'Singer',
    tone: 'warm',
    firstMessage: {
      en: "Hey! 🎤 Live music makes every event special.\nTell me:\n1️⃣ When is your event?\n2️⃣ What genre? (pop, jazz, soul, Middle Eastern)\n3️⃣ Solo singer or with a band?",
      he: "היי! 🎤 מוזיקה חיה הופכת כל אירוע למיוחד.\nספר לי:\n1️⃣ מתי האירוע?\n2️⃣ איזה ז'אנר? (פופ, ג'אז, סול, מזרחי)\n3️⃣ סולו או עם להקה?",
    },
    systemContext: 'User wants to book a singer. Focus on: genre preference, solo vs band, event type (wedding ceremony vs party vs cocktail hour). Ask about specific song requests. Suggest different configurations based on budget.',
    suggestedQuestions: {
      en: ['Acoustic for ceremony?', 'Full band for party?', 'Jazz for cocktail hour?'],
      he: ['אקוסטי לטקס?', 'להקה מלאה למסיבה?', 'ג\'אז לשעת קוקטייל?'],
    },
  },

  bartender: {
    intent: 'book_bartender',
    category: 'Bartender',
    tone: 'sophisticated',
    firstMessage: {
      en: "Hey! 🍸 Let's set up the perfect bar for your event.\nTell me:\n1️⃣ When is your event?\n2️⃣ How many guests?\n3️⃣ Cocktail bar or full bar service?",
      he: "היי! 🍸 בוא נקים את הבר המושלם לאירוע שלך.\nספר לי:\n1️⃣ מתי האירוע?\n2️⃣ כמה אורחים?\n3️⃣ בר קוקטיילים או שירות בר מלא?",
    },
    systemContext: 'User wants to book a bartender. Focus on: guest count, type of service (cocktail bar vs full bar vs flair show), whether they provide alcohol or need all-inclusive. Ask about signature cocktails or event theme.',
    suggestedQuestions: {
      en: ['Flair show for a party?', 'Custom cocktail menu?', 'Full bar with staff?'],
      he: ['מופע פלייר למסיבה?', 'תפריט קוקטיילים מותאם?', 'בר מלא עם צוות?'],
    },
  },

  // ===== KIDS =====
  'kids-animator': {
    intent: 'book_kids_animator',
    category: 'Kids Animator',
    tone: 'friendly_family',
    firstMessage: {
      en: "Hey! 🎪 Let's make your kid's party unforgettable!\nTell me:\n👶 How old are the kids?\n📅 When is the party?\n🎭 Any favorite themes? (princess, superhero, pirate)",
      he: "היי! 🎪 בוא נהפוך את מסיבת הילדים לבלתי נשכחת!\nספר לי:\n👶 בני כמה הילדים?\n📅 מתי המסיבה?\n🎭 נושא מועדף? (נסיכה, גיבור-על, פיראט)",
    },
    systemContext: 'User wants to book a kids animator. Use a warm, parent-friendly tone. Focus on: kids ages, party theme, number of children, location. Emphasize safety and experience with children. No nightlife or adult references.',
    suggestedQuestions: {
      en: ['Princess party for age 5?', 'Superhero theme for age 7?', 'Games + balloon animals?'],
      he: ['מסיבת נסיכות לגיל 5?', 'נושא גיבורי-על לגיל 7?', 'משחקים + חיות בלונים?'],
    },
  },

  'face-painter': {
    intent: 'book_face_painter',
    category: 'Face Painter',
    tone: 'friendly_family',
    firstMessage: {
      en: "Hey! 🎨 Let's make the kids' party colorful!\nTell me:\n👶 How old are the kids?\n👥 How many kids?\n📅 When is the party?",
      he: "היי! 🎨 בוא נהפוך את מסיבת הילדים לצבעונית!\nספר לי:\n👶 בני כמה הילדים?\n👥 כמה ילדים?\n📅 מתי המסיבה?",
    },
    systemContext: 'User wants to book a face painter. Use a warm, parent-friendly tone. Focus on: number of kids (determines time needed), ages, any allergies or sensitive skin concerns. Emphasize hypoallergenic and safe paints. Can suggest combining with other kids entertainment.',
    suggestedQuestions: {
      en: ['Face painting for 15 kids?', 'Also glitter tattoos?', 'Add balloon animals?'],
      he: ['ציור פנים ל-15 ילדים?', 'גם קעקועי נצנצים?', 'להוסיף חיות בלונים?'],
    },
  },

  'kids-magician': {
    intent: 'book_kids_magician',
    category: 'Kids Magician',
    tone: 'friendly_family',
    firstMessage: {
      en: "Hey! ✨ Magic is the best gift for a kids party!\nTell me:\n👶 How old is the birthday kid?\n👥 How many children?\n📅 When is the party?",
      he: "היי! ✨ קסמים זו המתנה הכי טובה למסיבת ילדים!\nספר לי:\n👶 בן כמה חוגג/ת?\n👥 כמה ילדים?\n📅 מתי המסיבה?",
    },
    systemContext: 'User wants to book a kids magician. Use a warm, parent-friendly tone. Focus on: birthday child age (determines show style), number of kids, show duration. Emphasize that birthday child becomes the star. Mention balloon animals as add-on.',
    suggestedQuestions: {
      en: ['Magic show for age 5?', '45-min show with balloons?', 'Birthday child as magic star?'],
      he: ['מופע קסמים לגיל 5?', 'מופע 45 דקות עם בלונים?', 'ילד יום ההולדת ככוכב?'],
    },
  },

  dancer: {
    intent: 'book_dancer',
    category: 'Dancer',
    tone: 'energetic',
    firstMessage: {
      en: "Hey! 💃 Let's add some moves to your event!\nTell me:\n1️⃣ What type of event?\n2️⃣ Dance style? (hip-hop, Latin, contemporary, kids dance party)\n3️⃣ Performance or workshop?",
      he: "היי! 💃 בוא נוסיף תנועה לאירוע שלך!\nספר לי:\n1️⃣ איזה סוג אירוע?\n2️⃣ סגנון ריקוד? (היפ-הופ, לטיני, עכשווי, מסיבת ריקודים לילדים)\n3️⃣ הופעה או סדנה?",
    },
    systemContext: 'User wants to book a dancer. Focus on: event type, dance style preference, performance vs interactive workshop, solo or group. For kids events — emphasize fun games and age-appropriate. For weddings — suggest first dance choreography.',
    suggestedQuestions: {
      en: ['Dance workshop for guests?', 'Kids dance party?', 'First dance choreography?'],
      he: ['סדנת ריקוד לאורחים?', 'מסיבת ריקודים לילדים?', 'כוריאוגרפיה לריקוד ראשון?'],
    },
  },

  clown: {
    intent: 'book_clown',
    category: 'Clown',
    tone: 'friendly_family',
    firstMessage: {
      en: "Hey! 🤡 Let's bring the laughs to your kid's party!\nTell me:\n👶 How old are the kids?\n📅 When is the party?\n🎈 Want balloon animals included?",
      he: "היי! 🤡 בוא נביא את הצחוקים למסיבת הילדים!\nספר לי:\n👶 בני כמה הילדים?\n📅 מתי המסיבה?\n🎈 לכלול חיות בלונים?",
    },
    systemContext: 'User wants to book a clown. Use a warm, parent-friendly tone. Focus on: kids ages (best for 3-10), party size, duration, extras (balloons, face painting, juggling). Emphasize fun, safe, colorful entertainment.',
    suggestedQuestions: {
      en: ['Clown + balloons for age 4?', '2 hour party package?', 'Add face painting?'],
      he: ['ליצן + בלונים לגיל 4?', 'חבילה לשעתיים?', 'להוסיף ציור פנים?'],
    },
  },
};

// Fallback for unknown slugs or direct homepage chat
export const FALLBACK_INTENT: ChatIntent = {
  intent: 'general',
  category: '',
  tone: 'helpful',
  firstMessage: {
    en: "Hey! 👋 How can I help you today?\nAre you looking for an entertainer, a service, or have a question?",
    he: "היי! 👋 איך אוכל לעזור לך היום?\nאתה מחפש אמן, שירות, או רוצה לשאול שאלה?",
  },
  systemContext: 'No specific intent detected. Ask what the user is looking for and guide them to the right category.',
  suggestedQuestions: {
    en: ['Entertainment for a party', 'Romantic surprise', 'Corporate event'],
    he: ['בידור למסיבה', 'הפתעה רומנטית', 'אירוע עסקי'],
  },
};

/**
 * Resolve intent from URL path.
 * Handles: /book/dj, /become/dj, or any path with category slug.
 */
export function resolveIntentFromUrl(url: string): ChatIntent {
  // Extract slug from URL patterns like /book/dj or /become/dj
  const match = url.match(/\/(book|become)\/([\w-]+)/);
  if (match) {
    const slug = match[2];
    return INTENT_MAP[slug] || FALLBACK_INTENT;
  }
  return FALLBACK_INTENT;
}

export function getIntentBySlug(slug: string): ChatIntent {
  return INTENT_MAP[slug] || FALLBACK_INTENT;
}
