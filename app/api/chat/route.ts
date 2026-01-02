import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { filterVendors } from '@/lib/vendors';
import { Vendor, VendorCategory, City } from '@/types';
import { rateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { chatMessageSchema } from '@/lib/validations';

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
interface ChatResponse {
    response: string;
    vendors: Vendor[];
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

// ===== ENHANCED KEYWORD MAPPINGS (EN/HE ONLY) =====
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
    // Hebrew
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
    // Hebrew
    'תל אביב': 'Tel Aviv', 'ת"א': 'Tel Aviv', 'חיפה': 'Haifa', 'ירושלים': 'Jerusalem',
    'אילת': 'Eilat', 'ראשון לציון': 'Rishon LeZion', 'נתניה': 'Netanya', 'אשדוד': 'Ashdod',
    'באר שבע': 'Beer Sheva', 'פתח תקווה': 'Petah Tikva', 'הרצליה': 'Herzliya', 'רמת גן': 'Ramat Gan',
};

const eventKeywords: Record<string, string> = {
    'wedding': 'Wedding', 'חתונה': 'Wedding', 'marriage': 'Wedding', 'bride': 'Wedding',
    'bar mitzvah': 'Bar Mitzvah', 'bat mitzvah': 'Bat Mitzvah', 'בר מצווה': 'Bar Mitzvah', 'בת מצווה': 'Bat Mitzvah',
    'birthday': 'Birthday', 'יום הולדת': 'Birthday', 'bday': 'Birthday',
    'corporate': 'Corporate', 'אירוע עסקי': 'Corporate', 'company': 'Corporate', 'business': 'Corporate',
    'party': 'Private Party', 'מסיבה': 'Private Party',
    'graduation': 'Graduation', 'סיום': 'Graduation',
    'anniversary': 'Anniversary', 'יום נישואין': 'Anniversary',
    'engagement': 'Engagement', 'אירוסין': 'Engagement',
    'baby shower': 'Baby Shower',
    'new year': 'New Year Party',
    'hanukkah': 'Hanukkah', 'חנוכה': 'Hanukkah',
    'purim': 'Purim', 'פורים': 'Purim',
};

// Budget extraction patterns
const budgetPatterns = [
    /(\d+[,.]?\d*)\s*(shekel|nis|₪)/i,
    /budget[:\s]+(\d+[,.]?\d*)/i,
    /תקציב[:\s]+(\d+[,.]?\d*)/i,
    /(\d+[,.]?\d*)[-–]\s*(\d+[,.]?\d*)\s*(shekel|nis|₪)?/i,
];

// Guest count patterns
const guestPatterns = [
    /(\d+)\s*(guests?|people|persons?|אורחים)/i,
    /for\s+(\d+)/i,
];

// Date patterns
const datePatterns = [
    /(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i,
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

    for (const [keyword, cat] of Object.entries(categoryKeywords)) {
        if (lowerMessage.includes(keyword)) { category = cat; break; }
    }
    for (const [keyword, c] of Object.entries(cityKeywords)) {
        if (lowerMessage.includes(keyword)) { city = c; break; }
    }
    for (const [keyword, event] of Object.entries(eventKeywords)) {
        if (lowerMessage.includes(keyword)) { eventType = event; break; }
    }
    for (const pattern of budgetPatterns) {
        const match = message.match(pattern);
        if (match) {
            budget = match[1] + (match[2] ? ` ${match[2]}` : ' NIS');
            break;
        }
    }
    for (const pattern of guestPatterns) {
        const match = message.match(pattern);
        if (match) {
            guestCount = parseInt(match[1]);
            break;
        }
    }
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
        let results = await filterVendors({ category, city, minRating: 4.0 });
        if (results.length === 0 && category) results = await filterVendors({ category });
        if (results.length === 0 && city) results = await filterVendors({ city });
        return results.slice(0, limit);
    } catch (error) {
        console.error('Error finding vendors:', error);
        return [];
    }
}

// ===== ENHANCED AI SYSTEM PROMPT =====
const SYSTEM_PROMPT = `You are Talentr AI Concierge - an expert personal assistant helping people find the perfect talent and service professionals for events in Israel.

## Your Personality
- Exclusive, sophisticated, and professional
- Expert knowledge about Israeli events and trends
- Warm but efficient, like a high-end concierge
- Uses 1-2 relevant emojis per message max
- Matches the user's energy

## Response Guidelines
### When request is processed:
1. Acknowledge and confirm details
2. Mention the curated list of professionals you found
3. Offer a premium insight or tip

### Language Rules
- ALWAYS respond in the same language the user writes in
- English → English
- Hebrew (עברית) → Hebrew (RTL)
- NEVER use Russian.

## Important Rules
1. Keep responses SHORT (2-3 sentences max)
2. Never invent vendor names or prices
3. Guide toward immediate action
4. No fluff. Strictly premium quality.

## Current Context
[VENDOR_CONTEXT]`;

// ===== GENERATE SMART FOLLOW-UP SUGGESTIONS =====
function generateSuggestions(
    extracted: { category?: VendorCategory; eventType?: string; city?: City },
    language: string,
    hasVendors: boolean
): string[] {
    const lang = language as 'en' | 'he';

    if (hasVendors && extracted.category) {
        const relatedSuggestions: Record<VendorCategory, Record<string, string[]>> = {
            'DJ': {
                en: ['Need a photographer?', 'Show me singers', 'Event decor'],
                he: ['צריך צלם?', 'הראה זמרים', 'עיצוב אירועים'],
            },
            'Photographer': {
                en: ['Need a videographer?', 'Show me DJs', 'Makeup artist'],
                he: ['צריך צלם וידאו?', "הראה דיג'יים", 'מאפרת'],
            },
            // ... (keeping other categories short for brevity, default to generic)
        };
        const defaultRelated = {
            en: ['Show more professionals', 'Find event decor', 'Which city?'],
            he: ['הראה עוד אנשי מקצוע', 'מצא עיצוב אירועים', 'באיזו עיר?'],
        };
        return relatedSuggestions[extracted.category]?.[lang] || defaultRelated[lang] || [];
    }

    const defaultSuggestions = {
        en: ['Planning a wedding', 'Birthday party', 'Corporate event'],
        he: ['מתכנן חתונה', 'יום הולדת', 'אירוע עסקי'],
    };
    return defaultSuggestions[lang] || defaultSuggestions.en;
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
    if (!client) return generateFallbackResponse(extracted, vendors, language);

    try {
        let vendorContext = vendors.length > 0 
            ? `\n[SYSTEM INFO: Found ${vendors.length} professionals. Highlight the selection below.]`
            : `\n[SYSTEM INFO: No vendors found. Suggest broadening the search.]`;

        const systemPrompt = SYSTEM_PROMPT.replace('[VENDOR_CONTEXT]', vendorContext);

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-5).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
                { role: 'user', content: message }
            ],
            max_tokens: 200,
            temperature: 0.6,
        });

        return completion.choices[0]?.message?.content || generateFallbackResponse(extracted, vendors, language);
    } catch (error) {
        console.error('OpenAI API error:', error);
        return generateFallbackResponse(extracted, vendors, language);
    }
}

function generateFallbackResponse(extracted: any, vendors: Vendor[], language: string = 'en'): string {
    const r = {
        en: {
            found: (count: number) => `I found ${count} elite professionals for you. ✨`,
            notFound: () => `I couldn't find exact matches. Which city are you looking in?`,
            askEvent: () => `What kind of event are you planning? 🎉`,
        },
        he: {
            found: (count: number) => `מצאתי ${count} אנשי מקצוע מעולים עבורך. ✨`,
            notFound: () => `לא מצאתי התאמות מדויקות. באיזו עיר אתם מחפשים?`,
            askEvent: () => `איזה סוג אירוע אתם מתכננים? 🎉`,
        }
    }[language as 'en' | 'he'] || {
        en: { found: (count: number) => `Found ${count} pros.`, notFound: () => `No matches.`, askEvent: () => `What event?` }
    };

    if (vendors.length > 0) return r.found(vendors.length);
    return extracted.eventType ? r.notFound() : r.askEvent();
}

export async function POST(request: NextRequest) {
    try {
        const clientIP = getClientIP(request);
        const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.chat);
        if (!rateLimitResult.success) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });

        const body = await request.json();
        const validation = chatMessageSchema.safeParse({ message: body.message, language: body.language || 'en' });
        if (!validation.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

        const { message, language } = validation.data;
        const conversationHistory = body.conversationHistory || [];
        const extracted = extractFromMessage(message);
        const vendors = await findVendors(extracted.category, extracted.city, extracted.eventType);
        const response = await generateAIResponse(message, conversationHistory, extracted, vendors, language);
        const suggestions = generateSuggestions(extracted, language, vendors.length > 0);

        return NextResponse.json({ response, vendors, extracted, suggestions: suggestions.slice(0, 3) });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
