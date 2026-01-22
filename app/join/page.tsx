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
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countryCode, setCountryCode] = useState('+972');
    const [currentStep, setCurrentStep] = useState<Step>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const countryCodes = [
        { code: '+972', label: 'Israel', flag: '🇮🇱' },
        { code: '+1', label: 'USA', flag: '🇺🇸' },
        { code: '+44', label: 'UK', flag: '🇬🇧' },
        { code: '+971', label: 'UAE', flag: '🇦🇪' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];
    const currentCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];

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
        { id: 'MC', icon: '🎤', label: { en: 'MC / Host', he: 'מנחה אירועים' } },
        { id: 'Magician', icon: '🎩', label: { en: 'Magician', he: 'קוסם' } },
        { id: 'Singer', icon: '🎵', label: { en: 'Singer', he: 'זמר' } },
        { id: 'Musician', icon: '🎸', label: { en: 'Musician', he: 'מוזיקאי' } },
        { id: 'Bartender', icon: '🍸', label: { en: 'Bartender', he: 'ברמן' } },
        { id: 'Event Decor', icon: '🎨', label: { en: 'Event Decor', he: 'עיצוב אירועים' } },
        { id: 'Kids Animator', icon: '🎈', label: { en: 'Kids', he: 'מפעיל לילדים' } },
        { id: 'Chef', icon: '👨‍🍳', label: { en: 'Chef', he: 'שף' } },
        { id: 'Dancer', icon: '💃', label: { en: 'Dancer', he: 'רקדן' } },
    ];

    const cities = [
        { id: 'Tel Aviv', label: { en: 'Tel Aviv', he: 'תל אביב' } },
        { id: 'Jerusalem', label: { en: 'Jerusalem', he: 'ירושלים' } },
        { id: 'Haifa', label: { en: 'Haifa', he: 'חיפה' } },
        { id: 'Eilat', label: { en: 'Eilat', he: 'אילת' } },
        { id: 'Rishon LeZion', label: { en: 'Rishon', he: 'ראשון לציון' } },
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
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    setError(language === 'he' ? 'אימייל לא תקין' : 'Invalid email address');
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
                const phoneDigits = formData.phone.replace(/\D/g, ''); // Remove non-digits

                // Basic length check (most international numbers are 8-15 digits)
                if (phoneDigits.length < 8) {
                    setError(language === 'he' ? 'מספר טלפון קצר מדי' : 'Phone number too short');
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

    const handleRegister = async (skipPhone = false) => {
        setLoading(true);
        setError('');
        try {
            if (!supabase) throw new Error(language === 'he' ? 'שירות האימות לא זמין כרגע' : 'Auth service unavailable right now');

            let fullPhone = null;

            if (!skipPhone) {
                // Sanitize phone: remove non-digits, remove leading zero (e.g. 050 -> 50)
                const cleanPhone = formData.phone.replace(/\D/g, '').replace(/^0+/, '');
                // Result: +972501234567
                fullPhone = `${countryCode}${cleanPhone}`;
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: fullPhone,
                    },
                },
            });

            if (authError) throw new Error(authError.message);
            if (!authData.user) throw new Error('Failed to create user');

            // Generate UUID for the vendor ID to avoid "null value in column id" error
            const newVendorId = crypto.randomUUID();

            const { error: vendorError } = await supabase.from('vendors').insert([{
                id: newVendorId,
                user_id: authData.user.id,
                full_name: formData.fullName,
                email: formData.email,
                category: formData.category,
                city: formData.city,
                phone: fullPhone, // can be null
                avatar_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                price_from: 1000,
            }]);

            if (vendorError) throw vendorError;

            window.location.href = '/dashboard';

        } catch (err: any) {
            console.error('Registration error details:', err);

            let errorMessage = err.message || 'An unexpected error occurred';

            // Handle specific Supabase/Postgres errors
            if (err.code === '23505') {
                errorMessage = language === 'he' ? 'דוא״ל או טלפון זה כבר רשום במערכת' : 'This email or phone is already registered';
            } else if (errorMessage === 'Error') {
                errorMessage = language === 'he' ? 'שגיאה ביצירת חשבון' : 'Failed to create account';
            }

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
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-1">
                        {stepInfo.title}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        {stepInfo.subtitle}
                    </p>
                </div>

                {/* Input based on step */}
                <div className="max-w-md mx-auto">
                    {currentStep === 0 && (
                        <div className="relative">
                            <User className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder={t.namePlaceholder}
                                className="w-full h-14 ps-12 pe-4 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-600 transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="relative">
                            <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t.emailPlaceholder}
                                className="w-full h-14 ps-12 pe-4 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-600 transition-all text-lg"
                                autoFocus
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="relative">
                            <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={t.passwordPlaceholder}
                                className="w-full h-14 ps-12 pe-4 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-600 transition-all text-lg"
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
                                            ? "border-blue-600 bg-blue-600/10"
                                            : "border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className={cn(
                                        "text-xs font-medium text-center",
                                        formData.category === cat.id
                                            ? "text-blue-500"
                                            : "text-zinc-600 dark:text-zinc-400"
                                    )}>
                                        {cat.label[language] || cat.label.en}
                                    </span>
                                    {formData.category === cat.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -end-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                            {/* Another Category Option */}
                            <button
                                onClick={() => setFormData({ ...formData, category: 'Other' })}
                                className={cn(
                                    "relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                                    formData.category === 'Other'
                                        ? "border-blue-600 bg-blue-600/10"
                                        : "border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                <span className="text-2xl">✨</span>
                                <span className={cn(
                                    "text-xs font-medium text-center",
                                    formData.category === 'Other'
                                        ? "text-blue-500"
                                        : "text-zinc-600 dark:text-zinc-400"
                                )}>
                                    {language === 'he' ? 'אחר' : 'Another'}
                                </span>
                                {formData.category === 'Other' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -end-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                )}
                            </button>
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
                                            ? "border-blue-600 bg-blue-600/10"
                                            : "border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    <MapPin className={cn(
                                        "w-4 h-4",
                                        formData.city === city.id ? "text-blue-500" : "text-zinc-500"
                                    )} />
                                    <span className={cn(
                                        "font-medium text-sm",
                                        formData.city === city.id
                                            ? "text-blue-500"
                                            : "text-zinc-600 dark:text-zinc-400"
                                    )}>
                                        {city.label[language] || city.label.en}
                                    </span>
                                    {formData.city === city.id && (
                                        <Check className="w-4 h-4 text-blue-500 ms-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div className="relative flex gap-2">
                                {/* Country Code Dropdown */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="h-14 px-3 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-2xl flex items-center gap-2 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all text-zinc-900 dark:text-white"
                                    >
                                        <span className="text-lg">{currentCountry.flag}</span>
                                        <span className="font-medium text-zinc-900 dark:text-white">{currentCountry.code}</span>
                                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    </button>

                                    <AnimatePresence>
                                        {showCountryDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowCountryDropdown(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute start-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/50 py-1 z-50 border-2 border-zinc-200 dark:border-zinc-800"
                                                >
                                                    {countryCodes.map((country) => (
                                                        <button
                                                            key={country.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setCountryCode(country.code);
                                                                setShowCountryDropdown(false);
                                                            }}
                                                            className={cn(
                                                                "w-full px-3 py-2.5 text-start flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                                                                countryCode === country.code ? 'bg-blue-600/10 text-blue-500' : 'text-zinc-700 dark:text-zinc-300'
                                                            )}
                                                        >
                                                            <span className="text-lg">{country.flag}</span>
                                                            <span className="font-medium">{country.code}</span>
                                                            <span className="text-sm opacity-60">{country.label}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Phone Input */}
                                <div className="relative flex-1">
                                    <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder={t.phonePlaceholder}
                                        className="w-full h-14 ps-12 pe-4 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-600 transition-all text-lg"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Skip Button */}
                            <button
                                type="button"
                                onClick={() => handleRegister(true)} // pass true to skip phone
                                className="w-full py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                {language === 'he' ? 'הוסף אחר כך (דלג)' : 'Skip and add later'}
                            </button>
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

                    <div />
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-black transition-colors">
                {/* Header */}
                <div className="flex items-center justify-end p-4">
                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-zinc-700 dark:text-white/90 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl transition-colors"
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
                                        className="absolute end-0 mt-2 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/50 py-1 z-50 border border-zinc-200 dark:border-zinc-800"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full px-3 py-2.5 text-start flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                                                    language === lang.code ? 'text-blue-500' : 'text-zinc-700 dark:text-zinc-300'
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
                    <div className="h-2 bg-zinc-200 dark:bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600 dark:bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    {/* Step indicators */}
                    <div className="flex justify-between mt-4">
                        {[0, 1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-lg",
                                    step < currentStep
                                        ? "bg-blue-600 text-white"
                                        : step === currentStep
                                            ? "bg-blue-600 dark:bg-white text-white dark:text-blue-600 scale-110"
                                            : "bg-zinc-200 dark:bg-white/10 text-zinc-400 dark:text-white/30"
                                )}
                            >
                                {step < currentStep ? <Check className="w-4 h-4" /> : step + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black/5 dark:shadow-black/50">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-6 max-w-md mx-auto">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors border border-zinc-300 dark:border-zinc-700"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    {t.back}
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20",
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
                <div className="p-4 text-center text-sm text-zinc-500 dark:text-white/70">
                    {language === 'he' ? 'כבר שותף?' : 'Already a partner?'}{' '}
                    <Link href="/signin" className="text-zinc-900 dark:text-white font-semibold hover:underline">
                        {language === 'he' ? 'התחבר' : 'Sign in'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
