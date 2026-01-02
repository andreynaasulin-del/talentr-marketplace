'use client';

import Link from 'next/link';
import { User, LogOut, ChevronDown, Calendar, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        dir="ltr"
                        className="text-xl font-bold text-white tracking-tight"
                    >
                        talent<span className="text-cyan-400">r</span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-base">{currentLang.flag}</span>
                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showLangDropdown && 'rotate-180')} />
                            </button>

                            <AnimatePresence>
                                {showLangDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLangDropdown(false)}
                                        />
                                        <motion.div
                                            className="absolute end-0 mt-2 w-36 py-2 z-50 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10"
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
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
                                                        "w-full px-4 py-2.5 text-start flex items-center gap-3 transition-all duration-200",
                                                        "hover:bg-white/5",
                                                        language === lang.code ? 'text-cyan-400' : 'text-white/70'
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
                                    className="relative p-2.5 text-white/50 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all duration-200"
                                >
                                    <Heart className="w-5 h-5" />
                                    {favoritesCount > 0 && (
                                        <span className="absolute -top-0.5 -end-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-slate-950 bg-amber-400 rounded-full">
                                            {favoritesCount > 9 ? '9+' : favoritesCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Bookings */}
                                <Link
                                    href="/bookings"
                                    className="p-2.5 text-white/50 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all duration-200"
                                >
                                    <Calendar className="w-5 h-5" />
                                </Link>

                                {/* Sign out */}
                                <button
                                    onClick={handleSignOut}
                                    className="p-2.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>

                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center ring-2 ring-white/10">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-white text-sm transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
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
