'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MessageCircle, Sparkles, Shield, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';
    const containerRef = useRef<HTMLElement>(null);
    
    // Parallax scroll effects
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, 100]);
    const y3 = useTransform(scrollY, [0, 500], [0, 50]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
    
    // Smooth spring physics for parallax
    const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
    const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });
    const springY3 = useSpring(y3, { stiffness: 100, damping: 30 });

    const content = {
        en: {
            headline: 'The Highest Standard',
            headline2: 'of Entertainment.',
            subheadline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered. Your search ends here.',
            chat: 'What are we celebrating? 🎉',
            forMasters: 'For Masters',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
            trust1: 'Verified Pros',
            trust2: 'Instant Booking',
            trust3: 'Premium Only',
        },
        he: {
            headline: 'הסטנדרט הגבוה ביותר',
            headline2: 'של בידור.',
            subheadline: 'ללא פשרות.',
            description: 'המערכת היחידה בישראל בה מרוכזים מובילי התעשייה המאומתים. החיפוש שלכם נגמר כאן.',
            chat: 'מה חוגגים ומתי? 🎉',
            forMasters: 'לאמנים',
            forMastersDesc: 'התמקדו במה שאתם עושים הכי טוב. אנחנו נדאג שהכישרון שלכם ירוויח את מה שמגיע לו.',
            forMastersCta: 'הגש מועמדות',
            trust1: 'מאומתים',
            trust2: 'הזמנה מהירה',
            trust3: 'פרימיום בלבד',
        },
    };

    const t = content[lang];

    // Staggered text animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const wordVariants = {
        hidden: { 
            opacity: 0, 
            y: 40,
            rotateX: -15,
            filter: 'blur(10px)',
        },
        visible: { 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section ref={containerRef} className="relative min-h-screen overflow-hidden">
            {/* === PARALLAX BACKGROUND LAYERS === */}
            
            {/* Layer 1: Base Gradient (slowest) */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#009de0] to-[#0077b6]"
                style={{ y: springY1 }}
            />
            
            {/* Layer 2: Animated Mesh Gradient */}
            <motion.div 
                className="absolute inset-0"
                style={{ y: springY2, opacity }}
            >
                {/* Floating Orbs */}
                <div className="absolute top-20 left-[10%] w-[600px] h-[600px] bg-gradient-radial from-cyan-400/30 to-transparent rounded-full blur-3xl animate-parallax-float" />
                <div className="absolute top-40 right-[5%] w-[400px] h-[400px] bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '-5s' }} />
                <div className="absolute bottom-20 left-[20%] w-[500px] h-[500px] bg-gradient-radial from-sky-300/25 to-transparent rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '-10s' }} />
            </motion.div>

            {/* Layer 3: Noise texture overlay */}
            <div className="absolute inset-0 noise-overlay opacity-50" />
            
            {/* Layer 4: Radial spotlight */}
            <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-radial from-white/15 via-white/5 to-transparent rounded-full blur-2xl"
                style={{ y: springY3 }}
            />

            {/* Decorative floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute top-32 left-[15%] w-3 h-3 bg-white/40 rounded-full"
                    animate={{ 
                        y: [0, -20, 0],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute top-48 right-[20%] w-2 h-2 bg-cyan-300/50 rounded-full"
                    animate={{ 
                        y: [0, -15, 0],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div 
                    className="absolute top-72 left-[30%] w-4 h-4 bg-white/30 rounded-full blur-sm"
                    animate={{ 
                        y: [0, -25, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            {/* === MAIN CONTENT === */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-20">
                
                {/* Trust Badges - Top */}
                <motion.div 
                    className="flex justify-center gap-4 md:gap-8 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {[
                        { icon: Shield, label: t.trust1 },
                        { icon: Clock, label: t.trust2 },
                        { icon: Award, label: t.trust3 },
                    ].map((item, i) => (
                        <div 
                            key={i}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                        >
                            <item.icon className="w-4 h-4 text-cyan-300" />
                            <span className="text-xs font-semibold text-white/90 hidden sm:block">{item.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Main Headline - Staggered Word Reveal */}
                <motion.div 
                    className="text-center mb-16 md:mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4 perspective-[1000px]">
                        <motion.span 
                            className="block"
                            variants={wordVariants}
                        >
                            {t.headline}
                        </motion.span>
                        <motion.span 
                            className="block"
                            variants={wordVariants}
                        >
                            {t.headline2}
                        </motion.span>
                        <motion.span 
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shimmer-luxury"
                            variants={wordVariants}
                        >
                            {t.subheadline}
                        </motion.span>
                    </h1>
                    
                    <motion.p 
                        className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mt-8 leading-relaxed"
                        variants={fadeUpVariants}
                    >
                        {t.description}
                    </motion.p>

                    {/* Wolt-style Chat Input - Glass Luxury */}
                    <motion.div variants={fadeUpVariants}>
                        <Link
                            href="#chat"
                            className="group relative flex items-center gap-4 w-full max-w-xl mx-auto mt-10 px-6 py-4 overflow-hidden"
                        >
                            {/* Animated border gradient */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient opacity-80" />
                            
                            {/* Inner content */}
                            <div className="relative flex items-center gap-4 w-full px-6 py-4 bg-white rounded-[14px] shadow-2xl shadow-black/10 group-hover:shadow-cyan-500/20 transition-all duration-500">
                                <MessageCircle className="w-6 h-6 text-[#009de0]/50 group-hover:text-[#009de0] transition-colors duration-300" />
                                <span className="flex-1 text-[#009de0]/50 text-lg text-start group-hover:text-[#009de0]/70 transition-colors duration-300">
                                    {t.chat}
                                </span>
                                <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#009de0] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-cyan-500/30">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* For Masters Block - Glass Luxury Card */}
                <motion.div 
                    className="relative group"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Glow effect behind card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative p-8 md:p-12 glass-luxury-glow rounded-3xl text-center border border-white/20 group-hover:border-white/30 transition-colors duration-500">
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.3em] mb-4">
                                {t.forMasters}
                            </h3>
                            <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-8">
                                {t.forMastersDesc}
                            </p>
                            <a
                                href="/join"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#009de0] font-bold rounded-xl hover:bg-white/90 hover:scale-105 hover:shadow-xl hover:shadow-white/20 transition-all duration-300"
                            >
                                {t.forMastersCta}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom gradient fade to next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent" />
        </section>
    );
}
