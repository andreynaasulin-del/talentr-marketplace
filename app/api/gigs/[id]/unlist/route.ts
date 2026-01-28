import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { validateVendorToken, validateGigOwnership } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST - Make gig unlisted (only accessible via link)
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Validate vendor token
        const { vendorId, error: tokenError } = await validateVendorToken(request);
        if (tokenError || !vendorId) {
            return NextResponse.json({ error: tokenError || 'Unauthorized' }, { status: 401 });
        }

        // Validate gig ownership
        const { valid, error: ownerError } = await validateGigOwnership(id, vendorId);
        if (!valid) {
            return NextResponse.json({ error: ownerError || 'Unauthorized' }, { status: 403 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Generate new share slug if needed
        const newSlug = crypto.randomUUID().slice(0, 8);

        const { data: gig, error } = await supabase
            .from('gigs')
            .update({
                status: 'unlisted',
                share_slug: newSlug,
                wizard_completed: true
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Unlist gig error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const shareLink = `${baseUrl}/g/${gig.share_slug}`;

        return NextResponse.json({
            gig,
            shareLink,
            success: true,
            message: 'הגיג זמין רק עם קישור'
        });
    } catch (error) {
        console.error('Unlist gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
