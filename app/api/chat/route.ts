import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { filterVendors } from '@/lib/vendors';
import { Vendor, VendorCategory, City } from '@/types';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { chatMessageSchema } from '@/lib/validations';
import { packages, Package } from '@/lib/gigs';

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
    packages: Package[];
    suggestions?: string[];
}

// ===== CATEGORY KEYWORDS (EN/HE ONLY) =====
const categoryKeywords: Record<string, VendorCategory> = {
    'photographer': 'Photographer', 'photo': 'Photographer', 'צלם': 'Photographer',
    'dj': 'DJ', 'music': 'DJ', "דיג'יי": 'DJ', 'מוזיקה': 'DJ',
    'magician': 'Magician', 'magic': 'Magician', 'קוסם': 'Magician',
    'singer': 'Singer', 'vocalist': 'Singer', 'זמר': 'Singer',
    'musician': 'Musician', 'band': 'Musician', 'guitar': 'Musician', 'גיטרה': 'Musician', 'acoustic': 'Musician',
    'comedian': 'Comedian', 'comedy': 'Comedian', 'standup': 'Comedian', 'סטנדאפ': 'Comedian',
    'dancer': 'Dancer', 'dance': 'Dancer', 'רקדן': 'Dancer',
    'bartender': 'Bartender', 'cocktail': 'Bartender', 'ברמן': 'Bartender',
    'chef': 'Chef', 'sushi': 'Chef', 'cooking': 'Chef', 'שף': 'Chef', 'סושי': 'Chef',
    'fire': 'Dancer', 'אש': 'Dancer',
    'artist': 'Face Painter', 'portrait': 'Face Painter', 'אמן': 'Face Painter',
};

const cityKeywords: Record<string, City> = {
    'tel aviv': 'Tel Aviv', 'tlv': 'Tel Aviv', 'תל אביב': 'Tel Aviv',
    'haifa': 'Haifa', 'חיפה': 'Haifa',
    'jerusalem': 'Jerusalem', 'ירושלים': 'Jerusalem',
    'eilat': 'Eilat', 'אילת': 'Eilat',
    'herzliya': 'Herzliya', 'הרצליה': 'Herzliya',
    'netanya': 'Netanya', 'נתניה': 'Netanya',
};

// ===== EXTRACTION =====
function extractFromMessage(message: string): {
    category?: VendorCategory;
    city?: City;
    keywords: string[];
} {
    const lower = message.toLowerCase();
    let category: VendorCategory | undefined;
    let city: City | undefined;
    const keywords: string[] = [];

    for (const [kw, cat] of Object.entries(categoryKeywords)) {
        if (lower.includes(kw)) {
            category = cat;
            keywords.push(kw);
            break;
        }
    }
    for (const [kw, c] of Object.entries(cityKeywords)) {
        if (lower.includes(kw)) {
            city = c;
            break;
        }
    }

    return { category, city, keywords };
}

// ===== FIND PACKAGES BY KEYWORDS =====
function findPackagesByKeywords(keywords: string[], category?: VendorCategory): Package[] {
    if (keywords.length === 0 && !category) {
        // Return featured packages
        return packages.slice(0, 4);
    }

    const matched = packages.filter(pkg => {
        if (category && pkg.category.toLowerCase().includes(category.toLowerCase())) {
            return true;
        }
        return keywords.some(kw =>
            pkg.title.en.toLowerCase().includes(kw) ||
            pkg.title.he.includes(kw) ||
            pkg.description.en.toLowerCase().includes(kw) ||
            pkg.description.he.includes(kw) ||
            pkg.category.toLowerCase().includes(kw)
        );
    });

    return matched.length > 0 ? matched.slice(0, 4) : packages.slice(0, 4);
}

// ===== FIND VENDORS =====
async function findVendors(
    category?: VendorCategory,
    city?: City,
    limit: number = 3
): Promise<Vendor[]> {
    try {
        let results = await filterVendors({ category, city, minRating: 4.0 });
        if (results.length === 0 && category) results = await filterVendors({ category });
        if (results.length === 0 && city) results = await filterVendors({ city });
        return results.slice(0, limit);
    } catch (error) {
        return [];
    }
}

// ===== AI SYSTEM PROMPT - CONCIERGE SERVICE =====
const SYSTEM_PROMPT = `You are the intelligent Concierge Service on the Talentr platform. Your role is to be a personal manager for two types of users: Vendors (partners providing services) and Clients (customers).

## Communication Goals

**For Clients:**
- Help find the right vendor
- Answer questions about services
- Help navigate the website
- Explain booking process

**For Vendors:**
- Help manage their profile
- Explain partnership terms
- Inform about client requests
- Improve their platform experience

## Communication Principles

1. **Business Etiquette:** Polite, professional, and articulate. No developer slang. You are the face of the service.

2. **Value Focus:** Your answers should help the user complete a deal faster or solve a problem.

3. **Deep Context:** You understand client-vendor relationships on our platform (booking, payment, guarantees).

4. **Proactivity:** If a client asks about a service, offer to clarify details for better vendor matching. If a vendor asks about work, explain how to get more orders.

## Tone of Voice
- Helpful but expert
- Structured (use lists and paragraphs for clarity)
- No fluff, no technical information about how AI works

## Response Templates

**Client question:** "I'll help you find the best specialist for your needs. Tell me, what exactly are you looking for?"

**Vendor question:** "Happy to help with your account setup. To attract more clients, I recommend filling out the section..."

## Available Packages
- Romantic Acoustic - 45 min live guitar & vocals
- Magic Chaos - 60 min close-up magic
- DJ Set TLV 2026 - 3-hour DJ set
- Private Stand-Up - 40 min comedy
- Sushi Masterclass - 90 min workshop
- Cocktail Show - 60 min flair show
- Fire Performance - 20 min fire show

## CRITICAL FORMATTING RULES
1. NEVER use markdown formatting in responses
2. NEVER use asterisks (*) for bold or emphasis - this looks ugly in chat
3. NEVER use underscores (_) for italic
4. NEVER use hashtags (#) for headers
5. Write clean, plain text only
6. Use line breaks and numbered lists (1. 2. 3.) for structure if needed
7. Keep responses short: 2-4 sentences maximum

## Rules
1. Keep responses concise (2-4 sentences)
2. Match user's language (English or Hebrew)
3. Never mention specific prices or currency
4. Never discuss programming, tech stack, or internal development
5. Don't mention other startups or go off-topic
6. Respond in PLAIN TEXT only, no formatting symbols

## Context
[CONTEXT]`;

// ===== GENERATE SUGGESTIONS =====
function generateSuggestions(category?: VendorCategory, language: string = 'en'): string[] {
    const lang = language as 'en' | 'he';

    const suggestions: Record<string, Record<string, string[]>> = {
        'Musician': {
            en: ['Romantic acoustic?', 'DJ for a party?', 'Live jazz?'],
            he: ['אקוסטי רומנטי?', 'DJ למסיבה?', 'ג׳אז לייב?'],
        },
        'Magician': {
            en: ['Close-up magic?', 'Stage show?', 'Kids party?'],
            he: ['קסמים מקרוב?', 'מופע במה?', 'מסיבת ילדים?'],
        },
        'Chef': {
            en: ['Sushi workshop?', 'Private chef?', 'Cocktails?'],
            he: ['סדנת סושי?', 'שף פרטי?', 'קוקטיילים?'],
        },
    };

    if (category && suggestions[category]) {
        return suggestions[category][lang] || suggestions[category].en;
    }

    const defaults = {
        en: ['Entertainment for a party', 'Romantic surprise', 'Corporate event'],
        he: ['בידור למסיבה', 'הפתעה רומנטית', 'אירוע עסקי'],
    };
    return defaults[lang] || defaults.en;
}

// ===== AI RESPONSE =====
async function generateAIResponse(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    pkgs: Package[],
    vendors: Vendor[],
    language: string
): Promise<string> {
    const client = getOpenAI();
    if (!client) return generateFallbackResponse(pkgs, language);

    try {
        const pkgNames = pkgs.map(p => `${p.title[language as 'en' | 'he']}`).join(', ');
        let context = '';
        if (pkgs.length > 0) {
            context = `[Matching packages: ${pkgNames}]`;
        }
        if (vendors.length > 0) {
            context += `\n[Found ${vendors.length} verified professionals]`;
        }

        const systemPrompt = SYSTEM_PROMPT.replace('[CONTEXT]', context || '[No specific match]');

        const completion = await client.chat.completions.create({
            model: 'gpt-4o', // Flagship model for maximum uniqueness and intelligence
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-4).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
                { role: 'user', content: message }
            ],
            max_tokens: 150,
            temperature: 0.8,
        });

        return completion.choices[0]?.message?.content || generateFallbackResponse(pkgs, language);
    } catch (error) {
        return generateFallbackResponse(pkgs, language);
    }
}

function generateFallbackResponse(pkgs: Package[], language: string): string {
    const r = {
        en: {
            hasPackages: `I found ${pkgs.length} packages that match your request. Take a look below.`,
            noMatch: "I'd recommend browsing our premium packages. What type of entertainment interests you?",
        },
        he: {
            hasPackages: `מצאתי ${pkgs.length} חבילות שמתאימות לבקשה שלך. הנה למטה.`,
            noMatch: "אני ממליץ לעיין בחבילות הפרימיום שלנו. איזה סוג בידור מעניין אותך?",
        },
    }[language as 'en' | 'he'] || { hasPackages: "Found packages.", noMatch: "Browse our packages." };

    return pkgs.length > 0 ? r.hasPackages : r.noMatch;
}

// ===== MAIN HANDLER =====
export async function POST(request: NextRequest) {
    try {
        const clientIP = getClientIP(request);
        const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.chat);
        if (!rateLimitResult.success) {
            return NextResponse.json({
                error: 'Rate limit',
                response: "Please wait a moment before sending another message.",
                vendors: [],
                packages: [],
            }, { status: 429 });
        }

        const body = await request.json();
        const validation = chatMessageSchema.safeParse({ message: body.message, language: body.language || 'en' });
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { message, language } = validation.data;
        const conversationHistory = body.conversationHistory || [];
        const extracted = extractFromMessage(message);

        // Find matching packages
        const matchedPackages = findPackagesByKeywords(extracted.keywords, extracted.category);

        // Find vendors if specific category detected
        const vendors = extracted.category
            ? await findVendors(extracted.category, extracted.city, 3)
            : [];

        // Generate AI response
        const response = await generateAIResponse(
            message,
            conversationHistory,
            matchedPackages,
            vendors,
            language
        );

        // Smart suggestions
        const suggestions = generateSuggestions(extracted.category, language);

        return NextResponse.json({
            response,
            vendors,
            packages: matchedPackages,
            suggestions: suggestions.slice(0, 3),
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Internal error',
            response: "Something went wrong. Please try again.",
            vendors: [],
            packages: [],
        }, { status: 500 });
    }
}
