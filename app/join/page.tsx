'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Check, ArrowRight, Loader2, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type Step = 'name' | 'email' | 'password' | 'category' | 'city' | 'phone' | 'complete';

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string;
    options?: string[];
}

export default function JoinPage() {
    const { language, setLanguage } = useLanguage();
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('name');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const languages = [
        { code: 'en' as const, label: 'English', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עברית', flag: '🇮🇱' },
        { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        category: '',
        city: '',
        phone: '',
    });

    const steps: Step[] = ['name', 'email', 'password', 'category', 'city', 'phone', 'complete'];
    const currentStepIndex = steps.indexOf(currentStep);
    const progress = (currentStepIndex / (steps.length - 1)) * 100;

    const categories = [
        'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
        'Musician', 'Bartender', 'Event Decor', 'Kids Animator',
    ];

    const cities = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'];

    const content = {
        en: {
            greeting: "Hey! 👋 I'm here to help you join Talentr. Let's make it quick and fun!",
            askName: "First things first - what's your name?",
            askEmail: "Nice to meet you, {name}! 🎉 What's your email address?",
            askPassword: "Great! Now let's secure your account. Create a password (min 6 characters):",
            askCategory: "Awesome! What type of professional are you? Pick one:",
            askCity: "Where are you based? Select your city:",
            askPhone: "Almost done! What's your phone number? (We'll only use it for bookings)",
            complete: "Perfect! 🎊 You're all set, {name}! Creating your account...",
            success: "Welcome to Talentr! 🚀 Redirecting to your dashboard...",
            placeholder: "Type your answer...",
            namePlaceholder: "Your full name",
            emailPlaceholder: "your@email.com",
            passwordPlaceholder: "Min 6 characters",
            phonePlaceholder: "50-123-4567",
        },
        ru: {
            greeting: "Привет! 👋 Я помогу тебе присоединиться к Talentr. Давай быстро и весело!",
            askName: "Начнём с главного - как тебя зовут?",
            askEmail: "Приятно познакомиться, {name}! 🎉 Какой твой email?",
            askPassword: "Отлично! Теперь защитим аккаунт. Придумай пароль (мин. 6 символов):",
            askCategory: "Круто! Кем ты работаешь? Выбери специальность:",
            askCity: "Где ты базируешься? Выбери город:",
            askPhone: "Почти готово! Твой номер телефона? (Только для бронирований)",
            complete: "Супер! 🎊 Всё готово, {name}! Создаю твой аккаунт...",
            success: "Добро пожаловать в Talentr! 🚀 Переходим в личный кабинет...",
            placeholder: "Напиши ответ...",
            namePlaceholder: "Твоё полное имя",
            emailPlaceholder: "твой@email.com",
            passwordPlaceholder: "Мин. 6 символов",
            phonePlaceholder: "50-123-4567",
        },
        he: {
            greeting: "היי! 👋 אני כאן לעזור לך להצטרף ל-Talentr. בוא נעשה את זה מהר וכיף!",
            askName: "קודם כל - מה השם שלך?",
            askEmail: "נעים להכיר, {name}! 🎉 מה כתובת האימייל שלך?",
            askPassword: "מעולה! עכשיו נאבטח את החשבון. צור סיסמה (מינימום 6 תווים):",
            askCategory: "אחלה! מה סוג המקצוע שלך? בחר אחד:",
            askCity: "איפה אתה מבוסס? בחר את העיר שלך:",
            askPhone: "כמעט סיימנו! מה מספר הטלפון שלך? (רק להזמנות)",
            complete: "מושלם! 🎊 הכל מוכן, {name}! יוצר את החשבון שלך...",
            success: "ברוך הבא ל-Talentr! 🚀 מעביר ללוח הבקרה...",
            placeholder: "הקלד את התשובה שלך...",
            namePlaceholder: "השם המלא שלך",
            emailPlaceholder: "your@email.com",
            passwordPlaceholder: "מינימום 6 תווים",
            phonePlaceholder: "50-123-4567",
        }
    };

    const t = content[language] || content.en;

    // Initialize with greeting
    useEffect(() => {
        const timer = setTimeout(() => {
            addBotMessage(t.greeting);
            setTimeout(() => addBotMessage(t.askName), 1000);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Reset messages when language changes
    useEffect(() => {
        if (messages.length > 0) {
            setMessages([]);
            setCurrentStep('name');
            setFormData({ fullName: '', email: '', password: '', category: '', city: '', phone: '' });
            setTimeout(() => {
                addBotMessage(t.greeting);
                setTimeout(() => addBotMessage(t.askName), 1000);
            }, 300);
        }
    }, [language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentStep]);

    const addBotMessage = (text: string, options?: string[]) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: 'bot',
                content: text,
                options
            }]);
            setIsTyping(false);
        }, 600);
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'user',
            content: text
        }]);
    };

    const handleSubmit = async (value?: string) => {
        const answer = value || input.trim();
        if (!answer && currentStep !== 'complete') return;

        addUserMessage(answer);
        setInput('');

        // Process based on current step
        switch (currentStep) {
            case 'name':
                setFormData(prev => ({ ...prev, fullName: answer }));
                setTimeout(() => {
                    addBotMessage(t.askEmail.replace('{name}', answer));
                    setCurrentStep('email');
                }, 800);
                break;

            case 'email':
                if (!answer.includes('@')) {
                    setTimeout(() => addBotMessage(language === 'ru' ? 'Хм, это не похоже на email. Попробуй ещё раз!' : language === 'he' ? 'הממ, זה לא נראה כמו אימייל. נסה שוב!' : "Hmm, that doesn't look like an email. Try again!"), 500);
                    return;
                }
                setFormData(prev => ({ ...prev, email: answer }));
                setTimeout(() => {
                    addBotMessage(t.askPassword);
                    setCurrentStep('password');
                }, 800);
                break;

            case 'password':
                if (answer.length < 6) {
                    setTimeout(() => addBotMessage(language === 'ru' ? 'Пароль слишком короткий! Минимум 6 символов 🔐' : language === 'he' ? 'הסיסמה קצרה מדי! מינימום 6 תווים 🔐' : "Password too short! Need at least 6 characters 🔐"), 500);
                    return;
                }
                setFormData(prev => ({ ...prev, password: answer }));
                setTimeout(() => {
                    addBotMessage(t.askCategory, categories);
                    setCurrentStep('category');
                }, 800);
                break;

            case 'category':
                setFormData(prev => ({ ...prev, category: answer }));
                setTimeout(() => {
                    addBotMessage(t.askCity, cities);
                    setCurrentStep('city');
                }, 800);
                break;

            case 'city':
                setFormData(prev => ({ ...prev, city: answer }));
                setTimeout(() => {
                    addBotMessage(t.askPhone);
                    setCurrentStep('phone');
                }, 800);
                break;

            case 'phone':
                setFormData(prev => ({ ...prev, phone: answer }));
                setTimeout(async () => {
                    addBotMessage(t.complete.replace('{name}', formData.fullName));
                    setCurrentStep('complete');

                    // Actually register
                    await handleRegister({
                        ...formData,
                        phone: answer
                    });
                }, 800);
                break;
        }
    };

    const handleRegister = async (data: typeof formData) => {
        setLoading(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        role: 'vendor',
                    },
                },
            });

            if (authError) throw new Error(authError.message);
            if (!authData.user) throw new Error('Failed to create user');

            const { error: vendorError } = await supabase.from('vendors').insert([{
                id: authData.user.id,
                full_name: data.fullName,
                email: data.email,
                category: data.category,
                city: data.city,
                phone: data.phone.startsWith('972') ? data.phone : `972${data.phone.replace(/^0/, '')}`,
                avatar_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                price_from: 1000,
                rating: 0,
                reviews_count: 0,
                bio: '',
                portfolio_gallery: [],
            }]);

            if (vendorError) throw vendorError;

            setTimeout(() => {
                addBotMessage(t.success);
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }, 1000);

        } catch (err: any) {
            console.error('Registration error:', err);
            addBotMessage(language === 'ru'
                ? `Упс! Ошибка: ${err.message}. Попробуй ещё раз!`
                : language === 'he'
                    ? `אופס! שגיאה: ${err.message}. נסה שוב!`
                    : `Oops! Error: ${err.message}. Try again!`);
            setCurrentStep('name');
            setLoading(false);
        }
    };

    const handleOptionClick = (option: string) => {
        handleSubmit(option);
    };

    const getPlaceholder = () => {
        switch (currentStep) {
            case 'name': return t.namePlaceholder;
            case 'email': return t.emailPlaceholder;
            case 'password': return t.passwordPlaceholder;
            case 'phone': return t.phonePlaceholder;
            default: return t.placeholder;
        }
    };

    const getInputType = () => {
        switch (currentStep) {
            case 'email': return 'email';
            case 'password': return 'password';
            case 'phone': return 'tel';
            default: return 'text';
        }
    };

    return (
        <div className="min-h-screen flex" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1600&q=80"
                    alt="Professional DJ at work"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="text-3xl font-bold">
                        talent<span className="text-white/80">r</span>
                    </Link>

                    <div className="max-w-lg">
                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            {language === 'ru' ? 'Развивай свой бизнес' : language === 'he' ? 'צמיח את העסק שלך' : 'Grow your business'}
                        </h2>
                        <p className="text-xl text-white/80 mb-6">
                            {language === 'ru' ? 'Присоединяйся к 500+ профессионалам на Talentr' : language === 'he' ? 'הצטרף ל-500+ מקצוענים ב-Talentr' : 'Join 500+ professionals on Talentr'}
                        </p>

                        {/* Progress indicator */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">
                                    {language === 'ru' ? 'Прогресс' : language === 'he' ? 'התקדמות' : 'Progress'}
                                </span>
                                <span className="font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </div>
                            <div className="flex justify-between">
                                {steps.slice(0, -1).map((step, index) => (
                                    <div
                                        key={step}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                            index < currentStepIndex
                                                ? "bg-green-500 text-white"
                                                : index === currentStepIndex
                                                    ? "bg-white text-gray-900"
                                                    : "bg-white/20 text-white/50"
                                        )}
                                    >
                                        {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-white/60 text-sm">© 2024 Talentr. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Chat */}
            <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="lg:hidden">
                            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                                talent<span className="text-blue-600">r</span>
                            </Link>
                        </div>
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {language === 'ru' ? 'Talentr Бот' : language === 'he' ? 'בוט Talentr' : 'Talentr Bot'}
                                </p>
                                <p className="text-sm text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    {language === 'ru' ? 'Онлайн' : language === 'he' ? 'מחובר' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                            <span>{currentLang.flag}</span>
                            <span className="hidden sm:inline">{currentLang.label}</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showLangDropdown && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {showLangDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 z-50"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3",
                                                    language === lang.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
                                                )}
                                            >
                                                <span>{lang.flag}</span>
                                                <span className="font-medium">{lang.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Progress */}
                <div className="lg:hidden p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">
                            {language === 'ru' ? 'Шаг' : language === 'he' ? 'שלב' : 'Step'} {currentStepIndex + 1}/6
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "flex",
                                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-4 py-3",
                                    msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm rounded-bl-md'
                                )}>
                                    <p className="text-base">{msg.content}</p>

                                    {/* Options */}
                                    {msg.options && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {msg.options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleOptionClick(option)}
                                                    className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium transition-colors"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm w-fit"
                        >
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {currentStep !== 'complete' && !['category', 'city'].includes(currentStep) && (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                        className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <input
                                ref={inputRef}
                                type={getInputType()}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={getPlaceholder()}
                                disabled={loading}
                                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-base"
                                autoComplete={currentStep === 'password' ? 'new-password' : 'off'}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className={cn(
                                    "p-2.5 rounded-xl transition-colors",
                                    input.trim() && !loading
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                                )}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* Loading state for complete */}
                {currentStep === 'complete' && loading && (
                    <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{language === 'ru' ? 'Создаём аккаунт...' : language === 'he' ? 'יוצר חשבון...' : 'Creating account...'}</span>
                        </div>
                    </div>
                )}

                {/* Footer link */}
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
                    {language === 'ru' ? 'Уже с нами?' : language === 'he' ? 'כבר שותף?' : 'Already a partner?'}{' '}
                    <Link href="/signin" className="text-blue-600 font-semibold hover:underline">
                        {language === 'ru' ? 'Войти' : language === 'he' ? 'התחבר' : 'Sign in'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
