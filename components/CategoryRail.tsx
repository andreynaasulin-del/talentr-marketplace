'use client';

import {
    Camera, Video, Music, Mic, Sparkles, Mic2, Music2,
    Smile, Users, Wine, GlassWater, Palette, Baby,
    Paintbrush, Scissors, ChefHat
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

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
    label: string;
    icon: React.ElementType;
}

const categories: CategoryItem[] = [
    { id: 'All', label: 'All', icon: Sparkles },
    { id: 'Photographer', label: 'Photographers', icon: Camera },
    { id: 'Videographer', label: 'Videographers', icon: Video },
    { id: 'DJ', label: 'DJs', icon: Music },
    { id: 'MC', label: 'MCs', icon: Mic },
    { id: 'Magician', label: 'Magicians', icon: Sparkles },
    { id: 'Singer', label: 'Singers', icon: Mic2 },
    { id: 'Musician', label: 'Musicians', icon: Music2 },
    { id: 'Comedian', label: 'Comedians', icon: Smile },
    { id: 'Dancer', label: 'Dancers', icon: Users },
    { id: 'Bartender', label: 'Bartenders', icon: Wine },
    { id: 'Bar Show', label: 'Bar Shows', icon: GlassWater },
    { id: 'Event Decor', label: 'Event Decor', icon: Palette },
    { id: 'Kids Animator', label: 'Kids Animators', icon: Baby },
    { id: 'Face Painter', label: 'Face Painters', icon: Paintbrush },
    { id: 'Piercing/Tattoo', label: 'Piercing/Tattoo', icon: Scissors },
    { id: 'Chef', label: 'Chefs/Catering', icon: ChefHat },
];

interface CategoryRailProps {
    onCategoryChange?: (category: Category) => void;
}

export default function CategoryRail({ onCategoryChange }: CategoryRailProps) {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const { t, language } = useLanguage();

    const handleCategoryClick = (categoryId: Category) => {
        setActiveCategory(categoryId);
        onCategoryChange?.(categoryId);
    };

    return (
        <div className="relative px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">
                    {language === 'he' ? 'קטגוריות' : language === 'ru' ? 'КАТЕГОРИИ' : 'CATEGORIES'}
                </h3>
            </div>

            {/* Scrollable Container */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`
                                group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl
                                flex-shrink-0 font-semibold text-sm transition-all duration-300
                                ${isActive
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                            <span className="whitespace-nowrap">{t(category.label)}</span>
                        </button>
                    );
                })}
            </div>

            {/* Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
    );
}

