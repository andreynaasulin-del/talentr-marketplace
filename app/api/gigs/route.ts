import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { validateVendorToken } from '@/lib/auth';

// POST - Create new gig (draft)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let vendorId = null;
        let ownerUserId = body.owner_user_id;

        // 1. Try to validate via User Auth (Supabase Auth) - PREFERRED for Onboarding
        // We trust the body.owner_user_id IF it matches the authenticated user?
        // Ideally we should get the header token here, but for MVP standard Next.js 'body' approach:

        // Check if there is a vendor token (Legacy/Edit flow)
        if (request.headers.get('x-vendor-token')) {
            const { vendorId: tokenVendorId, error } = await validateVendorToken(request);
            if (error) return NextResponse.json({ error }, { status: 401 });
            vendorId = tokenVendorId;
        }

        // 2. If no vendor token, we expect User ID for "Onboarding Draft"
        if (!vendorId && !ownerUserId) {
            return NextResponse.json({ error: 'Unauthorized: Missing User ID or Vendor Token' }, { status: 401 });
        }

        // 3. Generate IDs
        const gigId = crypto.randomUUID();
        const shareSlug = crypto.randomUUID().slice(0, 8);

        // 4. Insert Gig
        const { data: gig, error } = await supabase
            .from('gigs')
            .insert({
                id: gigId,
                owner_user_id: ownerUserId, // Can be present without vendor_id
                vendor_id: vendorId, // Can be null now
                title: body.title || 'Untitled Gig',
                category_id: body.category_id || 'Other',
                short_description: body.short_description || '',
                template_id: body.template_id,
                status: 'draft',
                share_slug: shareSlug,
                current_step: 0,
                wizard_completed: false,
                photos: body.photos || [],
                price_amount: body.price_amount,
                city: body.city
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating gig:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ gig, success: true });
    } catch (error) {
        console.error('Create gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - List gigs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const vendorId = searchParams.get('vendor_id');
        const status = searchParams.get('status');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let query = supabase.from('gigs').select('*');

        if (vendorId) {
            query = query.eq('vendor_id', vendorId);
        }

        if (status) {
            query = query.eq('status', status);
        }

        query = query.order('created_at', { ascending: false });

        const { data: gigs, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ gigs });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
