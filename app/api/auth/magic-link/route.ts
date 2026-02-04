import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // NOTE: This should ideally use createClient from @supabase/ssr or similar for server context, but for MVP re-using lib/supabase checks. Or better, just redirect logic on client side.

// Actually, Magic Link usually lands on valid callback or dashboard. 
// We want to intercept.
// Best way: Middleware. But user asked for "Auth behavior" logic. 
// Let's assume standard Supabase Auth behavior lands them on "/".
// We will create a robust Middleware to handle the "Onboarding Redirect".

export async function GET(request: NextRequest) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
}
