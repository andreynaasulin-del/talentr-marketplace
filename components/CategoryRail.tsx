'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Category =
    | 'Photographer'
    | 'Videographer'
    | 'DJ'
    | 'MC'
    | 'Magician'
    | 'Singer'
    | 'Musician'
    | 'Comedian'
    | 'Dancer'
    | 'Bartender'
    | 'Bar Show'
    | 'Event Decor'
    | 'Kids Animator'
    | 'Face Painter'
    | 'Chef'
    | 'All';

interface CategoryItem {
    id: Category;
    label: { en: string; he: string };
    image: string;
    gradient: string;
}

const categories: CategoryItem[] = [
    {
        id: 'Photographer',
        label: { en: 'Photographer', he: 'צלם' },
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop&q=80',
        gradient: 'from-blue-600 to-cyan-500'
    },
    {
        id: 'Videographer',
        label: { en: 'Videographer', he: 'צלם וידאו' },
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&q=80',
        gradient: 'from-red-600 to-orange-500'
    },
    {
        id: 'DJ',
        label: { en: 'DJ', he: 'DJ' },
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80',
        gradient: 'from-purple-600 to-pink-500'
    },
    {
        id: 'MC',
        label: { en: 'MC / Host', he: 'מנחה אירועים' },
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=400&fit=crop&q=80',
        gradient: 'from-amber-600 to-yellow-500'
    },
    {
        id: 'Singer',
        label: { en: 'Singer', he: 'זמר' },
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80',
        gradient: 'from-pink-600 to-rose-500'
    },
    {
        id: 'Musician',
        label: { en: 'Musician', he: 'מוזיקאי' },
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&q=80',
        gradient: 'from-emerald-600 to-teal-500'
    },
    {
        id: 'Magician',
        label: { en: 'Magician', he: 'קוסם' },
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=400&fit=crop&q=80',
        gradient: 'from-indigo-600 to-violet-500'
    },
    {
        id: 'Comedian',
        label: { en: 'Comedian', he: 'סטנדאפיסט' },
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=400&fit=crop&q=80',
        gradient: 'from-yellow-500 to-amber-400'
    },
    {
        id: 'Dancer',
        label: { en: 'Dancer', he: 'רקדן' },
        image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=400&fit=crop&q=80',
        gradient: 'from-rose-600 to-pink-500'
    },
    {
        id: 'Bartender',
        label: { en: 'Bartender', he: 'ברמן' },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80',
        gradient: 'from-orange-600 to-amber-500'
    },
    {
        id: 'Bar Show',
        label: { en: 'Bar Show', he: 'מופע בר' },
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop&q=80',
        gradient: 'from-cyan-600 to-blue-500'
    },
    {
        id: 'Event Decor',
        label: { en: 'Decor', he: 'עיצוב אירועים' },
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop&q=80',
        gradient: 'from-violet-600 to-purple-500'
    },
    {
        id: 'Kids Animator',
        label: { en: 'Kids', he: 'מפעיל לילדים' },
        image: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&h=400&fit=crop&q=80',
        gradient: 'from-lime-500 to-green-500'
    },
    {
        id: 'Face Painter',
        label: { en: 'Face Paint', he: 'ציור פנים' },
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80',
        gradient: 'from-fuchsia-600 to-pink-500'
    },
    {
        id: 'Chef',
        label: { en: 'Chef', he: 'שף' },
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&q=80',
        gradient: 'from-teal-600 to-cyan-500'
    },
];

interface CategoryRailProps {
    onCategoryChange?: (category: Category) => void;
}

export default function CategoryRail({ onCategoryChange }: CategoryRailProps) {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const { language } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);

    const lang = language as 'en' | 'he';

    const handleCategoryClick = (categoryId: Category) => {
        const newCategory = activeCategory === categoryId ? 'All' : categoryId;
        setActiveCategory(newCategory);
        onCategoryChange?.(newCategory);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="py-8 md:py-12 bg-white dark:bg-black transition-colors">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                        {lang === 'he' ? 'מצאו כישרונות' : 'Find Talents'}
                    </h2>
                    <p className="text-gray-500 dark:text-zinc-400 mt-1">
                        {lang === 'he' ? 'בחרו קטגוריה' : 'Choose a category'}
                    </p>
                </div>

                {/* Navigation arrows */}
                <div className="hidden md:flex gap-2">
                    <motion.button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 flex items-center justify-center transition-all border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-600"
                        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                    <motion.button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 flex items-center justify-center transition-all border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-600"
                        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                </div>
            </div>

            {/* Horizontal Scroll Container - Wolt Style */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {categories.map((category, index) => {
                        const isActive = activeCategory === category.id;

                        return (
                            <motion.button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden group",
                                    "transition-all duration-300",
                                    isActive && 'ring-4 ring-blue-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-900'
                                )}
                                style={{ scrollSnapAlign: 'start' }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={category.label[lang]}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 128px, 160px"
                                />

                                {/* Gradient Overlay */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
                                    "group-hover:from-black/90"
                                )} />

                                {/* Label */}
                                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                                    <p className="text-white font-bold text-sm md:text-base text-center drop-shadow-lg">
                                        {category.label[lang]}
                                    </p>
                                </div>

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Category Indicator */}
            {activeCategory !== 'All' && (
                <motion.div
                    className="max-w-7xl mx-auto px-4 md:px-6 mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                {lang === 'he'
                                    ? `מציג: ${categories.find(c => c.id === activeCategory)?.label[lang]}`
                                    : `Showing: ${categories.find(c => c.id === activeCategory)?.label[lang]}`
                                }
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setActiveCategory('All');
                                onCategoryChange?.('All');
                            }}
                            className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                        >
                            {lang === 'he' ? 'נקה' : 'Clear'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
