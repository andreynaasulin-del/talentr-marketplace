import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Get all active gig templates
export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: templates, error } = await supabase
            .from('gig_templates')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching templates:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ templates });
    } catch (error) {
        console.error('Get templates error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
