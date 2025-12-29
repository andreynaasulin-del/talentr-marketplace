'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Search, MessageSquare, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HowItWorks() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'ru' | 'he';

    const content = {
        en: {
            title: 'How it works',
            subtitle: 'Find and book professionals in 3 simple steps',
        },
        ru: {
            title: 'Как это работает',
            subtitle: 'Найдите и забронируйте специалиста за 3 шага',
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
            number: '1',
            title: { en: 'Search', ru: 'Поиск', he: 'חיפוש' },
            desc: {
                en: 'Describe what you need or browse categories',
                ru: 'Опишите, что нужно, или выберите категорию',
                he: 'תארו מה אתם צריכים או חפשו קטגוריות'
            },
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: MessageSquare,
            number: '2',
            title: { en: 'Compare', ru: 'Сравнение', he: 'השוואה' },
            desc: {
                en: 'Chat with professionals and compare offers',
                ru: 'Общайтесь с профессионалами и сравнивайте',
                he: 'שוחחו עם מקצוענים והשוו הצעות'
            },
            color: 'bg-violet-50 text-violet-600'
        },
        {
            icon: CalendarCheck,
            number: '3',
            title: { en: 'Book', ru: 'Бронь', he: 'הזמנה' },
            desc: {
                en: 'Confirm your booking and enjoy your event',
                ru: 'Подтвердите бронь и наслаждайтесь',
                he: 'אשרו הזמנה ותהנו מהאירוע'
            },
            color: 'bg-emerald-50 text-emerald-600'
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {t.title}
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {t.subtitle}
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Number Badge */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                        step.color
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-3xl font-bold text-gray-200">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {step.title[lang] || step.title.en}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {step.desc[lang] || step.desc.en}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
