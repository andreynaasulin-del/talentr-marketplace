'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowRight, DollarSign, MapPin, AlignLeft, Type, Camera, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
import { GIG_CATEGORIES, CITIES } from '@/types/gig';
import { useLanguage } from '@/context/LanguageContext';

// Zod Schema
const gigSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    category_id: z.string().min(1, 'Category is required'),
    city: z.string().min(1, 'City is required'),
    price_amount: z.number().min(1, 'Price must be greater than 0'),
    short_description: z.string().min(50, 'Description must be at least 50 characters'),
    // Optional media field for MVP Step 1
    media_url: z.string().optional(),
});

type GigSchema = z.infer<typeof gigSchema>;

interface GigStepProps {
    onSuccess: (gigData: any) => void;
    userId?: string;
    initialData?: any;
    inviteToken?: string | null;
}

export default function GigStep({ onSuccess, userId, initialData, inviteToken }: GigStepProps) {
    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const t = {
        en: {
            createGig: 'Create Your First Gig',
            subtitle: 'Start earning by offering your services. Setup takes 2 minutes.',
            gigTitle: 'Gig Title',
            titlePlaceholder: 'e.g. Professional Wedding Photography',
            category: 'Category',
            selectCategory: 'Select Category',
            city: 'City',
            selectCity: 'Select City',
            price: 'Starting Price (ILS)',
            description: 'Description',
            descPlaceholder: 'Describe what you offer in at least 50 characters...',
            coverImage: 'Cover Image (Optional)',
            changeImage: 'Change Image',
            uploadImage: 'Upload Image',
            continue: 'Continue',
        },
        he: {
            createGig: 'צור את הגיג הראשון שלך',
            subtitle: 'התחל להרוויח על ידי הצעת השירותים שלך. ההגדרה לוקחת 2 דקות.',
            gigTitle: 'כותרת הגיג',
            titlePlaceholder: 'למשל: צילום חתונות מקצועי',
            category: 'קטגוריה',
            selectCategory: 'בחר קטגוריה',
            city: 'עיר',
            selectCity: 'בחר עיר',
            price: 'מחיר התחלתי (₪)',
            description: 'תיאור',
            descPlaceholder: 'תאר מה אתה מציע, לפחות 50 תווים...',
            coverImage: 'תמונת כיסוי (אופציונלי)',
            changeImage: 'שנה תמונה',
            uploadImage: 'העלה תמונה',
            continue: 'המשך',
        },
    }[lang];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<GigSchema>({
        resolver: zodResolver(gigSchema),
        defaultValues: {
            title: initialData?.title || '',
            category_id: initialData?.category_id || '',
            city: initialData?.city || '',
            price_amount: initialData?.price_amount || 0,
            short_description: initialData?.short_description || '',
            media_url: initialData?.media_url || '',
        },
    });

    const selectedMedia = watch('media_url');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setValue('media_url', data.url);
            toast.success('Image uploaded!');
        } catch (e) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: GigSchema) => {
        setLoading(true);
        trackEvent(AnalyticsEvents.GIG_CREATE_SUBMIT, data);

        try {
            const payload = {
                ...data,
                owner_user_id: userId,
                invite_token: inviteToken, // Pass the token to bypass auth check
                status: 'draft',
                // We will store the media in the 'photos' array structure on the backend if needed,
                // or just pass as a temp field. For MVP, assuming backend handles 'photos' or we map it.
                photos: data.media_url ? [{ url: data.media_url, order: 0 }] : []
            };

            const res = await fetch('/api/gigs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to create gig');
            }

            toast.success('Gig draft saved!');
            onSuccess(json.gig);

        } catch (error: any) {
            toast.error(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8 p-6"
            dir={lang === 'he' ? 'rtl' : 'ltr'}
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                    {t.createGig}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    {t.subtitle}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <Type className="w-4 h-4" /> {t.gigTitle}
                    </label>
                    <input
                        {...register('title')}
                        placeholder={t.titlePlaceholder}
                        className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                {/* Category & City Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                            <Camera className="w-4 h-4" /> {t.category}
                        </label>
                        <select
                            {...register('category_id')}
                            className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="">{t.selectCategory}</option>
                            {GIG_CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {(cat.label as any)[lang]}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {t.city}
                        </label>
                        <select
                            {...register('city')}
                            className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="">{t.selectCity}</option>
                            {CITIES.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> {t.price}
                    </label>
                    <input
                        type="number"
                        {...register('price_amount', { valueAsNumber: true })}
                        className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.price_amount && <p className="text-red-500 text-sm">{errors.price_amount.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4" /> {t.description}
                    </label>
                    <textarea
                        {...register('short_description')}
                        rows={4}
                        placeholder={t.descPlaceholder}
                        className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                    {errors.short_description && <p className="text-red-500 text-sm">{errors.short_description.message}</p>}
                </div>

                {/* Media Upload (Optional) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" /> {t.coverImage}
                    </label>
                    <div className="flex items-center gap-4">
                        {selectedMedia && (
                            <img src={selectedMedia} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-zinc-200" />
                        )}
                        <label className="cursor-pointer px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            {selectedMedia ? t.changeImage : t.uploadImage}
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {t.continue}
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
