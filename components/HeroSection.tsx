'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, ArrowRight, Shield, CheckCircle2, Zap, Bot, Camera, Music, Mic } from 'lucide-react';
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
            { text: "Wedding photographer", icon: Camera },
            { text: "DJ for party", icon: Music },
            { text: "Event MC", icon: Mic },
        ],
        ru: [
            { text: "Фотограф на свадьбу", icon: Camera },
            { text: "DJ на праздник", icon: Music },
            { text: "Ведущий мероприятия", icon: Mic },
        ],
        he: [
            { text: "צלם לחתונה", icon: Camera },
            { text: "DJ למסיבה", icon: Music },
            { text: "מנחה לאירוע", icon: Mic },
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

                {/* Premium AI Chat */}
                <motion.div
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
                >
                    {/* Floating Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-[40px] blur-2xl opacity-60 animate-pulse" />

                    {/* Main Chat Card */}
                    <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/50 dark:border-slate-600/50">
                        {/* Header */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

                            <div className="relative px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Animated Avatar */}
                                        <motion.div
                                            className="relative"
                                            animate={{
                                                boxShadow: ['0 0 20px rgba(99,102,241,0.5)', '0 0 40px rgba(99,102,241,0.8)', '0 0 20px rgba(99,102,241,0.5)']
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                <Bot className="w-7 h-7 text-white" />
                                            </div>
                                            <motion.span
                                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white flex items-center gap-2">
                                                {lang === 'ru' ? 'ИИ-Ассистент' : lang === 'he' ? 'עוזר AI' : 'AI Assistant'}
                                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                                                    {lang === 'ru' ? 'Онлайн' : lang === 'he' ? 'מחובר' : 'Online'}
                                                </span>
                                            </h3>
                                            <p className="text-sm text-white/80 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                {lang === 'ru' ? 'Подберу идеального специалиста' : lang === 'he' ? 'אמצא את המקצוען המושלם' : 'Find your perfect pro'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                        <Zap className="w-4 h-4 text-yellow-300" />
                                        <span className="text-sm text-white font-semibold">AI</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="h-[180px] overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id}
                                        className={cn(
                                            "max-w-[88%]",
                                            msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                        )}
                                        initial={{ opacity: 0, y: 20, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, y: 0, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 120 }}
                                        layout
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-start gap-3">
                                                <motion.div
                                                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    <Bot className="w-5 h-5 text-white" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <motion.div
                                                        className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg border border-gray-100 dark:border-slate-700"
                                                        whileHover={{ scale: 1.01 }}
                                                    >
                                                        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed">{msg.content}</p>
                                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                                    <motion.button
                                                                        key={i}
                                                                        onClick={() => sendMessage(s)}
                                                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 hover:from-blue-100 hover:to-indigo-100 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-all border border-blue-200 dark:border-slate-600"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        {s}
                                                                    </motion.button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </div>
                                        )}
                                        {msg.role === 'user' && (
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg"
                                                whileHover={{ scale: 1.01 }}
                                            >
                                                <p className="text-[15px]">{msg.content}</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 shadow-lg border border-gray-100 dark:border-slate-700">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <motion.span
                                                    key={i}
                                                    className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions with Icons */}
                        <AnimatePresence>
                            {messages.length <= 1 && (
                                <motion.div
                                    className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 border-t border-gray-100 dark:border-slate-700"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                                        {lang === 'ru' ? 'Популярные запросы' : lang === 'he' ? 'חיפושים פופולריים' : 'Popular searches'}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => {
                                            const IconComponent = prompt.icon;
                                            return (
                                                <motion.button
                                                    key={i}
                                                    onClick={() => sendMessage(prompt.text)}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-600"
                                                    whileHover={{ scale: 1.03, y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    <IconComponent className="w-4 h-4 text-blue-500" />
                                                    {prompt.text}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Premium Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="p-5 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700"
                        >
                            <motion.div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all bg-gray-50 dark:bg-slate-900",
                                    isFocused
                                        ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-white dark:bg-slate-800"
                                        : "border-gray-200 dark:border-slate-600"
                                )}
                                animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
                            >
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
                                <motion.button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        input.trim()
                                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                                    )}
                                    whileHover={input.trim() ? { scale: 1.1, rotate: 5 } : {}}
                                    whileTap={input.trim() ? { scale: 0.9 } : {}}
                                >
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        </form>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        className="flex items-center justify-center gap-4 sm:gap-8 mt-6 flex-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {[
                            { icon: Shield, text: { en: 'Secure', ru: 'Безопасно', he: 'מאובטח' } },
                            { icon: CheckCircle2, text: { en: 'Verified pros', ru: 'Проверенные профи', he: 'מקצוענים מאומתים' } },
                            { icon: Zap, text: { en: 'Instant reply', ru: 'Мгновенный ответ', he: 'תגובה מיידית' } },
                        ].map((badge, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                            >
                                <badge.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{badge.text[lang]}</span>
                            </motion.div>
                        ))}
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
