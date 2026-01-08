'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Send, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const content = {
        en: {
            staticStart: 'We help you',
            phrases: [
                'find the perfect DJ',
                'book top artists',
                'throw epic parties',
                'create magic moments',
                'make it unforgettable',
            ],
            tagline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered.',
            chat: 'What are we celebrating? 🎉',
            forMasters: 'For Masters',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
            chatPlaceholder: 'Tell me about your event...',
            welcomeMessage: "Hey! 👋 I'm your Talentr AI assistant. Tell me about your event and I'll help you find the perfect entertainment!",
        },
        he: {
            staticStart: 'אנחנו עוזרים לך',
            phrases: [
                'למצוא את הדיג׳יי המושלם',
                'להזמין אמנים מובילים',
                'לעשות מסיבה אדירה',
                'ליצור רגעים קסומים',
                'להפוך את זה לבלתי נשכח',
            ],
            tagline: 'ללא פשרות.',
            description: 'המערכת היחידה בישראל בה מרוכזים מובילי התעשייה המאומתים.',
            chat: 'מה חוגגים ומתי? 🎉',
            forMasters: 'לאמנים',
            forMastersDesc: 'התמקדו במה שאתם עושים הכי טוב. אנחנו נדאג שהכישרון שלכם ירוויח את מה שמגיע לו.',
            forMastersCta: 'הגש מועמדות',
            chatPlaceholder: 'ספר לי על האירוע שלך...',
            welcomeMessage: "היי! 👋 אני העוזר החכם של Talentr. ספר לי על האירוע שלך ואמצא לך את הבידור המושלם!",
        },
    };

    const t = content[lang];

    // Typewriter state
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const currentPhrase = t.phrases[phraseIndex];

    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseBeforeDelete = 2000;

    const tick = useCallback(() => {
        if (!isDeleting) {
            if (displayText.length < currentPhrase.length) {
                setDisplayText(currentPhrase.slice(0, displayText.length + 1));
            } else {
                setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
            }
        } else {
            if (displayText.length > 0) {
                setDisplayText(displayText.slice(0, -1));
            } else {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % t.phrases.length);
            }
        }
    }, [displayText, isDeleting, currentPhrase, t.phrases.length]);

    useEffect(() => {
        const speed = isDeleting ? deleteSpeed : typeSpeed;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting]);

    useEffect(() => {
        setDisplayText('');
        setPhraseIndex(0);
        setIsDeleting(false);
    }, [lang]);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Add welcome message when chat opens
    useEffect(() => {
        if (isChatOpen && chatMessages.length === 0) {
            setChatMessages([{
                id: 'welcome',
                role: 'assistant',
                content: t.welcomeMessage
            }]);
        }
    }, [isChatOpen, t.welcomeMessage]);

    // Send message to AI
    const sendMessage = async () => {
        if (!chatInput.trim() || isTyping) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput.trim()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    conversationHistory: chatMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    language: lang
                })
            });

            const data = await response.json();

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || (lang === 'he' ? 'אופס, משהו השתבש. נסה שוב!' : 'Oops, something went wrong. Try again!')
            };

            setChatMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setChatMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: lang === 'he' ? '😅 סליחה, יש בעיה טכנית. נסה שוב בעוד רגע.' : '😅 Sorry, technical issue. Try again in a moment.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-black">

            {/* === CONTENT === */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20">

                {/* Main Headline with Typewriter */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20">

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.2] tracking-tight mb-4 sm:mb-6 px-2">
                        <span className="block mb-1 sm:mb-2">{t.staticStart}</span>
                        <span className="block text-white/90 min-h-[1.2em]">
                            {displayText}
                            <span className="inline-block w-[2px] sm:w-[3px] h-[0.9em] bg-white/80 ml-1 animate-pulse" />
                        </span>
                    </h1>

                    <motion.p
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-amber-400 mb-4 sm:mb-6 px-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t.tagline}
                    </motion.p>

                    <motion.p
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {t.description}
                    </motion.p>

                    {/* Chat Input Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="px-4"
                    >
                        <button
                            data-chat-trigger
                            onClick={() => setIsChatOpen(true)}
                            className="group flex items-center gap-3 sm:gap-4 w-full max-w-xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6 py-3 sm:py-4 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl shadow-black/10 hover:shadow-black/20 hover:bg-white transition-all cursor-pointer border border-white/20"
                        >
                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#009de0]/50 group-hover:text-[#009de0] transition-colors flex-shrink-0" />
                            <span className="flex-1 text-[#009de0]/50 text-sm sm:text-base md:text-lg text-start">
                                {t.chat}
                            </span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#009de0] to-[#0077b6] rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                        </button>
                    </motion.div>
                </div>

                {/* For Masters Block */}
                <motion.div
                    className="relative group px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="p-6 sm:p-8 md:p-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl text-center shadow-2xl">
                        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4">
                            {t.forMasters}
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed mb-5 sm:mb-6">
                            {t.forMastersDesc}
                        </p>
                        <a
                            href="/join"
                            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#009de0] text-sm sm:text-base font-bold rounded-lg sm:rounded-xl hover:bg-white/90 hover:scale-105 transition-all shadow-lg"
                        >
                            {t.forMastersCta}
                        </a>
                    </div>
                </motion.div>
            </div>


            {/* === CHAT MODAL === */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsChatOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                            style={{ maxHeight: '80vh', direction: lang === 'he' ? 'rtl' : 'ltr' }}
                        >
                            {/* Chat Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#009de0] to-[#0077b6]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Talentr AI</h3>
                                        <span className="text-xs text-white/70">{lang === 'he' ? 'מוכן לעזור' : 'Ready to help'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[400px]">
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                                ? 'bg-[#009de0] text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t.chatPlaceholder}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] focus:ring-2 focus:ring-[#009de0]/20 transition-all"
                                        autoFocus
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!chatInput.trim() || isTyping}
                                        className="w-12 h-12 bg-[#009de0] hover:bg-[#0088cc] text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                                    >
                                        {isTyping ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
