'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, ArrowRight, MessageCircle, Users, Calendar, Award } from 'lucide-react';
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
            morning: "Good morning! When is your event and what are you celebrating?",
            afternoon: "Hey! Planning something special? When's your event?",
            evening: "Good evening! Tell me about your upcoming event",
            night: "Planning ahead? Tell me about your event"
        },
        ru: {
            morning: "Доброе утро! Когда ваше мероприятие и что празднуете?",
            afternoon: "Привет! Планируете праздник? Расскажите подробнее",
            evening: "Добрый вечер! Расскажите о вашем мероприятии",
            night: "Планируете заранее? Расскажите о мероприятии"
        },
        he: {
            morning: "בוקר טוב! מתי האירוע שלכם ומה חוגגים?",
            afternoon: "היי! מתכננים משהו מיוחד? מתי האירוע?",
            evening: "ערב טוב! ספרו לי על האירוע שלכם",
            night: "מתכננים מראש? ספרו על האירוע"
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

    // Stats for social proof (real-looking but static)
    const stats = {
        en: { pros: '500+', events: '2,000+', cities: '15+' },
        ru: { pros: '500+', events: '2,000+', cities: '15+' },
        he: { pros: '500+', events: '2,000+', cities: '15+' }
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
            {/* Simple clean background - no gradient filters */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

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
                                    className="text-yellow-300"
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

                {/* Stats Bar - Social Proof */}
                <motion.div
                    className="flex justify-center gap-6 md:gap-10 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-white/90">
                            <Users className="w-4 h-4" />
                            <span className="text-xl md:text-2xl font-bold">{stats[lang].pros}</span>
                        </div>
                        <p className="text-xs md:text-sm text-white/70">
                            {lang === 'ru' ? 'специалистов' : lang === 'he' ? 'מקצוענים' : 'professionals'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-white/90">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xl md:text-2xl font-bold">{stats[lang].events}</span>
                        </div>
                        <p className="text-xs md:text-sm text-white/70">
                            {lang === 'ru' ? 'мероприятий' : lang === 'he' ? 'אירועים' : 'events'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-white/90">
                            <Award className="w-4 h-4" />
                            <span className="text-xl md:text-2xl font-bold">{stats[lang].cities}</span>
                        </div>
                        <p className="text-xs md:text-sm text-white/70">
                            {lang === 'ru' ? 'городов' : lang === 'he' ? 'ערים' : 'cities'}
                        </p>
                    </div>
                </motion.div>

                {/* Chat Container - Clean & Modern */}
                <motion.div
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Chat Header - Simple */}
                    <div className="bg-blue-600 dark:bg-blue-700 px-4 py-3 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">
                                    {lang === 'ru' ? 'AI Помощник' : lang === 'he' ? 'עוזר AI' : 'AI Assistant'}
                                </h3>
                                <p className="text-sm text-white/80 flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    {lang === 'ru' ? 'Онлайн' : lang === 'he' ? 'מחובר' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[220px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[85%]",
                                        msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                    )}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    layout
                                >
                                    <div className={cn(
                                        "rounded-2xl px-4 py-3 text-base",
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-md'
                                            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm rounded-bl-md'
                                    )}>
                                        {msg.content}
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => sendMessage(s)}
                                                        className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium transition-colors"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm w-fit">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    <AnimatePresence>
                        {messages.length <= 1 && (
                            <motion.div
                                className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {lang === 'ru' ? 'Популярные запросы:' : lang === 'he' ? 'חיפושים פופולריים:' : 'Popular searches:'}
                                </p>
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                    {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(prompt)}
                                            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors flex-shrink-0"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-colors",
                            isFocused
                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900"
                        )}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang] || placeholders.en}
                                className="flex-1 py-1.5 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-base"
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-2.5 rounded-xl transition-colors",
                                    input.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 dark:bg-slate-600 text-gray-400'
                                )}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
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
