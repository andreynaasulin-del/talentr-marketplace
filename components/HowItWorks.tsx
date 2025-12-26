'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Search, MessageSquare, CalendarCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
} as const;

export default function HowItWorks() {
    const { language } = useLanguage();

    const steps = [
        {
            icon: Search,
            title: { en: 'Find your talent', ru: 'Найдите талант', he: 'מצא את הטאלנט שלך' },
            desc: {
                en: 'Use our AI to find the perfect professional for your vision.',
                ru: 'Используйте наш ИИ, чтобы найти идеального специалиста.',
                he: 'השתמש ב-AI שלנו כדי למצוא את איש המקצוע המושלם.'
            },
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/30'
        },
        {
            icon: MessageSquare,
            title: { en: 'Chat instantly', ru: 'Мгновенный чат', he: 'צ׳אט מיידי' },
            desc: {
                en: 'Discuss details, get quotes and share ideas in real-time.',
                ru: 'Обсуждайте детали и делитесь идеями в реальном времени.',
                he: 'דון בפרטים, קבל הצעות מחיר ושתף רעיונות בזמן אמת.'
            },
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/30'
        },
        {
            icon: CalendarCheck,
            title: { en: 'Book with ease', ru: 'Бронируйте легко', he: 'הזמן בקלות' },
            desc: {
                en: 'Secure your date with a simple and safe booking process.',
                ru: 'Забронируйте дату с помощью простого и безопасного процесса.',
                he: 'שריין את התאריך שלך בתהליך הזמנה פשוט ובטוח.'
            },
            color: 'text-green-600',
            bg: 'bg-green-50 dark:bg-green-900/30'
        }
    ];

    return (
        <section className="py-24 bg-gray-50/30 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm mb-6",
                            "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700",
                            "font-black text-xs uppercase tracking-widest text-blue-600"
                        )}
                        whileHover={{ scale: 1.05 }}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        {language === 'ru' ? 'Как это работает' : language === 'he' ? 'איך זה עובד' : 'How it works'}
                    </motion.div>
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        {language === 'ru' ? 'Спланируйте событие за минуты' : language === 'he' ? 'תכנן את האירוע שלך תוך דקות' : 'Plan your event in minutes'}
                    </motion.h2>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative group"
                            variants={itemVariants}
                        >
                            <motion.div
                                className={cn(
                                    "flex flex-col items-center text-center p-8 rounded-[32px] transition-all duration-500",
                                    "bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700"
                                )}
                                whileHover={{
                                    y: -8,
                                    boxShadow: "0 25px 50px rgba(0,0,0,0.12)"
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center mb-8",
                                        step.bg
                                    )}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <step.icon className={cn("w-10 h-10", step.color)} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                                    {step.title[language] || step.title.en}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    {step.desc[language] || step.desc.en}
                                </p>
                            </motion.div>

                            {index < 2 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-200 dark:bg-slate-700" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
