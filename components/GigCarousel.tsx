'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface GigCard {
    id: string;
    title: { en: string; he: string };
    image: string;
    category: string;
    price: string;
}

// Gig cards as user requested - service descriptions like Wolt
const gigs: GigCard[] = [
    {
        id: '1',
        title: { en: 'Magician for anniversary', he: 'קוסם ליום נישואין' },
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop&q=80',
        category: 'Magician',
        price: '₪1,500'
    },
    {
        id: '2',
        title: { en: 'DJ for house party', he: 'DJ למסיבת בית' },
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=300&fit=crop&q=80',
        category: 'DJ',
        price: '₪2,000'
    },
    {
        id: '3',
        title: { en: 'Chef for romantic dinner', he: 'שף לארוחת ערב רומנטית' },
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop&q=80',
        category: 'Chef',
        price: '₪1,800'
    },
    {
        id: '4',
        title: { en: 'Photographer for wedding', he: 'צלם לחתונה' },
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop&q=80',
        category: 'Photographer',
        price: '₪3,500'
    },
    {
        id: '5',
        title: { en: 'Poker dealer for friends night', he: 'דילר לערב פוקר עם חברים' },
        image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop&q=80',
        category: 'Bartender',
        price: '₪800'
    },
    {
        id: '6',
        title: { en: 'MC for Bar Mitzvah', he: 'מנחה לבר מצווה' },
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop&q=80',
        category: 'MC',
        price: '₪2,500'
    },
    {
        id: '7',
        title: { en: 'Singer for birthday party', he: 'זמר למסיבת יום הולדת' },
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop&q=80',
        category: 'Singer',
        price: '₪2,200'
    },
    {
        id: '8',
        title: { en: 'Bartender for cocktail party', he: 'ברמן למסיבת קוקטיילים' },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&q=80',
        category: 'Bartender',
        price: '₪1,200'
    },
    {
        id: '9',
        title: { en: 'Face painter for kids party', he: 'ציור פנים למסיבת ילדים' },
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop&q=80',
        category: 'Face Painter',
        price: '₪600'
    },
    {
        id: '10',
        title: { en: 'Videographer for event', he: 'צלם וידאו לאירוע' },
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&q=80',
        category: 'Videographer',
        price: '₪2,800'
    },
];

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    // Duplicate gigs for infinite scroll effect
    const duplicatedGigs = [...gigs, ...gigs];

    return (
        <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    {lang === 'he' ? 'מה אתם מחפשים?' : 'What are you looking for?'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {lang === 'he' ? 'הזמינו כישרון לאירוע הבא שלכם' : 'Book talent for your next event'}
                </p>
            </div>

            {/* Auto-scrolling carousel - Row 1 (left to right) */}
            <div className="relative mb-4">
                <motion.div
                    className="flex gap-4"
                    animate={{
                        x: lang === 'he' ? ['0%', '-50%'] : ['-50%', '0%']
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 30,
                            ease: 'linear',
                        },
                    }}
                >
                    {duplicatedGigs.map((gig, index) => (
                        <GigCardComponent key={`row1-${gig.id}-${index}`} gig={gig} lang={lang} />
                    ))}
                </motion.div>
            </div>

            {/* Auto-scrolling carousel - Row 2 (right to left) */}
            <div className="relative">
                <motion.div
                    className="flex gap-4"
                    animate={{
                        x: lang === 'he' ? ['-50%', '0%'] : ['0%', '-50%']
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 35,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...duplicatedGigs].reverse().map((gig, index) => (
                        <GigCardComponent key={`row2-${gig.id}-${index}`} gig={gig} lang={lang} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function GigCardComponent({ gig, lang }: { gig: GigCard; lang: 'en' | 'he' }) {
    return (
        <Link
            href={`/?category=${gig.category}`}
            className="flex-shrink-0 w-72 md:w-80 group"
        >
            <motion.div
                className="relative h-44 md:h-48 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.2 }}
            >
                {/* Image */}
                <Image
                    src={gig.image}
                    alt={gig.title[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="320px"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Price badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 rounded-full shadow-md">
                    <span className="text-sm font-bold text-gray-900">{gig.price}</span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow-lg">
                        {gig.title[lang]}
                    </h3>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
        </Link>
    );
}
