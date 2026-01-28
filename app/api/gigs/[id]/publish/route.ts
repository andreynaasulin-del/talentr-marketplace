import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateVendorToken, validateGigOwnership } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST - Publish gig (requires vendor token)
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

        const { data: gig, error } = await supabase
            .from('gigs')
            .update({
                status: 'published',
                wizard_completed: true,
                published_at: new Date().toISOString(),
                moderation_status: 'approved' // Auto-approve for MVP
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Publish gig error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            gig,
            success: true,
            message: 'הגיג פורסם בהצלחה!'
        });
    } catch (error) {
        console.error('Publish gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
