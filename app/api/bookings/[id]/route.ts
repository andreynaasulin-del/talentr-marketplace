import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RouteParams {
    params: Promise<{ id: string }>;
}

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET - Get single booking details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabase();

        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: booking, error } = await supabase
            .from('booking_requests')
            .select(`
                *,
                gig:gig_id (
                    id,
                    title,
                    category_id,
                    photos,
                    share_slug,
                    price_amount,
                    pricing_type,
                    duration_minutes
                ),
                vendor:vendor_id (
                    id,
                    name,
                    full_name,
                    phone,
                    email,
                    whatsapp
                )
            `)
            .eq('id', id)
            .single();

        if (error || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ booking });

    } catch (err) {
        console.error('Error fetching booking:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update booking status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = getSupabase();

        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const { data: booking } = await supabase
            .from('booking_requests')
            .select('vendor_id')
            .eq('id', id)
            .single();

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Check if user owns the vendor
        const { data: vendor } = await supabase
            .from('vendors')
            .select('id')
            .eq('id', booking.vendor_id)
            .eq('owner_user_id', user.id)
            .single();

        if (!vendor) {
            return NextResponse.json({ error: 'Not authorized to update this booking' }, { status: 403 });
        }

        // Build update object
        const updateData: Record<string, unknown> = {};

        if (body.status) {
            updateData.status = body.status;

            // Set timestamps based on status change
            if (body.status === 'viewed' && !updateData.viewed_at) {
                updateData.viewed_at = new Date().toISOString();
            }
            if (['contacted', 'confirmed', 'rejected'].includes(body.status)) {
                updateData.responded_at = new Date().toISOString();
            }
        }

        if (body.vendor_response !== undefined) {
            updateData.vendor_response = body.vendor_response;
        }

        if (body.quoted_price !== undefined) {
            updateData.quoted_price = body.quoted_price;
        }

        const { data: updatedBooking, error } = await supabase
            .from('booking_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating booking:', error);
            return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            booking: updatedBooking
        });

    } catch (err) {
        console.error('Booking update error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
