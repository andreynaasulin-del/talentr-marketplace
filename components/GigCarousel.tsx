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

// Premium service descriptions - unique, evocative names
const gigs: GigCard[] = [
    {
        id: '1',
        title: { en: 'Magic Night', he: 'לילה קסום' },
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '2',
        title: { en: 'Beat Drop', he: 'הביט שלך' },
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '3',
        title: { en: 'Chef\'s Table', he: 'שולחן השף' },
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '4',
        title: { en: 'Your Story', he: 'הסיפור שלכם' },
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '5',
        title: { en: 'Game On', he: 'משחק פתוח' },
        image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '6',
        title: { en: 'Stage Master', he: 'אדון הבמה' },
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '7',
        title: { en: 'Live Voice', he: 'קול חי' },
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '8',
        title: { en: 'Cocktail Art', he: 'אומנות הקוקטייל' },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '9',
        title: { en: 'Color Play', he: 'משחקי צבע' },
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80',
    },
    {
        id: '10',
        title: { en: 'Cinematic', he: 'קולנוע חי' },
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&q=80',
    },
];

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to chat input when card clicked
    const handleCardClick = (title: string) => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = title;
            searchInput.focus();
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
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

            {/* Horizontal Scroll - Wolt Style 3D Square Cards */}
            <div
                ref={scrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4"
                style={{ 
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {gigs.map((gig, index) => (
                    <motion.button
                        key={gig.id}
                        onClick={() => handleCardClick(gig.title[lang])}
                        className="flex-shrink-0 group focus:outline-none perspective-1000"
                        style={{ scrollSnapAlign: 'start' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ 
                            scale: 1.05,
                            rotateY: 5,
                            rotateX: -5,
                            z: 50
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Perfect Square Card - 3D Wolt Style */}
                        <div 
                            className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl md:rounded-3xl overflow-hidden"
                            style={{
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.1)',
                                transform: 'translateZ(0)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Image */}
                            <Image
                                src={gig.image}
                                alt={gig.title[lang]}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 112px, 144px"
                            />

                            {/* Gradient overlay - premium feel */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* 3D shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Label - bottom */}
                            <div className="absolute inset-x-0 bottom-0 p-2 md:p-3">
                                <p className="text-white font-bold text-xs md:text-sm text-center leading-tight drop-shadow-lg">
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
