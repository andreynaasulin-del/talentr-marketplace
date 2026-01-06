'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SignInPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

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
        <div className="min-h-screen relative overflow-hidden">
            {/* Same gradient background as homepage */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-100"
                    style={{
                        background: `
                            radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 0%),
                            radial-gradient(at 97% 21%, hsla(195, 100%, 50%, 1) 0px, transparent 50%),
                            radial-gradient(at 52% 99%, hsla(196, 100%, 57%, 1) 0px, transparent 50%),
                            radial-gradient(at 10% 29%, hsla(195, 100%, 39%, 1) 0px, transparent 50%),
                            radial-gradient(at 97% 96%, hsla(195, 84%, 45%, 1) 0px, transparent 50%),
                            radial-gradient(at 33% 50%, hsla(195, 100%, 50%, 1) 0px, transparent 50%),
                            radial-gradient(at 79% 53%, hsla(196, 100%, 48%, 1) 0px, transparent 50%)
                        `,
                    }}
                />
            </div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Brand */}
                    <Link href="/" className="block text-center mb-8">
                        <h1 className="text-4xl font-black text-white">talentr</h1>
                    </Link>

                    {/* Sign In Card */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
                            <p className="text-gray-600">{t.subtitle}</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignIn} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.email}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de0] focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.password}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de0] focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <Link href="/forgot-password" className="text-sm text-[#009de0] hover:underline">
                                    {t.forgotPassword}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#009de0] text-white font-bold rounded-lg hover:bg-[#0088cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : (
                                    t.signIn
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            {t.noAccount}{' '}
                            <Link href="/signup" className="text-[#009de0] font-semibold hover:underline">
                                {t.signUp}
                            </Link>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-white/80 hover:text-white text-sm">
                            ← {lang === 'he' ? 'חזור לדף הבית' : 'Back to home'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
