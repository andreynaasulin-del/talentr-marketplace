'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsAppButton() {
    const { language } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    const whatsappNumber = '972501234567';
    const message = encodeURIComponent(
        language === 'ru'
            ? 'Привет! Я нашел вас через Talentr.'
            : language === 'he'
                ? 'שלום! מצאתי אתכם דרך Talentr.'
                : 'Hi! I found you through Talentr.'
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    const tooltip = {
        en: 'Chat with us!',
        ru: 'Напишите нам!',
        he: 'צ׳אט איתנו!'
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 whitespace-nowrap"
            >
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {tooltip[language as keyof typeof tooltip]}
                </span>
            </motion.div>

            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-xl shadow-green-500/30 transition-colors"
            >
                <MessageCircle className="w-7 h-7 text-white" />
            </motion.a>

            <span className="absolute inset-0 rounded-full bg-green-500/50 animate-ping" />
        </motion.div>
    );
}
