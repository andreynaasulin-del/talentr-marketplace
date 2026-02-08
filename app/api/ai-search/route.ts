'use server';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;
function getOpenAI() {
    if (!openai && process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting (stricter for AI search - more expensive)
        const clientIP = getClientIP(request);
        const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.aiSearch);
        if (!rateLimitResult.success) {
            return NextResponse.json({
                error: 'Rate limit exceeded. Please try again later.',
                success: false,
            }, { status: 429 });
        }

        const { query, language = 'en' } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }
        if (!supabase) {
            return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
        }

        const openaiClient = getOpenAI();
        if (!openaiClient) {
            return NextResponse.json({ error: 'AI search is not configured' }, { status: 503 });
        }

        // Step 1: Use AI to understand the search intent
        const systemPrompt = `You are a search assistant for an event marketplace in Israel called Talentr.
Analyze the user's request and extract:
1. category: The type of service needed. Must be one of: Photographer, Videographer, DJ, MC, Magician, Singer, Musician, Comedian, Dancer, Bartender, Bar Show, Event Decor, Kids Animator, Face Painter, Chef, Piercing/Tattoo, or null if unclear.
   - "roller trainer", "rollerblade coach", "kids activities" → "Kids Animator"
   - "stand-up", "comedy" → "Comedian"
   - "cocktails", "bar service" → "Bartender"
   - "flair bartending" → "Bar Show"
   - "flowers", "decoration" → "Event Decor"
   - "private chef", "catering", "cooking" → "Chef"
   - "henna", "body art" → "Face Painter"
2. city: The desired city (Tel Aviv, Haifa, Jerusalem, Eilat, Rishon LeZion, Netanya, Ashdod, Beer Sheva, Petah Tikva, Herzliya, Ramat Gan, or "any")
3. maxPrice: Maximum budget in shekels (number or null)
4. eventType: Type of event if mentioned (wedding, bar mitzvah, birthday, corporate, kids party, etc.)
5. searchTerms: Array of keywords from the query for fuzzy text matching (e.g. ["roller", "trainer", "kids"])

Respond ONLY with a JSON object, nothing else. Example:
{"category": "Photographer", "city": "Tel Aviv", "maxPrice": 3000, "eventType": "wedding", "searchTerms": ["photographer", "wedding"]}

If something is not mentioned, use null for that field.`;

        const completion = await openaiClient.chat.completions.create({
            model: 'gpt-4o',  // Premium model for best understanding
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
        // Search vendors table
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
            console.error('Vendor search error:', error);
        }

        // Also search gigs table for broader results
        let gigQuery = supabase
            .from('gigs')
            .select('*, vendors!gigs_vendor_id_fkey(id, name, city, rating, image_url, phone)')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(10);

        if (searchParams.category) {
            gigQuery = gigQuery.ilike('category_id', `%${searchParams.category}%`);
        }

        if (searchParams.city && searchParams.city !== 'any') {
            gigQuery = gigQuery.ilike('base_city', `%${searchParams.city}%`);
        }

        if (searchParams.maxPrice) {
            gigQuery = gigQuery.lte('price_amount', searchParams.maxPrice);
        }

        const { data: gigs } = await gigQuery;

        // If no vendors found by category, try searching by name/description with search terms
        let extraVendors: any[] = [];
        if ((!vendors || vendors.length === 0) && searchParams.searchTerms?.length > 0) {
            const searchText = searchParams.searchTerms.join(' ');
            const { data: fuzzyResults } = await supabase
                .from('vendors')
                .select('*')
                .or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%,tags.cs.{${searchParams.searchTerms.join(',')}}`)
                .order('rating', { ascending: false })
                .limit(10);
            extraVendors = fuzzyResults || [];
        }

        // Merge results (vendors from direct search + fuzzy search, deduplicated)
        const allVendors = vendors || [];
        const seenIds = new Set(allVendors.map((v: any) => v.id));
        for (const v of extraVendors) {
            if (!seenIds.has(v.id)) {
                allVendors.push(v);
                seenIds.add(v.id);
            }
        }

        // Step 3: Generate AI recommendation summary
        const recommendationPrompt = language === 'he'
            ? `בהתבסס על הבקשה "${query}", כתוב משפט קצר (עד 20 מילים) שמסביר מה מצאנו. אל תשתמש במרכאות.`
            : language === 'ru'
                ? `На основе запроса "${query}", напиши короткое предложение (до 20 слов) объясняющее что мы нашли. Без кавычек.`
                : `Based on the request "${query}", write a short sentence (max 20 words) explaining what we found. No quotes.`;

        const summaryCompletion = await openaiClient.chat.completions.create({
            model: 'gpt-4o',  // Premium model for best summaries
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
            vendors: allVendors,
            gigs: gigs || [],
            summary: summary.trim(),
            count: allVendors.length + (gigs?.length || 0),
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'AI search failed' },
            { status: 500 }
        );
    }
}
