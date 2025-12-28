'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles, ArrowRight, Play, Star, Users, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import VoiceSearch from './VoiceSearch';
import Image from 'next/image';

interface HeroSectionProps {
    onSearch?: (query: string) => void;
}

// Animated counter hook
function useAnimatedNumber(target: number, duration: number = 2000) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
    }, [target, duration]);

    return current;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.21, 0.47, 0.32, 0.98] as const
        }
    }
};

export default function HeroSection({ onSearch }: HeroSectionProps) {
    const { t, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAISearching, setIsAISearching] = useState(false);
    const [aiSummary, setAiSummary] = useState('');

    // Animated stats
    const vendorCount = useAnimatedNumber(500, 2500);
    const eventCount = useAnimatedNumber(10, 2500);
    const ratingValue = 4.9;

    // Mouse parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const moveX = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), springConfig);
    const moveY = useSpring(useTransform(mouseY, [-500, 500], [-20, 20]), springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    }, [mouseX, mouseY]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const words = [
        language === 'he' ? 'צלם' : language === 'ru' ? 'фотографа' : 'photographer',
        language === 'he' ? 'דיג\'יי' : language === 'ru' ? 'диджея' : 'DJ',
        language === 'he' ? 'זמר' : language === 'ru' ? 'вокалиста' : 'singer',
        language === 'he' ? 'קוסם' : language === 'ru' ? 'фокусника' : 'magician',
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentWord = words[wordIndex % words.length];
            if (!isDeleting) {
                setDisplayText(currentWord.substring(0, displayText.length + 1));
                if (displayText === currentWord) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setDisplayText(currentWord.substring(0, displayText.length - 1));
                if (displayText === '') {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? 80 : 120);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, wordIndex, words]);

    // AI-powered search
    const handleAISearch = async (query: string) => {
        if (!query.trim()) return;

        setIsAISearching(true);
        setAiSummary('');

        try {
            const response = await fetch('/api/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, language }),
            });

            const data = await response.json();

            if (data.success && data.summary) {
                setAiSummary(data.summary);
            }

            // Still trigger the regular search for filtering
            onSearch?.(query);
        } catch (error) {
            console.error('AI Search error:', error);
            onSearch?.(query);
        } finally {
            setIsAISearching(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) handleAISearch(searchQuery);
    };

    const popularSearches = [
        { label: 'Photographers', query: 'Photographer', icon: '📸' },
        { label: 'DJs', query: 'DJ', icon: '🎵' },
        { label: 'Wedding', query: 'Wedding', icon: '💒' },
        { label: 'Bar Mitzvah', query: 'Bar Mitzvah', icon: '✡️' },
    ];

    return (
        <section
            className="relative min-h-[90vh] flex items-center overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Premium Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
                {/* Animated Mesh Blobs */}
                <motion.div
                    className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                        x: moveX,
                        y: moveY,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)',
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Noise Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Floating 3D Elements */}
            {mounted && (
                <>
                    <motion.div
                        className={cn(
                            "absolute top-20 w-16 h-16 hidden lg:flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl",
                            language === 'he' ? 'left-[15%]' : 'right-[15%]'
                        )}
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ x: moveX, y: moveY }}
                    >
                        <span className="text-3xl">📸</span>
                    </motion.div>
                    <motion.div
                        className={cn(
                            "absolute top-40 w-14 h-14 hidden lg:flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-xl",
                            language === 'he' ? 'left-[25%]' : 'right-[25%]'
                        )}
                        animate={{ y: [0, -20, 0], rotate: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    >
                        <span className="text-2xl">🎵</span>
                    </motion.div>
                    <motion.div
                        className={cn(
                            "absolute bottom-32 w-12 h-12 hidden lg:flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl",
                            language === 'he' ? 'left-[20%]' : 'right-[20%]'
                        )}
                        animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    >
                        <Star className="w-6 h-6 text-white fill-white" />
                    </motion.div>
                </>
            )}

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
                    {/* Left Side - Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Premium Badge */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-md border border-blue-100/50 rounded-full shadow-lg shadow-blue-500/5 mb-8"
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles className="w-5 h-5 text-amber-500" />
                            </motion.div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {language === 'he' ? 'מרקטפלייס האירועים המוביל' : language === 'ru' ? 'Маркетплейс событий #1' : "#1 Event Marketplace"}
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-[1.1] md:leading-[1.05] mb-4 md:mb-6 tracking-tight"
                        >
                            {language === 'he' ? 'מצא את ה' : language === 'ru' ? 'Найдите ' : 'Find the '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    {displayText}
                                </span>
                                <motion.span
                                    className="inline-block w-[3px] h-[0.85em] bg-gradient-to-b from-blue-500 to-purple-500 ml-1 rounded-full"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                />
                                {/* Underline decoration */}
                                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                                    <motion.path
                                        d="M2 8C50 2 150 2 198 8"
                                        stroke="url(#hero-underline)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                    <defs>
                                        <linearGradient id="hero-underline" x1="0" y1="0" x2="200" y2="0">
                                            <stop stopColor="#3B82F6" />
                                            <stop offset="0.5" stopColor="#8B5CF6" />
                                            <stop offset="1" stopColor="#EC4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <br />
                            <span className="text-gray-700">
                                {language === 'he' ? 'המושלם לאירוע שלך' : language === 'ru' ? 'для вашего события' : 'for your event'}
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base md:text-xl text-gray-600 mb-6 md:mb-10 max-w-xl leading-relaxed"
                        >
                            {language === 'he'
                                ? 'התחבר עם 500+ צלמים, DJ-ים ואמנים מאומתים. הזמן בביטחון.'
                                : language === 'ru'
                                    ? 'Свяжитесь с 500+ проверенными фотографами, DJ и артистами. Бронируйте уверенно.'
                                    : 'Connect with 500+ verified photographers, DJs, and entertainers. Book with confidence.'}
                        </motion.p>

                        {/* Premium Search Bar */}
                        <motion.form
                            variants={itemVariants}
                            onSubmit={handleSearch}
                            className="relative max-w-xl mb-8"
                        >
                            <motion.div
                                className={cn(
                                    "relative flex items-center bg-white rounded-2xl transition-all duration-300",
                                    isSearchFocused
                                        ? 'shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500/30'
                                        : 'shadow-xl shadow-gray-200/50'
                                )}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="absolute start-5 top-1/2 -translate-y-1/2">
                                    <motion.div
                                        animate={isSearchFocused ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Search className={cn(
                                            "w-6 h-6 transition-colors",
                                            isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                                        )} />
                                    </motion.div>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder={t('searchPlaceholder')}
                                    className="flex-1 ps-14 pe-4 py-5 text-lg text-gray-900 placeholder-gray-400 bg-transparent rounded-s-2xl focus:outline-none"
                                />
                                <div className="flex-shrink-0 px-2">
                                    <VoiceSearch onTranscript={(text) => { setSearchQuery(text); handleAISearch(text); }} />
                                </div>
                                <motion.button
                                    type="submit"
                                    className={cn(
                                        "flex-shrink-0 px-6 py-3 me-2 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg",
                                        isAISearching
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30"
                                    )}
                                    whileHover={!isAISearching ? { scale: 1.02 } : {}}
                                    whileTap={!isAISearching ? { scale: 0.98 } : {}}
                                    disabled={isAISearching}
                                >
                                    {isAISearching ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            AI...
                                        </>
                                    ) : (
                                        <>
                                            {t('Search')}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>

                            {/* AI Summary */}
                            <AnimatePresence>
                                {aiSummary && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-500" />
                                            <span className="text-sm font-medium text-purple-700">AI:</span>
                                            <span className="text-sm text-gray-700">{aiSummary}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.form>

                        {/* Popular Tags */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-10">
                            <span className="text-sm text-gray-500 font-medium">Popular:</span>
                            {popularSearches.map((search) => (
                                <motion.button
                                    key={search.query}
                                    onClick={() => { setSearchQuery(search.query); handleAISearch(search.query); }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-gray-200/50 rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{search.icon}</span>
                                    {t(search.label)}
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Animated Stats */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-10">
                            {[
                                { value: `${vendorCount}+`, label: language === 'ru' ? 'Специалистов' : language === 'he' ? 'בעלי מקצוע' : 'Verified Pros', icon: Users },
                                { value: `${eventCount}K+`, label: language === 'ru' ? 'Событий' : language === 'he' ? 'אירועים' : 'Events', icon: Calendar },
                                { value: ratingValue.toFixed(1), label: language === 'ru' ? 'Рейтинг' : language === 'he' ? 'דירוג' : 'Avg. Rating', icon: Star },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Premium Visual */}
                    <motion.div
                        className="hidden lg:block relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            {/* Main Featured Card */}
                            <motion.div
                                className="absolute top-0 left-0 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 bg-white"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                whileHover={{ scale: 1.02, rotate: 1 }}
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                                    alt="Featured photographer"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">TOP</span>
                                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">📸 Photographer</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Sarah Cohen</h3>
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span>4.9</span>
                                        <span>•</span>
                                        <span>127 reviews</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Booking Card */}
                            <motion.div
                                className="absolute bottom-10 right-0 w-64 bg-white rounded-2xl shadow-xl p-4"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                        <motion.span
                                            className="text-white text-xl"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 1 }}
                                        >
                                            ✓
                                        </motion.span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Booking Confirmed!</p>
                                        <p className="text-sm text-gray-500">DJ Noam • Dec 28</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Wedding</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Tel Aviv</span>
                                </div>
                            </motion.div>

                            {/* Trending Badge */}
                            <motion.div
                                className="absolute top-10 right-10 px-4 py-2.5 bg-white rounded-xl shadow-lg flex items-center gap-2"
                                animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-xs text-gray-500">This week</p>
                                    <p className="font-bold text-gray-900">+23% bookings</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
