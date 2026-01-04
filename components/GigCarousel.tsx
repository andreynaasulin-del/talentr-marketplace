'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, MouseEvent } from 'react';

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

    // Filter packages
    const filtered = packages.filter(
        (p) =>
            !['Bartender', 'Sommelier'].includes(p.category) &&
            !/whisky|whiskey|cocktail|бар|алко/i.test(p.title.en + ' ' + (p.title.he || ''))
    );

    // Split rows
    const mid = Math.ceil(filtered.length / 2);
    const topRow = filtered.slice(0, mid);
    const bottomRow = filtered.slice(mid);

    return (
        <section className="gig-carousel-section">
            {/* Background */}
            <div className="gig-bg">
                <div className="gig-bg-gradient" />
                <div className="gig-bg-orb-gold" />
                <div className="gig-bg-orb-purple" />
            </div>

            {/* Header - respects language direction */}
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

            {/* CRITICAL: Force dir="ltr" on slider so animation physics don't break in Hebrew */}
            <div className="gig-rows" dir="ltr">
                {/* ROW 1 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-left">
                        {[...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`r1-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                    {/* Duplicate track for seamless loop */}
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
                
                .gig-bg,
                .gig-bg-gradient,
                .gig-bg-orb-gold,
                .gig-bg-orb-purple {
                    display: none;
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
                
                /* SLIDER PHYSICS - FORCE LTR */
                .gig-rows {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 60px;
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
                    gap: 32px;
                    padding: 20px 16px;
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
                
                /* Pause on hover */
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

                /* ===== MOBILE OPTIMIZATION ===== */
                @media (max-width: 768px) {
                    .gig-carousel-section {
                        padding: 32px 0 48px;
                    }
                    
                    .gig-header {
                        margin: 0 auto 24px;
                        padding: 0 12px;
                    }
                    
                    .gig-eyebrow {
                        font-size: 7px;
                        margin-bottom: 6px;
                    }
                    
                    .gig-title {
                        font-size: clamp(1.2rem, 6vw, 1.8rem);
                        margin-bottom: 8px;
                    }
                    
                    .gig-subtitle {
                        font-size: 0.75rem;
                        padding: 0 8px;
                    }
                    
                    .gig-rows {
                        gap: 16px;
                    }
                    
                    .gig-track {
                        gap: 12px;
                        padding: 8px;
                    }
                    
                    .gig-track-left {
                        animation-duration: 35s;
                    }
                    
                    .gig-track-right {
                        animation-duration: 40s;
                    }
                    
                    .gig-card-wrap {
                        width: 200px !important;
                        height: 240px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .gig-carousel-section {
                        padding: 24px 0 32px;
                    }
                    
                    .gig-title {
                        font-size: clamp(1rem, 5vw, 1.4rem);
                    }
                    
                    .gig-card-wrap {
                        width: 160px !important;
                        height: 200px !important;
                    }
                    
                    .gig-track {
                        gap: 8px;
                    }
                }
            `}</style>
        </section>
    );
}

function GigCard({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const isHebrew = lang === 'he';

    return (
        <div
            className="gig-card-wrap"
            style={{
                width: '300px',
                flexShrink: 0,
                direction: isHebrew ? 'rtl' : 'ltr'
            }}
        >
            <Link
                href={`/package/${pkg.id}`}
                className="block overflow-hidden transition-transform duration-200 hover:-translate-y-1"
            >
                {/* IMAGE CONTAINER - Top rounded only, no overlays */}
                <div className="relative aspect-[4/3] rounded-t-2xl overflow-hidden bg-[#F7F7F9]">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        sizes="320px"
                        className="object-cover"
                    />
                </div>

                {/* CONTENT CONTAINER - White, bottom rounded */}
                <div className="bg-white p-4 rounded-b-2xl shadow-sm">
                    {/* Category - Small, muted */}
                    <p className="text-[#999999] text-xs font-medium uppercase tracking-wide mb-1">
                        {pkg.category}
                    </p>

                    {/* Title - Bold, dark, max 2 lines */}
                    <h3 className="text-[#202125] font-bold text-base leading-snug line-clamp-2 mb-3">
                        {pkg.title[lang]}
                    </h3>

                    {/* Bottom row - Price/CTA */}
                    <div className="flex items-center justify-between">
                        <span className="text-[#009DE0] text-sm font-semibold">
                            {isHebrew ? 'לפרטים נוספים' : 'View Details'}
                        </span>
                        <svg className="w-4 h-4 text-[#009DE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </Link>
        </div>
    );
}