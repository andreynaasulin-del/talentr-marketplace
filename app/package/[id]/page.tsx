'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { packages } from '@/lib/gigs';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, CheckCircle, Calendar, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PackagePage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const pkg = packages.find(p => p.id === params.id);

    if (!pkg) {
        return (
            <main className="min-h-screen bg-slate-950">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        {lang === 'he' ? 'החבילה לא נמצאה' : 'Package Not Found'}
                    </h1>
                    <p className="text-gray-400 mb-8">
                        {lang === 'he' ? 'החבילה שחיפשת לא קיימת' : 'The package you are looking for does not exist'}
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                        {lang === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const content = {
        en: {
            back: 'Back',
            duration: 'Duration',
            minutes: 'minutes',
            guests: 'Up to',
            guestsLabel: 'guests',
            includes: 'What\'s Included',
            price: 'Fixed Price',
            book: 'Book Now',
            contact: 'Contact',
            by: 'By',
        },
        he: {
            back: 'חזרה',
            duration: 'משך',
            minutes: 'דקות',
            guests: 'עד',
            guestsLabel: 'אורחים',
            includes: 'מה כולל',
            price: 'מחיר קבוע',
            book: 'הזמן עכשיו',
            contact: 'צור קשר',
            by: 'מאת',
        },
    };

    const t = content[lang];

    return (
        <main className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Back Button */}
                <motion.button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t.back}</span>
                </motion.button>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Image */}
                    <motion.div
                        className="relative aspect-square rounded-3xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Image
                            src={pkg.image}
                            alt={pkg.title[lang]}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/20">
                                {pkg.category}
                            </span>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                            {pkg.title[lang]}
                        </h1>

                        {/* Talent */}
                        <p className="text-gray-400 text-lg mb-6">
                            {t.by} <span className="text-white font-semibold">{pkg.talentName[lang]}</span>
                        </p>

                        {/* Description */}
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            {pkg.description[lang]}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <span className="text-white font-medium">
                                    {pkg.duration} {t.minutes}
                                </span>
                            </div>
                            {pkg.maxGuests && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                                    <Users className="w-5 h-5 text-green-400" />
                                    <span className="text-white font-medium">
                                        {t.guests} {pkg.maxGuests} {t.guestsLabel}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Includes */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-4">{t.includes}</h3>
                            <ul className="space-y-3">
                                {pkg.includes[lang].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price & CTA */}
                        <div className="mt-auto pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">{t.price}</p>
                                    <p className="text-3xl font-black text-white">
                                        ₪{pkg.fixedPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                    <Calendar className="w-5 h-5" />
                                    {t.book}
                                </button>
                                <button className="px-6 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20">
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
