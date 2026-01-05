'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Search, MessageSquare, CalendarCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HowItWorks() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            title: 'How it works',
            subtitle: 'Find and book professionals in 3 simple steps',
        },
        he: {
            title: 'איך זה עובד',
            subtitle: 'מצא והזמן מקצוענים ב-3 צעדים פשוטים',
        }
    };

    const t = content[lang] || content.en;

    const steps = [
        {
            icon: Search,
            number: '01',
            title: { en: 'Search', he: 'חיפוש' },
            desc: {
                en: 'Describe what you need or browse categories',
                he: 'תארו מה אתם צריכים או חפשו קטגוריות'
            },
            gradient: 'from-blue-500 to-cyan-400',
            bgGlow: 'bg-blue-500/20'
        },
        {
            icon: MessageSquare,
            number: '02',
            title: { en: 'Compare', he: 'השוואה' },
            desc: {
                en: 'Chat with professionals and compare offers',
                he: 'שוחחו עם מקצוענים והשוו הצעות'
            },
            gradient: 'from-violet-500 to-purple-400',
            bgGlow: 'bg-violet-500/20'
        },
        {
            icon: CalendarCheck,
            number: '03',
            title: { en: 'Book', he: 'הזמנה' },
            desc: {
                en: 'Confirm your booking and enjoy your event',
                he: 'אשרו הזמנה ותהנו מהאירוע'
            },
            gradient: 'from-emerald-500 to-teal-400',
            bgGlow: 'bg-emerald-500/20'
        }
    ];

    return (
        <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.span
                        className="inline-block px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {lang === 'he' ? 'פשוט כמו 1-2-3' : 'Easy as 1-2-3'}
                    </motion.span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {t.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-lg">
                        {t.subtitle}
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                className="relative group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                {/* Card */}
                                <div className={cn(
                                    "relative bg-white dark:bg-slate-800/50 rounded-3xl p-8 md:p-10",
                                    "border border-gray-100 dark:border-slate-700/50",
                                    "shadow-lg shadow-gray-200/50 dark:shadow-none",
                                    "transition-all duration-500",
                                    "hover:shadow-xl hover:shadow-gray-200/70 dark:hover:shadow-lg dark:hover:shadow-black/20",
                                    "hover:-translate-y-2"
                                )}>
                                    {/* Glow effect on hover */}
                                    <div className={cn(
                                        "absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                                        step.bgGlow
                                    )} />

                                    {/* Content */}
                                    <div className="relative">
                                        {/* Number + Icon Row */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center",
                                                "bg-gradient-to-br",
                                                step.gradient,
                                                "shadow-lg"
                                            )}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <span className={cn(
                                                "text-5xl font-black bg-gradient-to-br bg-clip-text text-transparent",
                                                step.gradient,
                                                "opacity-20 group-hover:opacity-40 transition-opacity"
                                            )}>
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            {step.title[lang] || step.title.en}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {step.desc[lang] || step.desc.en}
                                        </p>
                                    </div>
                                </div>

                                {/* Connector Arrow (except last) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 z-10">
                                        <ArrowRight className="w-6 h-6 text-gray-300 dark:text-slate-600" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
