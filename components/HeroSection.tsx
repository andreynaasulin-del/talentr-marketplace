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

interface CityOption {
    id: string;
    icon: string;
    label: { en: string; he: string };
}

interface EventTypeOption {
    id: string;
    icon: string;
    label: { en: string; he: string };
}

interface DateOption {
    id: string;
    value: string;
    label: { en: string; he: string };
}

// Cities for wizard
const CITIES: CityOption[] = [
    { id: 'tel-aviv', icon: '🏙️', label: { en: 'Tel Aviv', he: 'תל אביב' } },
    { id: 'jerusalem', icon: '🕌', label: { en: 'Jerusalem', he: 'ירושלים' } },
    { id: 'haifa', icon: '⛵', label: { en: 'Haifa', he: 'חיפה' } },
    { id: 'eilat', icon: '🏖️', label: { en: 'Eilat', he: 'אילת' } },
    { id: 'rishon', icon: '🌆', label: { en: 'Rishon LeZion', he: 'ראשון לציון' } },
    { id: 'netanya', icon: '🌊', label: { en: 'Netanya', he: 'נתניה' } },
];

// Event types for wizard
const EVENT_TYPES: EventTypeOption[] = [
    { id: 'wedding', icon: '💍', label: { en: 'Wedding', he: 'חתונה' } },
    { id: 'birthday', icon: '🎂', label: { en: 'Birthday', he: 'יום הולדת' } },
    { id: 'bar-mitzvah', icon: '✡️', label: { en: 'Bar/Bat Mitzvah', he: 'בר/בת מצווה' } },
    { id: 'corporate', icon: '💼', label: { en: 'Corporate', he: 'אירוע עסקי' } },
    { id: 'party', icon: '🎉', label: { en: 'Party', he: 'מסיבה' } },
    { id: 'other', icon: '✨', label: { en: 'Other', he: 'אחר' } },
];

// Quick date options
const DATE_OPTIONS: DateOption[] = [
    { id: 'flexible', value: 'flexible', label: { en: 'I\'m flexible', he: 'אני גמיש' } },
    { id: 'this-month', value: 'this-month', label: { en: 'This month', he: 'החודש' } },
    { id: 'next-month', value: 'next-month', label: { en: 'Next month', he: 'חודש הבא' } },
    { id: 'later', value: 'later', label: { en: '3+ months', he: '3+ חודשים' } },
];

export default function HeroSection() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Wizard state
    const [wizardStep, setWizardStep] = useState(0);
    const [wizardData, setWizardData] = useState({
        city: '',
        date: '',
        eventType: ''
    });

    const content = {
        en: {
            staticStart: 'We help you',
            phrases: [
                'Find the perfect DJ',
                'Book top artists',
                'Throw epic parties',
                'Create magic moments',
                'Make it unforgettable',
            ],
            tagline: 'No Compromises.',
            description: 'The only ecosystem in Israel where verified industry leaders are gathered.',
            chat: 'What are we celebrating? 🎉',
            forMasters: 'For Talents',
            forMastersDesc: 'Focus on what you do best. We ensure your talent earns what it deserves.',
            forMastersCta: 'Apply Now',
            chatPlaceholder: 'Tell me about your event...',
            welcomeMessage: "Hey! 👋 I'm your Talentr AI assistant. Tell me about your event and I'll help you find the perfect entertainment!",
        },
        he: {
            staticStart: '',
            phrases: [
                'מצא את הדיג׳יי המושלם',
                'הזמן אמנים מובילים',
                'הרם מסיבה אדירה',
                'צור רגעים קסומים',
                'הפוך את זה לבלתי נשכח',
            ],
            tagline: 'ללא פשרות.',
            description: 'המערכת היחידה בישראל בה מרוכזים מובילי התעשייה המאומתים.',
            chat: 'מה חוגגים ומתי? 🎉',
            forMasters: 'לכישרונות',
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
        <section className="relative min-h-screen overflow-hidden bg-white dark:bg-black transition-colors">

            {/* === CONTENT === */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20">

                {/* Main Headline with Typewriter */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20">

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-zinc-900 dark:text-white leading-[1.2] tracking-tighter mb-4 sm:mb-6 px-4 md:px-0">
                        {/* <span className="block mb-1 sm:mb-2">{t.staticStart}</span> */}
                        <span className="block text-zinc-800 dark:text-white/90 min-h-[1.2em]">
                            {displayText}
                            <span className="inline-block w-[3px] md:w-[4px] h-[0.9em] bg-blue-600 dark:bg-blue-500 ml-1 animate-pulse align-middle" />
                        </span>
                    </h1>

                    <motion.p
                        className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-600 mb-4 sm:mb-6 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t.tagline}
                    </motion.p>

                    <motion.p
                        className="text-xs sm:text-base md:text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed px-6 sm:px-4"
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
                            className="group flex items-center gap-3 sm:gap-4 w-full max-w-xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6 py-3 sm:py-4 bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50"
                        >
                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                            <span className="flex-1 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg text-start group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                                {t.chat}
                            </span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/20 flex-shrink-0">
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
                    <div className="p-6 sm:p-8 md:p-12 bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl sm:rounded-3xl text-center shadow-xl dark:shadow-2xl transition-all">
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4">
                            {t.forMasters}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed mb-5 sm:mb-6">
                            {t.forMastersDesc}
                        </p>
                        <a
                            href="/join"
                            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                        >
                            {t.forMastersCta}
                        </a>
                    </div>
                </motion.div>
            </div>


            {/* === FULLSCREEN AI WIZARD === */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white dark:bg-black"
                        style={{ direction: lang === 'he' ? 'rtl' : 'ltr' }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setIsChatOpen(false);
                                setWizardStep(0);
                                setWizardData({ city: '', date: '', eventType: '' });
                            }}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full flex items-center justify-center transition-all border border-zinc-200 dark:border-zinc-800"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500 dark:text-zinc-400" />
                        </button>

                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-900">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: '0%' }}
                                animate={{ width: `${((wizardStep + 1) / 4) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Wizard Content */}
                        <div className="h-full flex flex-col pt-16 sm:pt-24 px-4 sm:px-8 pb-4 overflow-y-auto overflow-x-hidden">
                            <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col justify-center py-8">
                                <AnimatePresence mode="wait">
                                    {/* Step 1: Where? */}
                                    {wizardStep === 0 && (
                                        <motion.div
                                            key="step-where"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center mb-6 sm:mb-8">
                                                <span className="text-blue-600 dark:text-blue-500 text-[10px] md:text-sm font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                                                    {lang === 'he' ? 'שלב 1 מתוך 3' : 'Step 1 of 3'}
                                                </span>
                                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mt-4 leading-tight">
                                                    {lang === 'he' ? 'איפה האירוע?' : 'Where is your event?'}
                                                </h2>
                                                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-lg">
                                                    {lang === 'he' ? 'בחר את העיר שלך' : 'Select your city'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                                                {CITIES.map((city) => (
                                                    <button
                                                        key={city.id}
                                                        onClick={() => {
                                                            setWizardData({ ...wizardData, city: city.id });
                                                            setWizardStep(1);
                                                        }}
                                                        className={`p-3 sm:p-5 rounded-2xl border-2 transition-all text-start active:scale-95 ${wizardData.city === city.id
                                                            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                                                            : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                            }`}
                                                    >
                                                        <span className="text-xl sm:text-3xl mb-1.5 sm:mb-2 block">{city.icon}</span>
                                                        <span className={`font-bold text-xs sm:text-base ${wizardData.city === city.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-white'
                                                            }`}>
                                                            {city.label[lang]}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: When? */}
                                    {wizardStep === 1 && (
                                        <motion.div
                                            key="step-when"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center mb-6 sm:mb-8">
                                                <span className="text-blue-600 dark:text-blue-500 text-[10px] md:text-sm font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                                                    {lang === 'he' ? 'שלב 2 מתוך 3' : 'Step 2 of 3'}
                                                </span>
                                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mt-4">
                                                    {lang === 'he' ? 'מתי?' : 'When is it?'}
                                                </h2>
                                                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-lg">
                                                    {lang === 'he' ? 'בחר תаריך משוער' : 'Select approximate date'}
                                                </p>
                                            </div>

                                            <div className="space-y-4 max-w-sm mx-auto">
                                                <input
                                                    type="date"
                                                    value={wizardData.date}
                                                    onChange={(e) => setWizardData({ ...wizardData, date: e.target.value })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full h-14 sm:h-20 px-6 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white text-base sm:text-xl font-medium focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    {DATE_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => {
                                                                setWizardData({ ...wizardData, date: opt.value });
                                                                setWizardStep(2);
                                                            }}
                                                            className="p-3.5 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 active:scale-95 transition-all text-start"
                                                        >
                                                            <span className="text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-sm font-bold">{opt.label[lang].toUpperCase()}</span>
                                                        </button>
                                                    ))}
                                                </div>

                                                {wizardData.date && wizardData.date !== 'flexible' && !DATE_OPTIONS.some(o => o.value === wizardData.date) && (
                                                    <button
                                                        onClick={() => setWizardStep(2)}
                                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl transition-all mt-4"
                                                    >
                                                        {lang === 'he' ? 'המשך' : 'Continue'}
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: For Whom? */}
                                    {wizardStep === 2 && (
                                        <motion.div
                                            key="step-for-whom"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center mb-6 sm:mb-8">
                                                <span className="text-blue-600 dark:text-blue-500 text-[10px] md:text-sm font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                                                    {lang === 'he' ? 'שלב 3 מתוך 3' : 'Step 3 of 3'}
                                                </span>
                                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mt-4 leading-tight">
                                                    {lang === 'he' ? 'מה חוגגים?' : 'What are you celebrating?'}
                                                </h2>
                                                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-lg">
                                                    {lang === 'he' ? 'בחר סוג אירוע' : 'Select event type'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                {EVENT_TYPES.map((event) => (
                                                    <button
                                                        key={event.id}
                                                        onClick={() => {
                                                            setWizardData({ ...wizardData, eventType: event.id });
                                                            setWizardStep(3);
                                                            // Pre-fill AI chat with context
                                                            const contextMessage = lang === 'he'
                                                                ? `אני מחפש בידור ל${event.label.he} ב${CITIES.find(c => c.id === wizardData.city)?.label.he || wizardData.city}${wizardData.date ? `, בתאריך ${wizardData.date}` : ''}`
                                                                : `I'm looking for entertainment for a ${event.label.en} in ${CITIES.find(c => c.id === wizardData.city)?.label.en || wizardData.city}${wizardData.date ? `, on ${wizardData.date}` : ''}`;
                                                            setChatInput(contextMessage);
                                                        }}
                                                        className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all text-start active:scale-95 ${wizardData.eventType === event.id
                                                            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                                                            : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                            }`}
                                                    >
                                                        <span className="text-xl sm:text-3xl mb-1.5 sm:mb-2 block">{event.icon}</span>
                                                        <span className={`font-bold text-xs sm:text-base ${wizardData.eventType === event.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-white'
                                                            }`}>
                                                            {event.label[lang]}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: AI Chat */}
                                    {wizardStep === 3 && (
                                        <motion.div
                                            key="step-chat"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="h-full flex flex-col"
                                        >
                                            <div className="text-center mb-4 sm:mb-6">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                                                </div>
                                                <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight px-4">
                                                    {lang === 'he' ? 'נהדר! עכשיו ספר לי עוד' : 'Great! Now tell me more'}
                                                </h2>
                                                <p className="text-xs sm:text-base text-zinc-500 dark:text-zinc-400 mt-1.5 px-6">
                                                    {lang === 'he' ? 'אני אעזור לך למצוא את הבידור המושלם' : "I'll help you find the perfect entertainment"}
                                                </p>
                                            </div>

                                            {/* Chat Messages */}
                                            <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 custom-scrollbar">
                                                {chatMessages.map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed ${msg.role === 'user'
                                                                ? 'bg-blue-600 text-white rounded-br-md shadow-lg shadow-blue-600/10'
                                                                : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-bl-md shadow-sm'
                                                                }`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                ))}

                                                {isTyping && (
                                                    <div className="flex justify-start">
                                                        <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                            <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                            <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                            <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={chatEndRef} />
                                            </div>

                                            {/* Chat Input */}
                                            <div className="flex items-center gap-2 sm:gap-3 px-1">
                                                <input
                                                    type="text"
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder={t.chatPlaceholder}
                                                    className="flex-1 px-4 py-3 sm:py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm sm:text-base placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-all shadow-sm outline-none"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={sendMessage}
                                                    disabled={!chatInput.trim() || isTyping}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-90 flex-shrink-0"
                                                >
                                                    {isTyping ? (
                                                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                                    ) : (
                                                        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Back Button (except on first step) */}
                            {wizardStep > 0 && wizardStep < 3 && (
                                <button
                                    onClick={() => setWizardStep(wizardStep - 1)}
                                    className="mt-6 text-zinc-500 hover:text-zinc-700 dark:hover:text-white font-medium text-sm transition-colors mx-auto"
                                >
                                    ← {lang === 'he' ? 'חזרה' : 'Back'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section >
    );
}
