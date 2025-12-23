import { NextRequest, NextResponse } from 'next/server';
import { filterVendors } from '@/lib/vendors';
import { Vendor, VendorCategory, City } from '@/types';

interface ChatRequest {
    message: string;
}

interface ChatResponse {
    response: string;
    vendors: Vendor[];
    extracted: {
        category?: VendorCategory;
        city?: City;
        eventType?: string;
    };
}

// Category keywords mapping
const categoryKeywords: Record<string, VendorCategory> = {
    // English
    'photographer': 'Photographer',
    'photo': 'Photographer',
    'photography': 'Photographer',
    'videographer': 'Videographer',
    'video': 'Videographer',
    'film': 'Videographer',
    'dj': 'DJ',
    'disc jockey': 'DJ',
    'mc': 'MC',
    'host': 'MC',
    'emcee': 'MC',
    'magician': 'Magician',
    'magic': 'Magician',
    'singer': 'Singer',
    'vocalist': 'Singer',
    'musician': 'Musician',
    'band': 'Musician',
    'live music': 'Musician',
    'comedian': 'Comedian',
    'comedy': 'Comedian',
    'dancer': 'Dancer',
    'dance': 'Dancer',
    'bartender': 'Bartender',
    'bar': 'Bartender',
    'cocktail': 'Bartender',
    'bar show': 'Bar Show',
    'flair': 'Bar Show',
    'decor': 'Event Decor',
    'decoration': 'Event Decor',
    'flowers': 'Event Decor',
    'kids': 'Kids Animator',
    'children': 'Kids Animator',
    'animator': 'Kids Animator',
    'face paint': 'Face Painter',
    'face painting': 'Face Painter',
    'tattoo': 'Piercing/Tattoo',
    'henna': 'Piercing/Tattoo',
    'chef': 'Chef',
    'catering': 'Chef',
    'food': 'Chef',

    // Russian
    'фотограф': 'Photographer',
    'фото': 'Photographer',
    'видеограф': 'Videographer',
    'видео': 'Videographer',
    'диджей': 'DJ',
    'ди-джей': 'DJ',
    'ведущий': 'MC',
    'тамада': 'MC',
    'фокусник': 'Magician',
    'иллюзионист': 'Magician',
    'певец': 'Singer',
    'певица': 'Singer',
    'музыкант': 'Musician',
    'группа': 'Musician',
    'комик': 'Comedian',
    'юморист': 'Comedian',
    'танцор': 'Dancer',
    'танцы': 'Dancer',
    'бармен': 'Bartender',
    'коктейли': 'Bartender',
    'декор': 'Event Decor',
    'оформление': 'Event Decor',
    'аниматор': 'Kids Animator',
    'детский': 'Kids Animator',
    'аквагрим': 'Face Painter',
    'тату': 'Piercing/Tattoo',
    'хна': 'Piercing/Tattoo',
    'повар': 'Chef',
    'кейтеринг': 'Chef',

    // Hebrew
    'צלם': 'Photographer',
    'צילום': 'Photographer',
    'וידאו': 'Videographer',
    'דיג\'יי': 'DJ',
    'מנחה': 'MC',
    'קוסם': 'Magician',
    'זמר': 'Singer',
    'זמרת': 'Singer',
    'מוזיקאי': 'Musician',
    'להקה': 'Musician',
    'קומיקאי': 'Comedian',
    'רקדן': 'Dancer',
    'ברמן': 'Bartender',
    'עיצוב': 'Event Decor',
    'אנימטור': 'Kids Animator',
    'ציור פנים': 'Face Painter',
    'שף': 'Chef',
    'קייטרינג': 'Chef',
};

// City keywords mapping
const cityKeywords: Record<string, City> = {
    // English
    'tel aviv': 'Tel Aviv',
    'telaviv': 'Tel Aviv',
    'tlv': 'Tel Aviv',
    'haifa': 'Haifa',
    'jerusalem': 'Jerusalem',
    'eilat': 'Eilat',
    'rishon': 'Rishon LeZion',
    'rishon lezion': 'Rishon LeZion',
    'netanya': 'Netanya',
    'ashdod': 'Ashdod',

    // Russian
    'тель-авив': 'Tel Aviv',
    'тель авив': 'Tel Aviv',
    'хайфа': 'Haifa',
    'иерусалим': 'Jerusalem',
    'эйлат': 'Eilat',
    'ришон': 'Rishon LeZion',
    'нетания': 'Netanya',
    'ашдод': 'Ashdod',

    // Hebrew
    'תל אביב': 'Tel Aviv',
    'חיפה': 'Haifa',
    'ירושלים': 'Jerusalem',
    'אילת': 'Eilat',
    'ראשון לציון': 'Rishon LeZion',
    'נתניה': 'Netanya',
    'אשדוד': 'Ashdod',
};

// Event type keywords
const eventKeywords: Record<string, string> = {
    'wedding': 'Wedding',
    'свадьба': 'Wedding',
    'חתונה': 'Wedding',
    'bar mitzvah': 'Bar Mitzvah',
    'bat mitzvah': 'Bar Mitzvah',
    'бар мицва': 'Bar Mitzvah',
    'בר מצווה': 'Bar Mitzvah',
    'בת מצווה': 'Bar Mitzvah',
    'birthday': 'Birthday',
    'день рождения': 'Birthday',
    'יום הולדת': 'Birthday',
    'corporate': 'Corporate',
    'корпоратив': 'Corporate',
    'אירוע עסקי': 'Corporate',
    'party': 'Private Party',
    'вечеринка': 'Private Party',
    'מסיבה': 'Private Party',
};

function extractFromMessage(message: string): {
    category?: VendorCategory;
    city?: City;
    eventType?: string
} {
    const lowerMessage = message.toLowerCase();

    let category: VendorCategory | undefined;
    let city: City | undefined;
    let eventType: string | undefined;

    // Find category
    for (const [keyword, cat] of Object.entries(categoryKeywords)) {
        if (lowerMessage.includes(keyword)) {
            category = cat;
            break;
        }
    }

    // Find city
    for (const [keyword, c] of Object.entries(cityKeywords)) {
        if (lowerMessage.includes(keyword)) {
            city = c;
            break;
        }
    }

    // Find event type
    for (const [keyword, event] of Object.entries(eventKeywords)) {
        if (lowerMessage.includes(keyword)) {
            eventType = event;
            break;
        }
    }

    return { category, city, eventType };
}

async function findVendors(category?: VendorCategory, city?: City, eventType?: string): Promise<Vendor[]> {
    try {
        // Use Supabase filterVendors
        let results = await filterVendors({
            category,
            city,
        });

        // Filter by event type (tag matching) if provided
        if (eventType && results.length > 0) {
            const eventResults = results.filter(v =>
                v.tags.some(tag => tag.toLowerCase().includes(eventType.toLowerCase()))
            );
            if (eventResults.length > 0) {
                results = eventResults;
            }
        }

        // Return top 3
        return results.slice(0, 3);
    } catch (error) {
        console.error('Error finding vendors:', error);
        return [];
    }
}

function generateResponse(
    extracted: { category?: VendorCategory; city?: City; eventType?: string },
    vendors: Vendor[]
): string {
    const { category, city, eventType } = extracted;

    if (vendors.length === 0) {
        if (category && city) {
            return `I couldn't find any ${category}s in ${city} at the moment. Would you like me to search in nearby cities?`;
        }
        if (category) {
            return `I couldn't find ${category}s matching your criteria. Try specifying a city or different requirements.`;
        }
        return `I'd love to help! Tell me what kind of professional you're looking for and where. For example: "I need a DJ for a wedding in Tel Aviv"`;
    }

    let response = '';

    if (vendors.length === 1) {
        response = `Great choice! Here's the perfect ${category || 'professional'}`;
    } else {
        response = `Excellent! Here are the top ${vendors.length} ${category || 'professional'}s`;
    }

    if (city) {
        response += ` in ${city}`;
    }

    if (eventType) {
        response += ` for your ${eventType}`;
    }

    response += ':';

    return response;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { message } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Extract entities from message
        const extracted = extractFromMessage(message);

        // Find matching vendors from Supabase
        const vendors = await findVendors(extracted.category, extracted.city, extracted.eventType);

        // Generate response
        const response = generateResponse(extracted, vendors);

        const result: ChatResponse = {
            response,
            vendors,
            extracted
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

