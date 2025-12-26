'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, MapPin, Zap, Shield, Crown } from 'lucide-react';
import { Vendor } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useState, memo, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VendorCardProps {
    vendor: Vendor;
    index?: number;
}

function VendorCard({ vendor, index = 0 }: VendorCardProps) {
    const { convertPrice, t, language } = useLanguage();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const isLiked = isFavorite(vendor.id);
    const isTopRated = vendor.rating >= 4.9;
    const isVerified = vendor.reviewsCount > 100;
    const isPremium = vendor.rating >= 4.8 && vendor.reviewsCount > 50;

    // 3D Tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    // Shine effect position
    const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / rect.width);
        y.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            style={{ perspective: 1000 }}
        >
            <Link href={`/vendor/${vendor.id}`} className="block group">
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                >
                    <motion.article
                        className={cn(
                            "relative overflow-hidden rounded-3xl",
                            "bg-white dark:bg-slate-800/90",
                            "border border-gray-100/50 dark:border-slate-700/50",
                            "shadow-xl shadow-gray-200/50 dark:shadow-slate-900/50",
                            "backdrop-blur-sm",
                            "transition-shadow duration-500",
                            "group-hover:shadow-2xl group-hover:shadow-blue-500/10"
                        )}
                    >
                        {/* Shine Overlay */}
                        <motion.div
                            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                            }}
                        />

                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-[-1px] rounded-3xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20" />
                        </div>

                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800">
                            <motion.div
                                className="w-full h-full"
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                            >
                                <Image
                                    src={vendor.imageUrl}
                                    alt={vendor.name}
                                    fill
                                    className={cn(
                                        "object-cover transition-all duration-700",
                                        imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    )}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    quality={85}
                                    loading={index < 3 ? 'eager' : 'lazy'}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDBAUGABESIQcxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Aqc14TxfO7Zcau03C4SRUEUU0yNTqpXkkKCWBJG5J7+anF+xaCaknx3JqWpS3Mhp1eCJkdWVCQQf0EH7pH0Njb//Z"
                                    onLoad={() => setImageLoaded(true)}
                                />
                            </motion.div>

                            {/* Glass Overlay - appears on hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                                initial={{ opacity: 0.3 }}
                                whileHover={{ opacity: 0.7 }}
                                transition={{ duration: 0.4 }}
                            />

                            {/* Top Row - Premium Badges */}
                            <div className="absolute top-3 start-3 flex items-center gap-2 z-20">
                                {isPremium && (
                                    <motion.div
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, type: 'spring' }}
                                    >
                                        <Crown className="w-3.5 h-3.5 text-white" />
                                        <span className="text-xs font-bold text-white">
                                            {language === 'ru' ? 'Топ' : language === 'he' ? 'מוביל' : 'Top'}
                                        </span>
                                    </motion.div>
                                )}
                                {isVerified && (
                                    <motion.div
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="text-xs font-semibold text-gray-800">
                                            {language === 'ru' ? 'Проверен' : language === 'he' ? 'מאומת' : 'Verified'}
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Heart Button - Glass */}
                            <motion.button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(vendor.id, vendor.name);
                                }}
                                className={cn(
                                    "absolute top-3 end-3 z-20",
                                    "w-10 h-10 rounded-full",
                                    "flex items-center justify-center",
                                    "backdrop-blur-xl transition-all duration-300",
                                    isLiked
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                                )}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Heart className={cn("w-5 h-5 transition-transform", isLiked && 'fill-current scale-110')} />
                            </motion.button>

                            {/* WhatsApp removed - users must go to vendor page first */}

                            {/* Fast Reply Badge */}
                            {vendor.reviewsCount > 50 && (
                                <motion.div
                                    className="absolute bottom-3 end-3 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/90 backdrop-blur-md rounded-full shadow-lg z-20"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Zap className="w-3.5 h-3.5 fill-current text-white" />
                                    <span className="text-xs font-bold text-white">{t('Fast reply')}</span>
                                </motion.div>
                            )}

                            {/* Category - Glass Pill */}
                            <div className="absolute bottom-3 start-3 z-20">
                                <motion.span
                                    className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-sm font-semibold text-gray-900 shadow-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {t(vendor.category)}
                                </motion.span>
                            </div>
                        </div>

                        {/* Content - Glass Card */}
                        <div className="relative p-5 bg-gradient-to-b from-white to-gray-50/80 dark:from-slate-800 dark:to-slate-900/80">
                            {/* Name & Rating Row */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                                    {vendor.name}
                                </h3>

                                {/* Premium Rating Badge */}
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <span className="font-bold text-amber-700 dark:text-amber-400">
                                        {vendor.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Location & Reviews */}
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{t(vendor.city)}</span>
                                </div>
                                <span className="text-gray-300 dark:text-slate-600">•</span>
                                <span>{vendor.reviewsCount} {t('reviews')}</span>
                            </div>

                            {/* Footer - Price Section */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                {/* Tags */}
                                <div className="flex gap-2 overflow-hidden">
                                    {vendor.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg whitespace-nowrap font-medium"
                                        >
                                            {t(tag)}
                                        </span>
                                    ))}
                                </div>

                                {/* Premium Price Tag */}
                                <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold text-sm">
                                    {t('fromPrice')} {convertPrice(vendor.priceFrom)}
                                </div>
                            </div>
                        </div>
                    </motion.article>
                </motion.div>
            </Link>
        </motion.div>
    );
}

export default memo(VendorCard);
