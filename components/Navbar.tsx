'use client';

import Link from 'next/link';
import { Search, User, LogOut, Globe, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const checkAuth = async () => {
            const testMode = localStorage.getItem('test_mode');
            if (testMode === 'true') {
                setIsAuthenticated(true);
                return;
            }
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        };
        checkAuth();

        // Scroll listener for navbar effect
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        localStorage.removeItem('test_mode');
        localStorage.removeItem('test_user');
        await supabase.auth.signOut();
        router.push('/');
    };

    const languages = [
        { code: 'en' as const, label: 'English', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עברית', flag: '🇮🇱' },
        { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    return (
        <nav className={`
            sticky top-0 z-50 transition-all duration-300
            ${isScrolled
                ? 'navbar-glass shadow-md'
                : 'bg-white/80 backdrop-blur-sm border-b border-gray-100/50'
            }
        `}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo - force LTR to prevent reversal */}
                    <Link
                        href="/"
                        dir="ltr"
                        className="text-xl md:text-2xl font-bold hover:opacity-80 transition-all duration-300 flex items-center gap-0"
                    >
                        <span className="text-gray-900">talent</span>
                        <span className="text-gradient">r</span>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:block flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="search-input w-full rounded-full ps-12 pe-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                            >
                                <span className="text-xl leading-none">{currentLang.flag}</span>
                                <span className="hidden lg:inline">{currentLang.label}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLangDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowLangDropdown(false)}
                                    />
                                    <div className="absolute end-0 mt-3 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={`
                                                    w-full px-4 py-3 text-start hover:bg-blue-50 transition-colors flex items-center justify-between
                                                    ${language === lang.code ? 'text-blue-600' : 'text-gray-700'}
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl leading-none">{lang.flag}</span>
                                                    <span className="font-bold">{lang.label}</span>
                                                </div>
                                                {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Auth Button / User Profile */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSignOut}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title={t('signOut')}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center p-0.5 shadow-md">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-900" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-95"
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
