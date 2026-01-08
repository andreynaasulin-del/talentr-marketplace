'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';

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

    return (
        <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden">
            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Subtle gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Logo & Tagline */}
                    <div className="flex items-center gap-4">
                        <Logo size="md" />
                        <p className="text-white/40 text-xs font-medium">
                            {t.tagline}
                        </p>
                    </div>

                    {/* Links - Compact */}
                    <div className="flex flex-wrap gap-1">
                        {[
                            { href: '#packages', label: t.findTalent },
                            { href: '/join', label: t.forVendors },
                            { href: '/terms', label: t.terms },
                            { href: '/privacy', label: t.privacy },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-xs font-medium text-white/60 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-white/30 text-xs font-medium">
                        © {currentYear} Talentr. {t.rights}
                    </p>
                </div>
            </div>
        </footer>
    );
}
