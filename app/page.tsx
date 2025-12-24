'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryRail from '@/components/CategoryRail';
import SmartFeed from '@/components/SmartFeed';
import FeaturedVendors from '@/components/FeaturedVendors';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import AppBanner from '@/components/AppBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [initialSearchQuery, setInitialSearchQuery] = useState('');
    const smartFeedSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const testMode = localStorage.getItem('test_mode');
            if (testMode === 'true') {
                setIsAuthenticated(true);
                setMounted(true);
                return;
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
                setMounted(true);
            } else {
                router.push('/signin');
            }
        };
        checkAuth();
    }, [router]);

    const handleSearch = (query: string) => {
        setInitialSearchQuery(query);
        smartFeedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />

            <HeroSection onSearch={handleSearch} />

            <div className="max-w-7xl mx-auto border-b border-gray-100 dark:border-slate-800">
                <CategoryRail />
            </div>

            <FeaturedVendors />

            <Testimonials />

            <div ref={smartFeedSectionRef} className="bg-gray-50/50 dark:bg-slate-900/50 py-24 md:py-32 relative scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
                            <Sparkles className="w-4 h-4" />
                            {language === 'ru' ? 'УМНЫЙ ПОИСК' : language === 'he' ? 'חיפוש חכם' : 'SMART DISCOVERY'}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight animate-slide-up">
                            {language === 'he' ? 'גלה את הטובים ביותר' : language === 'ru' ? 'Откройте для себя лучших' : 'Discover the Best'}
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
                            {language === 'he'
                                ? 'מצא את אנשי המקצוע המובילים לאירוע שלך בעזרת ה-AI שלנו'
                                : language === 'ru'
                                    ? 'Найдите лучших специалистов для вашего события с помощью нашего AI'
                                    : 'Find top-rated professionals for your event with the help of our intelligent search.'}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-[40px] shadow-premium overflow-hidden border border-gray-100 dark:border-slate-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <SmartFeed initialMessage={initialSearchQuery} />
                    </div>
                </div>
            </div>

            <HowItWorks />

            <AppBanner />

            <Footer />

            <WhatsAppButton />
        </main>
    );
}
