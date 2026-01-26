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

export default function MyGigsPage() {
    const router = useRouter();
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBuilder, setShowBuilder] = useState(false);
    const [editingGigId, setEditingGigId] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    // Mock user data - in production get from auth
    const mockVendorId = 'demo-vendor-id';
    const mockOwnerId = 'demo-owner-id';

    useEffect(() => {
        loadGigs();
    }, []);

    const loadGigs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gigs?vendor_id=${mockVendorId}`);
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
        if (!confirm('Удалить гиг?')) return;
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
        const labels = {
            draft: 'Черновик',
            published: 'Опубликован',
            unlisted: 'По ссылке',
            archived: 'В архиве'
        };
        return (
            <span className={`px-2 py-1 text-xs font-bold rounded-lg ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (showBuilder) {
        return (
            <GigBuilder
                vendorId={mockVendorId}
                ownerId={mockOwnerId}
                existingGigId={editingGigId || undefined}
                onClose={() => {
                    setShowBuilder(false);
                    setEditingGigId(null);
                    loadGigs();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Мои гиги</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                            Управляйте своими услугами
                        </p>
                    </div>
                    <button
                        onClick={() => setShowBuilder(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        Создать гиг
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && gigs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-10 h-10 text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                            У вас пока нет гигов
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                            Создайте свой первый гиг, чтобы клиенты могли найти вас и забронировать
                        </p>
                        <button
                            onClick={() => setShowBuilder(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Создать первый гиг
                        </button>
                    </div>
                )}

                {/* Gigs list */}
                {!loading && gigs.length > 0 && (
                    <div className="space-y-4">
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
                                    <div className="flex-1 p-4 md:p-5 flex flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    {getStatusBadge(gig.status)}
                                                    <span className="text-xs text-zinc-400">
                                                        {gig.category_id}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white truncate">
                                                    {gig.title || 'Без названия'}
                                                </h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                                                    {gig.short_description || 'Нет описания'}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right flex-shrink-0">
                                                {gig.is_free ? (
                                                    <span className="text-green-600 font-bold">Бесплатно</span>
                                                ) : gig.price_amount ? (
                                                    <div>
                                                        <span className="text-lg font-black text-zinc-900 dark:text-white">
                                                            ₪{gig.price_amount}
                                                        </span>
                                                        {gig.pricing_type === 'hourly' && (
                                                            <span className="text-xs text-zinc-500">/час</span>
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
                                                    Продолжить
                                                </button>
                                            )}

                                            {gig.status !== 'draft' && (
                                                <Link
                                                    href={`/gig/${gig.id}`}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Просмотр
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
                                                            Скопировано
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Share2 className="w-4 h-4" />
                                                            Поделиться
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            <div className="relative ml-auto">
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
                                                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 py-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingGigId(gig.id);
                                                                    setShowBuilder(true);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                                Редактировать
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    deleteGig(gig.id);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Удалить
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
