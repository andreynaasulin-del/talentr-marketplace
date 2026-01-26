import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// GET - Get gig by share slug (for unlisted gigs)
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

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

        return NextResponse.json({ gig });
    } catch (error) {
        console.error('Get gig by slug error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
