'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';
    const [currentIndex, setCurrentIndex] = useState(0);

    const content = {
        en: {
            headlines: [
                { line1: 'The Highest Standard', line2: 'of Entertainment.' },
                { line1: 'Find the Perfect', line2: 'Talent for Your Event.' },
                { line1: 'Book Top Artists', line2: 'in Minutes.' },
                { line1: 'Unforgettable Events', line2: 'Start Here.' },
            ],
            tagline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered.',
            chat: 'What are we celebrating? 🎉',
            forMasters: 'For Masters',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
        },
        he: {
            headlines: [
                { line1: 'הסטנדרט הגבוה ביותר', line2: 'של בידור.' },
                { line1: 'מצא את הכישרון', line2: 'המושלם לאירוע שלך.' },
                { line1: 'הזמן אמנים מובילים', line2: 'בדקות.' },
                { line1: 'אירועים בלתי נשכחים', line2: 'מתחילים כאן.' },
            ],
            tagline: 'ללא פשרות.',
            description: 'המערכת היחידה בישראל בה מרוכזים מובילי התעשייה המאומתים.',
            chat: 'מה חוגגים ומתי? 🎉',
            forMasters: 'לאמנים',
            forMastersDesc: 'התמקדו במה שאתם עושים הכי טוב. אנחנו נדאג שהכישרון שלכם ירוויח את מה שמגיע לו.',
            forMastersCta: 'הגש מועמדות',
        },
    };

    const t = content[lang];

    // Rotate headlines every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % t.headlines.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [t.headlines.length]);

    return (
        <section className="relative min-h-screen bg-[#009de0] overflow-hidden">
            {/* Simple gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#009de0] to-[#0077b6]" />
            
            {/* Subtle radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-20">
                
                {/* Main Headline with Rotation */}
                <div className="text-center mb-16 md:mb-20">
                    
                    {/* Rotating Headlines */}
                    <div className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[260px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentIndex}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span className="block">{t.headlines[currentIndex].line1}</span>
                                <span className="block">{t.headlines[currentIndex].line2}</span>
                            </motion.h1>
                        </AnimatePresence>
                    </div>

                    {/* Static Tagline */}
                    <motion.p 
                        className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-400 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t.tagline}
                    </motion.p>
                    
                    {/* Description */}
                    <motion.p 
                        className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {t.description}
                    </motion.p>

                    {/* Chat Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            href="#chat"
                            className="group flex items-center gap-4 w-full max-w-xl mx-auto mt-10 px-6 py-4 bg-white rounded-2xl shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all cursor-pointer"
                        >
                            <MessageCircle className="w-6 h-6 text-[#009de0]/50 group-hover:text-[#009de0] transition-colors" />
                            <span className="flex-1 text-[#009de0]/50 text-lg text-start">
                                {t.chat}
                            </span>
                            <div className="w-10 h-10 bg-[#009de0] rounded-xl flex items-center justify-center group-hover:bg-[#0077b6] transition-colors">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* For Masters Block */}
                <motion.div 
                    className="p-8 md:p-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-4">
                        {t.forMasters}
                    </h3>
                    <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-6">
                        {t.forMastersDesc}
                    </p>
                    <a
                        href="/join"
                        className="inline-block px-6 py-3 bg-white text-[#009de0] font-bold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        {t.forMastersCta}
                    </a>
                </motion.div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent" />
        </section>
    );
}
