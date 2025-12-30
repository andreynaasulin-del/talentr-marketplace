'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Heart, Briefcase, PartyPopper, Camera, Music } from 'lucide-react';
import Link from 'next/link';

export default function UseCaseCards() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'ru' | 'he';

    const useCases = {
        en: [
            {
                icon: Heart,
                gradient: 'from-pink-500 to-rose-600',
                title: 'Romantic Dinner',
                description: 'Personal chef just for you two to heat up the romance',
                cta: 'Find Chef',
                search: 'Personal chef for romantic dinner'
            },
            {
                icon: PartyPopper,
                gradient: 'from-purple-500 to-indigo-600',
                title: 'Epic Birthday',
                description: 'DJ to make your birthday party unforgettable',
                cta: 'Find DJ',
                search: 'DJ for epic birthday party'
            },
            {
                icon: Camera,
                gradient: 'from-blue-500 to-cyan-600',
                title: 'Dream Wedding',
                description: 'Professional photographer to capture every moment',
                cta: 'Find Photographer',
                search: 'Wedding photographer'
            },
            {
                icon: Briefcase,
                gradient: 'from-emerald-500 to-teal-600',
                title: 'Corporate Event',
                description: 'Expert MC to make your event professional',
                cta: 'Find MC',
                search: 'Corporate event MC'
            },
            {
                icon: Music,
                gradient: 'from-orange-500 to-amber-600',
                title: 'Live Music',
                description: 'Talented musician for intimate atmosphere',
                cta: 'Find Musician',
                search: 'Live musician'
            },
            {
                icon: Sparkles,
                gradient: 'from-fuchsia-500 to-pink-600',
                title: 'Surprise Party',
                description: 'Everything you need for perfect celebration',
                cta: 'Plan Event',
                search: 'Surprise party planner'
            }
        ],
        ru: [
            {
                icon: Heart,
                gradient: 'from-pink-500 to-rose-600',
                title: 'Романтический ужин',
                description: 'Личный шеф-повар только для вас двоих, чтобы разжечь романтику',
                cta: 'Найти шефа',
                search: 'Личный шеф-повар для романтического ужина'
            },
            {
                icon: PartyPopper,
                gradient: 'from-purple-500 to-indigo-600',
                title: 'Крутой день рождения',
                description: 'DJ, который сделает ваш праздник незабываемым',
                cta: 'Найти DJ',
                search: 'DJ на крутой день рождения'
            },
            {
                icon: Camera,
                gradient: 'from-blue-500 to-cyan-600',
                title: 'Свадьба мечты',
                description: 'Профессиональный фотограф запечатлеет каждый момент',
                cta: 'Найти фотографа',
                search: 'Фотограф на свадьбу'
            },
            {
                icon: Briefcase,
                gradient: 'from-emerald-500 to-teal-600',
                title: 'Корпоратив',
                description: 'Опытный ведущий сделает ваше мероприятие профессиональным',
                cta: 'Найти ведущего',
                search: 'Ведущий корпоратива'
            },
            {
                icon: Music,
                gradient: 'from-orange-500 to-amber-600',
                title: 'Живая музыка',
                description: 'Талантливый музыкант для интимной атмосферы',
                cta: 'Найти музыканта',
                search: 'Живой музыкант'
            },
            {
                icon: Sparkles,
                gradient: 'from-fuchsia-500 to-pink-600',
                title: 'Вечеринка-сюрприз',
                description: 'Всё необходимое для идеального праздника',
                cta: 'Спланировать',
                search: 'Организатор вечеринки-сюрприза'
            }
        ],
        he: [
            {
                icon: Heart,
                gradient: 'from-pink-500 to-rose-600',
                title: 'ארוחה רומנטית',
                description: 'שף אישי רק עבורכם שניים כדי להצית את הרומנטיקה',
                cta: 'מצא שף',
                search: 'שף אישי לארוחה רומנטית'
            },
            {
                icon: PartyPopper,
                gradient: 'from-purple-500 to-indigo-600',
                title: 'יום הולדת מטורף',
                description: 'DJ שיהפוך את המסיבה שלך לבלתי נשכחת',
                cta: 'מצא DJ',
                search: 'DJ ליום הולדת מטורף'
            },
            {
                icon: Camera,
                gradient: 'from-blue-500 to-cyan-600',
                title: 'חתונת חלומות',
                description: 'צלם מקצועי שיתפוס כל רגע',
                cta: 'מצא צלם',
                search: 'צלם לחתונה'
            },
            {
                icon: Briefcase,
                gradient: 'from-emerald-500 to-teal-600',
                title: 'אירוע עסקי',
                description: 'מנחה מומחה שיהפוך את האירוע שלך למקצועי',
                cta: 'מצא מנחה',
                search: 'מנחה לאירוע עסקי'
            },
            {
                icon: Music,
                gradient: 'from-orange-500 to-amber-600',
                title: 'מוזיקה חיה',
                description: 'מוזיקאי מוכשר לאווירה אינטימית',
                cta: 'מצא מוזיקאי',
                search: 'מוזיקאי חי'
            },
            {
                icon: Sparkles,
                gradient: 'from-fuchsia-500 to-pink-600',
                title: 'מסיבת הפתעה',
                description: 'כל מה שצריך לחגיגה מושלמת',
                cta: 'תכנן אירוע',
                search: 'מתכנן מסיבת הפתעה'
            }
        ]
    };

    const currentUseCases = useCases[lang] || useCases.en;

    return (
        <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {lang === 'ru'
                            ? 'Популярные сценарии'
                            : lang === 'he'
                                ? 'תרחישים פופולריים'
                                : 'Popular Use Cases'
                        }
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        {lang === 'ru'
                            ? 'Вдохновитесь идеями для вашего события'
                            : lang === 'he'
                                ? 'קבל השראה לאירוע שלך'
                                : 'Get inspired for your next event'
                        }
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {currentUseCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/?search=${encodeURIComponent(useCase.search)}`}
                                    className="group block h-full"
                                >
                                    <div className="relative h-full bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden">
                                        {/* Gradient Background on Hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                        {/* Icon */}
                                        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="relative">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-br group-hover:bg-clip-text" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}>
                                                {useCase.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                {useCase.description}
                                            </p>

                                            {/* CTA */}
                                            <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${useCase.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}>
                                                {useCase.cta}
                                                <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-700 transform -skew-x-12" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
