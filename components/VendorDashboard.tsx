'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    User, MapPin, Phone, Mail, Instagram, Camera, Edit3,
    Plus, Eye, Share2, Copy, Check, ExternalLink, Loader2,
    LayoutGrid, Settings, LogOut, ChevronRight, Sparkles
} from 'lucide-react';
import { Gig } from '@/types/gig';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import GigBuilder from './GigBuilder';
import { compressImage } from '@/lib/imageCompression';
import { GIG_CATEGORIES } from '@/types/gig';

interface Vendor {
    id: string;
    full_name?: string;
    name?: string;
    category: string;
    city: string;
    bio?: string;
    description?: string;
    avatar_url?: string;
    image_url?: string;
    phone?: string;
    email?: string;
    instagram_handle?: string;
    price_from?: number;
    portfolio_gallery?: string[];
}

interface VendorDashboardProps {
    vendor: Vendor;
    editToken: string;
    onLogout?: () => void;
}

export default function VendorDashboard({ vendor, editToken, onLogout }: VendorDashboardProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const [activeTab, setActiveTab] = useState<'profile' | 'gigs' | 'requests' | 'settings'>('profile');
    const [requests, setRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loadingGigs, setLoadingGigs] = useState(true);
    const [showGigBuilder, setShowGigBuilder] = useState(false);
    const [editingGigId, setEditingGigId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Form state for profile editing
    const [formData, setFormData] = useState({
        full_name: vendor.full_name || vendor.name || '',
        category: vendor.category || '',
        city: vendor.city || '',
        bio: vendor.bio || vendor.description || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        instagram_handle: vendor.instagram_handle || '',
        avatar_url: vendor.avatar_url || vendor.image_url || ''
    });

    const content = {
        en: {
            welcome: 'Welcome back',
            profile: 'My Profile',
            gigs: 'My Gigs',
            requests: 'Requests',
            settings: 'Settings',
            editProfile: 'Edit Profile',
            saveChanges: 'Save Changes',
            cancel: 'Cancel',
            createGig: 'Create Gig',
            noGigs: 'No gigs yet',
            noGigsDesc: 'Create your first gig to start getting bookings',
            viewProfile: 'View Public Profile',
            shareProfile: 'Share Profile',
            copied: 'Link copied!',
            name: 'Business Name',
            category: 'Category',
            city: 'City',
            bio: 'About',
            phone: 'Phone',
            email: 'Email',
            instagram: 'Instagram',
            logout: 'Logout',
            editGig: 'Edit',
            viewGig: 'View',
            untitled: 'Untitled Gig',
            noDescription: 'No description',
            status: {
                draft: 'Draft',
                published: 'Live',
                unlisted: 'Link Only',
                archived: 'Archived'
            }
        },
        he: {
            welcome: 'ברוך הבא',
            profile: 'הפרופיל שלי',
            gigs: 'הגיגים שלי',
            requests: 'בקשות',
            settings: 'הגדרות',
            editProfile: 'ערוך פרופיל',
            saveChanges: 'שמור שינויים',
            cancel: 'ביטול',
            createGig: 'צור גיג',
            noGigs: 'עדיין אין גיגים',
            noGigsDesc: 'צור את הגיג הראשון שלך כדי להתחיל לקבל הזמנות',
            viewProfile: 'צפה בפרופיל ציבורי',
            shareProfile: 'שתף פרופיל',
            copied: 'הועתק!',
            name: 'שם העסק / Artist Name',
            category: 'קטגוריה',
            city: 'עיר',
            bio: 'אודות',
            phone: 'טלפון',
            email: 'אימייל',
            instagram: 'אינסטגרם',
            logout: 'התנתק',
            editGig: 'ערוך',
            viewGig: 'צפה',
            untitled: 'ללא כותרת',
            noDescription: 'אין תיאור',
            status: {
                draft: 'טיוטה',
                published: 'פעיל',
                unlisted: 'לינק בלבד',
                archived: 'בארכיון'
            }
        }
    };

    const t = content[lang];

    // Load gigs
    useEffect(() => {
        loadGigs();
    }, [vendor.id]);

    // Fetch requests when tab is active
    useEffect(() => {
        if (activeTab === 'requests' && requests.length === 0) {
            const fetchRequests = async () => {
                setLoadingRequests(true);
                try {
                    const res = await fetch(`/api/vendor/bookings/${editToken}`);
                    const data = await res.json();
                    if (res.ok) {
                        setRequests(data.bookings || []);
                    }
                } catch (err) {
                    console.error('Error fetching requests:', err);
                    toast.error(lang === 'he' ? 'שגיאה בטעינת בקשות' : 'Error loading requests');
                } finally {
                    setLoadingRequests(false);
                }
            };
            fetchRequests();
        }
    }, [activeTab, editToken, requests.length, lang]);

    const loadGigs = async () => {
        setLoadingGigs(true);
        try {
            const res = await fetch(`/api/gigs?vendor_id=${vendor.id}`);
            const data = await res.json();
            if (data.gigs) {
                setGigs(data.gigs);
            }
        } catch (error) {
            console.error('Error loading gigs:', error);
        } finally {
            setLoadingGigs(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/vendor/edit/${editToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(lang === 'he' ? 'הפרופיל עודכן!' : 'Profile updated!');
            setEditingProfile(false);
        } catch (error) {
            toast.error(lang === 'he' ? 'שגיאה בשמירה' : 'Error saving');
        } finally {
            setSaving(false);
        }
    };

    const copyProfileLink = () => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const link = `${baseUrl}/vendor/${vendor.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success(t.copied);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        try {
            // Compress image before upload
            const compressedFile = await compressImage(file, {
                maxWidth: 400,
                maxHeight: 400,
                quality: 0.9,
                outputType: 'image/webp'
            });

            const formData = new FormData();
            formData.append('file', compressedFile);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setFormData(prev => ({ ...prev, avatar_url: data.url }));
            toast.success(lang === 'he' ? 'התמונה עודכנה!' : 'Photo updated!');
        } catch (error) {
            toast.error(lang === 'he' ? 'שגיאה בהעלאת תמונה' : 'Error uploading photo');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const getStatusBadge = (status: Gig['status']) => {
        const styles: Record<string, string> = {
            draft: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600',
            published: 'bg-green-100 dark:bg-green-900/30 text-green-600',
            unlisted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
            archived: 'bg-red-100 dark:bg-red-900/30 text-red-600'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${styles[status]}`}>
                {t.status[status]}
            </span>
        );
    };

    // Show Gig Builder
    if (showGigBuilder) {
        return (
            <GigBuilder
                vendorId={vendor.id}
                ownerId={null}
                existingGigId={editingGigId || undefined}
                onClose={() => {
                    setShowGigBuilder(false);
                    setEditingGigId(null);
                    loadGigs();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {formData.avatar_url ? (
                                    <Image src={formData.avatar_url} alt="" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="font-bold text-zinc-900 dark:text-white">
                                    {t.welcome}, {formData.full_name?.split(' ')[0] || 'Talent'}!
                                </h1>
                                <p className="text-sm text-zinc-500">{formData.category}</p>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/vendor/${vendor.id}`}
                                target="_blank"
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                title={t.viewProfile}
                            >
                                <ExternalLink className="w-5 h-5 text-zinc-500" />
                            </Link>
                            <button
                                onClick={copyProfileLink}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                title={t.shareProfile}
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5 text-zinc-500" />}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 -mb-4">
                        {(['profile', 'gigs', 'requests', 'settings'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-bold rounded-t-lg transition-colors ${activeTab === tab
                                    ? 'bg-zinc-50 dark:bg-black text-blue-600 border-b-2 border-blue-600'
                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                            >
                                {tab === 'profile' && t.profile}
                                {tab === 'gigs' && t.gigs}
                                {tab === 'requests' && t.requests}
                                {tab === 'settings' && t.settings}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t.profile}</h2>
                                {!editingProfile ? (
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        {t.editProfile}
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingProfile(false)}
                                            className="px-4 py-2 text-zinc-500 hover:text-zinc-700 font-medium"
                                        >
                                            {t.cancel}
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            {t.saveChanges}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Avatar upload section */}
                            {editingProfile && (
                                <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0">
                                        {formData.avatar_url ? (
                                            <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-zinc-400" />
                                            </div>
                                        )}
                                        {uploadingAvatar && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl cursor-pointer transition-colors">
                                            <Camera className="w-4 h-4" />
                                            {lang === 'he' ? 'החלף תמונה' : 'Change Photo'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                                disabled={uploadingAvatar}
                                            />
                                        </label>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {lang === 'he' ? 'JPG, PNG עד 5MB' : 'JPG, PNG up to 5MB'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Profile fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-500 mb-1">{t.name}</label>
                                    {editingProfile ? (
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-zinc-900 dark:text-white font-medium">{formData.full_name || '—'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-500 mb-1">{t.city}</label>
                                    {editingProfile ? (
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-zinc-900 dark:text-white font-medium flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-zinc-400" />
                                            {formData.city || '—'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-500 mb-1">{t.phone}</label>
                                    {editingProfile ? (
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-zinc-900 dark:text-white font-medium flex items-center gap-1">
                                            <Phone className="w-4 h-4 text-zinc-400" />
                                            {formData.phone || '—'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-500 mb-1">{t.email}</label>
                                    {editingProfile ? (
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-zinc-900 dark:text-white font-medium flex items-center gap-1">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                            {formData.email || '—'}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-zinc-500 mb-1">{t.bio}</label>
                                    {editingProfile ? (
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none"
                                        />
                                    ) : (
                                        <p className="text-zinc-900 dark:text-white">{formData.bio || '—'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gigs Tab */}
                {activeTab === 'gigs' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t.gigs}</h2>
                            <button
                                onClick={() => setShowGigBuilder(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                {t.createGig}
                            </button>
                        </div>

                        {loadingGigs && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        )}

                        {!loadingGigs && gigs.length === 0 && (
                            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{t.noGigs}</h3>
                                <p className="text-zinc-500 mb-6 max-w-sm mx-auto">{t.noGigsDesc}</p>
                                <button
                                    onClick={() => setShowGigBuilder(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    {t.createGig}
                                </button>
                            </div>
                        )}

                        {!loadingGigs && gigs.length > 0 && (
                            <div className="space-y-3">
                                {gigs.map((gig) => (
                                    <div
                                        key={gig.id}
                                        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 overflow-hidden">
                                                {gig.photos?.[0]?.url && (
                                                    <Image
                                                        src={gig.photos[0].url}
                                                        alt={gig.title}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    {getStatusBadge(gig.status)}
                                                    <span className="text-xs text-zinc-400">
                                                        {(GIG_CATEGORIES.find(c => c.id === gig.category_id)?.label as any)?.[lang] || gig.category_id}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                                                    {gig.title || t.untitled}
                                                </h3>
                                                <p className="text-sm text-zinc-500 line-clamp-1 mt-0.5">
                                                    {gig.short_description || t.noDescription}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                {gig.is_free ? (
                                                    <span className="text-green-600 font-bold">Free</span>
                                                ) : gig.price_amount ? (
                                                    <span className="text-lg font-black text-zinc-900 dark:text-white">
                                                        ₪{gig.price_amount}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                            <button
                                                onClick={() => {
                                                    setEditingGigId(gig.id);
                                                    setShowGigBuilder(true);
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                {t.editGig}
                                            </button>
                                            {gig.status === 'published' && (
                                                <Link
                                                    href={`/g/${gig.share_slug}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    {t.viewGig}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{t.settings}</h2>

                        <div className="space-y-4">
                            {/* Logout button for magic link users */}
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 w-full p-4 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">{t.logout}</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t.requests}</h2>
                        </div>

                        {loadingRequests ? (
                            <div className="p-12 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
                                <p className="text-zinc-500">Loading requests...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <Mail className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">{lang === 'he' ? 'אין בקשות עדיין' : 'No requests yet'}</h3>
                                <p className="text-zinc-500">{lang === 'he' ? 'כאשר לקוחות יפנו אליך, הם יופיעו כאן' : 'When clients book you, requests will appear here'}</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {requests.map((request) => (
                                    <div key={request.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl flex-shrink-0 ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    request.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-zinc-100 text-zinc-700'
                                                    }`}>
                                                    <Mail className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-lg text-zinc-900 dark:text-white">{request.client_name}</span>
                                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium uppercase ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            request.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-zinc-100 text-zinc-800'
                                                            }`}>
                                                            {request.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">{request.gig?.title}</p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                                                        <div className="flex items-center gap-1">
                                                            <span className="opacity-70">📅</span>
                                                            {new Date(request.event_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="opacity-70">📍</span>
                                                            {request.event_city || 'No location'}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="opacity-70">👥</span>
                                                            {request.guests_count || '?'} guests
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm">
                                                    <p className="font-medium mb-1 text-zinc-900 dark:text-zinc-200">Contact:</p>
                                                    <p>{request.client_email}</p>
                                                    <p>{request.client_phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {request.message && (
                                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                                                    "{request.message}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
