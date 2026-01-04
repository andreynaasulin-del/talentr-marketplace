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
                    background: #020304;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    overflow-x: hidden !important;
                }
                
                .gig-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }
                
                .gig-bg-gradient {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(20,20,25,1) 0%, #000 80%);
                }
                
                .gig-bg-orb-gold {
                    position: absolute;
                    top: -10%;
                    left: 20%;
                    width: 800px;
                    height: 800px;
                    border-radius: 50%;
                    background: #D4AF37;
                    filter: blur(120px);
                    opacity: 0.15;
                    mix-blend-mode: screen;
                }
                
                .gig-bg-orb-purple {
                    position: absolute;
                    bottom: -10%;
                    right: 10%;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: #4B0082;
                    filter: blur(120px);
                    opacity: 0.15;
                    mix-blend-mode: screen;
                }
                
                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 40px;
                    padding: 0 16px;
                    text-align: center;
                }
                
                .gig-eyebrow {
                    display: inline-block;
                    text-transform: uppercase;
                    font-weight: 900;
                    margin-bottom: 8px;
                    font-size: 8px;
                    color: #D4AF37;
                    letter-spacing: 0.4em;
                    text-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
                }
                
                .gig-title {
                    font-family: var(--font-serif), serif;
                    font-weight: 400;
                    letter-spacing: -0.02em;
                    line-height: 1;
                    margin-bottom: 12px;
                    font-size: clamp(1.5rem, 5vw, 2.5rem);
                    background: linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: inline-block;
                }
                
                .gig-subtitle {
                    color: rgba(255,255,255,0.4);
                    font-size: clamp(0.8rem, 1.2vw, 1rem);
                    max-width: 500px;
                    margin: 8px auto 0;
                    font-weight: 300;
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
        <div className="gig-card-wrap group" style={{ width: '280px', height: '320px', flexShrink: 0 }}>
            <Link href={`/package/${pkg.id}`} className="block w-full h-full relative rounded-2xl overflow-hidden">
                {/* Image */}
                <Image
                    src={pkg.image}
                    alt={pkg.title[lang]}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div
                    className="absolute inset-0 flex flex-col justify-end p-5"
                    style={{ direction: isHebrew ? 'rtl' : 'ltr', textAlign: isHebrew ? 'right' : 'left' }}
                >
                    <span className="text-white/60 text-xs uppercase tracking-wider mb-2">
                        {pkg.category}
                    </span>
                    <h3 className="text-white text-xl font-semibold leading-tight">
                        {pkg.title[lang]}
                    </h3>
                </div>
            </Link>
        </div>
    );
}