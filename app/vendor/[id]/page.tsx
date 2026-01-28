'use client';

import BookingModal from '@/components/booking/BookingModal';
import ReviewsSection from '@/components/ReviewsSection';
import SmartTips from '@/components/SmartTips';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Shield, Heart, Share2, ChevronLeft, Calendar, Clock, Award, Sparkles, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getVendorById } from '@/lib/vendors';
import { Vendor } from '@/types';
import { Gig } from '@/types/gig';
import { useLanguage } from '@/context/LanguageContext';
import { VendorProfileSkeleton } from '@/components/SkeletonLoader';

export default function VendorPage() {
    const params = useParams();
    const vendorId = params.id as string;
    const { convertPrice, t, language } = useLanguage();

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [vendorGigs, setVendorGigs] = useState<Gig[]>([]);

    useEffect(() => {
        const fetchVendor = async () => {
            setLoading(true);
            try {
                const data = await getVendorById(vendorId);
                setVendor(data);
            } catch (error) {
                console.error('Error fetching vendor:', error);
                setVendor(null);
            } finally {
                setLoading(false);
            }
        };

        if (vendorId) {
            fetchVendor();
            // Fetch vendor gigs
            fetch(`/api/gigs?vendor_id=${vendorId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.gigs) {
                        setVendorGigs(data.gigs.filter((g: Gig) => g.status === 'published'));
                    }
                })
                .catch(console.error);
        }
    }, [vendorId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black transition-colors">
                <Navbar />
                <VendorProfileSkeleton />
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-white dark:bg-black transition-colors">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t('Vendor not found')}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">{t("The vendor you're looking for doesn't exist.")}</p>
                    <Link href="/" className="inline-flex items-center gap-2 mt-6 text-blue-500 font-medium hover:text-blue-400">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Use vendor's gallery if available, otherwise show empty state
    const portfolioImages = vendor.portfolioGallery && vendor.portfolioGallery.length > 0
        ? vendor.portfolioGallery
        : []; // Empty - will show "Portfolio coming soon" message

    const hasPortfolio = portfolioImages.length > 0;

    const highlights = [
        { icon: Clock, label: 'Quick Response', value: '< 1 hour' },
        { icon: Calendar, label: 'Experience', value: '8+ years' },
        { icon: Award, label: 'Completed Events', value: '500+' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors">
            <Navbar />

            {/* Hero Section - Full Width Premium */}
            <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
                <Image
                    src={vendor.imageUrl}
                    alt={vendor.name}
                    fill
                    className="object-cover transform scale-105"
                    priority
                />
                {/* Advanced Multi-layer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Navigation Buttons Overlays */}
                <div className="absolute top-4 md:top-8 inset-x-4 md:inset-x-8 flex items-center justify-between z-20">
                    <Link
                        href="/"
                        className="p-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-2xl transition-all active:scale-95 group"
                    >
                        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`p-3 backdrop-blur-xl rounded-2xl border transition-all active:scale-95 ${isLiked
                                ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                                : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'}`}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 rounded-2xl transition-all active:scale-95 text-white">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Vendor Info Center-Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 pb-12 md:pb-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-6 animate-slide-up">
                            {/* Brand Badges */}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">
                                    {t(vendor.category)}
                                </span>
                                {vendor.rating >= 4.9 && (
                                    <span className="badge-top-rated flex items-center gap-1.5 px-4 py-2">
                                        <Award className="w-4 h-4 fill-current" />
                                        {t('TOP RATED')}
                                    </span>
                                )}
                                {vendor.reviewsCount > 50 && (
                                    <span className="badge-verified flex items-center gap-1.5 px-4 py-2">
                                        <Shield className="w-4 h-4" />
                                        {t('VERIFIED')}
                                    </span>
                                )}
                            </div>

                            {/* Headline */}
                            <div className="max-w-3xl">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight drop-shadow-2xl">
                                    {vendor.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                                    <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                                        <span className="font-bold text-sm md:text-lg">{t(vendor.city)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                                            <span className="font-black text-base md:text-xl">{vendor.rating}</span>
                                        </div>
                                        <span className="text-white/60 text-xs md:text-sm font-medium">({vendor.reviewsCount} {t('reviews')})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT CONTENT COLUMN (8/12) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Highlights Grid */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[24px] md:rounded-[32px] p-4 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                {highlights.map((item, index) => (
                                    <div key={index} className="flex flex-row sm:flex-col items-center sm:text-center p-3 md:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 group hover:bg-blue-600/10 transition-colors gap-3 sm:gap-0 border border-zinc-200 dark:border-zinc-700/50 hover:border-blue-500/30">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white dark:bg-black shadow-lg flex items-center justify-center sm:mb-4 group-hover:scale-110 transition-transform flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
                                            <item.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-500" />
                                        </div>
                                        <div className="sm:text-center">
                                            <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white mb-0.5 md:mb-1">{item.value}</p>
                                            <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">{t(item.label)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Story Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none">
                            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-4 md:mb-6 tracking-tight">{t('About')}</h2>
                            <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium mb-6 md:mb-8">
                                {t(vendor.description || `${vendor.name} is a highly experienced ${vendor.category.toLowerCase()} based in ${vendor.city}. With a passion for creating unforgettable moments, they bring creativity, professionalism, and attention to detail to every event.`)}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {vendor.tags.map((tag) => (
                                    <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-5 py-2.5 rounded-2xl text-sm font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-black hover:text-white dark:hover:bg-zinc-700 dark:hover:text-white transition-colors cursor-default">
                                        # {t(tag)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio Showcase */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{t('Portfolio')}</h2>
                                {hasPortfolio && (
                                    <span className="text-sm font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                        {portfolioImages.length} {t('Works')}
                                    </span>
                                )}
                            </div>

                            {hasPortfolio ? (
                                <>
                                    {/* Main Active Visual */}
                                    <div className="relative aspect-[16/9] rounded-[24px] overflow-hidden mb-6 bg-gray-50 dark:bg-zinc-800 group border border-zinc-200 dark:border-zinc-800">
                                        <Image
                                            src={portfolioImages[activeImage]}
                                            alt={`Portfolio ${activeImage + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Intuitive Thumbnails */}
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                        {portfolioImages.map((image: string, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(index)}
                                                className={`relative aspect-square rounded-[18px] overflow-hidden transition-all duration-300 ${activeImage === index
                                                    ? 'ring-4 ring-blue-600 ring-offset-2 scale-95 shadow-xl'
                                                    : 'opacity-40 hover:opacity-100 hover:scale-105 grayscale hover:grayscale-0'}`}
                                            >
                                                <Image src={image} alt={`Thumbnail ${index + 1}`} fill sizes="100px" className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Empty State */
                                <div className="text-center py-12 px-6">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                        <Calendar className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                        {language === 'he'
                                            ? 'הפורטפוליו יגיע בקרוב'
                                            : 'Portfolio coming soon'}
                                    </h4>
                                    <p className="text-zinc-500 max-w-sm mx-auto">
                                        {language === 'he'
                                            ? `${vendor.name} יוסיף את העבודות שלו בקרוב`
                                            : `${vendor.name} will add their work samples soon`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Vendor Gigs Section */}
                        {vendorGigs.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                                        <Briefcase className="w-8 h-8 text-blue-600" />
                                        {language === 'he' ? 'שירותים' : 'Services'}
                                    </h2>
                                    <span className="text-sm font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                        {vendorGigs.length} {language === 'he' ? 'גיגים' : 'Gigs'}
                                    </span>
                                </div>
                                <div className="grid gap-4">
                                    {vendorGigs.map((gig) => (
                                        <Link
                                            key={gig.id}
                                            href={`/g/${gig.share_slug}`}
                                            className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                                        >
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                                                {gig.photos?.[0] ? (
                                                    <Image
                                                        src={typeof gig.photos[0] === 'string' ? gig.photos[0] : gig.photos[0].url}
                                                        alt={gig.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">
                                                        ✨
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                                    {gig.title}
                                                </h3>
                                                <p className="text-sm text-zinc-500 line-clamp-1 mt-1">
                                                    {gig.short_description}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {gig.is_free ? (
                                                        <span className="text-green-600 font-bold text-sm">
                                                            {language === 'he' ? 'חינם' : 'Free'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-900 dark:text-white font-bold text-sm">
                                                            {gig.pricing_type === 'from' && (language === 'he' ? 'החל מ' : 'from ')}
                                                            ₪{gig.price_amount?.toLocaleString()}
                                                            {gig.pricing_type === 'hourly' && (language === 'he' ? '/שעה' : '/hr')}
                                                        </span>
                                                    )}
                                                    {gig.duration_minutes && (
                                                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {gig.duration_minutes} min
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors rotate-180 rtl:rotate-0" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <ReviewsSection vendorId={vendorId} vendorName={vendor.name} />
                    </div>

                    {/* RIGHT SIDEBAR (4/12) */}
                    <div className="lg:col-span-4 lg:block">
                        <div className="sticky top-24 space-y-6">

                            {/* Main Booking Card */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/50">
                                {/* Accent Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full -mr-10 -mt-10" />

                                <div className="space-y-4">
                                    {/* Action Buttons */}
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Calendar className="w-6 h-6" />
                                        {t('Book Now')}
                                    </button>

                                    <a
                                        href={`https://wa.me/${vendor.phone || '972501234567'}?text=${encodeURIComponent(
                                            language === 'he'
                                                ? `שלום! אני מעוניין בשירותים שלך. מצאתי אותך ב-Talentr.`
                                                : `Hi! I'm interested in your services. Found you on Talentr.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-lg py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        {t('Chat on WhatsApp')}
                                    </a>
                                </div>

                                {/* Safety Trust Pill */}
                                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-500/20 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-green-600 dark:text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-green-600 dark:text-green-500 leading-none mb-0.5">{t('Safe Deal')}</p>
                                        <p className="text-[10px] font-bold text-green-700 dark:text-green-600 uppercase tracking-tighter">{t('100% Protection')}</p>
                                    </div>
                                </div>

                                {/* Bullet Advantages */}
                                <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 gap-4">
                                    {[
                                        { text: 'Instant availability check', color: 'bg-blue-500' },
                                        { text: 'Free cancellation in 24h', color: 'bg-purple-500' },
                                        { text: 'Money-back guarantee', color: 'bg-amber-500' },
                                        { text: 'Professional contract', color: 'bg-green-500' }
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{t(item.text)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Smart Tips */}
                            <SmartTips
                                vendorName={vendor.name}
                                vendorCategory={vendor.category}
                            />

                            {/* Secondary Sidebar Content? */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-sm">
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-500" />
                                    {t('Why choose them?')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-2 h-auto rounded-full bg-blue-500/30" />
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                            "{t('Their attention to detail is unmatched in the industry today.')}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA Glassmorphism Footer */}
            <div className="fixed bottom-0 inset-x-0 lg:hidden p-3 md:p-4 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-t border-zinc-200 dark:border-zinc-800 safe-area-bottom shadow-2xl">
                <div className="max-w-xl mx-auto flex items-center justify-center gap-3 md:gap-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full h-12 md:h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-base md:text-lg rounded-xl md:rounded-[20px] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        {t('Book Now')}
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            {isModalOpen && (
                <BookingModal
                    vendorId={vendor.id}
                    vendorName={vendor.name}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <Footer />
        </div>
    );
}
