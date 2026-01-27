import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - List public gigs (for homepage, search, categories)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const sortBy = searchParams.get('sort') || 'recent'; // recent, popular, price_low, price_high

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Build query for published, approved gigs
        let query = supabase
            .from('gigs')
            .select(`
                id,
                title,
                category_id,
                tags,
                short_description,
                photos,
                is_free,
                pricing_type,
                price_amount,
                currency,
                base_city,
                location_mode,
                duration_minutes,
                max_guests,
                suitable_for_kids,
                event_types,
                share_slug,
                view_count,
                vendor_id,
                created_at
            `)
            .eq('status', 'published')
            .eq('moderation_status', 'approved');

        // Apply filters
        if (category) {
            query = query.eq('category_id', category);
        }

        if (city) {
            query = query.or(`base_city.eq.${city},location_mode.eq.countrywide,location_mode.eq.online`);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%,tags.cs.{${search}}`);
        }

        // Apply sorting
        switch (sortBy) {
            case 'popular':
                query = query.order('view_count', { ascending: false, nullsFirst: false });
                break;
            case 'price_low':
                query = query.order('price_amount', { ascending: true, nullsFirst: false });
                break;
            case 'price_high':
                query = query.order('price_amount', { ascending: false, nullsFirst: false });
                break;
            case 'recent':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data: gigs, error, count } = await query;

        if (error) {
            console.error('Error fetching public gigs:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Fetch vendor info for each gig
        const vendorIds = [...new Set(gigs?.filter(g => g.vendor_id).map(g => g.vendor_id) || [])];
        let vendorMap: Record<string, { name: string; avatar_url?: string; city?: string }> = {};

        if (vendorIds.length > 0) {
            const { data: vendors } = await supabase
                .from('vendors')
                .select('id, name, full_name, avatar_url, city')
                .in('id', vendorIds);

            if (vendors) {
                vendorMap = vendors.reduce((acc, v) => {
                    acc[v.id] = {
                        name: v.full_name || v.name,
                        avatar_url: v.avatar_url,
                        city: v.city
                    };
                    return acc;
                }, {} as typeof vendorMap);
            }
        }

        // Add vendor info to gigs
        const gigsWithVendor = gigs?.map(gig => ({
            ...gig,
            vendor: gig.vendor_id ? vendorMap[gig.vendor_id] : null
        }));

        return NextResponse.json({
            gigs: gigsWithVendor || [],
            total: count,
            hasMore: (gigs?.length || 0) === limit
        });
    } catch (error) {
        console.error('Public gigs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
