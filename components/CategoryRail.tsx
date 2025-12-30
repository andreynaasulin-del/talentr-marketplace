'use client';

import {
    Camera, Video, Music, Mic, Sparkles, Mic2, Music2,
    Smile, Users, Wine, GlassWater, Palette, Baby,
    Paintbrush, Scissors, ChefHat
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    | 'Piercing/Tattoo'
    | 'Chef'
    | 'All';

interface CategoryItem {
    id: Category;
    label: { en: string; ru: string; he: string };
    icon: React.ElementType;
    color: string;
}

const categories: CategoryItem[] = [
    { id: 'All', label: { en: 'All', ru: 'Все', he: 'הכל' }, icon: Sparkles, color: 'from-gray-600 to-gray-800' },
    { id: 'Photographer', label: { en: 'Photo', ru: 'Фото', he: 'צילום' }, icon: Camera, color: 'from-blue-500 to-blue-600' },
    { id: 'Videographer', label: { en: 'Video', ru: 'Видео', he: 'וידאו' }, icon: Video, color: 'from-red-500 to-red-600' },
    { id: 'DJ', label: { en: 'DJ', ru: 'DJ', he: 'DJ' }, icon: Music, color: 'from-purple-500 to-purple-600' },
    { id: 'MC', label: { en: 'MC', ru: 'Ведущий', he: 'מנחה' }, icon: Mic, color: 'from-amber-500 to-amber-600' },
    { id: 'Magician', label: { en: 'Magic', ru: 'Магия', he: 'קסם' }, icon: Sparkles, color: 'from-indigo-500 to-indigo-600' },
    { id: 'Singer', label: { en: 'Singer', ru: 'Певец', he: 'זמר' }, icon: Mic2, color: 'from-pink-500 to-pink-600' },
    { id: 'Musician', label: { en: 'Music', ru: 'Музыка', he: 'מוזיקה' }, icon: Music2, color: 'from-emerald-500 to-emerald-600' },
    { id: 'Comedian', label: { en: 'Comedy', ru: 'Юмор', he: 'קומיקאי' }, icon: Smile, color: 'from-yellow-500 to-yellow-600' },
    { id: 'Dancer', label: { en: 'Dance', ru: 'Танцы', he: 'ריקוד' }, icon: Users, color: 'from-rose-500 to-rose-600' },
    { id: 'Bartender', label: { en: 'Bar', ru: 'Бар', he: 'בר' }, icon: Wine, color: 'from-orange-500 to-orange-600' },
    { id: 'Bar Show', label: { en: 'Bar Show', ru: 'Бар Шоу', he: 'שואו בר' }, icon: GlassWater, color: 'from-cyan-500 to-cyan-600' },
    { id: 'Event Decor', label: { en: 'Decor', ru: 'Декор', he: 'עיצוב' }, icon: Palette, color: 'from-violet-500 to-violet-600' },
    { id: 'Kids Animator', label: { en: 'Kids', ru: 'Дети', he: 'ילדים' }, icon: Baby, color: 'from-lime-500 to-lime-600' },
    { id: 'Face Painter', label: { en: 'Paint', ru: 'Грим', he: 'איפור' }, icon: Paintbrush, color: 'from-fuchsia-500 to-fuchsia-600' },
    { id: 'Chef', label: { en: 'Chef', ru: 'Шеф', he: 'שף' }, icon: ChefHat, color: 'from-teal-500 to-teal-600' },
];

interface CategoryRailProps {
    onCategoryChange?: (category: Category) => void;
}

export default function CategoryRail({ onCategoryChange }: CategoryRailProps) {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const { language } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const lang = language as 'en' | 'ru' | 'he';

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const handleCategoryClick = (categoryId: Category) => {
        setActiveCategory(categoryId);
        onCategoryChange?.(categoryId);
    };

    return (
        <div className="relative py-4 md:py-6 bg-white dark:bg-slate-900">
            {/* Header - Mobile Compact */}
            <div className="px-4 md:px-6 mb-3 md:mb-4">
                <h3 className="text-xs md:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    {lang === 'he' ? 'קטגוריות' : lang === 'ru' ? 'КАТЕГОРИИ' : 'CATEGORIES'}
                </h3>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2"
                style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;

                    return (
                        <motion.button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={cn(
                                "relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl",
                                "flex-shrink-0 font-semibold text-xs md:text-sm transition-all duration-300",
                                isActive
                                    ? 'text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 dark:active:bg-slate-600'
                            )}
                            style={isActive ? {
                                background: `linear-gradient(135deg, ${category.color.includes('gray') ? '#374151, #1f2937' : category.color.replace('from-', '').replace(' to-', ', ').split(', ').map(c => c.includes('-500') ? c.replace('-500', '-500').replace(c.split('-')[0] + '-', '#') : c.replace('-600', '-600').replace(c.split('-')[0] + '-', '#')).join(', ')})`
                            } : {}}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isActive && (
                                <motion.div
                                    className={cn("absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r", category.color)}
                                    layoutId="activeCategory"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <Icon className={cn(
                                "relative z-10 w-3.5 h-3.5 md:w-4 md:h-4",
                                isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                            )} />
                            <span className="relative z-10 whitespace-nowrap">
                                {category.label[lang] || category.label.en}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Edge Fades - Responsive */}
            <div
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-opacity",
                    canScrollLeft ? 'opacity-100' : 'opacity-0'
                )}
            />
            <div
                className={cn(
                    "absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-opacity",
                    canScrollRight ? 'opacity-100' : 'opacity-0'
                )}
            />
        </div>
    );
}
