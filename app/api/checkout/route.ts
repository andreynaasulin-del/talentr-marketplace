
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// We import the config. 
// Assuming @/ points to root or specific alias. If this fails, we change to relative.
import { PRICING_CONFIG } from '@/config/pricing';

export async function POST(request: NextRequest) {
    try {
        // 1. Auth Check - get user from Supabase using user token
        // Usually, client sends Authorization: Bearer token.
        // Or cookie. Assuming standard Supabase auth.
        const authHeader = request.headers.get('authorization');

        // Setup Supabase first
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let user = null;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data, error } = await supabase.auth.getUser(token);
            if (!error && data.user) user = data.user;
        } else {
            // Try cookie? Or force header?
            // Usually API routes rely on header for explicit auth.
            return NextResponse.json({ error: 'Unauthorized: Missing Token' }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
        }

        // 2. Validate Input
        const body = await request.json();
        const { type, pack } = body; // type: 'credits' | 'business', pack?: string

        let amount = 0;
        let orderName = '';
        let metadata = {};

        if (type === 'credits') {
            if (!pack) return NextResponse.json({ error: 'Pack required for credits' }, { status: 400 });

            // Explicitly reject 'admin_pack' or any pack not in config
            if (pack === 'admin_pack') {
                return NextResponse.json({ error: 'Access Denied: Admin Pack' }, { status: 403 });
            }

            const creditPack = PRICING_CONFIG.credits[pack as keyof typeof PRICING_CONFIG.credits];
            if (!creditPack) {
                return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 });
            }

            amount = creditPack.amount;
            orderName = creditPack.name;
            metadata = {
                userId: user.id,
                packLine: pack, // We use 'packLine' to differentiate from 'pack' param? Or just 'pack'.
                type: 'credits'
            };
        } else if (type === 'business') {
            amount = PRICING_CONFIG.business.amount;
            orderName = PRICING_CONFIG.business.name;
            metadata = {
                userId: user.id,
                type: 'business'
            };
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        // 3. Generate Order ID
        // Unique ID: uid_[userId8]_[timestamp]
        const orderId = `uid_${user.id.slice(0, 8)}_${Date.now()}`;

        // 4. Call Cryptomus API
        const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
        const paymentKey = process.env.CRYPTOMUS_PAYMENT_KEY;

        if (!merchantId || !paymentKey) {
            console.error('Cryptomus credentials missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Payload for Cryptomus
        // Note: additional_data usually needs to be stringified JSON or plain string?
        // Usually plain string passed through.
        // If we want metadata returned in webhook, usually 'additional_data' or 'url_callback' params. 
        // We will pass it in 'order_id' or 'additional_data'.
        // Cryptomus supports `additional_data: string`.

        const payloadData = {
            amount: amount.toString(),
            currency: 'USD',
            order_id: orderId,
            url_return: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // Redirect after success
            url_success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
            url_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cryptomus`, // Webhook URL
            is_payment_multiple: false,
            lifetime: 3600, // 1 hour
            to_currency: 'USDT', // We prefer stablecoin? Or allow user choice. defaulting to USDT for price implementation usually.
            additional_data: JSON.stringify(metadata) // Passing metadata stringified
        };

        // Create Signature using Payment Key
        // sign = md5(base64(data) + payment_key)
        const payloadString = JSON.stringify(payloadData);
        const base64Payload = Buffer.from(payloadString).toString('base64');
        const sign = crypto.createHash('md5').update(base64Payload + paymentKey).digest('hex');

        // Send Request
        const response = await fetch('https://api.cryptomus.com/v1/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'merchant': merchantId,
                'sign': sign
            },
            body: payloadString
        });

        const data = await response.json();

        // Check response
        // data.state or data.status or data.result
        if (!response.ok || (data.status === 'error')) {
            console.error('Cryptomus Error:', data);
            return NextResponse.json({ error: data.message || 'Payment creation failed' }, { status: 400 });
        }

        // 5. Return Payment URL
        // Usually data.result.url
        return NextResponse.json({
            success: true,
            paymentUrl: data.result.url,
            orderId: orderId
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
