import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// GET - Get gig by share slug with vendor info
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get gig with vendor info
        const { data: gig, error } = await supabase
            .from('gigs')
            .select('*')
            .eq('share_slug', slug)
            .single();

        if (error || !gig) {
            return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
        }

        // Check if gig is accessible (unlisted or published)
        if (gig.status === 'draft' || gig.status === 'archived') {
            return NextResponse.json({ error: 'Gig not available' }, { status: 403 });
        }

        // Fetch vendor info if vendor_id exists
        let vendor = null;
        if (gig.vendor_id) {
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('id, name, full_name, category, city, avatar_url, image_url, rating, status')
                .eq('id', gig.vendor_id)
                .single();

            if (vendorData) {
                vendor = {
                    id: vendorData.id,
                    name: vendorData.full_name || vendorData.name,
                    category: vendorData.category,
                    city: vendorData.city,
                    avatar_url: vendorData.avatar_url || vendorData.image_url,
                    rating: vendorData.rating
                };
            }
        }

        // Increment view count (for analytics)
        await supabase
            .from('gigs')
            .update({ view_count: (gig.view_count || 0) + 1 })
            .eq('id', gig.id);

        return NextResponse.json({
            gig,
            vendor
        });
    } catch (error) {
        console.error('Get gig by slug error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
