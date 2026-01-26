'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, EyeOff, Edit3, Trash2, MoreVertical, Share2, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GigBuilder from '@/components/GigBuilder';
import { Gig } from '@/types/gig';
import { User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export default function MyGigsPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBuilder, setShowBuilder] = useState(false);
    const [editingGigId, setEditingGigId] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    const lang = language as 'en' | 'he';

    const content = {
        en: {
            title: 'My Gigs',
            subtitle: 'Manage your services',
            createGig: 'Create Gig',
            createFirst: 'Create your first gig',
            noGigs: 'No gigs yet',
            noGigsDesc: 'Create your first gig so clients can find and book you',
            continue: 'Continue',
            view: 'View',
            share: 'Share',
            copied: 'Copied',
            edit: 'Edit',
            delete: 'Delete',
            deleteConfirm: 'Delete this gig?',
            free: 'Free',
            perHour: '/hr',
            noTitle: 'Untitled',
            noDesc: 'No description',
            status: {
                draft: 'Draft',
                published: 'Published',
                unlisted: 'Link Only',
                archived: 'Archived'
            }
        },
        he: {
            title: 'הגיגים שלי',
            subtitle: 'נהל את השירותים שלך',
            createGig: 'צור גיג',
            createFirst: 'צור את הגיג הראשון שלך',
            noGigs: 'אין גיגים עדיין',
            noGigsDesc: 'צור את הגיג הראשון שלך כדי שלקוחות יוכלו למצוא ולהזמין אותך',
            continue: 'המשך',
            view: 'צפה',
            share: 'שתף',
            copied: 'הועתק',
            edit: 'ערוך',
            delete: 'מחק',
            deleteConfirm: 'למחוק את הגיג הזה?',
            free: 'חינם',
            perHour: '/שעה',
            noTitle: 'ללא כותרת',
            noDesc: 'אין תיאור',
            status: {
                draft: 'טיוטה',
                published: 'פורסם',
                unlisted: 'קישור בלבד',
                archived: 'ארכיון'
            }
        }
    };

    const t = content[lang] || content.en;

    // State for auth
    const [user, setUser] = useState<User | null>(null);
    const [vendor, setVendor] = useState<any | null>(null);

    useEffect(() => {
        const init = async () => {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/signin');
                return;
            }
            setUser(user);

            // Fetch vendor profile
            // Try 'owner_user_id' first (standard), if fails we might need to adjust based on schema
            const { data: vendorData, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('owner_user_id', user.id)
                .single();

            if (vendorData) {
                setVendor(vendorData);
                loadGigs(vendorData.id);
            } else {
                setLoading(false); // No vendor profile found
            }
        };
        init();
    }, []);

    const loadGigs = async (vendorId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gigs?vendor_id=${vendorId}`);
            const data = await res.json();
            if (data.gigs) {
                setGigs(data.gigs);
            }
        } catch (error) {
            console.error('Error loading gigs:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteGig = async (id: string) => {
        if (!confirm(t.deleteConfirm)) return;
        try {
            await fetch(`/api/gigs/${id}`, { method: 'DELETE' });
            setGigs(gigs.filter(g => g.id !== id));
        } catch (error) {
            console.error('Error deleting gig:', error);
        }
    };

    const copyShareLink = (gig: Gig) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const link = `${baseUrl}/g/${gig.share_slug}`;
        navigator.clipboard.writeText(link);
        setCopied(gig.id);
        setTimeout(() => setCopied(null), 2000);
    };

    const getStatusBadge = (status: Gig['status']) => {
        const styles = {
            draft: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
            published: 'bg-green-100 dark:bg-green-900/30 text-green-600',
            unlisted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
            archived: 'bg-red-100 dark:bg-red-900/30 text-red-600'
        };

        return (
            <span className={`px-2 py-1 text-xs font-bold rounded-lg ${styles[status]}`}>
                {t.status[status]}
            </span>
        );
    };

    if (showBuilder) {
        return (
            <GigBuilder
                vendorId={vendor?.id}
                ownerId={user?.id || ''}
                existingGigId={editingGigId || undefined}
                onClose={() => {
                    setShowBuilder(false);
                    setEditingGigId(null);
                    if (vendor) loadGigs(vendor.id);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                )}

                {/* Empty state / No Vendor or No Gigs */}
                {!loading && gigs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-10 h-10 text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                            {t.noGigs}
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                            {t.noGigsDesc}
                        </p>
                        <button
                            onClick={() => setShowBuilder(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            {t.createFirst}
                        </button>
                    </div>
                )}

                {/* Gigs list */}
                {!loading && gigs.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t.title}</h2>
                            <button
                                onClick={() => setShowBuilder(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                {t.createGig}
                            </button>
                        </div>
                        {gigs.map((gig) => (
                            <div
                                key={gig.id}
                                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all"
                            >
                                <div className="flex">
                                    {/* Cover image */}
                                    <div className="w-32 h-32 md:w-48 md:h-40 relative flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
                                        {gig.photos?.[0] && (
                                            <Image
                                                src={gig.photos[0].url}
                                                alt={gig.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 p-4 md:p-5 flex flex-col min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    {getStatusBadge(gig.status)}
                                                    <span className="text-xs text-zinc-400">
                                                        {gig.category_id}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white truncate">
                                                    {gig.title || t.noTitle}
                                                </h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                                                    {gig.short_description || t.noDesc}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className={`flex-shrink-0 ${lang === 'he' ? 'text-left' : 'text-right'}`}>
                                                {gig.is_free ? (
                                                    <span className="text-green-600 font-bold">{t.free}</span>
                                                ) : gig.price_amount ? (
                                                    <div>
                                                        <span className="text-lg font-black text-zinc-900 dark:text-white">
                                                            ₪{gig.price_amount}
                                                        </span>
                                                        {gig.pricing_type === 'hourly' && (
                                                            <span className="text-xs text-zinc-500">{t.perHour}</span>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-auto pt-3">
                                            {gig.status === 'draft' && !gig.wizard_completed && (
                                                <button
                                                    onClick={() => {
                                                        setEditingGigId(gig.id);
                                                        setShowBuilder(true);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    {t.continue}
                                                </button>
                                            )}

                                            {gig.status !== 'draft' && (
                                                <Link
                                                    href={`/gig/${gig.id}`}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    {t.view}
                                                </Link>
                                            )}

                                            {(gig.status === 'unlisted' || gig.status === 'published') && gig.share_slug && (
                                                <button
                                                    onClick={() => copyShareLink(gig)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                >
                                                    {copied === gig.id ? (
                                                        <>
                                                            <Check className="w-4 h-4 text-green-500" />
                                                            {t.copied}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Share2 className="w-4 h-4" />
                                                            {t.share}
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            <div className={`relative ${lang === 'he' ? 'mr-auto' : 'ml-auto'}`}>
                                                <button
                                                    onClick={() => setMenuOpen(menuOpen === gig.id ? null : gig.id)}
                                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-zinc-400" />
                                                </button>

                                                {menuOpen === gig.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setMenuOpen(null)}
                                                        />
                                                        <div className={`absolute ${lang === 'he' ? 'left-0' : 'right-0'} mt-1 w-40 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 py-1`}>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingGigId(gig.id);
                                                                    setShowBuilder(true);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                                {t.edit}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    deleteGig(gig.id);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                {t.delete}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
