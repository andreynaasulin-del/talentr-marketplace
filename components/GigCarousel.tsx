'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight, Sparkles } from 'lucide-react';
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
        <div className="relative group perspective-[1200px]">
            {/* CAUSTICS: Refraction light under the cube */}
            <motion.div 
                className="absolute -inset-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"
                style={{
                    background: `radial-gradient(circle at ${50 + mouseX.get() * 50}% ${50 + mouseY.get() * 50}%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                }}
            />

            <motion.a
                ref={cardRef}
                href={`/package/${pkg.id}`}
                className="relative block aspect-[4/5] overflow-hidden rounded-[2px] transition-all duration-700"
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: 'preserve-3d',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(25px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    mouseX.set(0);
                    mouseY.set(0);
                }}
            >
                {/* GLOWING EDGES: Top and Bottom Gold Borders */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {/* Golden Rim Light */}
                    <div className={cn(
                        "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-opacity duration-1000",
                        isHovered ? "opacity-100" : "opacity-20"
                    )} />
                    <div className={cn(
                        "absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-opacity duration-1000",
                        isHovered ? "opacity-100" : "opacity-20"
                    )} />
                </div>

                {/* INTERNAL DEPTH: The "Object" inside the glass */}
                <motion.div 
                    className="absolute inset-8 z-10"
                    style={{ transform: 'translateZ(40px)' }}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-sm">
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            sizes="400px"
                        />
                        {/* Internal Refraction Shadow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                </motion.div>

                {/* TYPOGRAPHY: Floating Serif Labels */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end z-30" style={{ transform: 'translateZ(100px)' }}>
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.6em] font-serif block opacity-80">
                            {pkg.category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-light text-white leading-tight font-serif tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            {pkg.title[lang].split(' ').map((word, i) => (
                                <span key={i} className="block">{word.toUpperCase()}</span>
                            ))}
                        </h3>
                    </div>
                </div>

                {/* REFRACTION SHINE: Light following cursor */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                        background: `linear-gradient(${135 + mouseX.get() * 20}deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(212,175,55,0.05) 100%)`,
                    }}
                />
            </motion.a>

            {/* Deep Floating Shadow */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/60 blur-3xl rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>
    );
}
