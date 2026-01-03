'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage } = useLanguage();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isDashboard = pathname?.startsWith('/dashboard');
    const solidNav = !isHome || isScrolled;
    
    // Scroll-based opacity for navbar background
    const { scrollY } = useScroll();
    const navBgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        // On non-home pages we want solid navbar immediately (no white-on-light)
        if (!isHome) {
            setIsScrolled(true);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

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
        <>
            {/* Navbar */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Glass background layer */}
                <motion.div 
                    className={cn(
                        "absolute inset-0 backdrop-blur-xl border-b",
                        isDashboard
                            ? "bg-[#05070A]/72 border-white/10"
                            : "bg-white/80 dark:bg-slate-900/80 border-gray-100/50 dark:border-slate-800/50"
                    )}
                    style={{ opacity: isHome ? navBgOpacity : 1 }}
                />
                
                {/* Animated gradient line at bottom */}
                <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{
                        background: isDashboard
                            ? 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.45), transparent)'
                            : 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
                        opacity: solidNav ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo with hover effect */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Logo size="lg" />
                        </motion.div>

                        {/* Right: CTAs + Lang */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Language Switcher - Glass Style */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                                        solidNav
                                            ? (isDashboard
                                                ? "text-white/80 hover:bg-white/10"
                                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800")
                                            : "text-white/90 hover:bg-white/10 backdrop-blur-sm"
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-base">{currentLang.flag}</span>
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-300",
                                        showLangDropdown && 'rotate-180'
                                    )} />
                                </motion.button>

                                <AnimatePresence>
                                    {showLangDropdown && (
                                        <>
                                            <motion.div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowLangDropdown(false)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                            <motion.div
                                                className="absolute end-0 mt-2 w-32 py-2 z-50 overflow-hidden"
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                {/* Glass dropdown background */}
                                                <div
                                                    className={cn(
                                                        "absolute inset-0 backdrop-blur-xl rounded-xl border shadow-xl",
                                                        isDashboard
                                                            ? "bg-[#05070A]/90 border-white/10"
                                                            : "bg-white/90 dark:bg-slate-900/90 border-gray-100 dark:border-slate-800"
                                                    )}
                                                />
                                                
                                                <div className="relative">
                                                    {languages.map((l, index) => (
                                                        <motion.button
                                                            key={l.code}
                                                            onClick={() => {
                                                                setLanguage(l.code);
                                                                setShowLangDropdown(false);
                                                            }}
                                                            className={cn(
                                                                "w-full px-4 py-2.5 text-start flex items-center gap-3 transition-colors",
                                                                isDashboard ? "hover:bg-white/5" : "hover:bg-cyan-500/10",
                                                                language === l.code
                                                                    ? (isDashboard
                                                                        ? 'text-[#D4AF37] font-semibold'
                                                                        : 'text-cyan-600 dark:text-cyan-400 font-semibold')
                                                                    : (isDashboard
                                                                        ? 'text-white/75'
                                                                        : 'text-slate-600 dark:text-slate-300')
                                                            )}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            <span className="text-lg">{l.flag}</span>
                                                            <span className="text-sm">{l.label}</span>
                                                            {language === l.code && (
                                                                <motion.div 
                                                                    className={cn(
                                                                        "ml-auto w-1.5 h-1.5 rounded-full",
                                                                        isDashboard ? "bg-[#D4AF37]" : "bg-cyan-500"
                                                                    )}
                                                                    layoutId="activeLang"
                                                                />
                                                            )}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Secondary CTA: Become a Vendor */}
                            <motion.div
                                className="hidden md:block"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/join"
                                    className={cn(
                                        "px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300",
                                        solidNav
                                            ? (isDashboard
                                                ? "text-white/70 hover:text-white hover:bg-white/10"
                                                : "text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-cyan-900/20")
                                            : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                                    )}
                                >
                                    {t.becomeVendor}
                                </Link>
                            </motion.div>

                            {/* Primary CTA: Find Talent */}
                            <Link
                                href={isHome ? "#packages" : "/#packages"}
                                className="px-5 py-2.5 md:px-6 md:py-3 bg-[#0a1628] text-white text-sm font-bold rounded-xl hover:bg-[#0f2340] transition-colors"
                            >
                                {t.findTalent}
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.nav>
        </>
    );
}
