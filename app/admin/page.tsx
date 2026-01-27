'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Users, UserPlus, Send, Eye, CheckCircle, XCircle, Clock,
    Instagram, Globe, Search, Filter, Copy, ExternalLink,
    BarChart3, TrendingUp, Calendar, RefreshCw, ChevronDown,
    Mail, MessageCircle, Phone, Sparkles, Shield, AlertCircle,
    ChevronLeft, ChevronRight, Languages, Trash2, Edit3, Star, X, Check,
    Camera, Upload, Archive, Loader2
} from 'lucide-react';

// Localization
const translations = {
    en: {
        // Header
        adminTitle: 'Talentr Admin',
        toSite: 'To Site',
        logout: 'Logout',

        // Tabs
        dashboard: 'Dashboard',
        pending: 'Pending',
        vendors: 'Vendors',
        gigs: 'Gigs',
        archive: 'Archive',
        settings: 'Settings',

        // Archive
        archiveTitle: 'Archive',
        archiveDescription: 'Hidden test profiles and inactive vendors',
        moveToArchive: 'Move to Archive',
        restoreFromArchive: 'Restore From Archive',
        noArchivedProfiles: 'No archived profiles',
        archiveConfirm: 'Are you sure you want to archive this vendor?',
        unarchiveConfirm: 'Restore this vendor from archive?',

        // Stats
        totalVendors: 'Total Vendors',
        active: 'Active',
        pendingCount: 'Pending',
        invited: 'Invited',
        confirmedThisMonth: 'Confirmed (Month)',
        bookings: 'Bookings',

        // Quick Actions
        quickActions: 'Quick Actions',
        addTalent: 'Add Talent',
        createPreliminaryProfile: 'Create preliminary profile',
        sendInvitations: 'Send Invitations',
        awaiting: 'awaiting',
        profiles: 'profiles',

        // Filters
        searchPlaceholder: 'Search by name, email, Instagram...',
        searchVendors: 'Search vendors...',
        allStatuses: 'All Statuses',
        statusPending: 'Pending',
        statusInvited: 'Invited',
        statusViewed: 'Viewed',
        statusConfirmed: 'Confirmed',
        statusDeclined: 'Declined',
        allCategories: 'All Categories',

        // Categories
        catPhotographer: 'Photographer',
        catVideographer: 'Videographer',
        catDJ: 'DJ',
        catMC: 'MC / Host',
        catSinger: 'Singer',
        catMusician: 'Musician',
        catDancer: 'Dancer',
        catModel: 'Model',
        catInfluencer: 'Influencer',
        catOther: 'Other',

        // Pending list
        noPendingProfiles: 'No pending profiles',
        createFirst: 'Create First',
        created: 'Created',
        followers: 'followers',
        copyLink: 'Copy Link',
        send: 'Send',
        linkCopied: 'Link copied!',
        messageCopied: 'Message copied! ✓',

        // Vendors
        activeStatus: 'Active',
        inactiveStatus: 'Inactive',
        reviews: 'reviews',
        openProfile: 'Open Profile',

        // Pagination
        back: 'Back',
        next: 'Next',
        page: 'Page',
        of: 'of',

        // Create form
        createTalentProfile: 'Create Talent Profile',
        fillBasedOn: 'Fill in data based on Instagram or Google',
        source: 'Source',
        sourceUrl: 'Source URL',
        manualEntry: 'Manual Entry',
        nameTitle: 'Name / Title',
        namePlaceholder: 'Talent name or business name',
        category: 'Category',
        selectCategory: 'Select category',
        city: 'City',
        selectCity: 'Select city',
        phoneWhatsApp: 'Phone (WhatsApp)',
        optional: '(optional)',
        profilePhotoUrl: 'Profile Photo URL',
        descriptionBio: 'Description (from bio)',
        copyDescriptionPlaceholder: 'Copy description from profile...',
        creating: 'Creating...',
        createAndGetLink: 'Create and Get Link',
        profileCreated: '✓ Profile created! Confirmation link:',

        // Access denied
        accessDenied: 'Access Denied',
        noAdminRights: 'You do not have admin rights',

        // Actions & UI
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        actions: 'Actions',
        confirmDelete: 'Are you sure you want to delete this profile?',
        verified: 'Verified',
        featured: 'Featured',
        status: 'Status',
        saveChanges: 'Save Changes',
        profileDetails: 'Profile Details',

        // Invite modal
        inviteModalTitle: 'Send Invitation',
        inviteReady: 'Invitation message ready!',
        inviteVia: 'Send via',
        copyMessageBtn: 'Copy Message',
        openInstagramDM: 'Open Instagram DM',
        openWhatsApp: 'Open WhatsApp',
        copyEmail: 'Copy for Email',
        inviteCopied: 'Invitation copied to clipboard!',
        close: 'Close',

        // Quick Invite
        quickInvite: '⚡️ Quick Invite',
        quickInviteDesc: 'Only name, talent fills the rest',
        enterNameOrInsta: 'Name or Instagram',
        getInviteLink: 'Get Link',

        // Gigs
        gigsTitle: 'All Gigs',
        gigsSubtitle: 'Vendor gigs moderation',
        refresh: 'Refresh',
        filterAll: 'All',
        filterPending: 'Pending',
        filterApproved: 'Approved',
        filterRejected: 'Rejected',
        noGigs: 'No gigs yet',
        noGigsDesc: 'When vendors create gigs, they will appear here.',
        openBuilder: 'Open Gig Builder',
        statusDraft: 'Draft',
        statusPublished: 'Published',
        statusUnlisted: 'Unlisted',
        statusArchived: 'Archived',
        approve: 'Approve',
        reject: 'Reject',
        reset: 'Reset',
        view: 'View',
        loading: 'Loading...'
    },
    he: {
        // Header
        adminTitle: 'ניהול Talentr',
        toSite: 'לאתר',
        logout: 'התנתק',

        // Tabs
        dashboard: 'לוח בקרה',
        pending: 'ממתינים',
        vendors: 'ספקים',
        gigs: 'גיגים',
        archive: 'ארכיון',
        settings: 'הגדרות',

        // Archive
        archiveTitle: 'ארכיון',
        archiveDescription: 'פרופילים מוסתרים וספקים לא פעילים',
        moveToArchive: 'העבר לארכיון',
        restoreFromArchive: 'שחזר מהארכיון',
        noArchivedProfiles: 'אין פרופילים בארכיון',
        archiveConfirm: 'האם אתה בטוח שברצונך להעביר ספק זה לארכיון?',
        unarchiveConfirm: 'לשחזר ספק זה מהארכיון?',

        // Stats
        totalVendors: 'סה״כ ספקים',
        active: 'פעילים',
        pendingCount: 'ממתינים',
        invited: 'הוזמנו',
        confirmedThisMonth: 'אושר החודש',
        bookings: 'הזמנות',

        // Quick Actions
        quickActions: 'פעולות מהירות',
        addTalent: 'הוסף טאלנט',
        createPreliminaryProfile: 'צור פרופיל ראשוני',
        sendInvitations: 'שלח הזמנות',
        awaiting: 'ממתינים',
        profiles: 'פרופילים',

        // Filters
        searchPlaceholder: 'חיפוש לפי שם, אימייל, אינסטגרם...',
        searchVendors: 'חפש ספקים...',
        allStatuses: 'כל הסטטוסים',
        statusPending: 'ממתין',
        statusInvited: 'הוזמן',
        statusViewed: 'נצפה',
        statusConfirmed: 'מאושר',
        statusDeclined: 'נדחה',
        allCategories: 'כל הקטגוריות',

        // Categories
        catPhotographer: 'צלם',
        catVideographer: 'צלם וידאו',
        catDJ: 'די-ג׳יי',
        catMC: 'מנחה',
        catSinger: 'זמר',
        catMusician: 'מוזיקאי',
        catDancer: 'רקדן',
        catModel: 'דוגמן',
        catInfluencer: 'משפיען',
        catOther: 'אחר',

        // Pending list
        noPendingProfiles: 'אין פרופילים ממתינים',
        createFirst: 'צור ראשון',
        created: 'נוצר',
        followers: 'עוקבים',
        copyLink: 'העתק קישור',
        send: 'שלח',
        linkCopied: 'הקישור הועתק!',
        messageCopied: 'ההודעה הועתקה! ✓',

        // Vendors
        activeStatus: 'פעיל',
        inactiveStatus: 'לא פעיל',
        reviews: 'ביקורות',
        openProfile: 'פתח פרופיל',

        // Pagination
        back: 'הקודם',
        next: 'הבא',
        page: 'עמוד',
        of: 'מתוך',

        // Create form
        createTalentProfile: 'יצירת פרופיל טאלנט',
        fillBasedOn: 'מלא פרטים על בסיס אינסטגרם או גוגל',
        source: 'מקור',
        sourceUrl: 'כתובת מקור',
        manualEntry: 'הזנה ידנית',
        nameTitle: 'שם / כותרת',
        namePlaceholder: 'שם הטאלנט או העסק',
        category: 'קטגוריה',
        selectCategory: 'בחר קטגוריה',
        city: 'עיר',
        selectCity: 'בחר עיר',
        phoneWhatsApp: 'טלפון (וואטסאפ)',
        optional: '(אופציונלי)',
        profilePhotoUrl: 'כתובת תמונת פרופיל',
        descriptionBio: 'תיאור (מהביו)',
        copyDescriptionPlaceholder: 'העתק תיאור מהפרופיל...',
        creating: 'יוצר...',
        createAndGetLink: 'צור וקבל קישור',
        profileCreated: '✓ הפרופיל נוצר! קישור לאישור:',

        // Access denied
        accessDenied: 'הגישה נדחתה',
        noAdminRights: 'אין לך הרשאות ניהול',

        // Actions & UI
        edit: 'ערוך',
        delete: 'מחק',
        save: 'שמור',
        cancel: 'ביטול',
        actions: 'פעולות',
        confirmDelete: 'האם אתה בטוח שברצונך למחוק פרופיל זה?',
        verified: 'מאומת',
        featured: 'מודגש',
        status: 'סטטוס',
        saveChanges: 'שמור שינויים',
        profileDetails: 'פרטי פרופיל',

        // Invite modal
        inviteModalTitle: 'שלח הזמנה',
        inviteReady: 'ההודעה מוכנה!',
        inviteVia: 'שלח דרך',
        copyMessageBtn: 'העתק הודעה',
        openInstagramDM: 'פתח אינסטגרם DM',
        openWhatsApp: 'פתח וואטסאפ',
        copyEmail: 'העתק לאימייל',
        inviteCopied: 'ההזמנה הועתקה ללוח!',
        close: 'סגור',

        // Quick Invite
        quickInvite: '⚡️ הזמנה מהירה',
        quickInviteDesc: 'רק שם, הטאלנט ימלא את השאר',
        enterNameOrInsta: 'שם או אינסטגרם',
        getInviteLink: 'קבל קישור',

        // Gigs
        gigsTitle: 'כל הגיגים',
        gigsSubtitle: 'ניהול גיגים של ספקים',
        refresh: 'רענן',
        filterAll: 'הכל',
        filterPending: 'ממתינים',
        filterApproved: 'מאושרים',
        filterRejected: 'נדחים',
        noGigs: 'אין עדיין גיגים',
        noGigsDesc: 'כאשר ספקים יצרו גיגים, הם יופיעו כאן.',
        openBuilder: 'פתח בונה גיגים',
        statusDraft: 'טיוטה',
        statusPublished: 'פורסם',
        statusUnlisted: 'לא רשום',
        statusArchived: 'בארכיון',
        approve: 'אשר',
        reject: 'דחה',
        reset: 'אפס',
        view: 'צפה',
        loading: 'טוען...'
    }
};

type Lang = 'en' | 'he';

interface PendingVendor {
    id: string;
    created_at: string;
    name: string;
    category?: string;
    city?: string;
    email?: string;
    phone?: string;
    instagram_handle?: string;
    image_url?: string;
    description?: string;
    source_type: string;
    status: string;
    instagram_followers?: number;
    confirmation_token: string;
}

interface Vendor {
    id: string;
    created_at: string;
    name: string;
    category: string;
    city: string;
    email?: string;
    phone?: string;
    image_url?: string;
    is_active: boolean;
    is_verified: boolean;
    is_featured: boolean; // Added is_featured
    is_archived: boolean; // Added is_archived
    status: 'active' | 'inactive'; // Added status
    rating: number;
    reviews_count: number;
    edit_token?: string;
}

interface Stats {
    totalVendors: number;
    activeVendors: number;
    pendingVendors: number;
    invitedPending: number;
    confirmedThisMonth: number;
    totalBookings: number;
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', icon: Clock },
    invited: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: Send },
    viewed: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', icon: Eye },
    confirmed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
    declined: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    expired: { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-500', icon: Clock }
};

export default function AdminPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'pending' | 'vendors' | 'gigs' | 'archive' | 'settings' | 'create'>('dashboard');

    // Edit Modal State
    const [editingVendor, setEditingVendor] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Language state
    const [lang, setLang] = useState<Lang>('he');
    const t = translations[lang];

    // Load saved language preference
    useEffect(() => {
        const savedLang = localStorage.getItem('adminLang') as Lang;
        if (savedLang && (savedLang === 'en' || savedLang === 'he')) {
            setLang(savedLang);
        }
    }, []);

    // Save language preference
    const toggleLanguage = () => {
        const newLang = lang === 'he' ? 'en' : 'he';
        setLang(newLang);
        localStorage.setItem('adminLang', newLang);
    };

    // Data states
    const [stats, setStats] = useState<Stats | null>(null);
    const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [totalVendors, setTotalVendors] = useState(0);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(0);

    // Create form
    const [createForm, setCreateForm] = useState({
        name: '',
        category: '',
        city: '',
        email: '',
        phone: '',
        instagram_handle: '',
        source_type: 'manual' as 'instagram' | 'google' | 'manual',
        source_url: '',
        description: '',
        image_url: ''
    });
    const [creating, setCreating] = useState(false);
    const [createdLink, setCreatedLink] = useState('');

    // Edit pending profile
    const [editingPending, setEditingPending] = useState<PendingVendor | null>(null);
    const [editPendingForm, setEditPendingForm] = useState({
        name: '',
        category: '',
        city: '',
        email: '',
        phone: '',
        instagram_handle: '',
        description: '',
        image_url: ''
    });

    // Gigs state for admin management
    const [adminGigs, setAdminGigs] = useState<{
        id: string;
        title: string;
        category_id: string;
        status: string;
        moderation_status: string;
        vendor_id: string;
        share_slug: string;
        price_amount: number;
        photos: { url: string }[];
        created_at: string;
        view_count: number;
        vendor_name?: string;
    }[]>([]);
    const [gigsLoading, setGigsLoading] = useState(false);
    const [gigsFilter, setGigsFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    // Photo upload state
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Handle image upload to Supabase Storage
    const handleImageUpload = async (file: File, target: 'create' | 'edit') => {
        setUploadingPhoto(true);
        try {
            // Create form data for upload
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Failed to upload image');
                return;
            }

            // Update the appropriate form
            if (target === 'create') {
                setCreateForm(prev => ({ ...prev, image_url: data.url }));
            } else {
                setEditPendingForm(prev => ({ ...prev, image_url: data.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload image');
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Token for API calls
    const [authToken, setAuthToken] = useState<string | null>(null);

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            // Check for secret admin access first (easter egg)
            const adminAccess = localStorage.getItem('adminAccess');
            if (adminAccess) {
                try {
                    const parsed = JSON.parse(adminAccess);
                    // Check if session is still valid (24 hours)
                    if (parsed.isAdmin && parsed.email === 'talentr@admintab.co' &&
                        Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                        setAuthToken('admin-secret-access');
                        setIsAdmin(true);
                        setLoading(false);
                        return;
                    } else {
                        // Session expired, remove it
                        localStorage.removeItem('adminAccess');
                    }
                } catch {
                    localStorage.removeItem('adminAccess');
                }
            }

            if (!supabase) {
                router.push('/signin?redirect=/admin');
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/signin?redirect=/admin');
                return;
            }

            setAuthToken(session.access_token);

            // Check if user is admin (we'll verify server-side too)
            // For now, allow access and let API reject if not admin
            setIsAdmin(true);
            setLoading(false);
        };

        checkAuth();
    }, [router]);

    // Fetch data
    const fetchStats = useCallback(async () => {
        if (!authToken) return;
        try {
            const res = await fetch('/api/admin?action=stats', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (res.ok) setStats(data.stats);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, [authToken]);

    const fetchPending = useCallback(async () => {
        if (!authToken) return;
        try {
            const params = new URLSearchParams({ action: 'pending' });
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);

            const res = await fetch(`/api/admin?${params}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (res.ok) setPendingVendors(data.pending || []);
        } catch (err) {
            console.error('Failed to fetch pending:', err);
        }
    }, [authToken, statusFilter, search]);

    const fetchVendors = useCallback(async () => {
        if (!authToken) return;
        try {
            const client = supabase;
            if (!client) return;

            let query = client
                .from('vendors')
                .select('*', { count: 'exact' });

            // Apply filters - proper archive logic
            if (activeTab === 'archive') {
                // Archive tab: only show is_archived = true
                query = query.eq('is_archived', true);
            } else {
                // Vendors tab: show only NOT archived (is_archived = false)
                // After migration, all vendors have is_archived = false by default
                query = query.eq('is_archived', false);
            }

            if (search) {
                query = query.or(`name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%,instagram_handle.ilike.%${search}%`);
            }
            if (categoryFilter) {
                query = query.eq('category', categoryFilter);
            }

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(page * 10, (page + 1) * 10 - 1);

            if (data) {
                setVendors(data as Vendor[]);
                setTotalVendors(count || 0);
            } else if (error) {
                console.error('Failed to fetch vendors:', error);
            }
        } catch (err) {
            console.error('Failed to fetch vendors:', err);
        }
    }, [authToken, categoryFilter, search, page, activeTab]);

    // Fetch gigs for admin moderation
    const fetchGigs = useCallback(async () => {
        if (!authToken) return;
        setGigsLoading(true);
        try {
            const client = supabase;
            if (!client) return;

            let query = client
                .from('gigs')
                .select('id, title, category_id, status, moderation_status, vendor_id, share_slug, price_amount, photos, created_at, view_count');

            // Apply moderation filter
            if (gigsFilter !== 'all') {
                query = query.eq('moderation_status', gigsFilter);
            }

            const { data, error } = await query
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) {
                // Fetch vendor names for each gig
                const vendorIds = [...new Set(data.filter(g => g.vendor_id).map(g => g.vendor_id))];
                let vendorMap: Record<string, string> = {};

                if (vendorIds.length > 0) {
                    const { data: vendorsData } = await client
                        .from('vendors')
                        .select('id, name, full_name')
                        .in('id', vendorIds);

                    if (vendorsData) {
                        vendorMap = vendorsData.reduce((acc, v) => {
                            acc[v.id] = v.full_name || v.name || 'Unknown';
                            return acc;
                        }, {} as Record<string, string>);
                    }
                }

                setAdminGigs(data.map(g => ({
                    ...g,
                    vendor_name: g.vendor_id ? vendorMap[g.vendor_id] : 'No Vendor'
                })));
            } else if (error) {
                console.error('Failed to fetch gigs:', error);
            }
        } catch (err) {
            console.error('Failed to fetch gigs:', err);
        } finally {
            setGigsLoading(false);
        }
    }, [authToken, gigsFilter]);

    // Load gigs when gigs tab is active
    useEffect(() => {
        if (authToken && activeTab === 'gigs') {
            fetchGigs();
        }
    }, [authToken, activeTab, fetchGigs]);

    useEffect(() => {
        if (authToken) {
            fetchStats();
            fetchPending();
            fetchVendors();
        }
    }, [authToken, fetchStats, fetchPending, fetchVendors]);

    // Create pending vendor
    const handleCreate = async () => {
        if (!authToken || !createForm.name) return;
        setCreating(true);
        setCreatedLink('');

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    action: 'create_pending',
                    data: createForm
                })
            });

            const data = await res.json();
            if (res.ok) {
                setCreatedLink(data.confirmLink);
                // Reset form
                setCreateForm({
                    name: '',
                    category: '',
                    city: '',
                    email: '',
                    phone: '',
                    instagram_handle: '',
                    source_type: 'manual',
                    source_url: '',
                    description: '',
                    image_url: ''
                });
                fetchPending();
                fetchStats();
            } else {
                alert(data.error || 'Failed to create');
            }
        } catch (err) {
            console.error('Failed to create pending:', err);
        } finally {
            setCreating(false);
        }
    };

    // Moderate gig (approve or reject)
    const moderateGig = async (gigId: string, action: 'approved' | 'rejected' | 'pending') => {
        if (!authToken) return;
        try {
            const client = supabase;
            if (!client) return;

            const { error } = await client
                .from('gigs')
                .update({ moderation_status: action })
                .eq('id', gigId);

            if (error) {
                console.error('Failed to moderate gig:', error);
                alert('Failed to update gig status');
                return;
            }

            // Refresh gigs list
            fetchGigs();
        } catch (err) {
            console.error('Moderation error:', err);
        }
    };

    // Message templates state
    const [messageModal, setMessageModal] = useState<{
        isOpen: boolean;
        pending: PendingVendor | null;
        method: 'email' | 'instagram_dm' | 'whatsapp';
    }>({ isOpen: false, pending: null, method: 'instagram_dm' });

    // Generate invitation message
    const generateMessage = (pending: PendingVendor, link: string, method: 'email' | 'instagram_dm' | 'whatsapp') => {
        const name = pending.name.split(' ')[0]; // First name only

        const isQuick = pending.description === 'QUICK_INVITE';

        if (method === 'instagram_dm') {
            if (isQuick) {
                return `Hey ${name}! 👋 We found your profile and would love to feature you on Talentr - a platform connecting professionals with clients in Israel.

We've started a profile for you. Just complete your details here to go live:
${link}

It's free and takes 2 minutes! 🎯`;
            }
            return `Hey ${name}! 👋

We found your amazing work on Instagram and would love to feature you on Talentr - a platform connecting talented professionals with clients in Israel.

We've already created a profile for you based on your Instagram. Just review and confirm it here:
${link}

It's free and takes 2 minutes! 🎯`;
        }

        if (method === 'whatsapp') {
            if (isQuick) {
                return `Hi ${name}! 👋 This is Talentr team. We started a profile for you on our platform. 

Please complete it here: ${link} 🚀`;
            }
            return `Hi ${name}! 👋

This is Talentr team. We noticed your work and created a profile for you on our platform.

Check it out and confirm: ${link}

Free to join, takes 2 min! 🚀`;
        }

        // Email
        if (isQuick) {
            return `Hi ${name},

We'd love to invite you to join Talentr - a platform that connects talented professionals with clients in Israel.

We've started a profile for you. Please complete the setup here:
${link}

It's completely free and only takes a couple of minutes.

Best regards,
Talentr Team`;
        }
        return `Hi ${name},

We came across your work and were impressed! We'd love to feature you on Talentr - a platform that connects talented professionals with clients looking for services like yours.

We've prepared a profile for you based on your online presence. Please review and confirm it here:
${link}

It's completely free and only takes a couple of minutes.

Best regards,
Talentr Team`;
    };

    // Send invitation
    const handleSendInvitation = async (pendingId: string, method: 'email' | 'instagram_dm' | 'whatsapp') => {
        if (!authToken) return;

        const pending = pendingVendors.find(p => p.id === pendingId);
        if (!pending) return;

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    action: 'send_invitation',
                    pendingId,
                    method
                })
            });

            const data = await res.json();
            if (res.ok) {
                // Open modal with message instead of just copying link
                setMessageModal({
                    isOpen: true,
                    pending: { ...pending, confirmation_token: data.link.split('/').pop() },
                    method
                });
                fetchPending();
            }
        } catch (err) {
            console.error('Failed to send invitation:', err);
        }
    };

    // Delete pending vendor
    const handleDeletePending = async (pendingId: string) => {
        if (!authToken || !confirm(t.confirmDelete)) return;

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    action: 'delete_pending',
                    pendingId
                })
            });

            if (res.ok) {
                fetchPending();
                fetchStats();
            }
        } catch (err) {
            console.error('Failed to delete pending:', err);
        }
    };

    // Update vendor
    const handleUpdateVendor = async (vendorId: string, updates: any) => {
        if (!authToken) return;
        setIsSaving(true);

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    action: 'update_vendor',
                    vendorId,
                    updates
                })
            });

            if (res.ok) {
                setEditingVendor(null);
                fetchVendors();
                fetchStats();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update vendor');
            }
        } catch (err) {
            console.error('Failed to update vendor:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Toggle vendor status
    const handleToggleStatus = (vendorId: string, currentStatus: 'active' | 'inactive') => {
        handleUpdateVendor(vendorId, { status: currentStatus === 'active' ? 'inactive' : 'active' });
    };

    // Toggle vendor verification
    const handleToggleVerified = (vendorId: string, isVerified: boolean) => {
        handleUpdateVendor(vendorId, { is_verified: !isVerified });
    };

    // Toggle vendor archive status
    const handleToggleArchive = (vendorId: string, isArchived: boolean) => {
        if (!confirm(isArchived ? t.unarchiveConfirm : t.archiveConfirm)) return;
        handleUpdateVendor(vendorId, { is_archived: !isArchived });
    };

    // Delete vendor
    const handleDeleteVendor = async (vendorId: string) => {
        if (!authToken || !confirm(t.confirmDelete)) return;

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    action: 'delete_vendor',
                    vendorId
                })
            });

            if (res.ok) {
                fetchVendors();
                fetchStats();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete vendor');
            }
        } catch (err) {
            console.error('Failed to delete vendor:', err);
        }
    };

    // Open edit pending modal
    const openEditPending = (pending: PendingVendor) => {
        setEditingPending(pending);
        setEditPendingForm({
            name: pending.name || '',
            category: pending.category || '',
            city: pending.city || '',
            email: pending.email || '',
            phone: pending.phone || '',
            instagram_handle: pending.instagram_handle || '',
            description: pending.description || '',
            image_url: pending.image_url || ''
        });
    };

    // Save edit pending
    const saveEditPending = async () => {
        if (!authToken || !editingPending) return;

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    action: 'update_pending',
                    pendingId: editingPending.id,
                    data: editPendingForm
                })
            });

            if (res.ok) {
                setEditingPending(null);
                fetchPending();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update');
            }
        } catch (err) {
            console.error('Failed to update pending:', err);
        }
    };

    // Copy link
    const copyConfirmLink = (token: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const link = `${baseUrl}/confirm/${token}`;
        navigator.clipboard.writeText(link);
        alert(t.linkCopied);
    };

    // Copy message with link
    const copyMessage = () => {
        if (!messageModal.pending) return;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const link = `${baseUrl}/confirm/${messageModal.pending.confirmation_token}`;
        const message = generateMessage(messageModal.pending, link, messageModal.method);
        navigator.clipboard.writeText(message);
        alert(t.messageCopied);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.accessDenied}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">{t.noAdminRights}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Total LTR Reset and Global Admin Styles */}
            <style jsx global>{`
                [dir="rtl"] .admin-root, 
                .admin-root [dir="rtl"], 
                .admin-root {
                    direction: ltr !important;
                    text-align: left !important;
                }
                .admin-root input, 
                .admin-root select, 
                .admin-root textarea {
                    direction: ltr !important;
                    text-align: left !important;
                }
                /* Force alignment for specific elements that might be inherited from global rtl */
                .admin-root .flex, 
                .admin-root .grid {
                    text-align: left !important;
                }
            `}</style>

            <div className="admin-root min-h-screen bg-zinc-100 dark:bg-black" dir="ltr">
                {/* Header */}
                <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                                <h1 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">
                                    {t.adminTitle}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-3">
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-bold text-xs md:text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
                                title="Switch language"
                            >
                                <Languages className="w-4 h-4" />
                                <span className="hidden md:inline">{lang === 'he' ? 'HE' : 'EN'}</span>
                            </button>
                            <button
                                onClick={() => { fetchStats(); fetchPending(); fetchVendors(); }}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                            </button>
                            <a
                                href="/"
                                className="hidden md:flex px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                {t.toSite}
                            </a>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('adminAccess');
                                    router.push('/');
                                }}
                                className="flex items-center gap-1 px-2 md:px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <span className="hidden md:inline">{t.logout}</span>
                                <X className="w-4 h-4 md:hidden" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6" dir="ltr">
                    {/* Tabs */}
                    <nav className="flex gap-1 md:gap-4 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
                            { id: 'pending', label: t.pending, icon: Clock, count: stats?.pendingVendors },
                            { id: 'vendors', label: t.vendors, icon: Users, count: stats?.totalVendors },
                            { id: 'gigs', label: 'Gigs', icon: Sparkles },
                            { id: 'archive', label: t.archive, icon: Archive },
                            { id: 'settings', label: t.settings, icon: Shield }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className={item.id === 'archive' ? 'block' : 'hidden md:block'}>{item.label}</span>
                                {item.count !== undefined && item.count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                        }`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && stats && (
                        <div className="space-y-6 mt-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {[
                                    { label: t.totalVendors, value: stats.totalVendors, icon: Users, color: 'blue' },
                                    { label: t.active, value: stats.activeVendors, icon: CheckCircle, color: 'green' },
                                    { label: t.pendingCount, value: stats.pendingVendors, icon: Clock, color: 'amber' },
                                    { label: t.invited, value: stats.invitedPending, icon: Send, color: 'purple' },
                                    { label: t.confirmedThisMonth, value: stats.confirmedThisMonth, icon: TrendingUp, color: 'emerald' },
                                    { label: t.bookings, value: stats.totalBookings, icon: Calendar, color: 'pink' }
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center mb-3`}>
                                            <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                        </div>
                                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                                        <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{t.quickActions}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setActiveTab('create')}
                                        className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <UserPlus className="w-6 h-6 text-blue-600" />
                                        <div className="text-left">
                                            <p className="font-bold text-zinc-900 dark:text-white">{t.addTalent}</p>
                                            <p className="text-xs text-zinc-500">{t.createPreliminaryProfile}</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCreateForm({
                                                name: '',
                                                category: '',
                                                city: '',
                                                email: '',
                                                phone: '',
                                                instagram_handle: '',
                                                source_type: 'manual',
                                                source_url: '',
                                                description: 'QUICK_INVITE',
                                                image_url: ''
                                            });
                                            setActiveTab('create');
                                        }}
                                        className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                                    >
                                        <Sparkles className="w-6 h-6 text-purple-600" />
                                        <div className="text-left">
                                            <p className="font-bold text-zinc-900 dark:text-white">{t.quickInvite}</p>
                                            <p className="text-xs text-zinc-500">{t.quickInviteDesc}</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
                                    >
                                        <Send className="w-6 h-6 text-amber-600" />
                                        <div className="text-left">
                                            <p className="font-bold text-zinc-900 dark:text-white">{t.sendInvitations}</p>
                                            <p className="text-xs text-zinc-500">{stats.pendingVendors} {t.awaiting}</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('vendors')}
                                        className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                                    >
                                        <Users className="w-6 h-6 text-green-600" />
                                        <div className="text-left">
                                            <p className="font-bold text-zinc-900 dark:text-white">{t.vendors}</p>
                                            <p className="text-xs text-zinc-500">{stats.totalVendors} {t.profiles}</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending Tab */}
                    {activeTab === 'pending' && (
                        <div className="space-y-4 mt-6">
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder={t.searchPlaceholder}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                                >
                                    <option value="">{t.allStatuses}</option>
                                    <option value="pending">{t.statusPending}</option>
                                    <option value="invited">{t.statusInvited}</option>
                                    <option value="viewed">{t.statusViewed}</option>
                                    <option value="confirmed">{t.statusConfirmed}</option>
                                    <option value="declined">{t.statusDeclined}</option>
                                </select>
                            </div>

                            {/* Pending List */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                {pendingVendors.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Clock className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                                        <p className="text-zinc-500 dark:text-zinc-400">{t.noPendingProfiles}</p>
                                        <button
                                            onClick={() => setActiveTab('create')}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
                                        >
                                            {t.createFirst}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {pendingVendors.map((pending) => {
                                            const statusStyle = statusColors[pending.status] || statusColors.pending;
                                            const StatusIcon = statusStyle.icon;

                                            return (
                                                <div key={pending.id} className="p-4 md:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        {/* Avatar */}
                                                        <div className="w-16 h-16 md:w-14 md:h-14 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                                            {pending.image_url ? (
                                                                <img
                                                                    src={pending.image_url}
                                                                    alt={pending.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Users className="w-6 h-6 md:w-5 md:h-5 text-zinc-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                                <h4 className="font-bold text-zinc-900 dark:text-white text-base md:text-sm truncate">
                                                                    {pending.name}
                                                                </h4>
                                                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}>
                                                                    <StatusIcon className="w-2.5 h-2.5" />
                                                                    {pending.status}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-500">
                                                                {pending.category && (
                                                                    <span className="flex items-center gap-1.5">
                                                                        <div className="w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                                                                        {pending.category}
                                                                    </span>
                                                                )}
                                                                {pending.instagram_handle && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Instagram className="w-3.5 h-3.5 text-pink-500" />
                                                                        @{pending.instagram_handle}
                                                                    </span>
                                                                )}
                                                                {pending.email && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                                                                        {pending.email}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-[10px] text-zinc-400 mt-2 font-medium">
                                                                {t.created.toUpperCase()}: {new Date(pending.created_at).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US')}
                                                            </p>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center justify-between md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => copyConfirmLink(pending.confirmation_token)}
                                                                    className="p-2.5 md:p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                                                    title={t.copyLink}
                                                                >
                                                                    <Copy className="w-4.5 h-4.5 md:w-4 md:h-4 text-zinc-500" />
                                                                </button>

                                                                <button
                                                                    onClick={() => openEditPending(pending)}
                                                                    className="p-2.5 md:p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                                    title={t.edit}
                                                                >
                                                                    <Edit3 className="w-4.5 h-4.5 md:w-4 md:h-4 text-blue-500" />
                                                                </button>

                                                                <button
                                                                    onClick={() => handleDeletePending(pending.id)}
                                                                    className="p-2.5 md:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                                    title={t.delete}
                                                                >
                                                                    <Trash2 className="w-4.5 h-4.5 md:w-4 md:h-4 text-red-500" />
                                                                </button>
                                                            </div>

                                                            {pending.status !== 'confirmed' && (
                                                                <div className="relative group">
                                                                    <button className="flex items-center gap-2 px-4 py-2.5 md:px-3 md:py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
                                                                        <Send className="w-4 h-4" />
                                                                        {t.send}
                                                                        <ChevronDown className="w-3 h-3" />
                                                                    </button>
                                                                    <div className="absolute right-0 bottom-full md:bottom-auto md:top-full mb-2 md:mb-0 md:mt-1 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 min-w-[160px]">
                                                                        <button
                                                                            onClick={() => handleSendInvitation(pending.id, 'email')}
                                                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-left text-sm first:rounded-t-xl last:rounded-b-xl"
                                                                        >
                                                                            <Mail className="w-4 h-4 text-blue-500" /> Email
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSendInvitation(pending.id, 'instagram_dm')}
                                                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-left text-sm"
                                                                        >
                                                                            <Instagram className="w-4 h-4 text-pink-500" /> Instagram DM
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSendInvitation(pending.id, 'whatsapp')}
                                                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-left text-sm"
                                                                        >
                                                                            <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Vendors & Archive Tabs */}
                    {(activeTab === 'vendors' || activeTab === 'archive') && (
                        <div className="space-y-6 mt-6">
                            {/* Title and Stats */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">
                                        {activeTab === 'archive' ? t.archiveTitle : t.vendors}
                                    </h2>
                                    <p className="text-zinc-500 text-sm">
                                        {activeTab === 'archive' ? t.archiveDescription : `${totalVendors} ${t.profiles}`}
                                    </p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder={t.searchVendors}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                                >
                                    <option value="">{t.allCategories}</option>
                                    <option value="Photographer">{t.catPhotographer}</option>
                                    <option value="Videographer">{t.catVideographer}</option>
                                    <option value="DJ">{t.catDJ}</option>
                                    <option value="MC">{t.catMC}</option>
                                    <option value="Singer">{t.catSinger}</option>
                                    <option value="Musician">{t.catMusician}</option>
                                    <option value="Dancer">{t.catDancer}</option>
                                    <option value="Model">{t.catModel}</option>
                                    <option value="Influencer">{t.catInfluencer}</option>
                                    <option value="Other">{t.catOther}</option>
                                </select>
                            </div>

                            {/* Vendors Grid */}
                            {vendors.length === 0 ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800">
                                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                        {activeTab === 'archive' ? t.noArchivedProfiles : t.noPendingProfiles}
                                    </h3>
                                    <p className="text-zinc-500 max-w-sm mx-auto">
                                        {activeTab === 'archive' ? t.archiveDescription : t.createFirst}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {vendors.map((vendor) => (
                                        <div key={vendor.id} className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                                            {/* Image Header */}
                                            <div className="relative h-48 md:h-56">
                                                {vendor.image_url ? (
                                                    <img
                                                        src={vendor.image_url}
                                                        alt={vendor.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                        <Users className="w-12 h-12 text-zinc-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleVerified(vendor.id, vendor.is_verified)}
                                                        className={`p-2 rounded-xl backdrop-blur-md transition-all ${vendor.is_verified
                                                            ? 'bg-blue-600/90 text-white'
                                                            : 'bg-black/20 text-white hover:bg-black/40'
                                                            }`}
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateVendor(vendor.id, { is_featured: !vendor.is_featured })}
                                                        className={`p-2 rounded-xl backdrop-blur-md transition-all ${vendor.is_featured
                                                            ? 'bg-yellow-500/90 text-white'
                                                            : 'bg-black/20 text-white hover:bg-black/40'
                                                            }`}
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="absolute top-4 right-4">
                                                    <button
                                                        onClick={() => handleToggleArchive(vendor.id, vendor.is_archived)}
                                                        className={`p-2 rounded-xl backdrop-blur-md transition-all ${vendor.is_archived
                                                            ? 'bg-orange-600/90 text-white'
                                                            : 'bg-black/20 text-white hover:bg-black/40'
                                                            }`}
                                                        title={vendor.is_archived ? t.restoreFromArchive : t.moveToArchive}
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5 md:p-6">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-bold text-zinc-900 dark:text-white text-lg line-clamp-1">{vendor.name}</h3>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${vendor.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-500'
                                                        : 'bg-zinc-500/10 text-zinc-500'
                                                        }`}>
                                                        {vendor.status === 'active' ? t.activeStatus : t.inactiveStatus}
                                                    </span>
                                                </div>

                                                <p className="text-zinc-500 text-sm mb-4 line-clamp-1">
                                                    {vendor.category} • {vendor.city || 'Israel'}
                                                </p>

                                                <div className="flex items-center gap-1 mb-6">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-zinc-900 dark:text-white text-sm">{vendor.rating || 0}</span>
                                                    <span className="text-zinc-500 text-xs">({vendor.reviews_count || 0} {t.reviews})</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {vendor.edit_token && (
                                                        <button
                                                            onClick={() => {
                                                                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
                                                                const link = `${baseUrl}/vendor/edit/${vendor.edit_token}`;
                                                                navigator.clipboard.writeText(link);
                                                                alert('Magic Edit Link copied! 🪄');
                                                            }}
                                                            className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-purple-600 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                                            title="Copy Magic Edit Link"
                                                        >
                                                            <Sparkles className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <a
                                                        href={`/vendor/${vendor.id}`}
                                                        target="_blank"
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        {t.openProfile}
                                                    </a>
                                                    <button
                                                        onClick={() => setEditingVendor(vendor)}
                                                        className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-blue-500 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVendor(vendor.id)}
                                                        className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-red-500 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalVendors > 10 && ( // Changed from 20 to 10 for pagination limit
                                <div className="flex items-center justify-center gap-4 pt-6">
                                    <button
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> {t.back}
                                    </button>
                                    <span className="text-sm text-zinc-500">
                                        {t.page} {page + 1} {t.of} {Math.ceil(totalVendors / 10)}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={(page + 1) * 10 >= totalVendors}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg disabled:opacity-50"
                                    >
                                        {t.next} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gigs Tab */}
                    {activeTab === 'gigs' && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{t.gigsTitle}</h2>
                                    <p className="text-zinc-500 text-sm">{t.gigsSubtitle}</p>
                                </div>
                                <button
                                    onClick={fetchGigs}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500"
                                    title={t.refresh}
                                >
                                    <RefreshCw className={`w-5 h-5 ${gigsLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl mb-6 w-fit">
                                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setGigsFilter(filter)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${gigsFilter === filter
                                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                                            }`}
                                    >
                                        {filter === 'all' && t.filterAll}
                                        {filter === 'pending' && t.filterPending}
                                        {filter === 'approved' && t.filterApproved}
                                        {filter === 'rejected' && t.filterRejected}
                                    </button>
                                ))}
                            </div>

                            {/* Gigs list */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                {gigsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                        <p className="text-zinc-500">{t.loading}</p>
                                    </div>
                                ) : adminGigs.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                                        <p className="text-zinc-500 font-medium">
                                            {t.noGigs}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {adminGigs.map((gig) => (
                                            <div key={gig.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                {/* Thumbnail */}
                                                <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                    {gig.photos?.[0]?.url ? (
                                                        <img src={gig.photos[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                                                        {gig.title}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 truncate">
                                                        {gig.vendor_name} • {gig.category_id}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gig.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            gig.status === 'draft' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            }`}>
                                                            {gig.status}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gig.moderation_status === 'approved' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            gig.moderation_status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                            }`}>
                                                            {gig.moderation_status}
                                                        </span>
                                                        {gig.price_amount && (
                                                            <span className="text-xs text-zinc-500">₪{gig.price_amount}</span>
                                                        )}
                                                        <span className="text-xs text-zinc-400">👁 {gig.view_count || 0}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <a
                                                        href={`/g/${gig.share_slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-blue-600"
                                                        title={t.view}
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>

                                                    {gig.moderation_status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => moderateGig(gig.id, 'approved')}
                                                                className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-zinc-400 hover:text-green-600"
                                                                title={t.approve}
                                                            >
                                                                <Check className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => moderateGig(gig.id, 'rejected')}
                                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-zinc-400 hover:text-red-600"
                                                                title={t.reject}
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {gig.moderation_status !== 'pending' && (
                                                        <button
                                                            onClick={() => moderateGig(gig.id, 'pending')}
                                                            className="px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                                        >
                                                            {t.reset}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Create Tab */}
                    {activeTab === 'create' && (
                        <div className="max-w-2xl mx-auto mt-6">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                        <UserPlus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                            {t.createTalentProfile}
                                        </h2>
                                        <p className="text-sm text-zinc-500">
                                            {t.fillBasedOn}
                                        </p>
                                    </div>
                                </div>

                                {createdLink && (
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-500/20">
                                        <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
                                            {t.profileCreated}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={createdLink}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-green-300 dark:border-green-600 rounded-lg text-sm"
                                            />
                                            <button
                                                onClick={() => navigator.clipboard.writeText(createdLink)}
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg font-bold text-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                                {t.source} *
                                            </label>
                                            <select
                                                value={createForm.source_type}
                                                onChange={(e) => setCreateForm({ ...createForm, source_type: e.target.value as 'instagram' | 'google' | 'manual' })}
                                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                            >
                                                <option value="instagram">Instagram</option>
                                                <option value="google">Google Business</option>
                                                <option value="manual">{t.manualEntry}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                                {t.sourceUrl}
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://instagram.com/..."
                                                value={createForm.source_url}
                                                onChange={(e) => setCreateForm({ ...createForm, source_url: e.target.value })}
                                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            {t.nameTitle} *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t.namePlaceholder}
                                            value={createForm.name}
                                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                                {t.category}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { value: 'Photographer', label: t.catPhotographer },
                                                    { value: 'Videographer', label: t.catVideographer },
                                                    { value: 'DJ', label: t.catDJ },
                                                    { value: 'MC', label: t.catMC },
                                                    { value: 'Singer', label: t.catSinger },
                                                    { value: 'Musician', label: t.catMusician },
                                                    { value: 'Dancer', label: t.catDancer },
                                                    { value: 'Model', label: t.catModel },
                                                    { value: 'Influencer', label: t.catInfluencer },
                                                    { value: 'Other', label: t.catOther }
                                                ].map((cat) => {
                                                    const isSelected = createForm.category.split(',').map(s => s.trim()).includes(cat.value);
                                                    return (
                                                        <button
                                                            key={cat.value}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = createForm.category ? createForm.category.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                                let updated: string[];
                                                                if (isSelected) {
                                                                    updated = current.filter(c => c !== cat.value);
                                                                } else {
                                                                    updated = [...current, cat.value];
                                                                }
                                                                setCreateForm({ ...createForm, category: updated.join(', ') });
                                                            }}
                                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${isSelected
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                                                                }`}
                                                        >
                                                            {cat.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                                {t.city}
                                            </label>
                                            <select
                                                value={createForm.city}
                                                onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                            >
                                                <option value="">{t.selectCity}</option>
                                                <option value="Tel Aviv">Tel Aviv</option>
                                                <option value="Haifa">Haifa</option>
                                                <option value="Jerusalem">Jerusalem</option>
                                                <option value="Eilat">Eilat</option>
                                                <option value="Netanya">Netanya</option>
                                                <option value="Ashdod">Ashdod</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                                <Instagram className="w-4 h-4 inline mr-1" /> Instagram <span className="text-zinc-400 font-normal">{t.optional}</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="@username"
                                                value={createForm.instagram_handle}
                                                onChange={(e) => setCreateForm({ ...createForm, instagram_handle: e.target.value.replace('@', '') })}
                                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                                Email <span className="text-zinc-400 font-normal">{t.optional}</span>
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="email@example.com"
                                                value={createForm.email}
                                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            {t.phoneWhatsApp} <span className="text-zinc-400 font-normal">{t.optional}</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+972..."
                                            value={createForm.phone}
                                            onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            {t.profilePhotoUrl}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            {/* Preview */}
                                            <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                                {createForm.image_url ? (
                                                    <img
                                                        src={createForm.image_url}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Camera className="w-6 h-6 text-zinc-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* URL Input + Upload */}
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="url"
                                                    placeholder="https://... или загрузите"
                                                    value={createForm.image_url}
                                                    onChange={(e) => setCreateForm({ ...createForm, image_url: e.target.value })}
                                                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm"
                                                />
                                                <label className={`flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    {uploadingPhoto ? (
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Upload className="w-4 h-4" />
                                                    )}
                                                    <span className="hidden md:inline">Загрузить</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        disabled={uploadingPhoto}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(file, 'create');
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            {t.descriptionBio}
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder={t.copyDescriptionPlaceholder}
                                            value={createForm.description}
                                            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handleCreate}
                                        disabled={creating || !createForm.name}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors"
                                    >
                                        {creating ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                {t.creating}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                {t.createAndGetLink}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Vendor Modal */}
                {editingVendor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.profileDetails}</h3>
                                <button
                                    onClick={() => setEditingVendor(null)}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-height-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">{t.nameTitle}</label>
                                    <input
                                        type="text"
                                        value={editingVendor.name}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">{t.category}</label>
                                        <select
                                            value={editingVendor.category}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, category: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        >
                                            <option value="Photographer">{t.catPhotographer}</option>
                                            <option value="Videographer">{t.catVideographer}</option>
                                            <option value="DJ">{t.catDJ}</option>
                                            <option value="MC">{t.catMC}</option>
                                            <option value="Singer">{t.catSinger}</option>
                                            <option value="Musician">{t.catMusician}</option>
                                            <option value="Dancer">{t.catDancer}</option>
                                            <option value="Model">{t.catModel}</option>
                                            <option value="Influencer">{t.catInfluencer}</option>
                                            <option value="Other">{t.catOther}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">{t.city}</label>
                                        <select
                                            value={editingVendor.city}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, city: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        >
                                            <option value="Tel Aviv">Tel Aviv</option>
                                            <option value="Haifa">Haifa</option>
                                            <option value="Jerusalem">Jerusalem</option>
                                            <option value="Eilat">Eilat</option>
                                            <option value="Netanya">Netanya</option>
                                            <option value="Ashdod">Ashdod</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">{t.phoneWhatsApp}</label>
                                    <input
                                        type="text"
                                        value={editingVendor.phone || ''}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editingVendor.email || ''}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                    />
                                </div>

                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingVendor.is_active}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold dark:text-white">{t.activeStatus}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingVendor.is_verified}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, is_verified: e.target.checked })}
                                            className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold dark:text-white">{t.verified}</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 bg-zinc-50/50 dark:bg-zinc-800/20">
                                <button
                                    onClick={() => setEditingVendor(null)}
                                    className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-white font-bold rounded-xl hover:bg-zinc-50 transition-colors"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={() => handleUpdateVendor(editingVendor.id, editingVendor)}
                                    disabled={isSaving}
                                    className="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                                    {t.saveChanges}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Send Invitation Modal */}
                {messageModal.isOpen && messageModal.pending && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <Send className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.inviteModalTitle}</h3>
                                        <p className="text-sm text-zinc-500">{messageModal.pending.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMessageModal({ isOpen: false, pending: null, method: 'instagram_dm' })}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Method Tabs */}
                                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                    {(['instagram_dm', 'whatsapp', 'email'] as const).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMessageModal({ ...messageModal, method: m })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${messageModal.method === m
                                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                                }`}
                                        >
                                            {m === 'instagram_dm' && <Instagram className="w-4 h-4" />}
                                            {m === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
                                            {m === 'email' && <Mail className="w-4 h-4" />}
                                            {m === 'instagram_dm' && 'DM'}
                                            {m === 'whatsapp' && 'WhatsApp'}
                                            {m === 'email' && 'Email'}
                                        </button>
                                    ))}
                                </div>

                                {/* Message Preview */}
                                <div className="relative">
                                    <textarea
                                        readOnly
                                        value={generateMessage(
                                            messageModal.pending,
                                            `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/confirm/${messageModal.pending.confirmation_token}`,
                                            messageModal.method
                                        )}
                                        className="w-full h-48 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 resize-none focus:outline-none"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                                            {t.inviteReady}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    {messageModal.method === 'instagram_dm' && messageModal.pending.instagram_handle && (
                                        <a
                                            href={`https://instagram.com/direct/t/${messageModal.pending.instagram_handle}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={copyMessage}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                                        >
                                            <Instagram className="w-5 h-5" />
                                            {t.openInstagramDM}
                                        </a>
                                    )}

                                    {messageModal.method === 'whatsapp' && messageModal.pending.phone && (
                                        <a
                                            href={`https://wa.me/${messageModal.pending.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                                                generateMessage(
                                                    messageModal.pending,
                                                    `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/confirm/${messageModal.pending.confirmation_token}`,
                                                    'whatsapp'
                                                )
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            {t.openWhatsApp}
                                        </a>
                                    )}

                                    <button
                                        onClick={() => {
                                            copyMessage();
                                            alert(t.inviteCopied);
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors col-span-2"
                                    >
                                        <Copy className="w-5 h-5" />
                                        {t.copyMessageBtn}
                                    </button>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    {messageModal.pending.instagram_handle && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400">
                                            <Instagram className="w-3 h-3" /> @{messageModal.pending.instagram_handle}
                                        </span>
                                    )}
                                    {messageModal.pending.phone && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400">
                                            <Phone className="w-3 h-3" /> {messageModal.pending.phone}
                                        </span>
                                    )}
                                    {messageModal.pending.email && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400">
                                            <Mail className="w-3 h-3" /> {messageModal.pending.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                                <button
                                    onClick={() => setMessageModal({ isOpen: false, pending: null, method: 'instagram_dm' })}
                                    className="w-full px-4 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-white font-bold rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                                >
                                    {t.close}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Pending Modal */}
                {editingPending && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                        {t.edit}: {editingPending.name}
                                    </h3>
                                    <button
                                        onClick={() => setEditingPending(null)}
                                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Avatar Preview & URL */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                        {t.profilePhotoUrl}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                            {editPendingForm.image_url ? (
                                                <img
                                                    src={editPendingForm.image_url}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Camera className="w-6 h-6 text-zinc-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="url"
                                                placeholder="https://... или загрузите"
                                                value={editPendingForm.image_url}
                                                onChange={(e) => setEditPendingForm({ ...editPendingForm, image_url: e.target.value })}
                                                className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm"
                                            />
                                            <label className={`flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploadingPhoto ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={uploadingPhoto}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, 'edit');
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                        {t.nameTitle}
                                    </label>
                                    <input
                                        type="text"
                                        value={editPendingForm.name}
                                        onChange={(e) => setEditPendingForm({ ...editPendingForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                    />
                                </div>

                                {/* Category & City */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            {t.category}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { value: 'Photographer', label: t.catPhotographer },
                                                { value: 'Videographer', label: t.catVideographer },
                                                { value: 'DJ', label: t.catDJ },
                                                { value: 'MC', label: t.catMC },
                                                { value: 'Singer', label: t.catSinger },
                                                { value: 'Musician', label: t.catMusician },
                                                { value: 'Dancer', label: t.catDancer },
                                                { value: 'Model', label: t.catModel },
                                                { value: 'Influencer', label: t.catInfluencer },
                                                { value: 'Other', label: t.catOther }
                                            ].map((cat) => {
                                                const isSelected = editPendingForm.category.split(',').map(s => s.trim()).includes(cat.value);
                                                return (
                                                    <button
                                                        key={cat.value}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = editPendingForm.category ? editPendingForm.category.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                            let updated: string[];
                                                            if (isSelected) {
                                                                updated = current.filter(c => c !== cat.value);
                                                            } else {
                                                                updated = [...current, cat.value];
                                                            }
                                                            setEditPendingForm({ ...editPendingForm, category: updated.join(', ') });
                                                        }}
                                                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                                                            }`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            {t.city}
                                        </label>
                                        <select
                                            value={editPendingForm.city}
                                            onChange={(e) => setEditPendingForm({ ...editPendingForm, city: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        >
                                            <option value="">{t.selectCity}</option>
                                            <option value="Tel Aviv">Tel Aviv</option>
                                            <option value="Haifa">Haifa</option>
                                            <option value="Jerusalem">Jerusalem</option>
                                            <option value="Eilat">Eilat</option>
                                            <option value="Netanya">Netanya</option>
                                            <option value="Ashdod">Ashdod</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Instagram & Email */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Instagram
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@username"
                                            value={editPendingForm.instagram_handle}
                                            onChange={(e) => setEditPendingForm({ ...editPendingForm, instagram_handle: e.target.value.replace('@', '') })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editPendingForm.email}
                                            onChange={(e) => setEditPendingForm({ ...editPendingForm, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                        {t.phoneWhatsApp}
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+972..."
                                        value={editPendingForm.phone}
                                        onChange={(e) => setEditPendingForm({ ...editPendingForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3">
                                <button
                                    onClick={() => setEditingPending(null)}
                                    className="flex-1 px-4 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-white font-bold rounded-xl"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={saveEditPending}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
