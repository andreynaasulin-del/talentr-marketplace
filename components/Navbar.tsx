'use client';

import Link from 'next/link';
import { User, LogOut, ChevronDown, Calendar, Heart } from 'lucide-react';
import Logo from '@/components/Logo';
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
                "sticky top-0 z-50 transition-all duration-300",
                isScrolled
                    ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo - white for dark bg */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white tracking-tight">
                            talent<span className="text-cyan-400">r</span>
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-1 px-2.5 py-2 text-sm font-bold rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
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
                                            className="absolute end-0 mt-2 w-32 py-1 z-50 bg-slate-900 rounded-xl shadow-xl border border-white/10"
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
                                    className="relative p-2.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
                                    className="p-2.5 text-white/50 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
                                >
                                    <Calendar className="w-5 h-5" />
                                </Link>

                                {/* Sign out */}
                                <button
                                    onClick={handleSignOut}
                                    className="p-2.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>

                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="px-4 py-2 rounded-xl font-bold text-slate-950 bg-white text-sm transition-all hover:bg-cyan-400"
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
