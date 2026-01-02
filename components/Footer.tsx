'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Heart } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
    const { language } = useLanguage();
    const currentYear = new Date().getFullYear();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            terms: 'Terms',
            privacy: 'Privacy',
            partner: 'For Vendors',
            made: 'Made with',
            in: 'Israel'
        },
        he: {
            terms: 'תנאים',
            privacy: 'פרטיות',
            partner: 'לספקים',
            made: 'נוצר עם',
            in: 'ישראל'
        }
    };

    const t = content[lang] || content.en;

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
            <div className="max-w-xl mx-auto px-4 py-6">
                {/* Logo */}
                <div className="text-center mb-4">
                    <Logo size="md" />
                </div>

                {/* Links - horizontal, thumb-friendly */}
                <nav className="flex items-center justify-center gap-6 mb-4">
                    <Link
                        href="/terms"
                        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-1"
                    >
                        {t.terms}
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-1"
                    >
                        {t.privacy}
                    </Link>
                    <Link
                        href="/join"
                        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-1"
                    >
                        {t.partner}
                    </Link>
                </nav>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        © {currentYear} Talentr · {t.made} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t.in}
                    </p>
                </div>
            </div>
        </footer>
    );
}
