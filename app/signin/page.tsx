'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SignInPage() {
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const lang = language as 'en' | 'he';
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const content = {
        en: {
            title: 'Welcome back',
            subtitle: 'Sign in to your account',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
            noAccount: "Don't have an account?",
            signUp: 'Sign up',
            forgotPassword: 'Forgot password?',
        },
        he: {
            title: 'ברוך שובך',
            subtitle: 'התחבר לחשבון שלך',
            email: 'אימייל',
            password: 'סיסמה',
            signIn: 'התחבר',
            noAccount: 'אין לך חשבון?',
            signUp: 'הירשם',
            forgotPassword: 'שכחת סיסמה?',
        },
    };

    const t = content[lang];

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!supabase) throw new Error('Auth service unavailable');
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black transition-colors" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Language Switcher */}
            <div className="absolute top-4 end-4 z-20">
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
                                                language === lang.code ? 'text-blue-500' : 'text-zinc-600 dark:text-zinc-300'
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

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex justify-center mb-8">
                        <Logo size="lg" />
                    </Link>

                    {/* Sign In Card */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-black/5 dark:shadow-black/50">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.title}</h2>
                            <p className="text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignIn} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    {t.email}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                    {t.password}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-12 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 hover:underline">
                                    {t.forgotPassword}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : (
                                    t.signIn
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                            {t.noAccount}{' '}
                            <Link href="/signup" className="text-blue-500 font-semibold hover:text-blue-400 hover:underline">
                                {t.signUp}
                            </Link>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-sm transition-colors">
                            ← {lang === 'he' ? 'חזור לדף הבית' : 'Back to home'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
