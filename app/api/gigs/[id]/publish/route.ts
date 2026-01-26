import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST - Publish gig
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: gig, error } = await supabase
            .from('gigs')
            .update({
                status: 'published',
                wizard_completed: true,
                published_at: new Date().toISOString(),
                moderation_status: 'approved' // Auto-approve for MVP
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Publish gig error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            gig,
            success: true,
            message: 'Гиг опубликован!'
        });
    } catch (error) {
        console.error('Publish gig error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
