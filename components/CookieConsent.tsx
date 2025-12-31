'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'talentr_cookie_consent';

export default function CookieConsent() {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    const lang = language as 'en' | 'ru' | 'he';

    const content = {
        en: {
            text: 'We use cookies to improve your experience.',
            privacy: 'Privacy Policy',
            accept: 'Accept',
            decline: 'Decline',
        },
        ru: {
            text: 'Мы используем cookies для улучшения сервиса.',
            privacy: 'Политика конфиденциальности',
            accept: 'Принять',
            decline: 'Отклонить',
        },
        he: {
            text: 'אנחנו משתמשים בעוגיות לשיפור החוויה.',
            privacy: 'מדיניות פרטיות',
            accept: 'אישור',
            decline: 'דחייה',
        },
    };

    const t = content[lang] || content.en;

    useEffect(() => {
        // Check if user already made a choice
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-4 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            {/* Cookie icon */}
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <Cookie className="w-5 h-5 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                    {t.text}{' '}
                                    <Link
                                        href="/privacy"
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                    >
                                        {t.privacy}
                                    </Link>
                                </p>

                                {/* Buttons */}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        onClick={handleAccept}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                                    >
                                        {t.accept}
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors"
                                    >
                                        {t.decline}
                                    </button>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleDecline}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
