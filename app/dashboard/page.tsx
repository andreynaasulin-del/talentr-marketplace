'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import {
    ArrowRight,
    Camera,
    Check,
    CheckCircle,
    Clock,
    Copy,
    DollarSign,
    Eye,
    FileText,
    Loader2,
    Pencil,
    Share2,
    Sparkles,
    Tag,
    X,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { getVendorBookings, updateBookingStatus } from '@/lib/vendors';
import { cn } from '@/lib/utils';

interface Booking {
    id: string;
    event_date: string;
    event_type: string;
    details: string | null;
    status: string;
    created_at: string;
}

interface VendorProfile {
    id: string;
    full_name: string;
    bio: string | null;
    avatar_url: string | null;
    portfolio_gallery: string[] | null;
    price_from: number | null;
    category: string | null;
    city: string | null;
}

const OBSIDIAN = '#05070A';
const GOLD = '#D4AF37';

export default function DashboardPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isRTL = language === 'he';

    const [user, setUser] = useState<User | null>(null);
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const profileCompletion = useMemo(() => {
        if (!vendorProfile) return 0;
        let score = 0;
        if (vendorProfile.bio && vendorProfile.bio.length > 10) score += 25;
        if (vendorProfile.avatar_url) score += 20;
        if (vendorProfile.portfolio_gallery && vendorProfile.portfolio_gallery.length > 0) score += 30;
        if (vendorProfile.price_from && vendorProfile.price_from > 0) score += 25;
        return score;
    }, [vendorProfile]);

    const isNewUser = profileCompletion < 50;

    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const estimatedEarnings = confirmedBookings * 2500;

    const incomingRequests = useMemo(() => {
        return bookings
            .filter((b) => b.status === 'pending')
            .map((b) => ({
                id: b.id,
                date: new Date(b.event_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                }),
                eventType: b.event_type,
                clientName: language === 'he' ? 'לקוח' : 'Client',
            }));
    }, [bookings, language]);

    const recentActivity = useMemo(() => {
        return bookings
            .filter((b) => b.status !== 'pending')
            .slice(0, 3)
            .map((b) => ({
                id: b.id,
                date: new Date(b.event_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                }),
                event: b.event_type,
                status:
                    b.status === 'confirmed'
                        ? language === 'he'
                            ? 'מאושר'
                            : 'Confirmed'
                        : language === 'he'
                            ? 'ממתין'
                            : 'Pending',
            }));
    }, [bookings, language]);

    useEffect(() => {
        const checkUser = async () => {
            try {
                if (!supabase) throw new Error('Auth service unavailable');
                const { data } = await supabase.auth.getUser();
                const authUser = data.user;

                if (!authUser) {
                    router.push('/signin');
                    return;
                }

                const { data: vendorData } = await supabase
                    .from('vendors')
                    .select('id, full_name, bio, avatar_url, portfolio_gallery, price_from, category, city')
                    .eq('user_id', authUser.id)
                    .single();

                if (vendorData) {
                    setVendorId(vendorData.id);
                    setVendorProfile(vendorData as VendorProfile);
                }

                setUser(authUser);
            } catch (err) {
                console.error('Dashboard auth check failed:', err);
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [router]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!vendorId) return;
            setBookingsLoading(true);
            try {
                const data = await getVendorBookings(vendorId);
                setBookings(data as Booking[]);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setBookingsLoading(false);
            }
        };

        fetchBookings();
    }, [vendorId]);

    const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'declined') => {
        try {
            await updateBookingStatus(bookingId, action);
            if (vendorId) {
                const data = await getVendorBookings(vendorId);
                setBookings(data as Booking[]);
            }
            toast.success(
                action === 'confirmed'
                    ? language === 'he'
                        ? '✅ ההזמנה אושרה!'
                        : '✅ Booking confirmed!'
                    : language === 'he'
                        ? 'ההזמנה נדחתה'
                        : 'Booking declined'
            );
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error(language === 'he' ? 'שגיאה בעדכון ההזמנה' : 'Error updating booking');
        }
    };

    const copyProfileLink = async () => {
        if (!vendorId) {
            toast.error(language === 'he' ? 'הפרופיל עדיין לא מוכן' : 'Profile is not ready yet');
            return;
        }
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://talentr-marketplace-mjnh-talentr.vercel.app';
        const link = `${origin}/vendor/${vendorId}`;
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success(language === 'he' ? '🔗 הקישור הועתק!' : '🔗 Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return language === 'he' ? 'בוקר טוב' : 'Good morning';
        if (hour < 18) return language === 'he' ? 'צהריים טובים' : 'Good afternoon';
        return language === 'he' ? 'ערב טוב' : 'Good evening';
    };

    const onboardingActions = [
        {
            id: 'bio',
            icon: FileText,
            title: language === 'he' ? 'מלא את הביוגרפיה' : 'Complete your Bio',
            description: language === 'he' ? 'ספר ללקוחות על עצמך' : 'Tell clients about yourself',
            completed: !!(vendorProfile?.bio && vendorProfile.bio.length > 10),
            href: '/dashboard/settings',
        },
        {
            id: 'photos',
            icon: Camera,
            title: language === 'he' ? 'העלה תמונות' : 'Upload Portfolio',
            description: language === 'he' ? 'הראה את העבודות הטובות שלך' : 'Show your best work',
            completed: !!(vendorProfile?.portfolio_gallery && vendorProfile.portfolio_gallery.length > 0),
            href: '/dashboard/settings',
            critical: true,
        },
        {
            id: 'pricing',
            icon: Tag,
            title: language === 'he' ? 'קבע מחירים' : 'Set your Pricing',
            description: language === 'he' ? 'קבע את תעריפי השירותים שלך' : 'Set your service rates',
            completed: !!(vendorProfile?.price_from && vendorProfile.price_from > 0),
            href: '/dashboard/settings',
        },
    ];

    const userName = user?.user_metadata?.full_name?.split(' ')[0] || vendorProfile?.full_name?.split(' ')[0] || 'Pro';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: OBSIDIAN }}>
                <div className="text-center">
                    <div
                        className="w-14 h-14 border-2 rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: GOLD }}
                    />
                    <p className="text-white/60 text-sm tracking-[0.2em] uppercase">
                        {language === 'he' ? 'טוען' : 'Loading'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white relative" style={{ background: OBSIDIAN }}>
            <Navbar />

            {/* Ambient depth */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-64 left-1/4 w-[900px] h-[900px] rounded-full blur-3xl opacity-25"
                    style={{ background: 'radial-gradient(circle at 30% 30%, rgba(212,175,55,0.22), transparent 60%)' }}
                />
                <div className="absolute top-20 -right-64 w-[1000px] h-[1000px] rounded-full blur-3xl opacity-35"
                    style={{ background: 'radial-gradient(circle at 35% 35%, rgba(0, 180, 255, 0.10), transparent 60%)' }}
                />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(212,175,55,0.9) 1px, transparent 1px)',
                        backgroundSize: '140px 140px',
                        backgroundPosition: '10px 10px',
                    }}
                />
            </div>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
                {/* Header */}
                <div
                    className={cn(
                        'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7',
                        isRTL && 'sm:flex-row-reverse'
                    )}
                >
                    <div className={cn(isRTL && 'text-right')}>
                        <h1 className="text-3xl sm:text-4xl font-black leading-[1.05]">
                            {getGreeting()}, {userName}.
                        </h1>
                        <div className={cn('mt-2 flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.35)]" />
                            <span className="text-white/55 text-sm">
                                {language === 'he' ? 'זמין להזמנות' : 'Available for bookings'}
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
                            'bg-white/5 hover:bg-white/10 border border-white/10',
                            'backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]',
                            'transition-colors',
                            isRTL && 'flex-row-reverse'
                        )}
                    >
                        <Pencil className="w-4 h-4 text-white/70" />
                        <span className="text-sm font-bold tracking-wide">
                            {language === 'he' ? 'ערוך פרופיל' : 'Edit Profile'}
                        </span>
                    </Link>
                </div>

                {/* Hero / Onboarding */}
                {isNewUser && (
                    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
                        <div
                            className="relative overflow-hidden rounded-3xl p-5 sm:p-6"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '0.5px solid rgba(212,175,55,0.30)',
                                boxShadow: '0 40px 120px rgba(0,0,0,0.65), 0 0 80px rgba(212,175,55,0.08)',
                                backdropFilter: 'blur(18px)',
                            }}
                        >
                            {/* inner ambient */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-70"
                                style={{
                                    background:
                                        'radial-gradient(900px circle at 10% 0%, rgba(212,175,55,0.12), transparent 55%), radial-gradient(700px circle at 90% 50%, rgba(255,255,255,0.06), transparent 60%)',
                                }}
                            />

                            <div className="relative z-10">
                                <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                                    <div className={cn('flex items-start gap-3', isRTL && 'flex-row-reverse')}>
                                        <div
                                            className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 bg-black/30"
                                            style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.18)' }}
                                        >
                                            <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
                                        </div>
                                        <div className={cn(isRTL && 'text-right')}>
                                            <div
                                                className="text-sm uppercase tracking-[0.35em] text-white/55"
                                                style={{ fontFamily: 'var(--font-serif), serif' }}
                                            >
                                                {language === 'he' ? 'פאנל ספק פרטי' : 'Private Vendor Panel'}
                                            </div>
                                            <h2
                                                className="mt-1 text-xl sm:text-2xl tracking-[0.14em]"
                                                style={{ fontFamily: 'var(--font-serif), serif' }}
                                            >
                                                {language === 'he' ? 'ברוכים הבאים' : 'Welcome'} {language === 'he' ? 'ל‑Talentr' : 'to Talentr'}
                                            </h2>
                                            <p className="mt-1 text-white/60 text-sm">
                                                {language === 'he'
                                                    ? 'השלם את הפרופיל כדי להתחיל לקבל הזמנות.'
                                                    : 'Complete your profile to start receiving bookings.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <RingProgress value={profileCompletion} />
                                    </div>
                                </div>

                                {/* Action bricks */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {onboardingActions.map((action, idx) => (
                                        <motion.div
                                            key={action.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * idx }}
                                        >
                                            <Link
                                                href={action.href}
                                                className={cn(
                                                    'group relative block rounded-2xl p-4',
                                                    'bg-white/5 border border-white/10 backdrop-blur-xl',
                                                    'transition-colors hover:bg-white/10',
                                                    action.completed && 'opacity-80'
                                                )}
                                                style={{ boxShadow: '0 18px 55px rgba(0,0,0,0.45)' }}
                                            >
                                                <div
                                                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                    style={{
                                                        background:
                                                            'linear-gradient(135deg, rgba(212,175,55,0.10), transparent 40%, transparent 60%, rgba(255,255,255,0.06))',
                                                    }}
                                                />

                                                {/* critical dot (replaces badge) */}
                                                {action.critical && !action.completed && (
                                                    <div
                                                        className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse"
                                                        style={{
                                                            background: GOLD,
                                                            boxShadow: '0 0 14px rgba(212,175,55,0.75)',
                                                        }}
                                                    />
                                                )}

                                                <div className={cn('flex items-start justify-between', isRTL && 'flex-row-reverse')}>
                                                    <div className={cn('flex items-start gap-3', isRTL && 'flex-row-reverse')}>
                                                        <DialIcon icon={action.icon} />
                                                        <div className={cn(isRTL && 'text-right')}>
                                                            <div className="text-sm font-bold text-white/90">{action.title}</div>
                                                            <div className="mt-1 text-xs text-white/55">{action.description}</div>
                                                        </div>
                                                    </div>

                                                    {action.completed ? (
                                                        <CheckCircle className="w-5 h-5 text-white/50" />
                                                    ) : null}
                                                </div>

                                                {!action.completed && (
                                                    <div
                                                        className={cn(
                                                            'mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-white/55',
                                                            isRTL && 'flex-row-reverse justify-end'
                                                        )}
                                                    >
                                                        <span>{language === 'he' ? 'התחל' : 'Start'}</span>
                                                        <ArrowRight
                                                            className={cn('w-4 h-4 transition-transform group-hover:translate-x-0.5', isRTL && 'rotate-180 group-hover:-translate-x-0.5')}
                                                        />
                                                    </div>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Stats (watch dials) */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                    <StatDial
                        icon={DollarSign}
                        value={`₪${estimatedEarnings.toLocaleString()}`}
                        label={language === 'he' ? 'סך הכנסות' : 'Total Earnings'}
                        badge={
                            confirmedBookings > 0
                                ? `${confirmedBookings} ${language === 'he' ? 'הזמנות' : 'bookings'}`
                                : undefined
                        }
                        isRTL={isRTL}
                    />
                    <StatDial
                        icon={Eye}
                        value={'0'}
                        label={language === 'he' ? 'צפיות בפרופיל' : 'Profile Views'}
                        isRTL={isRTL}
                    />
                    <StatDial
                        icon={Clock}
                        value={String(pendingBookings)}
                        label={language === 'he' ? 'בקשות פעילות' : 'Active Requests'}
                        isRTL={isRTL}
                    />
                </section>

                {/* Incoming Inquiries */}
                <section
                    className="rounded-3xl p-5 sm:p-6 border border-white/10 bg-white/4 backdrop-blur-xl mb-7"
                    style={{ boxShadow: '0 30px 120px rgba(0,0,0,0.60)' }}
                >
                    <div className={cn('flex items-center justify-between mb-4', isRTL && 'flex-row-reverse')}>
                        <h2
                            className={cn('text-lg sm:text-xl tracking-[0.16em]', isRTL && 'text-right')}
                            style={{ fontFamily: 'var(--font-serif), serif' }}
                        >
                            {language === 'he' ? 'פניות נכנסות' : 'Incoming Inquiries'}
                        </h2>

                        <div className="h-[1px] flex-1 mx-4 opacity-20"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }}
                        />
                    </div>

                    {bookingsLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-7 h-7 animate-spin" style={{ color: GOLD }} />
                        </div>
                    ) : incomingRequests.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center mx-auto mb-4">
                                <Share2 className="w-6 h-6 text-white/60" />
                            </div>
                            <div className="text-white/80 font-semibold">
                                {language === 'he' ? 'אין בקשות עדיין' : 'No requests yet'}
                            </div>
                            <p className="mt-2 text-white/55 text-sm max-w-md mx-auto">
                                {language === 'he'
                                    ? 'שתף את הקישור לפרופיל שלך כדי להתחיל לקבל הזמנות.'
                                    : 'Share your profile link to start getting bookings.'}
                            </p>

                            <button
                                onClick={copyProfileLink}
                                className={cn(
                                    'mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold',
                                    'border border-white/10 bg-white/5 hover:bg-white/10 transition-colors',
                                    isRTL && 'flex-row-reverse'
                                )}
                                style={{ boxShadow: '0 0 35px rgba(212,175,55,0.10)' }}
                            >
                                {copied ? (
                                    <CheckCircle className="w-5 h-5" style={{ color: GOLD }} />
                                ) : (
                                    <Copy className="w-5 h-5 text-white/70" />
                                )}
                                <span style={{ color: copied ? GOLD : 'rgba(255,255,255,0.85)' }}>
                                    {copied
                                        ? language === 'he'
                                            ? 'הועתק!'
                                            : 'Copied!'
                                        : language === 'he'
                                            ? 'העתק קישור לפרופיל'
                                            : 'Copy profile link'}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {incomingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className={cn(
                                        'rounded-2xl p-4 border border-white/10 bg-black/20',
                                        'hover:bg-black/30 transition-colors',
                                        'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                                        isRTL && 'sm:flex-row-reverse'
                                    )}
                                >
                                    <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
                                        <div className="text-center min-w-[56px]">
                                            <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-serif), serif' }}>
                                                {request.date.split(' ')[0]}
                                            </div>
                                            <div className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                                                {request.date.split(' ')[1]}
                                            </div>
                                        </div>
                                        <div className={cn(isRTL && 'text-right')}>
                                            <div className="font-semibold text-white/85">{request.eventType}</div>
                                            <div className="text-xs text-white/45">
                                                {language === 'he' ? 'סוג אירוע' : 'Event Type'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn('flex items-center gap-5', isRTL && 'flex-row-reverse')}>
                                        <div className={cn(isRTL && 'text-right')}>
                                            <div className="text-sm font-semibold text-white/80">{request.clientName}</div>
                                            <div className="text-xs text-white/45">
                                                {language === 'he' ? 'לקוח' : 'Client'}
                                            </div>
                                        </div>

                                        <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                                            <button
                                                onClick={() => handleBookingAction(request.id, 'confirmed')}
                                                className={cn(
                                                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold',
                                                    'bg-[#D4AF37] text-[#05070A] hover:opacity-90 transition-opacity',
                                                    isRTL && 'flex-row-reverse'
                                                )}
                                            >
                                                <Check className="w-4 h-4" />
                                                <span>{language === 'he' ? 'אשר' : 'Accept'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleBookingAction(request.id, 'declined')}
                                                className={cn(
                                                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold',
                                                    'border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/80',
                                                    isRTL && 'flex-row-reverse'
                                                )}
                                            >
                                                <X className="w-4 h-4" />
                                                <span>{language === 'he' ? 'דחה' : 'Decline'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Activity */}
                <section
                    className="rounded-3xl p-5 sm:p-6 border border-white/10 bg-white/4 backdrop-blur-xl"
                    style={{ boxShadow: '0 30px 120px rgba(0,0,0,0.60)' }}
                >
                    <div className={cn('flex items-center justify-between mb-4', isRTL && 'flex-row-reverse')}>
                        <h2
                            className={cn('text-lg sm:text-xl tracking-[0.16em]', isRTL && 'text-right')}
                            style={{ fontFamily: 'var(--font-serif), serif' }}
                        >
                            {language === 'he' ? 'פעילות אחרונה' : 'Recent Activity'}
                        </h2>
                        <div className="h-[1px] flex-1 mx-4 opacity-20"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }}
                        />
                    </div>

                    {recentActivity.length === 0 ? (
                        <div className="text-center py-10 text-white/55">
                            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-6 h-6 text-white/55" />
                            </div>
                            <p>{language === 'he' ? 'פעילות תופיע כאן' : 'Activity will appear here'}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={cn(
                                        'rounded-2xl p-4 border border-white/10 bg-black/20',
                                        'flex items-center justify-between gap-4',
                                        isRTL && 'flex-row-reverse'
                                    )}
                                >
                                    <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
                                        <DialIcon icon={Clock} />
                                        <div className={cn(isRTL && 'text-right')}>
                                            <div className="font-semibold text-white/85">{activity.event}</div>
                                            <div className="text-xs text-white/45">{activity.date}</div>
                                        </div>
                                    </div>

                                    <span
                                        className={cn(
                                            'px-3 py-1.5 rounded-full text-xs font-bold border',
                                            activity.status === (language === 'he' ? 'מאושר' : 'Confirmed')
                                                ? 'border-emerald-400/25 text-emerald-200 bg-emerald-500/10'
                                                : 'border-amber-400/25 text-amber-200 bg-amber-500/10'
                                        )}
                                    >
                                        {activity.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function RingProgress({ value }: { value: number }) {
    const size = 46;
    const stroke = 3;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const clamped = Math.max(0, Math.min(100, value));
    const offset = c * (1 - clamped / 100);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="rotate-[-90deg]">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={GOLD}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.35))' }}
                />
            </svg>
            <div
                className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tracking-[0.12em] text-white/80"
                style={{ fontFamily: 'var(--font-serif), serif' }}
            >
                {Math.round(clamped)}%
            </div>
        </div>
    );
}

function DialIcon({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
    return (
        <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/12 bg-black/30" />
            <div className="absolute inset-[3px] rounded-full border" style={{ borderColor: 'rgba(212,175,55,0.22)' }} />
            <div className="absolute inset-[8px] rounded-full bg-black/30 border border-white/10" />
            <Icon className="relative z-10 w-5 h-5" />
            <style jsx>{`
                div :global(svg) {
                    color: ${GOLD};
                    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.22));
                }
            `}</style>
        </div>
    );
}

function StatDial({
    icon: Icon,
    value,
    label,
    badge,
    isRTL,
}: {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    label: string;
    badge?: string;
    isRTL: boolean;
}) {
    return (
        <div
            className={cn(
                'relative rounded-3xl p-5 border border-white/10 bg-white/4 backdrop-blur-xl',
                'shadow-[0_25px_90px_rgba(0,0,0,0.60)]'
            )}
        >
            <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-70"
                style={{
                    background:
                        'radial-gradient(600px circle at 25% 15%, rgba(212,175,55,0.10), transparent 55%), radial-gradient(500px circle at 90% 85%, rgba(255,255,255,0.05), transparent 60%)',
                }}
            />

            <div className={cn('relative z-10 flex items-start justify-between gap-3', isRTL && 'flex-row-reverse')}>
                <DialIcon icon={Icon} />
                {badge ? (
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/55">
                        {badge}
                    </div>
                ) : (
                    <div />
                )}
            </div>

            <div className={cn('relative z-10 mt-5', isRTL && 'text-right')}>
                <div
                    className="text-3xl leading-none text-white"
                    style={{
                        fontFamily: 'var(--font-serif), serif',
                        letterSpacing: '0.06em',
                        textShadow: '0 0 22px rgba(212,175,55,0.10)',
                    }}
                >
                    {value}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</div>
            </div>
        </div>
    );
}
