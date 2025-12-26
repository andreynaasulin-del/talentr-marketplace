'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryRail from '@/components/CategoryRail';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

// Dynamic imports for below-fold components (lazy loading)
const VendorGrid = dynamic(() => import('@/components/VendorGrid'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-3xl" />
});
const SmartFeed = dynamic(() => import('@/components/SmartFeed'), {
    loading: () => <div className="h-[500px] animate-pulse bg-gray-100 rounded-[40px]" />
});
const FeaturedVendors = dynamic(() => import('@/components/FeaturedVendors'));
const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const AppBanner = dynamic(() => import('@/components/AppBanner'));
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const EventSuggestions = dynamic(() => import('@/components/EventSuggestions'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    const router = useRouter();
    const { language } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [initialSearchQuery, setInitialSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const smartFeedSectionRef = useRef<HTMLDivElement>(null);
    const vendorGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
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
                <CategoryRail onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    vendorGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }} />
            </div>

            {/* Event Type Suggestions */}
            {selectedCategory === 'All' && (
                <div className="max-w-7xl mx-auto px-6">
                    <EventSuggestions onSelect={(query) => handleSearch(query)} />
                </div>
            )}

            {selectedCategory !== 'All' && (
                <div ref={vendorGridRef} className="scroll-mt-20">
                    <VendorGrid category={selectedCategory} />
                </div>
            )}

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
