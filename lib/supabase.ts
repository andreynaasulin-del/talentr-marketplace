import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

// ⚠️ IMPORTANT: Make sure to use the correct Supabase ANON key (not service_role)
// The anon key is safe for client-side use and has row-level security
if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured - auth features will be disabled
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});
}

export { supabase };
