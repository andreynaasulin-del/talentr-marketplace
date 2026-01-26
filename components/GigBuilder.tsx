'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Sparkles, Check, X, Loader2,
    Upload, Camera, Video, MapPin, Users, Clock, DollarSign,
    Globe, Share2, Copy, ExternalLink, Plus, Trash2, GripVertical
} from 'lucide-react';
import {
    Gig, GigTemplate, GigWizardStep, GIG_WIZARD_STEPS,
    GIG_STEP_CONFIG, GIG_CATEGORIES, EVENT_TYPES, CITIES
} from '@/types/gig';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface GigBuilderProps {
    vendorId?: string;
    ownerId?: string | null; // Made optional for Guest Vendors
    onClose: () => void;
    existingGigId?: string;
}

export default function GigBuilder({ vendorId, ownerId, onClose, existingGigId }: GigBuilderProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [templates, setTemplates] = useState<GigTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<GigTemplate | null>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const lang = (language === 'he') ? 'he' : 'en';

    const translations = {
        en: {
            fromScratch: 'From scratch',
            fromScratchDesc: 'Full customization freedom',
            startingFrom: 'from ₪',
            placeholderTitle: 'e.g. DJ set for a wedding',
            placeholderShort: 'Briefly describe your gig...',
            placeholderFull: 'Tell more: what is included, features, experience...',
            placeholderPricing: '2 hours of work, equipment, soundcheck...',
            placeholderRequirements: '220V outlet, 2x1m table, dimmed room...',
            placeholderWhatNeeds: 'Guest list, wishlist, brief...',
            titleLabel: 'Gig Title *',
            categoryLabel: 'Category *',
            shortDescLabel: 'Short Description *',
            fullDescLabel: 'Full Description',
            languagesLabel: 'Languages',
            maxChars: 'max. 150 chars',
            optional: 'optional',
            mediaHint: 'Upload at least 1 video or 3 photos for better conversion',
            dropFiles: 'Drop files here',
            fileFormats: 'JPG, PNG up to 5MB · MP4, MOV up to 50MB',
            selectFiles: 'Select Files',
            freeGig: 'Free Gig',
            promoDesc: 'Promo or charity',
            priceType: 'Price Type',
            priceFixed: 'Fixed',
            priceFixedDesc: 'per event',
            priceHourly: 'Hourly',
            priceHourlyDesc: 'per hour',
            priceFrom: 'From...',
            priceFromDesc: 'minimum',
            amountLabel: 'Amount (₪) *',
            includedLabel: 'What is included',
            locationLabel: 'Where do you work?',
            cityMode: 'In my city',
            radiusMode: 'In radius (km)',
            countrywideMode: 'Countrywide',
            onlineMode: 'Online only',
            baseCityLabel: 'Base City',
            radiusLabel: 'Radius',
            kidsSuitable: 'Suitable for kids',
            familyContent: 'Family content',
            ageLimitLabel: 'Age Limit',
            eventTypesLabel: 'Event Types',
            durationLabel: 'Duration (min)',
            maxGuestsLabel: 'Max Guests',
            requirementsLabel: 'Venue Requirements',
            clientNeedsLabel: 'What is needed from client',
            bookingMethodLabel: 'How to book you?',
            chatMethod: 'Chat',
            chatMethodDesc: 'Clients write directly',
            slotMethod: 'Request slot',
            slotMethodDesc: 'Via calendar (soon)',
            leadTimeLabel: 'Min days before booking?',
            day: 'day',
            days: 'days',
            week: 'week',
            weeks: 'weeks',
            km: 'km',
            noTitle: 'Untitled',
            noDesc: 'No description',
            stepCount: 'Step {current} of {total}',
            priceTypeDesc: 'Choose how you charge',
            howToPublish: 'How to publish?',
            gigCreatedTitle: 'Gig created! 🎉',
            gigCreatedDesc: 'Your offer is now available to clients',
            viewGig: 'View Gig',
            done: 'Done',
            publicCatalog: 'Public in catalog',
            linkOnly: 'Only via link 🔗',
            linkCreated: 'Link created!',
            copy: 'Copy',
            copiedText: 'Copied',
            publishTitle: 'Publish',
            publishSubtitle: 'Ready to launch!',
            next: 'Next',
            back: 'Back',
            publish: 'Publish',
            finish: 'Finish',
            loading: 'Loading...'
        },
        he: {
            fromScratch: 'מאפס',
            fromScratchDesc: 'חופש התאמה אישית מלא',
            startingFrom: 'מ-₪',
            placeholderTitle: 'למשל: סט DJ לחתונה',
            placeholderShort: 'תאר בקצרה את הגיג שלך...',
            placeholderFull: 'ספר עוד: מה כלול, תכונות, ניסיון...',
            placeholderPricing: 'שעתיים עבודה, ציוד, בדיקת סאונד...',
            placeholderRequirements: 'שקע 220V, שולחן 2x1 מ\', חדר מוחשך...',
            placeholderWhatNeeds: 'רשימת אורחים, פלייליסט, בריף...',
            titleLabel: 'כותרת הגיג *',
            categoryLabel: 'קטגוריה *',
            shortDescLabel: 'תיאור קצר *',
            fullDescLabel: 'תיאור מלא',
            languagesLabel: 'שפות',
            maxChars: 'מקסימום 150 תווים',
            optional: 'אופציונלי',
            mediaHint: 'העלו לפחות סרטון אחד או 3 תמונות להמרה טובה יותר',
            dropFiles: 'גרור קבצים לכאן',
            fileFormats: 'JPG, PNG עד 5MB · MP4, MOV עד 50MB',
            selectFiles: 'בחר קבצים',
            freeGig: 'גיג חינם',
            promoDesc: 'פרומו או צדקה',
            priceType: 'סוג מחיר',
            priceFixed: 'קבוע',
            priceFixedDesc: 'לאירוע',
            priceHourly: 'לשעה',
            priceHourlyDesc: 'לפי שעה',
            priceFrom: 'מ...',
            priceFromDesc: 'מינימום',
            amountLabel: 'סכום (₪) *',
            includedLabel: 'מה כלול במחיר',
            locationLabel: 'איפה אתה עובד?',
            cityMode: 'בעיר שלי',
            radiusMode: 'ברדיוס (ק"מ)',
            countrywideMode: 'כל הארץ',
            onlineMode: 'אונליין בלבד',
            baseCityLabel: 'עיר בסיס',
            radiusLabel: 'רדיוס',
            kidsSuitable: 'מתאים לילדים',
            familyContent: 'תוכן משפחתי',
            ageLimitLabel: 'הגבלת גיל',
            eventTypesLabel: 'סוגי אירועים',
            durationLabel: 'משך זמן (דקות)',
            maxGuestsLabel: 'מקסימום אורחים',
            requirementsLabel: 'דרישות מהמקום',
            clientNeedsLabel: 'מה נדרש מהלקוח',
            bookingMethodLabel: 'איך להזמין אותך?',
            chatMethod: 'צ׳אט',
            chatMethodDesc: 'לקוחות כותבים ישירות',
            slotMethod: 'בקש משבצת',
            slotMethodDesc: 'דרך יומן (בקרוב)',
            leadTimeLabel: 'מינימום ימים לפני הזמנה?',
            day: 'יום',
            days: 'ימים',
            week: 'שבוע',
            weeks: 'שבועות',
            km: 'ק"מ',
            noTitle: 'ללא כותרת',
            noDesc: 'אין תיאור',
            stepCount: 'שלב {current} מתוך {total}',
            priceTypeDesc: 'בחר כיצד אתה גובה תשלום',
            howToPublish: 'איך לפרסם?',
            gigCreatedTitle: 'הגיג נוצר! 🎉',
            gigCreatedDesc: 'ההצעה שלך זמינה כעת ללקוחות',
            viewGig: 'צפה בגיג',
            done: 'בוצע',
            publicCatalog: 'ציבורי בקטלוג',
            linkOnly: 'רק דרך קישור 🔗',
            linkCreated: 'הקישור נוצר!',
            copy: 'העתק',
            copiedText: 'הועתק',
            publishTitle: 'פרסום',
            publishSubtitle: 'מוכן להשקה!',
            next: 'הבא',
            back: 'הקודם',
            publish: 'פרסם',
            finish: 'סיום',
            loading: 'טוען...'
        }
    };

    const t = translations[lang];

    // Gig data state
    const [gig, setGig] = useState<Partial<Gig>>({
        vendor_id: vendorId,
        owner_user_id: ownerId,
        title: '',
        category_id: '',
        tags: [],
        short_description: '',
        full_description: '',
        languages: [language.toUpperCase()],
        photos: [],
        videos: [],
        is_free: false,
        currency: 'ILS',
        pricing_type: 'fixed',
        price_amount: undefined,
        addons: [],
        location_mode: 'city',
        base_city: 'Tel Aviv',
        suitable_for_kids: true,
        age_limit: 'none',
        event_types: [],
        duration_minutes: 60,
        booking_method: 'chat',
        lead_time_hours: 24,
        status: 'draft'
    });

    const step = GIG_WIZARD_STEPS[currentStep] as GigWizardStep;
    const stepConfig = GIG_STEP_CONFIG[step];

    // Load templates on mount
    useEffect(() => {
        // Mock fetch templates
        setTemplates([
            {
                id: 'dj-set',
                name: lang === 'he' ? 'DJ Set' : 'DJ Set',
                category_id: 'DJ',
                icon: '🎧',
                description_blocks: [],
                required_fields: ['short_description', 'duration_minutes'],
                suggested_tags: ['wedding', 'party'],
                suggested_price_min: 2000,
                is_active: true,
                sort_order: 1
            },
            {
                id: 'photographer',
                name: lang === 'he' ? 'Photographer' : 'Photographer',
                category_id: 'Photographer',
                icon: '📸',
                description_blocks: [],
                required_fields: ['short_description'],
                suggested_tags: ['wedding', 'event'],
                suggested_price_min: 1000,
                is_active: true,
                sort_order: 2
            }
        ]);

        if (existingGigId) {
            loadExistingGig(existingGigId);
        }
    }, [existingGigId, lang]);

    const loadExistingGig = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gigs/${id}`);
            const data = await res.json();
            if (data.gig) {
                setGig(data.gig);
                setCurrentStep(data.gig.current_step || 0);
            }
        } catch (error) {
            console.error('Error loading gig:', error);
        } finally {
            setLoading(false);
        }
    };

    const createDraft = async () => {
        try {
            const res = await fetch('/api/gigs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendor_id: vendorId,
                    owner_user_id: ownerId,
                    template_id: selectedTemplate?.id,
                    category_id: selectedTemplate?.category_id || gig.category_id || 'Other'
                })
            });
            const data = await res.json();
            if (data.gig) {
                setGig(prev => ({ ...prev, id: data.gig.id, share_slug: data.gig.share_slug }));
                return data.gig.id;
            }
        } catch (error) {
            console.error('Error creating draft:', error);
        }
        return null;
    };

    const saveStep = async () => {
        if (!gig.id) return;
        setSaving(true);
        try {
            await fetch(`/api/gigs/${gig.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...gig,
                    current_step: currentStep
                })
            });
        } catch (error) {
            console.error('Error saving step:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleNext = async () => {
        // Validation per step
        if (currentStep === 0) {
            // Step 0: Type/Template selection
            // Logic handled by createDraft. If "From Scratch" selectedTemplate is null, which is fine.
        }

        if (step === 'title') {
            if (!gig.title || !gig.category_id) {
                setErrors({
                    title: !gig.title,
                    category: !gig.category_id
                });
                toast.error(lang === 'en' ? 'Please fill in Title and Category' : 'נא למלא כותרת וקטגוריה');
                return;
            }
            setErrors({});
        }

        if (step === 'details') {
            // Basic validation check if needed, e.g. price
            if (!gig.is_free && !gig.price_amount) {
                toast.error(lang === 'en' ? 'Please set a price amount' : 'נא להגדיר מחיר');
                return;
            }
        }

        // Create draft on first move from step 0
        if (currentStep === 0 && !gig.id) {
            setLoading(true);
            const newId = await createDraft();
            setLoading(false);

            if (!newId) {
                toast.error('Connection error: Could not create draft. Please try again.');
                return;
            }
        }

        // Save current step data
        await saveStep();

        if (currentStep < GIG_WIZARD_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePublish = async (asUnlisted = false) => {
        if (!gig.id) return;

        setLoading(true);
        try {
            const endpoint = asUnlisted
                ? `/api/gigs/${gig.id}/unlist`
                : `/api/gigs/${gig.id}/publish`;

            const res = await fetch(endpoint, { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                if (asUnlisted && data.shareLink) {
                    setShareLink(data.shareLink);
                } else {
                    // Move to success view
                    setCurrentStep(GIG_WIZARD_STEPS.length);
                }
                setGig(prev => ({ ...prev, ...data.gig }));
            }
        } catch (error) {
            console.error('Error publishing:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (shareLink) {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Render step content
    const renderStepContent = () => {
        switch (step) {
            case 'type':
                return (
                    <div className="space-y-6">
                        <p className="text-zinc-500 dark:text-zinc-400 text-center">
                            {t.fromScratchDesc}
                        </p>

                        {/* From scratch option */}
                        <button
                            onClick={() => setSelectedTemplate(null)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${!selectedTemplate
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl">
                                ✏️
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-zinc-900 dark:text-white">{t.fromScratch}</p>
                                <p className="text-sm text-zinc-500">{t.fromScratchDesc}</p>
                            </div>
                            {!selectedTemplate && <Check className="w-5 h-5 text-blue-500 ml-auto" />}
                        </button>

                        {/* Templates grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setGig(prev => ({
                                            ...prev,
                                            category_id: template.category_id,
                                            tags: template.suggested_tags || []
                                        }));
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left ${selectedTemplate?.id === template.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{template.icon}</div>
                                    <p className="font-bold text-zinc-900 dark:text-white text-sm">{template.name}</p>
                                    {template.suggested_price_min && (
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {t.startingFrom}{template.suggested_price_min}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'title':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.titleLabel}
                            </label>
                            <input
                                type="text"
                                value={gig.title || ''}
                                onChange={(e) => setGig(prev => ({ ...prev, title: e.target.value }))}
                                placeholder={t.placeholderTitle}
                                className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.categoryLabel}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {GIG_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setGig(prev => ({ ...prev, category_id: cat.id }));
                                            if (errors.category) setErrors(prev => ({ ...prev, category: false }));
                                        }}
                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${gig.category_id === cat.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : errors.category
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/10 hover:border-red-400'
                                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                            }`}
                                    >
                                        <span className="text-xl">{cat.icon}</span>
                                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{(cat.label as any)[lang]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'description':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.shortDescLabel} <span className="font-normal text-zinc-400">({t.maxChars})</span>
                            </label>
                            <textarea
                                value={gig.short_description || ''}
                                onChange={(e) => setGig(prev => ({ ...prev, short_description: e.target.value.slice(0, 150) }))}
                                placeholder={t.placeholderShort}
                                rows={2}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                            <p className="text-xs text-zinc-400 mt-1">{(gig.short_description || '').length}/150</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.fullDescLabel} <span className="font-normal text-zinc-400">({t.optional})</span>
                            </label>
                            <textarea
                                value={gig.full_description || ''}
                                onChange={(e) => setGig(prev => ({ ...prev, full_description: e.target.value }))}
                                placeholder={t.placeholderFull}
                                rows={4}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.languagesLabel}
                            </label>
                            <div className="flex gap-2">
                                {['HE', 'EN'].map((langCode) => (
                                    <button
                                        key={langCode}
                                        onClick={() => {
                                            const langs = gig.languages || [];
                                            if (langs.includes(langCode)) {
                                                setGig(prev => ({ ...prev, languages: langs.filter(l => l !== langCode) }));
                                            } else {
                                                setGig(prev => ({ ...prev, languages: [...langs, langCode] }));
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${(gig.languages || []).includes(langCode)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                                            }`}
                                    >
                                        {langCode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'media':
                return (
                    <div className="space-y-6">
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            {t.mediaHint}
                        </p>

                        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-8 h-8 text-zinc-400" />
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-2">
                                {t.dropFiles}
                            </p>
                            <p className="text-xs text-zinc-400 mb-4">
                                {t.fileFormats}
                            </p>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-all">
                                <Camera className="w-4 h-4" />
                                {t.selectFiles}
                                <input type="file" className="hidden" accept="image/*,video/*" multiple />
                            </label>
                        </div>

                        {/* Preview grid - placeholder */}
                        {(gig.photos?.length || gig.videos?.length) ? (
                            <div className="grid grid-cols-3 gap-2">
                                {/* Media items would render here */}
                            </div>
                        ) : null}
                    </div>
                );

            case 'pricing':
                return (
                    <div className="space-y-6">
                        {/* Free toggle */}
                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">{t.freeGig}</p>
                                <p className="text-sm text-zinc-500">{t.promoDesc}</p>
                            </div>
                            <button
                                onClick={() => setGig(prev => ({ ...prev, is_free: !prev.is_free }))}
                                className={`w-12 h-7 rounded-full transition-all ${gig.is_free ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${gig.is_free ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>

                        {!gig.is_free && (
                            <>
                                {/* Price type */}
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                        {t.priceType}
                                    </h2>
                                    <p className="text-zinc-500 text-sm">
                                        {t.priceTypeDesc}
                                    </p>
                                    <div className="flex gap-2 mt-4">
                                        {[
                                            { id: 'fixed', label: t.priceFixed, desc: t.priceFixedDesc },
                                            { id: 'hourly', label: t.priceHourly, desc: t.priceHourlyDesc },
                                            { id: 'from', label: t.priceFrom, desc: t.priceFromDesc }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setGig(prev => ({ ...prev, pricing_type: type.id as Gig['pricing_type'] }))}
                                                className={`flex-1 p-3 rounded-xl border-2 transition-all text-center ${gig.pricing_type === type.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-zinc-200 dark:border-zinc-700'
                                                    }`}
                                            >
                                                <p className="font-bold text-zinc-900 dark:text-white">{type.label}</p>
                                                <p className="text-xs text-zinc-500">{type.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price amount */}
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                        {t.amountLabel}
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <input
                                            type="number"
                                            value={gig.price_amount || ''}
                                            onChange={(e) => setGig(prev => ({ ...prev, price_amount: Number(e.target.value) }))}
                                            placeholder="2000"
                                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* What's included */}
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                        {t.includedLabel}
                                    </label>
                                    <textarea
                                        value={gig.price_includes || ''}
                                        onChange={(e) => setGig(prev => ({ ...prev, price_includes: e.target.value }))}
                                        placeholder={t.placeholderPricing}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'location':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.locationLabel}
                            </label>
                            <div className="space-y-2">
                                {[
                                    { id: 'city', label: t.cityMode, icon: '🏙️' },
                                    { id: 'radius', label: t.radiusMode, icon: '📍' },
                                    { id: 'countrywide', label: t.countrywideMode, icon: '🇮🇱' },
                                    { id: 'online', label: t.onlineMode, icon: '💻' }
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setGig(prev => ({ ...prev, location_mode: mode.id as Gig['location_mode'] }))}
                                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${gig.location_mode === mode.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-zinc-200 dark:border-zinc-700'
                                            }`}
                                    >
                                        <span className="text-2xl">{mode.icon}</span>
                                        <span className="font-medium text-zinc-900 dark:text-white">{mode.label}</span>
                                        {gig.location_mode === mode.id && <Check className="w-5 h-5 text-blue-500 ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {gig.location_mode !== 'online' && (
                            <div>
                                <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                    {t.baseCityLabel}
                                </label>
                                <select
                                    value={gig.base_city || ''}
                                    onChange={(e) => setGig(prev => ({ ...prev, base_city: e.target.value }))}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white theme-select"
                                >
                                    {CITIES.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {gig.location_mode === 'radius' && (
                            <div>
                                <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                    {t.radiusLabel}: {gig.radius_km || 30} {t.km}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="150"
                                    value={gig.radius_km || 30}
                                    onChange={(e) => setGig(prev => ({ ...prev, radius_km: Number(e.target.value) }))}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'audience':
                return (
                    <div className="space-y-6">
                        {/* Kids suitable */}
                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">{t.kidsSuitable}</p>
                                <p className="text-sm text-zinc-500">{t.familyContent}</p>
                            </div>
                            <button
                                onClick={() => setGig(prev => ({ ...prev, suitable_for_kids: !prev.suitable_for_kids }))}
                                className={`w-12 h-7 rounded-full transition-all ${gig.suitable_for_kids ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${gig.suitable_for_kids ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>

                        {!gig.suitable_for_kids && (
                            <div>
                                <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                    {t.ageLimitLabel}
                                </label>
                                <div className="flex gap-2">
                                    {['16+', '18+'].map((limit) => (
                                        <button
                                            key={limit}
                                            onClick={() => setGig(prev => ({ ...prev, age_limit: limit as Gig['age_limit'] }))}
                                            className={`flex-1 p-3 rounded-xl border-2 font-bold transition-all ${gig.age_limit === limit
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600'
                                                : 'border-zinc-200 dark:border-zinc-700'
                                                }`}
                                        >
                                            {limit}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Event types */}
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.eventTypesLabel}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {EVENT_TYPES.map((type) => {
                                    const selected = (gig.event_types || []).includes(type.id);
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                const types = gig.event_types || [];
                                                if (selected) {
                                                    setGig(prev => ({ ...prev, event_types: types.filter(t => t !== type.id) }));
                                                } else {
                                                    setGig(prev => ({ ...prev, event_types: [...types, type.id] }));
                                                }
                                            }}
                                            className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-1 ${selected
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                                : 'border-zinc-200 dark:border-zinc-700'
                                                }`}
                                        >
                                            <span>{type.icon}</span>
                                            {(type.label as any)[lang]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 'details':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {t.durationLabel}
                                </label>
                                <input
                                    type="number"
                                    value={gig.duration_minutes || ''}
                                    onChange={(e) => setGig(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                                    placeholder="60"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    {t.maxGuestsLabel}
                                </label>
                                <input
                                    type="number"
                                    value={gig.max_guests || ''}
                                    onChange={(e) => setGig(prev => ({ ...prev, max_guests: Number(e.target.value) }))}
                                    placeholder="100"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.requirementsLabel}
                            </label>
                            <textarea
                                value={gig.requirements_text || ''}
                                onChange={(e) => setGig(prev => ({ ...prev, requirements_text: e.target.value }))}
                                placeholder={t.placeholderRequirements}
                                rows={2}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.clientNeedsLabel}
                            </label>
                            <textarea
                                value={gig.what_client_needs || ''}
                                onChange={(e) => setGig(prev => ({ ...prev, what_client_needs: e.target.value }))}
                                placeholder={t.placeholderWhatNeeds}
                                rows={2}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none"
                            />
                        </div>
                    </div>
                );

            case 'availability':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.bookingMethodLabel}
                            </label>
                            <div className="space-y-2">
                                {[
                                    { id: 'chat', label: t.chatMethod, desc: t.chatMethodDesc, icon: '💬' },
                                    { id: 'request_slot', label: t.slotMethod, desc: t.slotMethodDesc, icon: '📅', disabled: true }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => !method.disabled && setGig(prev => ({ ...prev, booking_method: method.id as Gig['booking_method'] }))}
                                        disabled={method.disabled}
                                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${gig.booking_method === method.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : method.disabled
                                                ? 'border-zinc-100 dark:border-zinc-800 opacity-50'
                                                : 'border-zinc-200 dark:border-zinc-700'
                                            }`}
                                    >
                                        <span className="text-2xl">{method.icon}</span>
                                        <div className="text-left">
                                            <p className="font-medium text-zinc-900 dark:text-white">{method.label}</p>
                                            <p className="text-sm text-zinc-500">{method.desc}</p>
                                        </div>
                                        {gig.booking_method === method.id && <Check className="w-5 h-5 text-blue-500 ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
                                {t.leadTimeLabel}
                            </label>
                            <select
                                value={gig.lead_time_hours || 24}
                                onChange={(e) => setGig(prev => ({ ...prev, lead_time_hours: Number(e.target.value) }))}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl theme-select"
                            >
                                <option value={24}>1 {t.day}</option>
                                <option value={48}>2 {t.days}</option>
                                <option value={72}>3 {t.days}</option>
                                <option value={168}>1 {t.week}</option>
                                <option value={336}>2 {t.weeks}</option>
                            </select>
                        </div>
                    </div>
                );

            case 'publish':
                return (
                    <div className="space-y-6">
                        {/* Preview card */}
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-lg">
                            <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600" />
                            <div className="p-4">
                                <h3 className="font-black text-lg text-zinc-900 dark:text-white">{gig.title || t.noTitle}</h3>
                                <p className="text-sm text-zinc-500 mt-1">{gig.short_description || t.noDesc}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-lg">
                                        {gig.category_id || t.categoryLabel}
                                    </span>
                                    {!gig.is_free && gig.price_amount && (
                                        <span className="text-sm font-bold text-green-600">
                                            ₪{gig.price_amount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-zinc-500">{t.howToPublish}</p>

                        {/* Publish options */}
                        <div className="space-y-3">
                            <button
                                onClick={() => handlePublish(false)}
                                disabled={loading}
                                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
                                {t.publicCatalog}
                            </button>

                            <button
                                onClick={() => handlePublish(true)}
                                disabled={loading}
                                className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <Share2 className="w-5 h-5" />
                                {t.linkOnly}
                            </button>
                        </div>

                        {/* Share link if unlisted */}
                        {shareLink && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                                <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
                                    ✅ {t.linkCreated}
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold flex items-center gap-1"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? t.copiedText : t.copy}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Success screen (after publish)
    if (currentStep >= GIG_WIZARD_STEPS.length) {
        return (
            <div className="fixed inset-0 z-50 bg-white dark:bg-black flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">
                        {t.gigCreatedTitle}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                        {t.gigCreatedDesc}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push(`/gig/${gig.id}`)}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            {t.viewGig}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white rounded-xl font-bold"
                        >
                            {t.done}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <p className="text-xs text-zinc-500">{t.stepCount.replace('{current}', (currentStep + 1).toString()).replace('{total}', GIG_WIZARD_STEPS.length.toString())}</p>
                        <p className="font-bold text-zinc-900 dark:text-white">{(stepConfig.title as any)[lang]}</p>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-zinc-200 dark:bg-zinc-800">
                    <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${((currentStep + 1) / GIG_WIZARD_STEPS.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Step icon and subtitle */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                        {stepConfig.icon}
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">{(stepConfig.subtitle as any)[lang]}</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer navigation */}
            <div className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 p-4 safe-area-bottom">
                <div className="max-w-lg mx-auto flex gap-3">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold flex items-center gap-2 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {t.back}
                        </button>
                    )}

                    {step !== 'publish' && (
                        <button
                            onClick={handleNext}
                            disabled={saving || loading}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all ml-auto disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {currentStep === GIG_WIZARD_STEPS.length - 1 ? t.publish : t.next}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
