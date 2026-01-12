'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState('Verifying authentication...');

    useEffect(() => {
        if (!supabase) {
            router.push('/signin?error=auth_unavailable');
            return;
        }

        // Listen for the auth state change that happens after the hash is parsed
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setStatus('Successfully signed in! Redirecting...');
                // Small delay to ensure state propagation
                setTimeout(() => router.push('/dashboard'), 500);
            } else if (event === 'SIGNED_OUT') {
                setStatus('Authentication failed. Redirecting...');
                setTimeout(() => router.push('/signin?error=auth_failed'), 2000);
            }
        });

        // Also check getSession in case the listener misses the initial state or it was already handled
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('Auth callback error:', error);
                router.push('/signin?error=auth_check_error');
            } else if (session) {
                setStatus('Session found. Redirecting...');
                router.push('/dashboard');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{status}</h2>
                <p className="text-zinc-400 text-sm">Please wait while we set up your session.</p>
            </div>
        </div>
    );
}
