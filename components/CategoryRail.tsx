'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Camera, Video, Music, Mic, Sparkles, Mic2, Music2,
    Smile, Users, Wine, GlassWater, Palette, Baby,
    Paintbrush, ChefHat
} from 'lucide-react';

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
    icon: React.ElementType;
    bgColor: string;
    iconColor: string;
}

const categories: CategoryItem[] = [
    {
        id: 'Photographer',
        label: { en: 'Photographer', ru: 'Фотограф', he: 'צלם' },
        icon: Camera,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
        id: 'Videographer',
        label: { en: 'Video', ru: 'Видео', he: 'וידאו' },
        icon: Video,
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400'
    },
    {
        id: 'DJ',
        label: { en: 'DJ', ru: 'DJ', he: 'DJ' },
        icon: Music,
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
        id: 'MC',
        label: { en: 'MC', ru: 'Ведущий', he: 'מנחה' },
        icon: Mic,
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
        id: 'Singer',
        label: { en: 'Singer', ru: 'Певец', he: 'זמר' },
        icon: Mic2,
        bgColor: 'bg-pink-100 dark:bg-pink-900/30',
        iconColor: 'text-pink-600 dark:text-pink-400'
    },
    {
        id: 'Musician',
        label: { en: 'Musician', ru: 'Музыкант', he: 'מוזיקאי' },
        icon: Music2,
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        id: 'Magician',
        label: { en: 'Magician', ru: 'Фокусник', he: 'קוסם' },
        icon: Sparkles,
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
        id: 'Comedian',
        label: { en: 'Comedian', ru: 'Комик', he: 'קומיקאי' },
        icon: Smile,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
        id: 'Dancer',
        label: { en: 'Dancer', ru: 'Танцор', he: 'רקדן' },
        icon: Users,
        bgColor: 'bg-rose-100 dark:bg-rose-900/30',
        iconColor: 'text-rose-600 dark:text-rose-400'
    },
    {
        id: 'Bartender',
        label: { en: 'Bartender', ru: 'Бармен', he: 'ברמן' },
        icon: Wine,
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
        id: 'Bar Show',
        label: { en: 'Bar Show', ru: 'Бар Шоу', he: 'בר שואו' },
        icon: GlassWater,
        bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
        iconColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
        id: 'Event Decor',
        label: { en: 'Decor', ru: 'Декор', he: 'עיצוב' },
        icon: Palette,
        bgColor: 'bg-violet-100 dark:bg-violet-900/30',
        iconColor: 'text-violet-600 dark:text-violet-400'
    },
    {
        id: 'Kids Animator',
        label: { en: 'Kids', ru: 'Аниматор', he: 'אנימטור' },
        icon: Baby,
        bgColor: 'bg-lime-100 dark:bg-lime-900/30',
        iconColor: 'text-lime-600 dark:text-lime-400'
    },
    {
        id: 'Face Painter',
        label: { en: 'Face Paint', ru: 'Аквагрим', he: 'ציור פנים' },
        icon: Paintbrush,
        bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
        iconColor: 'text-fuchsia-600 dark:text-fuchsia-400'
    },
    {
        id: 'Chef',
        label: { en: 'Chef', ru: 'Шеф', he: 'שף' },
        icon: ChefHat,
        bgColor: 'bg-teal-100 dark:bg-teal-900/30',
        iconColor: 'text-teal-600 dark:text-teal-400'
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

            {/* Grid of Category Tiles - Wolt Style */}
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-5">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;

                        return (
                            <motion.button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "relative flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl",
                                    "transition-all duration-200",
                                    "hover:shadow-lg hover:-translate-y-1",
                                    "active:scale-95",
                                    isActive
                                        ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                                        : category.bgColor
                                )}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center",
                                    isActive
                                        ? 'bg-white/20'
                                        : 'bg-white dark:bg-slate-800 shadow-sm'
                                )}>
                                    <Icon className={cn(
                                        "w-6 h-6 md:w-7 md:h-7",
                                        isActive ? 'text-white' : category.iconColor
                                    )} />
                                </div>

                                {/* Label */}
                                <span className={cn(
                                    "text-xs md:text-sm font-semibold text-center leading-tight",
                                    isActive
                                        ? 'text-white'
                                        : 'text-gray-700 dark:text-gray-200'
                                )}>
                                    {category.label[lang]}
                                </span>

                                {/* Active checkmark */}
                                {isActive && (
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
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
                                    ? `מציג: ${categories.find(c => c.id === activeCategory)?.label[lang]}`
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
