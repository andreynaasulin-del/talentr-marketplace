'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GigCarousel from '@/components/GigCarousel';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <motion.div 
                    className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950">
            <Navbar />
            <HeroSection />
            <GigCarousel />
            
            {/* Minimal Footer */}
            <footer className="py-8 bg-slate-950 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p dir="ltr" className="text-sm text-white/30 font-medium">
                            talent<span className="text-cyan-400">r</span> © {new Date().getFullYear()}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-white/30">
                            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
