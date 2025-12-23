'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, MessageSquare, Briefcase, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

interface BookingModalProps {
    vendorId: string;
    vendorName: string;
    onClose: () => void;
}

export default function BookingModal({ vendorId, vendorName, onClose }: BookingModalProps) {
    const { t, language } = useLanguage();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        eventDate: '',
        eventType: 'Wedding',
        details: '',
    });

    useEffect(() => {
        const checkUser = async () => {
            // Check test mode first
            const testMode = localStorage.getItem('test_mode');
            const testUserData = localStorage.getItem('test_user');

            if (testMode === 'true' && testUserData) {
                const testUser = JSON.parse(testUserData);
                setUserId(testUser.id || 'test-user-id');
                return;
            }

            // Regular Supabase auth check
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If not logged in, show error and redirect after delay
                setError(t('loginRequired'));
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            } else {
                setUserId(user.id);
            }
        };
        checkUser();
    }, [router, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const { error: bookingError } = await supabase.from('bookings').insert([
                {
                    client_id: userId,
                    vendor_id: vendorId,
                    event_date: formData.eventDate,
                    event_type: formData.eventType,
                    details: formData.details,
                    status: 'pending',
                },
            ]);

            if (bookingError) throw bookingError;

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (err: any) {
            console.error('Booking error:', err);
            setError(err.message || 'Failed to send booking request');
        } finally {
            setLoading(false);
        }
    };

    const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Other'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Backdrop with strong blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-fade-in"
                onClick={onClose}
            />

            <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-premium relative animate-scale-in border border-white/20">
                {/* Visual Accent Top */}
                <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />

                {/* Header */}
                <div className="px-8 py-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{t('bookingTitle')}</h3>
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-1 opacity-80">{vendorName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all border border-gray-100 hover:scale-105 active:scale-95"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="px-8 pb-10">
                    {success ? (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="relative inline-block mb-8">
                                <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto relative z-10">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <div className="absolute inset-0 bg-green-200 rounded-3xl blur-xl opacity-40 animate-pulse" />
                            </div>
                            <h4 className="text-3xl font-black text-gray-900 mb-4">{t('bookingSuccess')}</h4>
                            <p className="text-gray-500 font-medium text-lg max-w-xs mx-auto">
                                {language === 'ru'
                                    ? 'Специалист свяжется с вами в ближайшее время для уточнения деталей.'
                                    : language === 'he'
                                        ? 'איש המקצוע יצור איתך קשר בהקדם לתיאום פרטים.'
                                        : 'The professional will contact you soon to coordinate details.'}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-slide-up">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {error}
                                </div>
                            )}

                            {/* Section: Event Date */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    {t('selectDate')}
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white focus:shadow-glow transition-all outline-none text-gray-900 font-bold text-lg"
                                />
                            </div>

                            {/* Section: Event Type */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    {t('eventTypeLabel')}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {eventTypes.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, eventType: type })}
                                            className={`
                                                h-14 px-4 rounded-2xl text-sm font-black transition-all border-2
                                                ${formData.eventType === type
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30'}
                                            `}
                                        >
                                            {t(type)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Message */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                    {t('messageToVendor')}
                                </label>
                                <textarea
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    className="w-full p-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white focus:shadow-glow transition-all outline-none text-gray-900 font-medium text-lg min-h-[140px] resize-none"
                                    placeholder={language === 'ru' ? 'Расскажите подробнее о вашем событии...' : language === 'he' ? 'ספר לנו עוד על האירוע שלך...' : 'Tell the pro more about your event...'}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !userId}
                                className="w-full h-18 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/30 active:scale-[0.98] py-5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                        <span className="uppercase tracking-widest">{t('sending')}</span>
                                    </>
                                ) : (
                                    <span className="uppercase tracking-widest">{t('sendRequestBtn')}</span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
