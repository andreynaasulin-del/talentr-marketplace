'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GigCarousel from '@/components/GigCarousel';
import { supabase } from '@/lib/supabase';

const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await supabase.auth.getUser();
            } catch (error) {
                console.error('Auth check failed:', error);
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
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />

            <HeroSection />

            {/* Floating Gig Cards - Wolt style */}
            <GigCarousel />

            {/* How It Works */}
            <HowItWorks />

            <Footer />
        </main>
    );
}
