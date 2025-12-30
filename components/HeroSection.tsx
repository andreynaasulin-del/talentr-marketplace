'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, ArrowRight, Shield, CheckCircle2, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Vendor } from '@/types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    vendors?: Vendor[];
    suggestions?: string[];
}

interface ChatAPIResponse {
    response: string;
    vendors: Vendor[];
    suggestions?: string[];
}

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'ru' | 'he';

    // Animated words for headline - simple fade
    const headlineWords = {
        en: ['perfect', 'ideal', 'right'],
        ru: ['идеального', 'лучшего', 'своего'],
        he: ['המושלם', 'הטוב ביותר', 'המתאים']
    };

    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % headlineWords[lang].length);
        }, 3000);
        return () => clearInterval(interval);
    }, [lang]);

    // Smart warm greetings
    const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    };

    const timeBasedGreetings = {
        en: {
            morning: "Good morning! 🎉 Planning a wedding, birthday, or corporate event? Tell me the date and I'll find the perfect pros for you!",
            afternoon: "Hey there! 🎊 Looking for a photographer, DJ, or maybe a host for your special day? I'll help you find the best match!",
            evening: "Good evening! ✨ Whether it's an intimate dinner or a grand celebration - tell me what you're planning and I'll suggest the perfect talent!",
            night: "Hey night owl! 🌙 Planning something exciting? Share your event details and let me find amazing professionals for you!"
        },
        ru: {
            morning: "Доброе утро! 🎉 Планируете свадьбу, день рождения или корпоратив? Расскажите дату и я найду лучших специалистов!",
            afternoon: "Привет! 🎊 Ищете фотографа, DJ или ведущего? Расскажите о мероприятии — подберу идеальный вариант!",
            evening: "Добрый вечер! ✨ Камерный ужин или грандиозный праздник — расскажите, что планируете, и я найду талантливых профи!",
            night: "Привет, полуночник! 🌙 Планируете что-то крутое? Поделитесь деталями и я подберу классных специалистов!"
        },
        he: {
            morning: "בוקר טוב! 🎉 מתכננים חתונה, יום הולדת או אירוע עסקי? ספרו לי את התאריך ואמצא לכם את המקצוענים הכי טובים!",
            afternoon: "היי! 🎊 מחפשים צלם, DJ או אולי מנחה ליום המיוחד? אני אעזור לכם למצוא את ההתאמה המושלמת!",
            evening: "ערב טוב! ✨ בין אם זה ארוחת ערב אינטימית או חגיגה גדולה - ספרו לי מה אתם מתכננים ואציע לכם כישרונות מעולים!",
            night: "היי ינשוף לילה! 🌙 מתכננים משהו מרגש? שתפו את הפרטים ואני אמצא לכם אנשי מקצוע מדהימים!"
        }
    };

    const getGreeting = () => {
        const timeOfDay = getTimeOfDay();
        return timeBasedGreetings[lang]?.[timeOfDay] || timeBasedGreetings.en[timeOfDay];
    };

    const placeholders = {
        en: "Tell me about your event...",
        ru: "Расскажите о вашем мероприятии...",
        he: "ספרו על האירוע שלכם..."
    };

    const quickPrompts = {
        en: [
            "Wedding photographer",
            "DJ for party",
            "Event MC",
        ],
        ru: [
            "Фотограф на свадьбу",
            "DJ на праздник",
            "Ведущий мероприятия",
        ],
        he: [
            "צלם לחתונה",
            "DJ למסיבה",
            "מנחה לאירוע",
        ]
    };

    // Reset greeting when language changes
    useEffect(() => {
        setMessages([{
            id: 'greeting',
            role: 'assistant',
            content: getGreeting(),
        }]);
    }, [lang]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText, language: lang }),
            });

            if (!response.ok) throw new Error('API error');

            const data: ChatAPIResponse = await response.json();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                vendors: data.vendors,
                suggestions: data.suggestions,
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: lang === 'ru' ? 'Извините, ошибка. Попробуйте ещё раз!' : lang === 'he' ? 'סליחה, שגיאה. נסו שוב!' : 'Sorry, error. Try again!',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderVendorCards = (vendors: Vendor[]) => (
        <div className="mt-3 space-y-2">
            {vendors.slice(0, 2).map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
                >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                            src={vendor.imageUrl || '/placeholder-vendor.jpg'}
                            alt={vendor.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                            {vendor.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {vendor.rating} · {vendor.city}
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-blue-600 dark:bg-slate-900">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-blue-700/50 dark:from-slate-800/50 dark:to-slate-900" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-10 md:py-16">
                {/* Big Clean Headline */}
                <motion.div
                    className="text-center mb-8 md:mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                        {lang === 'ru' ? 'Найдите' : lang === 'he' ? 'מצאו את' : 'Find your'}
                        <br />
                        <span className="relative inline-block">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordIndex}
                                    className="text-sky-400"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {headlineWords[lang][wordIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                        {' '}
                        <span className="text-white">
                            {lang === 'ru' ? 'специалиста' : lang === 'he' ? 'איש המקצוע' : 'pro'}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium">
                        {lang === 'ru'
                            ? 'Фотографы, DJ, ведущие и другие профессионалы для вашего мероприятия'
                            : lang === 'he'
                                ? 'צלמים, DJ, מנחים ועוד אנשי מקצוע לאירוע שלכם'
                                : 'Photographers, DJs, MCs and more for your event'
                        }
                    </p>
                </motion.div>

                {/* Premium Chat Container */}
                <motion.div
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Main Chat Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-white">
                                            {lang === 'ru' ? 'Умный поиск' : lang === 'he' ? 'חיפוש חכם' : 'Smart Search'}
                                        </h3>
                                        <p className="text-sm text-white/80 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {lang === 'ru' ? 'Подберу за 30 секунд' : lang === 'he' ? 'אמצא תוך 30 שניות' : 'Find in 30 seconds'}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <Zap className="w-4 h-4 text-yellow-300" />
                                    <span className="text-sm text-white font-medium">AI</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="h-[200px] overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        className={cn(
                                            "max-w-[90%]",
                                            msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                        )}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        layout
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-md border border-gray-100 dark:border-slate-700">
                                                        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">{msg.content}</p>
                                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                                    <button
                                                                        key={i}
                                                                        onClick={() => sendMessage(s)}
                                                                        className="px-3 py-1.5 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-colors"
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {msg.role === 'user' && (
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
                                                <p className="text-[15px]">{msg.content}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-md border border-gray-100 dark:border-slate-700">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <span
                                                    key={i}
                                                    className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
                                                    style={{ animationDelay: `${i * 150}ms` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <AnimatePresence>
                            {messages.length <= 1 && (
                                <motion.div
                                    className="px-5 py-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wide">
                                        {lang === 'ru' ? 'Быстрый выбор' : lang === 'he' ? 'בחירה מהירה' : 'Quick pick'}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(prompt)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Premium Input Area */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="p-5 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700"
                        >
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all bg-white dark:bg-slate-800 shadow-sm",
                                isFocused
                                    ? "border-blue-500 shadow-lg shadow-blue-500/20"
                                    : "border-gray-200 dark:border-slate-600"
                            )}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder={placeholders[lang] || placeholders.en}
                                    className="flex-1 py-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-base"
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        input.trim()
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105'
                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
                                    )}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Trust Badges Below Chat */}
                    <motion.div
                        className="flex items-center justify-center gap-6 mt-6 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2 text-white/80">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {lang === 'ru' ? 'Безопасно' : lang === 'he' ? 'מאובטח' : 'Secure'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {lang === 'ru' ? 'Проверенные профи' : lang === 'he' ? 'מקצוענים מאומתים' : 'Verified pros'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {lang === 'ru' ? 'Мгновенный ответ' : lang === 'he' ? 'תגובה מיידית' : 'Instant reply'}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
                    <path d="M0 60L1440 60V30C1200 45 960 55 720 50C480 45 240 35 0 40V60Z" className="fill-white dark:fill-slate-900" />
                </svg>
            </div>
        </section>
    );
}
