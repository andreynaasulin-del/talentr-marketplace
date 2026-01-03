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

    // Split into two rows by even/odd index; if bottom ends up empty, rebalance so both rows always render
    const topRowItems = filtered.filter((_, idx) => idx % 2 === 0);
    let bottomRowItems = filtered.filter((_, idx) => idx % 2 === 1);

    if (bottomRowItems.length === 0 && topRowItems.length > 1) {
        const half = Math.floor(topRowItems.length / 2);
        bottomRowItems = topRowItems.splice(half);
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
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <span className="exclusive-tag">Exclusive</span>
                    <h2 className="section-title">{t.title}</h2>
                    <p className="section-subtitle">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* Two-Row Marquee */}
            <div className="marquee-wrapper">
                <MarqueeRow items={topRowItems} direction="left" speed={70} lang={lang} />
                <MarqueeRow items={bottomRowItems} direction="right" speed={80} lang={lang} />
            </div>

            <style jsx global>{`
                /* ===== SECTION ===== */
                .gig-section {
                    position: relative;
                    padding: 60px 0 80px;
                    background: #020617;
                    overflow: hidden;
                }

                /* ===== AMBIENT BACKGROUND ===== */
                .ambient-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                }
                .ambient-gradient {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 100% 80% at 50% 30%, rgba(15, 30, 55, 1) 0%, rgba(2, 6, 23, 1) 100%);
                }
                .ambient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.4;
                }
                .ambient-orb-1 {
                    top: 10%;
                    left: 20%;
                    width: 500px;
                    height: 500px;
                    background: rgba(59, 130, 246, 0.15);
                }
                .ambient-orb-2 {
                    bottom: 20%;
                    right: 15%;
                    width: 400px;
                    height: 400px;
                    background: rgba(212, 175, 55, 0.1);
                }

                /* ===== HEADER ===== */
                .section-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 50px;
                    padding: 0 24px;
                }
                .exclusive-tag {
                    display: inline-block;
                    font-size: 10px;
                    font-weight: 800;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.7em;
                    margin-bottom: 20px;
                    font-style: italic;
                }
                .section-title {
                    font-size: clamp(2.5rem, 8vw, 6rem);
                    font-weight: 900;
                    color: white;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    margin-bottom: 16px;
                }
                .section-subtitle {
                    color: rgba(255, 255, 255, 0.25);
                    font-size: clamp(0.95rem, 1.8vw, 1.25rem);
                    max-width: 500px;
                    margin: 0 auto;
                    font-style: italic;
                    line-height: 1.5;
                }

                /* ===== MARQUEE WRAPPER ===== */
                .marquee-wrapper {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* ===== MARQUEE ROW (Soft Edges + Infinite) ===== */
                .marquee-row {
                    width: 100%;
                    overflow: hidden;
                    /* Soft fade edges */
                    mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 8%,
                        black 92%,
                        transparent 100%
                    );
                    -webkit-mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 8%,
                        black 92%,
                        transparent 100%
                    );
                }

                .marquee-track {
                    display: flex;
                    gap: 20px;
                    width: max-content;
                    /* GPU-accelerated animation */
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }

                .marquee-track.direction-left {
                    animation: marquee-float-left var(--duration) linear infinite;
                }
                .marquee-track.direction-right {
                    animation: marquee-float-right var(--duration) linear infinite;
                }

                /* Pause on hover */
                .marquee-row:hover .marquee-track {
                    animation-play-state: paused;
                }

                @keyframes marquee-float-left {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(-50%, 0, 0);
                    }
                }

                @keyframes marquee-float-right {
                    0% {
                        transform: translate3d(-50%, 0, 0);
                    }
                    100% {
                        transform: translate3d(0, 0, 0);
                    }
                }

                /* ===== CUBE CARD (Optimized - no heavy filters during animation) ===== */
                .cube-card {
                    flex-shrink: 0;
                    width: 280px;
                    aspect-ratio: 1 / 1;
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    /* Simple background, no blur during movement */
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
                    /* GPU optimization */
                    transform: translateZ(0);
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                }

                .cube-card:hover {
                    transform: translateZ(0) scale(1.03) rotateY(3deg) rotateX(2deg);
                    box-shadow: 
                        0 30px 60px rgba(0, 0, 0, 0.5),
                        0 0 30px rgba(212, 175, 55, 0.15);
                }

                /* Image */
                .cube-image {
                    position: absolute;
                    inset: 8px;
                    border-radius: 14px;
                    overflow: hidden;
                }

                .cube-image img {
                    object-fit: cover;
                    transition: transform 0.6s ease, opacity 0.4s ease;
                    opacity: 0.85;
                }

                .cube-card:hover .cube-image img {
                    transform: scale(1.1);
                    opacity: 1;
                }

                /* Glass overlay - simple gradient, no blur */
                .cube-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        180deg,
                        transparent 40%,
                        rgba(0, 0, 0, 0.7) 100%
                    );
                    pointer-events: none;
                }

                /* Gold frame */
                .cube-frame {
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    border: 1.5px solid transparent;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.4), transparent 40%, transparent 60%, rgba(212, 175, 55, 0.4)) border-box;
                    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    opacity: 0.3;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }

                .cube-card:hover .cube-frame {
                    opacity: 1;
                }

                /* Text content */
                .cube-content {
                    position: absolute;
                    bottom: 16px;
                    left: 16px;
                    right: 16px;
                    z-index: 5;
                }

                .cube-category {
                    font-size: 9px;
                    font-weight: 700;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                }

                .cube-title {
                    font-family: var(--font-serif), Georgia, serif;
                    font-size: 20px;
                    font-weight: 400;
                    color: white;
                    margin-top: 4px;
                    letter-spacing: 0.05em;
                    line-height: 1.2;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                }

                .cube-arrow {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transform: translateY(-5px);
                    transition: all 0.3s ease;
                }

                .cube-card:hover .cube-arrow {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Shine effect */
                .cube-shine {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        105deg,
                        transparent 30%,
                        rgba(255, 255, 255, 0.08) 45%,
                        rgba(255, 255, 255, 0.15) 50%,
                        rgba(255, 255, 255, 0.08) 55%,
                        transparent 70%
                    );
                    opacity: 0;
                    transform: translateX(-100%);
                    transition: opacity 0.2s ease;
                    pointer-events: none;
                    border-radius: 20px;
                }

                .cube-card:hover .cube-shine {
                    opacity: 1;
                    animation: shine-pass 1s ease forwards;
                }

                @keyframes shine-pass {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                /* Mobile adjustments */
                @media (max-width: 768px) {
                    .cube-card {
                        width: 220px;
                    }
                    .marquee-track {
                        gap: 16px;
                    }
                    .marquee-wrapper {
                        gap: 16px;
                    }
                    .section-header {
                        margin-bottom: 40px;
                    }
                    .gig-section {
                        padding: 50px 0 60px;
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
    // Duplicate items for seamless infinite loop
    const loopItems = [...items, ...items];

    return (
        <div className="marquee-row">
            <div
                className={`marquee-track direction-${direction}`}
                style={{ '--duration': `${speed}s` } as React.CSSProperties}
            >
                {loopItems.map((pkg, idx) => (
                    <CubeCard key={`${pkg.id}-${idx}`} pkg={pkg} lang={lang} />
                ))}
            </div>
        </div>
    );
}

function CubeCard({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    return (
        <Link href={`/package/${pkg.id}`} className="cube-card">
            {/* Image */}
            <div className="cube-image">
                <Image
                    src={pkg.image}
                    alt={pkg.title[lang]}
                    fill
                    sizes="280px"
                />
            </div>

            {/* Dark gradient overlay */}
            <div className="cube-overlay" />

            {/* Gold frame */}
            <div className="cube-frame" />

            {/* Shine effect */}
            <div className="cube-shine" />

            {/* Arrow */}
            <div className="cube-arrow">
                <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Text */}
            <div className="cube-content">
                <span className="cube-category">{pkg.category}</span>
                <h3 className="cube-title">{pkg.title[lang]}</h3>
            </div>
        </Link>
    );
}
