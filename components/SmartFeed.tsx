'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, ChevronLeft, ChevronRight, Camera, Music, Mic2, Wand2, Palette, Users, RefreshCw, Filter } from 'lucide-react';
import { Vendor } from '@/types';
import VendorVisualCard from './VendorVisualCard';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    vendors?: Vendor[];
    suggestions?: string[];
    timestamp: Date;
}

interface SmartFeedProps {
    initialMessage?: string;
}

// Category cards with icons and images
const categoryCards = [
    {
        id: 'photographer',
        icon: Camera,
        label: { en: 'Photographer', he: 'צלם' },
        query: { en: 'photographer for my event', he: 'צלם לאירוע' },
        color: 'bg-blue-500',
        image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'dj',
        icon: Music,
        label: { en: 'DJ', he: "דיג'יי" },
        query: { en: 'DJ for party', he: "דיג'יי למסיבה" },
        color: 'bg-purple-500',
        image: 'https://images.unsplash.com/photo-1571266028243-e4773f3a6a1a?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'singer',
        icon: Mic2,
        label: { en: 'Singer', he: 'זמר' },
        query: { en: 'singer for event', he: 'זמר לאירוע' },
        color: 'bg-pink-500',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'magician',
        icon: Wand2,
        label: { en: 'Magician', he: 'קוסם' },
        query: { en: 'magician for kids party', he: 'קוסם למסיבת ילדים' },
        color: 'bg-indigo-500',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'decor',
        icon: Palette,
        label: { en: 'Decor', he: 'עיצוב' },
        query: { en: 'event decoration', he: 'עיצוב אירוע' },
        color: 'bg-amber-500',
        image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'animator',
        icon: Users,
        label: { en: 'Animator', he: 'אנימטור' },
        query: { en: 'kids animator', he: 'אנימטור לילדים' },
        color: 'bg-green-500',
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=200&q=80'
    },
];

export default function SmartFeed({ initialMessage }: SmartFeedProps) {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState(initialMessage || '');
    const [isLoading, setIsLoading] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [showWelcome, setShowWelcome] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialMessage && messages.length === 0) {
            sendMessage(initialMessage);
        }
    }, [initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (messageText?: string) => {
        const text = messageText || input.trim();
        if (!text || isLoading) return;

        setShowWelcome(false);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setActiveCardIndex(0);

        try {
            // Build conversation history for context
            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    conversationHistory,
                    language
                })
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                vendors: data.vendors,
                suggestions: data.suggestions,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: language === 'he'
                    ? '😅 אופס! משהו השבש. ננסה שוב?'
                    : '😅 Oops! Something went wrong. Try again?',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleCategoryClick = (category: typeof categoryCards[0]) => {
        const query = category.query[language] || category.query.en;
        sendMessage(query);
    };

    const navigateCards = (direction: 'prev' | 'next', totalCards: number) => {
        if (direction === 'prev' && activeCardIndex > 0) {
            setActiveCardIndex(prev => prev - 1);
        } else if (direction === 'next' && activeCardIndex < totalCards - 1) {
            setActiveCardIndex(prev => prev + 1);
        }
    };

    const getLatestVendorMessage = () => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].vendors && messages[i].vendors!.length > 0) {
                return messages[i];
            }
        }
        return null;
    };

    const vendorMessage = getLatestVendorMessage();

    const handleRefineSearch = () => {
        setInput(language === 'he' ? 'הראה עוד אפשרויות' : 'show me more options');
        inputRef.current?.focus();
    };

    const handleDifferentCity = () => {
        setInput(language === 'he' ? 'חפש בעיר אחרת' : 'search in different city');
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col min-h-[500px] relative">
            {/* Welcome Screen - Centered and Premium */}
            {showWelcome && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                    {/* AI Avatar/Logo - Premium Polish */}
                    <div className="relative mb-8 group cursor-default">
                        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-6">
                            <Sparkles className="w-12 h-12 text-white animate-pulse" />
                        </div>
                        {/* Status Ring */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full p-1 shadow-lg">
                            <div className="w-full h-full bg-green-500 rounded-full animate-pulse border-2 border-green-200" />
                        </div>
                        {/* Floating Particles */}
                        <div className="absolute -top-4 -left-4 w-4 h-4 bg-amber-400 rounded-full blur-sm opacity-60 animate-float" />
                        <div className="absolute top-1/2 -right-6 w-3 h-3 bg-blue-400 rounded-full blur-sm opacity-60 animate-float" style={{ animationDelay: '1s' }} />
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center max-w-lg mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                            {language === 'he' ? 'היי! אני Talentr AI' : "Hey! I'm Talentr AI"}
                        </h2>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                            {language === 'he'
                                ? 'ספר לי על האירוע שלך - אמצא את המקצוענים המושלמים תוך שניות.'
                                : "Describe your event — I'll find the perfect professionals in seconds."}
                        </p>
                    </div>

                    {/* Category Cards Grid - Wolt Style Premium */}
                    <div className="w-full max-w-3xl">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categoryCards.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    className="group relative aspect-[3/2] md:aspect-square rounded-[24px] overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-500"
                                >
                                    {/* Background Image with Zoom */}
                                    <Image
                                        src={category.image}
                                        alt={category.label[language] || category.label.en}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 200px"
                                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    {/* Premium Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center">
                                        <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500 border-2 border-white/20`}>
                                            <category.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-white text-base font-bold text-center tracking-wide">
                                            {category.label[language] || category.label.en}
                                        </span>
                                    </div>
                                    {/* Hover Shine Effect */}
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Messages - Clean Canvas Style */}
            {!showWelcome && (
                <div className="flex-1 px-4 py-10 space-y-8 max-w-3xl mx-auto w-full">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up group`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%]`}>
                                {/* AI Header with Pulse */}
                                {message.role === 'assistant' && (
                                    <div className="flex items-center gap-3 mb-3 ms-2">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-900 font-bold block leading-none mb-1">Talentr AI</span>
                                            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">{t('Online')}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Message Bubble - Premium Textures */}
                                <div
                                    className={`
                                        px-6 py-4 rounded-[24px] text-lg leading-[1.6] shadow-sm
                                        ${message.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-te-none font-semibold shadow-blue-500/10'
                                            : 'bg-white border border-gray-100 text-gray-900 rounded-ts-none'
                                        }
                                    `}
                                >
                                    {message.content}
                                </div>

                                {/* AI Suggestion Chips */}
                                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 ms-2">
                                        {message.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => sendMessage(suggestion)}
                                                className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-100 transition-all duration-200 hover:scale-105 active:scale-95"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator - Modernized */}
                    {isLoading && (
                        <div className="flex justify-start animate-slide-up">
                            <div className="flex items-center gap-3 mb-3 ms-2">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border border-gray-100 px-6 py-4 rounded-[24px] rounded-ts-none shadow-sm flex items-center gap-1.5 min-w-[80px]">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Vendor Cards Section - Premium Showcase */}
            {vendorMessage && vendorMessage.vendors && vendorMessage.vendors.length > 0 && (
                <div className="bg-gray-50/50 backdrop-blur-sm py-16 border-y border-gray-100">
                    <div className="max-w-xl mx-auto px-6">
                        {/* Card Counter & Navigation */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-1">
                                    {language === 'he' ? 'התאמות מובילות' : 'Top Matches'}
                                </h4>
                                <p className="text-sm text-gray-500 font-bold">
                                    {activeCardIndex + 1} / {vendorMessage.vendors.length} {t('vendors found')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigateCards('prev', vendorMessage.vendors!.length)}
                                    disabled={activeCardIndex === 0}
                                    className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center disabled:opacity-30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                                </button>
                                <button
                                    onClick={() => navigateCards('next', vendorMessage.vendors!.length)}
                                    disabled={activeCardIndex === vendorMessage.vendors!.length - 1}
                                    className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center disabled:opacity-30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-900" />
                                </button>
                            </div>
                        </div>

                        {/* Single Card Display - High Depth */}
                        <div className="flex justify-center mb-10">
                            <VendorVisualCard
                                vendor={vendorMessage.vendors[activeCardIndex]}
                                context={messages.find(m => m.role === 'user')?.content}
                            />
                        </div>

                        {/* Progress Bar Style Indicator */}
                        <div className="flex justify-center gap-2.5 mb-10">
                            {vendorMessage.vendors.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveCardIndex(index)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ease-smooth ${index === activeCardIndex
                                        ? 'w-10 bg-blue-600'
                                        : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Follow-up Actions - Premium Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={handleRefineSearch}
                                className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                            >
                                <RefreshCw className="w-4 h-4 text-blue-500" />
                                {t('Show more options')}
                            </button>
                            <button
                                onClick={handleDifferentCity}
                                className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                            >
                                <Filter className="w-4 h-4 text-blue-500" />
                                {t('Change location')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area - The "Smart Pill" Floating Input */}
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl pt-6 pb-8 px-6 z-20 overflow-visible">
                <div className="max-w-3xl mx-auto relative">
                    {/* Shadow Glow for input */}
                    <div className="absolute inset-x-4 inset-y-0 bg-blue-500/5 blur-2xl -z-10 rounded-full" />

                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                language === 'he'
                                    ? '...מה אתה מחפש?'
                                    : 'Describe who you are looking for...'
                            }
                            className="w-full h-16 ps-6 pe-16 bg-gray-50 border border-gray-100 rounded-[24px] text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/30 focus:bg-white focus:shadow-glow transition-all duration-300"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="absolute end-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-[18px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Footer Stats - Wolt style */}
                    <div className="flex items-center justify-center gap-6 mt-4 opacity-0 animate-fade-in delay-700">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">System Online</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">AI Matching Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
