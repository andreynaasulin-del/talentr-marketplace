import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client for build time when env vars are not available
const createSupabaseClient = (): SupabaseClient => {
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client during build time
        return createClient('https://placeholder.supabase.co', 'placeholder-key', {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });
};

export const supabase = createSupabaseClient();
