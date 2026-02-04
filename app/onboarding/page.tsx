'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles, Plus, LayoutDashboard } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import GigStep from './steps/GigStep';
import ProfileStep from './steps/ProfileStep';

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [gigId, setGigId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | undefined>(undefined);

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
                // But to be safe, we'll allow seeing the form but enforce auth on submit?
                // Let's redirect to signin if not found for strict security.
                // router.push('/signin?next=/onboarding'); 
                // User requested "Gig First". If I force login, it breaks the flow if they aren't logged in yet.
                // BUT the requirements say "User comes by invite (Magic Link)". So they ARE logged in.
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

    const handleProfileSuccess = () => {
        setStep(3);
        trackEvent(AnalyticsEvents.INVITE_OPENED, { status: 'completed' }); // Or custom event
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col">
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
                        />
                    )}

                    {step === 2 && gigId && (
                        <ProfileStep
                            key="step2"
                            gigId={gigId}
                            onSuccess={handleProfileSuccess}
                        />
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 max-w-lg mx-auto"
                        >
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-12 h-12 text-green-600 dark:text-green-500" />
                            </div>

                            <h1 className="text-4xl font-black">All Set!</h1>
                            <p className="text-xl text-zinc-500">
                                Your profile is active and your gig is under review.
                            </p>

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
                                    Create Another Gig
                                </button>

                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all flex flex-col items-center gap-2 font-bold shadow-lg shadow-blue-600/20"
                                >
                                    <LayoutDashboard className="w-6 h-6" />
                                    Go to Dashboard
                                </button>
                            </div>
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
