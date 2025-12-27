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
    Pencil, Image, FileText, Tag, Share2, Copy, CheckCircle,
    Sparkles, ArrowRight, Camera, User as UserIcon
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
            date: new Date(b.event_date).toLocaleDateString(language === 'he' ? 'he-IL' : language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }),
            eventType: b.event_type,
            clientName: 'Client',
            budget: '₪2,500',
        }));

    const recentActivity = bookings
        .filter(b => b.status !== 'pending')
        .slice(0, 3)
        .map(b => ({
            id: b.id,
            date: new Date(b.event_date).toLocaleDateString(language === 'he' ? 'he-IL' : language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }),
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

            // Get vendor profile for this user
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

    // Fetch bookings when vendorId is available
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

    // Handle accept/decline booking
    const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'declined') => {
        try {
            await updateBookingStatus(bookingId, action);
            if (vendorId) {
                const data = await getVendorBookings(vendorId);
                setBookings(data as Booking[]);
            }
            toast.success(action === 'confirmed'
                ? (language === 'ru' ? '✅ Бронирование подтверждено!' : '✅ Booking confirmed!')
                : (language === 'ru' ? 'Бронирование отклонено' : 'Booking declined')
            );
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Error updating booking');
        }
    };

    // Copy profile link
    const copyProfileLink = () => {
        const link = `https://event-marketplace-mvp.vercel.app/vendor/${vendorId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success(language === 'ru' ? '🔗 Ссылка скопирована!' : '🔗 Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('Good morning');
        if (hour < 18) return t('Good afternoon');
        return t('Good evening');
    };

    // Onboarding action cards
    const onboardingActions = [
        {
            id: 'bio',
            icon: FileText,
            title: language === 'ru' ? 'Заполните описание' : language === 'he' ? 'מלא את הביוגרפיה' : 'Complete your Bio',
            description: language === 'ru' ? 'Расскажите о себе и своих услугах' : 'Tell clients about yourself',
            completed: !!(vendorProfile?.bio && vendorProfile.bio.length > 10),
            href: '/dashboard/settings',
            color: 'from-blue-500 to-indigo-500',
        },
        {
            id: 'photos',
            icon: Camera,
            title: language === 'ru' ? 'Загрузите фото' : language === 'he' ? 'העלה תמונות' : 'Upload Portfolio Photos',
            description: language === 'ru' ? 'Покажите свои лучшие работы' : 'Show your best work',
            completed: !!(vendorProfile?.portfolio_gallery && vendorProfile.portfolio_gallery.length > 0),
            href: '/dashboard/settings',
            color: 'from-purple-500 to-pink-500',
            critical: true,
        },
        {
            id: 'pricing',
            icon: Tag,
            title: language === 'ru' ? 'Установите цены' : language === 'he' ? 'קבע מחירים' : 'Set your Pricing',
            description: language === 'ru' ? 'Укажите стоимость услуг' : 'Set your service rates',
            completed: !!(vendorProfile?.price_from && vendorProfile.price_from > 0),
            href: '/dashboard/settings',
            color: 'from-amber-500 to-orange-500',
        },
    ];

    const completedActions = onboardingActions.filter(a => a.completed).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                {/* Header with Edit Profile Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || vendorProfile?.full_name?.split(' ')[0] || 'Pro'}!
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-600 font-medium">
                                {language === 'ru' ? 'Доступен для бронирований' : 'Available for bookings'}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                        <Pencil className="w-5 h-5" />
                        {language === 'ru' ? 'Редактировать профиль' : language === 'he' ? 'ערוך פרופיל' : 'Edit My Profile'}
                    </Link>
                </div>

                {/* 🚀 Onboarding Progress Widget - Only show for new users */}
                {isNewUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 mb-8 text-white relative overflow-hidden"
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24" />

                        <div className="relative z-10">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-7 h-7 text-yellow-300" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black mb-2">
                                        {language === 'ru' ? 'Добро пожаловать в Talentr!' : 'Welcome to Talentr!'}
                                    </h2>
                                    <p className="text-white/80 text-lg">
                                        {language === 'ru' ? 'Давайте подготовим ваш профиль к успеху' : "Let's get your profile ready for success"}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-white/80">
                                        {language === 'ru' ? 'Прогресс профиля' : 'Profile Progress'}
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                            <div className="flex items-start justify-between mb-3">
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
                                                        {language === 'ru' ? 'Важно!' : 'Critical!'}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={cn(
                                                "font-bold mb-1",
                                                action.completed ? "text-green-300 line-through" : "text-white"
                                            )}>
                                                {action.title}
                                            </h3>
                                            <p className="text-white/60 text-sm">{action.description}</p>
                                            {!action.completed && (
                                                <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                                                    {language === 'ru' ? 'Начать' : 'Start'}
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Earnings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                            {confirmedBookings > 0 && (
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    {confirmedBookings} {language === 'ru' ? 'брон.' : 'bookings'}
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">₪{estimatedEarnings.toLocaleString()}</h3>
                        <p className="text-gray-500 text-sm">{t('Total Earnings')}</p>
                    </div>

                    {/* Profile Views */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">0</h3>
                        <p className="text-gray-500 text-sm">{t('Profile Views')}</p>
                    </div>

                    {/* Active Requests */}
                    <div className="bg-blue-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{pendingBookings}</h3>
                        <p className="text-white/90 text-sm">{t('Active Requests')}</p>
                    </div>
                </div>

                {/* Incoming Inquiries */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Incoming Inquiries')}</h2>

                    {bookingsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : incomingRequests.length === 0 ? (
                        /* Empty state with CTA */
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Share2 className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ru' ? 'Пока нет запросов' : 'No requests yet'}
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                {language === 'ru'
                                    ? 'Поделитесь ссылкой на профиль, чтобы получать бронирования'
                                    : 'Share your profile link to start getting bookings'}
                            </p>
                            <button
                                onClick={copyProfileLink}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                            >
                                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied
                                    ? (language === 'ru' ? 'Скопировано!' : 'Copied!')
                                    : (language === 'ru' ? 'Копировать ссылку на профиль' : 'Copy profile link')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {incomingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-4"
                                >
                                    {/* Left: Date & Event Type */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{request.date.split(' ')[0]}</div>
                                            <div className="text-sm text-gray-500">{request.date.split(' ')[1]}</div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{request.eventType}</h3>
                                            <p className="text-sm text-gray-500">{t('Event Type')}</p>
                                        </div>
                                    </div>

                                    {/* Center: Client & Budget */}
                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="font-semibold text-gray-900">{request.clientName}</p>
                                            <p className="text-sm text-gray-500">{t('Client')}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-blue-600 text-lg">{request.budget}</p>
                                            <p className="text-sm text-gray-500">{t('Budget')}</p>
                                        </div>
                                    </div>

                                    {/* Right: Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleBookingAction(request.id, 'confirmed')}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                            {t('Accept')}
                                        </button>
                                        <button
                                            onClick={() => handleBookingAction(request.id, 'declined')}
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            {t('Decline')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Recent Activity')}</h2>

                    {recentActivity.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>{language === 'ru' ? 'Активность появится здесь' : 'Activity will appear here'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{activity.event}</h3>
                                            <p className="text-sm text-gray-500">{activity.date}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-medium ${activity.status === t('Confirmed')
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {activity.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
