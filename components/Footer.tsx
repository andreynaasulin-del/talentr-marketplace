'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Instagram, Twitter, Facebook, Globe, Apple, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Footer() {
    const { t, language } = useLanguage();

    const sections = [
        {
            title: { en: 'Categories', ru: 'Категории', he: 'קטגוריות' },
            links: [
                { label: { en: 'Photographers', ru: 'Фотографы', he: 'צלמים' }, href: '#' },
                { label: { en: 'DJs', ru: 'Диджеи', he: "דיג'יי" }, href: '#' },
                { label: { en: 'Singers', ru: 'Певцы', he: 'זמרים' }, href: '#' },
                { label: { en: 'Magicians', ru: 'Фокусники', he: 'קוסמים' }, href: '#' },
            ]
        },
        {
            title: { en: 'Support', ru: 'Поддержка', he: 'תמיכה' },
            links: [
                { label: { en: 'Contact Support', ru: 'Связаться с поддержкой', he: 'צור קשר' }, href: 'mailto:support@talentr.app' },
                { label: { en: 'Join as Vendor', ru: 'Стать исполнителем', he: 'הצטרף כספק' }, href: '/join' },
                { label: { en: 'Terms of Service', ru: 'Условия использования', he: 'תנאי שימוש' }, href: '/terms' },
                { label: { en: 'Privacy Policy', ru: 'Политика конфиденциальности', he: 'מדיניות פרטיות' }, href: '/privacy' },
            ]
        },
        {
            title: { en: 'Talentr', ru: 'Talentr', he: 'Talentr' },
            links: [
                { label: { en: 'About Us', ru: 'О нас', he: 'עלינו' }, href: '#' },
                { label: { en: 'Become a Partner', ru: 'Стать партнером', he: 'הפוך לשותף' }, href: '#' },
                { label: { en: 'Blog', ru: 'Блог', he: 'בלוג' }, href: '#' },
                { label: { en: 'Newsroom', ru: 'Пресс-центр', he: 'חדשות' }, href: '#' },
            ]
        }
    ];

    return (
        <motion.footer
            className="bg-gray-900 dark:bg-slate-950 pt-20 pb-10 text-white rounded-t-[40px] md:rounded-t-[60px] overflow-hidden relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Brand Section */}
                    <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
                        <div>
                            <div className="text-3xl font-black mb-4 select-none" dir="ltr">
                                talent<span className="text-blue-500">r</span>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                                {language === 'ru'
                                    ? 'Крупнейший в Израиле маркетплейс для поиска специалистов на мероприятия.'
                                    : language === 'he'
                                        ? 'המרקטפלייס הגדול בישראל לחיבור בין אירועים לאנשי מקצוע.'
                                        : 'Israel\'s premier marketplace for connecting events with world-class talent.'}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                        "bg-white/5 border border-white/5 hover:bg-white/10"
                                    )}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="w-6 h-6 text-gray-400" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Sections */}
                    {sections.map((section) => (
                        <motion.div key={section.title.en} variants={itemVariants}>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-white">
                                {section.title[language] || section.title.en}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label.en}>
                                        <motion.a
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors font-bold text-base inline-block"
                                            whileHover={{ x: 4 }}
                                        >
                                            {link.label[language] || link.label.en}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                {/* App Download / Market Links */}
                <motion.div
                    className="border-t border-white/5 pt-12 mt-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <motion.button
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-2xl font-black",
                                "bg-white text-black"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Apple className="w-6 h-6" />
                            <div className="text-left leading-none">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Download on the</p>
                                <p className="text-lg">App Store</p>
                            </div>
                        </motion.button>
                        <motion.button
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-2xl font-black",
                                "bg-white text-black"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <PlayCircle className="w-6 h-6" />
                            <div className="text-left leading-none">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Get it on</p>
                                <p className="text-lg">Google Play</p>
                            </div>
                        </motion.button>
                    </div>

                    <div className="flex items-center gap-8">
                        <motion.div
                            className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-gray-400 font-bold group"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="uppercase text-sm tracking-widest">{language === 'en' ? 'English' : language === 'ru' ? 'Русский' : 'עברית'}</span>
                        </motion.div>
                        <div className="w-px h-8 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-4 text-gray-400 font-black text-sm tracking-widest uppercase">
                            IL / ILS / ₪
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-gray-500 font-bold text-sm">
                        © 2024 Talentr Israel. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6 text-gray-500 font-bold text-sm">
                        {['Safety', 'Transparency', 'Accessibility'].map((item) => (
                            <motion.a
                                key={item}
                                href="#"
                                className="hover:text-white transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
