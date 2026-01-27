import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RouteParams {
    params: Promise<{ token: string }>;
}

// GET - List booking requests for a vendor using edit token
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { token } = await params;

        // Create admin client to bypass RLS since we validate token manually
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Validate token and get vendor
        const { data: vendor, error: vendorError } = await supabase
            .from('vendors')
            .select('id')
            .eq('edit_token', token)
            .single();

        if (vendorError || !vendor) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Get bookings
        const { data: bookings, error } = await supabase
            .from('booking_requests')
            .select(`
                *,
                gig:gig_id (
                    id,
                    title,
                    photos
                )
            `)
            .eq('vendor_id', vendor.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookings:', error);
            return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
        }

        return NextResponse.json({ bookings });

    } catch (err) {
        console.error('Vendor bookings fetch error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
