'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

export default function Footer() {
    const { language } = useLanguage();
    const currentYear = new Date().getFullYear();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            tagline: 'Find your perfect event professional',
            terms: 'Terms',
            privacy: 'Privacy',
            partner: 'For Vendors',
            about: 'About',
            made: 'Made with',
            in: 'in Israel'
        },
        he: {
            tagline: 'מצא את איש המקצוע המושלם',
            terms: 'תנאים',
            privacy: 'פרטיות',
            partner: 'לספקים',
            about: 'אודות',
            made: 'נוצר עם',
            in: 'בישראל'
        }
    };

    const t = content[lang] || content.en;

    const footerLinks = [
        { href: '/terms', label: t.terms },
        { href: '/privacy', label: t.privacy },
        { href: '/join', label: t.partner },
    ];

    return (
        <footer className="bg-gray-950 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-12">
                    {/* Logo & Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="mb-2">
                            <Logo size="lg" />
                        </div>
                        <p className="text-gray-400 text-sm md:text-base max-w-xs">
                            {t.tagline}
                        </p>
                    </motion.div>

                    {/* Language Display */}
                    <motion.div
                        className="flex items-center gap-2 text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Globe className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm font-medium">
                            {lang === 'en' ? 'English' : 'עברית'}
                        </span>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800 mb-6 md:mb-8" />

                {/* Bottom Section - Mobile Optimized */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-6">
                    {/* Copyright & Made With */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                        <p className="text-xs md:text-sm text-gray-500">
                            © {currentYear} Talentr
                        </p>
                        <span className="hidden sm:inline text-gray-700">•</span>
                        <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                            {t.made} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t.in}
                        </p>
                    </div>

                    {/* Links - Mobile Horizontal Scroll */}
                    <nav className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide w-full md:w-auto justify-center md:justify-end pb-1 md:pb-0">
                        {footerLinks.map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 5 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap",
                                        "py-1 border-b border-transparent hover:border-gray-600"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        </footer>
    );
}
