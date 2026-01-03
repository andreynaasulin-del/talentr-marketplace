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
            title: 'Digital Boutique',
            subtitle: 'Exclusive sets curated for the most demanding occasions.',
            explore: 'Explore',
        },
        he: {
            title: 'בוטיק דיגיטלי',
            subtitle: 'סטים בלעדיים שנבחרו לרגעים התובעניים ביותר.',
            explore: 'גלה',
        },
    };

    const t = content[lang];
    
    const allPackages = [...packages, ...packages];
    const firstRow = allPackages.slice(0, 10);
    const secondRow = allPackages.slice(10, 20);

    return (
        <section id="packages" className="py-24 md:py-48 bg-[#020617] overflow-visible relative">
            {/* Ultra-Luxury Dynamic Ambient Lighting */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[100%] bg-radial-gradient from-blue-900/20 via-transparent to-transparent opacity-40 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-radial-gradient from-cyan-900/10 via-transparent to-transparent opacity-30 blur-[120px]" />
                
                {/* Floating Bokeh Light Particles */}
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0], 
                        y: [0, -50, 0],
                        opacity: [0.1, 0.3, 0.1] 
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" 
                />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-24 md:mb-40">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-2xl">
                        <span className="text-[11px] font-black text-amber-200/60 uppercase tracking-[0.6em] font-serif italic">Privé</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.9]">
                        <span className="text-gradient-luxury">{t.title}</span>
                    </h2>
                    <p className="text-white/20 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed font-serif italic">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            {/* Fluid Floating Layout with staggering */}
            <div className="relative z-10 flex flex-col gap-24 md:gap-40" style={{ direction: 'ltr' }}>
                <MarqueeRow items={firstRow} direction="left" lang={lang} t={t} staggered />
                <MarqueeRow items={secondRow} direction="right" lang={lang} t={t} />
            </div>
        </section>
    );
}

function MarqueeRow({ items, direction, lang, t, staggered = false }: { items: Package[]; direction: 'left' | 'right'; lang: 'en' | 'he'; t: any; staggered?: boolean }) {
    const doubledItems = [...items, ...items];

    return (
        <div className="flex w-full overflow-hidden select-none">
            <motion.div
                className="flex gap-16 md:gap-24 items-center"
                animate={{
                    x: direction === 'left' ? [0, -400 * items.length] : [-400 * items.length, 0],
                }}
                transition={{
                    duration: 70,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((pkg, idx) => (
                    <div 
                        key={`${pkg.id}-${idx}`} 
                        className={cn(
                            "flex-shrink-0 w-[320px] md:w-[400px] transition-all duration-1000 ease-in-out",
                            staggered && idx % 2 === 0 ? "translate-y-16" : staggered ? "-translate-y-16" : "translate-y-0"
                        )}
                    >
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
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { stiffness: 60, damping: 20, mass: 1.2 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
    const scale = useSpring(isHovered ? 1.1 : 1, springConfig);
    
    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
        mouseY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };

    return (
        <motion.div
            className="relative perspective-[2500px]"
            initial={{ opacity: 0, filter: 'blur(40px)', scale: 0.7 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <motion.a
                ref={cardRef}
                href={`/package/${pkg.id}`}
                className="group block relative aspect-[2/3] overflow-hidden rounded-[80px] bg-white/[0.02] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-1000"
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
                    mouseX.set(0);
                    mouseY.set(0);
                }}
            >
                {/* Advanced 3D Refraction & Glass Polish */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/60 mix-blend-overlay z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent z-10 pointer-events-none" />
                
                {/* Thin Glowing Borders */}
                <div className={cn(
                    "absolute inset-0 rounded-[80px] border-[1px] transition-all duration-1000 z-20 pointer-events-none",
                    isHovered ? "border-cyan-400/40 shadow-[inset_0_0_60px_rgba(0,212,255,0.15)]" : "border-white/10"
                )} />

                {/* Talent Visual - Simulated Video Loop with slow pan/zoom */}
                <motion.div 
                    className="absolute inset-0 w-full h-full"
                    animate={isHovered ? { 
                        scale: 1.2, 
                        filter: 'blur(0px)',
                        x: [0, -10, 10, 0],
                        y: [0, 5, -5, 0]
                    } : { 
                        scale: 1.05, 
                        filter: 'blur(4px)',
                        x: 0,
                        y: 0
                    }}
                    transition={{ 
                        scale: { duration: 1.5 },
                        x: { duration: 10, repeat: Infinity, ease: "linear" },
                        y: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                >
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        className="object-cover"
                        sizes="500px"
                    />
                    
                    {/* Intimate Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)] opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
                </motion.div>
                
                {/* Information Overlay - Hyper Parallax */}
                <motion.div 
                    className="absolute inset-0 p-12 flex flex-col justify-end z-30"
                    style={{ transform: 'translateZ(120px)' }}
                >
                    <div className="space-y-6">
                        <span className="inline-block text-[12px] font-black text-amber-200/80 uppercase tracking-[0.8em] font-serif italic mb-4">
                            {pkg.category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-[1.1] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                            {pkg.title[lang]}
                        </h3>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        >
                            <p className="text-white/40 text-sm font-medium leading-relaxed font-serif italic border-t border-white/5 pt-8 mt-4">
                                {pkg.description[lang]}
                            </p>
                        </motion.div>
                    </div>
                    
                    {/* Floating Action Circle */}
                    <div className={cn(
                        "absolute top-12 right-12 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-1000 backdrop-blur-3xl border border-white/10",
                        isHovered ? "bg-white text-slate-950 scale-110 rotate-[315deg] shadow-[0_0_50px_rgba(255,255,255,0.4)]" : "bg-white/5 text-white"
                    )}>
                        <ArrowUpRight className="w-8 h-8" />
                    </div>
                </motion.div>

                {/* Liquid Light Caustic Follower */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    style={{
                        background: `radial-gradient(circle at ${50 + mouseX.get() * 100}% ${50 + mouseY.get() * 100}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                    }}
                />
            </motion.a>
            
            {/* Realistic Drop Shadow */}
            <div className={cn(
                "absolute -bottom-16 left-1/2 -translate-x-1/2 w-[70%] h-12 bg-black/60 blur-[60px] rounded-full transition-all duration-1000",
                isHovered ? "opacity-100 scale-110" : "opacity-30 scale-90"
            )} />
        </motion.div>
    );
}
