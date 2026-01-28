import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { validateVendorToken, validateGigOwnership } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST - Regenerate share_slug for unlisted gigs
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Gig ID required' }, { status: 400 });
        }

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

        // First check if gig exists
        const { data: existingGig, error: fetchError } = await supabase
            .from('gigs')
            .select('id, status, share_slug')
            .eq('id', id)
            .single();

        if (fetchError || !existingGig) {
            return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
        }

        // Generate new unique slug
        const newSlug = crypto.randomUUID().slice(0, 12);

        // Update the gig with new slug
        const { data: gig, error: updateError } = await supabase
            .from('gigs')
            .update({
                share_slug: newSlug,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error regenerating slug:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const newShareLink = `${baseUrl}/g/${newSlug}`;

        return NextResponse.json({
            success: true,
            gig,
            oldSlug: existingGig.share_slug,
            newSlug: newSlug,
            shareLink: newShareLink,
            message: 'הקישור חודש בהצלחה. הקישור הישן כבר לא פעיל.'
        });
    } catch (error) {
        console.error('Regenerate slug error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
