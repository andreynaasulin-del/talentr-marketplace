import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// POST - Create new gig (draft)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Generate unique ID and share slug
        const gigId = crypto.randomUUID();
        const shareSlug = crypto.randomUUID().slice(0, 8);

        const { data: gig, error } = await supabase
            .from('gigs')
            .insert({
                id: gigId,
                owner_user_id: body.owner_user_id,
                vendor_id: body.vendor_id,
                title: body.title || 'Untitled Gig',
                category_id: body.category_id || 'Other',
                short_description: body.short_description || '',
                template_id: body.template_id,
                status: 'draft',
                share_slug: shareSlug,
                current_step: 0,
                wizard_completed: false
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

// GET - List gigs for user/vendor
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const vendorId = searchParams.get('vendor_id');
        const ownerId = searchParams.get('owner_id');
        const status = searchParams.get('status');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let query = supabase.from('gigs').select('*');

        if (vendorId) {
            query = query.eq('vendor_id', vendorId);
        }

        if (ownerId) {
            query = query.eq('owner_user_id', ownerId);
        }

        if (status) {
            query = query.eq('status', status);
        }

        query = query.order('created_at', { ascending: false });

        const { data: gigs, error } = await query;

        if (error) {
            console.error('Error fetching gigs:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ gigs });
    } catch (error) {
        console.error('Get gigs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
