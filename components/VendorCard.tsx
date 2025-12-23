'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, MapPin } from 'lucide-react';
import { Vendor } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VendorCardProps {
    vendor: Vendor;
    index?: number;
}

export default function VendorCard({ vendor, index = 0 }: VendorCardProps) {
    const { convertPrice, t } = useLanguage();
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const isTopRated = vendor.rating >= 4.9;
    const isVerified = vendor.reviewsCount > 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
        >
            <Link href={`/vendor/${vendor.id}`} className="block group">
                <motion.article
                    className="card-interactive bg-white rounded-2xl overflow-hidden shadow-card"
                    whileHover={{
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.21, 0.47, 0.32, 0.98]
                    }}
                >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <motion.div
                            className="w-full h-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <Image
                                src={vendor.imageUrl}
                                alt={vendor.name}
                                fill
                                className={cn(
                                    "object-cover transition-opacity duration-500",
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                )}
                                sizes="(max-width: 768px) 100vw, 33vw"
                                quality={85}
                                priority={vendor.id === '1'}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </motion.div>

                        {/* Gradient Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                            {isTopRated && (
                                <motion.span
                                    className="badge-top-rated flex items-center gap-1"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Star className="w-3 h-3 fill-current" />
                                    TOP
                                </motion.span>
                            )}
                            {isVerified && (
                                <motion.span
                                    className="badge-verified"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    ✓ Verified
                                </motion.span>
                            )}
                        </div>

                        {/* Heart Button */}
                        <motion.button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsLiked(!isLiked);
                            }}
                            className={cn(
                                "absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200",
                                isLiked
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white/80 text-gray-600 hover:bg-white'
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Heart className={cn("w-4 h-4", isLiked && 'fill-current')} />
                        </motion.button>

                        {/* Category Badge - Bottom */}
                        <div className="absolute bottom-3 left-3">
                            <motion.span
                                className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {t(vendor.category)}
                            </motion.span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {vendor.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{t(vendor.city)}</span>
                            <span className="text-gray-300">•</span>
                            <span>{vendor.reviewsCount} {t('reviews')}</span>
                        </div>

                        {/* Footer Row */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            {/* Tags */}
                            <div className="flex gap-1.5 overflow-hidden">
                                {vendor.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md whitespace-nowrap"
                                    >
                                        {t(tag)}
                                    </span>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="price-tag px-3 py-1.5 text-sm">
                                {t('fromPrice')} {convertPrice(vendor.priceFrom)}
                            </div>
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
}
