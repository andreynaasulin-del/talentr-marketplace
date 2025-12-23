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

export default function CategoryRail() {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const { t, language } = useLanguage();

    // Mock counts for categories
    const counts: Record<string, number> = {
        'All': 542,
        'Photographer': 124,
        'Videographer': 86,
        'DJ': 92,
        'MC': 45,
        'Singer': 67,
        'Magician': 23,
    };

    return (
        <div className="relative px-6 py-8">
            {/* Header for categories (Optional, Wolt-like) */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">
                    {language === 'he' ? 'קטגוריות' : language === 'ru' ? 'КАТЕГОРИИ' : 'CATEGORIES'}
                </h3>
            </div>

            {/* Scrollable Container */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    const count = counts[category.id] || Math.floor(Math.random() * 30) + 5;

                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`
                                group relative flex items-center gap-3 px-6 py-3.5 rounded-2xl
                                flex-shrink-0 font-bold text-sm transition-all duration-300
                                ${isActive
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
                                }
                            `}
                        >
                            <div className={`
                                p-1.5 rounded-lg transition-colors
                                ${isActive ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-blue-100/50'}
                            `}>
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                            </div>

                            <span className="whitespace-nowrap">{t(category.label)}</span>

                            {/* Count Badge */}
                            <span className={`
                                text-[10px] px-2 py-0.5 rounded-full font-black
                                ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'}
                            `}>
                                {count}
                            </span>

                            {/* Active Indicator Underline (roadmapping 5.5) */}
                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none" />
        </div>
    );
}
