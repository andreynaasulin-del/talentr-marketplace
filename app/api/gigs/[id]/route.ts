import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateVendorToken, validateGigOwnership } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single gig by ID (public, no auth required)
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: gig, error } = await supabase
            .from('gigs')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !gig) {
            return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
        }

        return NextResponse.json({ gig });
    } catch (error) {
        console.error('Get gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update gig (requires vendor token)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

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

        // Build update object - only include provided fields
        const updateData: Record<string, unknown> = {};

        // Basic info
        if (body.title !== undefined) updateData.title = body.title;
        if (body.category_id !== undefined) updateData.category_id = body.category_id;
        if (body.tags !== undefined) updateData.tags = body.tags;
        if (body.short_description !== undefined) updateData.short_description = body.short_description;
        if (body.full_description !== undefined) updateData.full_description = body.full_description;
        if (body.languages !== undefined) updateData.languages = body.languages;

        // Media
        if (body.photos !== undefined) updateData.photos = body.photos;
        if (body.videos !== undefined) updateData.videos = body.videos;

        // Pricing
        if (body.is_free !== undefined) updateData.is_free = body.is_free;
        if (body.currency !== undefined) updateData.currency = body.currency;
        if (body.pricing_type !== undefined) updateData.pricing_type = body.pricing_type;
        if (body.price_amount !== undefined) updateData.price_amount = body.price_amount;
        if (body.price_includes !== undefined) updateData.price_includes = body.price_includes;
        if (body.addons !== undefined) updateData.addons = body.addons;

        // Location
        if (body.location_mode !== undefined) updateData.location_mode = body.location_mode;
        if (body.base_city !== undefined) updateData.base_city = body.base_city;
        if (body.radius_km !== undefined) updateData.radius_km = body.radius_km;
        if (body.excluded_areas !== undefined) updateData.excluded_areas = body.excluded_areas;
        if (body.travel_fee !== undefined) updateData.travel_fee = body.travel_fee;

        // Audience
        if (body.suitable_for_kids !== undefined) updateData.suitable_for_kids = body.suitable_for_kids;
        if (body.age_limit !== undefined) updateData.age_limit = body.age_limit;
        if (body.event_types !== undefined) updateData.event_types = body.event_types;

        // Details
        if (body.duration_minutes !== undefined) updateData.duration_minutes = body.duration_minutes;
        if (body.min_guests !== undefined) updateData.min_guests = body.min_guests;
        if (body.max_guests !== undefined) updateData.max_guests = body.max_guests;
        if (body.requirements_text !== undefined) updateData.requirements_text = body.requirements_text;
        if (body.what_client_needs !== undefined) updateData.what_client_needs = body.what_client_needs;

        // Booking
        if (body.booking_method !== undefined) updateData.booking_method = body.booking_method;
        if (body.lead_time_hours !== undefined) updateData.lead_time_hours = body.lead_time_hours;

        // Wizard progress
        if (body.current_step !== undefined) updateData.current_step = body.current_step;
        if (body.wizard_completed !== undefined) updateData.wizard_completed = body.wizard_completed;

        const { data: gig, error } = await supabase
            .from('gigs')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update gig error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ gig, success: true });
    } catch (error) {
        console.error('Update gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete gig (requires vendor token)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

        const { error } = await supabase
            .from('gigs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete gig error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
