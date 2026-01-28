import { NextRequest, NextResponse } from 'next/server';
import { getPendingVendorByToken, confirmPendingVendor, declinePendingVendor } from '@/lib/admin';

interface RouteParams {
    params: Promise<{ token: string }>;
}

// GET - Fetch pending vendor by token
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        const pending = await getPendingVendorByToken(token);

        if (!pending) {
            return NextResponse.json(
                { error: 'Invalid or expired confirmation link' },
                { status: 404 }
            );
        }

        // Don't expose sensitive data
        const safeData = {
            id: pending.id,
            name: pending.name,
            category: pending.category,
            city: pending.city,
            email: pending.email,
            phone: pending.phone,
            instagram_handle: pending.instagram_handle,
            website: pending.website,
            description: pending.description,
            image_url: pending.image_url,
            portfolio_urls: pending.portfolio_urls,
            price_from: pending.price_from,
            tags: pending.tags,
            instagram_followers: pending.instagram_followers,
            source_type: pending.source_type,
            source_url: pending.source_url,
            status: pending.status
        };

        return NextResponse.json({ pending: safeData });
    } catch (error) {
        console.error('Error fetching pending vendor:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Confirm or decline
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { token } = await params;
        const body = await request.json();
        const { action, updates } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        if (action === 'confirm') {
            const { vendorId, editToken, error } = await confirmPendingVendor(token, undefined, updates);

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            // Build the edit link for magic link access
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
            const editLink = `${baseUrl}/vendor/edit/${editToken}`;

            // Send magic link email to vendor
            if (updates?.email) {
                try {
                    const { sendMagicLinkEmail } = await import('@/lib/email');
                    await sendMagicLinkEmail({
                        vendorName: updates?.name || 'Vendor',
                        vendorEmail: updates.email,
                        editLink
                    });
                } catch (emailError) {
                    console.error('Failed to send magic link email:', emailError);
                    // Don't fail the confirmation if email fails
                }
            }

            return NextResponse.json({
                success: true,
                vendorId,
                editLink,
                message: 'Profile confirmed successfully!'
            });
        }

        if (action === 'decline') {
            // Get pending first to get the ID
            const pending = await getPendingVendorByToken(token);
            if (!pending) {
                return NextResponse.json(
                    { error: 'Invalid or expired link' },
                    { status: 404 }
                );
            }

            const { error } = await declinePendingVendor(pending.id, 'Declined by vendor');

            if (error) {
                return NextResponse.json({ error }, { status: 400 });
            }

            return NextResponse.json({
                success: true,
                message: 'Profile declined'
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error processing confirmation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
