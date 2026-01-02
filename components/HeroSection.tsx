'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            headline: 'The Highest Standard of Entertainment.',
            subheadline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered. Your search ends here.',
            cta: 'Choose Package',
            rules: 'Our Standards',
            rule1Title: 'VERIFIED.',
            rule1Desc: 'ELITE.',
            rule2Title: 'FIXED.',
            rule2Desc: 'FAIR.',
            rule3Title: 'FAST.',
            rule3Desc: 'SIMPLE.',
            forMasters: 'For Masters',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
        },
        he: {
            headline: 'הסטנדרט הגבוה ביותר של בידור.',
            subheadline: 'ללא פשרות.',
            description: 'המערכת היחידה בישראל בה מרוכזים מובילי התעשייה המאומתים. החיפוש שלכם נגמר כאן.',
            cta: 'בחר חבילה',
            rules: 'הסטנדרטים שלנו',
            rule1Title: 'מאומת.',
            rule1Desc: 'עילית.',
            rule2Title: 'קבוע.',
            rule2Desc: 'הוגן.',
            rule3Title: 'מהיר.',
            rule3Desc: 'פשוט.',
            forMasters: 'לאמנים',
            forMastersDesc: 'התמקדו במה שאתם עושים הכי טוב. אנחנו נדאג שהכישרון שלכם ירוויח את מה שמגיע לו.',
            forMastersCta: 'הגש מועמדות',
        },
    };

    const t = content[lang];

    return (
        <section className="relative min-h-screen bg-slate-950 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-slate-800/30 to-transparent rounded-full blur-3xl" />
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

                    <a
                        href="#packages"
                        className="inline-block mt-10 px-8 py-4 bg-white text-slate-950 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors shadow-2xl shadow-white/10"
                    >
                        {t.cta}
                    </a>
                </motion.div>

                {/* Our Standards - Wolt Style */}
                <motion.div 
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                        {/* Rule 1 */}
                        <div className="p-8 md:p-10 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl text-center">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{t.rule1Title}</h3>
                            <p className="text-2xl md:text-3xl font-black text-amber-400">{t.rule1Desc}</p>
                        </div>

                        {/* Rule 2 */}
                        <div className="p-8 md:p-10 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-3xl text-center">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{t.rule2Title}</h3>
                            <p className="text-2xl md:text-3xl font-black text-emerald-400">{t.rule2Desc}</p>
                        </div>

                        {/* Rule 3 */}
                        <div className="p-8 md:p-10 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-3xl text-center">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{t.rule3Title}</h3>
                            <p className="text-2xl md:text-3xl font-black text-blue-400">{t.rule3Desc}</p>
                        </div>
                    </div>
                </motion.div>

                {/* For Masters Block */}
                <motion.div 
                    className="p-8 md:p-12 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">
                        {t.forMasters}
                    </h3>
                    <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-6">
                        {t.forMastersDesc}
                    </p>
                    <a
                        href="/join"
                        className="inline-block px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
                    >
                        {t.forMastersCta}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
