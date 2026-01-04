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
                    padding: 64px 0 80px;
                    background: #F5F5F5;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                }
                
                .gig-bg {
                    display: none;
                }
                
                .gig-bg-gradient,
                .gig-bg-orb-gold,
                .gig-bg-orb-purple {
                    display: none;
                }
                
                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 48px;
                    padding: 0 24px;
                    text-align: center;
                }
                
                .gig-eyebrow {
                    display: inline-block;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: #6B7280;
                    letter-spacing: 0.1em;
                }
                
                .gig-title {
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                    margin-bottom: 12px;
                    font-size: clamp(1.75rem, 4vw, 2.5rem);
                    color: #111827;
                }
                
                .gig-subtitle {
                    color: #6B7280;
                    font-size: clamp(0.9rem, 1.5vw, 1.1rem);
                    max-width: 500px;
                    margin: 0 auto;
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
            className="gig-card-wrap group"
            style={{
                width: '260px',
                flexShrink: 0,
                direction: isHebrew ? 'rtl' : 'ltr'
            }}
        >
            <Link href={`/package/${pkg.id}`} className="block">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                </div>

                {/* Text */}
                <div className="px-1">
                    <p className="text-gray-500 text-xs font-medium mb-1">
                        {pkg.category}
                    </p>
                    <h3 className="text-gray-900 font-semibold text-sm leading-snug">
                        {pkg.title[lang]}
                    </h3>
                </div>
            </Link>
        </div>
    );
}