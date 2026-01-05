'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, Filter, SlidersHorizontal } from 'lucide-react';
import VendorCard from './VendorCard';
import { getVendors, getVendorsByCategory } from '@/lib/vendors';
import { Vendor, VendorCategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VendorGridProps {
    category?: string;
}

export default function VendorGrid({ category = 'All' }: VendorGridProps) {
    const { language } = useLanguage();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const data = category === 'All'
                    ? await getVendors()
                    : await getVendorsByCategory(category as VendorCategory);
                setVendors(data);
            } catch (error) {
                console.error('Error fetching vendors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, [category]);

    const sectionTitle = {
        en: category === 'All' ? 'All Professionals' : `${category}s`,
        he: category === 'All' ? 'כל אנשי המקצוע' : category
    };

    return (
        <section className="py-16 bg-gray-50/50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <motion.h2
                        className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white"
                        key={category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {sectionTitle[language] || sectionTitle.en}
                        <span className="ml-3 text-gray-400 font-medium text-lg">
                            ({vendors.length})
                        </span>
                    </motion.h2>

                    <motion.button
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl",
                            "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700",
                            "text-gray-600 dark:text-gray-300 font-medium text-sm",
                            "hover:border-blue-300 hover:text-blue-600 transition-all"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        {language === 'he' ? 'מסננים' : 'Filters'}
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : vendors.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {vendors.map((vendor: Vendor, index: number) => (
                                <motion.div
                                    key={vendor.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05
                                    }}
                                >
                                    <VendorCard vendor={vendor} index={index} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <Filter className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            {language === 'he'
                                ? 'לא נמצאו מקצוענים בקטגוריה זו'
                                : 'No professionals found in this category'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
