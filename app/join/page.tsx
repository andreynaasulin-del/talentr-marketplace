'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Globe, ChevronDown, User, Mail, Lock, Phone, MapPin, Briefcase, Link as LinkIcon, ArrowRight, Star, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function JoinPage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [showLangDropdown, setShowLangDropdown] = useState(false);
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
        portfolio: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError('');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Register user with Supabase
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

            // Insert vendor profile
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
                // Show actual error for debugging
                const errorDetail = vendorError.message || vendorError.code || JSON.stringify(vendorError);
                setError(`Error: ${errorDetail}`);
                setLoading(false);
                return;
            }

            // Wait for session to be fully established
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Force redirect to dashboard
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

    const benefits = [
        { icon: DollarSign, title: 'Guaranteed Payments', desc: 'Get paid on time, every time' },
        { icon: Calendar, title: 'Manage Bookings', desc: 'Easy calendar & availability' },
        { icon: Star, title: 'Build Reputation', desc: 'Reviews boost your profile' },
    ];

    const categories = [
        'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
        'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
        'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
    ];

    const cities = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'];

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
                    quality={85}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    {/* Logo */}
                    <Link href="/" className="text-3xl font-bold">
                        talent<span className="text-white/80">r</span>
                    </Link>

                    {/* Main Content */}
                    <div className="max-w-lg">
                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            {t('growBusiness')}
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Join 500+ professionals already earning on Talentr
                        </p>

                        {/* Benefits */}
                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <benefit.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{benefit.title}</p>
                                        <p className="text-white/70">{benefit.desc}</p>
                                    </div>
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
            <div className="w-full lg:w-1/2 flex items-start justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-lg py-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <Link href="/" className="text-2xl font-bold">
                            talent<span className="text-gradient">r</span>
                        </Link>

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
                    <div className="hidden lg:flex justify-end mb-6">
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
                            {t('joinTitle')}
                        </h1>
                        <p className="text-gray-500">
                            {t('joinSubtitle')}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl animate-scale-in">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                            <p className="mt-1 text-xs text-gray-500">{t('atLeast6chars')}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('fullNameLabel')} <span className="text-red-500">*</span>
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
                                    disabled={loading}
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('emailLabel')} <span className="text-red-500">*</span>
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
                                    disabled={loading}
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('passwordLabel')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('serviceCategoryLabel')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full h-14 pl-12 pr-10 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none disabled:opacity-50"
                                    >
                                        <option value="">{t('selectCategory')}</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('baseCityLabel')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full h-14 pl-12 pr-10 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none disabled:opacity-50"
                                    >
                                        <option value="">{t('selectCity')}</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('phoneLabel')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+972</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full h-14 pl-24 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
                                    placeholder="50-123-4567"
                                />
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div>
                            <label htmlFor="portfolio" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('portfolioLabel')}
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="url"
                                    id="portfolio"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
                                    placeholder={t('portfolioPlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('creatingAccount')}
                                </>
                            ) : (
                                <>
                                    {t('createAccountBtn')}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-500 mt-8">
                        {t('alreadyPartner')}{' '}
                        <Link href="/signin" className="text-blue-600 font-semibold hover:underline">
                            {t('signInLink')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
