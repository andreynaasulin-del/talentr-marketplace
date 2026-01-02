'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            headline: 'The Highest Standard of Entertainment.',
            subheadline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered. Your search ends here.',
            chat: 'What are we celebrating? 🎉',
            forMasters: 'For Masters',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
        },
        he: {
            headline: 'הסטנדרט הגבוה ביותר של בידור.',
            subheadline: 'ללא פשרות.',
            description: 'המערכת היחידה בישראל בה מרוכזים מובילי התעשייה המאומתים. החיפוש שלכם נגמר כאן.',
            chat: 'מה חוגגים ומתי? 🎉',
            forMasters: 'לאמנים',
            forMastersDesc: 'התמקדו במה שאתם עושים הכי טוב. אנחנו נדאג שהכישרון שלכם ירוויח את מה שמגיע לו.',
            forMastersCta: 'הגש מועמדות',
        },
    };

    const t = content[lang];

    return (
        <section className="relative min-h-screen bg-[#009de0] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#009de0] to-[#0077b6]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-20">
                {/* Main Headline */}
                <motion.div 
                    className="text-center mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4">
                        {t.headline}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                            {t.subheadline}
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mt-6 leading-relaxed">
                        {t.description}
                    </p>

                    {/* Wolt-style Chat Input */}
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

                {/* For Masters Block */}
                <motion.div 
                    className="p-8 md:p-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
        </section>
    );
}
