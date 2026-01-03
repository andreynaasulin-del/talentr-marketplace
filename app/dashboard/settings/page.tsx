'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User } from '@supabase/supabase-js';
import {
    ArrowLeft, Save, Loader2, Camera, User as UserIcon,
    FileText, Tag, MapPin, Phone, Mail, Plus, X, CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
// cn utility available if needed

interface VendorProfile {
    id: string;
    full_name: string;
    email: string | null;
    bio: string | null;
    avatar_url: string | null;
    portfolio_gallery: string[] | null;
    price_from: number | null;
    category: string | null;
    city: string | null;
    phone: string | null;
}

const CATEGORIES = [
    'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
    'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
    'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
];

const CITIES = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod', 'Beer Sheva'];

export default function SettingsPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [vendorId, setVendorId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        bio: '',
        avatar_url: '',
        price_from: 0,
        category: '',
        city: '',
        phone: '',
        portfolio_gallery: [] as string[],
    });

    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            if (!supabase) { router.push('/signin'); return; }
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/signin');
                return;
            }

            // Get vendor profile
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (vendorData) {
                setVendorId(vendorData.id);
                setFormData({
                    full_name: vendorData.full_name || '',
                    email: vendorData.email || user.email || '',
                    bio: vendorData.bio || '',
                    avatar_url: vendorData.avatar_url || '',
                    price_from: vendorData.price_from || 0,
                    category: vendorData.category || '',
                    city: vendorData.city || '',
                    phone: vendorData.phone || '',
                    portfolio_gallery: vendorData.portfolio_gallery || [],
                });
            }

            setUser(user);
            setLoading(false);
        };

        checkUser();
    }, [router]);

    const handleSave = async () => {
        if (!vendorId) return;
        if (!supabase) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('vendors')
                .update({
                    full_name: formData.full_name,
                    email: formData.email,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url,
                    price_from: formData.price_from,
                    category: formData.category,
                    city: formData.city,
                    phone: formData.phone,
                    portfolio_gallery: formData.portfolio_gallery,
                })
                .eq('id', vendorId);

            if (error) throw error;

            toast.success(
                language === 'he' ? '✅ הפרופיל נשמר!' : '✅ Profile saved!',
                { description: language === 'he' ? 'השינויים הוחלו' : 'Changes applied successfully' }
            );
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error(language === 'he' ? 'שגיאה בשמירה' : 'Error saving profile');
        } finally {
            setSaving(false);
        }
    };

    const addPhotoToGallery = () => {
        if (!newPhotoUrl.trim()) return;
        if (!newPhotoUrl.startsWith('http')) {
            toast.error(language === 'he' ? 'אנא הכנס URL תקין' : 'Please enter a valid URL');
            return;
        }

        setFormData({
            ...formData,
            portfolio_gallery: [...formData.portfolio_gallery, newPhotoUrl.trim()]
        });
        setNewPhotoUrl('');
        toast.success(language === 'he' ? '📸 התמונה נוספה!' : '📸 Photo added!');
    };

    const removePhotoFromGallery = (index: number) => {
        const updated = formData.portfolio_gallery.filter((_, i) => i !== index);
        setFormData({ ...formData, portfolio_gallery: updated });
    };

    // Calculate progress
    const progress = [
        formData.bio.length > 10,
        formData.portfolio_gallery.length > 0,
        formData.price_from > 0,
        formData.avatar_url.length > 0,
    ].filter(Boolean).length;
    const progressPercent = (progress / 4) * 100;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#05070A' }}>
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#D4AF37' }} />
            </div>
        );
    }

    return (
        <div className="obsidian-settings min-h-screen text-white relative" style={{ background: '#05070A' }}>
            <Navbar />

            {/* Ambient depth */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-64 left-1/4 w-[900px] h-[900px] rounded-full blur-3xl opacity-25"
                    style={{ background: 'radial-gradient(circle at 30% 30%, rgba(212,175,55,0.22), transparent 60%)' }}
                />
                <div
                    className="absolute top-20 -right-64 w-[1000px] h-[1000px] rounded-full blur-3xl opacity-35"
                    style={{ background: 'radial-gradient(circle at 35% 35%, rgba(0, 180, 255, 0.10), transparent 60%)' }}
                />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(212,175,55,0.9) 1px, transparent 1px)',
                        backgroundSize: '140px 140px',
                        backgroundPosition: '10px 10px',
                    }}
                />
            </div>

            <main className="relative max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-14">

                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-xl"
                        >
                            <ArrowLeft className="w-5 h-5 text-white/70" />
                        </Link>
                        <div>
                            <h1
                                className="text-2xl md:text-3xl tracking-[0.16em]"
                                style={{ fontFamily: 'var(--font-serif), serif' }}
                            >
                                {language === 'he' ? 'הגדרות פרופיל' : 'Profile Settings'}
                            </h1>
                            <p className="text-white/55 text-sm mt-1">
                                {language === 'he' ? 'מלא את הפרטים כדי לקבל הזמנות' : 'Complete your profile to get bookings'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#05070A] font-black rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {language === 'he' ? 'שמור' : 'Save'}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="rounded-3xl p-5 border border-white/10 bg-white/4 backdrop-blur-xl mb-7">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-white/55 uppercase tracking-[0.3em]">
                            {language === 'he' ? 'השלמת פרופיל' : 'Profile Completion'}
                        </span>
                        <span
                            className="text-lg font-semibold tracking-[0.12em]"
                            style={{ fontFamily: 'var(--font-serif), serif', color: '#D4AF37' }}
                        >
                            {Math.round(progressPercent)}%
                        </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, rgba(212,175,55,0.9), rgba(212,175,55,0.55))',
                                boxShadow: '0 0 18px rgba(212,175,55,0.22)',
                            }}
                        />
                    </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">

                    {/* Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl p-5 md:p-6 border border-white/10 bg-white/4 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.60)]"
                    >
                        <h2
                            className="text-sm uppercase tracking-[0.35em] text-white/70 mb-5 flex items-center gap-2"
                            style={{ fontFamily: 'var(--font-serif), serif' }}
                        >
                            <UserIcon className="w-5 h-5" style={{ color: '#D4AF37' }} />
                            {language === 'he' ? 'מידע בסיסי' : 'Basic Information'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {language === 'he' ? 'שם מלא' : 'Full Name'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    {language === 'he' ? 'טלפון (WhatsApp)' : 'Phone (WhatsApp)'}
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="972501234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Camera className="w-4 h-4 inline mr-1" />
                                    {language === 'he' ? 'URL תמונת פרופיל' : 'Profile Photo URL'}
                                </label>
                                <input
                                    type="url"
                                    value={formData.avatar_url}
                                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            {language === 'he' ? 'אודות' : 'About You'}
                            {formData.bio.length > 10 && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </h2>

                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={5}
                            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
                            placeholder={language === 'he'
                                ? 'ספר ללקוחות על הניסיון שלך, סגנון העבודה ולמה כדאי להזמין אותך...'
                                : 'Tell clients about your experience, style, and why they should book you...'}
                        />
                        <p className="text-sm text-gray-400 mt-2">
                            {formData.bio.length}/500 {language === 'he' ? 'תווים' : 'characters'}
                        </p>
                    </motion.div>

                    {/* Category & Pricing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-amber-600" />
                            {language === 'he' ? 'קטגוריה ומחירים' : 'Category & Pricing'}
                            {formData.price_from > 0 && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {language === 'he' ? 'קטגוריה' : 'Category'}
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                >
                                    <option value="">Select...</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{t(cat)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    {language === 'he' ? 'עיר' : 'City'}
                                </label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                >
                                    <option value="">Select...</option>
                                    {CITIES.map(city => (
                                        <option key={city} value={city}>{t(city)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {language === 'he' ? 'מחיר החל מ (₪)' : 'Price from (₪)'}
                                </label>
                                <input
                                    type="number"
                                    value={formData.price_from || ''}
                                    onChange={(e) => setFormData({ ...formData, price_from: Number(e.target.value) })}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="1500"
                                    min="0"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Portfolio Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-pink-600" />
                            {language === 'he' ? 'גלריית עבודות' : 'Portfolio Gallery'}
                            {formData.portfolio_gallery.length > 0 && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </h2>

                        <p className="text-gray-500 mb-6">
                            {language === 'he'
                                ? 'הוסף קישורים לעבודות הטובות שלך (URL של תמונות)'
                                : 'Add URLs to your best work samples (image URLs)'}
                        </p>

                        {/* Add photo input */}
                        <div className="flex gap-3 mb-6">
                            <input
                                type="url"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                className="flex-1 h-12 px-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                placeholder="https://images.unsplash.com/..."
                                onKeyDown={(e) => e.key === 'Enter' && addPhotoToGallery()}
                            />
                            <button
                                onClick={addPhotoToGallery}
                                className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                {language === 'he' ? 'הוסף' : 'Add'}
                            </button>
                        </div>

                        {/* Gallery Grid */}
                        {formData.portfolio_gallery.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.portfolio_gallery.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <Image
                                            src={url}
                                            alt={`Portfolio ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={() => removePhotoFromGallery(index)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-400">
                                    {language === 'he' ? 'אין עדיין תמונות בגלריה' : 'No photos in portfolio yet'}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Save Button (Bottom) */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-7 py-3 bg-[#D4AF37] text-[#05070A] font-black rounded-xl transition-all hover:opacity-90 disabled:opacity-50 shadow-[0_0_40px_rgba(212,175,55,0.18)]"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {language === 'he' ? 'שמור שינויים' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </main>

            {/* Obsidian & Gold theme overrides for legacy classes */}
            <style jsx global>{`
                .obsidian-settings .bg-white {
                    background: rgba(255, 255, 255, 0.04) !important;
                }
                .obsidian-settings .bg-gray-50,
                .obsidian-settings .bg-gray-100 {
                    background: rgba(255, 255, 255, 0.05) !important;
                }
                .obsidian-settings .border-gray-100,
                .obsidian-settings .border-gray-200 {
                    border-color: rgba(255, 255, 255, 0.12) !important;
                }
                .obsidian-settings .text-gray-900,
                .obsidian-settings .text-gray-800,
                .obsidian-settings .text-gray-700 {
                    color: rgba(255, 255, 255, 0.88) !important;
                }
                .obsidian-settings .text-gray-600,
                .obsidian-settings .text-gray-500,
                .obsidian-settings .text-gray-400 {
                    color: rgba(255, 255, 255, 0.55) !important;
                }
                .obsidian-settings input,
                .obsidian-settings textarea,
                .obsidian-settings select {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    color: rgba(255, 255, 255, 0.92) !important;
                }
                .obsidian-settings input::placeholder,
                .obsidian-settings textarea::placeholder {
                    color: rgba(255, 255, 255, 0.25) !important;
                }
                .obsidian-settings input:focus,
                .obsidian-settings textarea:focus,
                .obsidian-settings select:focus {
                    border-color: rgba(212, 175, 55, 0.55) !important;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
                    outline: none !important;
                }
            `}</style>
        </div>
    );
}
