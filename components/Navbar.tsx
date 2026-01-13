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
            signOut: 'Sign Out',
            signIn: 'Sign In'
        },
        he: {
            findTalent: 'מצא כישרון',
            becomeVendor: 'הפוך לשותף',
            dashboard: 'לוח בקרה',
            signOut: 'התנתק',
            signIn: 'התחבר'
        },
    };

    const t = content[lang];

    // Mobile Menu Component - will be rendered via Portal
    const MobileMenu = () => {
        if (!isMobileMenuOpen) return null;

        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000000',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        height: '64px',
                        borderBottom: '1px solid #27272a',
                        flexShrink: 0,
                    }}
                >
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo size="lg" />
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            padding: '8px',
                            color: '#a1a1aa',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <X style={{ width: '24px', height: '24px' }} />
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px 20px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* User Profile */}
                        {user && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px',
                                backgroundColor: '#18181b',
                                borderRadius: '16px',
                                border: '1px solid #27272a',
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2563eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                }}>
                                    {user.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        color: 'white',
                                        fontWeight: 600,
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>{user.email}</p>
                                    <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>Logged in</p>
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
                            style={{
                                width: '100%',
                                padding: '16px',
                                backgroundColor: '#2563eb',
                                border: 'none',
                                borderRadius: '16px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
                            }}
                        >
                            {t.findTalent}
                        </button>

                        {/* Auth Actions */}
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '16px',
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '16px',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.dashboard}
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '16px',
                                        color: '#f87171',
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {t.signOut}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '16px',
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '16px',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.signIn}
                                </Link>
                                <Link
                                    href="/join"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '16px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '16px',
                                        color: '#a1a1aa',
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.becomeVendor}
                                </Link>
                            </>
                        )}

                        {/* Theme & Language Selector */}
                        <div style={{
                            marginTop: '24px',
                            paddingTop: '24px',
                            borderTop: '1px solid #27272a'
                        }}>
                            {/* Theme Toggle */}
                            <p style={{
                                color: '#71717a',
                                marginBottom: '16px',
                                textAlign: 'center',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold'
                            }}>Theme</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                                <button
                                    onClick={() => toggleTheme()}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: '1px solid #3b82f6',
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun style={{ width: '20px', height: '20px' }} />
                                            <span style={{ fontWeight: 600 }}>Light</span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon style={{ width: '20px', height: '20px' }} />
                                            <span style={{ fontWeight: 600 }}>Dark</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Language Selector */}
                            <p style={{
                                color: '#71717a',
                                marginBottom: '16px',
                                textAlign: 'center',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold'
                            }}>Language</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                {languages.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => {
                                            setLanguage(l.code);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 20px',
                                            borderRadius: '12px',
                                            border: language === l.code ? '1px solid #3b82f6' : '1px solid #27272a',
                                            backgroundColor: language === l.code ? 'rgba(59, 130, 246, 0.1)' : '#18181b',
                                            color: language === l.code ? '#60a5fa' : '#a1a1aa',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>{l.flag}</span>
                                        <span style={{ fontWeight: 600 }}>{l.label}</span>
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
                className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-200 ${
                    theme === 'dark'
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
                <div className="max-w-[1200px] mx-auto px-4 md:px-6">
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
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors"
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
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <span>{currentLang.flag}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-zinc-500 group-hover:text-white ${showLangDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showLangDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLangDropdown(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 py-1 bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl z-50">
                                            {languages.map((l) => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => {
                                                        setLanguage(l.code);
                                                        setShowLangDropdown(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/5 transition-colors ${language === l.code ? 'text-blue-500 font-semibold' : 'text-zinc-400'
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
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-zinc-800"
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
                                            <div className="absolute right-0 mt-2 w-48 py-1 bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl z-50">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    {t.dashboard}
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-start px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
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
                                    className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
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
