'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getVendorBookings, updateBookingStatus } from '@/lib/vendors';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User } from '@supabase/supabase-js';
import { DollarSign, Eye, Calendar, Check, X, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Booking {
    id: string;
    event_date: string;
    event_type: string;
    details: string | null;
    status: string;
    created_at: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Calculate real stats from bookings
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const estimatedEarnings = confirmedBookings * 2500; // Estimated avg per booking

    const stats = {
        earnings: {
            value: `₪${estimatedEarnings.toLocaleString()}`,
            trend: confirmedBookings > 0 ? `${confirmedBookings} bookings` : '',
            label: t('Total Earnings')
        },
        // Views tracking not implemented yet - show honest message
        views: {
            value: '—',
            trend: '',
            label: t('Profile Views'),
            comingSoon: true
        },
        requests: {
            value: String(pendingBookings),
            trend: '',
            label: t('Active Requests')
        },
    };

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

            // Get vendor ID for this user
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (vendorData) {
                setVendorId(vendorData.id);
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
            // Refresh bookings
            if (vendorId) {
                const data = await getVendorBookings(vendorId);
                setBookings(data as Booking[]);
            }
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('Good morning');
        if (hour < 18) return t('Good afternoon');
        return t('Good evening');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'David'}.
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-600 font-medium">Available for bookings</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Earnings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {stats.earnings.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.earnings.value}</h3>
                        <p className="text-gray-500 text-sm">{stats.earnings.label}</p>
                    </div>

                    {/* Profile Views - Coming Soon */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-100 rounded-xl">
                                <Eye className="w-6 h-6 text-gray-400" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                {language === 'ru' ? 'Скоро' : language === 'he' ? 'בקרוב' : 'Coming soon'}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-300 mb-1">—</h3>
                        <p className="text-gray-400 text-sm">{stats.views.label}</p>
                    </div>

                    {/* Active Requests */}
                    <div className="bg-blue-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.requests.value}</h3>
                        <p className="text-white/90 text-sm">{stats.requests.label}</p>
                    </div>
                </div>

                {/* Incoming Inquiries */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Incoming Inquiries')}</h2>

                    {bookingsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : incomingRequests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {language === 'ru' ? 'Нет новых запросов' : language === 'he' ? 'אין בקשות חדשות' : 'No new requests'}
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
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Recent Activity')}</h2>

                    {recentActivity.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {language === 'ru' ? 'Нет недавней активности' : language === 'he' ? 'אין פעילות אחרונה' : 'No recent activity'}
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
