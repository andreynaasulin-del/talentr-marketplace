'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Star, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Vendor } from '@/types';
import { gigPackages, GigPackage } from '@/lib/gigs';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    vendors?: Vendor[];
    packages?: GigPackage[];
    suggestions?: string[];
}

interface ChatAPIResponse {
    response: string;
    vendors: Vendor[];
    packages?: GigPackage[];
    suggestions?: string[];
}

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'he';

    // Placeholders - Premium & Minimal
    const placeholders = {
        en: "What experience are you looking for?",
        he: "איזה חוויה אתם מחפשים?"
    };

    // Welcome message on mount
    useEffect(() => {
        const welcomeMsg: Message = {
            id: 'welcome',
            role: 'assistant',
            content: lang === 'he' 
                ? 'שלום, אני הקונסיירז׳ האישי שלך. ספר לי מה אתה מחפש ואמצא לך את הכישרון המושלם.'
                : 'Hello, I\'m your personal concierge. Tell me what you\'re looking for and I\'ll find the perfect talent for you.',
            packages: gigPackages.slice(0, 3),
        };
        setMessages([welcomeMsg]);
    }, [lang]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
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
                packages: data.packages,
                suggestions: data.suggestions,
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: lang === 'he' ? 'משהו השתבש. נסה שוב.' : 'Something went wrong. Please try again.',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderVendorCards = (vendors: Vendor[]) => (
        <div className="mt-4 space-y-3">
            {vendors.slice(0, 2).map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-300 group"
                >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/20">
                        <Image src={vendor.imageUrl || '/placeholder-vendor.jpg'} alt={vendor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{vendor.name}</p>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{vendor.rating}</span>
                            <span>·</span>
                            <span>{vendor.city}</span>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                </Link>
            ))}
        </div>
    );

    const renderPackages = (packages: GigPackage[]) => (
        <div className="mt-4 grid gap-3">
            {packages.map(pkg => (
                <motion.button
                    key={pkg.id}
                    onClick={() => sendMessage(pkg.title[lang])}
                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-300 group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/20">
                            <Image src={pkg.image} alt={pkg.title[lang]} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{pkg.emoji}</span>
                                <span className="font-semibold text-white truncate">{pkg.title[lang]}</span>
                            </div>
                            <p className="text-sm text-white/50 line-clamp-1 mt-0.5">{pkg.subtitle[lang]}</p>
                            <p className="text-xs text-white/40 mt-1">{pkg.duration}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">Select →</span>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-12">
                {/* Premium Badge */}
                <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                            {lang === 'he' ? 'קונסיירז׳ פרימיום' : 'Premium Concierge'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        {lang === 'he' ? 'מצא את הכישרון המושלם' : 'Find Your Perfect Talent'}
                    </h1>
                    <p className="mt-4 text-white/50 text-lg">
                        {lang === 'he' ? 'חוויות בלעדיות, בהתאמה אישית' : 'Exclusive experiences, personally curated'}
                    </p>
                </motion.div>

                {/* Chat Container - Luxury Glass */}
                <motion.div
                    className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        className="max-h-[400px] overflow-y-auto p-6 space-y-6 scrollbar-hide"
                    >
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[90%]",
                                        msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                    )}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div>
                                            <p className="text-white/90 text-base leading-relaxed">{msg.content}</p>
                                            {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                            {msg.packages && msg.packages.length > 0 && renderPackages(msg.packages)}
                                            {msg.suggestions && msg.suggestions.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {msg.suggestions.slice(0, 3).map((s, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => sendMessage(s)}
                                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full text-sm font-medium border border-white/10 transition-all duration-200"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white text-slate-900 rounded-2xl rounded-br-md px-5 py-3">
                                            <p className="text-base">{msg.content}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                className="flex items-center gap-1.5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.span
                                        key={i}
                                        className="w-2 h-2 bg-white/40 rounded-full"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 border-t border-white/10">
                        <div className={cn(
                            "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300",
                            isFocused 
                                ? "bg-white/10 ring-1 ring-white/20" 
                                : "bg-white/5"
                        )}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang]}
                                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-base"
                                style={{ fontSize: '16px' }}
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-3 rounded-xl transition-all duration-200",
                                    input.trim() 
                                        ? 'bg-white text-slate-900 hover:bg-white/90' 
                                        : 'bg-white/10 text-white/30'
                                )}
                                whileHover={input.trim() ? { scale: 1.05 } : {}}
                                whileTap={input.trim() ? { scale: 0.95 } : {}}
                            >
                                <ArrowUp className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Trust indicators */}
                <motion.div 
                    className="flex items-center justify-center gap-6 mt-8 text-white/40 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {lang === 'he' ? 'כישרונות מאומתים' : 'Verified talents'}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {lang === 'he' ? 'תשלום מאובטח' : 'Secure payment'}
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
