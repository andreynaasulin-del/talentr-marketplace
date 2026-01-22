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
        title: language === 'he' ? 'מועדפים' : 'Favorites',
        subtitle: language === 'he'
            ? 'אנשי מקצוע שמורים לאירועים שלך'
            : 'Your saved professionals for upcoming events',
        empty: language === 'he'
            ? 'עדיין אין לך מועדפים'
            : 'No favorites yet',
        emptyDesc: language === 'he'
            ? 'לחץ על ❤️ בכרטיסי אנשי מקצוע כדי לשמור אותם כאן'
            : 'Tap the ❤️ on vendor cards to save them here',
        browse: language === 'he' ? 'מצא אנשי מקצוע' : 'Browse Professionals',
        count: language === 'he' ? 'שמורים' : 'saved',
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
                {/* Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'he' ? 'לדף הבית' : 'Back to Home'}
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            <Heart className="w-8 h-8 text-white fill-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">{t.title}</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    {vendors.length > 0 && (
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{vendors.length}</span>
                            <span className="text-zinc-500 dark:text-zinc-400">{t.count}</span>
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
                                <div key={i} className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl h-80 animate-pulse border border-zinc-200 dark:border-zinc-800">
                                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-t-2xl" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
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
                                className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800"
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
                                <Heart className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.empty}</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">{t.emptyDesc}</p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
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
