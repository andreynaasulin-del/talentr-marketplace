import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { filterVendors } from '@/lib/vendors';
import { Vendor, VendorCategory, City } from '@/types';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { chatMessageSchema } from '@/lib/validations';
import { gigPackages, GigPackage, MoodTag } from '@/lib/gigs';

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
    packages: GigPackage[];
    extracted: {
        category?: VendorCategory;
        city?: City;
        eventType?: string;
        mood?: MoodTag;
    };
    suggestions?: string[];
    surprise?: string;
}

// ===== MOOD DETECTION =====
const moodKeywords: Record<MoodTag, string[]> = {
    fun: ['laugh', 'funny', 'comedy', 'fun', 'party', 'צחוק', 'מצחיק', 'כיף', 'מסיבה', 'standup', '😂', '🎉'],
    chill: ['relax', 'chill', 'acoustic', 'calm', 'vibes', 'רגוע', 'נינוח', 'וייבס', 'אקוסטי', '🧘', '🎸'],
    romantic: ['romantic', 'love', 'date', 'anniversary', 'רומנטי', 'אהבה', 'דייט', 'יום נישואין', '❤️', '💕'],
    wow: ['amazing', 'magic', 'wow', 'surprise', 'cool', 'מדהים', 'קסם', 'וואו', 'הפתעה', 'מגניב', '✨', '🎩'],
    artsy: ['art', 'creative', 'painting', 'mural', 'אמנות', 'יצירתי', 'ציור', '🎨'],
};

function detectMood(message: string): MoodTag | undefined {
    const lower = message.toLowerCase();
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(kw => lower.includes(kw))) {
            return mood as MoodTag;
        }
    }
    return undefined;
}

// ===== CATEGORY KEYWORDS (EN/HE ONLY) =====
const categoryKeywords: Record<string, VendorCategory> = {
    'photographer': 'Photographer', 'photo': 'Photographer', 'צלם': 'Photographer',
    'dj': 'DJ', 'music': 'DJ', "דיג'יי": 'DJ', 'מוזיקה': 'DJ',
    'magician': 'Magician', 'magic': 'Magician', 'קוסם': 'Magician',
    'singer': 'Singer', 'vocalist': 'Singer', 'זמר': 'Singer',
    'musician': 'Musician', 'band': 'Musician', 'guitar': 'Musician', 'גיטרה': 'Musician',
    'comedian': 'Comedian', 'comedy': 'Comedian', 'standup': 'Comedian', 'סטנדאפ': 'Comedian',
    'dancer': 'Dancer', 'dance': 'Dancer', 'רקדן': 'Dancer',
    'bartender': 'Bartender', 'cocktail': 'Bartender', 'ברמן': 'Bartender',
    'chef': 'Chef', 'sushi': 'Chef', 'cooking': 'Chef', 'שף': 'Chef', 'סושי': 'Chef',
    'kids': 'Kids Animator', 'children': 'Kids Animator', 'ילדים': 'Kids Animator',
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
    mood?: MoodTag;
} {
    const lower = message.toLowerCase();
    let category: VendorCategory | undefined;
    let city: City | undefined;

    for (const [kw, cat] of Object.entries(categoryKeywords)) {
        if (lower.includes(kw)) { category = cat; break; }
    }
    for (const [kw, c] of Object.entries(cityKeywords)) {
        if (lower.includes(kw)) { city = c; break; }
    }

    const mood = detectMood(message);
    return { category, city, mood };
}

// ===== FIND PACKAGES BY MOOD =====
function findPackagesByMood(mood?: MoodTag, limit: number = 4): GigPackage[] {
    if (!mood) {
        // Return random mix
        const shuffled = [...gigPackages].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, limit);
    }
    const matched = gigPackages.filter(pkg => pkg.moodTags.includes(mood));
    if (matched.length >= limit) return matched.slice(0, limit);
    // Fill with others
    const others = gigPackages.filter(pkg => !pkg.moodTags.includes(mood));
    return [...matched, ...others].slice(0, limit);
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
        console.error('Error finding vendors:', error);
        return [];
    }
}

// ===== GAMIFICATION: RANDOM SURPRISE =====
function generateSurprise(language: string): string | undefined {
    const shouldSurprise = Math.random() < 0.25; // 25% chance
    if (!shouldSurprise) return undefined;

    const surprises = {
        en: [
            "🎁 Secret bonus: First booking gets a free 10-min extension!",
            "⚡ Flash deal: Book now and skip the queue!",
            "🌟 VIP tip: This artist performed at Google's office party!",
            "🎲 Lucky you! Ask for the 'sunset special' package",
        ],
        he: [
            "🎁 בונוס סודי: הזמנה ראשונה מקבלת 10 דקות נוספות בחינם!",
            "⚡ דיל בזק: הזמן עכשיו ודלג על התור!",
            "🌟 טיפ VIP: האמן הזה הופיע במסיבה של גוגל!",
            "🎲 מזל! בקש את חבילת ה-'sunset special'",
        ],
    };

    const list = surprises[language as 'en' | 'he'] || surprises.en;
    return list[Math.floor(Math.random() * list.length)];
}

// ===== AI SYSTEM PROMPT - IMPULSE VIBE-BOT =====
const SYSTEM_PROMPT = `You are the Talentr Vibe-Bot - a fun, energetic assistant that helps people book micro-entertainment experiences in Israel.

## Your Personality
- Playful, spontaneous, and enthusiastic 😎
- Like a friend who knows all the best artists
- Uses 2-3 emojis naturally
- Short, punchy responses (2-3 sentences MAX)
- Creates excitement and FOMO

## What You Help With
NOT boring corporate events. You help with:
- Surprise experiences for friends
- Date night entertainment  
- Balcony concerts
- Private comedy shows
- Art sessions
- Chill acoustic vibes
- Food experiences (sushi, cocktails)

## Response Style Examples
User: "I'm bored"
You: "Let's fix that! 🔥 How about a comedian for your living room in 30 min? Or a guitar guy for sunset vibes? Pick: 😂 or 🎸"

User: "Something for a date"
You: "Ooh romantic! 💕 I've got the perfect acoustic guitarist - imagine private concert on your balcony. She's amazing!"

User: "Surprise me"
You: "Challenge accepted! 🎲 Here are 3 wild options - a magician, a sound healer, or a sushi chef. All can be at your place TODAY!"

## Rules
1. NEVER mention prices unprompted
2. Keep it SHORT and impulsive
3. Always offer quick options with emojis
4. Create urgency ("available today!", "only 2 slots left!")
5. Match user's language (English or Hebrew only, NO Russian)
6. If packages found, reference them enthusiastically

## Context
[CONTEXT]`;

// ===== GENERATE SUGGESTIONS =====
function generateSuggestions(mood?: MoodTag, language: string = 'en'): string[] {
    const lang = language as 'en' | 'he';
    
    const moodSuggestions: Record<MoodTag, Record<string, string[]>> = {
        fun: {
            en: ['More comedians', 'Magic show', 'Something crazier 🔥'],
            he: ['עוד קומיקאים', 'מופע קסמים', 'משהו יותר מטורף 🔥'],
        },
        chill: {
            en: ['Acoustic vibes', 'Sound healing', 'Something romantic 💕'],
            he: ['וייבס אקוסטי', 'ריפוי בצלילים', 'משהו רומנטי 💕'],
        },
        romantic: {
            en: ['Private concert', 'Sunset guitarist', 'Candlelight chef 🕯️'],
            he: ['קונצרט פרטי', 'גיטריסט לשקיעה', 'שף לאור נרות 🕯️'],
        },
        wow: {
            en: ['Street art', 'Close-up magic', 'Fire show 🔥'],
            he: ['סטריט ארט', 'קסמים מקרוב', 'מופע אש 🔥'],
        },
        artsy: {
            en: ['Live mural', 'Pottery session', 'Face painting 🎨'],
            he: ['ציור קיר לייב', 'סדנת קדרות', 'ציור פנים 🎨'],
        },
    };

    if (mood && moodSuggestions[mood]) {
        return moodSuggestions[mood][lang] || moodSuggestions[mood].en;
    }

    const defaults = {
        en: ['Make me laugh 😂', 'Chill vibes 🎸', 'Surprise me! 🎁'],
        he: ['תצחיק אותי 😂', 'וייבס רגועים 🎸', 'הפתע אותי! 🎁'],
    };
    return defaults[lang] || defaults.en;
}

// ===== AI RESPONSE =====
async function generateAIResponse(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    packages: GigPackage[],
    vendors: Vendor[],
    mood: MoodTag | undefined,
    language: string
): Promise<string> {
    const client = getOpenAI();
    if (!client) return generateFallbackResponse(packages, vendors, mood, language);

    try {
        const pkgNames = packages.map(p => p.title[language as 'en' | 'he'] || p.title.en).join(', ');
        let context = '';
        if (packages.length > 0) {
            context = `[Found packages: ${pkgNames}]`;
        }
        if (vendors.length > 0) {
            context += `\n[Found ${vendors.length} artists ready to book]`;
        }
        if (mood) {
            context += `\n[Detected mood: ${mood}]`;
        }

        const systemPrompt = SYSTEM_PROMPT.replace('[CONTEXT]', context || '[No specific context]');

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-4).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
                { role: 'user', content: message }
            ],
            max_tokens: 150,
            temperature: 0.8,
        });

        return completion.choices[0]?.message?.content || generateFallbackResponse(packages, vendors, mood, language);
    } catch (error) {
        console.error('OpenAI API error:', error);
        return generateFallbackResponse(packages, vendors, mood, language);
    }
}

function generateFallbackResponse(packages: GigPackage[], vendors: Vendor[], mood: MoodTag | undefined, language: string): string {
    const r = {
        en: {
            hasPackages: "Check these out! 🔥 Perfect for your vibe.",
            hasVendors: `Found ${vendors.length} amazing artists ready to go! 🚀`,
            askMood: "What's the vibe? Pick an emoji: 😂 🎸 ✨ 🧘 🎨",
            surprise: "Here's something wild! 🎲",
        },
        he: {
            hasPackages: "תבדוק את אלה! 🔥 מושלם לוייב שלך.",
            hasVendors: `מצאתי ${vendors.length} אמנים מדהימים מוכנים! 🚀`,
            askMood: "מה הוייב? בחר אימוג'י: 😂 🎸 ✨ 🧘 🎨",
            surprise: "הנה משהו מטורף! 🎲",
        },
    }[language as 'en' | 'he'] || {
        hasPackages: "Check these!", hasVendors: "Found artists!", askMood: "What vibe?", surprise: "Surprise!"
    };

    if (packages.length > 0) return r.hasPackages;
    if (vendors.length > 0) return r.hasVendors;
    if (mood) return r.surprise;
    return r.askMood;
}

// ===== MAIN HANDLER =====
export async function POST(request: NextRequest) {
    try {
        const clientIP = getClientIP(request);
        const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.chat);
        if (!rateLimitResult.success) {
            return NextResponse.json({ 
                error: 'Rate limit',
                response: "Whoa, slow down! 😅 Try again in a sec.",
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
        
        // Find packages by mood first
        const packages = findPackagesByMood(extracted.mood, 4);
        
        // Find vendors if specific category detected
        const vendors = extracted.category 
            ? await findVendors(extracted.category, extracted.city, 3)
            : [];
        
        // Generate AI response
        const response = await generateAIResponse(
            message, 
            conversationHistory, 
            packages, 
            vendors, 
            extracted.mood, 
            language
        );
        
        // Gamification
        const surprise = generateSurprise(language);
        
        // Smart suggestions
        const suggestions = generateSuggestions(extracted.mood, language);

        return NextResponse.json({ 
            response, 
            vendors, 
            packages,
            extracted, 
            suggestions: suggestions.slice(0, 3),
            surprise,
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ 
            error: 'Internal error',
            response: "Oops! Something went wrong. Try again! 🙈",
            vendors: [],
            packages: [],
        }, { status: 500 });
    }
}
