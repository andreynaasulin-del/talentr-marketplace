'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, HelpCircle, Calendar, Search, Users, Star, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Vendor } from '@/types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    vendors?: Vendor[];
    suggestions?: string[];
}

interface ChatAPIResponse {
    response: string;
    vendors: Vendor[];
    extracted: {
        category?: string;
        city?: string;
        eventType?: string;
    };
    suggestions?: string[];
}

// Quick action buttons
const QUICK_ACTIONS = {
    en: [
        { icon: Search, label: 'Find vendors', query: 'I need a photographer for my wedding' },
        { icon: Calendar, label: 'Book event', query: 'How do I book a vendor?' },
        { icon: Users, label: 'Categories', query: 'What categories are available?' },
        { icon: HelpCircle, label: 'How it works', query: 'How does Talentr work?' },
    ],
    ru: [
        { icon: Search, label: 'Найти', query: 'Ищу фотографа на свадьбу' },
        { icon: Calendar, label: 'Бронировать', query: 'Как забронировать специалиста?' },
        { icon: Users, label: 'Категории', query: 'Какие категории специалистов есть?' },
        { icon: HelpCircle, label: 'Как работает', query: 'Как работает Talentr?' },
    ],
    he: [
        { icon: Search, label: 'חיפוש', query: 'אני מחפש צלם לחתונה' },
        { icon: Calendar, label: 'הזמנה', query: 'איך להזמין איש מקצוע?' },
        { icon: Users, label: 'קטגוריות', query: 'אילו קטגוריות יש?' },
        { icon: HelpCircle, label: 'איך זה עובד', query: 'איך Talentr עובד?' },
    ],
};

// Greeting messages
const GREETINGS = {
    en: "Hi! 👋 I'm Talentr AI, your 24/7 event planning assistant. Tell me about your event and I'll find the perfect professionals for you!",
    ru: "Привет! 👋 Я AI-ассистент Talentr, помогу найти лучших специалистов для вашего мероприятия 24/7. Расскажите, что вы планируете!",
    he: "היי! 👋 אני העוזר AI של Talentr, זמין 24/7. ספרו לי על האירוע שלכם ואמצא לכם את אנשי המקצוע המושלמים!",
};

// Error messages
const ERROR_MESSAGES = {
    en: "Sorry, I'm having trouble connecting. Please try again in a moment.",
    ru: "Извините, проблема с соединением. Попробуйте ещё раз через минуту.",
    he: "סליחה, יש בעיה בחיבור. נסו שוב עוד רגע.",
};

export default function AISupportChat() {
    const pathname = usePathname();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'ru' | 'he';
    const quickActions = QUICK_ACTIONS[lang] || QUICK_ACTIONS.en;

    // Hide on auth pages to prevent covering Sign In/Sign Up buttons
    const authRoutes = ['/signin', '/signup', '/join'];
    if (authRoutes.includes(pathname)) {
        return null;
    }

    const t = {
        title: lang === 'ru' ? 'AI Помощник' : lang === 'he' ? 'עוזר AI' : 'AI Support',
        online: lang === 'ru' ? 'Онлайн 24/7' : lang === 'he' ? 'מחובר 24/7' : 'Online 24/7',
        placeholder: lang === 'ru' ? 'Напишите вопрос...' : lang === 'he' ? 'כתבו שאלה...' : 'Ask a question...',
        typing: lang === 'ru' ? 'Думаю...' : lang === 'he' ? 'חושב...' : 'Thinking...',
        viewProfile: lang === 'ru' ? 'Профиль' : lang === 'he' ? 'פרופיל' : 'View',
    };

    // Reset messages when language changes
    useEffect(() => {
        setMessages([]);
        setConversationHistory([]);
    }, [language]);

    // Add greeting on first open or after language change
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = GREETINGS[lang] || GREETINGS.en;
            setMessages([{
                id: 'greeting',
                role: 'assistant',
                content: greeting,
                timestamp: new Date(),
            }]);
        }
    }, [isOpen, messages.length, lang]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Update conversation history
        const newHistory = [...conversationHistory, { role: 'user' as const, content: messageText }];

        try {
            // Call the real API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    language: lang,
                    conversationHistory: newHistory.slice(-10), // Keep last 10 messages for context
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data: ChatAPIResponse = await response.json();

            // Create assistant message with vendors
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
                vendors: data.vendors,
                suggestions: data.suggestions,
            };

            setMessages(prev => [...prev, assistantMessage]);
            setConversationHistory([...newHistory, { role: 'assistant', content: data.response }]);

            // Show toast if vendors found
            if (data.vendors && data.vendors.length > 0) {
                toast.success(
                    lang === 'ru' ? `Найдено ${data.vendors.length} специалистов!` :
                        lang === 'he' ? `נמצאו ${data.vendors.length} מקצוענים!` :
                            `Found ${data.vendors.length} professionals!`,
                    { duration: 2000 }
                );
            }

        } catch (error) {
            console.error('Chat API error:', error);

            // Show error message
            const errorMessage = ERROR_MESSAGES[lang] || ERROR_MESSAGES.en;
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);

            toast.error(
                lang === 'ru' ? 'Ошибка соединения' :
                    lang === 'he' ? 'שגיאת חיבור' :
                        'Connection error'
            );
        } finally {
            setIsTyping(false);
        }
    };

    // Render vendor mini-cards
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
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                            {vendor.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {vendor.rating}
                            </span>
                            <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                {vendor.city}
                            </span>
                        </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </Link>
            ))}
            {vendors.length > 3 && (
                <p className="text-xs text-center text-gray-500 pt-1">
                    +{vendors.length - 3} {lang === 'ru' ? 'ещё' : lang === 'he' ? 'עוד' : 'more'}
                </p>
            )}
        </div>
    );

    // Render suggestion chips
    const renderSuggestions = (suggestions: string[]) => (
        <div className="flex flex-wrap gap-1.5 mt-3">
            {suggestions.map((suggestion, i) => (
                <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium transition-colors"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );

    return (
        <>
            {/* Floating Button with Label */}
            <motion.div
                className={cn(
                    "fixed bottom-[100px] right-5 z-40",
                    "flex items-center gap-3",
                    isOpen && "scale-0 opacity-0 pointer-events-none"
                )}
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: isOpen ? 0 : 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                {/* Permanent Label */}
                <motion.div
                    className="bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-gray-800">
                        {lang === 'ru' ? 'Talentr Ассистент' : lang === 'he' ? 'עוזר Talentr' : 'Talentr Assistant'}
                    </span>
                </motion.div>

                {/* Button */}
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "w-14 h-14 rounded-full shadow-lg shadow-blue-500/30",
                        "bg-gradient-to-br from-blue-600 to-indigo-600",
                        "hover:from-blue-500 hover:to-indigo-500",
                        "flex items-center justify-center",
                        "transition-all duration-300"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Sparkles className="w-7 h-7 text-white" />

                    {/* Online Indicator */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={cn(
                            "fixed bottom-[100px] right-5 z-50",
                            "w-[380px] max-w-[calc(100vw-40px)]",
                            "bg-white rounded-3xl shadow-2xl overflow-hidden",
                            "border border-gray-100"
                        )}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <span className="absolute bottom-0 end-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{t.title}</h3>
                                        <div className="flex items-center gap-1.5 text-sm text-white/80">
                                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                                            {t.online}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                                        "rounded-2xl px-4 py-3 whitespace-pre-line",
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-md'
                                            : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                                    )}>
                                        {msg.content}
                                        {/* Show vendor cards if present */}
                                        {msg.vendors && msg.vendors.length > 0 && renderVendorCards(msg.vendors)}
                                        {/* Show suggestion chips if present */}
                                        {msg.suggestions && msg.suggestions.length > 0 && renderSuggestions(msg.suggestions)}
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
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-sm">{t.typing}</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        {messages.length <= 1 && (
                            <div className="px-4 py-3 border-t border-gray-100 bg-white">
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(action.query)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-sm font-medium transition-colors"
                                        >
                                            <action.icon className="w-4 h-4" />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="p-4 border-t border-gray-100 bg-white"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t.placeholder}
                                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                )}
            </AnimatePresence>
        </>
    );
}
