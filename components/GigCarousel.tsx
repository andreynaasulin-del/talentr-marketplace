'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
            min: 'min',
            guests: 'guests',
        },
        he: {
            title: 'חוויות נושאיות',
            subtitle: 'סטים שנבחרו בקפידה לאווירה ורגעים ספציפיים.',
            explore: 'גלה',
            min: 'דק׳',
            guests: 'אורחים',
        },
    };

    const t = content[lang];

    // Split packages for two rows
    const allPackages = [...packages, ...packages];
    const firstRow = allPackages.slice(0, 10);
    const secondRow = allPackages.slice(10, 20);

    return (
        <section id="packages" className="py-20 md:py-28 bg-[#0a1628] overflow-visible relative">
            {/* Background mesh gradient */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-cyan-400">Premium Collection</span>
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        <span className="text-gradient-luxury">{t.title}</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            <div className="relative z-10 flex flex-col gap-8" style={{ direction: 'ltr' }}>
                {/* Marquee Row 1 - Right to Left */}
                <div className="block w-full">
                    <MarqueeRow items={firstRow} direction="left" lang={lang} t={t} />
                </div>

                {/* Marquee Row 2 - Left to Right */}
                <div className="block w-full">
                    <MarqueeRow items={secondRow} direction="right" lang={lang} t={t} />
                </div>
            </div>
        </section>
    );
}

interface MarqueeRowProps {
    items: Package[];
    direction: 'left' | 'right';
    lang: 'en' | 'he';
    t: any;
}

function MarqueeRow({ items, direction, lang, t }: MarqueeRowProps) {
    const doubledItems = [...items, ...items, ...items];

    return (
        <div className="flex w-full overflow-hidden select-none">
            <motion.div
                className="flex gap-4 md:gap-6"
                animate={{
                    x: direction === 'left' ? [0, -280 * items.length] : [-280 * items.length, 0],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((pkg, idx) => (
                    <div key={`${pkg.id}-${idx}`} className="flex-shrink-0 w-[240px] md:w-[280px]">
                        <PackageCube3D pkg={pkg} lang={lang} t={t} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

interface PackageCube3DProps {
    pkg: Package;
    lang: 'en' | 'he';
    t: any;
}

function PackageCube3D({ pkg, lang, t }: PackageCube3DProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth spring physics
    const springConfig = { stiffness: 150, damping: 20 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
    const scale = useSpring(isHovered ? 1.05 : 1, springConfig);
    
    // Glare effect position
    const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
    
    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (e.clientX - centerX) / rect.width;
        const y = (e.clientY - centerY) / rect.height;
        
        mouseX.set(x);
        mouseY.set(y);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            className="relative group perspective-[1000px]"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Glow effect under card */}
            <motion.div 
                className="absolute -inset-2 rounded-[40px] bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 blur-xl transition-opacity duration-500"
                style={{ 
                    opacity: isHovered ? 1 : 0,
                    transform: 'translateZ(-20px)',
                }}
            />
            
            {/* Reflection under card */}
            <motion.div 
                className="absolute inset-x-4 -bottom-4 h-16 rounded-[32px] bg-gradient-to-t from-cyan-500/20 to-transparent blur-xl transition-opacity duration-500"
                style={{ opacity: isHovered ? 0.6 : 0 }}
            />
            
            <motion.a
                ref={cardRef}
                href={`/package/${pkg.id}`}
                className="block relative aspect-square overflow-hidden rounded-[32px] md:rounded-[40px] bg-[#0f2340] border border-cyan-500/10 cursor-pointer"
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                whileTap={{ scale: 0.98 }}
            >
                {/* Image */}
                <Image
                    src={pkg.image}
                    alt={pkg.title[lang]}
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{ 
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                    sizes="(max-width: 768px) 240px, 280px"
                />
                
                {/* Gradient Overlay */}
                <div 
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(to top, 
                            rgba(10, 22, 40, 0.95) 0%, 
                            rgba(10, 22, 40, ${isHovered ? '0.4' : '0.2'}) 50%, 
                            transparent 100%
                        )`,
                    }}
                />
                
                {/* Glare Effect */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(
                            circle at ${glareX.get()}% ${glareY.get()}%,
                            rgba(255, 255, 255, 0.15) 0%,
                            transparent 50%
                        )`,
                        opacity: isHovered ? 1 : 0,
                    }}
                />
                
                {/* Border glow on hover */}
                <div 
                    className={cn(
                        "absolute inset-0 rounded-[32px] md:rounded-[40px] border-2 transition-all duration-500",
                        isHovered 
                            ? "border-cyan-400/50 shadow-[inset_0_0_30px_rgba(0,212,255,0.1)]" 
                            : "border-transparent"
                    )}
                />

                {/* Content Bottom - 3D lifted */}
                <motion.div 
                    className="absolute inset-x-0 bottom-0 p-5 md:p-6"
                    style={{
                        transform: 'translateZ(30px)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <motion.span 
                                className="inline-block text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest mb-1.5"
                                style={{ transform: 'translateZ(10px)' }}
                            >
                                {pkg.category}
                            </motion.span>
                            <motion.h3 
                                className="text-lg md:text-xl font-black text-white leading-snug mb-2 drop-shadow-lg min-h-[3rem]"
                                style={{ transform: 'translateZ(20px)' }}
                            >
                                {pkg.title[lang]}
                            </motion.h3>
                        </div>
                        <motion.div 
                            className={cn(
                                "backdrop-blur-md p-2.5 rounded-xl transition-all duration-300",
                                isHovered 
                                    ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30 scale-110" 
                                    : "bg-white/10 text-white"
                            )}
                            style={{ transform: 'translateZ(40px)' }}
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
                    </div>

                    {/* Description - reveals on hover */}
                    <motion.p 
                        className="text-white/60 text-xs font-medium line-clamp-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                            opacity: isHovered ? 1 : 0, 
                            y: isHovered ? 0 : 10,
                        }}
                        transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
                        style={{ transform: 'translateZ(15px)' }}
                    >
                        {pkg.description[lang]}
                    </motion.p>
                </motion.div>
            </motion.a>
        </motion.div>
    );
}
