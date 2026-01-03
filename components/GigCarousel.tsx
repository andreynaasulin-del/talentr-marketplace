'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';

type GigMood = {
    moodA: string; // "r,g,b"
    moodB: string; // "r,g,b"
};

function getGigMood(pkg: Package): GigMood {
    const text = `${pkg.title.en} ${pkg.description.en} ${pkg.category}`.toLowerCase();

    // Romantic / dinner / intimate → warm, muted
    if (
        /romantic|proposal|anniversary|date|serenity|harp|acoustic|sushi|chef/.test(text) ||
        pkg.category === 'Chef'
    ) {
        return { moodA: '255,210,160', moodB: '200,179,122' };
    }

    // Party / DJ / nightlife → cold crystal
    if (
        pkg.category === 'DJ' ||
        /party|beats|club|rooftop|dance|techno|house/.test(text)
    ) {
        return { moodA: '150,220,255', moodB: '90,160,255' };
    }

    // Magic / surreal → refined violet
    if (pkg.category === 'Magician' || /magic|illusion/.test(text)) {
        return { moodA: '205,185,255', moodB: '150,140,255' };
    }

    // Default: neutral champagne brass
    return { moodA: '200,179,122', moodB: '255,255,255' };
}

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

    // Safety: ensure both rows have items
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
                {/* Row 1: Left */}
                <div className="gig-marquee-row">
                    <div className="gig-marquee-track gig-marquee-left">
                        {[...topRow, ...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`top-${pkg.id}-${i}`} pkg={pkg} lang={lang} idx={i} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right */}
                <div className="gig-marquee-row">
                    <div className="gig-marquee-track gig-marquee-right">
                        {[...bottomRow, ...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`bottom-${pkg.id}-${i}`} pkg={pkg} lang={lang} idx={i} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* ===== SECTION ===== */
                .gig-carousel-section {
                    position: relative;
                    padding: 82px 0 96px;
                    background: #05070a;
                    overflow: hidden;
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
                    background:
                        radial-gradient(ellipse 120% 85% at 50% 15%, rgba(10, 16, 24, 1) 0%, rgba(5, 7, 10, 1) 55%, rgba(0, 0, 0, 1) 100%);
                }
                .gig-bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.3;
                }
                .gig-bg-orb-1 {
                    top: 10%;
                    left: 5%;
                    width: 600px;
                    height: 600px;
                    background: rgba(120, 200, 255, 0.12);
                }
                .gig-bg-orb-2 {
                    bottom: 10%;
                    right: 5%;
                    width: 500px;
                    height: 500px;
                    background: rgba(200, 179, 122, 0.10);
                }

                /* ===== HEADER ===== */
                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 80px;
                    padding: 0 24px;
                }
                .gig-label {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 800;
                    color: rgba(200, 179, 122, 0.9);
                    text-transform: uppercase;
                    letter-spacing: 0.75em;
                    margin-bottom: 20px;
                }
                .gig-title {
                    font-size: clamp(3rem, 10vw, 8rem);
                    font-weight: 800;
                    color: white;
                    letter-spacing: -0.04em;
                    line-height: 0.9;
                    margin-bottom: 20px;
                }
                .gig-subtitle {
                    color: rgba(255, 255, 255, 0.25);
                    font-size: clamp(1rem, 2vw, 1.3rem);
                    max-width: 500px;
                    margin: 0 auto;
                    font-style: italic;
                }

                /* ===== MARQUEE ===== */
                .gig-marquee-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 26px;
                    direction: ltr !important;
                }

                .gig-marquee-row {
                    width: 100%;
                    overflow: hidden;
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }

                .gig-marquee-track {
                    display: flex;
                    gap: 22px;
                    width: max-content;
                    padding: 20px 0;
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }

                .gig-marquee-left {
                    animation: gig-scroll-left 78s linear infinite;
                }

                .gig-marquee-right {
                    animation: gig-scroll-right 86s linear infinite;
                }

                .gig-marquee-row:hover .gig-marquee-track {
                    animation-play-state: paused;
                }

                @keyframes gig-scroll-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.3333%, 0, 0); }
                }

                @keyframes gig-scroll-right {
                    0% { transform: translate3d(-33.3333%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }

                /* ===== CRYSTAL CUBE ===== */
                .gig-carousel-section {
                    --brass-rgb: 200, 179, 122; /* champagne brass */
                    --ease-lux: cubic-bezier(0.16, 1, 0.3, 1);
                }

                .crystal-wrap {
                    flex-shrink: 0;
                    width: 300px;
                    aspect-ratio: 1 / 1;
                    position: relative;
                    perspective: 2000px;
                    transform: translate3d(0, 0, 0);
                }

                /* Caustics behind cube (emotional lighting) */
                .crystal-caustic {
                    position: absolute;
                    inset: -90px;
                    border-radius: 999px;
                    filter: blur(30px);
                    opacity: 0;
                    transform: translate3d(0, 0, 0);
                    transition: opacity 900ms var(--ease-lux);
                    background:
                        radial-gradient(circle at 35% 35%, rgba(var(--mood-a), 0.16), transparent 60%),
                        radial-gradient(circle at 65% 55%, rgba(var(--mood-b), 0.12), transparent 62%);
                    mix-blend-mode: screen;
                    pointer-events: none;
                }

                .crystal-wrap:hover .crystal-caustic {
                    opacity: 1;
                }

                /* Float / sway while scrolling */
                .crystal-float {
                    width: 100%;
                    height: 100%;
                    animation: crystal-float var(--float-dur) ease-in-out infinite;
                    animation-delay: var(--float-delay);
                    transform-style: preserve-3d;
                    will-change: transform;
                }

                @keyframes crystal-float {
                    0% { transform: translate3d(0, 0, 0) rotateZ(calc(var(--sway-sign) * -0.8deg)); }
                    100% { transform: translate3d(0, -10px, 0) rotateZ(calc(var(--sway-sign) * 0.8deg)); }
                }

                .crystal-cube {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 24px;
                    overflow: hidden;
                    transform-style: preserve-3d;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.10);
                    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
                    transition:
                        transform 850ms var(--ease-lux),
                        box-shadow 1000ms var(--ease-lux),
                        border-color 900ms var(--ease-lux);
                    will-change: transform;
                }

                .crystal-cube:hover {
                    transform: translate3d(0, -3px, 0) scale(1.02) rotateX(5deg) rotateY(-6deg);
                    border-color: rgba(var(--brass-rgb), 0.22);
                    box-shadow:
                        0 55px 160px rgba(0, 0, 0, 0.72),
                        0 0 120px rgba(var(--brass-rgb), 0.05);
                }

                /* Layers */
                .crystal-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    transform-style: preserve-3d;
                    border-radius: 24px;
                }

                .crystal-image {
                    transform: translateZ(0px);
                }

                .crystal-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.86;
                    filter: saturate(1.05) contrast(1.05);
                    transition: transform 1200ms var(--ease-lux), opacity 900ms var(--ease-lux);
                }

                .crystal-cube:hover .crystal-image img {
                    transform: scale(1.08);
                    opacity: 1;
                }

                /* Glass / thickness */
                .crystal-glass {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    pointer-events: none;
                    transform: translateZ(34px);
                    background: rgba(255, 255, 255, 0.035);
                    backdrop-filter: blur(18px) saturate(160%) contrast(110%);
                    -webkit-backdrop-filter: blur(18px) saturate(160%) contrast(110%);
                    box-shadow:
                        inset 0 0 0 1px rgba(255, 255, 255, 0.06),
                        inset 0 18px 40px rgba(0, 0, 0, 0.55),
                        inset 0 -14px 28px rgba(255, 255, 255, 0.06);
                }

                /* Depth gradient / refraction */
                .crystal-glass::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    background:
                        radial-gradient(700px circle at 20% 10%, rgba(var(--mood-a), 0.10), transparent 55%),
                        radial-gradient(700px circle at 80% 65%, rgba(var(--mood-b), 0.08), transparent 60%),
                        linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 40%, rgba(0, 0, 0, 0.55) 100%);
                    opacity: 0.9;
                    mix-blend-mode: screen;
                    pointer-events: none;
                }

                /* Bevel pulse (quiet, boutique) */
                .crystal-bevel {
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: conic-gradient(
                        from 0deg,
                        rgba(var(--brass-rgb), 0.00),
                        rgba(var(--brass-rgb), 0.22),
                        rgba(255, 255, 255, 0.10),
                        rgba(var(--brass-rgb), 0.16),
                        rgba(var(--brass-rgb), 0.00)
                    );
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0.22;
                    filter: drop-shadow(0 0 16px rgba(var(--brass-rgb), 0.08));
                    animation: bevel-pulse 5200ms var(--ease-lux) infinite;
                    pointer-events: none;
                }

                @keyframes bevel-pulse {
                    0%, 100% {
                        opacity: 0.18;
                        filter: drop-shadow(0 0 14px rgba(var(--brass-rgb), 0.06));
                    }
                    50% {
                        opacity: 0.34;
                        filter: drop-shadow(0 0 18px rgba(var(--brass-rgb), 0.10));
                    }
                }

                /* Glare sweep */
                .crystal-glare {
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    background: linear-gradient(
                        115deg,
                        transparent 42%,
                        rgba(255, 255, 255, 0.16) 50%,
                        transparent 58%
                    );
                    opacity: 0;
                    transform: translateX(-120%) skewX(-20deg);
                    pointer-events: none;
                }

                .crystal-cube:hover .crystal-glare {
                    opacity: 1;
                    animation: glare-sweep 1200ms var(--ease-lux) forwards;
                }

                @keyframes glare-sweep {
                    0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
                    40% { opacity: 0.9; }
                    100% { transform: translateX(120%) skewX(-20deg); opacity: 0; }
                }

                /* Top content layer */
                .crystal-content {
                    position: absolute;
                    inset: 0;
                    z-index: 4;
                    transform: translateZ(70px);
                    padding: 18px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    gap: 8px;
                    pointer-events: none;
                }

                .crystal-tag {
                    display: inline-block;
                    font-size: 9px;
                    letter-spacing: 0.42em;
                    text-transform: uppercase;
                    font-weight: 700;
                    color: rgba(var(--brass-rgb), 0.85);
                }

                .crystal-title {
                    font-family: var(--font-serif), serif;
                    font-size: 22px;
                    font-weight: 400;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    line-height: 1.18;
                    color: rgba(255, 255, 255, 0.92);
                    text-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .crystal-desc {
                    font-size: 12px;
                    line-height: 1.45;
                    color: rgba(255, 255, 255, 0.60);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Action button */
                .crystal-action {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 38px;
                    height: 38px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(255, 255, 255, 0.10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.88);
                    opacity: 0;
                    transform: translateZ(84px) translate(10px, -10px);
                    transition: opacity 600ms var(--ease-lux), transform 700ms var(--ease-lux), background-color 700ms var(--ease-lux), border-color 700ms var(--ease-lux);
                }

                .crystal-cube:hover .crystal-action {
                    opacity: 1;
                    transform: translateZ(84px) translate(0, 0);
                    border-color: rgba(var(--brass-rgb), 0.22);
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .crystal-wrap {
                        width: 250px;
                    }
                    .gig-marquee-track {
                        gap: 18px;
                    }
                    .gig-marquee-container {
                        gap: 20px;
                    }
                    .gig-header {
                        margin-bottom: 56px;
                    }
                    .gig-carousel-section {
                        padding: 68px 0 82px;
                    }
                    .crystal-title {
                        font-size: 20px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .crystal-float,
                    .crystal-bevel,
                    .crystal-glare,
                    .gig-marquee-left,
                    .gig-marquee-right {
                        animation: none !important;
                    }
                    .crystal-cube,
                    .crystal-image img,
                    .crystal-action,
                    .crystal-caustic {
                        transition: none !important;
                    }
                }
            `}</style>
        </section>
    );
}

function GigCard({ pkg, lang, idx }: { pkg: Package; lang: 'en' | 'he'; idx: number }) {
    const mood = getGigMood(pkg);
    const floatDur = 6.6 + (idx % 5) * 0.85;
    const floatDelay = -((idx % 6) * 0.55);
    const swaySign = idx % 2 === 0 ? 1 : -1;

    const style = {
        ['--mood-a' as any]: mood.moodA,
        ['--mood-b' as any]: mood.moodB,
        ['--float-dur' as any]: `${floatDur}s`,
        ['--float-delay' as any]: `${floatDelay}s`,
        ['--sway-sign' as any]: swaySign,
    } as CSSProperties;

    return (
        <div className="crystal-wrap" style={style}>
            <div className="crystal-caustic" />
            <div className="crystal-float">
                <Link href={`/package/${pkg.id}`} className="crystal-cube">
                    {/* Base image */}
                    <div className="crystal-layer crystal-image">
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            sizes="300px"
                            style={{ objectFit: 'cover' }}
                            priority={idx < 6}
                        />
                    </div>

                    {/* Glass + bevel + glare */}
                    <div className="crystal-layer crystal-glass">
                        <div className="crystal-bevel" />
                        <div className="crystal-glare" />
                    </div>

                    {/* Content */}
                    <div className="crystal-layer crystal-content">
                        <span className="crystal-tag">{pkg.category}</span>
                        <h3 className="crystal-title">{pkg.title[lang]}</h3>
                        <p className="crystal-desc">{pkg.description[lang]}</p>
                    </div>

                    {/* Action */}
                    <div className="crystal-action">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
