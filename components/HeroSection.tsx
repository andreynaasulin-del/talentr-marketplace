'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HeroSection() {
    const { language } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    // Scroll to AI Chat or open it
    const handleStartChat = () => {
        // Dispatch custom event to open AI chat
        window.dispatchEvent(new CustomEvent('openAIChat'));
    };

    const headlines = {
        en: 'Find the perfect talent.',
        ru: 'Найдите идеального специалиста.',
        he: 'מצא את הטאלנט המושלם.'
    };

    const subtitles = {
        en: 'Photographers, DJs, singers & more for your event.',
        ru: 'Фотографы, диджеи, вокалисты и другие для вашего события.',
        he: 'צלמים, דיגייז, זמרים ועוד לאירוע שלך.'
    };

    const ctaText = {
        en: 'Start with AI Assistant',
        ru: 'Начать с AI-ассистентом',
        he: 'התחל עם עוזר AI'
    };

    return (
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 via-sky-500 to-blue-500">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Headline */}
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]"
                        dir={language === 'he' ? 'rtl' : 'ltr'}
                    >
                        {headlines[language] || headlines.en}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-medium"
                        dir={language === 'he' ? 'rtl' : 'ltr'}
                    >
                        {subtitles[language] || subtitles.en}
                    </p>

                    {/* CTA Button - AI Chat Focus */}
                    <motion.button
                        onClick={handleStartChat}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={cn(
                            "inline-flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg",
                            "bg-white text-gray-900 shadow-2xl shadow-black/20",
                            "hover:shadow-3xl hover:scale-[1.02] transition-all duration-300"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <Sparkles className="w-6 h-6 text-blue-500" />
                        </motion.div>
                        <span>{ctaText[language] || ctaText.en}</span>
                        <ArrowRight className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            isHovered ? "translate-x-1" : ""
                        )} />
                    </motion.button>

                    {/* Trust Badge */}
                    <motion.p
                        className="mt-8 text-white/70 text-sm font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {language === 'ru'
                            ? '500+ проверенных специалистов • Бесплатно для клиентов'
                            : language === 'he'
                                ? '500+ בעלי מקצוע מאומתים • חינם ללקוחות'
                                : '500+ verified professionals • Free for clients'
                        }
                    </motion.p>
                </motion.div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}
