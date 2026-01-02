'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, Zap } from 'lucide-react';

export default function Footer() {
    const { language } = useLanguage();
    const currentYear = new Date().getFullYear();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            terms: 'Terms',
            privacy: 'Privacy',
            partner: 'For Artists',
            made: 'Made with',
            in: 'Israel'
        },
        he: {
            terms: 'תנאים',
            privacy: 'פרטיות',
            partner: 'לאמנים',
            made: 'נוצר עם',
            in: 'ישראל'
        }
    };

    const t = content[lang] || content.en;

    return (
        <footer className="bg-slate-950 border-t border-white/5">
            <div className="max-w-xl mx-auto px-4 py-8">
                {/* Logo */}
                <div className="text-center mb-4">
                    <span className="text-xl font-bold text-white tracking-tight">
                        talent<span className="text-cyan-400">r</span>
                    </span>
                    <p className="text-white/30 text-xs mt-1 flex items-center justify-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        {lang === 'he' ? 'הזמנת אמנים בקליק' : 'Book artists in 1 click'}
                    </p>
                </div>

                {/* Links */}
                <nav className="flex items-center justify-center gap-6 mb-4">
                    <Link
                        href="/terms"
                        className="text-sm text-white/40 hover:text-white transition-colors py-1"
                    >
                        {t.terms}
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-sm text-white/40 hover:text-white transition-colors py-1"
                    >
                        {t.privacy}
                    </Link>
                    <Link
                        href="/join"
                        className="text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors py-1 font-medium"
                    >
                        {t.partner}
                    </Link>
                </nav>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-[11px] text-white/20 flex items-center justify-center gap-1">
                        © {currentYear} Talentr · {t.made} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t.in}
                    </p>
                </div>
            </div>
        </footer>
    );
}
