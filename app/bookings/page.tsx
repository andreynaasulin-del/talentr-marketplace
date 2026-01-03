'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Booking {
    id: string;
    event_date: string;
    event_type: string;
    details: string;
    status: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled';
    created_at: string;
    vendor: { id: string; name: string; category: string; city: string; image_url: string; };
}

export default function BookingsPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndFetchBookings = async () => {
            if (!supabase) { router.push('/signin'); return; }
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/signin'); return; }

            const { data, error } = await supabase
                .from('bookings')
                .select(`id, event_date, event_type, details, status, created_at, vendor:vendors(id, name, category, city, image_url)`)
                .eq('client_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                const transformedBookings = data.map((booking: { vendor: unknown[] | unknown } & Omit<Booking, 'vendor'>) => ({
                    ...booking,
                    vendor: Array.isArray(booking.vendor) ? booking.vendor[0] : booking.vendor
                })) as Booking[];
                setBookings(transformedBookings);
            }
            setLoading(false);
        };
        checkAuthAndFetchBookings();
    }, [router]);

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
            pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <Clock className="w-4 h-4" />, label: language === 'he' ? 'ממתין' : 'Pending' },
            confirmed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" />, label: language === 'he' ? 'מאושר' : 'Confirmed' },
            declined: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="w-4 h-4" />, label: language === 'he' ? 'נדחה' : 'Declined' },
            completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <CheckCircle className="w-4 h-4" />, label: language === 'he' ? 'הושלם' : 'Completed' },
            cancelled: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: <XCircle className="w-4 h-4" />, label: language === 'he' ? 'בוטל' : 'Cancelled' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${config.color}`}>{config.icon}{config.label}</span>;
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const pageTitle = language === 'he' ? 'ההזמנות שלי' : 'My Bookings';
    const emptyMessage = language === 'he' ? 'אין לך עדיין הזמנות' : 'You have no bookings yet';
    const browseText = language === 'he' ? 'חפש אנשי מקצוע' : 'Browse Professionals';

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">{pageTitle}</h1>
                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6"><Calendar className="w-10 h-10 text-gray-400" /></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{emptyMessage}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">{language === 'he' ? 'הזמינו את איש המקצוע הראשון!' : 'Book your first professional!'}</p>
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors">{browseText}</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <Link href={`/vendor/${booking.vendor?.id}`} className="flex-shrink-0">
                                        <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-700">
                                            {booking.vendor?.image_url ? <Image src={booking.vendor.image_url} alt={booking.vendor.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><User className="w-10 h-10 text-gray-400" /></div>}
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                            <div>
                                                <Link href={`/vendor/${booking.vendor?.id}`}><h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">{booking.vendor?.name || 'Unknown Vendor'}</h3></Link>
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                    <span>{booking.vendor?.category}</span><span>•</span><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{booking.vendor?.city}</span>
                                                </div>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Calendar className="w-4 h-4 text-blue-500" /><span className="font-medium">{formatDate(booking.event_date)}</span></div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs font-bold">{booking.event_type}</span></div>
                                        </div>
                                        {booking.details && <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{booking.details}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
