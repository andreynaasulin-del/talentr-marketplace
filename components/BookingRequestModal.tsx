'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { EVENT_TYPES } from '@/types/gig';

interface BookingRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    gig: {
        id: string;
        title: string;
        vendor_id: string;
        price_amount?: number;
        pricing_type?: string;
        duration_minutes?: number;
    };
    vendorName?: string;
    language: 'en' | 'he';
}

const translations = {
    en: {
        title: 'Request Booking',
        subtitle: 'Fill in the details for your event',
        yourInfo: 'Your Information',
        name: 'Your Name',
        email: 'Email',
        phone: 'Phone (optional)',
        whatsapp: 'WhatsApp (optional)',
        eventDetails: 'Event Details',
        eventType: 'Event Type',
        selectType: 'Select event type',
        date: 'Event Date',
        time: 'Event Time',
        location: 'Event Location',
        city: 'City',
        guests: 'Number of Guests',
        message: 'Message to Vendor',
        messagePlaceholder: 'Tell us about your event, any special requests...',
        budget: 'Budget Range',
        budgetPlaceholder: 'e.g. 1000-2000 ILS',
        submit: 'Send Request',
        submitting: 'Sending...',
        success: 'Request Sent!',
        successMessage: 'The vendor will contact you soon.',
        error: 'Failed to send request',
        required: 'Required fields',
        close: 'Close'
    },
    he: {
        title: 'בקשת הזמנה',
        subtitle: 'מלא את פרטי האירוע',
        yourInfo: 'הפרטים שלך',
        name: 'השם שלך',
        email: 'אימייל',
        phone: 'טלפון (אופציונלי)',
        whatsapp: 'וואטסאפ (אופציונלי)',
        eventDetails: 'פרטי האירוע',
        eventType: 'סוג האירוע',
        selectType: 'בחר סוג אירוע',
        date: 'תאריך האירוע',
        time: 'שעת האירוע',
        location: 'מיקום האירוע',
        city: 'עיר',
        guests: 'מספר אורחים',
        message: 'הודעה לספק',
        messagePlaceholder: 'ספר לנו על האירוע שלך, בקשות מיוחדות...',
        budget: 'טווח תקציב',
        budgetPlaceholder: 'לדוגמה: 1000-2000 ש"ח',
        submit: 'שלח בקשה',
        submitting: 'שולח...',
        success: 'הבקשה נשלחה!',
        successMessage: 'הספק יצור איתך קשר בקרוב.',
        error: 'שליחת הבקשה נכשלה',
        required: 'שדות חובה',
        close: 'סגור'
    }
};

export default function BookingRequestModal({ isOpen, onClose, gig, vendorName, language }: BookingRequestModalProps) {
    const t = translations[language];
    const isHebrew = language === 'he';

    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_whatsapp: '',
        event_type: '',
        event_date: '',
        event_time: '',
        event_location: '',
        event_city: '',
        guests_count: '',
        message: '',
        budget_range: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.client_name || !formData.client_email) {
            toast.error(language === 'he' ? 'נא למלא שם ואימייל' : 'Please fill in name and email');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gig_id: gig.id,
                    vendor_id: gig.vendor_id,
                    ...formData,
                    guests_count: formData.guests_count ? parseInt(formData.guests_count) : null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send request');
            }

            setSuccess(true);
            toast.success(t.success);

            // Reset form and close after delay
            setTimeout(() => {
                setFormData({
                    client_name: '',
                    client_email: '',
                    client_phone: '',
                    client_whatsapp: '',
                    event_type: '',
                    event_date: '',
                    event_time: '',
                    event_location: '',
                    event_city: '',
                    guests_count: '',
                    message: '',
                    budget_range: ''
                });
                setSuccess(false);
                onClose();
            }, 2000);

        } catch (err) {
            console.error('Booking error:', err);
            toast.error(t.error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl"
                        style={{ direction: isHebrew ? 'rtl' : 'ltr' }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t.title}</h2>
                                <p className="text-sm text-zinc-500">{gig.title}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        {success ? (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.success}</h3>
                                <p className="text-zinc-500">{t.successMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Your Info Section */}
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="text-lg">👤</span>
                                        {t.yourInfo}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                {t.name} *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.client_name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                {t.email} *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.client_email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                {t.phone}
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.client_phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                {t.whatsapp}
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.client_whatsapp}
                                                onChange={(e) => setFormData(prev => ({ ...prev, client_whatsapp: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Event Details Section */}
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="text-lg">🎉</span>
                                        {t.eventDetails}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                {t.eventType}
                                            </label>
                                            <select
                                                value={formData.event_type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            >
                                                <option value="">{t.selectType}</option>
                                                {EVENT_TYPES.map(type => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.icon} {type.label[language]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {t.date}
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.event_date}
                                                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {t.time}
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.event_time}
                                                onChange={(e) => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {t.city}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.event_city}
                                                onChange={(e) => setFormData(prev => ({ ...prev, event_city: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {t.guests}
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.guests_count}
                                                onChange={(e) => setFormData(prev => ({ ...prev, guests_count: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                {t.location}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.event_location}
                                                onChange={(e) => setFormData(prev => ({ ...prev, event_location: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Message Section */}
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        {t.message}
                                    </h3>
                                    <textarea
                                        rows={3}
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder={t.messagePlaceholder}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    />
                                </div>

                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                        💰 {t.budget}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.budget_range}
                                        onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                                        placeholder={t.budgetPlaceholder}
                                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t.submitting}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {t.submit}
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-zinc-400">
                                    * {t.required}
                                </p>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
