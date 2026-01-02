'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ChevronDown, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SignInPage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            if (data.user) {
                const role = data.user.user_metadata?.role;
                if (role === 'vendor') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
            setError(errorMessage);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    return (
        <div className="min-h-screen flex" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Left Side - Wolt Blue */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#009de0]">
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    {/* Logo */}
                    <Link href="/" dir="ltr" className="text-3xl font-black">
                        talent<span className="text-white/80">r</span>
                    </Link>

                    {/* Main Content */}
                    <div className="max-w-md">
                        <h2 className="text-5xl font-black leading-tight mb-6">
                            {language === 'he' ? 'ברוכים הבאים' : 'Welcome back'}
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            {language === 'he' 
                                ? 'התחברו ומצאו את הכישרון המושלם לאירוע שלכם'
                                : 'Sign in and find the perfect talent for your event'
                            }
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/90">{language === 'he' ? 'מאובטח ובטוח' : 'Secure & Safe'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/90">{language === 'he' ? 'אישור מיידי' : 'Instant Booking'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/90">{language === 'he' ? '500+ מקצוענים' : '500+ Professionals'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-white/60 text-sm">
                        © 2024 Talentr
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-slate-900">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" dir="ltr" className="text-2xl font-black text-gray-900 dark:text-white">
                            talent<span className="text-[#009de0]">r</span>
                        </Link>

                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <span className="text-lg">{currentLang.flag}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLangDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                                    <div className="absolute end-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-50">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={`w-full px-3 py-2.5 text-start flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 ${language === lang.code ? 'text-[#009de0]' : 'text-gray-700 dark:text-gray-300'}`}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span className="font-medium">{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                            {t('signInTitle')}
                        </h1>
                        <p className="text-gray-500">
                            {t('signInSubtitle')}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full h-14 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-slate-500 transition-all flex items-center justify-center gap-3 mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t('googleBtn')}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-gray-400">{t('orDivider')}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {t('emailLabel')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-14 ps-12 pe-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] focus:bg-white dark:focus:bg-slate-700 transition-all"
                                    placeholder={t('emailPlaceholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {t('passwordLabel')}
                                </label>
                                <Link href="#" className="text-sm text-[#009de0] font-medium">
                                    {t('forgotPassword')}
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-14 ps-12 pe-12 bg-gray-50 dark:bg-slate-800 border-2 border-transparent rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#009de0] focus:bg-white dark:focus:bg-slate-700 transition-all"
                                    placeholder={t('passwordPlaceholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#009de0] hover:bg-[#008acc] text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('signingIn') : t('signInBtn')}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-3">
                        <p className="text-gray-500">
                            {t('noAccount')}{' '}
                            <Link href="/signup" className="text-[#009de0] font-semibold hover:underline">
                                {t('signUpLink')}
                            </Link>
                        </p>
                        <p className="text-sm text-gray-400">
                            {t('vendorLinkText')}{' '}
                            <Link href="/join" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#009de0]">
                                {t('joinVendorLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
