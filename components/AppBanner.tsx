'use client';

import { motion } from 'framer-motion';
import { Smartphone, Apple, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AppBanner() {
    const { language } = useLanguage();

    const content = {
        en: { badge: 'Coming Soon', title: 'Get the Talentr App', subtitle: 'Book professionals on the go. Download our app for iOS and Android.', cta: 'Get Early Access' },
        ru: { badge: 'Скоро', title: 'Скачайте приложение Talentr', subtitle: 'Бронируйте специалистов на ходу. Скоро на iOS и Android.', cta: 'Получить ранний доступ' },
        he: { badge: 'בקרוב', title: 'הורידו את אפליקציית Talentr', subtitle: 'הזמינו אנשי מקצוע בדרכים. בקרוב ל-iOS ו-Android.', cta: 'קבלו גישה מוקדמת' }
    };

    const t = content[language as keyof typeof content];

    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <motion.div animate={{ x: [0, -30, 0], y: [0, 50, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold mb-4">
                            <Smartphone className="w-4 h-4" />
                            {t.badge}
                        </motion.span>
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-black text-white mb-3">{t.title}</motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/80 text-lg max-w-md">{t.subtitle}</motion.p>
                    </div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-shadow">
                            <Apple className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs opacity-70">Download on</div>
                                <div className="text-sm font-black">App Store</div>
                            </div>
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-bold hover:bg-white/20 transition-colors">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" /></svg>
                            <div className="text-left">
                                <div className="text-xs opacity-70">Get it on</div>
                                <div className="text-sm font-black">Google Play</div>
                            </div>
                        </motion.button>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto md:mx-0">
                    <input type="email" placeholder={language === 'ru' ? 'Ваш email' : language === 'he' ? 'האימייל שלך' : 'Your email'} className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors" />
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-shadow">
                        {t.cta}
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
