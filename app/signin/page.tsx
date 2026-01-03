'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ChevronDown, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

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
    const [error, setError] = useState<string | null>(null);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!supabase) throw new Error('Auth service unavailable. Please try again later.');
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            if (!supabase) throw new Error('Auth service unavailable. Please try again later.');
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Left Side - Visual/Marketing (Desktop only) */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Logo size="xl" className="mb-8" asLink={false} />
                        <h2 className="text-4xl font-black text-white leading-tight mb-6">
                            Manage your professional <br />
                            <span className="text-cyan-400">career with ease.</span>
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                    <Zap className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Fast Bookings</h4>
                                    <p className="text-slate-400 text-sm">Receive and manage requests in real-time.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Secure Payments</h4>
                                    <p className="text-slate-400 text-sm">Protected transactions for every event.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex flex-col p-6 md:p-12 lg:p-20 items-center justify-center relative">
                {/* Mobile Background */}
                <div className="md:hidden absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="w-full max-w-md">
                    {/* Header with Language Switcher */}
                    <div className="flex items-center justify-between mb-12">
                        <Logo size="lg" className="md:hidden" />
                        <div className="relative ms-auto">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors text-sm"
                            >
                                <span>{currentLang.flag}</span>
                                <span>{currentLang.label}</span>
                                <ChevronDown className={cn("w-3 h-3 transition-transform", showLangDropdown && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {showLangDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute end-0 mt-2 w-32 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                                    >
                                        {languages.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => {
                                                    setLanguage(l.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-2 text-start text-sm hover:bg-white/5 transition-colors",
                                                    language === l.code ? "text-cyan-400 font-bold" : "text-white/70"
                                                )}
                                            >
                                                {l.flag} {l.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-white mb-2">{t('welcomeBack')}</h1>
                        <p className="text-slate-400">{t('signInSubtitle')}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailSignIn} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/70 ms-1">{t('emailLabel')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-white/10"
                                    placeholder={t('emailPlaceholder')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ms-1">
                                <label className="text-sm font-bold text-white/70">{t('passwordLabel')}</label>
                                <button type="button" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                                    {t('forgotPassword')}
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-white/10"
                                    placeholder={t('passwordPlaceholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                        >
                            {loading ? t('signingIn') : t('signInBtn')}
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-bold">
                            <span className="bg-slate-950 px-4 text-white/30">{t('orDivider')}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full mt-8 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.76 1.85-1.58 2.42v2.81h2.55c1.49-2.37 2.35-5.87 2.35-9.48z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        {t('googleBtn')}
                    </button>

                    <p className="mt-10 text-center text-slate-400 font-medium">
                        {t('noAccount')}{' '}
                        <Link href="/signup" className="text-cyan-400 font-bold hover:text-cyan-300">
                            {t('signUpLink')}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
