'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, X, Edit3, Instagram, Globe, MapPin, Phone, Mail, Sparkles, Shield, Loader2, Camera, Upload, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PendingVendor {
    id: string;
    name: string;
    category?: string;
    city?: string;
    email?: string;
    phone?: string;
    instagram_handle?: string;
    website?: string;
    description?: string;
    image_url?: string;
    portfolio_urls?: string[];
    price_from?: number;
    tags?: string[];
    instagram_followers?: number;
    source_type: string;
    source_url?: string;
    status: string;
}

const categories = [
    'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
    'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
    'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
    'Model', 'Influencer', 'Other'
];

const cities = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod',
    'Netanya', 'Beersheba', 'Holon', 'Bnei Brak', 'Ramat Gan', 'Ashkelon',
    'Rehovot', 'Bat Yam', 'Herzliya', 'Kfar Saba', 'Hadera', 'Modi\'in',
    'Nazareth', 'Lod', 'Ramla', 'Eilat', 'Acre', 'Nahariya', 'Tiberias',
    'Rosh HaAyin', 'Givatayim', 'Raanana', 'Hod HaSharon', 'Kiryat Ata',
    'Kiryat Gat', 'Kiryat Motzkin', 'Kiryat Yam', 'Kiryat Bialik', 'Kiryat Ono',
    'Ma\'ale Adumim', 'Or Yehuda', 'Zichron Yaakov', 'Caesarea', 'Other'
];

export default function ConfirmProfilePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [pending, setPending] = useState<PendingVendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Editable form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        city: '',
        email: '',
        phone: '',
        description: '',
        price_from: 0,
        image_url: '',
        instagram_handle: '',
        website: '',
        tags: [] as string[],
        portfolio_gallery: [] as string[]
    });

    const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

    useEffect(() => {
        const fetchPendingVendor = async () => {
            try {
                const res = await fetch(`/api/confirm/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Invalid or expired link');
                    return;
                }

                setPending(data.pending);
                const isQuick = data.pending.description === 'QUICK_INVITE';

                setFormData({
                    name: data.pending.name || '',
                    category: data.pending.category || '',
                    city: data.pending.city || '',
                    email: data.pending.email || '',
                    phone: data.pending.phone || '',
                    description: isQuick ? '' : (data.pending.description || ''),
                    price_from: data.pending.price_from || 0,
                    image_url: data.pending.image_url || '',
                    instagram_handle: data.pending.instagram_handle || '',
                    website: data.pending.website || '',
                    tags: data.pending.tags || [],
                    portfolio_gallery: data.pending.portfolio_urls || []
                });

                if (isQuick || !data.pending.category || !data.pending.description) {
                    setIsEditing(true);
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPendingVendor();
        }
    }, [token]);

    const [editLink, setEditLink] = useState<string | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset error
        setError(null);

        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Max 5MB / הקובץ גדול מדי. מקסימום 5MB');
            return;
        }

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Upload failed:', data.error);
                alert(data.error || 'Upload error / שגיאת העלאה');
                return;
            }

            setFormData(prev => ({ ...prev, image_url: data.url }));
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload photo. Please try again. / נכשל בהעלאת התמונה. נסה שוב.');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/confirm/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'confirm',
                    updates: formData
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setSubmitError(data.error || 'Failed to confirm');
                return;
            }

            setSuccess(true);
            setEditLink(data.editLink);
        } catch (err) {
            setSubmitError('Failed to confirm profile');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDecline = async () => {
        if (!confirm('Are you sure you want to decline? / האם אתה בטוח שברצונך לבטל?')) {
            return;
        }

        setSubmitting(true);
        try {
            await fetch(`/api/confirm/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'decline' })
            });
            router.push('/');
        } catch (err) {
            setSubmitError('Failed to decline');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500 dark:text-zinc-400">טוען פרופיל... / Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !pending) {
        return (
            <div className="min-h-screen bg-white dark:bg-black transition-colors">
                <Navbar />
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                        Invalid Link / קישור לא תקין
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                        {error || 'This confirmation link has expired or has already been used. / קישור אישור זה פג תוקף או שכבר נעשה בו שימוש.'}
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                    >
                        Back to Home / חזרה לדף הבית
                    </a>
                </div>
                <Footer />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
                <div className="text-center max-w-lg animate-slide-up">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                        ברוכים הבאים ל-Talentr! 🎉 / Welcome to Talentr!
                    </h1>
                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
                        הפרופיל שלך אושר ועכשיו גלוי ללקוחות! / Your profile is confirmed and now visible to clients!
                    </p>

                    {editLink && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 md:p-6 mb-6 text-left" dir="rtl">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-3 text-sm md:text-base">
                                <Shield className="w-5 h-5 flex-shrink-0" />
                                קישור העריכה האישי שלך / Your Personal Edit Link
                            </div>
                            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                                שמור את הקישור הזה! תזדקק לו כדי לערוך את הפרופיל שלך בעתיד. / Save this link! You will need it to edit your profile in the future.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2" dir="ltr">
                                <input
                                    type="text"
                                    value={editLink}
                                    readOnly
                                    className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(editLink);
                                        alert('Link copied! / הקישור הועתק!');
                                    }}
                                    className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors whitespace-nowrap active:scale-95"
                                >
                                    Copy / העתק
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="/"
                            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white font-bold rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-center active:scale-95 order-2 sm:order-1"
                        >
                            Back to Home
                        </a>
                        {editLink && (
                            <a
                                href={editLink}
                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-center active:scale-95 shadow-lg shadow-blue-600/20 order-1 sm:order-2"
                            >
                                עריכת פרופיל / Edit Profile
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors" dir="ltr">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 animate-shake">
                        <X className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 dark:text-red-400 font-bold">{submitError}</span>
                        <button onClick={() => setSubmitError(null)} className="ml-auto text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-6 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
                        <Sparkles className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        Invitation to Talentr / הזמנה ל-Talentr
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white mb-3 md:mb-4 leading-tight">
                        Confirm Your Profile / אישור הפרופיל שלך
                    </h1>
                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto px-4 md:px-0 font-medium">
                        {pending.description === 'QUICK_INVITE'
                            ? 'Welcome! We\'ve created a draft profile for you. Please complete your information so clients can find you. / ברוכים הבאים! יצרנו עבורך טיוטה לפרופיל. אנא השלם את המידע עליך כדי שלקוחות יוכלו למצוא אותך.'
                            : `מצאנו את הפרטים שלך ${pending.source_type === 'instagram' ? 'באינסטגרם' : 'באינטרנט'} ויצרנו פרופיל. אנא בדוק את הפרטים ואשר. ✨ / We found your information ${pending.source_type === 'instagram' ? 'on Instagram' : 'online'} and created a profile. Please check the details and confirm.`}
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                        {(formData.image_url || pending.image_url) && (
                            <Image
                                src={formData.image_url || pending.image_url || ''}
                                alt={formData.name || pending.name}
                                fill
                                className="object-cover opacity-80"
                                unoptimized
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
                            {pending.source_type === 'instagram' ? (
                                <>
                                    <Instagram className="w-4 h-4" />
                                    @{pending.instagram_handle || 'instagram'}
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4" />
                                    {pending.source_type}
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                        >
                            <Edit3 className="w-4 h-4" />
                            {isEditing ? 'Cancel / ביטול' : 'Edit / עריכה'}
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-0.5">
                            <h2 className="text-xl md:text-3xl font-black text-white drop-shadow-lg leading-tight">
                                {formData.name || pending.name}
                            </h2>
                            {pending.instagram_followers && (
                                <div className="inline-flex items-center gap-1.5 text-white text-xs md:text-sm font-medium drop-shadow">
                                    <Instagram className="w-3.5 h-3.5" />
                                    <span>{pending.instagram_followers.toLocaleString()} עוקבים / followers</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        {isEditing ? (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center mb-6">
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 text-center">
                                        Profile Photo / תמונת פרופיל
                                    </label>
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                            {(formData.image_url || pending.image_url) ? (
                                                <Image
                                                    src={formData.image_url || pending.image_url || ''}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Camera className="w-12 h-12 text-white/60" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                            {uploading ? (
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="w-8 h-8 text-white mx-auto mb-1" />
                                                    <span className="text-white text-xs font-medium">Upload / העלאה</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                                        Click to upload (max 5MB) / לחץ להעלאה (מקסימום 5MB)
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Name / Business Name | שם / שם עסק
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Category / קטגוריה
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select Category / בחר קטגוריה</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            City / עיר
                                        </label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select City / בחר עיר</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Email / אימייל
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Phone (WhatsApp) / טלפון (וואטסאפ)
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+972..."
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Price from / מחיר החל מ (₪)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price_from}
                                            onChange={(e) => setFormData({ ...formData, price_from: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Instagram
                                        </label>
                                        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                                            <Instagram className="w-5 h-5 text-pink-500" />
                                            <span className="text-zinc-500">@</span>
                                            <input
                                                type="text"
                                                value={formData.instagram_handle}
                                                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value.replace('@', '') })}
                                                placeholder="username"
                                                className="flex-1 bg-transparent text-zinc-900 dark:text-white outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Website
                                        </label>
                                        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                            <input
                                                type="url"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="https://..."
                                                className="flex-1 bg-transparent text-zinc-900 dark:text-white outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Description / תיאור
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            placeholder="Tell us about yourself and your services... / ספר לנו על עצמך ועל השירותים שלך..."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                                            <div className="flex items-center gap-2">
                                                <Camera className="w-4 h-4" />
                                                Portfolio / פורטפוליו ({formData.portfolio_gallery.length})
                                            </div>
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="url"
                                                value={newPortfolioUrl}
                                                onChange={(e) => setNewPortfolioUrl(e.target.value)}
                                                placeholder="https://image-url.com"
                                                className="flex-1 px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (newPortfolioUrl.trim()) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            portfolio_gallery: [...prev.portfolio_gallery, newPortfolioUrl.trim()]
                                                        }));
                                                        setNewPortfolioUrl('');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors">
                                                Add / הוסף
                                            </button>
                                        </div>
                                        {formData.portfolio_gallery.length > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {formData.portfolio_gallery.map((url, i) => (
                                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-zinc-200 dark:border-zinc-700">
                                                        <Image
                                                            src={url}
                                                            alt={`Portfolio ${i + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    portfolio_gallery: prev.portfolio_gallery.filter((_, idx) => idx !== i)
                                                                }));
                                                            }}
                                                            className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-3">
                                    {formData.category && (
                                        <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold">
                                            {formData.category}
                                        </span>
                                    )}
                                    {formData.city && (
                                        <span className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-sm font-medium">
                                            <MapPin className="w-4 h-4" />
                                            {formData.city}
                                        </span>
                                    )}
                                </div>

                                {formData.description && (
                                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                                        {formData.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                                    {formData.email && (
                                        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                            <Mail className="w-5 h-5 text-zinc-400" />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-300">{formData.email}</span>
                                        </div>
                                    )}
                                    {formData.phone && (
                                        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                            <Phone className="w-5 h-5 text-zinc-400" />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-300">{formData.phone}</span>
                                        </div>
                                    )}
                                    {formData.instagram_handle && (
                                        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                            <Instagram className="w-5 h-5 text-pink-500" />
                                            <a
                                                href={`https://instagram.com/${formData.instagram_handle}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-pink-500 transition-colors"
                                            >
                                                @{formData.instagram_handle}
                                            </a>
                                        </div>
                                    )}
                                    {formData.website && (
                                        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                            <a
                                                href={formData.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors truncate"
                                            >
                                                {formData.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {formData.portfolio_gallery.length > 0 && (
                                    <div className="pt-4">
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                                            <Camera className="w-4 h-4" />
                                            Portfolio / פורטפוליו ({formData.portfolio_gallery.length})
                                        </h3>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                            {formData.portfolio_gallery.map((url, i) => (
                                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                    <Image
                                                        src={url}
                                                        alt={`Portfolio ${i + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.price_from > 0 && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-500/20">
                                        <p className="text-sm text-green-700 dark:text-green-400 font-bold">
                                            מחיר החל מ ₪{formData.price_from.toLocaleString()} / Price from
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-500/20 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div dir="rtl">
                                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                                    מה Talentr מציעה? / What does Talentr offer?
                                </h4>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>✓ לקוחות חדשים מוצאים אותך דרך הפלטפורמה שלנו / New clients find you</li>
                                    <li>✓ עסקאות בטוחות עם אחריות תשלום / Secure transactions</li>
                                    <li>✓ פרופיל בחינם עם פורטפוליו / Free profile with portfolio</li>
                                    <li>✓ ביקורות ודירוגים בונים אמון / Reviews and ratings build trust</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-8 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <button
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-black text-base md:text-lg rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-green-600/20"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 md:w-6 h-5 md:h-6 animate-spin" />
                                ) : (
                                    <Check className="w-5 md:w-6 h-5 md:h-6" />
                                )}
                                Confirm Profile / אישור פרופיל
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={submitting}
                                className="px-6 py-4 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl transition-all active:scale-[0.98]"
                            >
                                Decline / ביטול
                            </button>
                        </div>
                        <p className="text-center text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">
                            By confirming, you agree to the <a href="/terms" className="text-blue-500 hover:underline">terms of use</a> / באישור, אתה מסכים לתנאי השימוש
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
