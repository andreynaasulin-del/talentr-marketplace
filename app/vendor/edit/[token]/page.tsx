'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Check, X, Save, User, MapPin, Phone, Mail, Instagram,
    DollarSign, FileText, Camera, Loader2, ArrowLeft, Upload,
    ChevronRight, ChevronLeft, Sparkles, LayoutGrid
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import GigBuilder from '@/components/GigBuilder';
import VendorDashboard from '@/components/VendorDashboard';

interface Vendor {
    id: string;
    full_name: string;
    category: string;
    city: string;
    bio: string;
    avatar_url?: string;
    phone?: string;
    email?: string;
    instagram_handle?: string;
    price_from: number;
    portfolio_gallery: string[];
    onboarding_completed?: boolean;
    status?: string;
}

const CATEGORIES = [
    'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
    'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
    'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
    'Model', 'Influencer', 'Other'
];

const CITIES = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'];

const ONBOARDING_STEPS = [
    { id: 'intro', title: 'Welcome' },
    { id: 'profile', title: 'Basic Info' },
    { id: 'portfolio', title: 'Media & Contact' }
];

export default function EditVendorPage() {
    const params = useParams();
    const router = useRouter();
    const editToken = params.token as string;

    // Core state
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Mode: 'onboarding' for new vendors, 'dashboard' for existing
    const [mode, setMode] = useState<'loading' | 'onboarding' | 'dashboard' | 'gig-builder'>('loading');

    // Onboarding wizard state
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);

    const [formData, setFormData] = useState({
        full_name: '',
        category: '',
        city: '',
        bio: '',
        avatar_url: '',
        phone: '',
        email: '',
        instagram_handle: '',
        price_from: 0,
        portfolio_gallery: [] as string[]
    });

    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    // Fetch vendor and determine mode
    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const res = await fetch(`/api/vendor/edit/${editToken}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Invalid link');
                    setMode('loading');
                    return;
                }

                const v = data.vendor;
                setVendor(v);
                setFormData({
                    full_name: v.full_name || '',
                    category: v.category || '',
                    city: v.city || '',
                    bio: v.bio || '',
                    avatar_url: v.avatar_url || '',
                    phone: v.phone || '',
                    email: v.email || '',
                    instagram_handle: v.instagram_handle || '',
                    price_from: v.price_from || 0,
                    portfolio_gallery: v.portfolio_gallery || []
                });

                // ============================================
                // SMART ROUTING: Determine mode based on status
                // ============================================
                if (v.onboarding_completed === true || v.status === 'active') {
                    // Existing vendor → Dashboard
                    setMode('dashboard');
                } else {
                    // New vendor → Onboarding Wizard
                    setMode('onboarding');
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (editToken) {
            fetchVendor();
        }
    }, [editToken]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large (max 5MB)');
            return;
        }

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);
            setFormData(prev => ({ ...prev, avatar_url: data.url }));
            toast.success('Photo uploaded!');
        } catch (err) {
            toast.error('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const handlePortfolioAdd = () => {
        if (!newPhotoUrl.trim()) return;
        setFormData(prev => ({
            ...prev,
            portfolio_gallery: [...prev.portfolio_gallery, newPhotoUrl.trim()]
        }));
        setNewPhotoUrl('');
    };

    const handlePortfolioRemove = (index: number) => {
        setFormData(prev => ({
            ...prev,
            portfolio_gallery: prev.portfolio_gallery.filter((_, i) => i !== index)
        }));
    };

    const handleOnboardingComplete = async () => {
        setSaving(true);
        try {
            // Save profile data
            const res = await fetch(`/api/vendor/edit/${editToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    onboarding_completed: true // Mark as completed!
                })
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success('Profile completed successfully! 🎉');

            // Move to Gig Builder as next step
            setMode('gig-builder');
        } catch (err) {
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const nextStep = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setDirection(1);
            setCurrentStep(c => c + 1);
        } else {
            handleOnboardingComplete();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(c => c - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 })
    };

    // ==================
    // LOADING STATE
    // ==================
    if (loading || mode === 'loading') {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    // ==================
    // ERROR STATE
    // ==================
    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <X className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Access Error</h1>
                <p className="text-zinc-500 mb-6">{error}</p>
                <button onClick={() => router.push('/')} className="px-6 py-3 bg-zinc-900 text-white rounded-xl">Go Home</button>
            </div>
        );
    }

    // ==================
    // DASHBOARD MODE (Existing Vendors)
    // ==================
    if (mode === 'dashboard' && vendor) {
        return (
            <VendorDashboard
                vendor={vendor}
                editToken={editToken}
                onLogout={() => router.push('/')}
            />
        );
    }

    // ==================
    // GIG BUILDER MODE (After Onboarding)
    // ==================
    if (mode === 'gig-builder' && vendor) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors" dir="ltr">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-24">
                    <GigBuilder
                        vendorId={vendor.id}
                        ownerId={null}
                        onClose={() => {
                            // After creating first gig, go to dashboard
                            setMode('dashboard');
                        }}
                    />
                </div>
            </div>
        );
    }

    // ==================
    // ONBOARDING MODE (New Vendors)
    // ==================
    const renderOnboardingStep = () => {
        switch (ONBOARDING_STEPS[currentStep].id) {
            case 'intro':
                return (
                    <div className="text-center py-10">
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl">
                                {formData.avatar_url ? (
                                    <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-blue-600" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-910">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black mb-4">Welcome, {formData.full_name?.split(' ')[0] || 'Talent'}!</h2>
                        <p className="text-xl text-zinc-500 mb-8 max-w-md mx-auto">
                            We've started your profile. Let's verify a few details and launch your services.
                        </p>
                        <div className="space-y-3 max-w-sm mx-auto">
                            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium">Profile Details</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Camera className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium">Portfolio & Gigs</span>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg bg-zinc-100 dark:bg-zinc-900 group cursor-pointer">
                                {formData.avatar_url ? (
                                    <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-zinc-400" />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="w-6 h-6 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">Change photo</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Business Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Base City</label>
                                <select
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select city...</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-3">Service Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            const current = formData.category ? formData.category.split(',').map(s => s.trim()) : [];
                                            const exists = current.includes(cat);
                                            let updated;
                                            if (exists) updated = current.filter(c => c !== cat);
                                            else updated = [...current, cat];
                                            setFormData({ ...formData, category: updated.join(', ') })
                                        }}
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${formData.category.includes(cat)
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Short Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Tell clients about your work..."
                            />
                        </div>
                    </div>
                );

            case 'portfolio':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <label className="block text-sm font-bold mb-2">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                    placeholder="+972..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Portfolio Gallery</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="url"
                                    value={newPhotoUrl}
                                    onChange={e => setNewPhotoUrl(e.target.value)}
                                    placeholder="https://image-url.com"
                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                />
                                <button onClick={handlePortfolioAdd} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm">Add</button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {formData.portfolio_gallery.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-zinc-100 dark:border-zinc-800">
                                        <Image src={url} alt="" fill className="object-cover" />
                                        <button onClick={() => handlePortfolioRemove(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Instagram Handle</label>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                                <span className="text-zinc-500">@</span>
                                <input
                                    type="text"
                                    value={formData.instagram_handle}
                                    onChange={e => setFormData({ ...formData, instagram_handle: e.target.value.replace('@', '') })}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors" dir="ltr">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 md:px-6 py-24 md:py-32">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                        <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
                        <span>{ONBOARDING_STEPS[currentStep].title}</span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-910 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-none min-h-[400px] flex flex-col relative overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex-1"
                        >
                            {renderOnboardingStep()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Nav */}
                    <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-4 py-2 text-zinc-500 font-bold transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'hover:text-zinc-900'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {currentStep === ONBOARDING_STEPS.length - 1 ? 'Finish & Launch' : 'Next'}
                                    {currentStep !== ONBOARDING_STEPS.length - 1 && <ChevronRight className="w-5 h-5" />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
