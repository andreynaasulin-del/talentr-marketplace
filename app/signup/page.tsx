'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Globe, ChevronDown, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SignUpPage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
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
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: 'client',
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError('');
    };

    const languages = [
        { code: 'en' as const, label: 'English', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עברית', flag: '🇮🇱' },
        { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    const benefits = [
        'Access to 500+ verified professionals',
        'Secure payments with money-back guarantee',
        'Instant booking confirmation',
        'Dedicated customer support',
    ];

    return (
        <div className="min-h-screen flex" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Left Side - Benefits */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gray-900" />

                {/* Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Subtle Orbs */}
                <div className="absolute top-32 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    {/* Logo */}
                    <Link href="/" className="text-3xl font-bold">
                        talent<span className="text-white/80">r</span>
                    </Link>

                    {/* Main Content */}
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Join 10,000+ Happy Clients
                        </div>

                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            Find your perfect event professional
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Create a free account and start booking the best talent for your events.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-white/90">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-white/60 text-sm">
                        © 2024 Talentr. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <Link href="/" className="text-2xl font-bold">
                            talent<span className="text-gradient">r</span>
                        </Link>

                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <ChevronDown className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLangDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-scale-in">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 ${language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                            >
                                                <span>{lang.flag}</span>
                                                <span className="font-medium">{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Desktop Language Switcher */}
                    <div className="hidden lg:flex justify-end mb-8">
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <span>{currentLang.flag}</span>
                                <span>{currentLang.label}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLangDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-scale-in">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 ${language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                            >
                                                <span>{lang.flag}</span>
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
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {t('createAccountTitle')}
                        </h1>
                        <p className="text-gray-500">
                            {t('signUpSubtitle')}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-scale-in">
                            {error}
                        </div>
                    )}

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 mb-6"
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
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400">{t('orDivider')}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('fullNameLabel')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('emailLabel')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('passwordLabel')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full h-14 pl-12 pr-12 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    placeholder="Minimum 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('creatingAccount') : t('createAccountBtn')}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center space-y-3">
                        <p className="text-gray-500">
                            {t('alreadyHaveAccount')}{' '}
                            <Link href="/signin" className="text-blue-600 font-semibold hover:underline">
                                {t('signInLink')}
                            </Link>
                        </p>
                        <p className="text-sm text-gray-400">
                            {t('vendorLinkText')}{' '}
                            <Link href="/join" className="text-gray-600 font-medium hover:text-gray-900">
                                {t('joinVendorLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
