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
}

const CATEGORIES = [
    'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
    'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
    'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
    'Model', 'Influencer', 'Other'
];

const CITIES = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'];

const STEPS = [
    { id: 'intro', title: 'Welcome' },
    { id: 'identity', title: 'Identity' },
    { id: 'details', title: 'Service Details' },
    { id: 'portfolio', title: 'Portfolio' },
    { id: 'contact', title: 'Final Details' }
];

export default function EditVendorPage() {
    const params = useParams();
    const router = useRouter();
    const editToken = params.token as string;

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

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

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const res = await fetch(`/api/vendor/edit/${editToken}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Invalid link');
                    return;
                }

                setVendor(data.vendor);
                setFormData({
                    full_name: data.vendor.full_name || '',
                    category: data.vendor.category || '',
                    city: data.vendor.city || '',
                    bio: data.vendor.bio || '',
                    avatar_url: data.vendor.avatar_url || '',
                    phone: data.vendor.phone || '',
                    email: data.vendor.email || '',
                    instagram_handle: data.vendor.instagram_handle || '',
                    price_from: data.vendor.price_from || 0,
                    portfolio_gallery: data.vendor.portfolio_gallery || []
                });
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/vendor/edit/${editToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success('Profile completed successfully! 🎉');
            // Redirect to home or dashboard after short delay
            setTimeout(() => router.push('/'), 2000);
        } catch (err) {
            toast.error('Failed to save profile');
            setSaving(false);
        }
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setDirection(1);
            setCurrentStep(c => c + 1);
        } else {
            handleSave();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

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

    const renderStep = () => {
        switch (STEPS[currentStep].id) {
            case 'intro':
                return (
                    <div className="text-center py-10">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <Sparkles className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-black mb-4">Welcome to Talentr!</h2>
                        <p className="text-xl text-zinc-500 mb-8 max-w-md mx-auto">
                            We've created a preliminary profile for you. Let's make it shine in just a few steps.
                        </p>
                        <div className="space-y-4 max-w-sm mx-auto">
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Verify your identity</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Showcase your service</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Start getting bookings</span>
                            </div>
                        </div>
                    </div>
                );

            case 'identity':
                return (
                    <div className="space-y-8">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-zinc-100 dark:bg-zinc-800 mb-4 group cursor-pointer">
                                {formData.avatar_url ? (
                                    <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Camera className="w-10 h-10 text-zinc-400" />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="w-8 h-8 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-zinc-500">Click to upload photo</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block font-bold mb-2">Display Name / Business Name</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full text-lg px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. DJ Alex"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block font-bold mb-2">Base City</label>
                            <select
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full text-lg px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select city...</option>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                );

            case 'details':
                return (
                    <div className="space-y-8">
                        {/* Category */}
                        <div>
                            <label className="block font-bold mb-3">What is your main category?</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            // Simple single select for main category, or stick to multi if backend supports string arrays
                                            // Code below assumes comma separated string from original file
                                            const current = formData.category ? formData.category.split(',').map(s => s.trim()) : [];
                                            const exists = current.includes(cat);
                                            let updated;
                                            if (exists) updated = current.filter(c => c !== cat);
                                            else updated = [...current, cat];
                                            setFormData({ ...formData, category: updated.join(', ') })
                                        }}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.category.includes(cat)
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block font-bold mb-2">Short Bio (The "Pitch")</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Describe your service, experience, and what makes you unique..."
                            />
                        </div>
                    </div>
                );

            case 'portfolio':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="font-bold text-lg mb-1">Showcase your work</h3>
                            <p className="text-zinc-500 text-sm">Add links to your best images (or upload soon)</p>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={newPhotoUrl}
                                onChange={e => setNewPhotoUrl(e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                            />
                            <button
                                onClick={handlePortfolioAdd}
                                className="px-6 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl"
                            >
                                Add
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {formData.portfolio_gallery.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                                    <Image src={url} alt="" fill className="object-cover" />
                                    <button
                                        onClick={() => handlePortfolioRemove(i)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {formData.portfolio_gallery.length === 0 && (
                                <div className="col-span-full py-10 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400">
                                    No images added yet
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl mb-6">
                            <p className="text-blue-800 dark:text-blue-300 text-sm font-medium text-center">
                                Almost done! How can clients reach you and what's your starting price?
                            </p>
                        </div>

                        <div>
                            <label className="block font-bold mb-2">Starting Price (₪)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.price_from}
                                    onChange={e => setFormData({ ...formData, price_from: Number(e.target.value) })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-lg font-bold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block font-bold mb-2">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                    placeholder="+972..."
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-2">Instagram Username</label>
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                                    <span className="text-zinc-500">@</span>
                                    <input
                                        type="text"
                                        value={formData.instagram_handle}
                                        onChange={e => setFormData({ ...formData, instagram_handle: e.target.value.replace('@', '') })}
                                        className="flex-1 bg-transparent outline-none"
                                        placeholder="username"
                                    />
                                </div>
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
                        <span>Step {currentStep + 1} of {STEPS.length}</span>
                        <span>{STEPS[currentStep].title}</span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
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
                            {renderStep()}
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
                                    {currentStep === STEPS.length - 1 ? 'Finish & Launch' : 'Next'}
                                    {currentStep !== STEPS.length - 1 && <ChevronRight className="w-5 h-5" />}
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
