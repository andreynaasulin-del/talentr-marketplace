'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Check, User, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name is required'),
    phone: z.string().min(9, 'Valid phone number is required'),
    bio: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type ProfileSchema = z.infer<typeof profileSchema>;

interface ProfileStepProps {
    gigId: string;
    onSuccess: (link?: string) => void;
    inviteToken?: string | null;
    pendingVendor?: any;
}

export default function ProfileStep({ gigId, onSuccess, inviteToken, pendingVendor }: ProfileStepProps) {
    console.log('[ProfileStep] Component rendered with props:', { gigId, inviteToken, hasPendingVendor: !!pendingVendor });

    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const t = {
        en: {
            title: 'One Last Step',
            subtitle: 'Tell us a bit about yourself to finish setup.',
            nameLabel: 'Full Name / Display Name',
            namePlaceholder: 'e.g. John Doe',
            phoneLabel: 'Phone (WhatsApp)',
            phonePlaceholder: '050-1234567',
            bioLabel: 'Short Bio',
            bioPlaceholder: 'I have been a photographer for 5 years...',
            termsPrefix: 'I agree to the ',
            termsLink: 'Terms of Service',
            andText: ' and ',
            privacyLink: 'Privacy Policy',
            complete: 'Complete Setup',
        },
        he: {
            title: 'שלב אחרון',
            subtitle: 'ספר לנו קצת על עצמך כדי לסיים את ההגדרה.',
            nameLabel: 'שם מלא / שם תצוגה',
            namePlaceholder: 'למשל: ישראל ישראלי',
            phoneLabel: 'טלפון (WhatsApp)',
            phonePlaceholder: '050-1234567',
            bioLabel: 'ביו קצר',
            bioPlaceholder: 'אני צלם עם 5 שנות ניסיון...',
            termsPrefix: 'אני מסכים ל',
            termsLink: 'תנאי השימוש',
            andText: ' ו',
            privacyLink: 'מדיניות הפרטיות',
            complete: 'סיום הגדרה',
        },
    }[lang];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: pendingVendor?.name || '',
            phone: pendingVendor?.phone || '',
            bio: pendingVendor?.description || '',
        }
    });

    const onSubmit = async (data: ProfileSchema) => {
        setLoading(true);
        trackEvent(AnalyticsEvents.PROFILE_FILL_SUBMIT, data);

        try {
            // ============================================
            // INVITE FLOW (Guest/Anonymous)
            // ============================================
            if (inviteToken) {
                console.log('[ProfileStep] INVITE FLOW - gigId:', gigId, 'inviteToken:', inviteToken);

                // 1. Confirm Pending Vendor -> Create Real Vendor + Link Gig (atomic operation)
                const confirmRes = await fetch(`/api/confirm/${inviteToken}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'confirm',
                        gigId, // Pass gigId for server-side linking
                        updates: {
                            name: data.full_name,
                            phone: data.phone,
                            description: data.bio,
                            email: pendingVendor?.email // Keep original email
                        }
                    })
                });

                if (!confirmRes.ok) throw new Error('Failed to confirm profile');
                const confirmData = await confirmRes.json();
                const { editLink, gigLinked } = confirmData;

                // Log if gig linking failed (but don't block user)
                if (gigId && !gigLinked) {
                    console.error('Gig was not linked to vendor');
                    toast.error('Warning: Gig may not be linked to your profile');
                }

                onSuccess(editLink);
                return;
            }


            // ============================================
            // STANDARD FLOW (Authenticated)
            // ============================================
            if (!supabase) throw new Error('Supabase client not initialized');
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user found');

            // Use server-side API to create/find vendor and link gig
            const res = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    gig_id: gigId,
                    full_name: data.full_name,
                    phone: data.phone,
                    bio: data.bio,
                    email: user.email
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to complete onboarding');
            }

            const { editLink } = await res.json();
            onSuccess(editLink);

        } catch (error: any) {
            toast.error(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto space-y-8 p-6"
            dir={lang === 'he' ? 'rtl' : 'ltr'}
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                    {t.title}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    {t.subtitle}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <User className="w-4 h-4" /> {t.nameLabel}
                    </label>
                    <input
                        {...register('full_name')}
                        placeholder={t.namePlaceholder}
                        className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {t.phoneLabel}
                    </label>
                    <input
                        {...register('phone')}
                        placeholder={t.phonePlaceholder}
                        className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> {t.bioLabel}
                    </label>
                    <textarea
                        {...register('bio')}
                        rows={3}
                        placeholder={t.bioPlaceholder}
                        className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                    <input
                        type="checkbox"
                        {...register('terms')}
                        className="mt-1 w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {t.termsPrefix}<a href="/terms" className="text-blue-500 hover:underline">{t.termsLink}</a>{t.andText}<a href="/privacy" className="text-blue-500 hover:underline">{t.privacyLink}</a>.
                        {errors.terms && <p className="text-red-500 text-xs mt-1 block">{errors.terms.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {t.complete}
                            <Check className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
