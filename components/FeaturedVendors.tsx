'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Trophy, Flame, Loader2 } from 'lucide-react';
import VendorCard from './VendorCard';
import { getFeaturedVendors } from '@/lib/vendors';
import { Vendor } from '@/types';
import { motion } from 'framer-motion';

export default function FeaturedVendors() {
    const { t, language } = useLanguage();
    const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await getFeaturedVendors(4);
                setFeaturedVendors(data);
            } catch (error) {
                console.error('Error fetching featured vendors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const sectionTitle = {
        en: 'Featured Professionals',
        ru: 'Рекомендованные специалисты',
        he: 'אנשי מקצוע מומלצים'
    };

    const sectionSubtitle = {
        en: 'Hand-picked world-class talent for your special day.',
        ru: 'Отобранные вручную мастера своего дела для вашего праздника.',
        he: 'אנשי מקצוע מהשורה הראשונה שנבחרו במיוחד עבור היום המיוחד שלך.'
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
                    <motion.div 
                        className="max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <motion.div 
                                className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Trophy className="w-6 h-6 text-blue-600" />
                            </motion.div>
                            <span className="text-blue-600 font-black uppercase tracking-widest text-sm">
                                {language === 'ru' ? 'ТОП РЕЙТИНГ' : language === 'he' ? 'דירוג שיא' : 'TOP RATED'}
                            </span>
                        </div>
                        <motion.h2 
                            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            {sectionTitle[language] || sectionTitle.en}
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {sectionSubtitle[language] || sectionSubtitle.en}
                        </motion.p>
                    </motion.div>

                    <motion.button
                        className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all group"
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <span className="text-lg">
                            {language === 'ru' ? 'Смотреть всех' : language === 'he' ? 'ראה את כולם' : 'View all professionals'}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : featuredVendors.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                    >
                        {featuredVendors.map((vendor: Vendor, index: number) => (
                            <VendorCard key={vendor.id} vendor={vendor} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        {language === 'ru' ? 'Специалисты не найдены' : language === 'he' ? 'לא נמצאו מקצוענים' : 'No featured professionals found'}
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className="mt-12 md:hidden">
                    <motion.button
                        className="w-full bg-gray-50 text-gray-900 py-5 rounded-[24px] font-black text-lg border border-gray-100 flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {language === 'ru' ? 'Смотреть всех' : language === 'he' ? 'ראה את כולם' : 'View all'}
                        <Flame className="w-5 h-5 text-orange-500" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
}

