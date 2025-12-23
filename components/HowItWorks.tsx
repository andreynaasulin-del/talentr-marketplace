'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Search, MessageSquare, CalendarCheck, ShieldCheck } from 'lucide-react';

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
            bg: 'bg-blue-50'
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
            bg: 'bg-purple-50'
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
            bg: 'bg-green-50'
        }
    ];

    return (
        <section className="py-24 bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 mb-6 font-black text-xs uppercase tracking-widest text-blue-600">
                        <ShieldCheck className="w-4 h-4" />
                        {language === 'ru' ? 'Как это работает' : language === 'he' ? 'איך זה עובד' : 'How it works'}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        {language === 'ru' ? 'Спланируйте событие за минуты' : language === 'he' ? 'תכנן את האירוע שלך תוך דקות' : 'Plan your event in minutes'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            <div className="flex flex-col items-center text-center p-8 bg-white rounded-[32px] shadow-sm hover:shadow-premium transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                                <div className={`w-20 h-20 ${step.bg} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <step.icon className={`w-10 h-10 ${step.color}`} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                                    {step.title[language] || step.title.en}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {step.desc[language] || step.desc.en}
                                </p>
                            </div>

                            {index < 2 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-200" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
