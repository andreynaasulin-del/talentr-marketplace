'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Star, ArrowRight, Bot, Sparkles, CheckCircle } from 'lucide-react';
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

const animatedWords = {
    en: ['BIRTHDAYS.', 'WEDDINGS.', 'PARTIES.', 'EVENTS.', 'MOMENTS.'],
    he: ['ימי הולדת.', 'חתונות.', 'מסיבות.', 'אירועים.', 'רגעים.']
};

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'he';
    const words = animatedWords[lang];

    // Premium welcome messages (EN/HE ONLY - NO RUSSIAN)
    const initialMessages = {
        en: "Welcome to your personal talent concierge. ✨ What kind of event are you planning?",
        he: "ברוכים הבאים לקונסיירז' האישי שלכם. ✨ איזה סוג של אירוע אתם מתכננים?"
    };

    const initialSuggestions = {
        en: ['Planning a wedding', 'Birthday party', 'Corporate event'],
        he: ['מתכנן חתונה', 'יום הולדת', 'אירוע עסקי']
    };

    useEffect(() => {
        // Clear and set initial message based on language
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: initialMessages[lang],
            suggestions: initialSuggestions[lang]
        }]);
    }, [lang]);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2800);
        return () => clearInterval(interval);
    }, [words.length]);

    const placeholders = {
        en: "What are you celebrating? ✨",
        he: "מה אתם חוגגים? ✨"
    };

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
                body: JSON.stringify({ 
                    message: messageText, 
                    language: lang,
                    conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
                }),
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
                content: lang === 'he' ? 'שגיאה בחיבור. נסה שוב.' : 'Connection error. Please try again.',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderVendorCards = (vendors: Vendor[]) => (
        <div className="mt-4 space-y-3">
            {vendors.slice(0, 3).map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group active:scale-[0.98]"
                >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all">
                        <Image src={vendor.imageUrl || '/placeholder-vendor.jpg'} alt={vendor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate text-base">{vendor.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {vendor.rating} · {vendor.city}
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4">
            {/* Luxury Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,157,224,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl mx-auto py-12">
                {/* Premium Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">
                            Luxury Concierge
                        </span>
                    </div>
                </motion.div>

                {/* Main Headline - Strict & Clean */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-2">
                        {lang === 'he' ? 'כישרונות.' : 'TALENT.'}
                    </h1>
                    
                    <div className="relative" style={{ height: '1.2em' }}>
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={wordIndex}
                                className="text-5xl sm:text-7xl md:text-8xl font-black text-cyan-400 leading-none tracking-tight absolute inset-0 flex items-center justify-center"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {words[wordIndex]}
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Chat Interface - Premium Glass */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5"
                >
                    <div
                        ref={messagesContainerRef}
                        className="max-h-[380px] overflow-y-auto p-6 space-y-6 scrollbar-hide"
                    >
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                className={cn("max-w-[90%]", msg.role === 'user' ? 'ms-auto' : 'me-auto')}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="space-y-4">
                                        <p className="text-white/90 text-lg font-medium leading-relaxed">{msg.content}</p>
                                        
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        
                                        {msg.suggestions && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {msg.suggestions.map((s, i) => (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => sendMessage(s)} 
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-cyan-400 rounded-full text-xs font-bold border border-white/5 hover:border-cyan-500/30 transition-all active:scale-95"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-cyan-500 text-slate-950 rounded-2xl rounded-br-sm px-5 py-3 shadow-lg font-bold">
                                        <p className="text-base">{msg.content}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex gap-1.5 p-2 bg-white/5 w-fit rounded-full px-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.span 
                                        key={i} 
                                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full" 
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} 
                                        transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Prominent Input Field */}
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 bg-white/[0.02] border-t border-white/5">
                        <div className={cn(
                            "flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300",
                            isFocused ? "bg-white/[0.05] ring-2 ring-cyan-500/50" : "bg-white/5"
                        )}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang]}
                                className="flex-1 bg-transparent text-white placeholder:text-white/20 focus:outline-none text-lg font-medium"
                                style={{ fontSize: '18px' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-3.5 rounded-full transition-all flex items-center justify-center",
                                    input.trim() 
                                        ? 'bg-white text-slate-950 shadow-xl shadow-white/10 active:scale-90' 
                                        : 'bg-white/10 text-white/20'
                                )}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-8 mt-12 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Verified Experts
                    </span>
                    <span className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Secure Booking
                    </span>
                </div>
            </div>
        </section>
    );
}
