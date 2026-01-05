import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Lazy initialize OpenAI client
const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not configured');
    }
    return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
    try {
        const { query, language = 'en' } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Step 1: Use AI to understand the search intent
        const systemPrompt = `You are a search assistant for an event marketplace in Israel. 
Analyze the user's request and extract:
1. category: The type of service needed (Photographer, DJ, MC, Magician, Singer, Musician, Videographer, Kids Animator, Event Decor, Bartender)
2. city: The desired city (Tel Aviv, Haifa, Jerusalem, Eilat, Rishon LeZion, or "any")
3. maxPrice: Maximum budget in shekels (number or null)
4. eventType: Type of event if mentioned (wedding, bar mitzvah, birthday, corporate, etc.)

Respond ONLY with a JSON object, nothing else. Example:
{"category": "Photographer", "city": "Tel Aviv", "maxPrice": 3000, "eventType": "wedding"}

If something is not mentioned, use null for that field.`;

        const openai = getOpenAI();
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',  // Premium model for better understanding
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            temperature: 0.3,
            max_tokens: 200,
        });

        const aiResponse = completion.choices[0]?.message?.content || '{}';

        let searchParams;
        try {
            searchParams = JSON.parse(aiResponse);
        } catch {
            searchParams = {};
        }

        // Step 2: Build Supabase query based on AI understanding
        let vendorQuery = supabase
            .from('vendors')
            .select('*')
            .order('rating', { ascending: false })
            .limit(10);

        if (searchParams.category) {
            vendorQuery = vendorQuery.ilike('category', `%${searchParams.category}%`);
        }

        if (searchParams.city && searchParams.city !== 'any') {
            vendorQuery = vendorQuery.ilike('city', `%${searchParams.city}%`);
        }

        if (searchParams.maxPrice) {
            vendorQuery = vendorQuery.lte('price_from', searchParams.maxPrice);
        }

        const { data: vendors, error } = await vendorQuery;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
        }

        // Step 3: Generate AI recommendation summary
        const recommendationPrompt = language === 'he'
            ? `בהתבסס על הבקשה "${query}", כתוב משפט קצר (עד 20 מילים) שמסביר מה מצאנו. אל תשתמש במרכאות.`
            : language === 'ru'
                ? `На основе запроса "${query}", напиши короткое предложение (до 20 слов) объясняющее что мы нашли. Без кавычек.`
                : `Based on the request "${query}", write a short sentence (max 20 words) explaining what we found. No quotes.`;

        const summaryCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',  // Premium model for better summaries
            messages: [
                { role: 'system', content: 'You help summarize search results in a friendly, concise way.' },
                { role: 'user', content: recommendationPrompt }
            ],
            temperature: 0.7,
            max_tokens: 50,
        });

        const summary = summaryCompletion.choices[0]?.message?.content || '';

        return NextResponse.json({
            success: true,
            query,
            searchParams,
            vendors: vendors || [],
            summary: summary.trim(),
            count: vendors?.length || 0,
        });

    } catch (error: any) {
        console.error('AI Search error:', error);
        return NextResponse.json(
            { error: error.message || 'AI search failed' },
            { status: 500 }
        );
    }
}
