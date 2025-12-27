'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, MessageSquare, Users, Clock, Briefcase,
    Loader2, CheckCircle, ChevronRight, Sparkles, PartyPopper
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface BookingModalProps {
    vendorId: string;
    vendorName: string;
    vendorCategory?: string;
    vendorPrice?: number;
    onClose: () => void;
}

// Event types with localization and icons
const EVENT_TYPES = [
    { id: 'wedding', icon: '💍', en: 'Wedding', ru: 'Свадьба', he: 'חתונה' },
    { id: 'bar_mitzvah', icon: '✡️', en: 'Bar/Bat Mitzvah', ru: 'Бар/Бат Мицва', he: 'בר/בת מצווה' },
    { id: 'birthday', icon: '🎂', en: 'Birthday', ru: 'День рождения', he: 'יום הולדת' },
    { id: 'corporate', icon: '💼', en: 'Corporate', ru: 'Корпоратив', he: 'אירוע עסקי' },
    { id: 'party', icon: '🎉', en: 'Party', ru: 'Вечеринка', he: 'מסיבה' },
    { id: 'anniversary', icon: '❤️', en: 'Anniversary', ru: 'Годовщина', he: 'יום נישואין' },
    { id: 'graduation', icon: '🎓', en: 'Graduation', ru: 'Выпускной', he: 'סיום' },
    { id: 'other', icon: '✨', en: 'Other', ru: 'Другое', he: 'אחר' },
];

// Guest count options
const GUEST_OPTIONS = [
    { value: '1-20', label: { en: 'Intimate (1-20)', ru: 'Камерное (1-20)', he: 'אינטימי (1-20)' } },
    { value: '21-50', label: { en: 'Small (21-50)', ru: 'Небольшое (21-50)', he: 'קטן (21-50)' } },
    { value: '51-100', label: { en: 'Medium (51-100)', ru: 'Среднее (51-100)', he: 'בינוני (51-100)' } },
    { value: '101-200', label: { en: 'Large (101-200)', ru: 'Большое (101-200)', he: 'גדול (101-200)' } },
    { value: '200+', label: { en: 'Grand (200+)', ru: 'Грандиозное (200+)', he: 'גרנדיוזי (200+)' } },
];

type Step = 'event' | 'details' | 'message' | 'confirm';

export default function BookingModal({
    vendorId,
    vendorName,
    vendorCategory,
    vendorPrice,
    onClose
}: BookingModalProps) {
    const { t, language } = useLanguage();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState<Step>('event');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        eventType: '',
        eventDate: '',
        eventTime: '',
        guestCount: '',
        details: '',
    });

    // Check authentication
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error(t('loginRequired'), {
                    description: language === 'ru'
                        ? 'Войдите чтобы забронировать'
                        : language === 'he'
                            ? 'התחבר כדי להזמין'
                            : 'Sign in to make a booking'
                });
                setTimeout(() => router.push('/signin?redirect=/bookings'), 1500);
            } else {
                setUserId(user.id);
            }
        };
        checkUser();
    }, [router, t, language]);

    const getEventLabel = (event: typeof EVENT_TYPES[0]) => {
        return event[language as keyof typeof event] || event.en;
    };

    const getGuestLabel = (option: typeof GUEST_OPTIONS[0]) => {
        return option.label[language as keyof typeof option.label] || option.label.en;
    };

    const steps: { id: Step; label: string }[] = [
        { id: 'event', label: language === 'ru' ? 'Событие' : language === 'he' ? 'אירוע' : 'Event' },
        { id: 'details', label: language === 'ru' ? 'Детали' : language === 'he' ? 'פרטים' : 'Details' },
        { id: 'message', label: language === 'ru' ? 'Сообщение' : language === 'he' ? 'הודעה' : 'Message' },
        { id: 'confirm', label: language === 'ru' ? 'Готово' : language === 'he' ? 'סיום' : 'Confirm' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const canProceed = () => {
        switch (currentStep) {
            case 'event': return !!formData.eventType;
            case 'details': return !!formData.eventDate;
            case 'message': return true;
            case 'confirm': return true;
            default: return false;
        }
    };

    const nextStep = () => {
        const stepOrder: Step[] = ['event', 'details', 'message', 'confirm'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const prevStep = () => {
        const stepOrder: Step[] = ['event', 'details', 'message', 'confirm'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    const handleSubmit = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            // Fetch user data for email
            const { data: { user } } = await supabase.auth.getUser();
            const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client';
            const userEmail = user?.email;

            // Fetch vendor email
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('user_id')
                .eq('id', vendorId)
                .single();

            let vendorEmail: string | null = null;
            if (vendorData?.user_id) {
                // Get vendor's email from auth.users via their profile
                const { data: vendorUser } = await supabase
                    .from('vendors')
                    .select('email')
                    .eq('id', vendorId)
                    .single();
                vendorEmail = vendorUser?.email || null;
            }

            // Save booking to Supabase
            const { error: bookingError } = await supabase.from('bookings').insert([{
                client_id: userId,
                vendor_id: vendorId,
                event_date: formData.eventDate,
                event_type: formData.eventType,
                details: JSON.stringify({
                    time: formData.eventTime,
                    guests: formData.guestCount,
                    message: formData.details,
                }),
                status: 'pending',
            }]);

            if (bookingError) throw bookingError;

            // 🎉 Success!
            setSuccess(true);
            celebrateSuccess();

            // Send email notifications (fire and forget)
            const emailPayload = {
                vendorName,
                clientName: userName,
                eventDate: formData.eventDate,
                eventType: formData.eventType,
                message: formData.details
            };

            // Send confirmation to client
            if (userEmail) {
                fetch('/api/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        template: 'booking_confirmation',
                        to: userEmail,
                        ...emailPayload
                    })
                }).catch((err) => console.log('Email send failed:', err));
            }

            // Send notification to vendor
            if (vendorEmail) {
                fetch('/api/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        template: 'vendor_notification',
                        to: vendorEmail,
                        ...emailPayload
                    })
                }).catch((err) => console.log('Vendor email failed:', err));
            }

            toast.success(
                language === 'ru' ? '🎉 Заявка отправлена!'
                    : language === 'he' ? '🎉 הבקשה נשלחה!'
                        : '🎉 Booking Sent!',
                {
                    description: language === 'ru'
                        ? `${vendorName} получит уведомление`
                        : language === 'he'
                            ? `${vendorName} יקבל התראה`
                            : `${vendorName} will be notified`,
                }
            );

            setTimeout(() => onClose(), 4000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send booking';
            setError(errorMessage);
            toast.error(language === 'ru' ? 'Ошибка' : language === 'he' ? 'שגיאה' : 'Error', {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const celebrateSuccess = () => {
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

        // Burst from center
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors });

        // Side bursts
        setTimeout(() => {
            confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
            confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
        }, 200);

        // Golden final burst
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 100,
                origin: { y: 0.4 },
                colors: ['#fbbf24', '#f59e0b', '#fcd34d']
            });
        }, 400);
    };

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
                {/* Gradient top */}
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">
                            {language === 'ru' ? 'Забронировать' : language === 'he' ? 'הזמנה' : 'Book Now'}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">{vendorName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Progress Steps */}
                {!success && (
                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                                    idx <= currentStepIndex
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-500"
                                )}>
                                    {idx + 1}
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={cn(
                                        "w-8 h-0.5 mx-1",
                                        idx < currentStepIndex ? "bg-blue-600" : "bg-gray-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-6 min-h-[320px]">
                    <AnimatePresence mode="wait" custom={1}>
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="relative inline-block mb-6"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                                        <PartyPopper className="w-12 h-12 text-white" />
                                    </div>
                                </motion.div>
                                <h4 className="text-2xl font-black text-gray-900 mb-2">
                                    {language === 'ru' ? 'Заявка отправлена!' : language === 'he' ? 'הבקשה נשלחה!' : 'Request Sent!'}
                                </h4>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    {language === 'ru'
                                        ? `${vendorName} получит уведомление и свяжется с вами`
                                        : language === 'he'
                                            ? `${vendorName} יקבל הודעה ויצור קשר`
                                            : `${vendorName} will receive a notification and contact you`}
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Step 1: Event Type */}
                                {currentStep === 'event' && (
                                    <motion.div
                                        key="event"
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        custom={1}
                                    >
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-blue-500" />
                                            {language === 'ru' ? 'Какое мероприятие?' : language === 'he' ? 'איזה אירוע?' : 'What type of event?'}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {EVENT_TYPES.map((event) => (
                                                <button
                                                    key={event.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, eventType: event.id })}
                                                    className={cn(
                                                        "p-4 rounded-2xl text-left transition-all border-2",
                                                        formData.eventType === event.id
                                                            ? "bg-blue-50 border-blue-500 shadow-lg shadow-blue-500/10"
                                                            : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <span className="text-2xl mb-2 block">{event.icon}</span>
                                                    <span className={cn(
                                                        "font-bold text-sm",
                                                        formData.eventType === event.id ? "text-blue-700" : "text-gray-700"
                                                    )}>
                                                        {getEventLabel(event)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Date & Details */}
                                {currentStep === 'details' && (
                                    <motion.div
                                        key="details"
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        custom={1}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                {language === 'ru' ? 'Дата события' : language === 'he' ? 'תאריך האירוע' : 'Event Date'} *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.eventDate}
                                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                                className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                {language === 'ru' ? 'Время (опционально)' : language === 'he' ? 'שעה (אופציונלי)' : 'Time (optional)'}
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.eventTime}
                                                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                                                className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                                <Users className="w-4 h-4 text-blue-500" />
                                                {language === 'ru' ? 'Количество гостей' : language === 'he' ? 'מספר אורחים' : 'Guest Count'}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {GUEST_OPTIONS.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, guestCount: option.value })}
                                                        className={cn(
                                                            "p-3 rounded-xl text-sm font-medium transition-all border-2",
                                                            formData.guestCount === option.value
                                                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                                                : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                                                        )}
                                                    >
                                                        {getGuestLabel(option)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Message */}
                                {currentStep === 'message' && (
                                    <motion.div
                                        key="message"
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        custom={1}
                                    >
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                            <MessageSquare className="w-4 h-4 text-blue-500" />
                                            {language === 'ru' ? 'Сообщение для специалиста' : language === 'he' ? 'הודעה לאיש המקצוע' : 'Message to the pro'}
                                        </label>
                                        <textarea
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 min-h-[180px] resize-none"
                                            placeholder={
                                                language === 'ru'
                                                    ? 'Расскажите подробнее о вашем мероприятии, пожеланиях, особых требованиях...'
                                                    : language === 'he'
                                                        ? 'ספר לנו עוד על האירוע שלך, העדפות, דרישות מיוחדות...'
                                                        : 'Tell us more about your event, preferences, special requirements...'
                                            }
                                        />
                                    </motion.div>
                                )}

                                {/* Step 4: Confirm */}
                                {currentStep === 'confirm' && (
                                    <motion.div
                                        key="confirm"
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        custom={1}
                                        className="space-y-4"
                                    >
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                                            {language === 'ru' ? 'Подтвердите детали' : language === 'he' ? 'אשר פרטים' : 'Confirm Details'}
                                        </h4>

                                        <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">{language === 'ru' ? 'Специалист' : language === 'he' ? 'איש מקצוע' : 'Professional'}</span>
                                                <span className="font-bold text-gray-900">{vendorName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">{language === 'ru' ? 'Событие' : language === 'he' ? 'אירוע' : 'Event'}</span>
                                                <span className="font-bold text-gray-900">
                                                    {EVENT_TYPES.find(e => e.id === formData.eventType)?.icon} {getEventLabel(EVENT_TYPES.find(e => e.id === formData.eventType) || EVENT_TYPES[0])}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">{language === 'ru' ? 'Дата' : language === 'he' ? 'תאריך' : 'Date'}</span>
                                                <span className="font-bold text-gray-900">{formData.eventDate}</span>
                                            </div>
                                            {formData.eventTime && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">{language === 'ru' ? 'Время' : language === 'he' ? 'שעה' : 'Time'}</span>
                                                    <span className="font-bold text-gray-900">{formData.eventTime}</span>
                                                </div>
                                            )}
                                            {formData.guestCount && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">{language === 'ru' ? 'Гостей' : language === 'he' ? 'אורחים' : 'Guests'}</span>
                                                    <span className="font-bold text-gray-900">{formData.guestCount}</span>
                                                </div>
                                            )}
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                                                {error}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {!success && (
                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3 border-t border-gray-100">
                        {currentStep !== 'event' ? (
                            <button
                                onClick={prevStep}
                                className="px-5 py-3 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                            >
                                {language === 'ru' ? 'Назад' : language === 'he' ? 'חזרה' : 'Back'}
                            </button>
                        ) : (
                            <div />
                        )}

                        {currentStep === 'confirm' ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !userId}
                                className="flex-1 max-w-[200px] py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        {language === 'ru' ? 'Отправить' : language === 'he' ? 'שלח' : 'Submit'}
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="flex-1 max-w-[200px] py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {language === 'ru' ? 'Далее' : language === 'he' ? 'הבא' : 'Next'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
