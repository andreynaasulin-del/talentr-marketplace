'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft, MapPin, Clock, Users, DollarSign, Globe,
    Check, MessageCircle, Share2, Copy, Heart, Star,
    Calendar, Info, Loader2, ChevronLeft, ChevronRight,
    X, Play, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Gig, EVENT_TYPES, GIG_CATEGORIES } from '@/types/gig';
import { useLanguage } from '@/context/LanguageContext';

interface Vendor {
    id: string;
    name: string;
    category: string;
    city: string;
    avatar_url?: string;
    rating?: number;
}

export default function GigBySlugPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const [gig, setGig] = useState<Gig | null>(null);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [liked, setLiked] = useState(false);

    const t = {
        en: {
            description: 'Description',
            included: "What's Included",
            details: 'Details',
            suitableFor: 'Suitable For',
            duration: 'Duration',
            maxGuests: 'Max Guests',
            location: 'Location',
            online: 'Online',
            free: 'Free',
            from: 'from',
            hour: '/hour',
            chat: 'Contact Vendor',
            book: 'Book Now',
            suitableForKids: 'Suitable for kids',
            adultsOnly: '18+ only',
            gigNotFound: 'Gig not found',
            linkExpired: 'The link might be outdated or the gig was deleted',
            goHome: 'Go Home',
            unlisted: '🔗 This gig is accessible by link only',
            back: 'Back',
            share: 'Share',
            copied: 'Copied!',
            vendorProfile: 'View Profile',
            bookAhead: 'Book at least',
            daysAhead: 'days ahead',
            hoursAhead: 'hours ahead'
        },
        he: {
            description: 'תיאור',
            included: 'מה כללול',
            details: 'פרטים',
            suitableFor: 'מתאים ל',
            duration: 'משך',
            maxGuests: 'מקסימום אורחים',
            location: 'מיקום',
            online: 'אונליין',
            free: 'חינם',
            from: 'החל מ',
            hour: '/שעה',
            chat: 'צור קשר',
            book: 'הזמן עכשיו',
            suitableForKids: 'מתאים לילדים',
            adultsOnly: '18+ בלבד',
            gigNotFound: 'הגיג לא נמצא',
            linkExpired: 'הקישור אולי פג תוקף או שהגיג נמחק',
            goHome: 'חזור הביתה',
            unlisted: '🔗 גיג זה נגיש רק דרך הקישור',
            back: 'חזור',
            share: 'שתף',
            copied: 'הועתק!',
            vendorProfile: 'צפה בפרופיל',
            bookAhead: 'הזמן לפחות',
            daysAhead: 'ימים מראש',
            hoursAhead: 'שעות מראש'
        }
    }[lang];

    useEffect(() => {
        loadGig();
    }, [slug]);

    const loadGig = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gigs/slug/${slug}`);
            const data = await res.json();

            if (!res.ok || !data.gig) {
                setError('Gig not found');
                return;
            }

            setGig(data.gig);
            if (data.vendor) {
                setVendor(data.vendor);
            }
        } catch (err) {
            setError('Loading error');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        const link = window.location.href;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCategoryIcon = (categoryId: string) => {
        return GIG_CATEGORIES.find(c => c.id === categoryId)?.icon || '✨';
    };

    const getEventTypeLabel = (typeId: string) => {
        const type = EVENT_TYPES.find(e => e.id === typeId);
        return type?.label?.[lang] || typeId;
    };

    const allMedia = [
        ...(gig?.photos || []).map(p => ({ type: 'image' as const, url: p.url })),
        ...(gig?.videos || []).map(v => ({ type: 'video' as const, url: v.url }))
    ];

    const nextImage = () => {
        setCurrentImageIndex((i) => (i + 1) % allMedia.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((i) => (i - 1 + allMedia.length) % allMedia.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !gig) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info className="w-12 h-12 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                        {t.gigNotFound}
                    </h1>
                    <p className="text-zinc-500 mb-8">
                        {t.linkExpired}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl"
                    >
                        {t.goHome}
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <Navbar />

            {/* Unlisted badge */}
            {gig.status === 'unlisted' && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                    {t.unlisted}
                </div>
            )}

            {/* Hero section with gallery */}
            <div className="relative">
                {/* Main image/cover */}
                <div
                    className="relative h-64 md:h-96 bg-gradient-to-br from-blue-600 to-purple-700 cursor-pointer"
                    onClick={() => allMedia.length > 0 && setGalleryOpen(true)}
                >
                    {allMedia[0] && (
                        allMedia[0].type === 'image' ? (
                            <Image
                                src={allMedia[0].url}
                                alt={gig.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <video
                                src={allMedia[0].url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                            />
                        )
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Media count badge */}
                    {allMedia.length > 1 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium flex items-center gap-1.5">
                            <Play className="w-4 h-4" />
                            {allMedia.length} media
                        </div>
                    )}
                </div>

                {/* Thumbnail strip */}
                {allMedia.length > 1 && (
                    <div className="hidden md:flex gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
                        {allMedia.slice(0, 5).map((media, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentImageIndex(idx);
                                    setGalleryOpen(true);
                                }}
                                className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 hover:ring-2 ring-blue-500 transition-all"
                            >
                                {media.type === 'image' ? (
                                    <Image src={media.url} alt="" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <Play className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                        {allMedia.length > 5 && (
                            <button
                                onClick={() => setGalleryOpen(true)}
                                className="w-20 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0"
                            >
                                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                                    +{allMedia.length - 5}
                                </span>
                            </button>
                        )}
                    </div>
                )}

                {/* Back button */}
                <div className="absolute top-4 left-4 z-10">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t.back}
                    </Link>
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`p-2.5 backdrop-blur-lg rounded-xl transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                        {copied ? t.copied : t.share}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Title section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl">{getCategoryIcon(gig.category_id)}</span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-sm font-bold rounded-full">
                            {gig.category_id}
                        </span>
                        {gig.age_limit && gig.age_limit !== 'none' && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold rounded-lg">
                                {gig.age_limit}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2">
                        {gig.title}
                    </h1>
                    {gig.tags && gig.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {gig.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs rounded-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Description */}
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                                {t.description}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                                {gig.short_description}
                            </p>
                            {gig.full_description && (
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4 whitespace-pre-line">
                                    {gig.full_description}
                                </p>
                            )}
                        </section>

                        {/* What's included */}
                        {gig.price_includes && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                                    {t.included}
                                </h2>
                                <div className="space-y-2">
                                    {gig.price_includes.split('\n').filter(Boolean).map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Details grid */}
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                                {t.details}
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {gig.duration_minutes && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">{t.duration}</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                {gig.duration_minutes} min
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {gig.max_guests && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                            <Users className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">{t.maxGuests}</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                {gig.min_guests ? `${gig.min_guests}-` : ''}
                                                {gig.max_guests}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {gig.base_city && gig.location_mode !== 'online' && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">{t.location}</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                {gig.base_city}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {gig.location_mode === 'online' && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">Format</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                {t.online}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Event types */}
                        {gig.event_types && gig.event_types.length > 0 && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                                    {t.suitableFor}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {gig.event_types.map((type) => (
                                        <span
                                            key={type}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-100 dark:border-blue-800"
                                        >
                                            {getEventTypeLabel(type)}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        {/* Pricing card */}
                        <div className="sticky top-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                            {/* Price */}
                            <div className="mb-6">
                                {gig.is_free ? (
                                    <div className="text-3xl font-black text-green-600">
                                        {t.free}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            {gig.pricing_type === 'from' && (
                                                <span className="text-zinc-500">{t.from}</span>
                                            )}
                                            <span className="text-4xl font-black text-zinc-900 dark:text-white">
                                                ₪{gig.price_amount?.toLocaleString()}
                                            </span>
                                            {gig.pricing_type === 'hourly' && (
                                                <span className="text-zinc-500">{t.hour}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick info */}
                            <div className="space-y-3 mb-6">
                                {gig.languages && gig.languages.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <Globe className="w-4 h-4" />
                                        {gig.languages.join(' / ')}
                                    </div>
                                )}
                                {gig.lead_time_hours && (
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <Calendar className="w-4 h-4" />
                                        {t.bookAhead} {gig.lead_time_hours >= 24
                                            ? `${Math.floor(gig.lead_time_hours / 24)} ${t.daysAhead}`
                                            : `${gig.lead_time_hours} ${t.hoursAhead}`}
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 mb-3">
                                <MessageCircle className="w-5 h-5" />
                                {t.chat}
                            </button>

                            {/* Kids badge */}
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2 text-sm">
                                    {gig.suitable_for_kids ? (
                                        <>
                                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-zinc-600 dark:text-zinc-400">{t.suitableForKids}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                                <Info className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <span className="text-zinc-600 dark:text-zinc-400">{t.adultsOnly}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vendor card */}
                        {vendor && (
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                                        {vendor.avatar_url ? (
                                            <Image src={vendor.avatar_url} alt={vendor.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                                            {vendor.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {vendor.city}
                                        </p>
                                        {vendor.rating && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-medium">{vendor.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={`/vendor/${vendor.id}`}
                                    className="block mt-3 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                >
                                    {t.vendorProfile}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Fullscreen Gallery Modal */}
            <AnimatePresence>
                {galleryOpen && allMedia.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setGalleryOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Counter */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 text-white text-sm font-medium rounded-lg">
                            {currentImageIndex + 1} / {allMedia.length}
                        </div>

                        {/* Navigation */}
                        {allMedia.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Media display */}
                        <div className="w-full h-full flex items-center justify-center p-12">
                            {allMedia[currentImageIndex].type === 'image' ? (
                                <Image
                                    src={allMedia[currentImageIndex].url}
                                    alt=""
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <video
                                    src={allMedia[currentImageIndex].url}
                                    className="max-w-full max-h-full"
                                    controls
                                    autoPlay
                                />
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                            {allMedia.map((media, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-75'
                                        }`}
                                >
                                    {media.type === 'image' ? (
                                        <Image src={media.url} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <Play className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
