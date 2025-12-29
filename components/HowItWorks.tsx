'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Search, MessageSquare, CalendarCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Floating decorative element
const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <motion.div
        className={cn("absolute", className)}
        animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
        }}
        transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    />
);

// Connection line between steps
const ConnectionLine = ({ isActive }: { isActive: boolean }) => (
    <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-[2px]">
        <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: isActive ? 1 : 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ transformOrigin: 'left' }}
        />
        <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500"
            initial={{ scale: 0 }}
            whileInView={{ scale: isActive ? 1 : 0.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
        />
    </div>
);

export default function HowItWorks() {
    const { language } = useLanguage();
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    // Cursor tracking for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { stiffness: 100, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { stiffness: 100, damping: 20 });

    const content = {
        en: {
            badge: 'Simple Process',
            title: 'Plan your event',
            titleHighlight: 'in 3 steps',
            subtitle: 'From idea to celebration - we make event planning effortless.',
            cta: 'Start Planning Now',
        },
        ru: {
            badge: 'Простой процесс',
            title: 'Спланируйте событие',
            titleHighlight: 'за 3 шага',
            subtitle: 'От идеи до праздника — мы делаем планирование простым.',
            cta: 'Начать планирование',
        },
        he: {
            badge: 'תהליך פשוט',
            title: 'תכננו אירוע',
            titleHighlight: 'ב-3 צעדים',
            subtitle: 'מרעיון לחגיגה - אנחנו הופכים תכנון אירועים לקל.',
            cta: 'התחל לתכנן עכשיו',
        }
    };

    const t = content[language as keyof typeof content] || content.en;

    const steps = [
        {
            icon: Search,
            number: '01',
            title: { en: 'Find your talent', ru: 'Найдите талант', he: 'מצא את הטאלנט' },
            desc: {
                en: 'Use our AI to find the perfect professional for your vision.',
                ru: 'Используйте наш ИИ, чтобы найти идеального специалиста.',
                he: 'השתמש ב-AI שלנו כדי למצוא את איש המקצוע המושלם.'
            },
            features: {
                en: ['AI-powered search', 'Smart filters', 'Verified profiles'],
                ru: ['AI-поиск', 'Умные фильтры', 'Проверенные профили'],
                he: ['חיפוש AI', 'פילטרים חכמים', 'פרופילים מאומתים']
            },
            gradient: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: MessageSquare,
            number: '02',
            title: { en: 'Chat & Compare', ru: 'Общайтесь', he: 'צ׳אט והשווה' },
            desc: {
                en: 'Discuss details, get quotes and share ideas in real-time.',
                ru: 'Обсуждайте детали и делитесь идеями в реальном времени.',
                he: 'דון בפרטים, קבל הצעות מחיר ושתף רעיונות.'
            },
            features: {
                en: ['Instant messaging', 'Price comparison', 'Portfolio review'],
                ru: ['Мгновенные сообщения', 'Сравнение цен', 'Просмотр портфолио'],
                he: ['הודעות מיידיות', 'השוואת מחירים', 'סקירת תיק עבודות']
            },
            gradient: 'from-violet-500 to-purple-500',
            bgLight: 'bg-violet-50',
            iconColor: 'text-violet-600'
        },
        {
            icon: CalendarCheck,
            number: '03',
            title: { en: 'Book & Celebrate', ru: 'Бронируйте', he: 'הזמן וחגוג' },
            desc: {
                en: 'Secure your date with a simple and safe booking process.',
                ru: 'Забронируйте дату с помощью простого и безопасного процесса.',
                he: 'שריין את התאריך בתהליך הזמנה פשוט ובטוח.'
            },
            features: {
                en: ['Secure payment', 'Date guarantee', '24/7 support'],
                ru: ['Безопасная оплата', 'Гарантия даты', 'Поддержка 24/7'],
                he: ['תשלום מאובטח', 'ערבות לתאריך', 'תמיכה 24/7']
            },
            gradient: 'from-emerald-500 to-green-500',
            bgLight: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
        }
    ];

    return (
        <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Decorative floating shapes */}
            <FloatingShape
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-xl top-20 left-[10%]"
                delay={0}
            />
            <FloatingShape
                className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl top-40 right-[15%]"
                delay={2}
            />
            <FloatingShape
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 blur-xl bottom-40 left-[20%]"
                delay={4}
            />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-10 md:mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Badge */}
                    <motion.div
                        className={cn(
                            "inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full mb-5 md:mb-8",
                            "bg-gradient-to-r from-indigo-50 to-purple-50",
                            "border border-indigo-100/50 shadow-sm"
                        )}
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
                        <span className="font-bold text-xs md:text-sm uppercase tracking-wider text-indigo-700">
                            {t.badge}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3 md:mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                    >
                        <span className="text-gray-900">{t.title} </span>
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {t.titleHighlight}
                        </span>
                    </motion.h2>

                    <motion.p
                        className="text-sm md:text-lg lg:text-xl text-gray-500 font-medium max-w-2xl mx-auto px-4 md:px-0"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        {t.subtitle}
                    </motion.p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-6 mb-10 md:mb-16">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isHovered = hoveredStep === index;
                        const features = step.features[language as keyof typeof step.features] || step.features.en;

                        return (
                            <motion.div
                                key={index}
                                className="relative"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                onHoverStart={() => setHoveredStep(index)}
                                onHoverEnd={() => setHoveredStep(null)}
                            >
                                <motion.div
                                    className={cn(
                                        "relative h-full p-5 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-500",
                                        "bg-white border-2",
                                        isHovered ? "border-transparent shadow-2xl shadow-gray-200/80" : "border-gray-100 shadow-sm"
                                    )}
                                    whileHover={{ y: -8 }}
                                    style={{
                                        perspective: '1000px',
                                    }}
                                >
                                    {/* Gradient border on hover */}
                                    {isHovered && (
                                        <motion.div
                                            className={cn(
                                                "absolute inset-0 rounded-3xl bg-gradient-to-br opacity-50",
                                                step.gradient
                                            )}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.1 }}
                                            style={{ padding: '2px' }}
                                        />
                                    )}

                                    {/* Step Number */}
                                    <motion.div
                                        className={cn(
                                            "absolute -top-3 md:-top-4 -right-1 md:-right-2 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center",
                                            "bg-gradient-to-br shadow-lg",
                                            step.gradient
                                        )}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <span className="text-white font-black text-sm md:text-lg">{step.number}</span>
                                    </motion.div>


                                    {/* Icon */}
                                    <motion.div
                                        className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6",
                                            step.bgLight
                                        )}
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <Icon className={cn("w-6 h-6 md:w-8 md:h-8", step.iconColor)} />
                                    </motion.div>

                                    {/* Content */}
                                    <h3 className="text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight">
                                        {step.title[language as keyof typeof step.title] || step.title.en}
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed mb-4 md:mb-6">
                                        {step.desc[language as keyof typeof step.desc] || step.desc.en}
                                    </p>

                                    {/* Features List */}
                                    <ul className="space-y-2">
                                        {features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-center gap-2 text-sm text-gray-600"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                            >
                                                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", step.iconColor)} />
                                                <span className="font-medium">{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Connection Line */}
                                {index < 2 && <ConnectionLine isActive={isHovered || hoveredStep === index + 1} />}
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <motion.button
                        className={cn(
                            "group relative px-10 py-5 rounded-2xl font-bold text-lg",
                            "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white",
                            "shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30",
                            "transition-all duration-300"
                        )}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="relative flex items-center gap-3">
                            {t.cta}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
