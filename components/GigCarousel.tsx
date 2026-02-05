'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState, useRef } from 'react';

interface Gig {
    id: string;
    title: string;
    category_id: string;
    short_description?: string;
    photos?: any[]; // string[] for Mocks, GigPhoto[] for Real DB
    is_free?: boolean;
    pricing_type?: string;
    price_amount?: number;
    currency?: string;
    share_slug?: string;
}

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const res = await fetch('/api/gigs?status=active');
                if (res.ok) {
                    const data = await res.json();
                    if (data.gigs && data.gigs.length > 0) {
                        setGigs(data.gigs);
                    } else {
                        setGigs(MOCK_GIGS);
                    }
                } else {
                    setGigs(MOCK_GIGS);
                }
            } catch (err) {
                console.error('Failed to fetch gigs:', err);
                setGigs(MOCK_GIGS);
            } finally {
                setLoading(false);
            }
        };

        fetchGigs();
    }, []);

    const MOCK_GIGS: Gig[] = [
        {
            id: 'pkg-1',
            title: 'Private Chef Experience',
            category_id: 'Private Chef',
            photos: ['https://images.unsplash.com/photo-1577106263724-828ed8a9229c?auto=format&fit=crop&w=800&q=80'],
            price_amount: 2500,
            currency: 'ILS',
            pricing_type: 'fixed',
            short_description: 'Exclusive culinary journey in your home',
            share_slug: 'demo-chef'
        },
        {
            id: 'pkg-2',
            title: 'Cocktail Bar & Mixology',
            category_id: 'Bartender',
            photos: ['https://images.unsplash.com/photo-1525268323814-badab8b40969?auto=format&fit=crop&w=800&q=80'],
            price_amount: 1200,
            currency: 'ILS',
            pricing_type: 'event',
            short_description: 'Premium bar service for private events',
            share_slug: 'demo-bar'
        },
        {
            id: 'pkg-3',
            title: 'Live Stand-up Comedy',
            category_id: 'Stand-up',
            photos: ['https://images.unsplash.com/photo-1563823439050-7389c9225875?auto=format&fit=crop&w=800&q=80'],
            price_amount: 3000,
            currency: 'ILS',
            pricing_type: 'show',
            short_description: 'Hilarious performance for your guests',
            share_slug: 'demo-comedy'
        },
        {
            id: 'pkg-4',
            title: 'Wedding DJ Set',
            category_id: 'DJ',
            photos: ['https://images.unsplash.com/photo-1558450143-6d0937a07092?auto=format&fit=crop&w=800&q=80'],
            price_amount: 4500,
            currency: 'ILS',
            pricing_type: 'event',
            short_description: 'Unforgettable party vibes',
            share_slug: 'demo-dj'
        },
        {
            id: 'pkg-5',
            title: 'Live Jazz Band',
            category_id: 'Band',
            photos: ['https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80'],
            price_amount: 6000,
            currency: 'ILS',
            pricing_type: 'band',
            short_description: 'Classy atmosphere for receptions',
            share_slug: 'demo-jazz'
        }
    ];

    const content = {
        en: {
            title: 'The Collection',
            subtitle: 'Browse premium experiences from top vendors',
            viewAll: 'View All',
            noGigs: 'No gigs yet',
            noGigsDesc: 'Be the first to publish your service',
            free: 'Free',
            from: 'from'
        },
        he: {
            title: 'האוסף',
            subtitle: 'גלו חוויות פרימיום מהספקים הטובים ביותר',
            viewAll: 'צפה בהכל',
            noGigs: 'אין גיגים עדיין',
            noGigsDesc: 'היו הראשונים לפרסם את השירות שלכם',
            free: 'חינם',
            from: 'החל מ'
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
                <div className="flex gap-4 px-4 overflow-hidden relative" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-[280px] h-[340px] bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse flex-shrink-0" />
                    ))}
                </div>
            </section>
        );
    }

    // No gigs state
    if (gigs.length === 0) {
        return (
            <section className="py-16 text-center">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t.noGigs}</h2>
                <p className="text-zinc-500">{t.noGigsDesc}</p>
            </section>
        );
    }

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

            {/* Single Row Carousel */}
            <div
                className="gig-carousel-container"
                ref={scrollRef}
                dir={lang === 'he' ? 'rtl' : 'ltr'}
            >
                {gigs.map((gig, i) => (
                    <GigCard key={`${gig.id}-${i}`} gig={gig} lang={lang} t={t} />
                ))}
            </div>

            <style jsx global>{`
                .gig-carousel-section {
                    position: relative;
                    padding: 48px 0 64px;
                    background: var(--bg-primary);
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden;
                }

                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto 32px;
                    padding: 0 24px;
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

                .gig-carousel-container {
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 4px 24px 24px; /* Bottom padding for shadow */
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none; /* Firefox */
                }
                
                .gig-carousel-container::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                }

                @media (max-width: 768px) {
                    .gig-carousel-section {
                        padding: 24px 0 32px;
                    }
                    .gig-header {
                        padding: 0 16px;
                    }
                    .gig-carousel-container {
                        padding: 4px 16px 24px;
                        gap: 12px;
                    }
                }
            `}</style>
        </section>
    );
}

// Gig Card Component - Minimalist Dark Version
const GigCard = memo(function GigCard({
    gig,
    lang,
    t
}: {
    gig: Gig;
    lang: 'en' | 'he';
    t: { free: string; from: string };
}) {
    const isHebrew = lang === 'he';

    // Handle both string[] (mock) and { url: string }[] (real)
    const firstPhoto = gig.photos?.[0];
    const photo = typeof firstPhoto === 'string'
        ? firstPhoto
        : firstPhoto?.url || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80';

    const link = gig.share_slug ? `/g/${gig.share_slug}` : `/gig/${gig.id}`;

    return (
        <Link
            href={link}
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
                </div>

                {/* CONTENT - Minimal, No Prices, No Description */}
                <div className="p-5 text-center">
                    {/* Category */}
                    <p className="text-blue-500 text-[11px] font-bold uppercase tracking-widest mb-2">
                        {gig.category_id}
                    </p>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">
                        {gig.title}
                    </h3>
                </div>
            </div>
            <style jsx>{`
                .gig-card-wrapper {
                    width: 280px;
                    flex-shrink: 0;
                    scroll-snap-align: start;
                }
                @media (max-width: 640px) {
                    .gig-card-wrapper {
                        width: 260px;
                    }
                }
            `}</style>
        </Link>
    );
});