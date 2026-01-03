'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { packages } from '@/lib/gigs';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Check, Calendar, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function PackageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const pkg = packages.find(p => p.id === params.id);

    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        location: '',
        email: '',
        date: '',
        time: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const content = {
        en: {
            back: 'Back',
            duration: 'Duration',
            min: 'min',
            guests: 'Max Guests',
            price: 'Fixed Price',
            nis: '₪',
            includes: 'What\'s Included',
            talent: 'Your Artist',
            bookNow: 'Book This Package',
            formTitle: 'Quick Booking',
            formSubtitle: 'No registration required. Just 3 fields.',
            name: 'Your Name',
            whatsapp: 'WhatsApp Number',
            location: 'Event Location',
            email: 'Email (optional)',
            date: 'Preferred Date',
            time: 'Preferred Time',
            submit: 'Send Booking Request',
            success: 'Request sent! Our coordinator will contact you within 15 minutes.',
            notFound: 'Package not found',
        },
        he: {
            back: 'חזרה',
            duration: 'משך',
            min: 'דק׳',
            guests: 'מקסימום אורחים',
            price: 'מחיר קבוע',
            nis: '₪',
            includes: 'מה כלול',
            talent: 'האמן שלך',
            bookNow: 'הזמן חבילה זו',
            formTitle: 'הזמנה מהירה',
            formSubtitle: 'ללא הרשמה. רק 3 שדות.',
            name: 'שמך',
            whatsapp: 'מספר WhatsApp',
            location: 'מיקום האירוע',
            email: 'אימייל (אופציונלי)',
            date: 'תאריך מועדף',
            time: 'שעה מועדפת',
            submit: 'שלח בקשת הזמנה',
            success: 'הבקשה נשלחה! המתאם שלנו יצור איתך קשר תוך 15 דקות.',
            notFound: 'חבילה לא נמצאה',
        },
    };

    const t = content[lang];

    if (!pkg) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/50 text-lg mb-4">{t.notFound}</p>
                    <Link href="/" className="text-white underline hover:no-underline">
                        {t.back}
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.whatsapp || !formData.location) {
            toast.error(lang === 'he' ? 'אנא מלא את כל השדות הנדרשים' : 'Please fill all required fields');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success(t.success);
        setIsSubmitting(false);

        // In real app, send to API and redirect
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <Link 
                        href="/#packages" 
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">{t.back}</span>
                    </Link>
                </div>
            </header>

            <main className="pt-20 pb-16">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Package Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Image */}
                            <div className="relative aspect-square rounded-3xl overflow-hidden mb-6">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title[lang]}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute top-4 start-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-900">
                                    {pkg.category}
                                </div>
                            </div>

                            {/* Title & Description */}
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                                {pkg.title[lang]}
                            </h1>
                            <p className="text-white/50 text-lg leading-relaxed mb-6">
                                {pkg.description[lang]}
                            </p>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <Clock className="w-5 h-5 text-white/40 mx-auto mb-2" />
                                    <p className="text-white font-bold">{pkg.duration} {t.min}</p>
                                    <p className="text-white/40 text-xs">{t.duration}</p>
                                </div>
                                {pkg.maxGuests && (
                                    <div className="p-4 bg-white/5 rounded-xl text-center">
                                        <Users className="w-5 h-5 text-white/40 mx-auto mb-2" />
                                        <p className="text-white font-bold">{pkg.maxGuests}</p>
                                        <p className="text-white/40 text-xs">{t.guests}</p>
                                    </div>
                                )}
                            </div>

                            {/* Includes */}
                            <div className="mb-8">
                                <h3 className="text-white font-bold mb-3">{t.includes}</h3>
                                <ul className="space-y-2">
                                    {pkg.includes[lang].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Talent */}
                            <div className="p-4 bg-white/5 rounded-xl">
                                <p className="text-white/40 text-xs mb-1">{t.talent}</p>
                                <p className="text-white font-bold">{pkg.talentName[lang]}</p>
                            </div>
                        </motion.div>

                        {/* Right: Booking Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:sticky lg:top-24 lg:self-start"
                        >
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
                                <h2 className="text-2xl font-black text-slate-900 mb-1">
                                    {t.formTitle}
                                </h2>
                                <p className="text-slate-500 text-sm mb-6">
                                    {t.formSubtitle}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                            {t.name} *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* WhatsApp */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                            {t.whatsapp} *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                            placeholder="+972"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                            {t.location} *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                                {t.date}
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                                    className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                                {t.time}
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                            {t.email}
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {t.submit}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

