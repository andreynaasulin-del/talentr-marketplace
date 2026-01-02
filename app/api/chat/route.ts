import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { filterVendors } from '@/lib/vendors';
import { Vendor, VendorCategory, City } from '@/types';
import { rateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { chatMessageSchema } from '@/lib/validations';
import { pickPackages, MoodTag } from '@/lib/gigs';

// ===== OPENAI INITIALIZATION =====
let openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) return null;
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
}

// ===== TYPES =====
// Event context for future use
interface _EventContext {
    eventType?: string;
    eventDate?: string;
    guestCount?: number;
    budget?: string;
    city?: City;
    selectedCategories?: VendorCategory[];
}

interface ChatResponse {
    response: string;
    vendors: Vendor[];
    mood?: MoodTag[];
    packages?: ReturnType<typeof pickPackages>;
    surprise?: string;
    extracted: {
        category?: VendorCategory;
        city?: City;
        eventType?: string;
        budget?: string;
        guestCount?: number;
        eventDate?: string;
    };
    suggestions?: string[];
    followUpQuestions?: string[];
}

// ===== ENHANCED KEYWORD MAPPINGS =====
const categoryKeywords: Record<string, VendorCategory> = {
    // English
    'photographer': 'Photographer', 'photo': 'Photographer', 'photography': 'Photographer', 'photoshoot': 'Photographer',
    'videographer': 'Videographer', 'video': 'Videographer', 'film': 'Videographer', 'filming': 'Videographer',
    'dj': 'DJ', 'disc jockey': 'DJ', 'music': 'DJ',
    'mc': 'MC', 'host': 'MC', 'emcee': 'MC', 'presenter': 'MC', 'master of ceremonies': 'MC',
    'magician': 'Magician', 'magic': 'Magician', 'illusion': 'Magician', 'tricks': 'Magician',
    'singer': 'Singer', 'vocalist': 'Singer', 'voice': 'Singer', 'singing': 'Singer',
    'musician': 'Musician', 'band': 'Musician', 'live music': 'Musician', 'orchestra': 'Musician',
    'comedian': 'Comedian', 'comedy': 'Comedian', 'standup': 'Comedian', 'funny': 'Comedian',
    'dancer': 'Dancer', 'dance': 'Dancer', 'dancing': 'Dancer', 'choreography': 'Dancer',
    'bartender': 'Bartender', 'bar': 'Bartender', 'cocktail': 'Bartender', 'drinks': 'Bartender',
    'bar show': 'Bar Show', 'flair': 'Bar Show', 'bottle show': 'Bar Show',
    'decor': 'Event Decor', 'decoration': 'Event Decor', 'flowers': 'Event Decor', 'balloons': 'Event Decor', 'design': 'Event Decor',
    'kids': 'Kids Animator', 'children': 'Kids Animator', 'animator': 'Kids Animator', 'clown': 'Kids Animator',
    'face paint': 'Face Painter', 'face painting': 'Face Painter', 'makeup artist': 'Face Painter',
    'tattoo': 'Piercing/Tattoo', 'henna': 'Piercing/Tattoo', 'piercing': 'Piercing/Tattoo',
    'chef': 'Chef', 'catering': 'Chef', 'food': 'Chef', 'cuisine': 'Chef', 'cooking': 'Chef',
    // Russian (expanded)
    'фотограф': 'Photographer', 'фото': 'Photographer', 'фотосессия': 'Photographer', 'съёмка': 'Photographer',
    'видеограф': 'Videographer', 'видео': 'Videographer', 'видеосъёмка': 'Videographer', 'оператор': 'Videographer',
    'диджей': 'DJ', 'ди-джей': 'DJ', 'дискотека': 'DJ',
    'ведущий': 'MC', 'тамада': 'MC', 'шоумен': 'MC', 'конферансье': 'MC',
    'фокусник': 'Magician', 'иллюзионист': 'Magician', 'маг': 'Magician',
    'певец': 'Singer', 'певица': 'Singer', 'вокалист': 'Singer', 'вокал': 'Singer',
    'музыкант': 'Musician', 'группа': 'Musician', 'оркестр': 'Musician', 'ансамбль': 'Musician',
    'комик': 'Comedian', 'юморист': 'Comedian', 'стендап': 'Comedian',
    'танцор': 'Dancer', 'танцы': 'Dancer', 'балет': 'Dancer', 'хореограф': 'Dancer',
    'бармен': 'Bartender', 'коктейли': 'Bartender', 'напитки': 'Bartender',
    'бар-шоу': 'Bar Show', 'флейринг': 'Bar Show',
    'декор': 'Event Decor', 'оформление': 'Event Decor', 'цветы': 'Event Decor', 'шары': 'Event Decor',
    'аниматор': 'Kids Animator', 'детский': 'Kids Animator', 'клоун': 'Kids Animator',
    'аквагрим': 'Face Painter', 'визажист': 'Face Painter',
    'тату': 'Piercing/Tattoo', 'хна': 'Piercing/Tattoo', 'мехенди': 'Piercing/Tattoo',
    'повар': 'Chef', 'кейтеринг': 'Chef', 'еда': 'Chef', 'банкет': 'Chef',
    // Hebrew (expanded)
    'צלם': 'Photographer', 'צילום': 'Photographer', 'תמונות': 'Photographer',
    'וידאו': 'Videographer', 'צלם וידאו': 'Videographer', 'סרטון': 'Videographer',
    "דיג'יי": 'DJ', 'מוזיקה': 'DJ', 'דיסק': 'DJ',
    'מנחה': 'MC', 'מארח': 'MC', 'תמרה': 'MC',
    'קוסם': 'Magician', 'קסמים': 'Magician', 'אשליות': 'Magician',
    'זמר': 'Singer', 'זמרת': 'Singer', 'שירה': 'Singer',
    'מוזיקאי': 'Musician', 'להקה': 'Musician', 'תזמורת': 'Musician',
    'קומיקאי': 'Comedian', 'סטנדאפ': 'Comedian', 'הומור': 'Comedian',
    'רקדן': 'Dancer', 'רקדנית': 'Dancer', 'ריקוד': 'Dancer',
    'ברמן': 'Bartender', 'קוקטיילים': 'Bartender', 'משקאות': 'Bartender',
    'עיצוב': 'Event Decor', 'קישוט': 'Event Decor', 'פרחים': 'Event Decor', 'בלונים': 'Event Decor',
    'אנימטור': 'Kids Animator', 'הפעלה לילדים': 'Kids Animator', 'ליצן': 'Kids Animator',
    'ציור פנים': 'Face Painter', 'איפור': 'Face Painter',
    'שף': 'Chef', 'קייטרינג': 'Chef', 'אוכל': 'Chef',
};

const cityKeywords: Record<string, City> = {
    // English
    'tel aviv': 'Tel Aviv', 'telaviv': 'Tel Aviv', 'tlv': 'Tel Aviv', 'tel-aviv': 'Tel Aviv',
    'haifa': 'Haifa', 'jerusalem': 'Jerusalem', 'eilat': 'Eilat',
    'rishon': 'Rishon LeZion', 'rishon lezion': 'Rishon LeZion', 'rishon le zion': 'Rishon LeZion',
    'netanya': 'Netanya', 'ashdod': 'Ashdod', 'beer sheva': 'Beer Sheva', 'beersheva': 'Beer Sheva',
    'petah tikva': 'Petah Tikva', 'herzliya': 'Herzliya', 'ramat gan': 'Ramat Gan',
    // Russian
    'тель-авив': 'Tel Aviv', 'тель авив': 'Tel Aviv', 'тельавив': 'Tel Aviv',
    'хайфа': 'Haifa', 'иерусалим': 'Jerusalem', 'эйлат': 'Eilat',
    'ришон': 'Rishon LeZion', 'ришон ле-цион': 'Rishon LeZion',
    'нетания': 'Netanya', 'ашдод': 'Ashdod', 'беэр-шева': 'Beer Sheva',
    'петах-тиква': 'Petah Tikva', 'герцлия': 'Herzliya', 'рамат-ган': 'Ramat Gan',
    // Hebrew
    'תל אביב': 'Tel Aviv', 'ת"א': 'Tel Aviv', 'חיפה': 'Haifa', 'ירושלים': 'Jerusalem',
    'אילת': 'Eilat', 'ראשון לציון': 'Rishon LeZion', 'נתניה': 'Netanya', 'אשדוד': 'Ashdod',
    'באר שבע': 'Beer Sheva', 'פתח תקווה': 'Petah Tikva', 'הרצליה': 'Herzliya', 'רמת גן': 'Ramat Gan',
};

const eventKeywords: Record<string, string> = {
    'wedding': 'Wedding', 'свадьба': 'Wedding', 'חתונה': 'Wedding', 'marriage': 'Wedding', 'bride': 'Wedding',
    'bar mitzvah': 'Bar Mitzvah', 'bat mitzvah': 'Bat Mitzvah', 'בר מצווה': 'Bar Mitzvah', 'בת מצווה': 'Bat Mitzvah',
    'бар мицва': 'Bar Mitzvah', 'бат мицва': 'Bat Mitzvah',
    'birthday': 'Birthday', 'день рождения': 'Birthday', 'יום הולדת': 'Birthday', 'bday': 'Birthday',
    'corporate': 'Corporate', 'корпоратив': 'Corporate', 'אירוע עסקי': 'Corporate', 'company': 'Corporate', 'business': 'Corporate',
    'party': 'Private Party', 'вечеринка': 'Private Party', 'מסיבה': 'Private Party',
    'graduation': 'Graduation', 'выпускной': 'Graduation', 'סיום': 'Graduation',
    'anniversary': 'Anniversary', 'годовщина': 'Anniversary', 'יום נישואין': 'Anniversary',
    'engagement': 'Engagement', 'помолвка': 'Engagement', 'אירוסין': 'Engagement',
    'baby shower': 'Baby Shower', 'беби шауэр': 'Baby Shower',
    'new year': 'New Year Party', 'новый год': 'New Year Party',
    'hanukkah': 'Hanukkah', 'חנוכה': 'Hanukkah', 'ханука': 'Hanukkah',
    'purim': 'Purim', 'פורים': 'Purim', 'пурим': 'Purim',
};

// Budget extraction patterns
const budgetPatterns = [
    /(\d+[,.]?\d*)\s*(shekel|nis|₪|шекел|шек)/i,
    /budget[:\s]+(\d+[,.]?\d*)/i,
    /бюджет[:\s]+(\d+[,.]?\d*)/i,
    /תקציב[:\s]+(\d+[,.]?\d*)/i,
    /(\d+[,.]?\d*)[-–]\s*(\d+[,.]?\d*)\s*(shekel|nis|₪|шекел)?/i,
];

// Guest count patterns
const guestPatterns = [
    /(\d+)\s*(guests?|people|persons?|человек|гост|אורחים)/i,
    /for\s+(\d+)/i,
    /на\s+(\d+)/i,
];

// Date patterns
const datePatterns = [
    /(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i,
    /(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i,
];

// ===== EXTRACTION FUNCTION =====
function extractFromMessage(message: string): {
    category?: VendorCategory;
    city?: City;
    eventType?: string;
    budget?: string;
    guestCount?: number;
    eventDate?: string;
} {
    const lowerMessage = message.toLowerCase();
    let category: VendorCategory | undefined;
    let city: City | undefined;
    let eventType: string | undefined;
    let budget: string | undefined;
    let guestCount: number | undefined;
    let eventDate: string | undefined;

    // Extract category
    for (const [keyword, cat] of Object.entries(categoryKeywords)) {
        if (lowerMessage.includes(keyword)) { category = cat; break; }
    }

    // Extract city
    for (const [keyword, c] of Object.entries(cityKeywords)) {
        if (lowerMessage.includes(keyword)) { city = c; break; }
    }

    // Extract event type
    for (const [keyword, event] of Object.entries(eventKeywords)) {
        if (lowerMessage.includes(keyword)) { eventType = event; break; }
    }

    // Extract budget
    for (const pattern of budgetPatterns) {
        const match = message.match(pattern);
        if (match) {
            budget = match[1] + (match[2] ? ` ${match[2]}` : ' NIS');
            break;
        }
    }

    // Extract guest count
    for (const pattern of guestPatterns) {
        const match = message.match(pattern);
        if (match) {
            guestCount = parseInt(match[1]);
            break;
        }
    }

    // Extract date
    for (const pattern of datePatterns) {
        const match = message.match(pattern);
        if (match) {
            eventDate = match[0];
            break;
        }
    }

    return { category, city, eventType, budget, guestCount, eventDate };
}

// ===== FIND VENDORS =====
async function findVendors(
    category?: VendorCategory,
    city?: City,
    eventType?: string,
    limit: number = 6
): Promise<Vendor[]> {
    try {
        let results = await filterVendors({
            category,
            city,
            minRating: 4.0,
        });

        if (results.length === 0 && category) {
            results = await filterVendors({ category });
        }

        if (results.length === 0 && city) {
            results = await filterVendors({ city });
        }

        return results.slice(0, limit);
    } catch (error) {
        console.error('Error finding vendors:', error);
        return [];
    }
}

// ===== AI SYSTEM PROMPT (MICRO-ENTERTAINMENT / IMPULSE) =====
const SYSTEM_PROMPT = `You are Talentr AI — a vibe-first concierge that helps people in Israel instantly book micro-entertainment “packages” (small, premium, ready-to-go experiences).

## Your Personality
- Dominant & caring: confident, fast, supportive
- Playful and witty when user is bored / spontaneous
- Uses 1–2 emojis max (never spammy)
- Matches the user's language and energy

## Your Expertise
You help users book “micro packages” like:
- 😂 Standup for 2–4 people
- 🎩 Interactive close-up magic
- 🎸 Romantic acoustic for a date
- 🧘‍♂️ Yoga + live music chill session
- 🎨 Balcony street-art / live sketch
- 🎷 Sunset sax / lo-fi set
- 🔥 Pocket fire show (wow moment)

## Core Product Rule
No “agency talk”. No long planning. Assume users want impulse joy.
Guide them to: pick a vibe → pick a package → confirm time/location → book.

## Cities You Cover
Tel Aviv, Haifa, Jerusalem, Eilat, Rishon LeZion, Netanya, Ashdod, 
Beer Sheva, Petah Tikva, Herzliya, Ramat Gan

## Response Guidelines

### Always keep it short & actionable (2–4 sentences)
- Offer 2–3 options max (or ask ONE question)
- Prefer yes/no or emoji choice
- Create “impulse” momentum: “Want it today?” / “30 minutes?” / “Surprise me?”

### When request is vague:
Ask ONE clarifying question:
- “What vibe do you want right now: 😂 fun / 🧘‍♂️ chill / ❤️ romantic / 🔥 wow / 🎨 artsy?”

### Booking flow (minimal)
If user picks something: ask ONLY what’s missing:
- “City?” (if unknown)
- “When? (now / today / this week)” (if unknown)
- Optional: “How many people?”

### Pricing questions:
"Prices depend on the package. I’ll show you 2–3 options and you pick the vibe. 💬"

## Language Rules
- ALWAYS respond in the same language the user writes in
- English → English
- Russian (Русский) → Russian 
- Hebrew (עברית) → Hebrew (RTL)

## Important Rules
1. Keep responses SHORT (2-4 sentences max)
2. Never invent vendor names or specific prices
3. Be positive and solution-oriented
4. Always guide toward booking action
5. If no match, offer a “Surprise me” option

## Current Context
[VENDOR_CONTEXT]`;

// ===== GENERATE SMART FOLLOW-UP SUGGESTIONS =====
function generateSuggestions(
    extracted: { category?: VendorCategory; eventType?: string; city?: City },
    language: string,
    hasVendors: boolean
): string[] {
    const lang = language as 'en' | 'ru' | 'he';

    // Context-aware suggestions based on what's already extracted

    // If we found vendors for a category, suggest related services or next steps
    if (hasVendors && extracted.category) {
        const relatedSuggestions: Record<VendorCategory, Record<string, string[]>> = {
            'DJ': {
                en: ['Also need a photographer', 'Show me singers', 'Need lighting/decor'],
                ru: ['Ещё нужен фотограф', 'Покажи певцов', 'Нужен декор'],
                he: ['גם צריך צלם', 'הראה זמרים', 'צריך עיצוב'],
            },
            'Photographer': {
                en: ['Also need a videographer', 'Show me DJs', 'Need makeup artist'],
                ru: ['Ещё нужен видеограф', 'Покажи диджеев', 'Нужен визажист'],
                he: ['גם צריך צלם וידאו', "הראה דיג'יים", 'צריך מאפרת'],
            },
            'Singer': {
                en: ['Also need a DJ', 'Show me musicians', 'Need a photographer'],
                ru: ['Ещё нужен диджей', 'Покажи музыкантов', 'Нужен фотограф'],
                he: ["גם צריך דיג'יי", 'הראה מוזיקאים', 'צריך צלם'],
            },
            'MC': {
                en: ['Also need a DJ', 'Show me comedians', 'Need a photographer'],
                ru: ['Ещё нужен диджей', 'Покажи комиков', 'Нужен фотограф'],
                he: ["גם צריך דיג'יי", 'הראה קומיקאים', 'צריך צלם'],
            },
            'Videographer': {
                en: ['Also need a photographer', 'Show me DJs', 'Need lighting'],
                ru: ['Ещё нужен фотограф', 'Покажи диджеев', 'Нужен свет'],
                he: ['גם צריך צלם', "הראה דיג'יים", 'צריך תאורה'],
            },
            'Magician': {
                en: ['Also need an animator', 'Show me DJs', 'Need a photographer'],
                ru: ['Ещё нужен аниматор', 'Покажи диджеев', 'Нужен фотограф'],
                he: ['גם צריך אנימטור', "הראה דיג'יים", 'צריך צלם'],
            },
            'Musician': {
                en: ['Also need a singer', 'Show me DJs', 'Need a photographer'],
                ru: ['Ещё нужен певец', 'Покажи диджеев', 'Нужен фотограф'],
                he: ['גם צריך זמר', "הראה דיג'יים", 'צריך צלם'],
            },
            'Comedian': {
                en: ['Also need a DJ', 'Show me MCs', 'Need a photographer'],
                ru: ['Ещё нужен диджей', 'Покажи ведущих', 'Нужен фотограф'],
                he: ["גם צריך דיג'יי", 'הראה מנחים', 'צריך צלם'],
            },
            'Dancer': {
                en: ['Also need a DJ', 'Show me singers', 'Need a photographer'],
                ru: ['Ещё нужен диджей', 'Покажи певцов', 'Нужен фотограф'],
                he: ["גם צריך דיג'יי", 'הראה זמרים', 'צריך צלם'],
            },
            'Bartender': {
                en: ['Also need bar show', 'Show me DJs', 'Need a photographer'],
                ru: ['Ещё нужно бар-шоу', 'Покажи диджеев', 'Нужен фотограф'],
                he: ['גם צריך בר שואו', "הראה דיג'יים", 'צריך צלם'],
            },
            'Bar Show': {
                en: ['Also need a bartender', 'Show me DJs', 'Need a photographer'],
                ru: ['Ещё нужен бармен', 'Покажи диджеев', 'Нужен фотограф'],
                he: ['גם צריך ברמן', "הראה דיג'יים", 'צריך צלם'],
            },
            'Event Decor': {
                en: ['Also need flowers', 'Show me photographers', 'Need lighting'],
                ru: ['Ещё нужны цветы', 'Покажи фотографов', 'Нужен свет'],
                he: ['גם צריך פרחים', 'הראה צלמים', 'צריך תאורה'],
            },
            'Kids Animator': {
                en: ['Also need a magician', 'Show me face painters', 'Need a photographer'],
                ru: ['Ещё нужен фокусник', 'Покажи аквагрим', 'Нужен фотограф'],
                he: ['גם צריך קוסם', 'הראה ציור פנים', 'צריך צלם'],
            },
            'Face Painter': {
                en: ['Also need an animator', 'Show me magicians', 'Need a photographer'],
                ru: ['Ещё нужен аниматор', 'Покажи фокусников', 'Нужен фотограф'],
                he: ['גם צריך אנימטור', 'הראה קוסמים', 'צריך צלם'],
            },
            'Piercing/Tattoo': {
                en: ['Also need makeup', 'Show me photographers', 'Need decorations'],
                ru: ['Ещё нужен макияж', 'Покажи фотографов', 'Нужен декор'],
                he: ['גם צריך איפור', 'הראה צלמים', 'צריך קישוט'],
            },
            'Chef': {
                en: ['Also need a bartender', 'Show me decorators', 'Need a photographer'],
                ru: ['Ещё нужен бармен', 'Покажи декораторов', 'Нужен фотограф'],
                he: ['גם צריך ברמן', 'הראה מעצבים', 'צריך צלם'],
            },
        };

        return relatedSuggestions[extracted.category]?.[lang] || relatedSuggestions[extracted.category]?.en || [];
    }

    // If category selected but asking for city
    if (extracted.category && !extracted.city) {
        return {
            en: ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat'],
            ru: ['Тель-Авив', 'Хайфа', 'Иерусалим', 'Эйлат'],
            he: ['תל אביב', 'חיפה', 'ירושלים', 'אילת'],
        }[lang] || [];
    }

    // Based on event type - suggest relevant professionals
    if (extracted.eventType === 'Wedding') {
        return {
            en: ['Need a photographer', 'Need a DJ', 'Need a videographer'],
            ru: ['Нужен фотограф', 'Нужен диджей', 'Нужен видеограф'],
            he: ['צריך צלם', "צריך דיג'יי", 'צריך צלם וידאו'],
        }[lang] || [];
    }

    if (extracted.eventType === 'Bar Mitzvah' || extracted.eventType === 'Bat Mitzvah') {
        return {
            en: ['Need a DJ', 'Need an animator', 'Need a photographer'],
            ru: ['Нужен диджей', 'Нужен аниматор', 'Нужен фотограф'],
            he: ["צריך דיג'יי", 'צריך אנימטור', 'צריך צלם'],
        }[lang] || [];
    }

    if (extracted.eventType === 'Birthday') {
        return {
            en: ['Need an animator', 'Need a photographer', 'Need a magician'],
            ru: ['Нужен аниматор', 'Нужен фотограф', 'Нужен фокусник'],
            he: ['צריך אנימטור', 'צריך צלם', 'צריך קוסם'],
        }[lang] || [];
    }

    // Default - micro vibe picks (no “weddings/corporate” bias)
    return {
        en: ['😂 Make me laugh', '🧘‍♂️ Chill & relax', '🔥 I want wow'],
        ru: ['😂 Хочу посмеяться', '🧘‍♂️ Чилл и релакс', '🔥 Хочу вау'],
        he: ['😂 תצחיק אותי', '🧘‍♂️ צ׳יל ורילקס', '🔥 תן לי וואו'],
    }[lang] || [];
}

// ===== MOOD DETECTION (LIGHTWEIGHT) =====
function detectMood(message: string): MoodTag[] {
    const lower = message.toLowerCase();
    const tags: Set<MoodTag> = new Set();

    const addIf = (conds: (string | RegExp)[], tag: MoodTag) => {
        if (conds.some(c => typeof c === 'string' ? lower.includes(c) : c.test(lower))) {
            tags.add(tag);
        }
    };

    addIf(['😂', 'fun', 'laugh', 'lol', 'xd', 'смеш', 'угар', 'весел', 'מצחיק'], 'fun');
    addIf(['romantic', 'love', 'date', '❤️', 'роман', 'свидан', 'אהבה'], 'romantic');
    addIf(['chill', 'calm', 'relax', '🧘', 'zen', 'тихо', 'спокой', 'רגוע'], 'chill');
    addIf(['wow', 'shock', '🔥', 'эпик', 'вау', 'תדהמה'], 'wow');
    addIf(['art', 'creative', 'sketch', 'мурал', 'арт', 'ציור', 'גרפיטי'], 'artsy');

    if (tags.size === 0) tags.add('fun');
    return Array.from(tags);
}

// ===== AI RESPONSE GENERATION =====
async function generateAIResponse(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    extracted: ReturnType<typeof extractFromMessage>,
    vendors: Vendor[],
    language: string
): Promise<string> {
    const client = getOpenAI();
    if (!client) {
        return generateFallbackResponse(extracted, vendors, language);
    }

    try {
        // Build vendor context
        let vendorContext = '';
        if (vendors.length > 0) {
            vendorContext = `\n[SYSTEM INFO: Found ${vendors.length} excellent ${extracted.category || 'professional'}s. Cards will display automatically. Be enthusiastic!]`;
        } else if (extracted.category || extracted.city) {
            vendorContext = `\n[SYSTEM INFO: No vendors found for this specific search. Suggest broadening criteria or trying nearby cities.]`;
        }

        const systemPrompt = SYSTEM_PROMPT.replace('[VENDOR_CONTEXT]', vendorContext);

        const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-8).map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const completion = await client.chat.completions.create({
                model: 'gpt-4o-mini',  // Cost-effective model (15x cheaper than gpt-4o)
                messages,
                max_tokens: 300,  // Shorter responses = faster + cheaper
                temperature: 0.7,
                presence_penalty: 0.2,
                frequency_penalty: 0.1,
            }, { signal: controller.signal });

            clearTimeout(timeoutId);
            return completion.choices[0]?.message?.content || generateFallbackResponse(extracted, vendors, language);
        } catch (apiError) {
            clearTimeout(timeoutId);
            throw apiError;
        }
    } catch (error: unknown) {
        // Log error details for debugging (but not sensitive info)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('aborted')) {
            console.error('OpenAI API timeout (10s exceeded)');
        } else {
            console.error('OpenAI API error:', errorMessage);
        }
        return generateFallbackResponse(extracted, vendors, language);
    }
}

// ===== FALLBACK RESPONSES =====
function generateFallbackResponse(
    extracted: ReturnType<typeof extractFromMessage>,
    vendors: Vendor[],
    language: string = 'en'
): string {
    const { category, city, eventType } = extracted;

    const responses = {
        en: {
            found: (count: number, cat: string, loc?: string) =>
                `Great news! I found ${count} amazing ${cat}s${loc ? ` in ${loc}` : ''} for you! ✨ Take a look at these top-rated professionals.`,
            notFound: () =>
                `I couldn't find exact matches, but let me help you! Which city are you looking in?`,
            askEvent: () =>
                `I'd love to help! What kind of event are you planning? 🎉`,
            askCategory: () =>
                `What kind of professional are you looking for? Photographer, DJ, singer, or something else?`,
        },
        ru: {
            found: (count: number, cat: string, loc?: string) =>
                `Отлично! Нашёл ${count} потрясающих специалистов${loc ? ` в ${loc}` : ''}! ✨ Посмотрите на этих профессионалов.`,
            notFound: () =>
                `Не нашёл точных совпадений. В каком городе вы ищете?`,
            askEvent: () =>
                `С удовольствием помогу! Какое мероприятие вы планируете? 🎉`,
            askCategory: () =>
                `Какого специалиста вы ищете? Фотографа, диджея, певца или кого-то ещё?`,
        },
        he: {
            found: (count: number, cat: string, loc?: string) =>
                `מצאתי ${count} מקצוענים מעולים${loc ? ` ב${loc}` : ''}! ✨ הנה הטובים ביותר.`,
            notFound: () =>
                `לא מצאתי התאמות מדויקות. באיזה עיר אתה מחפש?`,
            askEvent: () =>
                `אשמח לעזור! איזה סוג אירוע אתה מתכנן? 🎉`,
            askCategory: () =>
                `איזה איש מקצוע אתה מחפש? צלם, דיג'יי, זמר או משהו אחר?`,
        },
    };

    const r = responses[language as keyof typeof responses] || responses.en;

    if (vendors.length > 0) {
        return r.found(vendors.length, category || 'professional', city);
    }

    if (category && !city) {
        return r.notFound();
    }

    if (!category && eventType) {
        return r.askCategory();
    }

    return r.askEvent();
}

// ===== MAIN API HANDLER =====
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIP = getClientIP(request);
        const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.chat);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429, headers: rateLimitHeaders(rateLimitResult) }
            );
        }

        const body = await request.json();

        // Validate input
        const validation = chatMessageSchema.safeParse({
            message: body.message,
            language: body.language || 'en'
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0]?.message || 'Invalid input' },
                { status: 400 }
            );
        }

        const { message, language } = validation.data;
        const conversationHistory = body.conversationHistory || [];
        const existingContext = body.context || {};

        // Extract entities from message
        const extracted = extractFromMessage(message);

        // Detect mood tags for micro-entertainment flow
        const mood = detectMood(message);

        // Merge with existing context
        const mergedExtracted = {
            ...existingContext,
            ...extracted,
            // Only override if new value exists
            category: extracted.category || existingContext.selectedCategories?.[0],
            city: extracted.city || existingContext.city,
            eventType: extracted.eventType || existingContext.eventType,
        };

        // Find matching vendors
        const vendors = await findVendors(
            mergedExtracted.category,
            mergedExtracted.city,
            mergedExtracted.eventType,
            6
        );

        // Pick micro-entertainment packages by mood
        const packages = pickPackages(mood, 3);
        const surprise = Math.random() > 0.6
            ? '🎁 Сюрприз при первом заказе: мини-бонус от артиста'
            : undefined;

        // Generate AI response
        const response = await generateAIResponse(
            message,
            conversationHistory,
            mergedExtracted,
            vendors,
            language
        );

        // Generate follow-up suggestions based on context
        const suggestions = generateSuggestions(mergedExtracted, language, vendors.length > 0);

        const result: ChatResponse = {
            response,
            vendors,
            mood,
            packages,
            surprise,
            extracted: mergedExtracted,
            suggestions: suggestions.slice(0, 4),
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        );
    }
}
