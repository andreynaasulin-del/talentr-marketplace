'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function Footer() {
    const { language } = useLanguage();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    {/* Logo */}
                    <div className="text-2xl font-black" dir="ltr">
                        talent<span className="text-blue-500">r</span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <Globe className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            {language === 'en' ? 'English' : language === 'ru' ? 'Русский' : 'עברית'}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800 mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <p className="text-sm text-gray-500">
                        © Talentr {currentYear}
                    </p>

                    {/* Links */}
                    <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        <Link
                            href="/terms"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {language === 'ru' ? 'Условия' : language === 'he' ? 'תנאים' : 'Terms'}
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {language === 'ru' ? 'Конфиденциальность' : language === 'he' ? 'פרטיות' : 'Privacy'}
                        </Link>
                        <Link
                            href="/join"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {language === 'ru' ? 'Стать партнёром' : language === 'he' ? 'הצטרף אלינו' : 'Become a Partner'}
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
