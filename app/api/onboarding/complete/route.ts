import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// POST - Complete onboarding: create/find vendor, link gig, return edit link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, gig_id, full_name, phone, bio, email } = body;

        if (!user_id || !gig_id) {
            return NextResponse.json({ error: 'Missing user_id or gig_id' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Find or create vendor
        let vendorId: string;
        let editToken: string;

        const { data: existingVendor } = await supabase
            .from('vendors')
            .select('id, edit_token')
            .eq('owner_user_id', user_id)
            .single();

        if (existingVendor) {
            vendorId = existingVendor.id;
            editToken = existingVendor.edit_token;

            // Update profile info
            await supabase.from('vendors').update({
                name: full_name,
                full_name: full_name,
                phone,
                bio,
                description: bio,
                status: 'active',
                onboarding_completed: true
            }).eq('id', vendorId);
        } else {
            vendorId = crypto.randomUUID();
            editToken = crypto.randomUUID();

            const { error: vendorError } = await supabase.from('vendors').insert({
                id: vendorId,
                owner_user_id: user_id,
                name: full_name,
                full_name: full_name,
                phone,
                bio,
                description: bio,
                email: email || '',
                edit_token: editToken,
                status: 'active',
                onboarding_completed: true
            });

            if (vendorError) {
                console.error('Vendor creation error:', vendorError);
                return NextResponse.json({ error: vendorError.message }, { status: 400 });
            }
        }

        // 2. Link gig to vendor and update status
        const { error: gigError } = await supabase
            .from('gigs')
            .update({
                vendor_id: vendorId,
                status: 'pending_review',
                moderation_status: 'pending',
                wizard_completed: true
            })
            .eq('id', gig_id);

        if (gigError) {
            console.error('Gig link error:', gigError);
            // Don't fail completely - vendor was created
        }

        // 3. Build edit link
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const editLink = `${baseUrl}/vendor/edit/${editToken}`;

        return NextResponse.json({
            success: true,
            vendorId,
            editLink,
            editToken
        });
    } catch (error) {
        console.error('Onboarding complete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
