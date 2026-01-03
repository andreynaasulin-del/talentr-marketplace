'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getVendorBookings, updateBookingStatus } from '@/lib/vendors';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { User } from '@supabase/supabase-js';
import {
    DollarSign, Eye, Calendar, Check, X, Clock, Loader2,
    Pencil, FileText, Tag, Share2, Copy, CheckCircle,
    Sparkles, ArrowRight, Camera
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
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

export default function DashboardPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const isRTL = language === 'he';

    // Calculate profile completion
    const calculateProfileCompletion = () => {
        if (!vendorProfile) return 0;
        let score = 0;
        if (vendorProfile.bio && vendorProfile.bio.length > 10) score += 25;
        if (vendorProfile.avatar_url) score += 20;
        if (vendorProfile.portfolio_gallery && vendorProfile.portfolio_gallery.length > 0) score += 30;
        if (vendorProfile.price_from && vendorProfile.price_from > 0) score += 25;
        return score;
    };

    const profileCompletion = calculateProfileCompletion();
    const isNewUser = profileCompletion < 50;

    // Calculate real stats from bookings
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const estimatedEarnings = confirmedBookings * 2500;

    const incomingRequests = bookings
        .filter(b => b.status === 'pending')
        .map(b => ({
            id: b.id,
            date: new Date(b.event_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { day: 'numeric', month: 'short' }),
            eventType: b.event_type,
            clientName: 'Client',
            budget: '₪2,500',
        }));

    const recentActivity = bookings
        .filter(b => b.status !== 'pending')
        .slice(0, 3)
        .map(b => ({
            id: b.id,
            date: new Date(b.event_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { day: 'numeric', month: 'short' }),
            event: `${b.event_type}`,
            status: b.status === 'confirmed' ? t('Confirmed') : t('Pending'),
        }));

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/signin');
                return;
            }

            const { data: vendorData } = await supabase
                .from('vendors')
                .select('id, full_name, bio, avatar_url, portfolio_gallery, price_from, category, city')
                .eq('user_id', user.id)
                .single();

            if (vendorData) {
                setVendorId(vendorData.id);
                setVendorProfile(vendorData as VendorProfile);
            }

            setUser(user);
            setLoading(false);
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
            toast.success(action === 'confirmed'
                ? (language === 'he' ? '✅ ההזמנה אושרה!' : '✅ Booking confirmed!')
                : (language === 'he' ? 'ההזמנה נדחתה' : 'Booking declined')
            );
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Error updating booking');
        }
    };

    const copyProfileLink = () => {
        const link = `https://talentr-marketplace-mjnh-talentr.vercel.app/vendor/${vendorId}`;
        navigator.clipboard.writeText(link);
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
            color: 'from-blue-500 to-indigo-500',
        },
        {
            id: 'photos',
            icon: Camera,
            title: language === 'he' ? 'העלה תמונות' : 'Upload Portfolio Photos',
            description: language === 'he' ? 'הראה את העבודות הטובות שלך' : 'Show your best work',
            completed: !!(vendorProfile?.portfolio_gallery && vendorProfile.portfolio_gallery.length > 0),
            href: '/dashboard/settings',
            color: 'from-purple-500 to-pink-500',
            critical: true,
        },
        {
            id: 'pricing',
            icon: Tag,
            title: language === 'he' ? 'קבע מחירים' : 'Set your Pricing',
            description: language === 'he' ? 'קבע את תעריפי השירותים שלך' : 'Set your service rates',
            completed: !!(vendorProfile?.price_from && vendorProfile.price_from > 0),
            href: '/dashboard/settings',
            color: 'from-amber-500 to-orange-500',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">{language === 'he' ? 'טוען...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    const userName = user?.user_metadata?.full_name?.split(' ')[0] || vendorProfile?.full_name?.split(' ')[0] || 'Pro';

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                {/* Header */}
                <div className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10",
                    isRTL && "sm:flex-row-reverse"
                )}>
                    <div className={cn(isRTL && "text-right")}>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                            {getGreeting()}, {userName}!
                        </h1>
                        <div className={cn(
                            "flex items-center gap-2",
                            isRTL && "flex-row-reverse justify-end"
                        )}>
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-slate-500 font-medium text-sm">
                                {language === 'he' ? 'זמין להזמנות' : 'Available for bookings'}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            "inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl",
                            isRTL && "flex-row-reverse"
                        )}
                    >
                        <Pencil className="w-4 h-4" />
                        <span>{language === 'he' ? 'ערוך פרופיל' : 'Edit Profile'}</span>
                    </Link>
                </div>

                {/* Onboarding Widget */}
                {isNewUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 mb-10 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-36 -mt-36 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-2xl -ml-28 -mb-28 pointer-events-none" />

                        <div className="relative z-10">
                            <div className={cn(
                                "flex items-start gap-4 mb-8",
                                isRTL && "flex-row-reverse text-right"
                            )}>
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                    <Sparkles className="w-7 h-7 text-yellow-300" />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black mb-2">
                                        {language === 'he' ? '!Talentr-ברוכים הבאים ל' : 'Welcome to Talentr!'}
                                    </h2>
                                    <p className="text-white/80 text-base sm:text-lg">
                                        {language === 'he' ? 'בואו נכין את הפרופיל שלך להצלחה' : "Let's get your profile ready for success"}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className={cn(
                                    "flex items-center justify-between mb-3",
                                    isRTL && "flex-row-reverse"
                                )}>
                                    <span className="text-sm font-bold text-white/80">
                                        {language === 'he' ? 'התקדמות הפרופיל' : 'Profile Progress'}
                                    </span>
                                    <span className="text-2xl font-black">{profileCompletion}%</span>
                                </div>
                                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${profileCompletion}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Action Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {onboardingActions.map((action, index) => (
                                    <motion.div
                                        key={action.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Link
                                            href={action.href}
                                            className={cn(
                                                "block p-5 rounded-2xl transition-all group",
                                                action.completed
                                                    ? "bg-white/10 border-2 border-green-400/30"
                                                    : "bg-white/20 hover:bg-white/30 border-2 border-transparent hover:border-white/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex items-start justify-between mb-3",
                                                isRTL && "flex-row-reverse"
                                            )}>
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                                    action.completed ? "bg-green-500" : `bg-gradient-to-br ${action.color}`
                                                )}>
                                                    {action.completed ? (
                                                        <CheckCircle className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <action.icon className="w-6 h-6 text-white" />
                                                    )}
                                                </div>
                                                {action.critical && !action.completed && (
                                                    <span className="text-xs font-bold bg-red-500 px-2 py-1 rounded-full">
                                                        {language === 'he' ? 'קריטי!' : 'Critical!'}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={cn(
                                                "font-bold mb-1",
                                                action.completed ? "text-green-300 line-through" : "text-white",
                                                isRTL && "text-right"
                                            )}>
                                                {action.title}
                                            </h3>
                                            <p className={cn(
                                                "text-white/60 text-sm",
                                                isRTL && "text-right"
                                            )}>
                                                {action.description}
                                            </p>
                                            {!action.completed && (
                                                <div className={cn(
                                                    "mt-3 flex items-center gap-1 text-sm font-semibold text-white/80 group-hover:text-white transition-colors",
                                                    isRTL && "flex-row-reverse justify-end"
                                                )}>
                                                    <span>{language === 'he' ? 'התחל' : 'Start'}</span>
                                                    <ArrowRight className={cn(
                                                        "w-4 h-4 group-hover:translate-x-1 transition-transform",
                                                        isRTL && "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0"
                                                    )} />
                                                </div>
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
                        <div className={cn(
                            "flex items-center justify-between mb-4",
                            isRTL && "flex-row-reverse"
                        )}>
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                            {confirmedBookings > 0 && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                    {confirmedBookings} {language === 'he' ? 'הזמנות' : 'bookings'}
                                </span>
                            )}
                        </div>
                        <h3 className={cn(
                            "text-3xl font-black text-slate-900 mb-1",
                            isRTL && "text-right"
                        )}>
                            ₪{estimatedEarnings.toLocaleString()}
                        </h3>
                        <p className={cn(
                            "text-slate-500 text-sm",
                            isRTL && "text-right"
                        )}>
                            {language === 'he' ? 'סך הכנסות' : 'Total Earnings'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className={cn(
                            "text-3xl font-black text-slate-900 mb-1",
                            isRTL && "text-right"
                        )}>0</h3>
                        <p className={cn(
                            "text-slate-500 text-sm",
                            isRTL && "text-right"
                        )}>
                            {language === 'he' ? 'צפיות בפרופיל' : 'Profile Views'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className={cn(
                            "text-3xl font-black mb-1",
                            isRTL && "text-right"
                        )}>{pendingBookings}</h3>
                        <p className={cn(
                            "text-white/80 text-sm",
                            isRTL && "text-right"
                        )}>
                            {language === 'he' ? 'בקשות פעילות' : 'Active Requests'}
                        </p>
                    </div>
                </div>

                {/* Incoming Inquiries */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/50 mb-8">
                    <h2 className={cn(
                        "text-xl sm:text-2xl font-black text-slate-900 mb-6",
                        isRTL && "text-right"
                    )}>
                        {language === 'he' ? 'פניות נכנסות' : 'Incoming Inquiries'}
                    </h2>

                    {bookingsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : incomingRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Share2 className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {language === 'he' ? 'אין בקשות עדיין' : 'No requests yet'}
                            </h3>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                {language === 'he'
                                    ? 'שתף את הקישור לפרופיל שלך כדי להתחיל לקבל הזמנות'
                                    : 'Share your profile link to start getting bookings'}
                            </p>
                            <button
                                onClick={copyProfileLink}
                                className={cn(
                                    "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all",
                                    isRTL && "flex-row-reverse"
                                )}
                            >
                                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                <span>
                                    {copied
                                        ? (language === 'he' ? 'הועתק!' : 'Copied!')
                                        : (language === 'he' ? 'העתק קישור לפרופיל' : 'Copy profile link')}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {incomingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className={cn(
                                        "flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors gap-4",
                                        isRTL && "sm:flex-row-reverse"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center gap-4",
                                        isRTL && "flex-row-reverse"
                                    )}>
                                        <div className="text-center min-w-[50px]">
                                            <div className="text-2xl font-black text-blue-600">{request.date.split(' ')[0]}</div>
                                            <div className="text-xs text-slate-500 uppercase">{request.date.split(' ')[1]}</div>
                                        </div>
                                        <div className={isRTL ? "text-right" : ""}>
                                            <h3 className="font-bold text-slate-900">{request.eventType}</h3>
                                            <p className="text-sm text-slate-500">{language === 'he' ? 'סוג אירוע' : 'Event Type'}</p>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-6",
                                        isRTL && "flex-row-reverse"
                                    )}>
                                        <div className={isRTL ? "text-right" : ""}>
                                            <p className="font-semibold text-slate-900">{request.clientName}</p>
                                            <p className="text-sm text-slate-500">{language === 'he' ? 'לקוח' : 'Client'}</p>
                                        </div>
                                        <div className={isRTL ? "text-right" : ""}>
                                            <p className="font-black text-blue-600 text-lg">{request.budget}</p>
                                            <p className="text-sm text-slate-500">{language === 'he' ? 'תקציב' : 'Budget'}</p>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-2",
                                        isRTL && "flex-row-reverse"
                                    )}>
                                        <button
                                            onClick={() => handleBookingAction(request.id, 'confirmed')}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm",
                                                isRTL && "flex-row-reverse"
                                            )}
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>{language === 'he' ? 'אשר' : 'Accept'}</span>
                                        </button>
                                        <button
                                            onClick={() => handleBookingAction(request.id, 'declined')}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors text-sm",
                                                isRTL && "flex-row-reverse"
                                            )}
                                        >
                                            <X className="w-4 h-4" />
                                            <span>{language === 'he' ? 'דחה' : 'Decline'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/50">
                    <h2 className={cn(
                        "text-xl sm:text-2xl font-black text-slate-900 mb-6",
                        isRTL && "text-right"
                    )}>
                        {language === 'he' ? 'פעילות אחרונה' : 'Recent Activity'}
                    </h2>

                    {recentActivity.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>{language === 'he' ? 'פעילות תופיע כאן' : 'Activity will appear here'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 bg-slate-50 rounded-xl",
                                        isRTL && "flex-row-reverse"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center gap-4",
                                        isRTL && "flex-row-reverse"
                                    )}>
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className={isRTL ? "text-right" : ""}>
                                            <h3 className="font-bold text-slate-900">{activity.event}</h3>
                                            <p className="text-sm text-slate-500">{activity.date}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-sm font-bold",
                                            activity.status === (language === 'he' ? 'מאושר' : 'Confirmed') || activity.status === 'Confirmed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                        )}
                                    >
                                        {activity.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
