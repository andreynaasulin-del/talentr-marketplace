'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Calendar, Settings, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { getVendorBookings } from '@/lib/vendors';

interface Booking {
    id: string;
    event_date: string;
    event_type: string;
    status: string;
    created_at: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';
    const isRTL = lang === 'he';

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const content = {
        en: {
            dashboard: 'Dashboard',
            bookings: 'Bookings',
            settings: 'Settings',
            logout: 'Logout',
            pending: 'Pending',
            confirmed: 'Confirmed',
            completed: 'Completed',
            noBookings: 'No bookings yet',
            loadingError: 'Please sign in to view dashboard',
        },
        he: {
            dashboard: 'לוח בקרה',
            bookings: 'הזמנות',
            settings: 'הגדרות',
            logout: 'יציאה',
            pending: 'ממתין',
            confirmed: 'מאושר',
            completed: 'הושלם',
            noBookings: 'אין הזמנות עדיין',
            loadingError: 'יש להתחבר לצפייה בלוח הבקרה',
        },
    };

    const t = content[lang];

    useEffect(() => {
        const checkAuth = async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }

            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (!currentUser) {
                    router.push('/signin');
                    return;
                }
                setUser(currentUser);

                // Fetch bookings
                const vendorBookings = await getVendorBookings(currentUser.id);
                setBookings(vendorBookings);
            } catch (err) {
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">{t.loadingError}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-12 pb-6 border-b border-gray-200">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.dashboard}</h1>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href="/dashboard/settings"
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="p-6 border border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">{t.pending}</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {bookings.filter(b => b.status === 'pending').length}
                        </p>
                    </div>
                    <div className="p-6 border border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">{t.confirmed}</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {bookings.filter(b => b.status === 'confirmed').length}
                        </p>
                    </div>
                    <div className="p-6 border border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">{t.completed}</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {bookings.filter(b => b.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Bookings List */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t.bookings}</h2>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12 border border-gray-200 rounded-xl">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">{t.noBookings}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="p-4 sm:p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                                                {booking.event_type}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(booking.event_date).toLocaleDateString(
                                                    lang === 'he' ? 'he-IL' : 'en-US',
                                                    { day: 'numeric', month: 'long', year: 'numeric' }
                                                )}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(booking.status)}`}>
                                            {t[booking.status as keyof typeof t] || booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
