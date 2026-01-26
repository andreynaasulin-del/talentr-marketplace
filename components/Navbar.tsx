'use client';

import Link from 'next/link';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import Logo from '@/components/Logo';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createPortal } from 'react-dom';

export default function Navbar() {
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        if (!isHome) {
            setIsScrolled(true);
        }
        window.addEventListener('scroll', handleScroll);

        // Auth check
        supabase?.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        }) || { data: { subscription: { unsubscribe: () => { } } } };

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, [isHome]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleSignOut = async () => {
        await supabase?.auth.signOut();
        setShowProfileDropdown(false);
        setIsMobileMenuOpen(false);
        router.push('/');
    };

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            findTalent: 'Find Talent',
            becomeVendor: 'Partner with us',
            dashboard: 'Dashboard',
            myGigs: 'My Gigs',
            signOut: 'Sign Out',
            signIn: 'Sign In'
        },
        he: {
            findTalent: 'מצא כישרון',
            becomeVendor: 'הפוך לשותף',
            dashboard: 'לוח בקרה',
            myGigs: 'הגיגים שלי',
            signOut: 'התנתק',
            signIn: 'התחבר'
        },
    };

    const t = content[lang];

    // Mobile Menu Component - will be rendered via Portal
    const MobileMenu = () => {
        if (!isMobileMenuOpen) return null;

        return (
            <div className="fixed inset-0 w-screen h-screen bg-white dark:bg-black z-[9999] flex flex-col transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-zinc-100 dark:border-zinc-800/50 flex-shrink-0">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                        <Logo size="lg" />
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-all active:scale-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div className="flex flex-col gap-4">
                        {/* User Profile */}
                        {user && (
                            <div className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl mb-2 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                    {user.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-zinc-900 dark:text-white font-bold text-lg truncate">{user.email?.split('@')[0]}</p>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Find Talent Button */}
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                if (isHome) {
                                    setTimeout(() => {
                                        const chatButton = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
                                        chatButton?.click();
                                    }, 100);
                                } else {
                                    window.location.href = '/';
                                }
                            }}
                            className="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold text-lg transition-colors shadow-lg shadow-blue-600/20"
                        >
                            {t.findTalent}
                        </button>

                        {/* Auth Actions */}
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white font-semibold text-lg text-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    {t.dashboard}
                                </Link>
                                <Link
                                    href="/my-gigs"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-500/30 rounded-2xl text-purple-600 dark:text-purple-400 font-semibold text-lg text-center hover:from-purple-500/20 hover:to-blue-500/20 transition-colors"
                                >
                                    🎤 {t.myGigs}
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 font-semibold text-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                >
                                    {t.signOut}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white font-semibold text-lg text-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    {t.signIn}
                                </Link>
                                <Link
                                    href="/join"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-600 dark:text-zinc-400 font-semibold text-lg text-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    {t.becomeVendor}
                                </Link>
                            </>
                        )}

                        {/* Theme & Language Selector */}
                        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            {/* Theme Toggle */}
                            <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs uppercase tracking-widest font-bold mb-4">Theme</p>
                            <div className="flex justify-center gap-3 mb-6">
                                <button
                                    onClick={() => toggleTheme()}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold transition-colors hover:bg-blue-500/20"
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun className="w-5 h-5" />
                                            <span>Light</span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-5 h-5" />
                                            <span>Dark</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Language Selector */}
                            <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs uppercase tracking-widest font-bold mb-4">Language</p>
                            <div className="flex justify-center gap-3">
                                {languages.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => {
                                            setLanguage(l.code);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-colors ${language === l.code
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        <span className="text-lg">{l.flag}</span>
                                        <span className="font-semibold">{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-200 ${theme === 'dark'
                    ? 'bg-black/80 border-white/[0.08]'
                    : 'bg-white/80 border-black/[0.08]'
                    }`}
                style={{
                    boxShadow: isScrolled
                        ? theme === 'dark'
                            ? '0 4px 20px rgba(0,0,0,0.5)'
                            : '0 4px 20px rgba(0,0,0,0.1)'
                        : 'none'
                }}
            >
                <div className="max-w-[1200px] mx-auto px-3 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center z-50 relative">
                            <Logo size="lg" />
                        </Link>

                        {/* Right side (Desktop) */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>

                            {/* Language Switcher */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <span>{currentLang.flag}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-zinc-500 ${showLangDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showLangDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLangDropdown(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 py-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
                                            {languages.map((l) => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => {
                                                        setLanguage(l.code);
                                                        setShowLangDropdown(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors ${language === l.code ? 'text-blue-500 font-semibold' : 'text-zinc-600 dark:text-zinc-400'
                                                        }`}
                                                >
                                                    <span>{l.flag}</span>
                                                    <span className="text-sm">{l.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Profile or Partner Link */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                                            {user.email?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    </button>

                                    {showProfileDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                                            <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                    className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                >
                                                    {t.dashboard}
                                                </Link>
                                                <Link
                                                    href="/my-gigs"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                    className="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium"
                                                >
                                                    🎤 {t.myGigs}
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-start px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                                >
                                                    {t.signOut}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/join"
                                    className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {t.becomeVendor}
                                </Link>
                            )}

                            {/* Primary CTA */}
                            <button
                                onClick={() => {
                                    if (isHome) {
                                        const chatButton = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
                                        chatButton?.click();
                                    } else {
                                        window.location.href = '/';
                                    }
                                }}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg hover:shadow-blue-600/20"
                            >
                                {t.findTalent}
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center gap-3">
                            {user && (
                                <Link href="/dashboard" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
                                    {user.email?.[0].toUpperCase() || 'U'}
                                </Link>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu via Portal - renders at document.body level */}
            {mounted && createPortal(<MobileMenu />, document.body)}
        </>
    );
}
