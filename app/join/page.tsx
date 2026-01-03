'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Loader2, ChevronDown, User, Mail, Lock, Phone, MapPin, Sparkles } from 'lucide-react';
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
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
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
        { id: 'Photographer', icon: '📸', label: { en: 'Photographer', he: 'צלם' } },
        { id: 'Videographer', icon: '🎬', label: { en: 'Videographer', he: 'צלם וידאו' } },
        { id: 'DJ', icon: '🎧', label: { en: 'DJ', he: 'DJ' } },
        { id: 'MC', icon: '🎤', label: { en: 'MC / Host', he: 'מנחה' } },
        { id: 'Magician', icon: '🎩', label: { en: 'Magician', he: 'קוסם' } },
        { id: 'Singer', icon: '🎵', label: { en: 'Singer', he: 'זמר' } },
        { id: 'Musician', icon: '🎸', label: { en: 'Musician', he: 'מוזיקאי' } },
        { id: 'Bartender', icon: '🍸', label: { en: 'Bartender', he: 'ברמן' } },
        { id: 'Event Decor', icon: '🎨', label: { en: 'Event Decor', he: 'עיצוב' } },
        { id: 'Kids Animator', icon: '🎈', label: { en: 'Kids', he: 'אנימטור' } },
        { id: 'Chef', icon: '👨‍🍳', label: { en: 'Chef', he: 'שף' } },
        { id: 'Dancer', icon: '💃', label: { en: 'Dancer', he: 'רקדן' } },
    ];

    const cities = [
        { id: 'Tel Aviv', label: { en: 'Tel Aviv', he: 'תל אביב' } },
        { id: 'Jerusalem', label: { en: 'Jerusalem', he: 'ירושלים' } },
        { id: 'Haifa', label: { en: 'Haifa', he: 'חיפה' } },
        { id: 'Eilat', label: { en: 'Eilat', he: 'אילת' } },
        { id: 'Rishon LeZion', label: { en: 'Rishon', he: 'ראשון' } },
        { id: 'Netanya', label: { en: 'Netanya', he: 'נתניה' } },
        { id: 'Ashdod', label: { en: 'Ashdod', he: 'אשדוד' } },
    ];

    const content = {
        en: {
            steps: [
                { title: "What's your name?", subtitle: "Let's start" },
                { title: "Your email", subtitle: "For your account" },
                { title: "Create password", subtitle: "Keep it secure" },
                { title: "What do you do?", subtitle: "Your specialty" },
                { title: "Where are you?", subtitle: "Your city" },
                { title: "Phone number", subtitle: "For bookings" },
            ],
            namePlaceholder: "Full name",
            emailPlaceholder: "your@email.com",
            passwordPlaceholder: "Min 6 characters",
            phonePlaceholder: "50-123-4567",
            next: "Continue",
            back: "Back",
            finish: "Create Account",
            creating: "Creating...",
        },
        he: {
            steps: [
                { title: "מה השם שלך?", subtitle: "בואו נתחיל" },
                { title: "האימייל שלך", subtitle: "לחשבון" },
                { title: "צור סיסמה", subtitle: "שמור בטוח" },
                { title: "מה אתה עושה?", subtitle: "ההתמחות שלך" },
                { title: "איפה אתה?", subtitle: "העיר שלך" },
                { title: "מספר טלפון", subtitle: "להזמנות" },
            ],
            namePlaceholder: "שם מלא",
            emailPlaceholder: "your@email.com",
            passwordPlaceholder: "מינימום 6 תווים",
            phonePlaceholder: "50-123-4567",
            next: "המשך",
            back: "חזור",
            finish: "צור חשבון",
            creating: "יוצר...",
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
                    setError(language === 'he' ? 'הכנס שם' : 'Enter name');
                    return false;
                }
                break;
            case 1:
                if (!formData.email.includes('@')) {
                    setError(language === 'he' ? 'אימייל לא תקין' : 'Invalid email');
                    return false;
                }
                break;
            case 2:
                if (formData.password.length < 6) {
                    setError(language === 'he' ? 'מינימום 6 תווים' : 'Min 6 chars');
                    return false;
                }
                break;
            case 3:
                if (!formData.category) {
                    setError(language === 'he' ? 'בחר התמחות' : 'Select one');
                    return false;
                }
                break;
            case 4:
                if (!formData.city) {
                    setError(language === 'he' ? 'בחר עיר' : 'Select city');
                    return false;
                }
                break;
            case 5:
                if (!formData.phone.trim()) {
                    setError(language === 'he' ? 'הכנס טלפון' : 'Enter phone');
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
                user_id: authData.user.id,
                name: formData.fullName,
                email: formData.email,
                category: formData.category,
                city: formData.city,
                phone: formData.phone.startsWith('972') ? formData.phone : `972${formData.phone.replace(/^0/, '')}`,
                image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                price_from: 1000,
                description: '',
            }]);

            if (vendorError) throw vendorError;

            window.location.href = '/dashboard';

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error';
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
                transition={{ duration: 0.2 }}
                className="space-y-6"
            >
                {/* Question */}
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
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
                            <User className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder={t.namePlaceholder}
                                className="w-full h-14 ps-12 pe-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="relative">
                            <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t.emailPlaceholder}
                                className="w-full h-14 ps-12 pe-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="relative">
                            <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={t.passwordPlaceholder}
                                className="w-full h-14 ps-12 pe-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={cn(
                                        "relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                                        formData.category === cat.id
                                            ? "border-[#009de0] bg-[#009de0]/10"
                                            : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300"
                                    )}
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className={cn(
                                        "text-xs font-medium text-center",
                                        formData.category === cat.id
                                            ? "text-[#009de0]"
                                            : "text-gray-600 dark:text-gray-300"
                                    )}>
                                        {cat.label[language] || cat.label.en}
                                    </span>
                                    {formData.category === cat.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -end-1 w-5 h-5 bg-[#009de0] rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="grid grid-cols-2 gap-2">
                            {cities.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => setFormData({ ...formData, city: city.id })}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                        formData.city === city.id
                                            ? "border-[#009de0] bg-[#009de0]/10"
                                            : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300"
                                    )}
                                >
                                    <MapPin className={cn(
                                        "w-4 h-4",
                                        formData.city === city.id ? "text-[#009de0]" : "text-gray-400"
                                    )} />
                                    <span className={cn(
                                        "font-medium text-sm",
                                        formData.city === city.id
                                            ? "text-[#009de0]"
                                            : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {city.label[language] || city.label.en}
                                    </span>
                                    {formData.city === city.id && (
                                        <Check className="w-4 h-4 text-[#009de0] ms-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="relative">
                            <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <span className="absolute start-12 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+972</span>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder={t.phonePlaceholder}
                                className="w-full h-14 ps-24 pe-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] transition-all text-lg"
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
                    alt="Professional at work"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    <Logo size="lg" />

                    <div className="max-w-lg">
                        <h2 className="text-5xl font-black leading-tight mb-4">
                            {language === 'he' ? 'צמיח את העסק' : 'Grow your business'}
                        </h2>
                        <p className="text-xl text-white/80">
                            {language === 'he' ? 'הצטרף ל-500+ מקצוענים' : 'Join 500+ professionals'}
                        </p>
                    </div>

                    <p className="text-white/60 text-sm">© 2024 Talentr</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-[#009de0] dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-end p-4">
                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-white/90 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <span className="text-lg">{currentLang.flag}</span>
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
                                        className="absolute end-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-1 z-50"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full px-3 py-2.5 text-start flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700",
                                                    language === lang.code ? 'text-[#009de0]' : 'text-gray-700 dark:text-gray-300'
                                                )}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
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
                <div className="px-4 py-3">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    {/* Step indicators */}
                    <div className="flex justify-between mt-3">
                        {[0, 1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                    step < currentStep
                                        ? "bg-green-500 text-white"
                                        : step === currentStep
                                            ? "bg-white text-[#009de0]"
                                            : "bg-white/20 text-white/50"
                                )}
                            >
                                {step < currentStep ? <Check className="w-3 h-3" /> : step + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 shadow-2xl">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-6 max-w-md mx-auto">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    {t.back}
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-[#009de0] text-white font-bold rounded-xl hover:bg-[#008acc] transition-colors",
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
                    {language === 'he' ? 'כבר שותף?' : 'Already a partner?'}{' '}
                    <Link href="/signin" className="text-white font-semibold hover:underline">
                        {language === 'he' ? 'התחבר' : 'Sign in'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
