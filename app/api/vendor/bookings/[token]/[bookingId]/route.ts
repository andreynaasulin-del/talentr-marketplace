import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendBookingStatusEmail } from '@/lib/email';

interface RouteParams {
    params: Promise<{ token: string; bookingId: string }>;
}

// PATCH - Update booking request status (confirm/reject)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { token, bookingId } = await params;
        const body = await request.json();
        const { action, vendor_response, quoted_price } = body;

        if (!action || !['confirm', 'reject', 'view'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be: confirm, reject, or view' },
                { status: 400 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Validate token and get vendor
        const { data: vendor, error: vendorError } = await supabase
            .from('vendors')
            .select('id, name, email')
            .eq('edit_token', token)
            .single();

        if (vendorError || !vendor) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Get the booking and verify it belongs to this vendor
        const { data: booking, error: bookingError } = await supabase
            .from('booking_requests')
            .select(`
                *,
                gig:gig_id (
                    id,
                    title
                )
            `)
            .eq('id', bookingId)
            .eq('vendor_id', vendor.id)
            .single();

        if (bookingError || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // 3. Update booking based on action
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        };

        if (action === 'view') {
            if (booking.status === 'pending') {
                updateData.status = 'viewed';
                updateData.viewed_at = new Date().toISOString();
            }
        } else if (action === 'confirm') {
            updateData.status = 'confirmed';
            updateData.responded_at = new Date().toISOString();
            if (vendor_response) updateData.vendor_response = vendor_response;
            if (quoted_price) updateData.quoted_price = quoted_price;
        } else if (action === 'reject') {
            updateData.status = 'rejected';
            updateData.responded_at = new Date().toISOString();
            if (vendor_response) updateData.vendor_response = vendor_response;
        }

        const { data: updatedBooking, error: updateError } = await supabase
            .from('booking_requests')
            .update(updateData)
            .eq('id', bookingId)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
        }

        // 4. Send email notification to client (for confirm/reject)
        if (action === 'confirm' || action === 'reject') {
            try {
                await sendBookingStatusEmail({
                    clientName: booking.client_name,
                    clientEmail: booking.client_email,
                    vendorName: vendor.name || 'Vendor',
                    gigTitle: booking.gig?.title || 'Gig',
                    status: action === 'confirm' ? 'confirmed' : 'rejected',
                    vendorResponse: vendor_response,
                    quotedPrice: quoted_price
                });
            } catch (emailError) {
                console.error('Failed to send status email:', emailError);
                // Don't fail the request if email fails
            }
        }

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
            message: action === 'confirm'
                ? 'הזמנה אושרה בהצלחה!'
                : action === 'reject'
                    ? 'ההזמנה נדחתה'
                    : 'סטטוס עודכן'
        });

    } catch (err) {
        console.error('Booking update error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
