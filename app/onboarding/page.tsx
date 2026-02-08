'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles, Plus, LayoutDashboard } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';
import GigStep from './steps/GigStep';
import ProfileStep from './steps/ProfileStep';

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';

    const t = {
        en: {
            allSet: 'All Set!',
            profileActive: 'Your profile is active and your gig is under review.',
            saveLink: 'IMPORTANT: SAVE THIS LINK',
            saveLinkDesc: 'This is your personal dashboard link. Use it to edit your profile and manage gigs anytime. You do NOT need a password.',
            goToDashboard: 'Go to My Dashboard',
            createAnother: 'Create Another Gig',
        },
        he: {
            allSet: 'הכל מוכן!',
            profileActive: 'הפרופיל שלך פעיל והגיג שלך בבדיקה.',
            saveLink: 'חשוב: שמור את הקישור הזה',
            saveLinkDesc: 'זהו קישור הדשבורד האישי שלך. השתמש בו כדי לערוך את הפרופיל שלך ולנהל גיגים בכל עת. לא צריך סיסמה.',
            goToDashboard: 'לדשבורד שלי',
            createAnother: 'צור גיג נוסף',
        },
    }[lang];

    // State
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [gigId, setGigId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [pendingVendor, setPendingVendor] = useState<any>(null);
    const [editLink, setEditLink] = useState<string | null>(null);

    useEffect(() => {
        checkUserAndState();
    }, []);

    const checkUserAndState = async () => {
        try {
            // 1. Check Auth
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If not logged in, we might want to redirect or allow "Guest Draft" mode.
                // For now, consistent with "Invite" flow, we assume they should be logged in.
            }
            setUserId(user?.id);

            // 2. Check URL for Gig ID (Resuming)
            const paramGigId = searchParams.get('gigId');
            if (paramGigId) {
                setGigId(paramGigId);
                // Verify status
                const { data: gig } = await supabase.from('gigs').select('status').eq('id', paramGigId).single();
                if (gig) {
                    if (gig.status === 'draft' || gig.status === 'draft_profile_missing') {
                        setStep(2);
                        trackEvent(AnalyticsEvents.PROFILE_FILL_START, { gigId: paramGigId });
                    } else {
                        // Already active?
                        setStep(3);
                    }
                }
            } else {
                // New Session
                trackEvent(AnalyticsEvents.GIG_CREATE_START);
            }

            // 3. Check for Invite Token
            const invite = searchParams.get('invite');
            if (invite) {
                setInviteToken(invite);
                // Fetch pending vendor
                const res = await fetch(`/api/confirm/${invite}`);
                if (res.ok) {
                    const data = await res.json();
                    setPendingVendor(data.pending);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleGigSuccess = (gig: any) => {
        setGigId(gig.id);
        setStep(2);
        // Push to URL so refresh works
        router.push(`/onboarding?gigId=${gig.id}`);
        trackEvent(AnalyticsEvents.PROFILE_FILL_START, { gigId: gig.id });
    };

    const handleProfileSuccess = (link?: string) => {
        setStep(3);
        if (link) setEditLink(link);
        trackEvent(AnalyticsEvents.INVITE_OPENED, { status: 'completed' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col relative">
            {/* Language Switcher (Explicitly Added) */}
            <div className="absolute top-4 right-4 z-[100]">
                <button
                    onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 text-2xl hover:scale-110 transition-transform"
                    title="Switch Language"
                >
                    {language === 'en' ? '🇺🇸' : '🇮🇱'}
                </button>
            </div>

            {/* Header / Progress */}
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 sticky top-0 z-50">
                <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <AnimatePresence mode="wait">

                    {step === 1 && (
                        <GigStep
                            key="step1"
                            onSuccess={handleGigSuccess}
                            userId={userId}
                            inviteToken={inviteToken}
                        />
                    )}

                    {step === 2 && gigId && (
                        <ProfileStep
                            key="step2"
                            gigId={gigId}
                            onSuccess={handleProfileSuccess}
                            inviteToken={inviteToken}
                            pendingVendor={pendingVendor}
                        />
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 max-w-lg mx-auto"
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                        >
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-12 h-12 text-green-600 dark:text-green-500" />
                            </div>

                            <h1 className="text-4xl font-black">{t.allSet}</h1>
                            <p className="text-xl text-zinc-500">
                                {t.profileActive}
                            </p>

                            {editLink && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-6 rounded-2xl text-start space-y-3">
                                    <p className="font-bold text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        {t.saveLink}
                                    </p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        {t.saveLinkDesc}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            readOnly
                                            value={editLink}
                                            className="flex-1 p-2 bg-white dark:bg-black border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm font-mono text-zinc-600 dark:text-zinc-400 select-all"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(editLink);
                                            }}
                                            className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-700 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => window.open(editLink, '_self')}
                                        className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl mt-4 text-center block transition-all shadow-lg shadow-yellow-400/20"
                                    >
                                        {t.goToDashboard}
                                    </button>
                                </div>
                            )}

                            {!editLink && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setGigId(null);
                                            router.push('/onboarding');
                                        }}
                                        className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center gap-2 font-bold"
                                    >
                                        <Plus className="w-6 h-6" />
                                        {t.createAnother}
                                    </button>

                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all flex flex-col items-center gap-2 font-bold shadow-lg shadow-blue-600/20"
                                    >
                                        <LayoutDashboard className="w-6 h-6" />
                                        {t.goToDashboard}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div >
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <OnboardingContent />
        </Suspense>
    );
}
