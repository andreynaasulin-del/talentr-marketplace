'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

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
        <section className="relative py-24 pb-32 bg-[#020304] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(20,20,25,1)_0%,_#000_80%)]" />
                <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-[#D4AF37] blur-[120px] opacity-15 mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#4B0082] blur-[120px] opacity-15 mix-blend-screen" />
            </div>

            {/* Header */}
            <div className="relative z-10 max-w-[1280px] mx-auto mb-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <span className="inline-block text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-[0.8em] mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        Exclusive
                    </span>
                    <h2 className="font-serif text-[clamp(2.5rem,8vw,6.5rem)] font-normal text-white tracking-tighter leading-[0.95] mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        {t.title}
                    </h2>
                    <p className="text-white/35 text-[clamp(1rem,1.5vw,1.2rem)] max-w-[500px] mx-auto font-light leading-relaxed">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            {/* Two Row Marquee */}
            <div className="relative z-10 flex flex-col gap-16">
                <div className="w-full py-5 overflow-visible" style={{ perspective: '1500px' }}>
                    <div className="flex gap-16 w-max pl-5 animate-marquee-left hover:[animation-play-state:paused] will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                        {[...topRow, ...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`top-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>

                <div className="w-full py-5 overflow-visible" style={{ perspective: '1500px' }}>
                    <div className="flex gap-16 w-max pl-5 animate-marquee-right hover:[animation-play-state:paused] will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                        {[...bottomRow, ...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`bottom-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.3333%, 0, 0); }
                }
                @keyframes marquee-right {
                    0% { transform: translate3d(-33.3333%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }
                .animate-marquee-left { animation: marquee-left 100s linear infinite; }
                .animate-marquee-right { animation: marquee-right 110s linear infinite; }
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

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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
        <div className="w-[340px] h-[340px] shrink-0 relative group" style={{ perspective: '1500px' }}>
            <motion.div
                ref={cardRef}
                className="w-full h-full relative rounded-[2px] cursor-pointer transition-transform duration-100 ease-out"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
                <Link
                    href={`/package/${pkg.id}`}
                    className={cn(
                        "block w-full h-full",
                        lang === 'he' ? "text-right" : "text-left"
                    )}
                    style={{ transformStyle: 'preserve-3d', direction: lang === 'he' ? 'rtl' : 'ltr' }}
                >

                    {/* LAYER 1: Base Image (Deep inside) */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#111] shadow-[0_45px_100px_rgba(0,0,0,0.9)]" style={{ transform: 'translateZ(10px) scale(0.96)' }}>
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            sizes="400px"
                            className="object-cover opacity-100 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-70 saturate-[1.1] contrast-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    {/* LAYER 2: Glass Body (The physical block) */}
                    <div className="absolute inset-0 rounded-lg bg-white/[0.04] backdrop-blur-[2px] border border-white/10 shadow-[inner_0_0_50px_rgba(255,255,255,0.05)] overflow-hidden" style={{ transform: 'translateZ(35px)' }}>

                        {/* THE GOLDEN BEVEL (Real Metal Look) */}
                        <div className="absolute inset-0 border-[2px] border-transparent rounded-lg opacity-90"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 20%, #B8860B 40%, rgba(212,175,55,0.2) 50%, #D4AF37 70%, #F7E7CE 85%, #B8860B 100%)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                            }}
                        />

                        {/* Edge Highlight (Top left) */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Inner Gold Ambient Glow */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(212,175,55,0.2)] opacity-60 group-hover:opacity-100 group-hover:shadow-[inset_0_0_60px_rgba(212,175,55,0.35)] transition-all duration-700" />

                        {/* Dynamic Glare - Sweep light */}
                        <motion.div
                            className="absolute inset-[-100%] w-[300%] h-[300%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 50%)`
                            }}
                        />
                    </div>

                    {/* LAYER 3: Content (Floating above) */}
                    <div className="absolute inset-0 flex items-end p-9" style={{ transform: 'translateZ(75px)' }}>
                        <div className="w-full">
                            <span className={cn(
                                "block uppercase font-black mb-3 drop-shadow-lg",
                                lang === 'he' ? "text-[11px] tracking-normal" : "text-[9px] tracking-[0.35em]",
                                "text-[#D4AF37]"
                            )}>
                                {pkg.category}
                            </span>
                            <h3 className={cn(
                                "font-serif leading-[1.1] text-[#F7E7CE] mb-6 drop-shadow-[0_8px_30px_rgba(0,0,0,1)]",
                                lang === 'he' ? "text-3xl font-bold" : "text-2xl font-normal"
                            )}
                                style={{ filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.25))' }}
                            >
                                {pkg.title[lang]}
                            </h3>

                            {/* Animated Underline */}
                            <div className={cn(
                                "h-[1.5px] bg-[#D4AF37] transition-all duration-700 ease-out",
                                lang === 'he' ? "origin-right" : "origin-left",
                                "w-10 group-hover:w-full opacity-60 group-hover:opacity-100 mb-6"
                            )} />

                            {/* Action Button */}
                            <div className={cn(
                                "flex items-center gap-2 text-white text-[11px] uppercase font-bold tracking-[0.2em] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700",
                                lang === 'he' && "flex-row-reverse"
                            )}>
                                <span>{lang === 'he' ? 'צפה בפרטים' : 'View Details'}</span>
                                <ArrowUpRight className={cn("w-4 h-4", lang === 'he' && "rotate-[-90deg]")} />
                            </div>
                        </div>
                    </div>

                </Link>
            </motion.div>
        </div>
    );
}
