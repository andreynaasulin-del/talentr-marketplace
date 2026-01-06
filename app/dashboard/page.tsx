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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.dashboard}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {user?.email || ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard/settings"
                                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-gray-200"
                                title={t.settings}
                            >
                                <Settings className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-gray-200"
                                title={t.logout}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t.pending}</p>
                        <p className="text-3xl font-bold text-amber-600">
                            {bookings.filter(b => b.status === 'pending').length}
                        </p>
                    </div>
                    <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t.confirmed}</p>
                        <p className="text-3xl font-bold text-green-600">
                            {bookings.filter(b => b.status === 'confirmed').length}
                        </p>
                    </div>
                    <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t.completed}</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {bookings.filter(b => b.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <Link
                        href="/dashboard/settings"
                        className="p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                        <Settings className="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-3 transition-colors" />
                        <h3 className="font-semibold text-gray-900 mb-1">{t.settings}</h3>
                        <p className="text-sm text-gray-600">
                            {lang === 'he' ? 'עדכן את הפרופיל שלך' : 'Update your profile'}
                        </p>
                    </Link>
                    <Link
                        href="/"
                        className="p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                        <Calendar className="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-3 transition-colors" />
                        <h3 className="font-semibold text-gray-900 mb-1">
                            {lang === 'he' ? 'חזור לדף הבית' : 'Back to Home'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {lang === 'he' ? 'גלה עוד שירותים' : 'Discover more services'}
                        </p>
                    </Link>
                </div>

                {/* Bookings List */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t.bookings}</h2>

                    {bookings.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium mb-2">{t.noBookings}</p>
                            <p className="text-sm text-gray-500">
                                {lang === 'he' ? 'ההזמנות שלך יופיעו כאן' : 'Your bookings will appear here'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 mb-1 truncate">
                                                {booking.event_type}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(booking.event_date).toLocaleDateString(
                                                    lang === 'he' ? 'he-IL' : 'en-US',
                                                    { day: 'numeric', month: 'long', year: 'numeric' }
                                                )}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusColor(booking.status)}`}>
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
