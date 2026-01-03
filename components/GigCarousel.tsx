'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function GigCarousel() {
    const { language } = useLanguage();
    // Support en, he, and fallback for ru
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

    // Filter: no alcohol
    const filtered = packages.filter(
        (p) =>
            !['Bartender', 'Sommelier'].includes(p.category) &&
            !/whisky|whiskey|cocktail|бар|алко/i.test(p.title.en + ' ' + (p.title.he || ''))
    );

    // Guaranteed two rows rebalancing
    const mid = Math.ceil(filtered.length / 2);
    const topRowItems = filtered.slice(0, mid);
    const bottomRowItems = filtered.slice(mid);

    // Final safety: if one row is somehow empty but we have items, split them
    let finalTop = topRowItems;
    let finalBottom = bottomRowItems;
    if (finalBottom.length === 0 && finalTop.length > 1) {
        const split = Math.ceil(finalTop.length / 2);
        finalBottom = finalTop.slice(split);
        finalTop = finalTop.slice(0, split);
    }

    return (
        <section id="packages" className="gig-section">
            {/* Ambient Background */}
            <div className="ambient-bg">
                <div className="ambient-gradient" />
                <div className="ambient-orb ambient-orb-1" />
                <div className="ambient-orb ambient-orb-2" />
            </div>

            {/* Header */}
            <div className="section-header">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <span className="exclusive-tag">Exclusive</span>
                    <h2 className="section-title">{t.title}</h2>
                    <p className="section-subtitle">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* TWO ROWS - Force LTR container for technical movement consistency */}
            <div className="marquee-rows-container">
                {/* TOP ROW: Moves Left */}
                <div className="marquee-row-outer">
                    <MarqueeRow items={finalTop} direction="left" speed={75} lang={lang} />
                </div>
                
                {/* BOTTOM ROW: Moves Right */}
                <div className="marquee-row-outer">
                    <MarqueeRow items={finalBottom.length > 0 ? finalBottom : finalTop} direction="right" speed={85} lang={lang} />
                </div>
            </div>

            <style jsx global>{`
                /* ===== SECTION ===== */
                .gig-section {
                    position: relative;
                    padding: 120px 0;
                    background: #020617;
                    overflow: hidden;
                }

                /* ===== AMBIENT BACKGROUND ===== */
                .ambient-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
                .ambient-gradient {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 100% 80% at 50% 30%, rgba(15, 30, 55, 1) 0%, rgba(2, 6, 23, 1) 100%);
                }
                .ambient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.25;
                    animation: float-orb 20s ease-in-out infinite alternate;
                }
                .ambient-orb-1 {
                    top: 10%;
                    left: 5%;
                    width: 700px;
                    height: 700px;
                    background: rgba(59, 130, 246, 0.15);
                }
                .ambient-orb-2 {
                    bottom: 5%;
                    right: 0%;
                    width: 600px;
                    height: 600px;
                    background: rgba(212, 175, 55, 0.1);
                    animation-delay: -7s;
                }
                @keyframes float-orb {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(60px, 50px) scale(1.1); }
                }

                /* ===== HEADER ===== */
                .section-header {
                    position: relative;
                    z-index: 30;
                    max-width: 1280px;
                    margin: 0 auto 100px;
                    padding: 0 24px;
                }
                .exclusive-tag {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 900;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.8em;
                    margin-bottom: 24px;
                    font-style: italic;
                }
                .section-title {
                    font-size: clamp(3.5rem, 12vw, 10rem);
                    font-weight: 900;
                    color: white;
                    letter-spacing: -0.05em;
                    line-height: 0.85;
                    margin-bottom: 24px;
                    text-transform: uppercase;
                }
                .section-subtitle {
                    color: rgba(255, 255, 255, 0.3);
                    font-size: clamp(1rem, 2.5vw, 1.5rem);
                    max-width: 600px;
                    margin: 0 auto;
                    font-style: italic;
                    line-height: 1.6;
                }

                /* ===== MARQUEE SYSTEM ===== */
                .marquee-rows-container {
                    position: relative;
                    z-index: 20;
                    display: flex;
                    flex-direction: column;
                    gap: 50px; /* Distinct gap between rows */
                    direction: ltr !important; /* Force LTR for movement logic */
                }

                .marquee-row-outer {
                    width: 100%;
                    overflow: hidden;
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }

                .marquee-track {
                    display: flex;
                    gap: 40px;
                    width: max-content;
                    padding: 30px 0;
                    will-change: transform;
                }

                .marquee-track.direction-left {
                    animation: marquee-move-left var(--duration) linear infinite;
                }

                .marquee-track.direction-right {
                    animation: marquee-move-right var(--duration) linear infinite;
                }

                .marquee-row-outer:hover .marquee-track {
                    animation-play-state: paused;
                }

                @keyframes marquee-move-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.3333%, 0, 0); }
                }

                @keyframes marquee-move-right {
                    0% { transform: translate3d(-33.3333%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }

                /* ===== CUBE CARD WRAPPER ===== */
                .cube-wrapper {
                    flex-shrink: 0;
                    width: 350px;
                    aspect-ratio: 1 / 1;
                    perspective: 2000px;
                    animation: swim var(--swim-speed) ease-in-out infinite alternate;
                }

                @keyframes swim {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-15px) rotate(1deg); }
                }

                /* ===== CUBE CARD CORE ===== */
                .cube-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 32px;
                    overflow: hidden;
                    transform-style: preserve-3d;
                    transition: all 0.6s cubic-bezier(0.2, 1, 0.2, 1);
                    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
                }

                .cube-card:hover {
                    transform: scale(1.04) rotateY(10deg) rotateX(5deg);
                    border-color: rgba(212, 175, 55, 0.4);
                    box-shadow: 
                        0 50px 100px rgba(0, 0, 0, 0.8),
                        0 0 50px rgba(212, 175, 55, 0.2);
                }

                /* Image Layer (Base) */
                .cube-img {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    transform: translateZ(0);
                }
                .cube-img img {
                    object-fit: cover;
                    opacity: 0.75;
                    transition: transform 1.2s ease, opacity 0.8s ease;
                }
                .cube-card:hover .cube-img img {
                    transform: scale(1.15);
                    opacity: 1;
                }

                /* Glass Layer (Middle) */
                .cube-glass {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.9) 100%);
                    pointer-events: none;
                    transform: translateZ(20px);
                }

                /* Gold Frame (Top) */
                .cube-border {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    border: 1.5px solid transparent;
                    border-radius: 32px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.6), transparent, rgba(212, 175, 55, 0.6)) border-box;
                    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    opacity: 0.2;
                    transition: opacity 0.6s ease;
                    transform: translateZ(40px);
                }
                .cube-card:hover .cube-border {
                    opacity: 1;
                }

                /* Content Layer (Topmost) */
                .cube-info {
                    position: absolute;
                    bottom: 30px;
                    left: 30px;
                    right: 30px;
                    z-index: 4;
                    transform: translateZ(60px);
                    direction: var(--text-dir);
                }
                .cube-tag {
                    font-size: 11px;
                    font-weight: 900;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.4em;
                    margin-bottom: 10px;
                    display: block;
                }
                .cube-name {
                    font-family: var(--font-serif), Georgia, serif;
                    font-size: 28px;
                    font-weight: 400;
                    color: white;
                    letter-spacing: 0.05em;
                    line-height: 1.2;
                    text-shadow: 0 5px 20px rgba(0, 0, 0, 0.8);
                }

                /* Interaction Elements */
                .cube-link {
                    position: absolute;
                    top: 30px;
                    right: 30px;
                    z-index: 5;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transform: translateZ(80px) translate(15px, -15px);
                    transition: all 0.5s ease;
                }
                .cube-card:hover .cube-link {
                    opacity: 1;
                    transform: translateZ(80px) translate(0, 0);
                }

                /* Shine Sweep */
                .cube-glare {
                    position: absolute;
                    inset: 0;
                    z-index: 6;
                    background: linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%);
                    opacity: 0;
                    transform: translateX(-100%);
                    pointer-events: none;
                }
                .cube-card:hover .cube-glare {
                    animation: glare-sweep 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                @keyframes glare-sweep {
                    0% { transform: translateX(-100%); opacity: 0; }
                    40% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .cube-wrapper {
                        width: 280px;
                    }
                    .marquee-track {
                        gap: 24px;
                    }
                    .marquee-rows-container {
                        gap: 30px;
                    }
                    .section-header {
                        margin-bottom: 60px;
                    }
                    .gig-section {
                        padding: 80px 0;
                    }
                }
            `}</style>
        </section>
    );
}

function MarqueeRow({
    items,
    direction,
    speed,
    lang
}: {
    items: Package[];
    direction: 'left' | 'right';
    speed: number;
    lang: 'en' | 'he';
}) {
    // 3 duplicates for ultra-wide screens and smooth looping
    const loopItems = [...items, ...items, ...items];

    return (
        <div className="marquee-track-container">
            <div
                className={`marquee-track direction-${direction}`}
                style={{ '--duration': `${speed}s` } as React.CSSProperties}
            >
                {loopItems.map((pkg, idx) => (
                    <CubeCard key={`${pkg.id}-${idx}`} pkg={pkg} lang={lang} index={idx} />
                ))}
            </div>
        </div>
    );
}

function CubeCard({ pkg, lang, index }: { pkg: Package; lang: 'en' | 'he', index: number }) {
    // Natural floating variation
    const swimSpeed = 4 + (index % 4) * 0.8;
    const textDir = lang === 'he' ? 'rtl' : 'ltr';

    return (
        <div 
            className="cube-wrapper" 
            style={{ 
                '--swim-speed': `${swimSpeed}s`,
                '--text-dir': textDir
            } as React.CSSProperties}
        >
            <Link href={`/package/${pkg.id}`} className="cube-card">
                <div className="cube-img">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        sizes="350px"
                    />
                </div>
                <div className="cube-glass" />
                <div className="cube-border" />
                <div className="cube-glare" />
                <div className="cube-link">
                    <ArrowUpRight className="w-6 h-6" />
                </div>
                <div className="cube-info">
                    <span className="cube-tag">{pkg.category}</span>
                    <h3 className="cube-name">{pkg.title[lang]}</h3>
                </div>
            </Link>
        </div>
    );
}
