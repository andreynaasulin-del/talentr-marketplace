'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Sparkles, Star, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
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

// Animated gradient orb - reduced on mobile
const GradientOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <motion.div
        className={cn("absolute rounded-full blur-3xl opacity-40 md:opacity-60", className)}
        animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
        }}
        transition={{
            duration: 10,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    />
);

export default function HeroSection() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse tracking for parallax - disabled on mobile
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { stiffness: 100, damping: 30 };
    const parallaxX = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), springConfig);
    const parallaxY = useSpring(useTransform(mouseY, [-500, 500], [-15, 15]), springConfig);

    const lang = language as 'en' | 'ru' | 'he';

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
            morning: "☀️ Good morning! Planning an event? Tell me what you need!",
            afternoon: "🌤️ Good afternoon! What event are you planning?",
            evening: "🌅 Good evening! Tell me about your upcoming event!",
            night: "🌙 Still planning? I'm here 24/7!"
        },
        ru: {
            morning: "☀️ Доброе утро! Планируете мероприятие? Расскажите!",
            afternoon: "🌤️ Добрый день! Какое событие планируете?",
            evening: "🌅 Добрый вечер! Расскажите о вашем мероприятии!",
            night: "🌙 Планируете ночью? Я онлайн 24/7!"
        },
        he: {
            morning: "☀️ בוקר טוב! מתכננים אירוע? ספרו לי!",
            afternoon: "🌤️ צהריים טובים! איזה אירוע מתכננים?",
            evening: "🌅 ערב טוב! ספרו על האירוע שלכם!",
            night: "🌙 עדיין מתכננים? אני כאן 24/7!"
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
            { icon: "📸", text: "Photographer" },
            { icon: "🎧", text: "DJ" },
            { icon: "🎨", text: "Decor" },
        ],
        ru: [
            { icon: "📸", text: "Фотограф" },
            { icon: "🎧", text: "DJ" },
            { icon: "🎨", text: "Декор" },
        ],
        he: [
            { icon: "📸", text: "צלם" },
            { icon: "🎧", text: "DJ" },
            { icon: "🎨", text: "עיצוב" },
        ]
    };

    // Handle mouse move for parallax - only on desktop
    useEffect(() => {
        if (isMobile) return;
        const handleMouseMove = (e: MouseEvent) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY, isMobile]);

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
        <motion.div
            className="mt-3 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {vendors.slice(0, 2).map((vendor, index) => (
                <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link
                        href={`/vendor/${vendor.id}`}
                        className="flex items-center gap-2.5 p-2 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all group"
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
                            <p className="font-semibold text-gray-900 text-sm truncate">
                                {vendor.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {vendor.rating}
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );

    return (
        <section
            className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-4 pb-8 md:py-12"
            style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)' }}
        >
            {/* Animated Gradient Orbs - smaller on mobile */}
            <div className="absolute inset-0 overflow-hidden">
                <GradientOrb
                    className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] -top-20 md:-top-40 -left-20 md:-left-40 bg-cyan-400/40"
                    delay={0}
                />
                <GradientOrb
                    className="w-[250px] h-[250px] md:w-[500px] md:h-[500px] top-1/3 -right-10 md:-right-20 bg-violet-500/30"
                    delay={2}
                />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05] md:opacity-[0.07]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 w-full max-w-3xl mx-auto px-4"
                style={isMobile ? {} : { x: parallaxX, y: parallaxY }}
            >
                {/* Headline - Mobile Optimized */}
                <motion.div
                    className="text-center mb-5 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 md:mb-6 border border-white/20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300" />
                        <span className="text-xs md:text-sm font-medium text-white">
                            {lang === 'ru' ? 'AI-поиск' : lang === 'he' ? 'חיפוש AI' : 'AI-powered'}
                        </span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 tracking-tight leading-[1.15]">
                        <span className="block">
                            {lang === 'ru' ? 'Найдите' : lang === 'he' ? 'מצא את' : 'Find the'}
                        </span>
                        <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                            {lang === 'ru' ? 'идеального специалиста' : lang === 'he' ? 'הטאלנט המושלם' : 'perfect talent'}
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-white/85 font-medium max-w-md mx-auto px-2">
                        {lang === 'ru'
                            ? 'Опишите, что нужно — AI найдёт лучших'
                            : lang === 'he'
                                ? 'תארו מה אתם צריכים — AI ימצא'
                                : 'Describe what you need — AI finds the best'
                        }
                    </p>
                </motion.div>

                {/* Chat Container - Mobile Optimized */}
                <motion.div
                    ref={chatContainerRef}
                    className={cn(
                        "relative rounded-2xl md:rounded-3xl overflow-hidden",
                        "bg-white/95 backdrop-blur-xl",
                        "shadow-2xl shadow-black/20",
                        "border border-white/50"
                    )}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Chat Header - Compact on Mobile */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 md:p-4 text-white">
                        <div className="flex items-center gap-2.5 md:gap-3">
                            <motion.div
                                className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                            </motion.div>
                            <div>
                                <h3 className="font-bold text-base md:text-lg leading-tight">
                                    {lang === 'ru' ? 'AI Помощник' : lang === 'he' ? 'עוזר AI' : 'AI Assistant'}
                                </h3>
                                <p className="text-[11px] md:text-xs text-white/80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full" />
                                    {lang === 'ru' ? 'Онлайн' : lang === 'he' ? 'מחובר' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages - Mobile Optimized Height */}
                    <div className="h-[220px] sm:h-[260px] md:h-[300px] overflow-y-auto p-3 md:p-4 space-y-2.5 md:space-y-3 bg-gradient-to-b from-gray-50/80 to-white">
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[88%] md:max-w-[85%]",
                                        msg.role === 'user' ? 'ms-auto' : 'me-auto'
                                    )}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    layout
                                >
                                    <div className={cn(
                                        "rounded-2xl px-3 py-2.5 md:px-4 md:py-3 text-[13px] md:text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-md shadow-lg'
                                            : 'bg-white text-gray-800 shadow-md border border-gray-100/80 rounded-bl-md'
                                    )}>
                                        {msg.content}
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                {msg.suggestions.slice(0, 3).map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => sendMessage(s)}
                                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
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
                            <motion.div
                                className="flex items-center gap-2 bg-white rounded-2xl rounded-bl-md px-3 py-2.5 shadow-sm border border-gray-100 w-fit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full"
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.12,
                                                repeat: Infinity,
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts - Mobile Optimized */}
                    <AnimatePresence>
                        {messages.length <= 1 && (
                            <motion.div
                                className="px-3 md:px-4 py-2.5 md:py-3 border-t border-gray-100 bg-gray-50/50"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                                    {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => sendMessage(prompt.text)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl text-xs md:text-sm font-medium border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex-shrink-0"
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>{prompt.icon}</span>
                                            <span className="text-gray-700">{prompt.text}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input - Mobile Optimized with 16px font to prevent iOS zoom */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="p-3 md:p-4 border-t border-gray-100 bg-white"
                    >
                        <div className={cn(
                            "flex items-center gap-2 p-1 md:p-1.5 rounded-xl md:rounded-2xl border-2 transition-all",
                            isFocused
                                ? "border-blue-400 bg-blue-50/30"
                                : "border-gray-200 bg-gray-50/50"
                        )}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholders[lang] || placeholders.en}
                                className="flex-1 px-3 py-2 md:py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-base"
                                style={{ fontSize: '16px' }} // Prevents iOS zoom
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all flex-shrink-0",
                                    input.trim()
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-400'
                                )}
                                whileTap={input.trim() ? { scale: 0.95 } : {}}
                            >
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Trust Badge - Mobile Compact */}
                <motion.div
                    className="mt-5 md:mt-8 flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <div className="flex -space-x-1.5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white/30" />
                            ))}
                        </div>
                        <span className="text-white font-medium text-xs md:text-sm">
                            {lang === 'ru' ? '500+ специалистов' : lang === 'he' ? '500+ מקצוענים' : '500+ professionals'}
                        </span>
                    </div>

                    <p className="text-white/70 text-xs md:text-sm">
                        ⚡ {lang === 'ru' ? 'Бесплатно' : lang === 'he' ? 'חינם' : 'Free'}
                    </p>
                </motion.div>
            </motion.div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 80L60 73C120 66 240 53 360 46C480 40 600 40 720 43C840 46 960 53 1080 56C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}
