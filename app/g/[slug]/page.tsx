'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft, MapPin, Clock, Users, DollarSign, Globe,
    Check, MessageCircle, Share2, Copy, Heart, Star,
    Calendar, Info, Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Gig, EVENT_TYPES, GIG_CATEGORIES } from '@/types/gig';

export default function GigBySlugPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [gig, setGig] = useState<Gig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

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
        // Default to English if no mapped label found or logic for language context could be added here
        // Since this is a client page, we can use a simple check or default to EN
        return (type?.label as any)['en'] || typeId;
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
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info className="w-12 h-12 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                        Gig not found
                    </h1>
                    <p className="text-zinc-500 mb-8">
                        The link might be outdated or the gig was deleted
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl"
                    >
                        Go Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <Navbar />

            {/* Unlisted badge */}
            {gig.status === 'unlisted' && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                    🔗 This gig is accessible by link only
                </div>
            )}

            {/* Hero section with cover */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 to-purple-700">
                {gig.photos?.[0] && (
                    <Image
                        src={gig.photos[0].url}
                        alt={gig.title}
                        fill
                        className="object-cover opacity-50"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

                {/* Back button */}
                <div className="absolute top-4 left-4 z-10">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Link>
                </div>

                {/* Share button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                        {copied ? 'Copied' : 'Share'}
                    </button>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl">{getCategoryIcon(gig.category_id)}</span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-lg text-white text-sm font-bold rounded-full">
                                {gig.category_id}
                            </span>
                            {gig.age_limit && gig.age_limit !== 'none' && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                    {gig.age_limit}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">
                            {gig.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                                Description
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {gig.short_description}
                            </p>
                            {gig.full_description && (
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                                    {gig.full_description}
                                </p>
                            )}
                        </section>

                        {/* What's included */}
                        {gig.price_includes && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                                    What is included
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {gig.price_includes}
                                </p>
                            </section>
                        )}

                        {/* Details grid */}
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                                Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {gig.duration_minutes && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Duration</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                {gig.duration_minutes} min
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {gig.max_guests && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                        <Users className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Max Guests</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                up to {gig.max_guests}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {gig.base_city && gig.location_mode !== 'online' && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                        <MapPin className="w-5 h-5 text-red-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Location</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                {gig.base_city}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {gig.location_mode === 'online' && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                        <Globe className="w-5 h-5 text-purple-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Format</p>
                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Event types */}
                        {gig.event_types && gig.event_types.length > 0 && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                                    Suitable for
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {gig.event_types.map((type) => (
                                        <span
                                            key={type}
                                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-sm font-medium rounded-full"
                                        >
                                            {getEventTypeLabel(type)}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar - Booking card */}
                    <div className="md:col-span-1">
                        <div className="sticky top-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
                            {/* Price */}
                            <div className="mb-6">
                                {gig.is_free ? (
                                    <div className="text-2xl font-black text-green-600">
                                        Free
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            {gig.pricing_type === 'from' && (
                                                <span className="text-zinc-500">from</span>
                                            )}
                                            <span className="text-3xl font-black text-zinc-900 dark:text-white">
                                                ₪{gig.price_amount}
                                            </span>
                                            {gig.pricing_type === 'hourly' && (
                                                <span className="text-zinc-500">/hour</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Languages */}
                            {gig.languages && gig.languages.length > 0 && (
                                <div className="flex items-center gap-2 mb-4 text-sm text-zinc-500">
                                    <Globe className="w-4 h-4" />
                                    {gig.languages.join(' / ')}
                                </div>
                            )}

                            {/* Lead time */}
                            {gig.lead_time_hours && (
                                <div className="flex items-center gap-2 mb-6 text-sm text-zinc-500">
                                    <Calendar className="w-4 h-4" />
                                    Book at least {gig.lead_time_hours >= 24
                                        ? `${Math.floor(gig.lead_time_hours / 24)} days`
                                        : `${gig.lead_time_hours} hours`} ahead
                                </div>
                            )}

                            {/* CTA */}
                            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                                <MessageCircle className="w-5 h-5" />
                                Chat
                            </button>

                            {/* Kids badge */}
                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2 text-sm">
                                    {gig.suitable_for_kids ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span className="text-zinc-600 dark:text-zinc-400">Suitable for kids</span>
                                        </>
                                    ) : (
                                        <>
                                            <Info className="w-4 h-4 text-orange-500" />
                                            <span className="text-zinc-600 dark:text-zinc-400">18+ only</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
