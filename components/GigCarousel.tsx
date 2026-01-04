'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, CSSProperties, MouseEvent } from 'react';

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

    // Filter out alcohol-related packages
    const filtered = packages.filter(
        (p) =>
            !['Bartender', 'Sommelier'].includes(p.category) &&
            !/whisky|whiskey|cocktail|бар|алко/i.test(p.title.en + ' ' + (p.title.he || ''))
    );

    // Split into two rows
    const mid = Math.ceil(filtered.length / 2);
    let topRow = filtered.slice(0, mid);
    let bottomRow = filtered.slice(mid);

    if (bottomRow.length === 0 && topRow.length > 1) {
        const split = Math.ceil(topRow.length / 2);
        bottomRow = topRow.slice(split);
        topRow = topRow.slice(0, split);
    }

    return (
        <section className="gig-carousel-section">
            {/* Background */}
            <div className="gig-bg">
                <div className="gig-bg-gradient" />
                <div className="gig-bg-orb gig-bg-orb-1" />
                <div className="gig-bg-orb gig-bg-orb-2" />
            </div>

            {/* Header */}
            <div className="gig-header">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <span className="gig-label">Exclusive</span>
                    <h2 className="gig-title">{t.title}</h2>
                    <p className="gig-subtitle">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* Two Row Marquee */}
            <div className="gig-marquee-container">
                <div className="gig-marquee-row">
                    <div className="gig-marquee-track gig-marquee-left">
                        {[...topRow, ...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`top-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>

                <div className="gig-marquee-row">
                    <div className="gig-marquee-track gig-marquee-right">
                        {[...bottomRow, ...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`bottom-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* ===== SECTION ===== */
                .gig-carousel-section {
                    position: relative;
                    padding: 100px 0 120px;
                    background: #020304; /* Obsidian black */
                    overflow: hidden;
                    --gold-primary: #D4AF37;
                    --gold-accent: #F7E7CE;
                    --glass-dark: rgba(0, 0, 0, 0.65);
                }

                /* ===== BACKGROUND ===== */
                .gig-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }
                .gig-bg-gradient {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(20, 20, 25, 1) 0%, #000 80%);
                }
                .gig-bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.15;
                }
                .gig-bg-orb-1 {
                    top: -10%;
                    left: 20%;
                    width: 800px;
                    height: 800px;
                    background: var(--gold-primary);
                    mix-blend-mode: screen;
                }
                .gig-bg-orb-2 {
                    bottom: -10%;
                    right: 10%;
                    width: 600px;
                    height: 600px;
                    background: #4B0082;
                    mix-blend-mode: screen;
                }

                /* ===== HEADER ===== */
                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 100px;
                    padding: 0 24px;
                }
                .gig-label {
                    display: inline-block;
                    font-size: 10px;
                    font-weight: 800;
                    color: var(--gold-primary);
                    text-transform: uppercase;
                    letter-spacing: 0.8em;
                    margin-bottom: 24px;
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
                }
                .gig-title {
                    font-family: var(--font-serif), serif;
                    font-size: clamp(3.5rem, 10vw, 8.5rem);
                    font-weight: 400;
                    color: white;
                    letter-spacing: -0.02em;
                    line-height: 0.95;
                    margin-bottom: 24px;
                    background: linear-gradient(135deg, #fff 0%, #ccc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .gig-subtitle {
                    color: rgba(255, 255, 255, 0.35);
                    font-size: clamp(1rem, 1.5vw, 1.2rem);
                    max-width: 500px;
                    margin: 0 auto;
                    font-weight: 300;
                }

                /* ===== MARQUEE ===== */
                .gig-marquee-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 60px; /* More space between rows */
                }

                .gig-marquee-row {
                    width: 100%;
                    padding: 20px 0; /* Bleed area for 3D tilt */
                    overflow: visible; /* Allow 3D elements to poke out */
                }

                .gig-marquee-track {
                    display: flex;
                    gap: 60px; /* Spacious luxury spacing */
                    width: max-content;
                    padding-left: 20px;
                    will-change: transform;
                    /* Pause on hover handled by JS or simple CSS is tricky with complex 3D */
                }
                .gig-marquee-row:hover .gig-marquee-track {
                    animation-play-state: paused;
                }

                .gig-marquee-left { animation: gig-scroll-left 90s linear infinite; }
                .gig-marquee-right { animation: gig-scroll-right 100s linear infinite; }

                @keyframes gig-scroll-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.3333%, 0, 0); }
                }
                @keyframes gig-scroll-right {
                    0% { transform: translate3d(-33.3333%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }

                /* Resp */
                @media (max-width: 768px) {
                    .gig-marquee-track { gap: 30px; }
                    .gig-marquee-container { gap: 40px; }
                    .gig-title { font-size: 3rem; }
                }
            `}</style>
        </section>
    );
}

function GigCard({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Motion Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Dynamic Glare Position
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            className="monolith-wrapper"
            style={{ perspective: '1500px' }}
        >
            <motion.div
                ref={cardRef}
                className="monolith-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                <Link href={`/package/${pkg.id}`} className="block w-full h-full preserve-3d">

                    {/* LAYER 1: Base Image (Deep inside) */}
                    <div className="monolith-layer layer-base">
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            sizes="400px"
                            className="monolith-image"
                        />
                        <div className="monolith-overlay" />
                    </div>

                    {/* LAYER 2: Glass Body (The physical block) */}
                    <div className="monolith-layer layer-glass">
                        {/* Gold Bevel */}
                        <div className="monolith-border" />
                        {/* Inner Glow */}
                        <div className="monolith-glow" />
                        {/* Glare Effect */}
                        <motion.div
                            className="monolith-glare"
                            style={{
                                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 60%)`
                            }}
                        />
                    </div>

                    {/* LAYER 3: Content (Floating above) */}
                    <div className="monolith-layer layer-content">
                        <div className="monolith-content-inner">
                            <span className="monolith-category">{pkg.category}</span>
                            <h3 className="monolith-title">{pkg.title[lang]}</h3>
                            <div className="monolith-divider" />
                            <div className="monolith-action">
                                <span className="view-text">{lang === 'he' ? 'צפה' : 'View'}</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                </Link>
            </motion.div>

            <style jsx>{`
                .monolith-wrapper {
                    width: 320px;
                    height: 320px;
                    flex-shrink: 0;
                    position: relative;
                }

                .monolith-card {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    border-radius: 2px; /* Sharp, monolith corners */
                    transition: transform 0.1s;
                }

                .preserve-3d {
                    transform-style: preserve-3d;
                }

                /* === LAYERS === */
                .monolith-layer {
                    position: absolute;
                    inset: 0;
                    border-radius: 4px;
                    pointer-events: none;
                }

                /* Layer 1: Image */
                .layer-base {
                    transform: translateZ(10px) scale(0.96);
                    overflow: hidden;
                    background: #000;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.8);
                }
                .monolith-image {
                    object-fit: cover;
                    opacity: 0.85;
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .monolith-card:hover .monolith-image {
                    transform: scale(1.1);
                    opacity: 0.6; /* Darken image on hover to make text pop */
                }
                .monolith-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8));
                }

                /* Layer 2: Glass */
                .layer-glass {
                    transform: translateZ(30px);
                    background: rgba(10, 10, 12, 0.45); /* Dark Glass */
                    backdrop-filter: blur(24px) saturate(140%);
                    -webkit-backdrop-filter: blur(24px) saturate(140%);
                    border: 1px solid rgba(255,255,255,0.05);
                }

                /* Gold Border / Bevel */
                .monolith-border {
                    position: absolute;
                    inset: -1px;
                    border-radius: 4px;
                    padding: 1.5px; /* Border width */
                    background: linear-gradient(135deg, rgba(212, 175, 55, 1) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(212, 175, 55, 1) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0.8;
                }
                
                /* Inner Gold Glow */
                .monolith-glow {
                    position: absolute;
                    inset: 0;
                    box-shadow: inset 0 0 30px rgba(212, 175, 55, 0.15);
                    opacity: 0.6;
                    transition: opacity 0.5s ease;
                }
                .monolith-card:hover .monolith-glow {
                    opacity: 1;
                    box-shadow: inset 0 0 50px rgba(212, 175, 55, 0.25);
                }

                .monolith-glare {
                    position: absolute;
                    inset: -50%;
                    width: 200%;
                    height: 200%;
                    opacity: 0;
                    transition: opacity 0.3s;
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
                .monolith-card:hover .monolith-glare {
                    opacity: 1;
                }


                /* Layer 3: Content */
                .layer-content {
                    transform: translateZ(60px);
                    display: flex;
                    align-items: flex-end;
                    padding: 32px;
                }

                .monolith-content-inner {
                    width: 100%;
                    text-align: left;
                }

                .monolith-category {
                    display: block;
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    color: #D4AF37; /* Gold */
                    margin-bottom: 12px;
                    font-weight: 700;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
                }

                .monolith-title {
                    font-family: var(--font-serif), serif;
                    font-size: 28px;
                    line-height: 1.1;
                    color: #F7E7CE; /* Champagne */
                    margin-bottom: 20px;
                    text-shadow: 0 4px 20px rgba(0,0,0,0.9);
                    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.2));
                }

                .monolith-divider {
                    width: 40px;
                    height: 1px;
                    background: #D4AF37;
                    margin-bottom: 20px;
                    opacity: 0.6;
                    transform-origin: left;
                    transition: width 0.4s ease;
                }
                .monolith-card:hover .monolith-divider {
                    width: 100%;
                    opacity: 1;
                }

                .monolith-action {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.4s ease;
                }
                .monolith-card:hover .monolith-action {
                    opacity: 1;
                    transform: translateY(0);
                }

                @media (max-width: 768px) {
                    .monolith-wrapper {
                        width: 260px;
                        height: 260px;
                    }
                    .monolith-title {
                        font-size: 22px;
                    }
                    .layer-content {
                        padding: 24px;
                    }
                }
            `}</style>
        </div>
    );
}
