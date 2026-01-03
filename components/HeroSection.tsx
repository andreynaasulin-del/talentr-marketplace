'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';
    
    const content = {
        en: {
            staticStart: 'We help you',
            phrases: [
                'find the perfect DJ',
                'book top artists',
                'throw epic parties',
                'create magic moments',
                'make it unforgettable',
            ],
            tagline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered.',
            chat: 'What are we celebrating? 🎉',
            forMasters: 'For Masters',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
        },
        he: {
            staticStart: 'אנחנו עוזרים לך',
            phrases: [
                'למצוא את הדיג׳יי המושלם',
                'להזמין אמנים מובילים',
                'לעשות מסיבה אדירה',
                'ליצור רגעים קסומים',
                'להפוך את זה לבלתי נשכח',
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

    // Typewriter state
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const currentPhrase = t.phrases[phraseIndex];

    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseBeforeDelete = 2000;
    const pauseBeforeNext = 300;

    const tick = useCallback(() => {
        if (!isDeleting) {
            // Typing
            if (displayText.length < currentPhrase.length) {
                setDisplayText(currentPhrase.slice(0, displayText.length + 1));
            } else {
                // Finished typing, wait then start deleting
                setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
            }
        } else {
            // Deleting
            if (displayText.length > 0) {
                setDisplayText(displayText.slice(0, -1));
            } else {
                // Finished deleting, move to next phrase
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % t.phrases.length);
            }
        }
    }, [displayText, isDeleting, currentPhrase, t.phrases.length]);

    useEffect(() => {
        const speed = isDeleting ? deleteSpeed : typeSpeed;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting]);

    // Reset when language changes
    useEffect(() => {
        setDisplayText('');
        setPhraseIndex(0);
        setIsDeleting(false);
    }, [lang]);

    return (
        <section className="relative min-h-screen bg-[#009de0] overflow-hidden">
            {/* Simple gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#009de0] to-[#0077b6]" />
            
            {/* Subtle radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-20">
                
                {/* Main Headline with Typewriter */}
                <div className="text-center mb-16 md:mb-20">
                    
                    {/* Static start + Typewriter */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight mb-6">
                        <span className="block mb-2">{t.staticStart}</span>
                        <span className="block text-white/90 min-h-[1.2em]">
                            {displayText}
                            <span className="inline-block w-[3px] h-[0.9em] bg-white/80 ml-1 animate-pulse" />
                        </span>
                    </h1>

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
