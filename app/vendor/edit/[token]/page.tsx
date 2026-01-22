'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, X, Save, User, MapPin, Phone, Mail, Instagram, DollarSign, FileText, Camera, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const categories = [
    'Photographer', 'Videographer', 'DJ', 'MC', 'Magician', 'Singer',
    'Musician', 'Comedian', 'Dancer', 'Bartender', 'Bar Show',
    'Event Decor', 'Kids Animator', 'Face Painter', 'Piercing/Tattoo', 'Chef',
    'Model', 'Influencer', 'Other'
];

const cities = ['Tel Aviv', 'Haifa', 'Jerusalem', 'Eilat', 'Rishon LeZion', 'Netanya', 'Ashdod'];

export default function EditVendorPage() {
    const params = useParams();
    const router = useRouter();
    const editToken = params.token as string;

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        category: '',
        city: '',
        bio: '',
        avatar_url: '',
        phone: '',
        email: '',
        instagram_handle: '',
        price_from: 0
    });

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
                    price_from: data.vendor.price_from || 0
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

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/vendor/edit/${editToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save');
                return;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500">Загрузка профиля...</p>
                </div>
            </div>
        );
    }

    if (error && !vendor) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors">
                <Navbar />
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                        Ссылка недействительна
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                        Эта ссылка для редактирования не найдена или истекла.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                    >
                        На главную
                    </a>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors" dir="ltr">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.push(`/vendor/${vendor?.id}`)}
                            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Назад к профилю
                        </button>
                        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
                            Редактирование профиля
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Сохранить
                    </button>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 dark:text-green-400 font-medium">
                            Изменения сохранены!
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                        <X className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 dark:text-red-400 font-medium">{error}</span>
                    </div>
                )}

                {/* Edit Form */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Avatar URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                <Camera className="w-4 h-4" />
                                Фото профиля (URL)
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                    {formData.avatar_url ? (
                                        <img
                                            src={formData.avatar_url}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-zinc-400" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.avatar_url}
                                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                <User className="w-4 h-4" />
                                Имя / Название
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                Категория
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => {
                                    const isSelected = formData.category.split(',').map(s => s.trim()).includes(cat);
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                const current = formData.category ? formData.category.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                let updated: string[];
                                                if (isSelected) {
                                                    updated = current.filter(c => c !== cat);
                                                } else {
                                                    updated = [...current, cat];
                                                }
                                                setFormData({ ...formData, category: updated.join(', ') });
                                            }}
                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${isSelected
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                <MapPin className="w-4 h-4" />
                                Город
                            </label>
                            <select
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                            >
                                <option value="">Выберите город</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                <FileText className="w-4 h-4" />
                                Описание / Био
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Расскажите о себе и своих услугах..."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                <DollarSign className="w-4 h-4" />
                                Минимальная цена (₪)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.price_from}
                                onChange={(e) => setFormData({ ...formData, price_from: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Телефон
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+972..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Instagram */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                <Instagram className="w-4 h-4" />
                                Instagram
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400 dark:text-zinc-500">@</span>
                                <input
                                    type="text"
                                    placeholder="username"
                                    value={formData.instagram_handle}
                                    onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value.replace('@', '') })}
                                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button (Mobile) */}
                    <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 md:hidden">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Сохранить изменения
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
