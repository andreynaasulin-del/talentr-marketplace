'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Star, Plus } from 'lucide-react';
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

    const placeholders = {
        en: "Ask me anything...",
        he: "שאל אותי כל דבר..."
    };

    // Welcome message
    useEffect(() => {
        const welcomeMsg: Message = {
            id: 'welcome',
            role: 'assistant',
            content: lang === 'he' 
                ? 'שלום, אני הקונסיירז׳ האישי שלך. מה החוויה שאתה מחפש?'
                : 'Hello, I\'m your personal concierge. What experience are you looking for?',
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
        <div className="mt-6 space-y-3">
            {vendors.slice(0, 2).map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="group flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:ring-2 hover:ring-cyan-500/20 hover:scale-[1.01]"
                >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-cyan-500/30 transition-all">
                        <Image src={vendor.imageUrl || '/placeholder-vendor.jpg'} alt={vendor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{vendor.name}</p>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{vendor.rating}</span>
                            <span className="text-white/20">·</span>
                            <span>{vendor.city}</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500 transition-all duration-300">
                        <Plus className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                    </div>
                </Link>
            ))}
        </div>
    );

    const renderPackages = (packages: GigPackage[]) => (
        <div className="mt-6 space-y-3">
            {packages.map(pkg => (
                <motion.button
                    key={pkg.id}
                    onClick={() => sendMessage(pkg.title[lang])}
                    className="group w-full text-left p-5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:ring-2 hover:ring-amber-500/20 hover:scale-[1.01]"
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center gap-4">
                        {/* Large Thumbnail */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-amber-500/30 transition-all">
                            <Image 
                                src={pkg.image} 
                                alt={pkg.title[lang]} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            {/* Emoji badge */}
                            <div className="absolute bottom-1 end-1 w-7 h-7 bg-slate-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-sm">
                                {pkg.emoji}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-lg truncate group-hover:text-amber-400 transition-colors">
                                {pkg.title[lang]}
                            </h4>
                            <p className="text-sm text-white/40 line-clamp-1 mt-0.5">
                                {pkg.subtitle[lang]}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-white/5 rounded-md text-xs text-white/50">
                                    {pkg.duration}
                                </span>
                            </div>
                        </div>

                        {/* Select Button */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-300">
                                <Plus className="w-6 h-6 text-amber-400 group-hover:text-slate-950 transition-colors" />
                            </div>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Deep gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
            
            {/* Radial glow behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div 
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Premium Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                            {lang === 'he' ? 'קונסיירז׳ פרימיום' : 'Premium Concierge'}
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
                        {lang === 'he' ? 'מצא את הכישרון' : 'Find Your Perfect'}
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {lang === 'he' ? 'המושלם' : 'Talent'}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 text-lg text-slate-400 max-w-md mx-auto">
                        {lang === 'he' 
                            ? 'חוויות בלעדיות, בהתאמה אישית מושלמת'
                            : 'Exclusive experiences, perfectly curated for you'}
                    </p>
                </motion.div>

                {/* Chat Container - Premium Glass */}
                <motion.div
                    className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        className="max-h-[450px] overflow-y-auto p-6 space-y-6 scrollbar-hide"
                    >
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[95%]",
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
                                                <div className="flex flex-wrap gap-2 mt-5">
                                                    {msg.suggestions.slice(0, 3).map((s, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => sendMessage(s)}
                                                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-sm font-medium border border-white/5 hover:border-white/20 transition-all duration-200"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white text-slate-900 rounded-2xl rounded-be-md px-5 py-3 shadow-lg">
                                            <p className="text-base font-medium">{msg.content}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.span
                                        key={i}
                                        className="w-2.5 h-2.5 bg-cyan-400/60 rounded-full"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area - Prominent */}
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 border-t border-white/5">
                        <div className={cn(
                            "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300",
                            isFocused 
                                ? "bg-slate-800 ring-2 ring-cyan-500/50" 
                                : "bg-slate-800/60"
                        )}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang]}
                                className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-base font-medium"
                                style={{ fontSize: '16px' }}
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-3.5 rounded-xl font-bold transition-all duration-200",
                                    input.trim() 
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50' 
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
                    className="flex items-center justify-center gap-8 mt-10 text-white/30 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        {lang === 'he' ? 'כישרונות מאומתים' : 'Verified Talents'}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        {lang === 'he' ? 'תשלום מאובטח' : 'Secure Payment'}
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
