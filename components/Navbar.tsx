'use client';

import Link from 'next/link';
import { Search, User, LogOut, Globe, ChevronDown, Calendar, Heart, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { favoritesCount } = useFavorites();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        };
        checkAuth();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        toast.success(language === 'ru' ? 'Вы вышли из аккаунта' : language === 'he' ? 'התנתקת בהצלחה' : 'Signed out successfully');
        router.push('/');
    };

    const languages = [
        { code: 'en' as const, label: 'English', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עברית', flag: '🇮🇱' },
        { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    return (
        <motion.nav
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                isScrolled
                    ? 'navbar-glass shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-100/50 dark:border-slate-800/50'
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="/"
                            dir="ltr"
                            className="text-xl md:text-2xl font-bold hover:opacity-80 transition-all duration-300 flex items-center gap-0"
                        >
                            <span className="text-gray-900 dark:text-white">talent</span>
                            <span className="text-gradient">r</span>
                        </Link>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-xl">
                        <motion.div
                            className="relative group"
                            whileHover={{ scale: 1.01 }}
                        >
                            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className={cn(
                                    "search-input w-full rounded-full ps-12 pe-4 py-3",
                                    "text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none",
                                    "bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700"
                                )}
                            />
                        </motion.div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 md:gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className={cn(
                                "p-2.5 rounded-xl transition-all duration-300",
                                "text-gray-500 dark:text-gray-400",
                                "hover:bg-gray-100 dark:hover:bg-slate-800",
                                "hover:text-amber-500 dark:hover:text-amber-400"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === 'dark' ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Sun className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Language Switcher */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200",
                                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-lg md:text-xl leading-none">{currentLang.flag}</span>
                                <span className="hidden lg:inline">{currentLang.label}</span>
                                <ChevronDown className={cn("w-3 h-3 md:w-4 md:h-4 hidden sm:block transition-transform duration-300", showLangDropdown && 'rotate-180')} />
                            </motion.button>

                            <AnimatePresence>
                                {showLangDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLangDropdown(false)}
                                        />
                                        <motion.div
                                            className={cn(
                                                "absolute end-0 mt-3 w-48 py-2 z-50",
                                                "bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl",
                                                "border border-gray-100 dark:border-slate-700"
                                            )}
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {languages.map((lang) => (
                                                <motion.button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code);
                                                        setShowLangDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full px-4 py-3 text-start flex items-center justify-between transition-colors",
                                                        "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                                                        language === lang.code ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                                                    )}
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl leading-none">{lang.flag}</span>
                                                        <span className="font-bold">{lang.label}</span>
                                                    </div>
                                                    {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Auth Button / User Profile */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-1 md:gap-3">
                                {/* Favorites Button */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        href="/favorites"
                                        className="relative p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        title={language === 'ru' ? 'Избранное' : language === 'he' ? 'מועדפים' : 'Favorites'}
                                    >
                                        <Heart className="w-5 h-5" />
                                        {favoritesCount > 0 && (
                                            <span className="absolute -top-1 -end-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                                                {favoritesCount > 9 ? '9+' : favoritesCount}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>

                                {/* Bookings Button */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        href="/bookings"
                                        className={cn(
                                            "hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all",
                                            "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        )}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {language === 'ru' ? 'Заказы' : language === 'he' ? 'הזמנות' : 'Bookings'}
                                    </Link>
                                </motion.div>
                                <motion.button
                                    onClick={handleSignOut}
                                    className="hidden sm:block p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    title={t('signOut')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <LogOut className="w-5 h-5" />
                                </motion.button>
                                <motion.div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center p-0.5 shadow-md"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-900 dark:text-white" />
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/signin"
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl font-bold transition-all duration-300",
                                        "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                                        "shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20"
                                    )}
                                >
                                    {t('Sign In')}
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
