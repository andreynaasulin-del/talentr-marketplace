'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GigCarousel from '@/components/GigCarousel';
import { supabase } from '@/lib/supabase';

const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!supabase) return;
                await supabase.auth.getUser();
            } catch (error) {
                // Auth check failed silently
            } finally {
                setIsLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        checkAuth().finally(() => clearTimeout(timeout));
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-12 h-12 border-2 border-zinc-800 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            <Navbar />
            <HeroSection />
            <GigCarousel />
            <Footer />
        </main>
    );
}
