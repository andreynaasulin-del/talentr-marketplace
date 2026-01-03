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
            title: 'Thematic Experiences',
            subtitle: 'Curated sets designed for specific vibes and moments.',
            explore: 'Explore',
        },
        he: {
            title: 'חוויות נושאיות',
            subtitle: 'סטים שנבחרו בקפידה לאווירה ורגעים ספציפיים.',
            explore: 'גלה',
        },
    };

    const t = content[lang];
    const allPackages = [...packages, ...packages];
    const firstRow = allPackages.slice(0, 10);
    const secondRow = allPackages.slice(10, 20);

    return (
        <section id="packages" className="py-24 md:py-32 bg-[#0a1628] overflow-visible relative">
            {/* Ambient Background - Silent Luxury */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.9 }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white/70 uppercase tracking-[0.2em]">Curated Selection</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        <span className="text-gradient-luxury">{t.title}</span>
                    </h2>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            <div className="relative z-10 flex flex-col gap-12" style={{ direction: 'ltr' }}>
                <MarqueeRow items={firstRow} direction="left" lang={lang} t={t} />
                <MarqueeRow items={secondRow} direction="right" lang={lang} t={t} />
            </div>
        </section>
    );
}

function MarqueeRow({ items, direction, lang, t }: { items: Package[]; direction: 'left' | 'right'; lang: 'en' | 'he'; t: any }) {
    const doubledItems = [...items, ...items, ...items];

    return (
        <div className="flex w-full overflow-hidden select-none">
            <motion.div
                className="flex gap-8"
                animate={{
                    x: direction === 'left' ? [0, -320 * items.length] : [-320 * items.length, 0],
                }}
                transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((pkg, idx) => (
                    <div key={`${pkg.id}-${idx}`} className="flex-shrink-0 w-[280px] md:w-[320px]">
                        <PackageCubeLuxury pkg={pkg} lang={lang} t={t} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function PackageCubeLuxury({ pkg, lang, t }: { pkg: Package; lang: 'en' | 'he'; t: any }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    // Physics-based motion
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { stiffness: 100, damping: 20, mass: 1 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
    const scale = useSpring(isPressed ? 0.95 : isHovered ? 1.05 : 1, springConfig);
    const blurEffect = useSpring(isHovered ? 0 : 2, springConfig);
    
    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
        mouseY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };

    return (
        <motion.div
            className="relative perspective-[1500px]"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Holographic Aura behind card */}
            <motion.div 
                className="absolute -inset-4 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
                style={{
                    background: `conic-gradient(from 0deg, transparent, rgba(0, 212, 255, 0.1), rgba(251, 191, 36, 0.1), transparent)`,
                    rotate: isHovered ? 360 : 0,
                    opacity: isHovered ? 0.4 : 0,
                }}
                animate={isHovered ? { rotate: 360 } : {}}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            <motion.a
                ref={cardRef}
                href={`/package/${pkg.id}`}
                className="group block relative aspect-[4/5] overflow-hidden rounded-[40px] bg-[#0f2340] border border-white/5 cursor-pointer"
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsPressed(false);
                    mouseX.set(0);
                    mouseY.set(0);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
            >
                {/* Image with assembled focus */}
                <motion.div 
                    className="absolute inset-0 w-full h-full"
                    style={{ filter: `blur(${blurEffect.get()}px)` }}
                >
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="320px"
                    />
                </motion.div>
                
                {/* Safe Internal Light (Caustics) */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at ${50 + mouseX.get() * 100}% ${50 + mouseY.get() * 100}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                        opacity: isHovered ? 1 : 0,
                    }}
                />

                {/* Dark Vignette - Material Weight */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-black/20" />

                {/* Golden Dust Particles (CSS Animation) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-amber-400/40 rounded-full blur-[1px]"
                                    initial={{ 
                                        x: Math.random() * 300, 
                                        y: 400,
                                        opacity: 0 
                                    }}
                                    animate={{ 
                                        y: -20,
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.5, 0]
                                    }}
                                    transition={{ 
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Magnetic Interaction Content */}
                <motion.div 
                    className="absolute inset-0 p-8 flex flex-col justify-end"
                    style={{ transform: 'translateZ(50px)' }}
                >
                    <motion.div 
                        className="flex items-start justify-between gap-4"
                        animate={isPressed ? { x: [-1, 1, -1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                    >
                        <div className="flex-1">
                            <span className="inline-block text-[10px] font-black text-amber-400/80 uppercase tracking-[0.3em] mb-3">
                                {pkg.category}
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
                                {pkg.title[lang]}
                            </h3>
                        </div>
                        
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/10",
                            isHovered ? "bg-white text-[#0a1628] scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "bg-white/10 text-white"
                        )}>
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </motion.div>

                    {/* Luxury Reveal Info */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="text-white/50 text-xs font-medium leading-relaxed mt-2 border-t border-white/10 pt-4">
                            {pkg.description[lang]}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Border Glow - "Safe" Rim Light */}
                <div className={cn(
                    "absolute inset-0 rounded-[40px] border-2 transition-all duration-700",
                    isHovered ? "border-white/20" : "border-transparent"
                )} />
            </motion.a>
        </motion.div>
    );
}
