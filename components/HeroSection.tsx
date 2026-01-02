'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Star, ArrowRight, Bot, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
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

const animatedWords = {
    en: ['WEDDINGS', 'BIRTHDAYS', 'PARTIES', 'EVENTS', 'DREAMS'],
    he: ['חתונות', 'ימי הולדת', 'מסיבות', 'אירועים', 'חלומות']
};

export default function HeroSection() {
    const { language } = useLanguage();
    const { theme } = useTheme();
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
    const isDark = theme === 'dark';

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    const placeholders = {
        en: "What are you celebrating? ✨",
        he: "מה אתם חוגגים? ✨"
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
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors group",
                        isDark 
                            ? "bg-slate-700/50 hover:bg-slate-700" 
                            : "bg-gray-50 hover:bg-[#009de0]/10"
                    )}
                >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={vendor.imageUrl || '/placeholder-vendor.jpg'} alt={vendor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={cn("font-semibold truncate", isDark ? "text-white" : "text-gray-900")}>{vendor.name}</p>
                        <div className={cn("flex items-center gap-1.5 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {vendor.rating} · {vendor.city}
                        </div>
                    </div>
                    <ArrowRight className={cn("w-5 h-5 transition-all", isDark ? "text-gray-500 group-hover:text-cyan-400" : "text-gray-400 group-hover:text-[#009de0]")} />
                </Link>
            ))}
        </div>
    );

    return (
        <section className={cn(
            "relative min-h-[80vh] flex items-center justify-center overflow-hidden transition-colors duration-300",
            isDark ? "bg-slate-900" : "bg-[#009de0]"
        )}>
            {/* Background glow for dark mode */}
            {isDark && (
                <>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
                </>
            )}

            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
                {/* Headline */}
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-2">
                        {lang === 'he' ? 'כישרונות.' : 'TALENT.'}
                    </h1>
                    
                    <div className="relative" style={{ height: '1.1em' }}>
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={wordIndex}
                                className={cn(
                                    "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight absolute inset-0 flex items-center justify-center",
                                    isDark ? "text-cyan-400" : "text-white"
                                )}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {words[wordIndex]}.
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Chat Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className={cn(
                        "rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300",
                        isDark ? "bg-slate-800/90 backdrop-blur-xl border border-white/10" : "bg-white"
                    )}>
                        <AnimatePresence>
                            {chatExpanded && (
                                <motion.div
                                    ref={messagesContainerRef}
                                    className={cn(
                                        "max-h-[260px] overflow-y-auto p-4 space-y-3 border-b",
                                        isDark ? "bg-slate-800/50 border-white/5" : "bg-gray-50 border-gray-100"
                                    )}
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
                                                    <div className={cn(
                                                        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                                        isDark ? "bg-cyan-500" : "bg-[#009de0]"
                                                    )}>
                                                        <Bot className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className={cn(
                                                        "rounded-xl rounded-tl-sm px-3 py-2 shadow-sm border",
                                                        isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-100"
                                                    )}>
                                                        <p className={cn("text-sm", isDark ? "text-gray-200" : "text-gray-800")}>{msg.content}</p>
                                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                                        {msg.suggestions && (
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                                    <button 
                                                                        key={i} 
                                                                        onClick={() => sendMessage(s)} 
                                                                        className={cn(
                                                                            "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                                                                            isDark 
                                                                                ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400" 
                                                                                : "bg-[#009de0]/10 hover:bg-[#009de0]/20 text-[#009de0]"
                                                                        )}
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={cn(
                                                    "text-white rounded-xl rounded-br-sm px-3 py-2",
                                                    isDark ? "bg-cyan-600" : "bg-[#009de0]"
                                                )}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex items-start gap-2">
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center",
                                                isDark ? "bg-cyan-500" : "bg-[#009de0]"
                                            )}>
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className={cn(
                                                "rounded-xl px-4 py-3 border",
                                                isDark ? "bg-slate-700 border-slate-600" : "bg-white border-gray-100"
                                            )}>
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.span 
                                                            key={i} 
                                                            className={cn("w-2 h-2 rounded-full", isDark ? "bg-cyan-400" : "bg-[#009de0]")} 
                                                            animate={{ y: [0, -5, 0] }} 
                                                            transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity }} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all",
                                isDark 
                                    ? isFocused 
                                        ? "border-cyan-500 bg-slate-700" 
                                        : "border-slate-600 bg-slate-700/50"
                                    : isFocused 
                                        ? "border-[#009de0] bg-[#009de0]/5" 
                                        : "border-gray-200 bg-gray-50"
                            )}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder={placeholders[lang]}
                                    className={cn(
                                        "flex-1 bg-transparent focus:outline-none text-base",
                                        isDark ? "text-white placeholder:text-gray-400" : "text-gray-900 placeholder:text-gray-400"
                                    )}
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        input.trim() 
                                            ? isDark 
                                                ? 'bg-cyan-500 text-white active:scale-95' 
                                                : 'bg-[#009de0] text-white active:scale-95' 
                                            : isDark 
                                                ? 'bg-slate-600 text-slate-400' 
                                                : 'bg-gray-200 text-gray-400'
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
                    <path d="M0 50L1440 50V25C1200 35 960 40 720 38C480 36 240 30 0 32V50Z" className={isDark ? "fill-slate-900" : "fill-white"} />
                </svg>
            </div>
        </section>
    );
}
