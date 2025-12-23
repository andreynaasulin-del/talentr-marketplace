'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const floatingItems = [
    { icon: '📸', delay: 0, duration: 6, position: 'top-20 end-[15%]' },
    { icon: '🎵', delay: 1, duration: 7, position: 'top-32 end-[25%]' },
    { icon: '🎤', delay: 2, duration: 5, position: 'top-16 end-[35%]' },
    { icon: '✨', delay: 0.5, duration: 8, position: 'bottom-32 end-[20%]' },
    { icon: '🎭', delay: 1.5, duration: 6, position: 'bottom-20 end-[30%]' },
];

interface HeroSectionProps {
    onSearch?: (query: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
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

    useEffect(() => {
        setMounted(true);
    }, []);

    const words = [
        language === 'he' ? 'טאלנט' : language === 'ru' ? 'талант' : 'talent',
        language === 'he' ? 'צלם' : language === 'ru' ? 'фотограф' : 'photographer',
        language === 'he' ? 'דיג\'יי' : language === 'ru' ? 'диджей' : 'DJ',
        language === 'he' ? 'זמר' : language === 'ru' ? 'певец' : 'singer',
    ];

    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseTime = 2000;

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentWord = words[wordIndex % words.length];

            if (!isDeleting) {
                setDisplayText(currentWord.substring(0, displayText.length + 1));
                if (displayText === currentWord) {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                setDisplayText(currentWord.substring(0, displayText.length - 1));
                if (displayText === '') {
                    setIsDeleting(false);
                    setWordIndex((prev: number) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, wordIndex, language, words]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch?.(searchQuery);
        }
    };

    const popularSearches = [
        { label: 'Photographers', query: 'Photographer' },
        { label: 'DJs', query: 'DJ' },
        { label: 'Wedding', query: 'Wedding' },
        { label: 'Bar Mitzvah', query: 'Bar Mitzvah' },
    ];

    const stats = [
        { value: '500+', label: 'Verified Pros' },
        { value: '10K+', label: 'Events Done' },
        { value: '4.9', label: 'Avg. Rating' },
    ];

    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 hero-gradient">
                {/* Animated Gradient Orbs */}
                <motion.div
                    className="absolute top-0 start-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 end-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
                    animate={{
                        y: [0, 30, 0],
                        x: [0, -20, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Floating Elements */}
            {mounted && floatingItems.map((item, index) => (
                <motion.div
                    key={index}
                    className={cn(
                        "absolute text-4xl hidden lg:block cursor-default select-none",
                        item.position
                    )}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: item.delay
                    }}
                    whileHover={{
                        scale: 1.2,
                        opacity: 1,
                        transition: { duration: 0.2 }
                    }}
                    initial={{ opacity: 0.4 }}
                >
                    {item.icon}
                </motion.div>
            ))}

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
                <motion.div
                    className="max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-blue-100 rounded-full text-blue-600 text-sm font-semibold mb-8 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        {language === 'he' ? 'מרקטפלייס האירועים המוביל בישראל' : language === 'ru' ? 'Лучший маркетплейс событий в Израиле' : "Israel's Premier Event Marketplace"}
                    </motion.div>

                    {/* Headline with Typewriter */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6"
                    >
                        {language === 'he' ? 'מצא את ה' : language === 'ru' ? 'Найдите идеального ' : 'Find the perfect '}
                        <span className="relative inline-block min-w-[120px]">
                            <span className="text-gradient">{displayText}</span>
                            <span className="inline-block w-1 h-[0.8em] bg-blue-500 ml-1 animate-pulse" />
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 12"
                                fill="none"
                            >
                                <path
                                    d="M2 8C50 4 150 4 198 8"
                                    stroke="url(#underline-gradient)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                                        <stop stopColor="#3B82F6" />
                                        <stop offset="1" stopColor="#8B5CF6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                        <br />
                        {language === 'he' ? 'לאירוע שלך' : language === 'ru' ? 'для вашего события' : 'for your event'}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
                    >
                        {language === 'he'
                            ? 'התחבר עם 500+ צלמים, דיג\'ייז, אמנים מאומתים ועוד. הזמן בביטחון.'
                            : language === 'ru'
                                ? 'Свяжитесь с 500+ проверенными фотографами, диджеями и артистами. Бронируйте уверенно.'
                                : 'Connect with 500+ verified photographers, DJs, entertainers and more. Book with confidence.'}
                    </motion.p>

                    {/* Search Bar */}
                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSearch}
                        className="relative max-w-2xl mb-6"
                    >
                        <motion.div
                            className={cn(
                                "relative bg-white rounded-2xl transition-all duration-300",
                                isSearchFocused
                                    ? 'shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                                    : 'shadow-lg shadow-gray-200/50'
                            )}
                            whileHover={{
                                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
                            }}
                        >
                            <Search className={cn(
                                "absolute start-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors duration-200",
                                isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                            )} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full ps-14 pe-36 py-5 text-lg text-gray-900 placeholder-gray-400 bg-transparent rounded-2xl focus:outline-none"
                            />
                            <motion.button
                                type="submit"
                                className="absolute end-3 top-1/2 -translate-y-1/2 btn-primary px-6 py-3 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('Search')}
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    </motion.form>

                    {/* Popular Searches */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center gap-3 mb-12"
                    >
                        <span className="text-sm text-gray-500">Popular:</span>
                        {popularSearches.map((search) => (
                            <motion.button
                                key={search.query}
                                onClick={() => setSearchQuery(search.query)}
                                className="px-4 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t(search.label)}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-8 pt-8 border-t border-gray-200/50"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{t(stat.label)}</p>
                            </motion.div>
                        ))}

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-12 bg-gray-200 mx-4" />

                        {/* CTA Button */}
                        <motion.button
                            className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                                <Play className="w-4 h-4 ml-0.5" />
                            </div>
                            <span className="text-sm font-medium">{t('How it works')}</span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Side - Featured Image (Desktop Only) */}
            <div className="hidden xl:block absolute end-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px]">
                <div className="relative w-full h-full">
                    {/* Main Card */}
                    <motion.div
                        className="absolute top-10 end-20 w-72 h-80 bg-white rounded-3xl shadow-2xl overflow-hidden"
                        animate={{
                            y: [0, -15, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                    >
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80)' }}
                        />
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-white font-semibold">Top Photographer</p>
                            <p className="text-white/80 text-sm">⭐ 4.9 · 127 reviews</p>
                        </div>
                    </motion.div>

                    {/* Secondary Card */}
                    <motion.div
                        className="absolute bottom-20 end-0 w-56 h-32 bg-white rounded-2xl shadow-xl p-4"
                        animate={{
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 text-lg">✓</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Booking Confirmed</p>
                                <p className="text-xs text-gray-500">DJ Noam · Dec 28</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Rating Badge */}
                    <motion.div
                        className="absolute top-0 end-0 px-4 py-2 bg-white rounded-full shadow-lg flex items-center gap-2"
                        animate={{
                            y: [0, -8, 0],
                            rotate: [0, -3, 3, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-bold text-gray-900">4.9</span>
                        <span className="text-gray-500 text-sm">Avg. Rating</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
