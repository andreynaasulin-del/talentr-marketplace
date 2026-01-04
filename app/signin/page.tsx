'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ChevronDown, Shield, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import BlueAmbientBackground from '@/components/BlueAmbientBackground';

// Animation variants for staggered entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const floatVariants = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

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
        <main className="min-h-screen relative overflow-hidden flex flex-col md:flex-row">
            <BlueAmbientBackground />

            {/* Left Side - Visual/Marketing (Desktop only) */}
            <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-12 overflow-hidden border-r border-white/10 bg-white/5 backdrop-blur-xl">
                {/* Floating orbs */}
                <motion.div
                    className="absolute top-20 right-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"
                    variants={floatVariants}
                    initial="initial"
                    animate="animate"
                />
                <motion.div
                    className="absolute bottom-32 left-16 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl"
                    variants={floatVariants}
                    initial="initial"
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"
                    variants={floatVariants}
                    initial="initial"
                    animate="animate"
                    style={{ animationDelay: '4s' }}
                />

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <Logo size="xl" className="mb-8" asLink={false} />
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl font-black text-white leading-tight mb-6"
                        >
                            Manage your professional <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                career with ease.
                            </span>
                        </motion.h2>

                        <motion.div variants={itemVariants} className="space-y-6">
                            <motion.div
                                className="flex items-start gap-4 group"
                                whileHover={{ x: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 group-hover:border-cyan-400/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-500">
                                    <Zap className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Fast Bookings</h4>
                                    <p className="text-slate-400 text-sm">Receive and manage requests in real-time.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start gap-4 group"
                                whileHover={{ x: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 group-hover:border-emerald-400/40 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-500">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Secure Payments</h4>
                                    <p className="text-slate-400 text-sm">Protected transactions for every event.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start gap-4 group"
                                whileHover={{ x: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center flex-shrink-0 border border-purple-500/20 group-hover:border-purple-400/40 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-500">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">AI Matching</h4>
                                    <p className="text-slate-400 text-sm">Smart recommendations for your perfect event.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="relative w-full md:w-1/2 flex flex-col p-6 md:p-12 lg:p-20 items-center justify-center">
                <motion.div
                    className="w-full max-w-md"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header with Language Switcher */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-12">
                        <Logo size="lg" className="md:hidden" />
                        <div className="relative ms-auto">
                            <motion.button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>{currentLang.flag}</span>
                                <span className="font-bold">{currentLang.label}</span>
                                <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", showLangDropdown && "rotate-180")} />
                            </motion.button>

                            <AnimatePresence>
                                {showLangDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute end-0 mt-2 w-32 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                                    >
                                        {languages.map((l) => (
                                            <motion.button
                                                key={l.code}
                                                onClick={() => {
                                                    setLanguage(l.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-2.5 text-start text-sm transition-colors",
                                                    language === l.code ? "text-cyan-400 font-bold bg-cyan-500/10" : "text-white/70 hover:bg-white/5"
                                                )}
                                                whileHover={{ x: 5 }}
                                            >
                                                {l.flag} {l.label}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t('welcomeBack')}</h1>
                        <p className="text-slate-400 text-lg">{t('signInSubtitle')}</p>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleEmailSignIn} className="space-y-5">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-bold text-white/70 ms-1">{t('emailLabel')}</label>
                            <motion.div
                                className="relative group"
                                whileFocus={{ scale: 1.02 }}
                            >
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-white/30"
                                    placeholder={t('emailPlaceholder')}
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <div className="flex items-center justify-between ms-1">
                                <label className="text-sm font-bold text-white/70">{t('passwordLabel')}</label>
                                <motion.button
                                    type="button"
                                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('forgotPassword')}
                                </motion.button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-white/30"
                                    placeholder={t('passwordPlaceholder')}
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl disabled:opacity-50 relative overflow-hidden group"
                                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Shimmer effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative">{loading ? t('signingIn') : t('signInBtn')}</span>
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-bold">
                            <span className="bg-slate-950 px-4 text-white/30">{t('orDivider')}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.button
                            onClick={handleGoogleSignIn}
                            className="w-full mt-8 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 group"
                            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
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
                            </motion.svg>
                            {t('googleBtn')}
                        </motion.button>
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="mt-10 text-center text-slate-400 font-medium"
                    >
                        {t('noAccount')}{' '}
                        <Link href="/signup" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all">
                            {t('signUpLink')}
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
}
