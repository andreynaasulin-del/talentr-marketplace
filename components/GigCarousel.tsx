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
                    background: #F7F7F9;
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

                .gig-eyebrow {
                    display: none;
                }

                .gig-title {
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    line-height: 1.2;
                    margin-bottom: 8px;
                    font-size: 24px;
                    color: #202125;
                }

                .gig-subtitle {
                    color: #545454;
                    font-size: 15px;
                    max-width: 500px;
                    font-weight: 400;
                    line-height: 1.5;
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
                    animation: scroll-left 90s linear infinite;
                }

                .gig-track-right {
                    animation: scroll-right 100s linear infinite;
                }

                .gig-row:hover .gig-track {
                    animation-play-state: paused;
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
                        animation: scroll-left 60s linear infinite;
                    }
                    .gig-track-right {
                        animation: scroll-right 65s linear infinite;
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
            <div className="block overflow-hidden rounded-xl sm:rounded-2xl bg-[#E8E8ED] shadow-sm">
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
                    <p className="text-[#999999] text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1">
                        {pkg.category}
                    </p>

                    {/* Title */}
                    <h3 className="text-[#202125] font-bold text-sm sm:text-base leading-snug line-clamp-2">
                        {pkg.title[lang]}
                    </h3>
                </div>
            </div>
            <style jsx>{`
                .gig-card-wrapper {
                    width: 300px;
                    flex-shrink: 0;
                }
                .gig-card-image {
                    height: 192px;
                }
                @media (max-width: 640px) {
                    .gig-card-wrapper {
                        width: 240px;
                    }
                    .gig-card-image {
                        height: 160px;
                    }
                }
            `}</style>
        </div>
    );
});