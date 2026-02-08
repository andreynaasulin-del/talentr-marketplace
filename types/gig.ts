// Gig Types for the Gig Builder feature

export interface GigPhoto {
    url: string;
    order: number;
    type?: string;
    // Upload state (client-side only)
    uploading?: boolean;
    tempId?: string;
}

export interface GigVideo {
    url: string;
    duration?: number;
    order: number;
    thumbnail?: string;
    // Upload state (client-side only)
    uploading?: boolean;
    tempId?: string;
}

export interface GigAddon {
    name: string;
    price: number;
}

export interface Gig {
    id: string;
    owner_user_id?: string | null;
    vendor_id?: string;

    // Basic Info
    title: string;
    category_id: string;
    tags: string[];
    short_description: string;
    full_description?: string;
    languages: string[];

    // Media
    photos: GigPhoto[];
    videos: GigVideo[];

    // Pricing
    is_free: boolean;
    currency: string;
    pricing_type: 'fixed' | 'hourly' | 'from';
    price_amount?: number;
    price_includes?: string;
    addons: GigAddon[];

    // Location
    location_mode: 'city' | 'radius' | 'countrywide' | 'online';
    base_city?: string;
    radius_km?: number;
    excluded_areas: string[];
    travel_fee?: number;

    // Audience
    suitable_for_kids: boolean;
    age_limit?: 'none' | '16+' | '18+';
    event_types: string[];

    // Details
    duration_minutes?: number;
    min_guests?: number;
    max_guests?: number;
    requirements_text?: string;
    what_client_needs?: string;

    // Booking
    booking_method: 'chat' | 'request_slot';
    lead_time_hours: number;

    // Visibility
    status: 'draft' | 'pending_review' | 'active' | 'hidden' | 'archived' | 'published' | 'unlisted'; // Keeping published for legacy if needed
    share_slug?: string;
    moderation_status: 'pending' | 'approved' | 'rejected';

    // Template
    template_id?: string;

    // Wizard
    current_step: number;
    wizard_completed: boolean;

    // Timestamps
    created_at: string;
    updated_at: string;
    published_at?: string;
}

export interface GigTemplate {
    id: string;
    name: string;
    category_id: string;
    icon: string;
    description_blocks: {
        title: string;
        placeholder: string;
    }[];
    required_fields: string[];
    suggested_tags: string[];
    suggested_price_min?: number;
    suggested_price_max?: number;
    media_hints?: Record<string, string>;
    is_active: boolean;
    sort_order: number;
}

// Wizard Step Types
export type GigWizardStep =
    | 'type'           // Step 0: Template or from scratch
    | 'title'          // Step 1: Title & Category
    | 'description'    // Step 2: Description
    | 'media'          // Step 3: Photos & Videos
    | 'pricing'        // Step 4: Pricing
    | 'location'       // Step 5: Location
    | 'audience'       // Step 6: Audience
    | 'details'        // Step 7: Details
    | 'availability'   // Step 8: Booking method
    | 'publish';       // Step 9: Publish/Visibility

export const GIG_WIZARD_STEPS: GigWizardStep[] = [
    'type',
    'title',
    'description',
    'media',
    'pricing',
    'location',
    'audience',
    'details',
    'availability',
    'publish'
];

export const GIG_STEP_CONFIG: Record<GigWizardStep, {
    title: Record<string, string>;
    subtitle: Record<string, string>;
    icon: string;
    required: boolean;
}> = {
    type: {
        title: { en: 'What type of Gig?', he: 'איזה סוג גיג?' },
        subtitle: { en: 'Choose a template or start from scratch', he: 'בחר תבנית או התחל מאפס' },
        icon: '✨',
        required: true
    },
    title: {
        title: { en: 'Title & Category', he: 'כותרת וקטגוריה' },
        subtitle: { en: 'What is your gig called?', he: 'איך קוראים לגיג שלך?' },
        icon: '📝',
        required: true
    },
    description: {
        title: { en: 'Description', he: 'תיאור' },
        subtitle: { en: 'Tell us about your gig', he: 'ספר לנו על הגיג שלך' },
        icon: '💬',
        required: true
    },
    media: {
        title: { en: 'Photos & Videos', he: 'תמונות וסרטונים' },
        subtitle: { en: 'Show your work', he: 'הראה את העבודה שלך' },
        icon: '📸',
        required: true
    },
    pricing: {
        title: { en: 'Pricing', he: 'תמחור' },
        subtitle: { en: 'How much does it cost?', he: 'כמה זה עולה?' },
        icon: '💰',
        required: true
    },
    location: {
        title: { en: 'Location', he: 'מיקום' },
        subtitle: { en: 'Where do you work?', he: 'איפה אתה עובד?' },
        icon: '📍',
        required: true
    },
    audience: {
        title: { en: 'Audience', he: 'קהל יעד' },
        subtitle: { en: 'Who is it for?', he: 'למי זה מתאים?' },
        icon: '👥',
        required: true
    },
    details: {
        title: { en: 'Details', he: 'פרטים' },
        subtitle: { en: 'Additional information', he: 'מידע נוסף' },
        icon: '📋',
        required: false
    },
    availability: {
        title: { en: 'Booking', he: 'הזמנה' },
        subtitle: { en: 'How to book you?', he: 'איך להזמין אותך?' },
        icon: '📅',
        required: false
    },
    publish: {
        title: { en: 'Publish', he: 'פרסום' },
        subtitle: { en: 'Ready to launch!', he: 'מוכן להשקה!' },
        icon: '🚀',
        required: true
    }
};

// Event types for audience selection
export const EVENT_TYPES = [
    { id: 'birthday', label: { en: 'Birthday', he: 'יום הולדת' }, icon: '🎂' },
    { id: 'wedding', label: { en: 'Wedding', he: 'חתונה' }, icon: '💒' },
    { id: 'corporate', label: { en: 'Corporate', he: 'אירוע עסקי' }, icon: '🏢' },
    { id: 'kids', label: { en: 'Kids Party', he: 'מסיבת ילדים' }, icon: '🎈' },
    { id: 'party', label: { en: 'House Party', he: 'מסיבה פרטית' }, icon: '🎉' },
    { id: 'bar', label: { en: 'Bar/Club', he: 'בר/מועדון' }, icon: '🍸' },
    { id: 'restaurant', label: { en: 'Restaurant', he: 'מסעדה' }, icon: '🍽️' },
    { id: 'private', label: { en: 'Private Event', he: 'אירוע פרטי' }, icon: '🏠' },
    { id: 'festival', label: { en: 'Festival', he: 'פסטיבל' }, icon: '🎪' },
    { id: 'graduation', label: { en: 'Graduation', he: 'מסיבת סיום' }, icon: '🎓' },
    { id: 'anniversary', label: { en: 'Anniversary', he: 'יום נישואין' }, icon: '🥂' },
    { id: 'baby_shower', label: { en: 'Baby Shower', he: 'מסיבת ברית/ה' }, icon: '👶' },
];

// Categories for gigs
export const GIG_CATEGORIES = [
    { id: 'DJ', label: { en: 'DJ', he: 'די-ג׳יי' }, icon: '🎧' },
    { id: 'Photographer', label: { en: 'Photographer', he: 'צלם' }, icon: '📸' },
    { id: 'Videographer', label: { en: 'Videographer', he: 'וידאוגרף' }, icon: '🎬' },
    { id: 'MC', label: { en: 'MC / Host', he: 'מנחה' }, icon: '🎤' },
    { id: 'Magician', label: { en: 'Magician', he: 'קוסם' }, icon: '🎩' },
    { id: 'Singer', label: { en: 'Singer', he: 'זמר' }, icon: '🎵' },
    { id: 'Musician', label: { en: 'Musician', he: 'מוזיקאי' }, icon: '🎸' },
    { id: 'Comedian', label: { en: 'Comedian', he: 'סטנדאפיסט' }, icon: '😂' },
    { id: 'Dancer', label: { en: 'Dancer', he: 'רקדן' }, icon: '💃' },
    { id: 'Bartender', label: { en: 'Bartender', he: 'ברמן' }, icon: '🍸' },
    { id: 'Kids Animator', label: { en: 'Kids Animator', he: 'מפעיל ילדים' }, icon: '🎈' },
    { id: 'Event Decor', label: { en: 'Decor', he: 'עיצוב' }, icon: '🎨' },
    { id: 'Chef', label: { en: 'Chef', he: 'שף' }, icon: '👨‍🍳' },
    { id: 'Other', label: { en: 'Other', he: 'אחר' }, icon: '✨' },
];

// Cities in Israel
export const CITIES = [
    'Tel Aviv',
    'Jerusalem',
    'Haifa',
    'Eilat',
    'Rishon LeZion',
    'Netanya',
    'Ashdod',
    'Beer Sheva',
    'Herzliya',
    'Ramat Gan',
    'Petah Tikva',
    'Bat Yam',
    'Holon',
    'Rehovot',
    'Kfar Saba',
    'Ra\'anana',
    'Modiin',
];
