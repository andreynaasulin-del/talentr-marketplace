'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { MapPin, Clock, Users } from 'lucide-react';

interface Gig {
    id: string;
    title: string;
    category_id: string;
    short_description?: string;
    photos?: string[];
    is_free?: boolean;
    pricing_type?: string;
    price_amount?: number;
    currency?: string;
    base_city?: string;
    duration_minutes?: number;
    max_guests?: number;
    share_slug?: string;
    vendor?: {
        name?: string;
        avatar_url?: string;
    };
}

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Force mock data mode
        setGigs(MOCK_GIGS);
        setLoading(false);
    }, []);

    const MOCK_GIGS: Gig[] = [
        {
            id: 'pkg-1',
            title: 'חווית שף פרטי', // Private Chef Experience
            category_id: 'PRIVATE CHEF',
            photos: ['/talentr/Private Chef.jpg'],
            price_amount: 2500,
            currency: 'ILS',
            pricing_type: 'starting',
            base_city: 'Tel Aviv',
            duration_minutes: 180,
            max_guests: 20,
            vendor: { name: 'Chef Mario', avatar_url: '' }
        },
        {
            id: 'pkg-2',
            title: 'שירותי בר ומחזמר', // Bar Services
            category_id: 'BARTENDER',
            photos: ['/talentr/Bartender.jpg'],
            price_amount: 1200,
            currency: 'ILS',
            pricing_type: 'event',
            base_city: 'Herzliya',
            duration_minutes: 240,
            max_guests: 50,
            vendor: { name: 'Mixology Pro', avatar_url: '' }
        },
        {
            id: 'pkg-3',
            title: 'מופע סטנד-אפ', // Stand-up Show
            category_id: 'STAND-UP COMEDIAN',
            photos: ['/talentr/Stand-up Comedian.jpg'],
            price_amount: 3000,
            currency: 'ILS',
            pricing_type: 'fixed',
            base_city: 'TLV / Center',
            duration_minutes: 45,
            max_guests: 200,
            vendor: { name: 'Comedy Club', avatar_url: '' }
        },
        {
            id: 'pkg-4',
            title: 'מאמן רולרבלייד', // Rollerblade Coach
            category_id: 'ROLLERBLADE COACH',
            photos: ['/talentr/Rollerblade Coach.jpg'],
            price_amount: 250,
            currency: 'ILS',
            pricing_type: 'session',
            base_city: 'Yarkon Park',
            duration_minutes: 60,
            max_guests: 5,
            vendor: { name: 'Roll With It', avatar_url: '' }
        },
        {
            id: 'pkg-5',
            title: 'די-ג׳יי לאירועים', // Event DJ
            category_id: 'DJ SET',
            photos: ['/talentr/DJ.jpg'],
            price_amount: 1800,
            currency: 'ILS',
            pricing_type: 'event',
            base_city: 'Nationwide',
            duration_minutes: 300,
            max_guests: 500,
            vendor: { name: 'Beat Master', avatar_url: '' }
        },
        {
            id: 'pkg-6',
            title: 'אמן אשליות', // Illusionist
            category_id: 'ILLUSIONIST',
            photos: ['/talentr/Illusionist.jpg'],
            price_amount: 1500,
            currency: 'ILS',
            pricing_type: 'show',
            base_city: 'Jerusalem',
            duration_minutes: 45,
            max_guests: 100,
            vendor: { name: 'Magic Touch', avatar_url: '' }
        },
        {
            id: 'pkg-7',
            title: 'מוזיקה חיה', // Live Music
            category_id: 'LIVE MUSICIAN',
            photos: ['/talentr/Live Musician .jpg'],
            price_amount: 1000,
            currency: 'ILS',
            pricing_type: 'hourly',
            base_city: 'Tel Aviv',
            duration_minutes: 90,
            max_guests: 150,
            vendor: { name: 'Acoustic Duo', avatar_url: '' }
        },
        {
            id: 'pkg-8',
            title: 'שולחן פוקר לאירועים', // Poker Table
            category_id: 'POKER CROUPIER',
            photos: ['/talentr/Poker Croupier .jpg'],
            price_amount: 2200,
            currency: 'ILS',
            pricing_type: 'table',
            base_city: 'Center',
            duration_minutes: 180,
            max_guests: 10,
            vendor: { name: 'Casino Royale Events', avatar_url: '' }
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
                <div className="flex gap-4 px-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-[280px] h-[280px] bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse flex-shrink-0" />
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

    // Split for two rows
    const mid = Math.ceil(gigs.length / 2);
    const topRow = gigs.slice(0, mid);
    const bottomRow = gigs.slice(mid);

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
                        {[...topRow, ...topRow].map((gig, i) => (
                            <GigCard key={`r1-${gig.id}-${i}`} gig={gig} lang={lang} t={t} />
                        ))}
                    </div>
                    <div className="gig-track gig-track-left" aria-hidden="true">
                        {[...topRow, ...topRow].map((gig, i) => (
                            <GigCard key={`r1-dup-${gig.id}-${i}`} gig={gig} lang={lang} t={t} />
                        ))}
                    </div>
                </div>

                {/* ROW 2 */}
                {bottomRow.length > 0 && (
                    <div className="gig-row">
                        <div className="gig-track gig-track-right">
                            {[...bottomRow, ...bottomRow].map((gig, i) => (
                                <GigCard key={`r2-${gig.id}-${i}`} gig={gig} lang={lang} t={t} />
                            ))}
                        </div>
                        <div className="gig-track gig-track-right" aria-hidden="true">
                            {[...bottomRow, ...bottomRow].map((gig, i) => (
                                <GigCard key={`r2-dup-${gig.id}-${i}`} gig={gig} lang={lang} t={t} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .gig-carousel-section {
                    position: relative;
                    padding: 48px 0 64px;
                    background: var(--bg-primary);
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    transition: background-color 0.2s ease;
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
                    font-size: 24px;
                    color: var(--text-primary);
                    transition: color 0.2s ease;
                }

                .gig-subtitle {
                    color: var(--text-muted);
                    font-size: 15px;
                    max-width: 500px;
                    font-weight: 400;
                    line-height: 1.5;
                    transition: color 0.2s ease;
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
                    padding: 10px 16px;
                    flex-shrink: 0;
                    width: max-content;
                    will-change: transform;
                }

                .gig-track-left {
                    animation: scroll-left 120s linear infinite;
                }

                .gig-track-right {
                    animation: scroll-right 130s linear infinite;
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }

                @keyframes scroll-right {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }

                @media (max-width: 768px) {
                    .gig-carousel-section {
                        padding: 24px 0 32px;
                    }
                    .gig-header {
                        margin-bottom: 20px;
                        padding: 0 12px;
                    }
                    .gig-title {
                        font-size: 20px;
                        margin-bottom: 4px;
                    }
                    .gig-subtitle {
                        font-size: 13px;
                    }
                    .gig-rows {
                        gap: 16px;
                    }
                    .gig-track {
                        gap: 12px;
                        padding: 8px 12px;
                    }
                    .gig-track-left {
                        animation: scroll-left 80s linear infinite;
                    }
                    .gig-track-right {
                        animation: scroll-right 85s linear infinite;
                    }
                }
            `}</style>
        </section>
    );
}

// Gig Card Component
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
    const photo = gig.photos?.[0] || '/placeholder-gig.jpg';
    const link = gig.share_slug ? `/g/${gig.share_slug}` : `/gig/${gig.id}`;

    const formatPrice = () => {
        if (gig.is_free) return t.free;
        if (!gig.price_amount) return null;
        const symbol = gig.currency === 'USD' ? '$' : '₪';
        if (gig.pricing_type === 'from') {
            return `${t.from} ${symbol}${gig.price_amount.toLocaleString()}`;
        }
        return `${symbol}${gig.price_amount.toLocaleString()}`;
    };

    return (
        <Link
            href={link}
            className="gig-card-wrapper group"
            style={{ direction: isHebrew ? 'rtl' : 'ltr' }}
        >
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-500/50 dark:group-hover:border-blue-500/30 transition-all shadow-md dark:shadow-none group-hover:shadow-lg">
                {/* IMAGE */}
                <div className="relative h-[160px] overflow-hidden">
                    <Image
                        src={photo}
                        alt={gig.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="280px"
                    />

                </div>

                {/* CONTENT */}
                <div className="p-4">
                    {/* Category */}
                    <p className="text-blue-600 dark:text-blue-400 text-xs font-medium uppercase tracking-wide mb-1">
                        {gig.category_id}
                    </p>

                    {/* Title */}
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {gig.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                        {gig.base_city && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {gig.base_city}
                            </span>
                        )}
                        {gig.duration_minutes && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {gig.duration_minutes} min
                            </span>
                        )}
                        {gig.max_guests && (
                            <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {gig.max_guests}
                            </span>
                        )}
                    </div>

                    {/* Vendor */}
                    {gig.vendor?.name && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                            {gig.vendor.avatar_url ? (
                                <Image
                                    src={gig.vendor.avatar_url}
                                    alt={gig.vendor.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                    {gig.vendor.name[0]}
                                </div>
                            )}
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                                {gig.vendor.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .gig-card-wrapper {
                    width: 280px;
                    flex-shrink: 0;
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