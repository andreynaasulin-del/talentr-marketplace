'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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
        <footer className="bg-slate-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    {/* Logo & Tagline */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-slate-900 font-black text-sm">T</span>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Talentr
                            </span>
                        </div>
                        <p className="text-white/40 text-sm max-w-xs">
                            {t.tagline}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-6 md:gap-8">
                        <Link href="#packages" className="text-sm text-white/60 hover:text-white transition-colors">
                            {t.findTalent}
                        </Link>
                        <Link href="/join" className="text-sm text-white/60 hover:text-white transition-colors">
                            {t.forVendors}
                        </Link>
                        <Link href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">
                            {t.terms}
                        </Link>
                        <Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
                            {t.privacy}
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-white/30 text-xs">
                        © {currentYear} Talentr. {t.rights}
                    </p>
                </div>
            </div>
        </footer>
    );
}
