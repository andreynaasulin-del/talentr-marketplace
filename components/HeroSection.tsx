'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, ArrowRight, MapPin, MessageCircle, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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

// Animated gradient text component
const AnimatedGradientText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.span
            className={cn("bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent bg-[length:200%_auto]", className)}
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
            {children}
        </motion.span>
    );
};

// Floating particles background
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );
};

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [userCity, setUserCity] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const headlineControls = useAnimation();

    const lang = language as 'en' | 'ru' | 'he';

    // Detect user city via IP geolocation
    useEffect(() => {
        const detectCity = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data.city) {
                    setUserCity(data.city);
                }
            } catch {
                setUserCity('Tel Aviv');
            }
        };
        detectCity();
    }, []);

    // Headline animation
    useEffect(() => {
        headlineControls.start({
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            transition: { duration: 5, repeat: Infinity, ease: 'linear' }
        });
    }, [headlineControls]);

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
            morning: "Good morning! ☀️ Tell me about your upcoming event — when is it and what are you celebrating?",
            afternoon: "Hey there! 👋 Planning something special? Share the details — when's your event?",
            evening: "Good evening! ✨ Dreaming about your perfect event? Tell me what you're planning!",
            night: "Hey night owl! 🌙 Planning ahead? Tell me about your event — I'd love to help!"
        },
        ru: {
            morning: "Доброе утро! ☀️ Расскажите о вашем мероприятии — когда оно и что празднуете?",
            afternoon: "Привет! 👋 Планируете что-то особенное? Расскажите, когда ваше событие?",
            evening: "Добрый вечер! ✨ Мечтаете об идеальном празднике? Поделитесь планами!",
            night: "Привет, полуночник! 🌙 Планируете заранее? Расскажите о мероприятии!"
        },
        he: {
            morning: "בוקר טוב! ☀️ ספרו לי על האירוע שלכם — מתי הוא ומה חוגגים?",
            afternoon: "היי! 👋 מתכננים משהו מיוחד? שתפו פרטים — מתי האירוע?",
            evening: "ערב טוב! ✨ חולמים על אירוע מושלם? ספרו לי מה מתכננים!",
            night: "היי ינשוף לילה! 🌙 מתכננים מראש? ספרו על האירוע!"
        }
    };

    const getGreeting = () => {
        const timeOfDay = getTimeOfDay();
        return timeBasedGreetings[lang]?.[timeOfDay] || timeBasedGreetings.en[timeOfDay];
    };

    const placeholders = {
        en: "Tell me about your celebration...",
        ru: "Расскажите о вашем празднике...",
        he: "ספרו לי על החגיגה שלכם..."
    };

    const quickPrompts = {
        en: [
            { text: "Wedding in summer 💒", icon: "💒" },
            { text: "Birthday party 🎂", icon: "🎂" },
            { text: "Corporate event 🎯", icon: "🎯" },
        ],
        ru: [
            { text: "Свадьба летом 💒", icon: "💒" },
            { text: "День рождения 🎂", icon: "🎂" },
            { text: "Корпоратив 🎯", icon: "🎯" },
        ],
        he: [
            { text: "חתונה בקיץ 💒", icon: "💒" },
            { text: "יום הולדת 🎂", icon: "🎂" },
            { text: "אירוע עסקי 🎯", icon: "🎯" },
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
                content: lang === 'ru' ? 'Извините, произошла ошибка. Попробуйте ещё раз!' : lang === 'he' ? 'סליחה, קרתה שגיאה. נסו שוב!' : 'Sorry, something went wrong. Try again!',
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
                    className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 group"
                >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                        <Image
                            src={vendor.imageUrl || '/placeholder-vendor.jpg'}
                            alt={vendor.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                            {vendor.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {vendor.rating} · {vendor.city}
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
        </div>
    );

    // Animated words for headline
    const headlineWords = {
        en: ['perfect', 'ideal', 'amazing', 'best'],
        ru: ['идеального', 'лучшего', 'отличного', 'классного'],
        he: ['המושלם', 'הטוב ביותר', 'המדהים', 'האידיאלי']
    };

    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % headlineWords[lang].length);
        }, 2500);
        return () => clearInterval(interval);
    }, [lang]);

    return (
        <section className="relative min-h-[85vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
            {/* Animated Background */}
            <FloatingParticles />

            {/* Animated gradient overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 via-transparent to-sky-400/30 dark:from-indigo-950/50 dark:to-slate-900/30"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
                {/* Animated Headline */}
                <motion.div
                    className="text-center mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {lang === 'ru' ? 'Найдите' : lang === 'he' ? 'מצא את' : 'Find the'}
                        </motion.span>
                        <br />
                        <span className="relative inline-block">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordIndex}
                                    className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {headlineWords[lang][wordIndex]}
                                </motion.span>
                            </AnimatePresence>
                            {' '}
                            <motion.span
                                className="text-white/90"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {lang === 'ru' ? 'специалиста' : lang === 'he' ? 'טאלנט' : 'talent'}
                            </motion.span>
                        </span>
                    </h1>
                    <motion.p
                        className="text-base md:text-lg text-white/80 flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        {lang === 'ru'
                            ? 'Расскажите о празднике — AI найдёт лучших'
                            : lang === 'he'
                                ? 'ספרו על האירוע — AI ימצא את הטובים ביותר'
                                : 'Share your vision — AI finds the best match'
                        }
                    </motion.p>
                </motion.div>

                {/* Chat Container - Premium Design */}
                <motion.div
                    className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden max-w-lg mx-auto border border-white/20"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Chat Header - Glassmorphism */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 text-white overflow-hidden">
                        {/* Animated shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        />
                        <div className="relative flex items-center gap-3">
                            <motion.div
                                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                                    {lang === 'ru' ? 'AI Консьерж' : lang === 'he' ? 'קונסיירז\' AI' : 'AI Concierge'}
                                    <motion.span
                                        className="text-xs bg-white/20 px-2 py-0.5 rounded-full"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        ✨ Pro
                                    </motion.span>
                                </h3>
                                <p className="text-xs text-white/80 flex items-center gap-1.5">
                                    <motion.span
                                        className="w-2 h-2 bg-green-400 rounded-full"
                                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    {lang === 'ru' ? 'Готов помочь' : lang === 'he' ? 'מוכן לעזור' : 'Ready to help'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages - Beautiful styling */}
                    <div className="h-[200px] sm:h-[220px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[85%]",
                                        msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                    )}
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    layout
                                >
                                    <motion.div
                                        className={cn(
                                            "rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                                        )}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        {msg.content}
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                    <motion.button
                                                        key={i}
                                                        onClick={() => sendMessage(s)}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-blue-100 hover:to-indigo-100 text-gray-700 rounded-full text-xs font-medium transition-all border border-gray-200"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {s}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm w-fit border border-gray-100"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {lang === 'ru' ? 'печатает...' : lang === 'he' ? 'מקליד...' : 'typing...'}
                                </span>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts - Animated */}
                    <AnimatePresence>
                        {messages.length <= 1 && (
                            <motion.div
                                className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {lang === 'ru' ? 'Быстрый старт:' : lang === 'he' ? 'התחלה מהירה:' : 'Quick start:'}
                                </p>
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                                    {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => sendMessage(prompt.text)}
                                            className="px-4 py-2 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl text-sm font-medium text-gray-700 transition-all flex-shrink-0 border border-gray-200 hover:border-blue-300 shadow-sm"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {prompt.text}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input - Premium styling */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="p-4 border-t border-gray-100 bg-white"
                    >
                        <motion.div
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-2xl border-2 transition-all duration-300",
                                isFocused
                                    ? "border-blue-500 bg-blue-50/30 shadow-lg shadow-blue-500/10"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            )}
                            whileFocus={{ scale: 1.01 }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang] || placeholders.en}
                                className="flex-1 py-2 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                                style={{ fontSize: '16px' }}
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all",
                                    input.trim()
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl'
                                        : 'bg-gray-200 text-gray-400'
                                )}
                                whileHover={input.trim() ? { scale: 1.05 } : {}}
                                whileTap={input.trim() ? { scale: 0.95 } : {}}
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>

                {/* Popular Near You - Hidden for now since no vendors */}
                {/*
                <motion.div
                    className="mt-5 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <button className="...">...</button>
                </motion.div>
                */}
            </div>

            {/* Simple Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
                    <path d="M0 60L1440 60V30C1200 45 960 55 720 50C480 45 240 35 0 40V60Z" className="fill-white dark:fill-slate-900" />
                </svg>
            </div>
        </section>
    );
}
