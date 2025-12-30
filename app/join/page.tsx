'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
    id: string;
    question: {
        en: string;
        ru: string;
        he: string;
    };
    type: 'text' | 'email' | 'password' | 'select' | 'tel' | 'url';
    placeholder: {
        en: string;
        ru: string;
        he: string;
    };
    options?: string[];
    required: boolean;
    field: keyof FormData;
}

interface FormData {
    fullName: string;
    email: string;
    password: string;
    category: string;
    city: string;
    phone: string;
    portfolio: string;
}

export default function JoinPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        category: '',
        city: '',
        phone: '',
        portfolio: '',
    });
    const [currentInput, setCurrentInput] = useState('');

    const lang = language as 'en' | 'ru' | 'he';

    const categories = [
        'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
        'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
        'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
    ];

    const cities = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'];

    const steps: Step[] = [
        {
            id: 'fullName',
            question: {
                en: "What's your full name?",
                ru: 'Как вас зовут?',
                he: 'מה השם המלא שלך?',
            },
            type: 'text',
            placeholder: {
                en: 'John Doe',
                ru: 'Иван Иванов',
                he: 'ישראל ישראלי',
            },
            required: true,
            field: 'fullName',
        },
        {
            id: 'email',
            question: {
                en: "What's your email address?",
                ru: 'Какой у вас email?',
                he: 'מה כתובת האימייל שלך?',
            },
            type: 'email',
            placeholder: {
                en: 'john@example.com',
                ru: 'ivan@example.com',
                he: 'israel@example.com',
            },
            required: true,
            field: 'email',
        },
        {
            id: 'password',
            question: {
                en: 'Create a password (min. 6 characters)',
                ru: 'Создайте пароль (мин. 6 символов)',
                he: 'צור סיסמה (לפחות 6 תווים)',
            },
            type: 'password',
            placeholder: {
                en: 'Enter password',
                ru: 'Введите пароль',
                he: 'הזן סיסמה',
            },
            required: true,
            field: 'password',
        },
        {
            id: 'category',
            question: {
                en: 'What service do you provide?',
                ru: 'Какую услугу вы предоставляете?',
                he: 'איזה שירות אתה מספק?',
            },
            type: 'select',
            placeholder: {
                en: 'Select your category',
                ru: 'Выберите категорию',
                he: 'בחר קטגוריה',
            },
            options: categories,
            required: true,
            field: 'category',
        },
        {
            id: 'city',
            question: {
                en: 'Which city are you based in?',
                ru: 'В каком городе вы работаете?',
                he: 'באיזה עיר אתה נמצא?',
            },
            type: 'select',
            placeholder: {
                en: 'Select your city',
                ru: 'Выберите город',
                he: 'בחר עיר',
            },
            options: cities,
            required: true,
            field: 'city',
        },
        {
            id: 'phone',
            question: {
                en: "What's your phone number?",
                ru: 'Какой у вас номер телефона?',
                he: 'מה מספר הטלפון שלך?',
            },
            type: 'tel',
            placeholder: {
                en: '50-123-4567',
                ru: '50-123-4567',
                he: '50-123-4567',
            },
            required: true,
            field: 'phone',
        },
        {
            id: 'portfolio',
            question: {
                en: 'Portfolio or Instagram link? (optional)',
                ru: 'Ссылка на портфолио или Instagram? (опционально)',
                he: 'קישור לתיק עבודות או אינסטגרם? (אופציונלי)',
            },
            type: 'url',
            placeholder: {
                en: 'https://instagram.com/yourprofile',
                ru: 'https://instagram.com/yourprofile',
                he: 'https://instagram.com/yourprofile',
            },
            required: false,
            field: 'portfolio',
        },
    ];

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleNext = () => {
        const step = steps[currentStep];

        if (step.required && !currentInput.trim()) {
            setError(lang === 'ru' ? 'Это поле обязательно' : lang === 'he' ? 'שדה חובה' : 'This field is required');
            return;
        }

        if (step.type === 'email' && !currentInput.includes('@')) {
            setError(lang === 'ru' ? 'Введите корректный email' : lang === 'he' ? 'הזן אימייל תקין' : 'Enter a valid email');
            return;
        }

        if (step.type === 'password' && currentInput.length < 6) {
            setError(lang === 'ru' ? 'Минимум 6 символов' : lang === 'he' ? 'לפחות 6 תווים' : 'Minimum 6 characters');
            return;
        }

        setFormData(prev => ({ ...prev, [step.field]: currentInput }));
        setError('');
        setCurrentInput('');

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
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
            if (!authData.user) throw new Error('Failed to create user account');

            const { error: vendorError } = await supabase.from('vendors').insert([
                {
                    id: authData.user.id,
                    full_name: formData.fullName,
                    email: formData.email,
                    category: formData.category,
                    city: formData.city,
                    phone: formData.phone.startsWith('972') ? formData.phone : `972${formData.phone.replace(/^0/, '')}`,
                    avatar_url: formData.portfolio || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                    price_from: 1000,
                    rating: 0,
                    reviews_count: 0,
                    bio: '',
                    portfolio_gallery: [],
                },
            ]);

            if (vendorError) {
                console.error('Vendor creation error:', vendorError);
                throw new Error(vendorError.message);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = '/dashboard';
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || (language === 'ru'
                ? 'Ошибка регистрации'
                : language === 'he'
                    ? 'שגיאה בהרשמה'
                    : 'Registration error'));
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            e.preventDefault();
            handleNext();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Logo */}
                <Link href="/" className="block text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        talent<span className="text-white/80">r</span>
                    </h1>
                </Link>

                {/* Main Card */}
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-100">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Step Counter */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                <p className="text-sm font-medium text-gray-600">
                                    {lang === 'ru' ? 'Шаг' : lang === 'he' ? 'שלב' : 'Step'} {currentStep + 1} {lang === 'ru' ? 'из' : lang === 'he' ? 'מתוך' : 'of'} {steps.length}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
                        </div>

                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                                    {currentStepData.question[lang]}
                                </h2>

                                {/* Input Field */}
                                {currentStepData.type === 'select' ? (
                                    <div className="space-y-3">
                                        {currentStepData.options?.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setCurrentInput(option);
                                                    setTimeout(() => {
                                                        setFormData(prev => ({ ...prev, [currentStepData.field]: option }));
                                                        setError('');
                                                        setCurrentInput('');
                                                        if (currentStep < steps.length - 1) {
                                                            setCurrentStep(prev => prev + 1);
                                                        } else {
                                                            handleSubmit();
                                                        }
                                                    }, 150);
                                                }}
                                                className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 hover:border-blue-500 border-2 border-transparent rounded-xl transition-all font-medium text-gray-900"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative">
                                            <input
                                                type={currentStepData.type}
                                                value={currentInput}
                                                onChange={(e) => {
                                                    setCurrentInput(e.target.value);
                                                    setError('');
                                                }}
                                                onKeyPress={handleKeyPress}
                                                placeholder={currentStepData.placeholder[lang]}
                                                disabled={loading}
                                                autoFocus
                                                className="w-full h-16 px-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
                                                style={{ fontSize: '16px' }}
                                            />
                                            {currentStepData.type === 'tel' && (
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+972 </span>
                                            )}
                                        </div>

                                        {/* Error Message */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="mt-2 text-sm text-red-600"
                                                >
                                                    {error}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>

                                        {/* Navigation Buttons */}
                                        <div className="flex gap-3 mt-8">
                                            {currentStep > 0 && (
                                                <button
                                                    onClick={() => {
                                                        setCurrentStep(prev => prev - 1);
                                                        setCurrentInput('');
                                                        setError('');
                                                    }}
                                                    disabled={loading}
                                                    className="px-6 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    {lang === 'ru' ? 'Назад' : lang === 'he' ? 'חזור' : 'Back'}
                                                </button>
                                            )}
                                            <button
                                                onClick={handleNext}
                                                disabled={loading}
                                                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        {lang === 'ru' ? 'Создание...' : lang === 'he' ? 'יוצר...' : 'Creating...'}
                                                    </>
                                                ) : currentStep === steps.length - 1 ? (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        {lang === 'ru' ? 'Завершить' : lang === 'he' ? 'סיים' : 'Complete'}
                                                    </>
                                                ) : (
                                                    <>
                                                        {lang === 'ru' ? 'Продолжить' : lang === 'he' ? 'המשך' : 'Continue'}
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all ${
                                        index === currentStep
                                            ? 'w-8 bg-blue-600'
                                            : index < currentStep
                                                ? 'w-2 bg-green-500'
                                                : 'w-2 bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-white/80 mt-6">
                    {lang === 'ru' ? 'Уже зарегистрированы?' : lang === 'he' ? 'כבר רשום?' : 'Already registered?'}{' '}
                    <Link href="/signin" className="font-semibold text-white hover:underline">
                        {lang === 'ru' ? 'Войти' : lang === 'he' ? 'התחבר' : 'Sign in'}
                    </Link>
                </p>
            </div>
        </div>
    );
}
