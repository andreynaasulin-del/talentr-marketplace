'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface GigCard {
    id: string;
    title: { en: string; he: string };
    image: string;
}

// Clean service descriptions - NO prices, NO categories
const gigs: GigCard[] = [
    {
        id: '1',
        title: { en: 'Magician for anniversary', he: 'קוסם ליום נישואין' },
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '2',
        title: { en: 'DJ for party', he: 'DJ למסיבה' },
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '3',
        title: { en: 'Chef for dinner', he: 'שף לארוחה' },
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '4',
        title: { en: 'Wedding photographer', he: 'צלם לחתונה' },
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '5',
        title: { en: 'Poker dealer', he: 'דילר פוקר' },
        image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '6',
        title: { en: 'Event MC', he: 'מנחה לאירוע' },
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '7',
        title: { en: 'Singer', he: 'זמר' },
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '8',
        title: { en: 'Bartender', he: 'ברמן' },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '9',
        title: { en: 'Face painter', he: 'ציור פנים' },
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '10',
        title: { en: 'Videographer', he: 'צלם וידאו' },
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&q=80',
    },
];

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to chat input when card clicked
    const handleCardClick = (title: string) => {
        // Focus on hero search and pre-fill
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = title;
            searchInput.focus();
            // Trigger input event for React state
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="py-6 md:py-10 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Header - minimal */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {lang === 'he' ? 'מה אתם מחפשים?' : 'What are you looking for?'}
                </h2>
            </div>

            {/* Horizontal Scroll - Wolt Style Square Cards */}
            <div
                ref={scrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {gigs.map((gig, index) => (
                    <motion.button
                        key={gig.id}
                        onClick={() => handleCardClick(gig.title[lang])}
                        className="flex-shrink-0 group focus:outline-none"
                        style={{ scrollSnapAlign: 'start' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Perfect Square Card - Wolt Style */}
                        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            {/* Image */}
                            <Image
                                src={gig.image}
                                alt={gig.title[lang]}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 112px, 144px"
                            />

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Label - bottom */}
                            <div className="absolute inset-x-0 bottom-0 p-2 md:p-3">
                                <p className="text-white font-semibold text-xs md:text-sm text-center leading-tight drop-shadow-md">
                                    {gig.title[lang]}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
