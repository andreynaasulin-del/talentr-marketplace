import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Create a new booking request
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            gig_id,
            vendor_id,
            client_name,
            client_email,
            client_phone,
            client_whatsapp,
            event_type,
            event_date,
            event_time,
            event_duration_hours,
            event_location,
            event_city,
            guests_count,
            message,
            budget_range
        } = body;

        // Validation
        if (!gig_id || !vendor_id || !client_name || !client_email) {
            return NextResponse.json(
                { error: 'Missing required fields: gig_id, vendor_id, client_name, client_email' },
                { status: 400 }
            );
        }

        // Get client_user_id if authenticated
        const authHeader = request.headers.get('authorization');
        let client_user_id = null;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) {
                client_user_id = user.id;
            }
        }

        // Create the booking request
        const { data: booking, error } = await supabase
            .from('booking_requests')
            .insert({
                gig_id,
                vendor_id,
                client_user_id,
                client_name,
                client_email,
                client_phone,
                client_whatsapp,
                event_type,
                event_date,
                event_time,
                event_duration_hours,
                event_location,
                event_city,
                guests_count,
                message,
                budget_range,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating booking:', error);
            return NextResponse.json(
                { error: 'Failed to create booking request' },
                { status: 500 }
            );
        }

        // TODO: Send email notification to vendor
        // await sendBookingNotificationEmail(vendor_id, booking);

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking request sent successfully'
        });

    } catch (err) {
        console.error('Booking creation error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - List booking requests (for vendors)
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const vendor_id = searchParams.get('vendor_id');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Get vendor(s) owned by user
        const { data: userVendors } = await supabase
            .from('vendors')
            .select('id')
            .eq('owner_user_id', user.id);

        if (!userVendors || userVendors.length === 0) {
            return NextResponse.json({ bookings: [] });
        }

        const vendorIds = userVendors.map(v => v.id);

        // Build query
        let query = supabase
            .from('booking_requests')
            .select(`
                *,
                gig:gig_id (
                    id,
                    title,
                    category_id,
                    photos,
                    share_slug
                )
            `)
            .in('vendor_id', vendor_id ? [vendor_id] : vendorIds)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: bookings, error } = await query;

        if (error) {
            console.error('Error fetching bookings:', error);
            return NextResponse.json(
                { error: 'Failed to fetch bookings' },
                { status: 500 }
            );
        }

        // Count by status
        const statusCounts = {
            pending: bookings?.filter(b => b.status === 'pending').length || 0,
            viewed: bookings?.filter(b => b.status === 'viewed').length || 0,
            contacted: bookings?.filter(b => b.status === 'contacted').length || 0,
            confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
            rejected: bookings?.filter(b => b.status === 'rejected').length || 0,
            completed: bookings?.filter(b => b.status === 'completed').length || 0
        };

        return NextResponse.json({
            bookings: bookings || [],
            statusCounts,
            total: bookings?.length || 0
        });

    } catch (err) {
        console.error('Bookings fetch error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
