'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

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
                    padding: 100px 0 120px;
                    background: #020617;
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
                    background: radial-gradient(ellipse 120% 80% at 50% 20%, rgba(15, 30, 60, 1) 0%, rgba(2, 6, 23, 1) 100%);
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
                    background: rgba(59, 130, 246, 0.2);
                }
                .gig-bg-orb-2 {
                    bottom: 10%;
                    right: 5%;
                    width: 500px;
                    height: 500px;
                    background: rgba(212, 175, 55, 0.15);
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
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.6em;
                    margin-bottom: 20px;
                }
                .gig-title {
                    font-size: clamp(3rem, 10vw, 8rem);
                    font-weight: 900;
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
                    gap: 40px;
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
                    gap: 32px;
                    width: max-content;
                    padding: 20px 0;
                }

                .gig-marquee-left {
                    animation: gig-scroll-left 80s linear infinite;
                }

                .gig-marquee-right {
                    animation: gig-scroll-right 90s linear infinite;
                }

                .gig-marquee-row:hover .gig-marquee-track {
                    animation-play-state: paused;
                }

                @keyframes gig-scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.3333%); }
                }

                @keyframes gig-scroll-right {
                    0% { transform: translateX(-33.3333%); }
                    100% { transform: translateX(0); }
                }

                /* ===== GIG CARD ===== */
                .gig-card-wrap {
                    flex-shrink: 0;
                    width: 320px;
                    height: 320px;
                    display: block;
                }

                .gig-card {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 24px;
                    overflow: hidden;
                    background: rgba(20, 30, 50, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .gig-card:hover {
                    transform: scale(1.04) translateY(-8px);
                    border-color: rgba(212, 175, 55, 0.4);
                    box-shadow: 
                        0 35px 70px rgba(0, 0, 0, 0.6),
                        0 0 40px rgba(212, 175, 55, 0.15);
                }

                /* Image */
                .gig-card-image {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                }

                .gig-card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.8;
                    transition: transform 0.8s ease, opacity 0.5s ease;
                }

                .gig-card:hover .gig-card-image img {
                    transform: scale(1.1);
                    opacity: 1;
                }

                /* Overlay */
                .gig-card-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.85) 100%);
                    pointer-events: none;
                }

                /* Gold Frame */
                .gig-card-frame {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    border-radius: 24px;
                    border: 1.5px solid rgba(212, 175, 55, 0.2);
                    opacity: 0.5;
                    transition: opacity 0.5s ease, border-color 0.5s ease;
                    pointer-events: none;
                }

                .gig-card:hover .gig-card-frame {
                    border-color: rgba(212, 175, 55, 0.6);
                    opacity: 1;
                }

                /* Content */
                .gig-card-content {
                    position: absolute;
                    bottom: 24px;
                    left: 24px;
                    right: 24px;
                    z-index: 4;
                }

                .gig-card-category {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    color: #d4af37;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    margin-bottom: 8px;
                }

                .gig-card-name {
                    font-family: var(--font-serif), Georgia, serif;
                    font-size: 24px;
                    font-weight: 400;
                    color: white;
                    letter-spacing: 0.03em;
                    line-height: 1.2;
                    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
                }

                /* Arrow */
                .gig-card-arrow {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 5;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transform: translate(10px, -10px);
                    transition: all 0.4s ease;
                }

                .gig-card:hover .gig-card-arrow {
                    opacity: 1;
                    transform: translate(0, 0);
                }

                /* Shine */
                .gig-card-shine {
                    position: absolute;
                    inset: 0;
                    z-index: 6;
                    background: linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%);
                    opacity: 0;
                    transform: translateX(-100%);
                    pointer-events: none;
                    border-radius: 24px;
                }

                .gig-card:hover .gig-card-shine {
                    animation: gig-shine 1.2s ease forwards;
                }

                @keyframes gig-shine {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .gig-card-wrap {
                        width: 260px;
                        height: 260px;
                    }
                    .gig-marquee-track {
                        gap: 20px;
                    }
                    .gig-marquee-container {
                        gap: 24px;
                    }
                    .gig-header {
                        margin-bottom: 50px;
                    }
                    .gig-carousel-section {
                        padding: 70px 0 90px;
                    }
                }
            `}</style>
        </section>
    );
}

function GigCard({ pkg, lang, idx }: { pkg: Package; lang: 'en' | 'he'; idx: number }) {
    return (
        <div className="gig-card-wrap">
            <Link href={`/package/${pkg.id}`} className="gig-card">
                {/* Image */}
                <div className="gig-card-image">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        sizes="320px"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* Overlay */}
                <div className="gig-card-overlay" />

                {/* Frame */}
                <div className="gig-card-frame" />

                {/* Shine */}
                <div className="gig-card-shine" />

                {/* Arrow */}
                <div className="gig-card-arrow">
                    <ArrowUpRight className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="gig-card-content">
                    <span className="gig-card-category">{pkg.category}</span>
                    <h3 className="gig-card-name">{pkg.title[lang]}</h3>
                </div>
            </Link>
        </div>
    );
}
