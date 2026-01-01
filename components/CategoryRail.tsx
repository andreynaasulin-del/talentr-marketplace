'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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
    label: { en: string; ru: string; he: string };
    image: string;
    color: string;
}

const categories: CategoryItem[] = [
    {
        id: 'Photographer',
        label: { en: 'Photographer', ru: 'Фотограф', he: 'צלם' },
        image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=300&h=300&fit=crop',
        color: 'from-blue-500/90 to-blue-600/90'
    },
    {
        id: 'Videographer',
        label: { en: 'Videographer', ru: 'Видеограф', he: 'צלם וידאו' },
        image: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?w=300&h=300&fit=crop',
        color: 'from-red-500/90 to-red-600/90'
    },
    {
        id: 'DJ',
        label: { en: 'DJ', ru: 'DJ', he: 'DJ' },
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=300&h=300&fit=crop',
        color: 'from-purple-500/90 to-purple-600/90'
    },
    {
        id: 'MC',
        label: { en: 'MC / Host', ru: 'Ведущий', he: 'מנחה' },
        image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=300&h=300&fit=crop',
        color: 'from-amber-500/90 to-amber-600/90'
    },
    {
        id: 'Singer',
        label: { en: 'Singer', ru: 'Певец', he: 'זמר' },
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop',
        color: 'from-pink-500/90 to-pink-600/90'
    },
    {
        id: 'Musician',
        label: { en: 'Musician', ru: 'Музыкант', he: 'מוזיקאי' },
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        color: 'from-emerald-500/90 to-emerald-600/90'
    },
    {
        id: 'Magician',
        label: { en: 'Magician', ru: 'Фокусник', he: 'קוסם' },
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=300&h=300&fit=crop',
        color: 'from-indigo-500/90 to-indigo-600/90'
    },
    {
        id: 'Comedian',
        label: { en: 'Comedian', ru: 'Комик', he: 'קומיקאי' },
        image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=300&h=300&fit=crop',
        color: 'from-yellow-500/90 to-yellow-600/90'
    },
    {
        id: 'Dancer',
        label: { en: 'Dancer', ru: 'Танцор', he: 'רקדן' },
        image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=300&h=300&fit=crop',
        color: 'from-rose-500/90 to-rose-600/90'
    },
    {
        id: 'Bartender',
        label: { en: 'Bartender', ru: 'Бармен', he: 'ברמן' },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=300&fit=crop',
        color: 'from-orange-500/90 to-orange-600/90'
    },
    {
        id: 'Bar Show',
        label: { en: 'Bar Show', ru: 'Бар Шоу', he: 'שואו בר' },
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300&h=300&fit=crop',
        color: 'from-cyan-500/90 to-cyan-600/90'
    },
    {
        id: 'Event Decor',
        label: { en: 'Decor', ru: 'Декор', he: 'עיצוב' },
        image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=300&h=300&fit=crop',
        color: 'from-violet-500/90 to-violet-600/90'
    },
    {
        id: 'Kids Animator',
        label: { en: 'Kids Animator', ru: 'Аниматор', he: 'אנימטור' },
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=300&fit=crop',
        color: 'from-lime-500/90 to-lime-600/90'
    },
    {
        id: 'Face Painter',
        label: { en: 'Face Paint', ru: 'Аквагрим', he: 'ציור פנים' },
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&h=300&fit=crop',
        color: 'from-fuchsia-500/90 to-fuchsia-600/90'
    },
    {
        id: 'Chef',
        label: { en: 'Chef', ru: 'Шеф-повар', he: 'שף' },
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop',
        color: 'from-teal-500/90 to-teal-600/90'
    },
];

interface CategoryRailProps {
    onCategoryChange?: (category: Category) => void;
}

export default function CategoryRail({ onCategoryChange }: CategoryRailProps) {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const { language } = useLanguage();

    const lang = language as 'en' | 'ru' | 'he';

    const handleCategoryClick = (categoryId: Category) => {
        const newCategory = activeCategory === categoryId ? 'All' : categoryId;
        setActiveCategory(newCategory);
        onCategoryChange?.(newCategory);
    };

    return (
        <div className="py-6 md:py-10 bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    {lang === 'he' ? 'מצאו כישרונות' : lang === 'ru' ? 'Найти таланты' : 'Find Talents'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {lang === 'he' ? 'בחרו קטגוריה' : lang === 'ru' ? 'Выберите категорию' : 'Choose a category'}
                </p>
            </div>

            {/* Grid of Category Tiles */}
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
                    {categories.map((category, index) => {
                        const isActive = activeCategory === category.id;

                        return (
                            <motion.button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "relative aspect-square rounded-2xl overflow-hidden group",
                                    "transition-all duration-300",
                                    isActive
                                        ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-[1.02]'
                                        : 'hover:scale-105 active:scale-95'
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ y: -4 }}
                            >
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={category.label[lang]}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 12.5vw"
                                />

                                {/* Gradient Overlay */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-t",
                                    isActive ? category.color : 'from-black/70 via-black/30 to-transparent',
                                    "transition-all duration-300"
                                )} />

                                {/* Label */}
                                <div className="absolute inset-x-0 bottom-0 p-2 md:p-3">
                                    <p className={cn(
                                        "text-white font-bold text-xs md:text-sm text-center leading-tight",
                                        "drop-shadow-lg"
                                    )}>
                                        {category.label[lang]}
                                    </p>
                                </div>

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                {lang === 'he'
                                    ? `מציג ${categories.find(c => c.id === activeCategory)?.label[lang]}`
                                    : lang === 'ru'
                                        ? `Показаны: ${categories.find(c => c.id === activeCategory)?.label[lang]}`
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
                            {lang === 'he' ? 'נקה' : lang === 'ru' ? 'Сбросить' : 'Clear'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
