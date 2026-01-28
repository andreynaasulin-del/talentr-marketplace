import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMagicLinkEmail } from '@/lib/email';

// POST - Request magic link recovery by email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Find vendor by email
        const { data: vendor, error } = await supabase
            .from('vendors')
            .select('id, name, email, edit_token')
            .eq('email', email.toLowerCase().trim())
            .single();

        // Always return success to prevent email enumeration
        if (error || !vendor) {
            console.log(`Magic link requested for unknown email: ${email}`);
            return NextResponse.json({
                success: true,
                message: 'If this email is registered, you will receive a login link shortly.'
            });
        }

        // Send magic link email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const editLink = `${baseUrl}/vendor/edit/${vendor.edit_token}`;

        const emailResult = await sendMagicLinkEmail({
            vendorName: vendor.name || 'Vendor',
            vendorEmail: vendor.email,
            editLink
        });

        if (!emailResult.success) {
            console.error('Failed to send magic link email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'If this email is registered, you will receive a login link shortly.'
        });

    } catch (err) {
        console.error('Magic link recovery error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
