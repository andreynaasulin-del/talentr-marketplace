'use client';

import Link from 'next/link';
import { User, LogOut, ChevronDown, Calendar, Heart, Sun, Moon } from 'lucide-react';
import Logo from '@/components/Logo';
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
        toast.success(language === 'he' ? 'התנתקת בהצלחה' : 'Signed out');
        router.push('/');
    };

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 transition-all duration-200",
                isScrolled
                    ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm'
                    : 'bg-white dark:bg-slate-900'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Logo size="md" />

                    {/* Right Actions - Mobile optimized */}
                    <div className="flex items-center gap-1">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Language Switcher - Compact */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-1 px-2.5 py-2 text-sm font-bold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="text-lg">{currentLang.flag}</span>
                                <ChevronDown className={cn("w-3 h-3 transition-transform", showLangDropdown && 'rotate-180')} />
                            </button>

                            <AnimatePresence>
                                {showLangDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLangDropdown(false)}
                                        />
                                        <motion.div
                                            className="absolute end-0 mt-2 w-32 py-1 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700"
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code);
                                                        setShowLangDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full px-3 py-2.5 text-start flex items-center gap-2 transition-colors",
                                                        "hover:bg-gray-50 dark:hover:bg-slate-700",
                                                        language === lang.code ? 'text-[#009de0]' : 'text-gray-700 dark:text-gray-300'
                                                    )}
                                                >
                                                    <span className="text-lg">{lang.flag}</span>
                                                    <span className="font-medium">{lang.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Auth / User */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-1">
                                {/* Favorites */}
                                <Link
                                    href="/favorites"
                                    className="relative p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    <Heart className="w-5 h-5" />
                                    {favoritesCount > 0 && (
                                        <span className="absolute -top-0.5 -end-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                                            {favoritesCount > 9 ? '9+' : favoritesCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Bookings */}
                                <Link
                                    href="/bookings"
                                    className="p-2.5 text-gray-500 hover:text-[#009de0] hover:bg-[#009de0]/10 rounded-xl transition-colors"
                                >
                                    <Calendar className="w-5 h-5" />
                                </Link>

                                {/* Sign out */}
                                <button
                                    onClick={handleSignOut}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>

                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#009de0] to-blue-400 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="px-4 py-2 rounded-xl font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 text-sm transition-colors hover:opacity-90"
                            >
                                {t('Sign In')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
