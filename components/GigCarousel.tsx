'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

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
            !/whisky|whiskey|cocktail|бар|алко/i.test(p.title.en + ' ' + p.title.he)
    );

    // Split into two distinct rows to ensure they are visible
    const mid = Math.ceil(filtered.length / 2);
    const topRowItems = filtered.slice(0, mid);
    const bottomRowItems = filtered.slice(mid);

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

            {/* TWO ROWS - Wolt Style */}
            <div className="marquee-container">
                {/* TOP ROW: Moves Left */}
                {topRowItems.length > 0 && (
                    <div className="marquee-row-wrapper">
                        <MarqueeRow items={topRowItems} direction="left" speed={60} lang={lang} />
                    </div>
                )}
                
                {/* BOTTOM ROW: Moves Right */}
                {bottomRowItems.length > 0 && (
                    <div className="marquee-row-wrapper">
                        <MarqueeRow items={bottomRowItems} direction="right" speed={70} lang={lang} />
                    </div>
                )}
            </div>

            <style jsx global>{`
                /* ===== SECTION ===== */
                .gig-section {
                    position: relative;
                    padding: 100px 0 120px;
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
                    opacity: 0.3;
                    animation: float-orb 15s ease-in-out infinite alternate;
                }
                .ambient-orb-1 {
                    top: 15%;
                    left: 10%;
                    width: 600px;
                    height: 600px;
                    background: rgba(59, 130, 246, 0.2);
                }
                .ambient-orb-2 {
                    bottom: 10%;
                    right: 5%;
                    width: 500px;
                    height: 500px;
                    background: rgba(212, 175, 55, 0.15);
                    animation-delay: -5s;
                }
                @keyframes float-orb {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 40px); }
                }

                /* ===== HEADER ===== */
                .section-header {
                    position: relative;
                    z-index: 20;
                    max-width: 1280px;
                    margin: 0 auto 80px;
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
                    font-size: clamp(3rem, 10vw, 9rem);
                    font-weight: 900;
                    color: white;
                    letter-spacing: -0.04em;
                    line-height: 0.9;
                    margin-bottom: 20px;
                }
                .section-subtitle {
                    color: rgba(255, 255, 255, 0.2);
                    font-size: clamp(1rem, 2vw, 1.4rem);
                    max-width: 550px;
                    margin: 0 auto;
                    font-style: italic;
                    line-height: 1.6;
                }

                /* ===== MARQUEE CONTAINER ===== */
                .marquee-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 30px; /* Strong gap between rows */
                }

                .marquee-row-wrapper {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    /* Soft fade edges */
                    mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 10%,
                        black 90%,
                        transparent 100%
                    );
                    -webkit-mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 10%,
                        black 90%,
                        transparent 100%
                    );
                }

                .marquee-track {
                    display: flex;
                    gap: 30px;
                    width: max-content;
                    padding: 20px 0;
                    will-change: transform;
                }

                .marquee-track.direction-left {
                    animation: marquee-scroll-left var(--duration) linear infinite;
                }
                .marquee-track.direction-right {
                    animation: marquee-scroll-right var(--duration) linear infinite;
                }

                .marquee-row-wrapper:hover .marquee-track {
                    animation-play-state: paused;
                }

                @keyframes marquee-scroll-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.3333%, 0, 0); }
                }

                @keyframes marquee-scroll-right {
                    0% { transform: translate3d(-33.3333%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }

                /* ===== CUBE CARD (Floaty Luxury) ===== */
                .cube-card-wrapper {
                    flex-shrink: 0;
                    width: 320px;
                    aspect-ratio: 1 / 1;
                    animation: levitate var(--levitate-duration) ease-in-out infinite alternate;
                }

                @keyframes levitate {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-10px); }
                }

                .cube-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
                    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .cube-card:hover {
                    transform: scale(1.05) rotateY(5deg) rotateX(3deg);
                    border-color: rgba(212, 175, 55, 0.3);
                    box-shadow: 
                        0 40px 80px rgba(0, 0, 0, 0.6),
                        0 0 40px rgba(212, 175, 55, 0.2);
                }

                /* Image */
                .cube-image {
                    position: absolute;
                    inset: 0;
                }
                .cube-image img {
                    object-fit: cover;
                    opacity: 0.8;
                    transition: transform 1s ease, opacity 0.6s ease;
                }
                .cube-card:hover .cube-image img {
                    transform: scale(1.15);
                    opacity: 1;
                }

                /* Overlay */
                .cube-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
                    pointer-events: none;
                }

                /* Frame */
                .cube-frame {
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    border: 1.5px solid transparent;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.5), transparent, rgba(212, 175, 55, 0.5)) border-box;
                    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    opacity: 0.2;
                    transition: opacity 0.5s ease;
                }
                .cube-card:hover .cube-frame {
                    opacity: 1;
                }

                /* Content */
                .cube-content {
                    position: absolute;
                    bottom: 24px;
                    left: 24px;
                    right: 24px;
                    z-index: 5;
                }
                .cube-category {
                    font-size: 10px;
                    font-weight: 800;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.4em;
                    margin-bottom: 8px;
                    display: block;
                }
                .cube-title {
                    font-family: var(--font-serif), Georgia, serif;
                    font-size: 26px;
                    font-weight: 400;
                    color: white;
                    letter-spacing: 0.05em;
                    line-height: 1.2;
                    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
                }

                /* Arrow Icon */
                .cube-arrow {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transform: translate(10px, -10px);
                    transition: all 0.4s ease;
                }
                .cube-card:hover .cube-arrow {
                    opacity: 1;
                    transform: translate(0, 0);
                }

                /* Shine */
                .cube-shine {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%);
                    opacity: 0;
                    transform: translateX(-100%);
                    pointer-events: none;
                }
                .cube-card:hover .cube-shine {
                    animation: shine-sweep 1.2s ease forwards;
                }
                @keyframes shine-sweep {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .cube-card-wrapper {
                        width: 250px;
                    }
                    .marquee-track {
                        gap: 20px;
                    }
                    .marquee-container {
                        gap: 20px;
                    }
                    .section-header {
                        margin-bottom: 50px;
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
    // 3 duplicates for ultra-wide screens
    const loopItems = [...items, ...items, ...items];

    return (
        <div className="marquee-row">
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
    // Variation in levitation duration for "natural" look
    const levDuration = 3 + (index % 3) * 0.7;

    return (
        <div className="cube-card-wrapper" style={{ '--levitate-duration': `${levDuration}s` } as React.CSSProperties}>
            <Link href={`/package/${pkg.id}`} className="cube-card">
                <div className="cube-image">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        sizes="320px"
                    />
                </div>
                <div className="cube-overlay" />
                <div className="cube-frame" />
                <div className="cube-shine" />
                <div className="cube-arrow">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="cube-content">
                    <span className="cube-category">{pkg.category}</span>
                    <h3 className="cube-title">{pkg.title[lang]}</h3>
                </div>
            </Link>
        </div>
    );
}
