
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { PRICING_CONFIG } from '@/config/pricing';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const sign = request.headers.get('sign');

        if (!sign) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const paymentKey = process.env.CRYPTOMUS_PAYMENT_KEY;
        if (!paymentKey) {
            console.error('CRYPTOMUS_PAYMENT_KEY missing');
            return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
        }

        // 1. Verify Signature
        // Sign = md5(base64(data) + payment_key)
        const base64Body = Buffer.from(rawBody).toString('base64');
        const computedSign = crypto.createHash('md5').update(base64Body + paymentKey).digest('hex');

        if (sign !== computedSign) {
            console.error('Invalid Signature from Cryptomus', { expected: computedSign, received: sign });
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 403 });
        }

        const body = JSON.parse(rawBody);

        // 2. Check Status
        // Cryptomus statuses: confirm_check, paid, paid_over, fail, cancel, system_fail, refund_process, refund_fail, refund_paid
        const PAID_STATUSES = ['paid', 'paid_over'];

        if (!PAID_STATUSES.includes(body.status)) {
            return NextResponse.json({ status: 'ignored', message: `Status is ${body.status}` });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Extract metadata
        let metadata: any = {};
        if (body.additional_data) {
            try {
                metadata = typeof body.additional_data === 'string'
                    ? JSON.parse(body.additional_data)
                    : body.additional_data;
            } catch (e) {
                console.error('Failed to parse metadata', e);
            }
        }

        const { userId, type, packLine } = metadata; // packLine was used in checkout as packType key
        const amount = parseFloat(body.amount || '0');
        const orderId = body.order_id;

        if (!userId) {
            console.error('Missing userId in metadata');
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // 3. Idempotency Check
        const { data: existingTx } = await supabase
            .from('transactions')
            .select('id, status')
            .eq('order_id', orderId)
            .single();

        if (existingTx && (existingTx.status === 'paid' || existingTx.status === 'paid_over')) {
            return NextResponse.json({ status: 'ok', message: 'Already processed' });
        }

        // 4. Fulfillment Logic
        // Fetch user current state first (for business expiry or affiliate)
        const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();

        if (userError || !user) {
            console.error('User not found for fulfillment', userId);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update Transaction to 'paid'
        const { error: txError } = await supabase.from('transactions').upsert({
            order_id: orderId,
            user_id: userId,
            amount: amount,
            currency: body.currency,
            status: body.status,
            type: type || 'unknown',
            metadata: metadata,
            provider: 'cryptomus',
            updated_at: new Date().toISOString()
        }, { onConflict: 'order_id' });

        if (txError) {
            console.error('Transaction update/insert error', txError);
            return NextResponse.json({ error: 'DB Error' }, { status: 500 });
        }

        // Prepare User Updates
        let updates: any = {};

        if (type === 'credits') {
            let creditsToAdd = 0;
            // Determine credits from pack
            if (packLine) {
                // TS hack: check if packLine is valid key
                const pack = PRICING_CONFIG.credits[packLine as keyof typeof PRICING_CONFIG.credits];
                if (pack) {
                    creditsToAdd = pack.credits;
                }
            }

            if (creditsToAdd > 0) {
                updates.credits = (user.credits || 0) + creditsToAdd;
            }

            // *** BONUS: Agency Pack includes Business AI ***
            if (packLine === 'agency') {
                const currentExpiry = user.business_expires_at ? new Date(user.business_expires_at) : new Date();
                const now = new Date();
                const baseDate = currentExpiry > now ? currentExpiry : now;
                const newExpiry = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
                updates.business_expires_at = newExpiry.toISOString();
            }

        } else if (type === 'business') {
            // Extend Expiration
            const currentExpiry = user.business_expires_at ? new Date(user.business_expires_at) : new Date();
            const now = new Date();
            const baseDate = currentExpiry > now ? currentExpiry : now;
            const newExpiry = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
            updates.business_expires_at = newExpiry.toISOString();
        }

        // Apply User Updates
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase.from('users').update(updates).eq('id', userId);
            if (updateError) console.error('Failed to update user', updateError);
        }

        // 5. Affiliate Commission
        if (user.referred_by) {
            const commission = amount * 0.5; // 50% Share
            if (commission > 0) {
                // Increment referrer balance.
                const { data: referrer } = await supabase.from('users').select('affiliate_balance, id').eq('id', user.referred_by).single();

                if (referrer) {
                    const newBalance = (referrer.affiliate_balance || 0) + commission;
                    await supabase.from('users').update({ affiliate_balance: newBalance }).eq('id', referrer.id);
                }
            }
        }

        return NextResponse.json({ status: 'success' });

    } catch (error: any) {
        console.error('Webhook Error', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
