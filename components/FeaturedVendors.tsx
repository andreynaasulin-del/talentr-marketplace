'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Star, Verified } from 'lucide-react';
import VendorCard from './VendorCard';
import { getFeaturedVendors } from '@/lib/vendors';
import { Vendor } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Skeleton loader for cards
const VendorCardSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
        <div className="aspect-[4/3] bg-gray-100" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
    </div>
);

export default function FeaturedVendors() {
    const { language } = useLanguage();
    const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    const lang = language as 'en' | 'ru' | 'he';

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

    const content = {
        en: {
            title: 'Featured Professionals',
            subtitle: 'Hand-picked talent for your special events',
            viewAll: 'View all',
            noVendors: 'No professionals found',
        },
        ru: {
            title: 'Рекомендуемые специалисты',
            subtitle: 'Лучшие профессионалы для ваших мероприятий',
            viewAll: 'Смотреть всех',
            noVendors: 'Специалисты не найдены',
        },
        he: {
            title: 'אנשי מקצוע מומלצים',
            subtitle: 'הטובים ביותר לאירועים שלכם',
            viewAll: 'ראה הכל',
            noVendors: 'לא נמצאו מקצוענים',
        }
    };

    const t = content[lang] || content.en;

    return (
        <section id="featured-vendors" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Verified className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                {lang === 'ru' ? 'Проверенные' : lang === 'he' ? 'מאומתים' : 'Verified'}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {t.title}
                        </h2>
                        <p className="text-gray-500">
                            {t.subtitle}
                        </p>
                    </div>

                    <Link href="/vendors" className="hidden md:block">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors">
                            {t.viewAll}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* Vendors Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <VendorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : featuredVendors.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {featuredVendors.map((vendor: Vendor, index: number) => (
                            <motion.div
                                key={vendor.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <VendorCard vendor={vendor} index={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        {t.noVendors}
                    </div>
                )}

                {/* Mobile View All */}
                <div className="mt-8 md:hidden">
                    <Link href="/vendors" className="block">
                        <button className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2">
                            {t.viewAll}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
