'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { memo } from 'react';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';

    const content = {
        en: {
            title: 'The Collection',
            subtitle: 'Curated artistic experiences, encased in digital crystal.',
        },
        he: {
            title: 'האוסף',
            subtitle: 'חוויות אמנותיות נבחרות, עטופות בקריסטל דיגיטלי.',
        },
    };

    const t = content[lang];

    // Show all packages
    const filtered = packages;
    const mid = Math.ceil(filtered.length / 2);
    const topRow = filtered.slice(0, mid);
    const bottomRow = filtered.slice(mid);

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
                    <span className="gig-eyebrow">Exclusive</span>
                    <h2 className="gig-title">{t.title}</h2>
                    <p className="gig-subtitle">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* Carousel Rows */}
            <div className="gig-rows" dir="ltr">
                {/* ROW 1 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-left">
                        {[...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`r1-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                    {/* Duplicate track for loop */}
                    <div className="gig-track gig-track-left" aria-hidden="true">
                        {[...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`r1-dup-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-right">
                        {[...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`r2-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                    <div className="gig-track gig-track-right" aria-hidden="true">
                        {[...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`r2-dup-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
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
                    transition: background-color 0.2s ease;
                }

                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1200px;
                    margin: 0 auto 32px;
                    padding: 0 16px;
                }

                .gig-eyebrow {
                    display: none;
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
                    gap: 40px;
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
                    gap: 20px;
                    padding: 10px 16px;
                    flex-shrink: 0;
                    width: max-content;
                    will-change: transform;
                }

                .gig-track-left {
                    animation: scroll-left 150s linear infinite;
                }

                .gig-track-right {
                    animation: scroll-right 160s linear infinite;
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
                        animation: scroll-left 100s linear infinite;
                    }
                    .gig-track-right {
                        animation: scroll-right 105s linear infinite;
                    }
                }
            `}</style>
        </section>
    );
}

// Separate component for performance
const GigCard = memo(function GigCard({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const isHebrew = lang === 'he';

    return (
        <div
            className="gig-card-wrapper"
            style={{
                direction: isHebrew ? 'rtl' : 'ltr'
            }}
        >
            <div className="block overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-600/30 transition-colors shadow-md dark:shadow-none">
                {/* IMAGE */}
                <div className="gig-card-image relative overflow-hidden">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 240px, 300px"
                    />
                </div>

                {/* CONTENT */}
                <div className="p-3 sm:p-4">
                    {/* Category */}
                    <p className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1">
                        {pkg.category}
                    </p>

                    {/* Title */}
                    <h3 className="text-zinc-900 dark:text-white font-bold text-sm sm:text-base leading-snug line-clamp-2">
                        {pkg.title[lang]}
                    </h3>
                </div>
            </div>
            <style jsx>{`
                .gig-card-wrapper {
                    width: 240px;
                    flex-shrink: 0;
                }
                .gig-card-image {
                    height: 140px;
                }
                @media (max-width: 640px) {
                    .gig-card-wrapper {
                        width: 200px;
                    }
                    .gig-card-image {
                        height: 120px;
                    }
                }
            `}</style>
        </div>
    );
});