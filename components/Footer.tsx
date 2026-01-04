'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

export default function Footer() {
    const { language } = useLanguage();
    const currentYear = new Date().getFullYear();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            tagline: 'The highest standard of entertainment.',
            findTalent: 'Find Talent',
            forVendors: 'For Vendors',
            terms: 'Terms',
            privacy: 'Privacy',
            rights: 'All rights reserved.',
        },
        he: {
            tagline: 'הסטנדרט הגבוה ביותר של בידור.',
            findTalent: 'מצא כישרון',
            forVendors: 'לספקים',
            terms: 'תנאים',
            privacy: 'פרטיות',
            rights: 'כל הזכויות שמורות.',
        },
    };

    const t = content[lang];

    const linkVariants = {
        initial: { x: 0 },
        hover: { x: 4 },
    };

    return (
        <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden">
            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    {/* Logo & Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-3">
                            <Logo size="lg" />
                        </div>
                        <p className="text-white/40 text-sm max-w-xs font-medium">
                            {t.tagline}
                        </p>
                    </motion.div>

                    {/* Links - Bigger hit areas */}
                    <motion.div
                        className="flex flex-wrap gap-2 md:gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {[
                            { href: '#packages', label: t.findTalent },
                            { href: '/join', label: t.forVendors },
                            { href: '/terms', label: t.terms },
                            { href: '/privacy', label: t.privacy },
                        ].map((link, i) => (
                            <motion.div
                                key={link.href}
                                variants={linkVariants}
                                initial="initial"
                                whileHover="hover"
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                                <Link
                                    href={link.href}
                                    className="block px-4 py-2.5 text-sm font-medium text-white/60 hover:text-cyan-400 transition-colors rounded-xl hover:bg-white/5"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Copyright */}
                <motion.div
                    className="mt-12 pt-8 border-t border-white/5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <p className="text-white/30 text-xs font-medium tracking-wide">
                        © {currentYear} Talentr. {t.rights}
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
