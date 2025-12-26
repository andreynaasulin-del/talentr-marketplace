'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VendorCard from '@/components/VendorCard';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { getVendorById } from '@/lib/vendors';
import { Vendor } from '@/types';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
    const { language } = useLanguage();
    const { favorites, isLoading: favoritesLoading } = useFavorites();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    // Load vendor details for favorites
    useEffect(() => {
        const loadVendors = async () => {
            if (favoritesLoading) return;

            setLoading(true);
            const vendorPromises = favorites.map(id => getVendorById(id));
            const results = await Promise.all(vendorPromises);
            setVendors(results.filter((v): v is Vendor => v !== null));
            setLoading(false);
        };

        loadVendors();
    }, [favorites, favoritesLoading]);

    const t = {
        title: language === 'ru' ? 'Избранное' : language === 'he' ? 'מועדפים' : 'Favorites',
        subtitle: language === 'ru'
            ? 'Сохранённые профессионалы для ваших мероприятий'
            : language === 'he'
                ? 'אנשי מקצוע שמורים לאירועים שלך'
                : 'Your saved professionals for upcoming events',
        empty: language === 'ru'
            ? 'У вас пока нет избранных'
            : language === 'he'
                ? 'עדיין אין לך מועדפים'
                : 'No favorites yet',
        emptyDesc: language === 'ru'
            ? 'Нажимайте ❤️ на карточках профессионалов, чтобы сохранить их здесь'
            : language === 'he'
                ? 'לחץ על ❤️ בכרטיסי אנשי מקצוע כדי לשמור אותם כאן'
                : 'Tap the ❤️ on vendor cards to save them here',
        browse: language === 'ru' ? 'Найти профессионалов' : language === 'he' ? 'מצא אנשי מקצוע' : 'Browse Professionals',
        count: language === 'ru' ? 'сохранено' : language === 'he' ? 'שמורים' : 'saved',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'ru' ? 'На главную' : language === 'he' ? 'לדף הבית' : 'Back to Home'}
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            <Heart className="w-8 h-8 text-white fill-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
                            <p className="text-gray-500">{t.subtitle}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    {vendors.length > 0 && (
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-2xl font-bold text-gray-900">{vendors.length}</span>
                            <span className="text-gray-500">{t.count}</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {loading || favoritesLoading ? (
                        <motion.div
                            key="loading"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-t-2xl" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : vendors.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="flex flex-col items-center justify-center py-20 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <motion.div
                                className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <Heart className="w-12 h-12 text-gray-300" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.empty}</h2>
                            <p className="text-gray-500 max-w-md mb-8">{t.emptyDesc}</p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <Search className="w-5 h-5" />
                                    {t.browse}
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="vendors"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {vendors.map((vendor, index) => (
                                <VendorCard key={vendor.id} vendor={vendor} index={index} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
