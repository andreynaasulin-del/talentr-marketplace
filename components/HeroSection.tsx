'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, Calendar, Users } from 'lucide-react';
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'ru' | 'he';

    const greetings = {
        en: "👋 Hi! I'm your AI event assistant. Tell me what you're planning and I'll help you find the perfect professionals!",
        ru: "👋 Привет! Я AI-помощник для мероприятий. Расскажите, что планируете, и я помогу найти идеальных специалистов!",
        he: "👋 שלום! אני עוזר AI לאירועים. ספרו לי מה אתם מתכננים ואעזור למצוא את אנשי המקצוע המושלמים!"
    };

    const placeholders = {
        en: "e.g., I need a photographer for my wedding in Tel Aviv...",
        ru: "напр.: Ищу фотографа на свадьбу в Тель-Авиве...",
        he: "למשל: אני מחפש צלם לחתונה בתל אביב..."
    };

    const quickPrompts = {
        en: [
            "Find a wedding photographer",
            "I need a DJ for birthday party",
            "Looking for event decor",
        ],
        ru: [
            "Найти свадебного фотографа",
            "Нужен диджей на день рождения",
            "Ищу декор для мероприятия",
        ],
        he: [
            "מצא צלם לחתונה",
            "אני צריך DJ למסיבת יום הולדת",
            "מחפש עיצוב אירועים",
        ]
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 'greeting',
                role: 'assistant',
                content: greetings[lang] || greetings.en,
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
                content: lang === 'ru' ? 'Извините, ошибка соединения.' : lang === 'he' ? 'סליחה, שגיאת חיבור.' : 'Sorry, connection error.',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderVendorCards = (vendors: Vendor[]) => (
        <div className="mt-3 space-y-2">
            {vendors.slice(0, 3).map((vendor) => (
                <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all group"
                >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src={vendor.imageUrl || '/placeholder-vendor.jpg'}
                            alt={vendor.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600">
                            {vendor.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {vendor.rating} • {vendor.city}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 via-sky-500 to-blue-500">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 w-full">
                {/* Headline */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
                        {lang === 'ru' ? 'Найдите идеального специалиста' : lang === 'he' ? 'מצא את הטאלנט המושלם' : 'Find the perfect talent'}
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 font-medium">
                        {lang === 'ru' ? 'Спросите AI-помощника' : lang === 'he' ? 'שאל את עוזר AI' : 'Ask our AI assistant'}
                    </p>
                </motion.div>

                {/* Embedded Chat */}
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">
                                    {lang === 'ru' ? 'AI Помощник' : lang === 'he' ? 'עוזר AI' : 'AI Assistant'}
                                </h3>
                                <p className="text-xs text-white/80 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    {lang === 'ru' ? 'Онлайн 24/7' : lang === 'he' ? 'מחובר 24/7' : 'Online 24/7'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[300px] sm:h-[350px] overflow-y-auto p-4 space-y-3 bg-gray-50">
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
                                <div className={cn(
                                    "rounded-2xl px-4 py-3 whitespace-pre-line text-sm",
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                                )}>
                                    {msg.content}
                                    {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {msg.suggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => sendMessage(s)}
                                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                className="flex items-center gap-2 text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts - only show initially */}
                    {messages.length <= 1 && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-white">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {(quickPrompts[lang] || quickPrompts.en).map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(prompt)}
                                        className="px-3 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-medium transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="p-4 border-t border-gray-200 bg-white"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={placeholders[lang] || placeholders.en}
                                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "p-3 rounded-xl transition-all",
                                    input.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-400'
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Send className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Trust Badge */}
                <motion.p
                    className="mt-6 text-center text-white/80 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {lang === 'ru'
                        ? '500+ проверенных специалистов • Бесплатно'
                        : lang === 'he'
                            ? '500+ בעלי מקצוע מאומתים • חינם'
                            : '500+ verified professionals • Free'
                    }
                </motion.p>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}
