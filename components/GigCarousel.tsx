'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    // All packages - no filter needed
    const filtered = packages;

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
                    padding: 60px 0 80px;
                    background: #030712;
                    overflow: hidden;
                }

                /* ===== AMBIENT BACKGROUND WITH CAUSTICS ===== */
                .ambient-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
                .ambient-gradient {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 20% 40%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 50% at 80% 30%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse 100% 80% at 50% 100%, rgba(15, 20, 35, 1) 0%, rgba(3, 7, 18, 1) 100%);
                }
                .ambient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.4;
                    animation: float-orb 20s ease-in-out infinite alternate;
                }
                .ambient-orb-1 {
                    top: 10%;
                    left: 5%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%);
                }
                .ambient-orb-2 {
                    bottom: 5%;
                    right: 10%;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(99, 155, 255, 0.2) 0%, transparent 70%);
                    animation-delay: -7s;
                }
                @keyframes float-orb {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.1); }
                    100% { transform: translate(-20px, 30px) scale(0.95); }
                }

                /* ===== MARQUEE CONTAINER ===== */
                .marquee-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .marquee-row-wrapper {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
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
                    gap: 28px;
                    width: max-content;
                    padding: 24px 0;
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

                /* ===== LUXURY CRYSTAL CUBE ===== */
                .cube-card-wrapper {
                    flex-shrink: 0;
                    width: 300px;
                    aspect-ratio: 1 / 1;
                    perspective: 1200px;
                    animation: levitate var(--levitate-duration) ease-in-out infinite alternate;
                }

                @keyframes levitate {
                    0% { transform: translateY(0) rotateX(0deg); }
                    100% { transform: translateY(-12px) rotateX(2deg); }
                }

                .cube-card {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 20px;
                    overflow: hidden;
                    transform-style: preserve-3d;
                    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

                    /* Deep glass effect */
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.08) 0%,
                        rgba(255, 255, 255, 0.02) 50%,
                        rgba(255, 255, 255, 0.05) 100%
                    );
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);

                    /* Crystal border */
                    border: 1px solid rgba(255, 255, 255, 0.12);

                    /* Luxury shadow stack */
                    box-shadow:
                        0 4px 24px rgba(0, 0, 0, 0.3),
                        0 12px 48px rgba(0, 0, 0, 0.4),
                        0 24px 80px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
                }

                .cube-card:hover {
                    transform: scale(1.04) rotateY(4deg) rotateX(2deg) translateZ(20px);
                    border-color: rgba(212, 175, 55, 0.4);
                    box-shadow:
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        0 20px 60px rgba(0, 0, 0, 0.5),
                        0 40px 100px rgba(212, 175, 55, 0.15),
                        0 0 60px rgba(212, 175, 55, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.3);
                }

                /* Image with premium treatment */
                .cube-image {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                }
                .cube-image img {
                    object-fit: cover;
                    opacity: 0.85;
                    transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease;
                    filter: saturate(1.1) contrast(1.05);
                }
                .cube-card:hover .cube-image img {
                    transform: scale(1.12);
                    opacity: 1;
                    filter: saturate(1.2) contrast(1.1);
                }

                /* Premium overlay - deeper gradient */
                .cube-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    background:
                        linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 35%, transparent 70%),
                        linear-gradient(135deg, transparent 50%, rgba(212, 175, 55, 0.03) 100%);
                    pointer-events: none;
                }

                /* Gold animated frame - luxury bezel */
                .cube-frame {
                    position: absolute;
                    inset: 0;
                    z-index: 4;
                    border-radius: 20px;
                    pointer-events: none;

                    /* Animated gold border */
                    border: 1.5px solid transparent;
                    background:
                        linear-gradient(#030712, #030712) padding-box,
                        linear-gradient(
                            var(--frame-angle, 135deg),
                            rgba(212, 175, 55, 0.6) 0%,
                            rgba(255, 215, 0, 0.3) 25%,
                            transparent 50%,
                            rgba(255, 215, 0, 0.3) 75%,
                            rgba(212, 175, 55, 0.6) 100%
                        ) border-box;
                    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    -webkit-mask-composite: xor;
                    opacity: 0.3;
                    transition: opacity 0.5s ease;
                    animation: frame-glow 4s linear infinite;
                }

                @keyframes frame-glow {
                    0% { --frame-angle: 0deg; }
                    100% { --frame-angle: 360deg; }
                }

                @property --frame-angle {
                    syntax: '<angle>';
                    initial-value: 135deg;
                    inherits: false;
                }

                .cube-card:hover .cube-frame {
                    opacity: 1;
                }

                /* Inner glow effect */
                .cube-inner-glow {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    border-radius: 20px;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    box-shadow:
                        inset 0 0 40px rgba(212, 175, 55, 0.1),
                        inset 0 0 80px rgba(212, 175, 55, 0.05);
                }
                .cube-card:hover .cube-inner-glow {
                    opacity: 1;
                }

                /* Content with refined typography */
                .cube-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    padding: 24px;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
                }

                .cube-category {
                    font-size: 9px;
                    font-weight: 600;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.35em;
                    margin-bottom: 10px;
                    display: inline-block;
                    padding: 4px 10px;
                    background: rgba(212, 175, 55, 0.1);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    border-radius: 4px;
                }

                .cube-title {
                    font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
                    font-size: 22px;
                    font-weight: 500;
                    font-style: italic;
                    color: white;
                    letter-spacing: 0.02em;
                    line-height: 1.3;
                    text-shadow:
                        0 2px 8px rgba(0, 0, 0, 0.8),
                        0 4px 16px rgba(0, 0, 0, 0.4);
                }

                /* Arrow button - refined */
                .cube-arrow {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 10;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transform: translate(8px, -8px) scale(0.9);
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .cube-card:hover .cube-arrow {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                    background: rgba(212, 175, 55, 0.2);
                    border-color: rgba(212, 175, 55, 0.4);
                }

                /* Crystal shine sweep */
                .cube-shine {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    background: linear-gradient(
                        105deg,
                        transparent 40%,
                        rgba(255, 255, 255, 0.1) 45%,
                        rgba(255, 255, 255, 0.2) 50%,
                        rgba(255, 255, 255, 0.1) 55%,
                        transparent 60%
                    );
                    opacity: 0;
                    transform: translateX(-100%);
                    pointer-events: none;
                }
                .cube-card:hover .cube-shine {
                    animation: shine-sweep 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
                @keyframes shine-sweep {
                    0% { transform: translateX(-100%); opacity: 0; }
                    30% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }

                /* Glass reflection top edge */
                .cube-reflection {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    z-index: 3;
                    background: linear-gradient(
                        to bottom,
                        rgba(255, 255, 255, 0.08) 0%,
                        transparent 100%
                    );
                    pointer-events: none;
                    border-radius: 20px 20px 0 0;
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .gig-section {
                        padding: 40px 0 60px;
                    }
                    .cube-card-wrapper {
                        width: 260px;
                    }
                    .marquee-track {
                        gap: 20px;
                    }
                    .marquee-container {
                        gap: 24px;
                    }
                    .cube-title {
                        font-size: 18px;
                    }
                    .cube-content {
                        padding: 20px;
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
    const levDuration = 3.5 + (index % 4) * 0.6;

    return (
        <div className="cube-card-wrapper" style={{ '--levitate-duration': `${levDuration}s` } as React.CSSProperties}>
            <Link href={`/package/${pkg.id}`} className="cube-card">
                {/* Image layer */}
                <div className="cube-image">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        sizes="300px"
                    />
                </div>

                {/* Glass reflection on top */}
                <div className="cube-reflection" />

                {/* Dark overlay gradient */}
                <div className="cube-overlay" />

                {/* Inner glow on hover */}
                <div className="cube-inner-glow" />

                {/* Gold animated frame */}
                <div className="cube-frame" />

                {/* Crystal shine sweep */}
                <div className="cube-shine" />

                {/* Arrow button */}
                <div className="cube-arrow">
                    <ArrowUpRight className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="cube-content">
                    <span className="cube-category">{pkg.category}</span>
                    <h3 className="cube-title">{pkg.title[lang]}</h3>
                </div>
            </Link>
        </div>
    );
}
