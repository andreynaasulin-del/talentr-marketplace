'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';


export default function VendorRecoverPage() {
    const { language: lang } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const t = {
        title: lang === 'he' ? 'שחזור גישה לחשבון' : 'Recover Account Access',
        subtitle: lang === 'he'
            ? 'הזן את כתובת האימייל שלך ונשלח לך קישור לכניסה'
            : 'Enter your email and we\'ll send you a login link',
        emailPlaceholder: lang === 'he' ? 'האימייל שלך' : 'Your email',
        sendButton: lang === 'he' ? 'שלח קישור' : 'Send Link',
        sending: lang === 'he' ? 'שולח...' : 'Sending...',
        successTitle: lang === 'he' ? 'נשלח בהצלחה!' : 'Sent Successfully!',
        successMessage: lang === 'he'
            ? 'אם האימייל רשום במערכת, תקבל קישור לכניסה תוך מספר דקות'
            : 'If this email is registered, you\'ll receive a login link shortly',
        backToHome: lang === 'he' ? 'חזרה לדף הבית' : 'Back to Home',
        checkSpam: lang === 'he' ? 'לא קיבלת? בדוק בתיקיית הספאם' : 'Didn\'t receive it? Check your spam folder',
        errorMessage: lang === 'he' ? 'אירעה שגיאה, נסה שוב' : 'An error occurred, please try again'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/vendor/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await res.json();

            if (res.ok) {
                setSent(true);
            } else {
                setError(data.error || t.errorMessage);
            }
        } catch {
            setError(t.errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <Navbar />

            <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {!sent ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl">
                                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-2">
                                {t.title}
                            </h1>
                            <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">
                                {t.subtitle}
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    placeholder={t.emailPlaceholder}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    dir="ltr"
                                />

                                {error && (
                                    <p className="text-sm text-red-500 text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t.sending}
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            {t.sendButton}
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back link */}
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 mt-6 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t.backToHome}
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full"
                                >
                                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </motion.div>
                            </div>

                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                {t.successTitle}
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                                {t.successMessage}
                            </p>
                            <p className="text-sm text-zinc-400 mb-8">
                                {t.checkSpam}
                            </p>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t.backToHome}
                            </Link>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
