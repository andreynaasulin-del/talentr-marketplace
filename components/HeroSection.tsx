'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, ArrowRight, MapPin } from 'lucide-react';
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
    const [userCity, setUserCity] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
                // Fallback to Tel Aviv for Israel users
                setUserCity('Tel Aviv');
            }
        };
        detectCity();
    }, []);

    // Smart time-based greetings
    const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    };

    const timeBasedGreetings = {
        en: {
            morning: "Hi! 👋 When is your event and what type of professional are you looking for?",
            afternoon: "Hi! 👋 When is your event and what type of professional are you looking for?",
            evening: "Hi! 👋 When is your event and what type of professional are you looking for?",
            night: "Hi! 👋 When is your event and what type of professional are you looking for?"
        },
        ru: {
            morning: "Привет! 👋 Когда ваше мероприятие и какой специалист нужен?",
            afternoon: "Привет! 👋 Когда ваше мероприятие и какой специалист нужен?",
            evening: "Привет! 👋 Когда ваше мероприятие и какой специалист нужен?",
            night: "Привет! 👋 Когда ваше мероприятие и какой специалист нужен?"
        },
        he: {
            morning: "היי! 👋 מתי האירוע שלכם ואיזה איש מקצוע אתם מחפשים?",
            afternoon: "היי! 👋 מתי האירוע שלכם ואיזה איש מקצוע אתם מחפשים?",
            evening: "היי! 👋 מתי האירוע שלכם ואיזה איש מקצוע אתם מחפשים?",
            night: "היי! 👋 מתי האירוע שלכם ואיזה איש מקצוע אתם מחפשים?"
        }
    };

    const getGreeting = () => {
        const timeOfDay = getTimeOfDay();
        return timeBasedGreetings[lang]?.[timeOfDay] || timeBasedGreetings.en[timeOfDay];
    };

    const placeholders = {
        en: "What do you need?",
        ru: "Что вам нужно?",
        he: "מה אתם מחפשים?"
    };

    const quickPrompts = {
        en: [
            { text: "Wedding photographer" },
            { text: "DJ for birthday" },
            { text: "Corporate event MC" },
        ],
        ru: [
            { text: "Фотограф на свадьбу" },
            { text: "DJ на день рождения" },
            { text: "Ведущий корпоратива" },
        ],
        he: [
            { text: "צלם לחתונה" },
            { text: "DJ ליום הולדת" },
            { text: "מנחה לאירוע עסקי" },
        ]
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 'greeting',
                role: 'assistant',
                content: getGreeting(),
            }]);
        }
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
                content: lang === 'ru' ? 'Извините, ошибка.' : lang === 'he' ? 'סליחה, שגיאה.' : 'Sorry, error.',
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
                    className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
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
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[85vh] md:min-h-[88vh] flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
                {/* Headline - Clean & Simple */}
                <motion.div
                    className="text-center mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        {lang === 'ru' ? 'Найдите' : lang === 'he' ? 'מצא את' : 'Find the'}
                        <br />
                        <span className="text-white/90">
                            {lang === 'ru' ? 'идеального специалиста' : lang === 'he' ? 'הטאלנט המושלם' : 'perfect talent'}
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-white/80">
                        {lang === 'ru'
                            ? 'Опишите, что нужно — AI найдёт лучших'
                            : lang === 'he'
                                ? 'תארו מה אתם צריכים — AI ימצא'
                                : 'Describe what you need — AI finds the best'
                        }
                    </p>
                </motion.div>

                {/* Chat Container - Compact */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Chat Header - Compact */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm leading-tight">
                                    {lang === 'ru' ? 'AI Помощник' : lang === 'he' ? 'עוזר AI' : 'AI Assistant'}
                                </h3>
                                <p className="text-[10px] text-white/70 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                    {lang === 'ru' ? 'Онлайн' : lang === 'he' ? 'מחובר' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages - Compact */}
                    <div className="h-[180px] sm:h-[200px] overflow-y-auto p-3 space-y-2 bg-gray-50">
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
                                        "rounded-2xl px-4 py-3 text-sm",
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                            : 'bg-white text-gray-800 shadow-sm'
                                    )}>
                                        {msg.content}
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => sendMessage(s)}
                                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors"
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
                            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm w-fit">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts - Compact */}
                    <AnimatePresence>
                        {messages.length <= 1 && (
                            <motion.div
                                className="px-3 py-2 border-t border-gray-100 bg-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                                    {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(prompt.text)}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex-shrink-0"
                                        >
                                            {prompt.text}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input - Compact */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="p-3 border-t border-gray-100 bg-white"
                    >
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
                            isFocused ? "border-blue-500 bg-blue-50/30" : "border-gray-200 bg-gray-50"
                        )}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang] || placeholders.en}
                                className="flex-1 py-1.5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-1.5 rounded-full transition-colors",
                                    input.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-400'
                                )}
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Popular Near You - Like Wolt */}
                <motion.div
                    className="mt-5 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        href="/vendors"
                        className="group flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900 text-sm font-medium">
                            {lang === 'ru'
                                ? `Популярное рядом${userCity ? ` · ${userCity}` : ''}`
                                : lang === 'he'
                                    ? `פופולרי באזורך${userCity ? ` · ${userCity}` : ''}`
                                    : `Popular around you${userCity ? ` · ${userCity}` : ''}`
                            }
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                </motion.div>
            </div>

            {/* Simple Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
                    <path d="M0 60L1440 60V30C1200 45 960 55 720 50C480 45 240 35 0 40V60Z" fill="white" />
                </svg>
            </div>
        </section>
    );
}
