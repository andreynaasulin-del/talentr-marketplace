'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import { useRef, useState, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

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
    const allPackages = [...packages, ...packages];
    const firstRow = allPackages.slice(0, 10);
    const secondRow = allPackages.slice(10, 20);

    return (
        <section id="packages" className="py-32 md:py-56 bg-[#020617] overflow-visible relative">
            {/* Dynamic Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(10,25,47,1)_0%,_rgba(2,6,23,1)_100%)]" />
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse" />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-24 md:mb-40">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <span className="inline-block text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.8em] mb-8 font-serif italic">Exclusive</span>
                    <h2 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-none font-sans">
                        {t.title}
                    </h2>
                    <p className="text-white/20 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed font-serif italic">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            <div className="relative z-10 flex flex-col gap-24 md:gap-40" style={{ direction: 'ltr' }}>
                <MarqueeRow items={firstRow} direction="left" lang={lang} />
                <MarqueeRow items={secondRow} direction="right" lang={lang} />
            </div>
        </section>
    );
}

function MarqueeRow({ items, direction, lang }: { items: Package[]; direction: 'left' | 'right'; lang: 'en' | 'he' }) {
    const doubledItems = [...items, ...items];

    return (
        <div className="flex w-full overflow-hidden select-none py-20">
            <motion.div
                className="flex gap-16 md:gap-28 items-center"
                animate={{
                    x: direction === 'left' ? [0, -450 * items.length] : [-450 * items.length, 0],
                }}
                transition={{
                    duration: 80,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((pkg, idx) => (
                    <div key={`${pkg.id}-${idx}`} className="flex-shrink-0 w-[320px] md:w-[420px]">
                        <GlassCube pkg={pkg} lang={lang} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function GlassCube({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Physics for 3D Tilt
    const springConfig = { stiffness: 40, damping: 20, mass: 1.5 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
    const scale = useSpring(isHovered ? 1.05 : 1, springConfig);
    
    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
        mouseY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };

    return (
        <div className="luxury-card-wrapper group">
            {/* CAUSTICS: Refraction light under the cube */}
            <motion.div 
                className="luxury-caustic"
                style={{
                    background: `radial-gradient(circle at ${50 + mouseX.get() * 50}% ${50 + mouseY.get() * 50}%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.8 }}
            />

            <motion.a
                ref={cardRef}
                href={`/package/${pkg.id}`}
                className="gig-cube"
                style={{
                    rotateX,
                    rotateY,
                    scale,
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    mouseX.set(0);
                    mouseY.set(0);
                }}
            >
                <div className="cube-content">
                    <div className="cube-image-wrapper">
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            className="cube-image"
                            sizes="400px"
                        />
                    </div>

                    <div className="glass-overlay" />

                    <div className="cube-info">
                        <span className="category-tag">{pkg.category.toUpperCase()}</span>
                        <h3 className="cube-title">
                            {pkg.title[lang]}
                        </h3>
                    </div>

                    <div className="gold-frame" />
                </div>
            </motion.a>

            <style jsx global>{`
                :root {
                    --gold-glow: rgba(212, 175, 55, 0.4);
                    --glass-bg: rgba(255, 255, 255, 0.03);
                }

                .luxury-card-wrapper {
                    position: relative;
                    perspective: 1200px;
                    width: 100%;
                    height: 420px;
                }

                .luxury-caustic {
                    position: absolute;
                    inset: -60px;
                    pointer-events: none;
                    filter: blur(40px);
                    opacity: 0;
                    transition: opacity 0.8s ease;
                    z-index: 0;
                }

                .gig-cube {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    cursor: pointer;
                    transition: transform 0.15s ease-out, box-shadow 0.6s ease, border 0.6s ease;
                    z-index: 1;
                }

                .cube-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: var(--glass-bg);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    backdrop-filter: blur(15px) saturate(150%);
                    box-shadow:
                       0 20px 40px rgba(0,0,0,0.4),
                       inset 0 0 20px rgba(255,255,255,0.05);
                }

                .cube-image-wrapper {
                    position: absolute;
                    inset: 12px;
                    overflow: hidden;
                    transform: translateZ(-20px);
                    border-radius: 6px;
                }

                .cube-image {
                    object-fit: cover;
                    opacity: 0.85;
                    transform: scale(1.1);
                    transition: transform 0.8s ease, opacity 0.6s ease;
                }

                .glass-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.35));
                    mix-blend-mode: screen;
                    pointer-events: none;
                }

                .gold-frame {
                    position: absolute;
                    inset: 0;
                    border: 1.5px solid transparent;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #d4af37, transparent, #d4af37) border-box;
                    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    opacity: 0.3;
                    transition: 0.4s ease;
                    box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
                }

                .cube-info {
                    position: absolute;
                    bottom: 28px;
                    left: 24px;
                    transform: translateZ(50px);
                    text-align: left;
                    max-width: 80%;
                }

                .cube-title {
                    font-family: var(--font-serif), serif;
                    color: #fff;
                    font-size: 26px;
                    margin: 6px 0 0 0;
                    letter-spacing: 0.1em;
                    line-height: 1.2;
                    text-shadow: 0 5px 15px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.25);
                }

                .category-tag {
                    font-size: 10px;
                    color: #d4af37;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-weight: 700;
                    font-family: var(--font-serif), serif;
                }

                /* Hover states */
                .gig-cube:hover .cube-image {
                    transform: scale(1.18);
                    opacity: 1;
                }

                .gig-cube:hover .gold-frame {
                    opacity: 1;
                    box-shadow: 0 0 20px var(--gold-glow);
                }
            `}</style>
        </div>
    );
}
