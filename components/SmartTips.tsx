'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, X, ChevronRight, MessageCircle, Calendar, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface SmartTipsProps {
    vendorName: string;
    vendorCategory: string;
    className?: string;
}

interface Tip {
    id: string;
    icon: React.ReactNode;
    title: { en: string; ru: string; he: string };
    description: { en: string; ru: string; he: string };
    action?: { label: { en: string; ru: string; he: string }; onClick?: () => void };
    color: string;
}

export default function SmartTips({ vendorName, vendorCategory, className }: SmartTipsProps) {
    const { language } = useLanguage();
    const [activeTip, setActiveTip] = useState(0);
    const [isDismissed, setIsDismissed] = useState(false);

    const tips: Tip[] = [
        {
            id: 'best-time',
            icon: <Calendar className="w-5 h-5" />,
            title: {
                en: '🎯 Pro Tip: Best booking time',
                ru: '🎯 Совет: Лучшее время бронирования',
                he: '🎯 טיפ: הזמן הטוב ביותר להזמנה'
            },
            description: {
                en: `Book ${vendorName} 2-3 months in advance for the best rates and availability.`,
                ru: `Забронируйте ${vendorName} за 2-3 месяца для лучших цен и доступности.`,
                he: `הזמן את ${vendorName} 2-3 חודשים מראש לקבלת המחירים והזמינות הטובים ביותר.`
            },
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'whatsapp',
            icon: <MessageCircle className="w-5 h-5" />,
            title: {
                en: '💬 Quick Response',
                ru: '💬 Быстрый ответ',
                he: '💬 תגובה מהירה'
            },
            description: {
                en: 'This vendor typically responds within 1 hour on WhatsApp. Try chatting now!',
                ru: 'Этот специалист обычно отвечает в WhatsApp в течение часа. Напишите сейчас!',
                he: 'הספק הזה בדרך כלל מגיב תוך שעה בווצאפ. נסה לצ\'אט עכשיו!'
            },
            action: {
                label: { en: 'Chat Now', ru: 'Написать', he: 'צ\'אט עכשיו' }
            },
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'rating',
            icon: <Star className="w-5 h-5" />,
            title: {
                en: '⭐ Top Performer',
                ru: '⭐ Топ исполнитель',
                he: '⭐ ביצועים מובילים'
            },
            description: {
                en: `This ${vendorCategory.toLowerCase()} is in the top 10% of rated professionals on Talentr.`,
                ru: `Этот ${vendorCategory.toLowerCase()} входит в топ-10% рейтинговых специалистов на Talentr.`,
                he: `${vendorCategory} זה נמצא ב-10% המובילים של אנשי המקצוע המדורגים ב-Talentr.`
            },
            color: 'from-amber-500 to-orange-500'
        },
    ];

    // Auto-rotate tips
    useEffect(() => {
        if (isDismissed) return;

        const interval = setInterval(() => {
            setActiveTip((prev) => (prev + 1) % tips.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [isDismissed, tips.length]);

    if (isDismissed) return null;

    const currentTip = tips[activeTip];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg",
                    className
                )}
            >
                {/* Gradient Background */}
                <div className={cn(
                    "absolute inset-0 opacity-5 bg-gradient-to-br",
                    currentTip.color
                )} />

                {/* Content */}
                <div className="relative p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className={cn(
                                    "p-2 rounded-xl text-white bg-gradient-to-br",
                                    currentTip.color
                                )}
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {currentTip.icon}
                            </motion.div>
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">AI Insight</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Tip Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTip.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h4 className="font-bold text-gray-900 mb-1">
                                {currentTip.title[language as keyof typeof currentTip.title]}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {currentTip.description[language as keyof typeof currentTip.description]}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Action Button */}
                    {currentTip.action && (
                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                            {currentTip.action.label[language as keyof typeof currentTip.action.label]}
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    )}

                    {/* Tip Indicators */}
                    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        {tips.map((tip, index) => (
                            <button
                                key={tip.id}
                                onClick={() => setActiveTip(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    index === activeTip
                                        ? "w-6 bg-blue-500"
                                        : "bg-gray-200 hover:bg-gray-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
