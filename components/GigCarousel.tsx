'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface GigCard {
    id: string;
    title: { en: string; he: string };
    image: string;
}

// Premium talent cards - evocative names, no prices
const gigs: GigCard[] = [
    { id: '1', title: { en: 'Magic Night', he: 'לילה קסום' }, image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=400&fit=crop&q=80' },
    { id: '2', title: { en: 'Beat Drop', he: 'הביט שלך' }, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80' },
    { id: '3', title: { en: 'Chef\'s Table', he: 'שולחן השף' }, image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&q=80' },
    { id: '4', title: { en: 'Your Story', he: 'הסיפור שלכם' }, image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop&q=80' },
    { id: '5', title: { en: 'Game On', he: 'משחק פתוח' }, image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=400&fit=crop&q=80' },
    { id: '6', title: { en: 'Stage Master', he: 'אדון הבמה' }, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=400&fit=crop&q=80' },
    { id: '7', title: { en: 'Live Voice', he: 'קול חי' }, image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&q=80' },
    { id: '8', title: { en: 'Cocktail Art', he: 'אומנות הקוקטייל' }, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80' },
    { id: '9', title: { en: 'Color Play', he: 'משחקי צבע' }, image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80' },
    { id: '10', title: { en: 'Cinematic', he: 'קולנוע חי' }, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&q=80' },
    { id: '11', title: { en: 'Sound Healer', he: 'מרפא בצלילים' }, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80' },
    { id: '12', title: { en: 'Samba Queen', he: 'מלכת הסמבה' }, image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=400&fit=crop&q=80' },
];

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    // Click handler - scroll to AI chat
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

    // Duplicate for infinite scroll effect
    const duplicatedGigs = [...gigs, ...gigs];

    return (
        <section className="py-8 md:py-12 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                    {lang === 'he' ? 'מה אתם מחפשים?' : 'What are you looking for?'}
                </h2>
            </div>

            {/* Row 1 - Auto-scrolling left to right */}
            <div className="relative mb-4">
                <motion.div
                    className="flex gap-4 ps-4"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 40,
                            ease: 'linear',
                        },
                    }}
                >
                    {duplicatedGigs.map((gig, index) => (
                        <WoltCube 
                            key={`row1-${gig.id}-${index}`} 
                            gig={gig} 
                            lang={lang} 
                            onClick={() => handleCardClick(gig.title[lang])} 
                        />
                    ))}
                </motion.div>
            </div>

            {/* Row 2 - Auto-scrolling right to left */}
            <div className="relative">
                <motion.div
                    className="flex gap-4 ps-4"
                    animate={{ x: ['-50%', '0%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 45,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...duplicatedGigs].reverse().map((gig, index) => (
                        <WoltCube 
                            key={`row2-${gig.id}-${index}`} 
                            gig={gig} 
                            lang={lang} 
                            onClick={() => handleCardClick(gig.title[lang])} 
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Wolt-style square card component
function WoltCube({ gig, lang, onClick }: { gig: GigCard; lang: 'en' | 'he'; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            className="flex-shrink-0 group focus:outline-none"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            {/* Perfect Square - Wolt style */}
            <div 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden"
                style={{
                    boxShadow: '0 8px 30px -8px rgba(0,0,0,0.2)',
                }}
            >
                {/* Image */}
                <Image
                    src={gig.image}
                    alt={gig.title[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 128px, 160px"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-white font-bold text-sm md:text-base text-center leading-tight drop-shadow-lg">
                        {gig.title[lang]}
                    </p>
                </div>
            </div>
        </motion.button>
    );
}
