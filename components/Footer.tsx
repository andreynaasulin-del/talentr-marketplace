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
        <footer className="relative bg-black border-t border-white/10">

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
                                className="px-3 py-2 text-xs font-medium text-white/60 hover:text-[#0066FF] transition-colors"
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
