'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import { useRef, useState, MouseEvent } from 'react';

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

    return (
        <section id="packages" className="gig-section">
            {/* Ambient Background */}
            <div className="ambient-bg">
                <div className="ambient-gradient" />
                <div className="ambient-glow" />
            </div>

            {/* Header */}
            <div className="section-header">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
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

            {/* Infinite Horizontal Ribbon */}
            <div className="ribbon-container">
                <div className="ribbon-track">
                    {/* Duplicate array for seamless loop */}
                    {[...filtered, ...filtered].map((pkg, idx) => (
                        <GlassCube key={`cube-${pkg.id}-${idx}`} pkg={pkg} lang={lang} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                /* ===== SECTION ===== */
                .gig-section {
                    position: relative;
                    padding: 80px 0 100px;
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
                    background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(10, 25, 47, 1) 0%, rgba(2, 6, 23, 1) 100%);
                }
                .ambient-glow {
                    position: absolute;
                    top: 20%;
                    left: 30%;
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
                    filter: blur(80px);
                    animation: pulse-glow 8s ease-in-out infinite alternate;
                }
                @keyframes pulse-glow {
                    0% { opacity: 0.5; transform: scale(1); }
                    100% { opacity: 0.8; transform: scale(1.1); }
                }

                /* ===== HEADER ===== */
                .section-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 60px;
                    padding: 0 24px;
                }
                .exclusive-tag {
                    display: inline-block;
                    font-size: 10px;
                    font-weight: 900;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.8em;
                    margin-bottom: 24px;
                    font-style: italic;
                }
                .section-title {
                    font-size: clamp(3rem, 10vw, 8rem);
                    font-weight: 900;
                    color: white;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    margin-bottom: 24px;
                }
                .section-subtitle {
                    color: rgba(255, 255, 255, 0.2);
                    font-size: clamp(1rem, 2vw, 1.5rem);
                    max-width: 600px;
                    margin: 0 auto;
                    font-style: italic;
                    line-height: 1.6;
                }

                /* ===== RIBBON CONTAINER (Soft Edges) ===== */
                .ribbon-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    overflow: hidden;
                    /* Soft fade edges */
                    mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 12%,
                        black 88%,
                        transparent 100%
                    );
                    -webkit-mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 12%,
                        black 88%,
                        transparent 100%
                    );
                }

                /* ===== RIBBON TRACK (Infinite Motion) ===== */
                .ribbon-track {
                    display: flex;
                    gap: 24px;
                    padding: 20px 0;
                    width: max-content;
                    animation: scroll-ribbon 45s linear infinite;
                    will-change: transform;
                }

                .ribbon-container:hover .ribbon-track {
                    animation-play-state: paused;
                }

                @keyframes scroll-ribbon {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                /* ===== GLASS CUBE CARD ===== */
                .cube-wrapper {
                    flex-shrink: 0;
                    width: 300px;
                    perspective: 1200px;
                    position: relative;
                }

                .cube-caustic {
                    position: absolute;
                    inset: -40px;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.6s ease;
                    z-index: 0;
                }

                .cube-card {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    transform-style: preserve-3d;
                    cursor: pointer;
                    transition: transform 0.2s ease-out;
                    z-index: 1;
                }

                .cube-wrapper:hover .cube-card {
                    transform: rotateY(6deg) rotateX(4deg) scale(1.02);
                }

                .cube-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    overflow: hidden;
                    backdrop-filter: blur(20px) saturate(180%);
                    box-shadow:
                        0 25px 50px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }

                /* Image Layer (Z = 0) */
                .cube-image-layer {
                    position: absolute;
                    inset: 10px;
                    border-radius: 12px;
                    overflow: hidden;
                    transform: translateZ(0);
                }

                .cube-image-layer img {
                    object-fit: cover;
                    opacity: 0.9;
                    transform: scale(1.05);
                    transition: transform 0.8s ease, opacity 0.5s ease;
                }

                .cube-wrapper:hover .cube-image-layer img {
                    transform: scale(1.15);
                    opacity: 1;
                }

                /* Glass Layer (Z = 30px) */
                .cube-glass-layer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.2));
                    mix-blend-mode: overlay;
                    pointer-events: none;
                    transform: translateZ(30px);
                }

                /* Gold Frame */
                .cube-gold-frame {
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    border: 1.5px solid transparent;
                    background: linear-gradient(135deg, #d4af37 0%, transparent 50%, #d4af37 100%) border-box;
                    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    opacity: 0.2;
                    transition: opacity 0.4s ease, box-shadow 0.4s ease;
                    box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
                }

                .cube-wrapper:hover .cube-gold-frame {
                    opacity: 0.8;
                    box-shadow: 0 0 25px rgba(212, 175, 55, 0.35);
                }

                /* Text Layer (Z = 60px) */
                .cube-text-layer {
                    position: absolute;
                    bottom: 20px;
                    left: 18px;
                    right: 18px;
                    transform: translateZ(60px);
                    text-align: left;
                }

                .cube-category {
                    font-size: 9px;
                    font-weight: 800;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.35em;
                }

                .cube-title {
                    font-family: var(--font-serif), Georgia, serif;
                    font-size: 22px;
                    font-weight: 400;
                    color: white;
                    margin-top: 6px;
                    letter-spacing: 0.08em;
                    line-height: 1.25;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 10px rgba(212, 175, 55, 0.2);
                }

                .cube-arrow {
                    margin-top: 12px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0.6;
                    transition: all 0.3s ease;
                }

                .cube-wrapper:hover .cube-arrow {
                    opacity: 1;
                    background: rgba(212, 175, 55, 0.2);
                    border-color: rgba(212, 175, 55, 0.4);
                }

                /* Shine effect on hover */
                .cube-shine {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        115deg,
                        transparent 20%,
                        rgba(255, 255, 255, 0.1) 40%,
                        rgba(255, 255, 255, 0.2) 50%,
                        rgba(255, 255, 255, 0.1) 60%,
                        transparent 80%
                    );
                    opacity: 0;
                    transform: translateX(-100%);
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    border-radius: 20px;
                }

                .cube-wrapper:hover .cube-shine {
                    opacity: 1;
                    animation: shine-sweep 1.5s ease forwards;
                }

                @keyframes shine-sweep {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}

function GlassCube({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 80, damping: 20, mass: 1 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
        mouseY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };

    return (
        <div
            className="cube-wrapper"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                mouseX.set(0);
                mouseY.set(0);
            }}
        >
            {/* Caustic glow under card */}
            <motion.div
                className="cube-caustic"
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)`,
                    filter: 'blur(50px)',
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />

            <motion.div
                className="cube-card"
                style={{ rotateX, rotateY }}
            >
                <div className="cube-inner">
                    {/* Layer 1: Image */}
                    <div className="cube-image-layer">
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            sizes="300px"
                        />
                    </div>

                    {/* Layer 2: Glass overlay */}
                    <div className="cube-glass-layer" />
                    
                    {/* Gold frame */}
                    <div className="cube-gold-frame" />

                    {/* Shine effect */}
                    <div className="cube-shine" />

                    {/* Layer 3: Text */}
                    <div className="cube-text-layer">
                        <span className="cube-category">{pkg.category}</span>
                        <h3 className="cube-title">{pkg.title[lang]}</h3>
                        <div className="cube-arrow">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
