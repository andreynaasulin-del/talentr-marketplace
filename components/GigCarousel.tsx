'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface Gig {
    id: string;
    title: string;
    category_id: string; // Display Name
    category_slug: string; // URL Slug
    short_description?: string;
    photos?: any[];
    price_amount?: number;
    currency?: string;
    pricing_type?: string;
}

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setGigs(MOCK_CATEGORIES);
        setLoading(false);
    }, []);

    const MOCK_CATEGORIES: Gig[] = [
        {
            id: 'cat-dj',
            title: 'Professional DJs',
            category_id: 'DJ',
            category_slug: 'dj',
            photos: ['/categories/DJ.jpg'],
            short_description: 'Set the perfect vibe for your event'
        },
        {
            id: 'cat-magician',
            title: 'Magicians & Illusionists',
            category_id: 'Magician',
            category_slug: 'magician',
            photos: ['/categories/Illusionist.jpg'],
            short_description: 'Mind-blowing entertainment'
        },
        {
            id: 'cat-comedian',
            title: 'Stand-up Comedians',
            category_id: 'Comedian',
            category_slug: 'comedian',
            photos: ['/categories/stand-up-comedian.jpg'],
            short_description: 'Laughter guaranteed'
        },
        {
            id: 'cat-singer',
            title: 'Live Singers',
            category_id: 'Singer',
            category_slug: 'singer',
            photos: ['/categories/live-musician.jpg'],
            short_description: 'Soulful performances'
        },
        {
            id: 'cat-bartender',
            title: 'Cocktail Bartenders',
            category_id: 'Bartender',
            category_slug: 'bartender',
            photos: ['/categories/Bartender.jpg'],
            short_description: 'Premium bar service'
        },
        {
            id: 'cat-chef',
            title: 'Private Chefs',
            category_id: 'Chef',
            category_slug: 'private-chef',
            photos: ['/categories/private-chef.jpg'],
            short_description: 'Culinary excellence'
        },
        {
            id: 'cat-kids',
            title: 'Kids Animators',
            category_id: 'Kids',
            category_slug: 'kids-animator',
            photos: ['/categories/rollerblade-coach.jpg'],
            short_description: 'Fun for the little ones'
        }
    ];

    const content = {
        en: {
            title: 'Browse Categories',
            subtitle: 'Find the perfect professional for your event',
            viewAll: 'View All',
        },
        he: {
            title: 'קטגוריות מבוקשות',
            subtitle: 'מצאו את איש המקצוע המושלם לאירוע שלכם',
            viewAll: 'צפה בהכל',
        },
    };

    const t = content[lang];

    if (loading) {
        return (
            <section className="gig-carousel-section bg-zinc-50 dark:bg-zinc-950">
                <div className="gig-header" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    <h2 className="gig-title text-zinc-900 dark:text-white">{t.title}</h2>
                    <p className="gig-subtitle text-zinc-600 dark:text-zinc-400">{t.subtitle}</p>
                </div>
                <div className="flex gap-4 px-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-[280px] h-[280px] bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse flex-shrink-0" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="gig-carousel-section bg-zinc-50 dark:bg-black py-12">
            {/* Header */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 mb-8" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{t.title}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-lg">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* Horizontal Scroll List (No Duplicates) */}
            <div className="w-full overflow-x-auto pb-8 hide-scrollbar" dir="ltr">
                <div className="flex gap-4 px-4 md:px-8 w-max mx-auto md:mx-0">
                    {gigs.map((gig, i) => (
                        <GigCard key={gig.id} gig={gig} lang={lang} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}

// Gig Card Component
const GigCard = memo(function GigCard({
    gig,
    lang,
}: {
    gig: Gig;
    lang: 'en' | 'he';
}) {
    const isHebrew = lang === 'he';
    const firstPhoto = gig.photos?.[0];
    const photo = typeof firstPhoto === 'string'
        ? firstPhoto
        : firstPhoto?.url || '/logo.jpg';

    const slug = gig.category_slug;
    const href = `/book/${slug}?utm_source=homepage&utm_medium=card&utm_campaign=book_gig&utm_content=${slug}&ref=home_card`;

    const handleClick = () => {
        trackEvent('select_gig_category', {
            gig_slug: slug,
            source: 'homepage_card',
            card_position: 'scroll_list',
            category_name: gig.title
        });
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="w-[260px] md:w-[280px] flex-shrink-0 cursor-pointer group relative block no-underline transition-transform hover:-translate-y-1"
            style={{ direction: isHebrew ? 'rtl' : 'ltr' }}
        >
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md hover:shadow-xl hover:border-zinc-700 transition-all duration-300 transform w-full">
                {/* IMAGE */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
                    <Image
                        src={photo}
                        alt={gig.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 240px, 280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center w-full">
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-90 truncate">
                        {gig.category_id}
                    </p>
                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 drop-shadow-md">
                        {gig.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
});