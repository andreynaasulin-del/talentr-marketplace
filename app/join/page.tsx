'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Loader2, Globe, ChevronDown, User, Mail, Lock, Phone, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function JoinPage() {
    const { language, setLanguage } = useLanguage();
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const categories = [
        { id: 'Photographer', icon: '📸', label: { en: 'Photographer', ru: 'Фотограф', he: 'צלם' } },
        { id: 'Videographer', icon: '🎬', label: { en: 'Videographer', ru: 'Видеограф', he: 'צלם וידאו' } },
        { id: 'DJ', icon: '🎧', label: { en: 'DJ', ru: 'DJ', he: 'DJ' } },
        { id: 'MC', icon: '🎤', label: { en: 'MC / Host', ru: 'Ведущий', he: 'מנחה' } },
        { id: 'Magician', icon: '🎩', label: { en: 'Magician', ru: 'Фокусник', he: 'קוסם' } },
        { id: 'Singer', icon: '🎵', label: { en: 'Singer', ru: 'Певец', he: 'זמר' } },
        { id: 'Musician', icon: '🎸', label: { en: 'Musician', ru: 'Музыкант', he: 'מוזיקאי' } },
        { id: 'Bartender', icon: '🍸', label: { en: 'Bartender', ru: 'Бармен', he: 'ברמן' } },
        { id: 'Event Decor', icon: '🎨', label: { en: 'Event Decor', ru: 'Декоратор', he: 'עיצוב אירועים' } },
        { id: 'Kids Animator', icon: '🎈', label: { en: 'Kids Animator', ru: 'Аниматор', he: 'אנימטור' } },
        { id: 'Chef', icon: '👨‍🍳', label: { en: 'Chef', ru: 'Повар', he: 'שף' } },
        { id: 'Dancer', icon: '💃', label: { en: 'Dancer', ru: 'Танцор', he: 'רקדן' } },
    ];

    const cities = [
        { id: 'Tel Aviv', label: { en: 'Tel Aviv', ru: 'Тель-Авив', he: 'תל אביב' } },
        { id: 'Jerusalem', label: { en: 'Jerusalem', ru: 'Иерусалим', he: 'ירושלים' } },
        { id: 'Haifa', label: { en: 'Haifa', ru: 'Хайфа', he: 'חיפה' } },
        { id: 'Eilat', label: { en: 'Eilat', ru: 'Эйлат', he: 'אילת' } },
        { id: 'Rishon LeZion', label: { en: 'Rishon LeZion', ru: 'Ришон ле-Цион', he: 'ראשון לציון' } },
        { id: 'Netanya', label: { en: 'Netanya', ru: 'Нетания', he: 'נתניה' } },
        { id: 'Ashdod', label: { en: 'Ashdod', ru: 'Ашдод', he: 'אשדוד' } },
        { id: 'Beer Sheva', label: { en: 'Beer Sheva', ru: 'Беэр-Шева', he: 'באר שבע' } },
    ];

    const content = {
        en: {
            steps: [
                { title: "What's your name?", subtitle: "Let's start with the basics" },
                { title: "What's your email?", subtitle: "We'll use this for your account" },
                { title: "Create a password", subtitle: "Keep your account secure" },
                { title: "What do you do?", subtitle: "Select your specialty" },
                { title: "Where are you based?", subtitle: "Select your city" },
                { title: "Your phone number", subtitle: "For booking notifications" },
            ],
            namePlaceholder: "Your full name",
            emailPlaceholder: "your@email.com",
            passwordPlaceholder: "Minimum 6 characters",
            phonePlaceholder: "50-123-4567",
            next: "Continue",
            back: "Back",
            finish: "Create Account",
            creating: "Creating...",
            progress: "Step",
            of: "of",
        },
        ru: {
            steps: [
                { title: "Как тебя зовут?", subtitle: "Начнём со знакомства" },
                { title: "Твой email?", subtitle: "Для входа в аккаунт" },
                { title: "Придумай пароль", subtitle: "Защити свой аккаунт" },
                { title: "Чем занимаешься?", subtitle: "Выбери специализацию" },
                { title: "Где работаешь?", subtitle: "Выбери город" },
                { title: "Номер телефона", subtitle: "Для уведомлений о заказах" },
            ],
            namePlaceholder: "Твоё полное имя",
            emailPlaceholder: "твой@email.com",
            passwordPlaceholder: "Минимум 6 символов",
            phonePlaceholder: "50-123-4567",
            next: "Далее",
            back: "Назад",
            finish: "Создать аккаунт",
            creating: "Создаём...",
            progress: "Шаг",
            of: "из",
        },
        he: {
            steps: [
                { title: "מה השם שלך?", subtitle: "בוא נתחיל עם הבסיס" },
                { title: "מה האימייל שלך?", subtitle: "נשתמש בו לחשבון שלך" },
                { title: "צור סיסמה", subtitle: "שמור על החשבון שלך" },
                { title: "מה אתה עושה?", subtitle: "בחר את ההתמחות שלך" },
                { title: "איפה אתה נמצא?", subtitle: "בחר את העיר שלך" },
                { title: "מספר הטלפון שלך", subtitle: "להתראות על הזמנות" },
            ],
            namePlaceholder: "השם המלא שלך",
            emailPlaceholder: "your@email.com",
            passwordPlaceholder: "מינימום 6 תווים",
            phonePlaceholder: "50-123-4567",
            next: "המשך",
            back: "חזור",
            finish: "צור חשבון",
            creating: "יוצר...",
            progress: "שלב",
            of: "מתוך",
        }
    };

    const t = content[language] || content.en;
    const totalSteps = 6;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const validateStep = (): boolean => {
        setError('');
        switch (currentStep) {
            case 0:
                if (!formData.fullName.trim()) {
                    setError(language === 'ru' ? 'Введи имя' : language === 'he' ? 'הכנס שם' : 'Enter your name');
                    return false;
                }
                break;
            case 1:
                if (!formData.email.includes('@')) {
                    setError(language === 'ru' ? 'Неверный email' : language === 'he' ? 'אימייל לא תקין' : 'Invalid email');
                    return false;
                }
                break;
            case 2:
                if (formData.password.length < 6) {
                    setError(language === 'ru' ? 'Минимум 6 символов' : language === 'he' ? 'מינימום 6 תווים' : 'Minimum 6 characters');
                    return false;
                }
                break;
            case 3:
                if (!formData.category) {
                    setError(language === 'ru' ? 'Выбери специальность' : language === 'he' ? 'בחר התמחות' : 'Select a specialty');
                    return false;
                }
                break;
            case 4:
                if (!formData.city) {
                    setError(language === 'ru' ? 'Выбери город' : language === 'he' ? 'בחר עיר' : 'Select a city');
                    return false;
                }
                break;
            case 5:
                if (!formData.phone.trim()) {
                    setError(language === 'ru' ? 'Введи телефон' : language === 'he' ? 'הכנס טלפון' : 'Enter phone number');
                    return false;
                }
                break;
        }
        return true;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        if (currentStep < 5) {
            setCurrentStep((currentStep + 1) as Step);
        } else {
            handleRegister();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((currentStep - 1) as Step);
            setError('');
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: 'vendor',
                    },
                },
            });

            if (authError) throw new Error(authError.message);
            if (!authData.user) throw new Error('Failed to create user');

            const { error: vendorError } = await supabase.from('vendors').insert([{
                id: authData.user.id,
                full_name: formData.fullName,
                email: formData.email,
                category: formData.category,
                city: formData.city,
                phone: formData.phone.startsWith('972') ? formData.phone : `972${formData.phone.replace(/^0/, '')}`,
                avatar_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                price_from: 1000,
                rating: 0,
                reviews_count: 0,
                bio: '',
                portfolio_gallery: [],
            }]);

            if (vendorError) throw vendorError;

            window.location.href = '/dashboard';

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Registration error';
            console.error('Registration error:', err);
            setError(errorMessage);
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        const stepInfo = t.steps[currentStep];

        return (
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {/* Question */}
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stepInfo.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {stepInfo.subtitle}
                    </p>
                </div>

                {/* Input based on step */}
                <div className="max-w-md mx-auto">
                    {currentStep === 0 && (
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder={t.namePlaceholder}
                                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t.emailPlaceholder}
                                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={t.passwordPlaceholder}
                                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                        formData.category === cat.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                            : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500"
                                    )}
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className={cn(
                                        "text-xs font-medium text-center",
                                        formData.category === cat.id
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-300"
                                    )}>
                                        {cat.label[language] || cat.label.en}
                                    </span>
                                    {formData.category === cat.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="grid grid-cols-2 gap-3">
                            {cities.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => setFormData({ ...formData, city: city.id })}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                        formData.city === city.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                            : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500"
                                    )}
                                >
                                    <MapPin className={cn(
                                        "w-5 h-5",
                                        formData.city === city.id ? "text-blue-500" : "text-gray-400"
                                    )} />
                                    <span className={cn(
                                        "font-medium",
                                        formData.city === city.id
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {city.label[language] || city.label.en}
                                    </span>
                                    {formData.city === city.id && (
                                        <Check className="w-5 h-5 text-blue-500 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+972</span>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder={t.phonePlaceholder}
                                className="w-full h-14 pl-24 pr-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm text-center mt-3"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>
            </motion.div>
        );
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
                        <p className="text-xl text-white/80">
                            {language === 'ru' ? 'Присоединяйся к 500+ профессионалам на Talentr' : language === 'he' ? 'הצטרף ל-500+ מקצוענים ב-Talentr' : 'Join 500+ professionals on Talentr'}
                        </p>
                    </div>

                    <p className="text-white/60 text-sm">© 2024 Talentr. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Quiz Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-blue-600 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-blue-700/50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-xl font-bold text-white">
                            talent<span className="text-white/80">r</span>
                        </Link>
                    </div>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 rounded-full transition-colors"
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

                {/* Progress Bar */}
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-white/80 font-medium">
                            {t.progress} {currentStep + 1} {t.of} {totalSteps}
                        </span>
                        <span className="text-white font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                    </div>
                    {/* Step indicators */}
                    <div className="flex justify-between mt-4">
                        {[0, 1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                                    step < currentStep
                                        ? "bg-green-500 text-white"
                                        : step === currentStep
                                            ? "bg-white text-blue-600"
                                            : "bg-white/20 text-white/50"
                                )}
                            >
                                {step < currentStep ? <Check className="w-4 h-4" /> : step + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-lg bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-8 max-w-md mx-auto">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    {t.back}
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors",
                                    loading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t.creating}
                                    </>
                                ) : currentStep === 5 ? (
                                    <>
                                        {t.finish}
                                        <Sparkles className="w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        {t.next}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 text-center text-sm text-white/70">
                    {language === 'ru' ? 'Уже с нами?' : language === 'he' ? 'כבר שותף?' : 'Already a partner?'}{' '}
                    <Link href="/signin" className="text-white font-semibold hover:underline">
                        {language === 'ru' ? 'Войти' : language === 'he' ? 'התחבר' : 'Sign in'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
