'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Star, ArrowRight, Bot } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Vendor } from '@/types';
import { GigPackage } from '@/lib/gigs';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    vendors?: Vendor[];
    suggestions?: string[];
    packages?: GigPackage[];
    surprise?: string;
    mood?: string[];
}

interface ChatAPIResponse {
    response: string;
    vendors: Vendor[];
    suggestions?: string[];
    packages?: GigPackage[];
    surprise?: string;
    mood?: string[];
}

// Animated words - micro-entertainment vibe (no weddings/corporate)
const animatedWords = {
    en: ['VIBES', 'LAUGHS', 'CHILL', 'WOW', 'ART'],
    he: ['וייב', 'צחוק', "צ׳יל", 'וואו', 'ארט']
};

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [chatExpanded, setChatExpanded] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'he';
    const words = animatedWords[lang];

    // Rotate words
    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    // Initial greeting message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'greet',
                    role: 'assistant',
                    content: lang === 'he'
                        ? 'היי, אני הקייפ-בוט שלך! מה בא לך להרגיש היום? 😎'
                        : 'Hey, I’m your vibe-bot! What do you want to feel today? 😎',
                }
            ]);
            setChatExpanded(true);
        }
    }, [lang, messages.length]);

    const placeholders = {
        en: "What do you want to feel today? 😎",
        he: "מה בא לכם להרגיש היום? 😎"
    };

    useEffect(() => {
        if (messagesContainerRef.current && chatExpanded) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, chatExpanded]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        if (!chatExpanded) setChatExpanded(true);

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
                packages: data.packages,
                surprise: data.surprise,
                mood: data.mood,
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: lang === 'he' ? 'שגיאה, נסו שוב' : 'Error, try again',
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
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-[#009de0]/10 rounded-xl transition-colors group"
                >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={vendor.imageUrl || '/placeholder-vendor.jpg'} alt={vendor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{vendor.name}</p>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {vendor.rating} · {vendor.city}
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#009de0] transition-all" />
                </Link>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-[#009de0] overflow-hidden">
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
                {/* Wolt-style Headline - NO OVERFLOW ISSUES */}
                <div className="text-center mb-10 md:mb-12">
                    {/* Line 1 - Static */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-2">
                        {lang === 'he' ? 'כישרונות.' : 'TALENT.'}
                    </h1>
                    
                    {/* Line 2 - Animated - FIXED HEIGHT */}
                    <div className="relative" style={{ height: '1em' }}>
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={wordIndex}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight absolute inset-0 flex items-center justify-center"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ 
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                {words[wordIndex]}.
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <AnimatePresence>
                            {chatExpanded && (
                                <motion.div
                                    ref={messagesContainerRef}
                                    className="max-h-[260px] overflow-y-auto p-4 space-y-3 bg-gray-50 border-b border-gray-100"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            className={cn("max-w-[85%]", msg.role === 'user' ? 'ms-auto' : 'me-auto')}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {msg.role === 'assistant' ? (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-[#009de0] flex items-center justify-center flex-shrink-0">
                                                        <Bot className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100">
                                                        <p className="text-gray-800 text-sm">{msg.content}</p>
                                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                                        {msg.suggestions && (
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                                    <button key={i} onClick={() => sendMessage(s)} className="px-2.5 py-1 bg-[#009de0]/10 hover:bg-[#009de0]/20 text-[#009de0] rounded-full text-xs font-medium">
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                            {msg.packages && msg.packages.length > 0 && (
                                                <div className="mt-3 grid grid-cols-1 gap-3">
                                                    {msg.packages.map(pkg => (
                                                        <button
                                                            key={pkg.id}
                                                            onClick={() => sendMessage(pkg.title[lang])}
                                                            className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 p-3 flex gap-3 items-center transition-colors"
                                                        >
                                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                                <Image src={pkg.image} alt={pkg.title[lang]} fill className="object-cover" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                                    <span>{pkg.emoji}</span>
                                                                    <span className="truncate">{pkg.title[lang]}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-600 line-clamp-2">{pkg.subtitle[lang]}</p>
                                                                <div className="text-[11px] text-gray-500 mt-1">
                                                                    {pkg.duration} · {pkg.priceHint}
                                                                </div>
                                                            </div>
                                                            <span className="text-[#009de0] text-sm font-semibold flex-shrink-0">OK</span>
                                                        </button>
                                                    ))}
                                                    {msg.surprise && (
                                                        <div className="text-xs text-gray-600 bg-[#009de0]/5 border border-[#009de0]/10 rounded-lg p-2">
                                                            {msg.surprise}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-[#009de0] text-white rounded-xl rounded-br-sm px-3 py-2">
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex items-start gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-[#009de0] flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.span key={i} className="w-2 h-2 bg-[#009de0] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 space-y-2">
                            {/* Quick emoji CTAs */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                                {['😂', '🎩', '🎸', '🧘‍♂️', '🎁'].map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => sendMessage(emoji)}
                                        className="px-3 py-2 bg-[#009de0]/10 text-[#009de0] rounded-full text-sm font-semibold hover:bg-[#009de0]/20 transition"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all",
                                isFocused ? "border-[#009de0] bg-[#009de0]/5" : "border-gray-200 bg-gray-50"
                            )}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder={placeholders[lang]}
                                    className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-base"
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        input.trim() ? 'bg-[#009de0] text-white active:scale-95' : 'bg-gray-200 text-gray-400'
                                    )}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
                    <path d="M0 50L1440 50V25C1200 35 960 40 720 38C480 36 240 30 0 32V50Z" className="fill-white dark:fill-slate-900" />
                </svg>
            </div>
        </section>
    );
}
