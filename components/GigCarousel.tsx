'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
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
    // Фильтр: убираем алкоголь
    const filtered = packages.filter(
        (p) =>
            !['Bartender', 'Sommelier'].includes(p.category) &&
            !/whisky|whiskey|cocktail|бар|алко/i.test(p.title.en + ' ' + p.title.he)
    );

    // Без повторов: делим список пополам (если нечётное — верхний ряд длиннее на 1)
    const mid = Math.ceil(filtered.length / 2);
    const topRow = filtered.slice(0, mid);
    const bottomRow = filtered.slice(mid);

    return (
        <section id="packages" className="py-12 md:py-16 bg-[#020617] overflow-hidden relative">
            {/* Dynamic Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(10,25,47,1)_0%,_rgba(2,6,23,1)_100%)]" />
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse" />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-12">
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

            {/* Два ряда: верх вправо, низ влево; без повторов (loop только для бесшовности) */}
            <div className="relative z-10 max-w-7xl mx-auto px-2 md:px-4">
                <div className="overflow-hidden perspective-[1500px] flex flex-col gap-10">
                    <MarqueeRow items={topRow} direction="right" lang={lang} speed={55} />
                    <MarqueeRow items={bottomRow} direction="left" lang={lang} speed={60} />
                </div>
            </div>
        </section>
    );
}

function MarqueeRow({ items, direction, lang, speed = 55 }: { items: Package[]; direction: 'left' | 'right'; lang: 'en' | 'he'; speed?: number }) {
    // дублируем, чтобы луп был бесшовным
    const loopItems = [...items, ...items];
    return (
        <div className="w-full overflow-hidden">
            <div className="flex gap-6 md:gap-8 items-stretch">
                <div
                    className={cn(
                        "flex gap-6 md:gap-8 animate-marquee",
                        direction === 'right' ? 'marquee-right' : 'marquee-left'
                    )}
                    style={{ animationDuration: `${speed}s` }}
                >
                    {loopItems.map((pkg, idx) => (
                        <div key={`${direction}-${pkg.id}-${idx}`} className="w-[260px] md:w-[320px] flex-shrink-0">
                            <GlassCube pkg={pkg} lang={lang} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function GlassCube({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Physics for 3D Tilt
    const springConfig = { stiffness: 50, damping: 18, mass: 1.2 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
    const scale = useSpring(isHovered ? 1.03 : 1, springConfig);
    
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
        mouseY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };

    return (
        <div className="luxury-card-wrapper group card-perspective-container">
            {/* CAUSTICS */}
            <motion.div 
                className="luxury-caustic"
                style={{
                    background: `radial-gradient(circle at ${50 + mouseX.get() * 50}% ${50 + mouseY.get() * 50}%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.8 }}
            />

            <motion.div
                ref={cardRef}
                className="gig-cube-card"
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
                <div className="cube-content aspect-square">
                    <div className="layer-bg cube-image-wrapper">
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            className="cube-image"
                            sizes="400px"
                        />
                    </div>

                    <div className="layer-glass glass-overlay gold-frame glossy-glow" />

                    <div className="layer-content cube-info">
                        <span className="category-tag">{pkg.category.toUpperCase()}</span>
                        <h3 className="cube-title">
                            {pkg.title[lang]}
                        </h3>
                        <div className="floating-icon">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                :root {
                    --gold-glow: rgba(212, 175, 55, 0.4);
                    --glass-bg: rgba(255, 255, 255, 0.03);
                }

                .luxury-card-wrapper,
                .card-perspective-container {
                    position: relative;
                    perspective: 1200px;
                    width: 100%;
                    height: auto;
                }

                .luxury-caustic {
                    position: absolute;
                    inset: -60px;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.8s ease;
                    z-index: 0;
                }

                .gig-cube-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    cursor: pointer;
                    transition: transform 0.15s ease-out, box-shadow 0.6s ease, border 0.6s ease;
                    z-index: 1;
                }

                /* Hover tilt baseline */
                .card-perspective-container:hover .gig-cube-card {
                    transform: rotateY(8deg) rotateX(6deg);
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
                    aspect-ratio: 1 / 1;
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

                /* Dedicated glass layer with depth */
                .layer-glass {
                    transform: translateZ(25px);
                    backdrop-filter: blur(10px);
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
                    bottom: 24px;
                    left: 20px;
                    transform: translateZ(50px);
                    text-align: left;
                    max-width: 80%;
                }

                .layer-bg { transform: translateZ(0); }
                .layer-content { transform: translateZ(60px); }

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

                .floating-icon {
                    margin-top: 14px;
                    width: 36px;
                    height: 36px;
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: translateZ(50px);
                    transition: all 0.4s ease;
                }

                /* Glossy glow following cursor */
                .glossy-glow::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.18), transparent 40%);
                    mix-blend-mode: screen;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }

                .gig-cube-card:hover .glossy-glow::after {
                    opacity: 1;
                }

                /* Marquee animation */
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(50%); }
                }
                .animate-marquee {
                    animation: marquee-left 50s linear infinite;
                    will-change: transform;
                }
                .animate-marquee.marquee-right {
                    animation-name: marquee-right;
                }

                /* Gentle sway on cubes while moving */
                @keyframes sway {
                    0%, 100% { transform: translateZ(0) rotateY(0deg); }
                    50% { transform: translateZ(0) rotateY(1.5deg); }
                }
                .sway {
                    animation: sway 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
