'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryRail from '@/components/CategoryRail';
import SmartFeed from '@/components/SmartFeed';
import FeaturedVendors from '@/components/FeaturedVendors';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function Home() {
    const { t, language } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [initialSearchQuery, setInitialSearchQuery] = useState('');
    const smartFeedSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (query: string) => {
        setInitialSearchQuery(query);
        smartFeedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <HeroSection onSearch={handleSearch} />

            <div className="max-w-7xl mx-auto border-b border-gray-100">
                <CategoryRail />
            </div>

            {/* Featured Section */}
            <FeaturedVendors />

            {/* Smart Discovery Section */}
            <div ref={smartFeedSectionRef} className="bg-gray-50/50 py-24 md:py-32 relative scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest mb-6 border border-blue-100">
                            <Sparkles className="w-4 h-4" />
                            {language === 'ru' ? 'УМНЫЙ ПОИСК' : language === 'he' ? 'חיפוש חכם' : 'SMART DISCOVERY'}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight animate-slide-up">
                            {language === 'he' ? 'גלה את הטובים ביותר' : language === 'ru' ? 'Откройте для себя лучших' : 'Discover the Best'}
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
                            {language === 'he'
                                ? 'מצא את אנשי המקצוע המובילים לאירוע שלך בעזרת ה-AI שלנו'
                                : language === 'ru'
                                    ? 'Найдите лучших специалистов для вашего события с помощью нашего AI'
                                    : 'Find top-rated professionals for your event with the help of our intelligent search.'}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-premium overflow-hidden border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <SmartFeed initialMessage={initialSearchQuery} />
                    </div>
                </div>
            </div>

            {/* Explainer Section */}
            <HowItWorks />

            <Footer />
        </main>
    );
}
