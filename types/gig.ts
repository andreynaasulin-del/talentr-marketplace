// Gig Types for the Gig Builder feature

export interface GigPhoto {
    url: string;
    order: number;
    type?: string;
}

export interface GigVideo {
    url: string;
    duration?: number;
    order: number;
    thumbnail?: string;
}

export interface GigAddon {
    name: string;
    price: number;
}

export interface Gig {
    id: string;
    owner_user_id: string;
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
    status: 'draft' | 'published' | 'unlisted' | 'archived';
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
    title: string;
    subtitle: string;
    icon: string;
    required: boolean;
}> = {
    type: {
        title: 'Какой гиг создаём?',
        subtitle: 'Выбери шаблон или создай с нуля',
        icon: '✨',
        required: true
    },
    title: {
        title: 'Название и категория',
        subtitle: 'Как называется твой гиг?',
        icon: '📝',
        required: true
    },
    description: {
        title: 'Описание',
        subtitle: 'Расскажи о своём гиге',
        icon: '💬',
        required: true
    },
    media: {
        title: 'Фото и видео',
        subtitle: 'Покажи свою работу',
        icon: '📸',
        required: true
    },
    pricing: {
        title: 'Цена',
        subtitle: 'Сколько стоит твой гиг?',
        icon: '💰',
        required: true
    },
    location: {
        title: 'Локация',
        subtitle: 'Где ты работаешь?',
        icon: '📍',
        required: true
    },
    audience: {
        title: 'Аудитория',
        subtitle: 'Для кого подходит?',
        icon: '👥',
        required: true
    },
    details: {
        title: 'Детали',
        subtitle: 'Дополнительная информация',
        icon: '📋',
        required: false
    },
    availability: {
        title: 'Бронирование',
        subtitle: 'Как тебя бронировать?',
        icon: '📅',
        required: false
    },
    publish: {
        title: 'Публикация',
        subtitle: 'Готово к запуску!',
        icon: '🚀',
        required: true
    }
};

// Event types for audience selection
export const EVENT_TYPES = [
    { id: 'birthday', label: 'День рождения', icon: '🎂' },
    { id: 'wedding', label: 'Свадьба', icon: '💒' },
    { id: 'corporate', label: 'Корпоратив', icon: '🏢' },
    { id: 'kids', label: 'Детский праздник', icon: '🎈' },
    { id: 'party', label: 'Домашняя вечеринка', icon: '🎉' },
    { id: 'bar', label: 'Бар/Клуб', icon: '🍸' },
    { id: 'restaurant', label: 'Ресторан', icon: '🍽️' },
    { id: 'private', label: 'Частное мероприятие', icon: '🏠' },
    { id: 'festival', label: 'Фестиваль', icon: '🎪' },
    { id: 'graduation', label: 'Выпускной', icon: '🎓' },
    { id: 'anniversary', label: 'Юбилей', icon: '🥂' },
    { id: 'baby_shower', label: 'Baby Shower', icon: '👶' },
];

// Categories for gigs
export const GIG_CATEGORIES = [
    { id: 'DJ', label: 'DJ', icon: '🎧' },
    { id: 'Photographer', label: 'Фотограф', icon: '📸' },
    { id: 'Videographer', label: 'Видеограф', icon: '🎬' },
    { id: 'MC', label: 'Ведущий', icon: '🎤' },
    { id: 'Magician', label: 'Фокусник', icon: '🎩' },
    { id: 'Singer', label: 'Вокалист', icon: '🎵' },
    { id: 'Musician', label: 'Музыкант', icon: '🎸' },
    { id: 'Comedian', label: 'Комик', icon: '😂' },
    { id: 'Dancer', label: 'Танцор', icon: '💃' },
    { id: 'Bartender', label: 'Бармен', icon: '🍸' },
    { id: 'Kids Animator', label: 'Аниматор', icon: '🎈' },
    { id: 'Event Decor', label: 'Декор', icon: '🎨' },
    { id: 'Chef', label: 'Шеф-повар', icon: '👨‍🍳' },
    { id: 'Other', label: 'Другое', icon: '✨' },
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
    'Ramat Gan'
];
