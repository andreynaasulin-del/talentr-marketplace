'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, MouseEvent } from 'react';

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

    // Filter packages
    const filtered = packages.filter(
        (p) =>
            !['Bartender', 'Sommelier'].includes(p.category) &&
            !/whisky|whiskey|cocktail|бар|алко/i.test(p.title.en + ' ' + (p.title.he || ''))
    );

    // Split rows
    const mid = Math.ceil(filtered.length / 2);
    const topRow = filtered.slice(0, mid);
    const bottomRow = filtered.slice(mid);

    return (
        <section className="gig-carousel-section">
            {/* Background */}
            <div className="gig-bg">
                <div className="gig-bg-gradient" />
                <div className="gig-bg-orb-gold" />
                <div className="gig-bg-orb-purple" />
            </div>

            {/* Header - respects language direction */}
            <div className="gig-header" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="gig-eyebrow">Exclusive</span>
                    <h2 className="gig-title">{t.title}</h2>
                    <p className="gig-subtitle">{t.subtitle}</p>
                </motion.div>
            </div>

            {/* CRITICAL: Force dir="ltr" on slider so animation physics don't break in Hebrew */}
            <div className="gig-rows" dir="ltr">
                {/* ROW 1 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-left">
                        {[...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`r1-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                    {/* Duplicate track for seamless loop */}
                    <div className="gig-track gig-track-left" aria-hidden="true">
                        {[...topRow, ...topRow].map((pkg, i) => (
                            <GigCard key={`r1-dup-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="gig-row">
                    <div className="gig-track gig-track-right">
                        {[...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`r2-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                    <div className="gig-track gig-track-right" aria-hidden="true">
                        {[...bottomRow, ...bottomRow].map((pkg, i) => (
                            <GigCard key={`r2-dup-${pkg.id}-${i}`} pkg={pkg} lang={lang} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .gig-carousel-section {
                    position: relative;
                    padding: 96px 0 128px;
                    background: #020304;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    overflow-x: hidden !important;
                }
                
                .gig-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }
                
                .gig-bg-gradient {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(20,20,25,1) 0%, #000 80%);
                }
                
                .gig-bg-orb-gold {
                    position: absolute;
                    top: -10%;
                    left: 20%;
                    width: 800px;
                    height: 800px;
                    border-radius: 50%;
                    background: #D4AF37;
                    filter: blur(120px);
                    opacity: 0.15;
                    mix-blend-mode: screen;
                }
                
                .gig-bg-orb-purple {
                    position: absolute;
                    bottom: -10%;
                    right: 10%;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: #4B0082;
                    filter: blur(120px);
                    opacity: 0.15;
                    mix-blend-mode: screen;
                }
                
                .gig-header {
                    position: relative;
                    z-index: 10;
                    max-width: 1280px;
                    margin: 0 auto 80px;
                    padding: 0 24px;
                    text-align: center;
                }
                
                .gig-eyebrow {
                    display: inline-block;
                    text-transform: uppercase;
                    font-weight: 900;
                    margin-bottom: 24px;
                    font-size: 10px;
                    color: #D4AF37;
                    letter-spacing: 0.8em;
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
                }
                
                .gig-title {
                    font-family: var(--font-serif), serif;
                    font-weight: 400;
                    letter-spacing: -0.02em;
                    line-height: 0.95;
                    margin-bottom: 24px;
                    font-size: clamp(3rem, 10vw, 7rem);
                    background: linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: inline-block;
                }
                
                .gig-subtitle {
                    color: rgba(255,255,255,0.4);
                    font-size: clamp(1.1rem, 1.8vw, 1.4rem);
                    max-width: 600px;
                    margin: 16px auto 0;
                    font-weight: 300;
                    line-height: 1.6;
                }
                
                /* SLIDER PHYSICS - FORCE LTR */
                .gig-rows {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 60px;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    direction: ltr !important;
                }
                
                .gig-row {
                    display: flex;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden !important;
                    white-space: nowrap;
                }
                
                .gig-track {
                    display: flex;
                    gap: 40px;
                    padding: 20px 0;
                    flex-shrink: 0;
                    width: max-content;
                    will-change: transform;
                }
                
                .gig-track-left {
                    animation: scroll-left 90s linear infinite;
                }
                
                .gig-track-right {
                    animation: scroll-right 100s linear infinite;
                }
                
                /* Pause on hover */
                .gig-row:hover .gig-track {
                    animation-play-state: paused;
                }
                
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                
                @keyframes scroll-right {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
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

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const isHebrew = lang === 'he';

    return (
        <div className="gig-card-wrap group" style={{ width: '340px', height: '340px', flexShrink: 0, perspective: '1500px' }}>
            <motion.div
                ref={cardRef}
                className="gig-card-inner"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
            >
                <Link href={`/package/${pkg.id}`} style={{ display: 'block', width: '100%', height: '100%', transformStyle: 'preserve-3d', textDecoration: 'none' }}>

                    {/* IMAGE - BASE LAYER */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden', background: '#050505', boxShadow: '0 40px 80px rgba(0,0,0,0.9)', transform: 'translateZ(10px) scale(0.96)' }}>
                        <Image src={pkg.image} alt={pkg.title[lang]} fill sizes="400px" className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-60 saturate-[1.15]" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, black, rgba(0,0,0,0.3) 50%, transparent)' }} />
                    </div>

                    {/* GLASS - MIDDLE LAYER */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', transform: 'translateZ(40px)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(2px)', boxShadow: 'inset 0 0 50px rgba(255,255,255,0.02)' }}>
                        <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderRadius: '16px', background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 25%, #B8860B 50%, #D4AF37 75%, #F7E7CE 100%)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                        <motion.div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" style={{ position: 'absolute', inset: '-100%', width: '300%', height: '300%', mixBlendMode: 'overlay', background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 50%)` }} />
                    </div>

                    {/* CONTENT - TOP LAYER (RTL logic ONLY here) */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px', transform: 'translateZ(80px)', direction: isHebrew ? 'rtl' : 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>
                        <span style={{ display: 'block', textTransform: 'uppercase', fontWeight: 900, marginBottom: '10px', color: '#D4AF37', fontSize: isHebrew ? '11px' : '9px', letterSpacing: isHebrew ? '0' : '0.4em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                            {pkg.category}
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-serif), serif', lineHeight: 1.1, marginBottom: '20px', color: '#F7E7CE', fontSize: isHebrew ? '30px' : '26px', fontWeight: isHebrew ? 700 : 400, textShadow: '0 8px 30px rgba(0,0,0,1)', filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.25))' }}>
                            {pkg.title[lang]}
                        </h3>
                        <div className="group-hover:w-full group-hover:opacity-100" style={{ height: '2px', background: '#D4AF37', transition: 'all 0.7s ease-out', width: '35px', marginBottom: '20px', opacity: 0.6, float: isHebrew ? 'right' : 'left' }} />
                        <div style={{ clear: 'both' }} />
                        <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.2em', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                            <span>{isHebrew ? 'גלה עוד' : 'Discover More'}</span>
                            <ArrowUpRight style={{ width: '16px', height: '16px', color: '#D4AF37', transform: isHebrew ? 'rotate(-90deg)' : 'none' }} />
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}