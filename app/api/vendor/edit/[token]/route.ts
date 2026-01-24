import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RouteParams {
    params: Promise<{ token: string }>;
}

// GET - Fetch vendor by edit token
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: vendor, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('edit_token', token)
            .single();

        if (error || !vendor) {
            return NextResponse.json(
                { error: 'Invalid or expired edit link' },
                { status: 404 }
            );
        }

        // Normalize field names for the frontend (support both old and new schema)
        const normalizedVendor = {
            id: vendor.id,
            full_name: vendor.name || vendor.full_name || '',
            name: vendor.name || vendor.full_name || '',
            category: vendor.category || '',
            city: vendor.city || '',
            bio: vendor.description || vendor.bio || '',
            description: vendor.description || vendor.bio || '',
            avatar_url: vendor.image_url || vendor.avatar_url || '',
            image_url: vendor.image_url || vendor.avatar_url || '',
            phone: vendor.phone || '',
            email: vendor.email || '',
            price_from: vendor.price_from || 0,
            portfolio_gallery: vendor.portfolio_gallery || [],
            rating: vendor.rating || 0,
            reviews_count: vendor.reviews_count || 0,
            instagram_handle: vendor.instagram_handle || '',
            website: vendor.website || '',
            tags: vendor.tags || []
        };

        return NextResponse.json({ vendor: normalizedVendor });
    } catch (error) {
        console.error('Error fetching vendor:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Update vendor by edit token
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { token } = await params;
        const body = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // First verify the token exists
        const { data: existing, error: fetchError } = await supabase
            .from('vendors')
            .select('id')
            .eq('edit_token', token)
            .single();

        if (fetchError || !existing) {
            return NextResponse.json(
                { error: 'Invalid or expired edit link' },
                { status: 404 }
            );
        }

        // Update the vendor - maintenance of updated_at is handled by DB triggers now
        const updateData: Record<string, unknown> = {};

        // Handle name field (prefer 'name' but support 'full_name')
        if (body.full_name !== undefined) {
            updateData.name = body.full_name;
            updateData.full_name = body.full_name; // Keep both in sync
        }
        if (body.name !== undefined) {
            updateData.name = body.name;
            updateData.full_name = body.name;
        }

        // Handle image field
        if (body.avatar_url !== undefined) {
            updateData.image_url = body.avatar_url;
            updateData.avatar_url = body.avatar_url;
        }
        if (body.image_url !== undefined) {
            updateData.image_url = body.image_url;
            updateData.avatar_url = body.image_url;
        }

        // Handle description field
        if (body.bio !== undefined) {
            updateData.description = body.bio;
            updateData.bio = body.bio;
        }
        if (body.description !== undefined) {
            updateData.description = body.description;
            updateData.bio = body.description;
        }

        // Other fields
        if (body.category !== undefined) updateData.category = body.category;
        if (body.city !== undefined) updateData.city = body.city;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.email !== undefined) updateData.email = body.email;
        if (body.price_from !== undefined) updateData.price_from = body.price_from;
        if (body.instagram_handle !== undefined) updateData.instagram_handle = body.instagram_handle;
        if (body.website !== undefined) updateData.website = body.website;
        if (body.tags !== undefined) updateData.tags = body.tags;

        const { data: vendor, error: updateError } = await supabase
            .from('vendors')
            .update(updateData)
            .eq('edit_token', token)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json(
                { error: updateError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            vendor,
            message: 'Profile updated successfully!'
        });
    } catch (error) {
        console.error('Error updating vendor:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

