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
                    gap: 32px;
                    padding: 20px 16px;
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
        <div className="gig-card-wrap group" style={{ width: '340px', height: '380px', flexShrink: 0, perspective: '1200px' }}>
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
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Link href={`/package/${pkg.id}`} style={{ display: 'block', width: '100%', height: '100%', transformStyle: 'preserve-3d', textDecoration: 'none' }}>

                    {/* LAYER 0: DEEP SHADOW BASE */}
                    <div style={{
                        position: 'absolute',
                        inset: '10px',
                        borderRadius: '24px',
                        background: 'rgba(0,0,0,0.8)',
                        transform: 'translateZ(-20px)',
                        filter: 'blur(30px)',
                    }} />

                    {/* LAYER 1: CARD BASE - Dark foundation */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
                        transform: 'translateZ(0px)',
                    }}>
                        {/* Image */}
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            sizes="400px"
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                            style={{ opacity: 0.85, filter: 'saturate(1.2) contrast(1.05)' }}
                        />
                        {/* Vignette */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `
                                radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%),
                                linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 35%, transparent 65%)
                            `
                        }} />
                    </div>

                    {/* LAYER 2: GLASS PANEL - Floating above image */}
                    <div style={{
                        position: 'absolute',
                        inset: '8px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transform: 'translateZ(30px)',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(1px)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.2)',
                    }}>
                        {/* Inner edge highlight */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            pointerEvents: 'none',
                        }} />
                    </div>

                    {/* LAYER 3: GOLD BEVEL FRAME - 3D raised edge */}
                    <div style={{
                        position: 'absolute',
                        inset: '4px',
                        borderRadius: '18px',
                        transform: 'translateZ(50px)',
                        pointerEvents: 'none',
                    }}>
                        {/* Gold gradient border */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '18px',
                            padding: '2px',
                            background: 'linear-gradient(145deg, #D4AF37 0%, #F7E7CE 20%, #B8860B 40%, #D4AF37 60%, #F7E7CE 80%, #B8860B 100%)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            boxShadow: '0 0 20px rgba(212,175,55,0.3), inset 0 0 10px rgba(212,175,55,0.2)',
                        }} />

                        {/* Top highlight - simulates light hitting the bevel */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '10%',
                            right: '10%',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(247,231,206,0.8), transparent)',
                        }} />
                    </div>

                    {/* LAYER 4: GLARE EFFECT - Interactive shine */}
                    <motion.div
                        className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                        style={{
                            position: 'absolute',
                            inset: '-50%',
                            width: '200%',
                            height: '200%',
                            transform: 'translateZ(60px)',
                            mixBlendMode: 'overlay',
                            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.5) 0%, transparent 40%)`
                        }}
                    />

                    {/* LAYER 5: CONTENT - Floating text */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '28px',
                        transform: 'translateZ(80px)',
                        direction: isHebrew ? 'rtl' : 'ltr',
                        textAlign: isHebrew ? 'right' : 'left'
                    }}>
                        {/* Category badge */}
                        <span style={{
                            display: 'inline-block',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            marginBottom: '12px',
                            color: '#D4AF37',
                            fontSize: isHebrew ? '10px' : '9px',
                            letterSpacing: isHebrew ? '0.1em' : '0.35em',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                            padding: '4px 0',
                        }}>
                            {pkg.category}
                        </span>

                        {/* Title */}
                        <h3 style={{
                            fontFamily: 'var(--font-serif), Georgia, serif',
                            lineHeight: 1.05,
                            marginBottom: '16px',
                            color: '#F7E7CE',
                            fontSize: isHebrew ? '28px' : '26px',
                            fontWeight: isHebrew ? 700 : 400,
                            textShadow: '0 4px 20px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.8)',
                            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.15))',
                        }}>
                            {pkg.title[lang]}
                        </h3>

                        {/* Animated underline */}
                        <div
                            className="group-hover:w-[80px] group-hover:opacity-100"
                            style={{
                                height: '2px',
                                background: 'linear-gradient(90deg, #D4AF37, #F7E7CE)',
                                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                width: '30px',
                                marginBottom: '16px',
                                opacity: 0.7,
                                boxShadow: '0 0 8px rgba(212,175,55,0.5)',
                                float: isHebrew ? 'right' : 'left',
                            }}
                        />
                        <div style={{ clear: 'both' }} />

                        {/* CTA */}
                        <div
                            className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'white',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                flexDirection: isHebrew ? 'row-reverse' : 'row'
                            }}
                        >
                            <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {isHebrew ? 'גלה עוד' : 'Discover More'}
                            </span>
                            <ArrowUpRight style={{
                                width: '14px',
                                height: '14px',
                                color: '#D4AF37',
                                filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))',
                                transform: isHebrew ? 'rotate(-90deg)' : 'none'
                            }} />
                        </div>
                    </div>

                    {/* LAYER 6: Corner accents */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderTop: '2px solid rgba(212,175,55,0.4)', borderLeft: '2px solid rgba(212,175,55,0.4)', borderRadius: '4px 0 0 0', transform: 'translateZ(70px)', opacity: 0.6 }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderTop: '2px solid rgba(212,175,55,0.4)', borderRight: '2px solid rgba(212,175,55,0.4)', borderRadius: '0 4px 0 0', transform: 'translateZ(70px)', opacity: 0.6 }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderBottom: '2px solid rgba(212,175,55,0.4)', borderLeft: '2px solid rgba(212,175,55,0.4)', borderRadius: '0 0 0 4px', transform: 'translateZ(70px)', opacity: 0.6 }} />
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderBottom: '2px solid rgba(212,175,55,0.4)', borderRight: '2px solid rgba(212,175,55,0.4)', borderRadius: '0 0 4px 0', transform: 'translateZ(70px)', opacity: 0.6 }} />

                </Link>
            </motion.div>
        </div>
    );
}