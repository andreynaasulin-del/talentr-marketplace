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
    const [chatExpanded, setChatExpanded] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'ru' | 'he';

    // Animated words for headline
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

    const placeholders = {
        en: "What kind of event are you planning?",
        ru: "Какое мероприятие вы планируете?",
        he: "איזה אירוע אתם מתכננים?"
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

    // Scroll to bottom of messages without moving the page
    useEffect(() => {
        if (messagesContainerRef.current && chatExpanded) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, chatExpanded]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        // Expand chat on first message
        if (!chatExpanded) {
            setChatExpanded(true);
        }

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
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-blue-700/50 dark:from-slate-800/50 dark:to-slate-900" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-10 md:py-16">
                {/* Headline */}
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

                {/* Compact AI Search Bar */}
                <motion.div
                    className="max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Expanded Chat Area */}
                        <AnimatePresence>
                            {chatExpanded && (
                                <motion.div
                                    ref={messagesContainerRef}
                                    className="max-h-[300px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            className={cn(
                                                "max-w-[85%]",
                                                msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                            )}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {msg.role === 'assistant' ? (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                                        <Bot className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="bg-white dark:bg-slate-800 rounded-xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100 dark:border-slate-700">
                                                        <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">{msg.content}</p>
                                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                                    <button
                                                                        key={i}
                                                                        onClick={() => sendMessage(s)}
                                                                        className="px-2.5 py-1 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium transition-colors"
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-blue-600 text-white rounded-xl rounded-br-sm px-3 py-2 shadow-sm">
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex items-start gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-slate-700">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.span
                                                            key={i}
                                                            className="w-2 h-2 bg-blue-500 rounded-full"
                                                            animate={{ y: [0, -6, 0] }}
                                                            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input Area */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="p-3"
                        >
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all",
                                isFocused
                                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900"
                            )}>
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder={placeholders[lang] || placeholders.en}
                                    className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-base"
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={cn(
                                        "p-2.5 rounded-lg transition-all",
                                        input.trim()
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Quick Prompts - only when not expanded */}
                        <AnimatePresence>
                            {!chatExpanded && (
                                <motion.div
                                    className="px-3 pb-3"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="flex gap-2 flex-wrap justify-center">
                                        {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => {
                                            const IconComponent = prompt.icon;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => sendMessage(prompt.text)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
                                                >
                                                    <IconComponent className="w-3.5 h-3.5 text-blue-500" />
                                                    {prompt.text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 flex-wrap">
                        {[
                            { icon: Shield, text: { en: 'Secure', ru: 'Безопасно', he: 'מאובטח' } },
                            { icon: CheckCircle2, text: { en: 'Verified pros', ru: 'Проверенные профи', he: 'מקצוענים מאומתים' } },
                            { icon: Zap, text: { en: 'Instant reply', ru: 'Мгновенный ответ', he: 'תגובה מיידית' } },
                        ].map((badge, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 text-white/80"
                            >
                                <badge.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{badge.text[lang]}</span>
                            </div>
                        ))}
                    </div>
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
