import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Get featured/popular gigs for homepage
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '8');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get popular gigs (by views) that are approved
        const { data: popularGigs, error } = await supabase
            .from('gigs')
            .select(`
                id,
                title,
                category_id,
                short_description,
                photos,
                is_free,
                pricing_type,
                price_amount,
                currency,
                base_city,
                location_mode,
                share_slug,
                view_count,
                vendor_id
            `)
            .eq('status', 'published')
            .eq('moderation_status', 'approved')
            .order('view_count', { ascending: false, nullsFirst: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching featured gigs:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Fetch vendor info
        const vendorIds = [...new Set(popularGigs?.filter(g => g.vendor_id).map(g => g.vendor_id) || [])];
        let vendorMap: Record<string, { name: string; avatar_url?: string }> = {};

        if (vendorIds.length > 0) {
            const { data: vendors } = await supabase
                .from('vendors')
                .select('id, name, full_name, avatar_url')
                .in('id', vendorIds);

            if (vendors) {
                vendorMap = vendors.reduce((acc, v) => {
                    acc[v.id] = {
                        name: v.full_name || v.name,
                        avatar_url: v.avatar_url
                    };
                    return acc;
                }, {} as typeof vendorMap);
            }
        }

        // Attach vendor info
        const gigsWithVendor = popularGigs?.map(gig => ({
            ...gig,
            vendor: gig.vendor_id ? vendorMap[gig.vendor_id] : null
        }));

        // Get category counts
        const { data: categoryCounts } = await supabase
            .from('gigs')
            .select('category_id')
            .eq('status', 'published')
            .eq('moderation_status', 'approved');

        const categoryMap: Record<string, number> = {};
        categoryCounts?.forEach((g: { category_id: string }) => {
            categoryMap[g.category_id] = (categoryMap[g.category_id] || 0) + 1;
        });

        return NextResponse.json({
            featured: gigsWithVendor || [],
            categoryCounts: categoryMap
        });
    } catch (error) {
        console.error('Featured gigs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
