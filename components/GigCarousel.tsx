'use client';

// LUXURY BOUTIQUE GIG CAROUSEL - V2.2 (Bulletproof Force Update)
// This version uses absolute inline styles to bypass ANY CSS caching issues on Vercel.

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

    // Split into two rows (ensure we always have 2 rows)
    const mid = Math.ceil(filtered.length / 2);
    let topRow = filtered.slice(0, mid);
    let bottomRow = filtered.slice(mid);

    if (bottomRow.length === 0 && topRow.length > 1) {
        const split = Math.ceil(topRow.length / 2);
        bottomRow = topRow.slice(split);
        topRow = topRow.slice(0, split);
    }

    return (
        <section className="relative py-24 pb-32 overflow-hidden" style={{ background: '#020304', minHeight: '800px' }}>
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(20,20,25,1)_0%,_#000_80%)]" />
                <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-[#D4AF37] blur-[120px] opacity-15" style={{ mixBlendMode: 'screen' }} />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#4B0082] blur-[120px] opacity-15" style={{ mixBlendMode: 'screen' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 max-w-[1280px] mx-auto mb-24 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span
                        className="inline-block uppercase font-black mb-6"
                        style={{
                            fontSize: '10px',
                            color: '#D4AF37',
                            letterSpacing: '0.8em',
                            textShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
                        }}
                    >
                        Exclusive
                    </span>
                    <h2
                        className="font-serif font-normal tracking-tighter leading-[0.95] mb-6"
                        style={{
                            fontSize: 'clamp(3rem, 10vw, 7rem)',
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}
                    >
                        {t.title}
                    </h2>
                    <p className="text-white/40 text-[clamp(1.1rem,1.8vw,1.4rem)] max-w-[600px] mx-auto font-light leading-relaxed mt-4">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            {/* TWO ROW MARQUEE SYSTEM */}
            <div className="relative z-10 flex flex-col gap-16">
                {/* ROW 1 - FLOW LEFT */}
                <div className="w-full flex overflow-visible" style={{ perspective: '2000px' }}>
                    <div className="flex gap-12 w-max animate-marquee-left hover:[animation-play-state:paused]" style={{ transformStyle: 'preserve-3d', padding: '20px 0' }}>
                        {[...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`top-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>

                {/* ROW 2 - FLOW RIGHT */}
                <div className="w-full flex overflow-visible" style={{ perspective: '2000px' }}>
                    <div className="flex gap-12 w-max animate-marquee-right hover:[animation-play-state:paused]" style={{ transformStyle: 'preserve-3d', padding: '20px 0' }}>
                        {[...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`bottom-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                @keyframes marquee-right {
                    0% { transform: translate3d(-50%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }
                .animate-marquee-left { animation: marquee-left 80s linear infinite; }
                .animate-marquee-right { animation: marquee-right 90s linear infinite; }
            `}</style>
        </section>
    );
}

function GigCard({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <div className="w-[380px] h-[380px] shrink-0 relative group" style={{ perspective: '1500px' }}>
            <motion.div
                ref={cardRef}
                className="w-full h-full relative cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
                <Link
                    href={`/package/${pkg.id}`}
                    className="block w-full h-full"
                    style={{ transformStyle: 'preserve-3d', textDecoration: 'none' }}
                >
                    {/* LAYER 1: IMAGE (Base) */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#050505] shadow-[0_50px_100px_rgba(0,0,0,1)]" style={{ transform: 'translateZ(10px) scale(0.96)' }}>
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            sizes="400px"
                            className="object-cover opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60 saturate-[1.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    </div>

                    {/* LAYER 2: THE MONOLITH GLASS FRAME */}
                    <div
                        className="absolute inset-0 rounded-2xl border border-white/10 overflow-hidden"
                        style={{
                            transform: 'translateZ(45px)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(2px)',
                            boxShadow: 'inset 0 0 60px rgba(255,255,255,0.03)'
                        }}
                    >
                        {/* REAL METAL BEVEL */}
                        <div className="absolute inset-0 border-[2.5px] border-transparent rounded-2xl opacity-100"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 25%, #B8860B 50%, #D4AF37 75%, #F7E7CE 100%)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude'
                            }}
                        />

                        {/* AMBIENT INTERNAL GLOW */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(212,175,55,0.2)] opacity-60 group-hover:opacity-100 transition-all duration-700" />

                        {/* GLARE SWEEP */}
                        <motion.div
                            className="absolute inset-[-100%] w-[300%] h-[300%] opacity-0 group-hover:opacity-100 mix-blend-overlay pointer-events-none"
                            style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.5) 0%, transparent 60%)` }}
                        />
                    </div>

                    {/* LAYER 3: THE FLOATING CONTENT */}
                    <div className="absolute inset-0 flex flex-col justify-end p-10" style={{ transform: 'translateZ(90px)', direction: lang === 'he' ? 'rtl' : 'ltr' }}>
                        <div style={{ textAlign: lang === 'he' ? 'right' : 'left' }}>
                            <span
                                className="block uppercase font-black mb-3"
                                style={{
                                    color: '#D4AF37',
                                    fontSize: lang === 'he' ? '12px' : '9px',
                                    letterSpacing: lang === 'he' ? '0' : '0.5em',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                }}
                            >
                                {pkg.category}
                            </span>
                            <h3
                                className="font-serif leading-[1.1] mb-6"
                                style={{
                                    color: '#F7E7CE',
                                    fontSize: lang === 'he' ? '34px' : '28px',
                                    fontWeight: lang === 'he' ? '700' : '400',
                                    textShadow: '0 10px 40px rgba(0,0,0,1)',
                                    filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.3))'
                                }}
                            >
                                {pkg.title[lang]}
                            </h3>

                            {/* DYNAMIC LINE */}
                            <div style={{
                                height: '2.5px',
                                background: '#D4AF37',
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                width: '40px',
                                marginBottom: '24px',
                                opacity: '0.6',
                                borderRadius: '1px'
                            }} className="group-hover:w-full group-hover:opacity-100" />

                            <div
                                className="flex items-center gap-3 text-white text-[11px] uppercase font-bold tracking-[0.25em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700"
                                style={{ flexDirection: lang === 'he' ? 'row-reverse' : 'row' }}
                            >
                                <span>{lang === 'he' ? 'גלה עוד' : 'Discover More'}</span>
                                <ArrowUpRight className={cn("w-5 h-5", lang === 'he' && "rotate-[-90deg]")} style={{ color: '#D4AF37' }} />
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
