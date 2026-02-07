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
        // We use Mock Data for Categories as requested for the Homepage Navigation
        // User requested specific categories: DJ, Magician, Comedian, Singer, Bartender...
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
            photos: ['/categories/rollerblade-coach.jpg'], // Placeholder
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
            title: 'קטגוריות מבוקשות', // Popular Categories
            subtitle: 'מצאו את איש המקצוע המושלם לאירוע שלכם',
            viewAll: 'צפה בהכל',
        },
    };

    const t = content[lang];

    // Show skeleton while loading
    if (loading) {
        return (
            <section className="gig-carousel-section">
                <div className="gig-header" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    <h2 className="gig-title">{t.title}</h2>
                    <p className="gig-subtitle">{t.subtitle}</p>
                </div>
                <div className="flex gap-4 px-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-[280px] h-[280px] bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse flex-shrink-0" />
                    ))}
                </div>
            </section>
        );
    }

    // Split for two rows
    const mid = Math.ceil(gigs.length / 2);
    const topRow = gigs.slice(0, mid);
    const bottomRow = gigs.slice(mid);

    // Ensure we have enough items for scrolling loop by duplicating
    const row1Items = [...topRow, ...topRow, ...topRow, ...bottomRow]; // Mix
    const row2Items = [...bottomRow, ...bottomRow, ...topRow, ...bottomRow]; // Mix

    return (
        <section className="gig-carousel-section">
            {/* Header */}
            <div className="gig-header" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="gig-title">{t.title}</h2>
                    <p className="gig-subtitle">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* Carousel Rows */}
            <div className="gig-rows" dir="ltr">
                {/* ROW 1 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-left">
                        {row1Items.map((gig, i) => (
                            <GigCard key={`r1-${gig.id}-${i}`} gig={gig} lang={lang} />
                        ))}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-right">
                        {row2Items.map((gig, i) => (
                            <GigCard key={`r2-${gig.id}-${i}`} gig={gig} lang={lang} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .gig-carousel-section {
                    position: relative;
                    padding: 48px 0 64px;
                    background: var(--bg-primary);
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                }

                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto 32px;
                    padding: 0 16px;
                }

                .gig-title {
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    line-height: 1.2;
                    margin-bottom: 8px;
                    font-size: 28px;
                    color: var(--text-primary);
                }

                .gig-subtitle {
                    color: var(--text-muted);
                    font-size: 16px;
                    max-width: 500px;
                    font-weight: 400;
                    line-height: 1.5;
                }

                .gig-rows {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    direction: ltr !important;
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }

                .gig-row {
                    display: flex;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    white-space: nowrap;
                }

                .gig-track {
                    display: flex;
                    gap: 16px;
                    padding: 4px 0;
                    flex-shrink: 0;
                    width: max-content;
                    will-change: transform;
                }

                .gig-track-left {
                    animation: scroll-left 60s linear infinite;
                }

                .gig-track-right {
                    animation: scroll-right 70s linear infinite;
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }

                @keyframes scroll-right {
                    0% { transform: translateX(-50%); } 
                    100% { transform: translateX(0); }
                }

                @media (max-width: 768px) {
                    .gig-carousel-section {
                        padding: 24px 0 32px;
                    }
                    .gig-rows {
                        gap: 16px;
                    }
                    .gig-track {
                        gap: 12px;
                    }
                }
            `}</style>
        </section>
    );
}

// Gig Card Component - Landing Page Navigation
const GigCard = memo(function GigCard({
    gig,
    lang,
}: {
    gig: Gig;
    lang: 'en' | 'he';
}) {
    const isHebrew = lang === 'he';

    // Handle both string[] (mock) and { url: string }[] (real)
    const firstPhoto = gig.photos?.[0];
    const photo = typeof firstPhoto === 'string'
        ? firstPhoto
        : firstPhoto?.url || '/logo.jpg';

    // Build URL with UTMs as requested
    const slug = gig.category_slug;
    const href = `/book/${slug}?utm_source=homepage&utm_medium=card&utm_campaign=book_gig&utm_content=${slug}&ref=home_card`;

    const handleClick = () => {
        // Track the click event
        trackEvent('select_gig_category', {
            gig_slug: slug,
            source: 'homepage_card',
            card_position: 'carousel', // context
            category_name: gig.title
        });
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="gig-card-wrapper group"
            style={{ direction: isHebrew ? 'rtl' : 'ltr' }}
        >
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md hover:shadow-xl hover:border-zinc-700 transition-all duration-300">
                {/* IMAGE */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
                    <Image
                        src={photo}
                        alt={gig.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 240px, 280px"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                    {/* Category Label */}
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-90">
                        {gig.category_id}
                    </p>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 drop-shadow-md">
                        {gig.title}
                    </h3>
                </div>
            </div>
            <style jsx>{`
                .gig-card-wrapper {
                    width: 280px;
                    flex-shrink: 0;
                    cursor: pointer;
                }
                @media (max-width: 640px) {
                    .gig-card-wrapper {
                        width: 240px;
                    }
                }
            `}</style>
        </Link>
    );
});