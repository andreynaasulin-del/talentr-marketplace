'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Star, ArrowRight, Sparkles, Gift, Zap } from 'lucide-react';
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
    packages?: GigPackage[];
    suggestions?: string[];
    surprise?: string;
}

interface ChatAPIResponse {
    response: string;
    vendors: Vendor[];
    packages?: GigPackage[];
    suggestions?: string[];
    surprise?: string;
}

// Playful animated words - impulse vibes
const animatedWords = {
    en: ['VIBES.', 'MAGIC.', 'FUN.', 'WOW.', 'JOY.'],
    he: ['וייבס.', 'קסם.', 'כיף.', 'וואו.', 'שמחה.']
};

// Quick mood emoji CTAs
const moodEmojis = [
    { emoji: '😂', label: { en: 'Laugh', he: 'צחוק' }, mood: 'fun' },
    { emoji: '🎸', label: { en: 'Vibes', he: 'וייבס' }, mood: 'chill' },
    { emoji: '✨', label: { en: 'Magic', he: 'קסם' }, mood: 'wow' },
    { emoji: '🧘', label: { en: 'Chill', he: 'רגוע' }, mood: 'chill' },
    { emoji: '🎨', label: { en: 'Art', he: 'אמנות' }, mood: 'artsy' },
];

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [showSurprise, setShowSurprise] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'he';
    const words = animatedWords[lang];

    // Vibe-bot greeting - playful & impulsive
    const greetings = {
        en: "Hey! I'm your vibe-bot 😎 What do you wanna feel today?",
        he: "היי! אני הוייב-בוט שלך 😎 מה בא לך להרגיש היום?"
    };

    useEffect(() => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: greetings[lang],
        }]);
    }, [lang]);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [words.length]);

    const placeholders = {
        en: "Bored? Want something cool? 🔥",
        he: "משעמם? רוצה משהו מגניב? 🔥"
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
                packages: data.packages,
                suggestions: data.suggestions,
                surprise: data.surprise,
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: lang === 'he' ? 'אופס, נסה שוב! 🙈' : 'Oops, try again! 🙈',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleMoodClick = (mood: string, emoji: string) => {
        const prompts = {
            fun: { en: `I want to laugh ${emoji}`, he: `בא לי לצחוק ${emoji}` },
            chill: { en: `I need good vibes ${emoji}`, he: `צריך וייבס טובים ${emoji}` },
            wow: { en: `Show me something amazing ${emoji}`, he: `תראה לי משהו מדהים ${emoji}` },
            artsy: { en: `Something creative ${emoji}`, he: `משהו יצירתי ${emoji}` },
            romantic: { en: `Something romantic ${emoji}`, he: `משהו רומנטי ${emoji}` },
        };
        sendMessage(prompts[mood as keyof typeof prompts]?.[lang] || `${emoji}`);
    };

    const handleSurpriseMe = () => {
        setShowSurprise(true);
        const surprisePrompts = {
            en: "Surprise me! 🎁 Show me something random and cool",
            he: "הפתע אותי! 🎁 תראה לי משהו אקראי ומגניב"
        };
        sendMessage(surprisePrompts[lang]);
        setTimeout(() => setShowSurprise(false), 1000);
    };

    const renderVendorCards = (vendors: Vendor[]) => (
        <div className="mt-4 space-y-2">
            {vendors.slice(0, 2).map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-cyan-500/10 hover:to-purple-500/10 rounded-2xl border border-white/10 transition-all group active:scale-[0.98]"
                >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all">
                        <Image src={vendor.imageUrl || '/placeholder-vendor.jpg'} alt={vendor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{vendor.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {vendor.rating} · {vendor.city}
                        </div>
                    </div>
                    <div className="px-3 py-1.5 bg-cyan-500 text-slate-950 rounded-full text-xs font-black group-hover:scale-105 transition-transform">
                        GO →
                    </div>
                </Link>
            ))}
        </div>
    );

    const renderPackageCards = (packages: GigPackage[]) => (
        <div className="mt-4 grid grid-cols-2 gap-2">
            {packages.slice(0, 4).map((pkg) => (
                <button
                    key={pkg.id}
                    onClick={() => sendMessage(`${lang === 'he' ? 'רוצה' : 'I want'} ${pkg.title[lang]}`)}
                    className="relative aspect-square rounded-2xl overflow-hidden group active:scale-95 transition-transform"
                >
                    <Image src={pkg.image} alt={pkg.title[lang]} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-3xl mb-1">{pkg.emoji}</span>
                        <span className="text-white font-black text-xs leading-tight">{pkg.title[lang]}</span>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white font-bold">
                        {pkg.duration}
                    </div>
                </button>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(0,157,224,0.15)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
                <motion.div 
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto py-8">
                {/* Playful Headline */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-white/10 rounded-full mb-4"
                    >
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-black text-white/80 uppercase tracking-wider">
                            {lang === 'he' ? 'הזמנה בקליק' : 'Book in 1 click'}
                        </span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tight">
                        {lang === 'he' ? 'הזמן' : 'GET'}
                    </h1>
                    
                    <div className="relative h-[1.2em]">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={wordIndex}
                                className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none tracking-tight absolute inset-0 flex items-center justify-center"
                                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -30, opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {words[wordIndex]}
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Quick Mood Emojis */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-2 mb-4"
                >
                    {moodEmojis.map((item, i) => (
                        <motion.button
                            key={item.mood}
                            onClick={() => handleMoodClick(item.mood, item.emoji)}
                            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 flex items-center justify-center text-2xl transition-all active:scale-90 hover:scale-110"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            whileHover={{ y: -4 }}
                        >
                            {item.emoji}
                        </motion.button>
                    ))}
                    <motion.button
                        onClick={handleSurpriseMe}
                        className={cn(
                            "w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl transition-all active:scale-90",
                            showSurprise 
                                ? "bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent scale-110" 
                                : "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-white/10 hover:border-purple-500/50"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ y: -4, scale: 1.1 }}
                    >
                        <Gift className={cn("w-5 h-5", showSurprise ? "text-white" : "text-purple-400")} />
                    </motion.button>
                </motion.div>

                {/* Chat Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white/[0.03] backdrop-blur-2xl rounded-[28px] border border-white/10 shadow-2xl overflow-hidden"
                >
                    <div
                        ref={messagesContainerRef}
                        className="max-h-[45vh] overflow-y-auto p-4 space-y-4 scrollbar-hide"
                    >
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                className={cn("max-w-[90%]", msg.role === 'user' ? 'ms-auto' : 'me-auto')}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="space-y-3">
                                        <p className="text-white/90 text-base font-medium leading-relaxed">{msg.content}</p>
                                        
                                        {msg.surprise && (
                                            <motion.div 
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl"
                                            >
                                                <p className="text-amber-400 text-sm font-bold flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" /> {msg.surprise}
                                                </p>
                                            </motion.div>
                                        )}
                                        
                                        {msg.packages && msg.packages.length > 0 && renderPackageCards(msg.packages)}
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        
                                        {msg.suggestions && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {msg.suggestions.map((s, i) => (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => sendMessage(s)} 
                                                        className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 text-white/60 hover:text-cyan-400 rounded-full text-xs font-bold border border-white/5 hover:border-cyan-500/30 transition-all active:scale-95"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 rounded-2xl rounded-br-sm px-4 py-2.5 shadow-lg shadow-cyan-500/20 font-bold">
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex gap-1.5 p-3 bg-white/5 w-fit rounded-2xl">
                                {[0, 1, 2].map((i) => (
                                    <motion.span 
                                        key={i} 
                                        className="w-2 h-2 bg-cyan-400 rounded-full" 
                                        animate={{ y: [0, -6, 0] }} 
                                        transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Field */}
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 bg-white/[0.02] border-t border-white/5">
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300",
                            isFocused ? "bg-white/[0.08] ring-2 ring-cyan-500/50" : "bg-white/5"
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
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-3 rounded-xl transition-all flex items-center justify-center",
                                    input.trim() 
                                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 active:scale-90' 
                                        : 'bg-white/10 text-white/20'
                                )}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Subtle Trust Line */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-[10px] text-white/20 mt-4 font-medium tracking-wide"
                >
                    {lang === 'he' ? '✓ אמנים מאומתים · ✓ הזמנה מאובטחת' : '✓ Verified artists · ✓ Secure booking'}
                </motion.p>
            </div>
        </section>
    );
}
