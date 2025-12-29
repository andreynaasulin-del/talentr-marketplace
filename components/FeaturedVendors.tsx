'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Trophy, ArrowRight, Star, Sparkles, Crown, Verified } from 'lucide-react';
import VendorCard from './VendorCard';
import { getFeaturedVendors } from '@/lib/vendors';
import { Vendor } from '@/types';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Animated gradient orb for background
const GradientOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <motion.div
        className={cn("absolute rounded-full blur-3xl", className)}
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    />
);

// Skeleton loader for cards
const VendorCardSkeleton = () => (
    <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded-full w-3/4" />
            <div className="h-4 bg-gray-100 rounded-full w-1/2" />
            <div className="flex gap-2">
                <div className="h-6 bg-gray-100 rounded-full w-16" />
                <div className="h-6 bg-gray-100 rounded-full w-20" />
            </div>
        </div>
    </div>
);

// Stats pill component - Mobile optimized
const StatsPill = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => (
    <motion.div
        className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-100 shadow-sm"
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
        <span className="font-bold text-gray-900 text-xs md:text-sm">{value}</span>
        <span className="text-gray-500 text-[10px] md:text-sm hidden sm:inline">{label}</span>
    </motion.div>
);

export default function FeaturedVendors() {
    const { language } = useLanguage();
    const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Check mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse tracking for parallax - only on desktop
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { stiffness: 50, damping: 20 };
    const parallaxX = useSpring(useTransform(mouseX, [-500, 500], [-10, 10]), springConfig);
    const parallaxY = useSpring(useTransform(mouseY, [-500, 500], [-10, 10]), springConfig);

    useEffect(() => {
        if (isMobile) return;
        const handleMouseMove = (e: MouseEvent) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

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
            badge: 'TOP RATED',
            title: 'Featured Professionals',
            subtitle: 'Hand-picked world-class talent for your special day.',
            viewAll: 'View all professionals',
            noVendors: 'No featured professionals found',
            stats: { vendors: 'verified', rating: 'avg rating', events: 'events done' }
        },
        ru: {
            badge: 'ТОП РЕЙТИНГ',
            title: 'Рекомендованные специалисты',
            subtitle: 'Отобранные вручную мастера своего дела для вашего праздника.',
            viewAll: 'Смотреть всех',
            noVendors: 'Специалисты не найдены',
            stats: { vendors: 'проверено', rating: 'средний рейтинг', events: 'мероприятий' }
        },
        he: {
            badge: 'דירוג שיא',
            title: 'אנשי מקצוע מומלצים',
            subtitle: 'אנשי מקצוע מהשורה הראשונה שנבחרו במיוחד עבור היום המיוחד שלך.',
            viewAll: 'ראה את כולם',
            noVendors: 'לא נמצאו מקצוענים',
            stats: { vendors: 'מאומתים', rating: 'דירוג ממוצע', events: 'אירועים' }
        }
    };

    const t = content[language as keyof typeof content] || content.en;

    return (
        <section className="relative py-12 md:py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
            {/* Animated Background Orbs */}
            <GradientOrb className="w-[800px] h-[800px] -top-96 -right-96 bg-blue-400/20" delay={0} />
            <GradientOrb className="w-[600px] h-[600px] top-1/2 -left-64 bg-indigo-400/15" delay={3} />
            <GradientOrb className="w-[500px] h-[500px] bottom-0 right-1/4 bg-purple-400/10" delay={5} />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-16"
                    style={isMobile ? {} : { x: parallaxX, y: parallaxY }}
                >
                    <motion.div
                        className="max-w-2xl"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full mb-6 border border-amber-200/50"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Trophy className="w-5 h-5 text-amber-600" />
                            </motion.div>
                            <span className="text-amber-700 font-black uppercase tracking-widest text-xs">
                                {t.badge}
                            </span>
                            <Crown className="w-4 h-4 text-amber-500" />
                        </motion.div>

                        {/* Title with gradient */}
                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-4 md:mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                        >
                            <span className="text-gray-900">{t.title.split(' ')[0]} </span>
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                {t.title.split(' ').slice(1).join(' ')}
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-sm md:text-lg lg:text-xl text-gray-500 font-medium leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            {t.subtitle}
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div
                            className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <StatsPill icon={Verified} value="500+" label={t.stats.vendors} />
                            <StatsPill icon={Star} value="4.9" label={t.stats.rating} />
                            <StatsPill icon={Sparkles} value="10K+" label={t.stats.events} />
                        </motion.div>
                    </motion.div>

                    {/* View All Button - Desktop */}
                    <motion.div
                        className="hidden lg:block"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <Link href="/vendors">
                            <motion.button
                                className={cn(
                                    "group relative px-8 py-4 rounded-2xl font-bold text-lg",
                                    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
                                    "shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30",
                                    "transition-all duration-300"
                                )}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                <span className="relative flex items-center gap-3">
                                    {t.viewAll}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Vendors Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <VendorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : featuredVendors.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {featuredVendors.map((vendor: Vendor, index: number) => (
                            <motion.div
                                key={vendor.id}
                                variants={{
                                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25
                                        }
                                    }
                                }}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className={cn(
                                    "transition-all duration-300",
                                    hoveredIndex !== null && hoveredIndex !== index && "opacity-60 scale-[0.98]"
                                )}
                            >
                                <VendorCard vendor={vendor} index={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">{t.noVendors}</p>
                    </motion.div>
                )}

                {/* Mobile View All Button */}
                <motion.div
                    className="mt-12 lg:hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Link href="/vendors" className="block">
                        <motion.button
                            className={cn(
                                "w-full py-5 rounded-2xl font-bold text-lg",
                                "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
                                "shadow-lg shadow-blue-500/25",
                                "flex items-center justify-center gap-3"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t.viewAll}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
