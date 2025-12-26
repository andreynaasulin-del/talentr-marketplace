'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, HelpCircle, MapPin, Calendar, Search, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Quick action buttons
const QUICK_ACTIONS = {
    en: [
        { icon: Search, label: 'Find vendors', query: 'How do I find a photographer?' },
        { icon: Calendar, label: 'Book event', query: 'How do I book a vendor?' },
        { icon: Users, label: 'Categories', query: 'What categories are available?' },
        { icon: HelpCircle, label: 'How it works', query: 'How does Talentr work?' },
    ],
    ru: [
        { icon: Search, label: 'Найти', query: 'Как найти фотографа?' },
        { icon: Calendar, label: 'Бронировать', query: 'Как забронировать?' },
        { icon: Users, label: 'Категории', query: 'Какие категории есть?' },
        { icon: HelpCircle, label: 'Как работает', query: 'Как работает Talentr?' },
    ],
    he: [
        { icon: Search, label: 'חיפוש', query: 'איך למצוא צלם?' },
        { icon: Calendar, label: 'הזמנה', query: 'איך להזמין?' },
        { icon: Users, label: 'קטגוריות', query: 'אילו קטגוריות יש?' },
        { icon: HelpCircle, label: 'איך זה עובד', query: 'איך Talentr עובד?' },
    ],
};

// AI responses for common questions
const AI_RESPONSES: Record<string, Record<string, string>> = {
    en: {
        greeting: "Hi! 👋 I'm Talentr AI, your 24/7 event planning assistant. How can I help you today?",
        find: "To find vendors:\n\n1️⃣ Use the search bar at the top\n2️⃣ Browse categories (Photographers, DJs, etc.)\n3️⃣ Or just tell me what you need!\n\nWould you like me to help you find someone specific?",
        book: "Booking is easy! 🎉\n\n1️⃣ Find a vendor you like\n2️⃣ Click 'Book Now' on their profile\n3️⃣ Fill in event details\n4️⃣ Submit your request\n\nThe vendor will respond within 24 hours!",
        categories: "We have amazing vendors in:\n\n📸 Photographers\n🎵 DJs\n🎤 MCs & Hosts\n🎩 Magicians\n💃 Dancers\n🎂 Cake Designers\n💐 Florists\n...and more!\n\nWhich category interests you?",
        how: "Talentr connects you with top event professionals! ✨\n\n1️⃣ Search or browse vendors\n2️⃣ View profiles & reviews\n3️⃣ Send a booking request\n4️⃣ Confirm & enjoy your event!\n\nAll vendors are verified for quality.",
        default: "I'd be happy to help! You can:\n\n• Search for vendors by category\n• Browse featured professionals\n• Learn about our booking process\n\nWhat would you like to know more about?",
    },
    ru: {
        greeting: "Привет! 👋 Я AI-ассистент Talentr, помогу вам 24/7. Чем могу помочь?",
        find: "Чтобы найти специалиста:\n\n1️⃣ Используйте поиск вверху\n2️⃣ Выберите категорию\n3️⃣ Или просто напишите мне!\n\nКого ищете?",
        book: "Бронирование — это просто! 🎉\n\n1️⃣ Найдите подходящего специалиста\n2️⃣ Нажмите 'Забронировать'\n3️⃣ Заполните детали события\n4️⃣ Отправьте запрос\n\nОтвет придёт в течение 24 часов!",
        categories: "У нас есть:\n\n📸 Фотографы\n🎵 Диджеи\n🎤 Ведущие\n🎩 Фокусники\n💃 Танцоры\n🎂 Кондитеры\n💐 Флористы\n\nКакая категория интересует?",
        how: "Talentr связывает вас с лучшими специалистами! ✨\n\n1️⃣ Ищите или выбирайте\n2️⃣ Смотрите профили и отзывы\n3️⃣ Отправляйте запрос\n4️⃣ Подтвердите и наслаждайтесь!\n\nВсе проверены на качество.",
        default: "С радостью помогу! Вы можете:\n\n• Искать по категориям\n• Смотреть лучших специалистов\n• Узнать о бронировании\n\nЧто хотите узнать?",
    },
    he: {
        greeting: "היי! 👋 אני העוזר AI של Talentr, זמין 24/7. איך אוכל לעזור?",
        find: "למציאת אנשי מקצוע:\n\n1️⃣ השתמשו בחיפוש למעלה\n2️⃣ בחרו קטגוריה\n3️⃣ או פשוט ספרו לי!\n\nמה מחפשים?",
        book: "הזמנה זה קל! 🎉\n\n1️⃣ מצאו איש מקצוע\n2️⃣ לחצו 'הזמן עכשיו'\n3️⃣ מלאו פרטי האירוע\n4️⃣ שלחו בקשה\n\nתקבלו תשובה תוך 24 שעות!",
        categories: "יש לנו:\n\n📸 צלמים\n🎵 דיג'ייז\n🎤 מנחים\n🎩 קוסמים\n💃 רקדנים\n🎂 קונדיטורים\n💐 פרחים\n\nאיזו קטגוריה מעניינת?",
        how: "Talentr מחבר אתכם עם הטובים ביותר! ✨\n\n1️⃣ חפשו או דפדפו\n2️⃣ צפו בפרופילים וביקורות\n3️⃣ שלחו בקשה\n4️⃣ אשרו ותיהנו!\n\nכולם מאומתים לאיכות.",
        default: "אשמח לעזור! תוכלו:\n\n• לחפש לפי קטגוריה\n• לראות מומלצים\n• ללמוד על הזמנות\n\nמה תרצו לדעת?",
    },
};

export default function AISupportChat() {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lang = language as 'en' | 'ru' | 'he';
    const quickActions = QUICK_ACTIONS[lang] || QUICK_ACTIONS.en;
    const responses = AI_RESPONSES[lang] || AI_RESPONSES.en;

    const t = {
        title: lang === 'ru' ? 'AI Помощник' : lang === 'he' ? 'עוזר AI' : 'AI Support',
        online: lang === 'ru' ? 'Онлайн 24/7' : lang === 'he' ? 'מחובר 24/7' : 'Online 24/7',
        placeholder: lang === 'ru' ? 'Напишите вопрос...' : lang === 'he' ? 'כתבו שאלה...' : 'Ask a question...',
        typing: lang === 'ru' ? 'Печатает...' : lang === 'he' ? 'מקלידה...' : 'Typing...',
    };

    // Reset messages when language changes
    useEffect(() => {
        setMessages([]);
    }, [language]);

    // Add greeting on first open or after language change
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'greeting',
                role: 'assistant',
                content: responses.greeting,
                timestamp: new Date(),
            }]);
        }
    }, [isOpen, messages.length, responses.greeting]);

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

    const getAIResponse = (query: string): string => {
        const q = query.toLowerCase();

        if (q.includes('find') || q.includes('найти') || q.includes('search') || q.includes('поиск') || q.includes('מצא') || q.includes('חיפוש')) {
            return responses.find;
        }
        if (q.includes('book') || q.includes('брониров') || q.includes('заказ') || q.includes('הזמ')) {
            return responses.book;
        }
        if (q.includes('categor') || q.includes('катего') || q.includes('קטגור')) {
            return responses.categories;
        }
        if (q.includes('work') || q.includes('работ') || q.includes('עובד') || q.includes('how')) {
            return responses.how;
        }

        return responses.default;
    };

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

        // Simulate AI typing delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

        // Get AI response
        const response = getAIResponse(messageText);

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

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
                        {lang === 'ru' ? 'Talentr Поддержка' : lang === 'he' ? 'תמיכת Talentr' : 'Talentr Support'}
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
                    <Bot className="w-7 h-7 text-white" />

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
