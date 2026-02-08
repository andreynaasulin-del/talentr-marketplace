'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles, Plus, LayoutDashboard, AlertTriangle, Copy, Check } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';
import GigBuilder from '@/components/GigBuilder';
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
            saveLink: '⚠️ IMPORTANT: SAVE THIS LINK',
            saveLinkDesc: 'This is your ONLY way to access your dashboard. Copy it NOW and save it somewhere safe (Notes, WhatsApp, Email).',
            goToDashboard: 'Go to My Dashboard',
            createAnother: 'Create Another Gig',
            copyLink: 'Copy Link',
            copied: 'Copied!',
            warningTitle: 'Did you save your link?',
            warningDesc: 'Without this link, you will NOT be able to access your profile. Make sure you copied it!',
            yesISaved: 'Yes, I saved it',
            goBackAndCopy: 'Go back and copy',
        },
        he: {
            allSet: 'הכל מוכן!',
            profileActive: 'הפרופיל שלך פעיל והגיג שלך בבדיקה.',
            saveLink: '⚠️ חשוב: שמור את הקישור הזה',
            saveLinkDesc: 'זו הדרך היחידה שלך לגשת לדשבורד. העתק אותו עכשיו ושמור במקום בטוח (הערות, וואטסאפ, אימייל).',
            goToDashboard: 'לדשבורד שלי',
            createAnother: 'צור גיג נוסף',
            copyLink: 'העתק קישור',
            copied: '!הועתק',
            warningTitle: 'שמרת את הקישור?',
            warningDesc: 'בלי הקישור הזה, לא תוכל לגשת לפרופיל שלך. ודא שהעתקת אותו!',
            yesISaved: 'כן, שמרתי',
            goBackAndCopy: 'חזרה להעתקה',
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
    const [linkCopied, setLinkCopied] = useState(false);
    const [showWarning, setShowWarning] = useState(false);


    useEffect(() => {
        checkUserAndState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // Re-run when searchParams change (after router.push)

    const checkUserAndState = async () => {
        try {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id);

            const paramGigId = searchParams.get('gigId');
            if (paramGigId) {
                setGigId(paramGigId);
                const { data: gig } = await supabase.from('gigs').select('status').eq('id', paramGigId).single();
                if (gig) {
                    if (gig.status === 'draft' || gig.status === 'draft_profile_missing') {
                        setStep(2);
                        trackEvent(AnalyticsEvents.PROFILE_FILL_START, { gigId: paramGigId });
                    } else {
                        setStep(3);
                    }
                }
            } else {
                trackEvent(AnalyticsEvents.GIG_CREATE_START);
            }

            const invite = searchParams.get('invite');
            if (invite) {
                setInviteToken(invite);
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

    // Use ref to track gigId for reliable access in callbacks
    const gigIdRef = useRef<string | null>(null);

    // Called when GigBuilder creates a draft (for tracking)
    const handleGigCreated = (newGigId: string) => {
        setGigId(newGigId);
        gigIdRef.current = newGigId;
    };

    // Called when GigBuilder completes (publish/close)
    const handleGigBuilderClose = () => {
        const id = gigIdRef.current || gigId;
        if (id) {
            setStep(2);
            // Preserve invite token for ProfileStep to use
            const params = new URLSearchParams();
            params.set('gigId', id);
            if (inviteToken) params.set('invite', inviteToken);
            router.push(`/onboarding?${params.toString()}`);
            trackEvent(AnalyticsEvents.PROFILE_FILL_START, { gigId: id });
        }
    };


    const handleProfileSuccess = (link?: string) => {
        setStep(3);
        if (link) setEditLink(link);
        trackEvent(AnalyticsEvents.INVITE_OPENED, { status: 'completed' });
    };

    const handleCopyLink = () => {
        if (editLink) {
            navigator.clipboard.writeText(editLink);
            setLinkCopied(true);
        }
    };

    const handleGoToDashboard = () => {
        if (!linkCopied) {
            setShowWarning(true);
        } else {
            window.open(editLink!, '_self');
        }
    };

    const confirmGoToDashboard = () => {
        setShowWarning(false);
        window.open(editLink!, '_self');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Step 1: GigBuilder (Full wizard)
    if (step === 1) {
        return (
            <div className="min-h-screen bg-white dark:bg-black relative">
                {/* Language Switcher */}
                <div className="absolute top-4 right-4 z-[100]">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 text-2xl hover:scale-110 transition-transform"
                        title="Switch Language"
                    >
                        {language === 'en' ? '🇺🇸' : '🇮🇱'}
                    </button>
                </div>

                <GigBuilder
                    ownerId={userId}
                    inviteToken={inviteToken || undefined}
                    mode="onboarding"
                    onGigCreated={handleGigCreated}
                    onClose={handleGigBuilderClose}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col relative">
            {/* Language Switcher */}
            <div className="absolute top-4 right-4 z-[100]">
                <button
                    onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 text-2xl hover:scale-110 transition-transform"
                    title="Switch Language"
                >
                    {language === 'en' ? '🇺🇸' : '🇮🇱'}
                </button>
            </div>

            {/* Warning Modal */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowWarning(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800"
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold">{t.warningTitle}</h3>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t.warningDesc}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmGoToDashboard}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                                >
                                    {t.yesISaved}
                                </button>
                                <button
                                    onClick={() => setShowWarning(false)}
                                    className="w-full py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold rounded-xl transition-all"
                                >
                                    {t.goBackAndCopy}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 sticky top-0 z-50">
                <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: step === 2 ? '66%' : '100%' }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <AnimatePresence mode="wait">

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
                            <p className="text-xl text-zinc-500">{t.profileActive}</p>

                            {editLink && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 p-6 rounded-2xl text-start space-y-4">
                                    <p className="font-bold text-red-700 dark:text-red-400 text-lg">
                                        {t.saveLink}
                                    </p>
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {t.saveLinkDesc}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 bg-white dark:bg-black p-2 rounded-xl border border-red-200 dark:border-red-800">
                                        <input
                                            readOnly
                                            value={editLink}
                                            className="flex-1 p-2 bg-transparent text-sm font-mono text-zinc-600 dark:text-zinc-400 select-all outline-none"
                                        />
                                        <button
                                            onClick={handleCopyLink}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${linkCopied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                                }`}
                                        >
                                            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {linkCopied ? t.copied : t.copyLink}
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleGoToDashboard}
                                        className={`w-full py-3 font-bold rounded-xl mt-4 text-center block transition-all shadow-lg ${linkCopied
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                                            : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                                            }`}
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
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <OnboardingContent />
        </Suspense>
    );
}
