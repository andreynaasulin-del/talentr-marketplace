'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            findTalent: 'Find Talent',
            becomeVendor: 'Become a Vendor',
        },
        he: {
            findTalent: 'מצא כישרון',
            becomeVendor: 'הפוך לספק',
        },
    };

    const t = content[lang];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo - Minimalist */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">T</span>
                        </div>
                        <span className={cn(
                            "text-xl font-bold tracking-tight transition-colors",
                            isScrolled ? "text-slate-900" : "text-white"
                        )}>
                            Talentr
                        </span>
                    </Link>

                    {/* Right: CTAs + Lang */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Language Switcher - Compact */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className={cn(
                                    "flex items-center gap-1 px-2 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                    isScrolled 
                                        ? "text-slate-600 hover:bg-slate-100" 
                                        : "text-white/80 hover:bg-white/10"
                                )}
                            >
                                <span>{currentLang.flag}</span>
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
                                            className="absolute end-0 mt-2 w-28 py-1 z-50 bg-white rounded-xl shadow-xl border border-gray-100"
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {languages.map((l) => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => {
                                                        setLanguage(l.code);
                                                        setShowLangDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full px-3 py-2 text-start flex items-center gap-2 transition-colors hover:bg-slate-50",
                                                        language === l.code ? 'text-slate-900 font-semibold' : 'text-slate-600'
                                                    )}
                                                >
                                                    <span>{l.flag}</span>
                                                    <span className="text-sm">{l.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Secondary CTA: Become a Vendor */}
                        <Link
                            href="/join"
                            className={cn(
                                "hidden md:block px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                                isScrolled 
                                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" 
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {t.becomeVendor}
                        </Link>

                        {/* Primary CTA: Find Talent */}
                        <Link
                            href="#packages"
                            className="px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            {t.findTalent}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
