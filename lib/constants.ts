/**
 * Application constants
 * Centralizes configuration to follow DRY/SOLID principles
 */

// Site URL - used across the app for SEO, emails, and share links
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentr.co.il';

// App metadata
export const APP_NAME = 'Talentr';
export const APP_DESCRIPTION = 'Find the Best Event Professionals in Israel';

// Social links
export const SOCIAL_LINKS = {
    whatsapp: (phone: string, message: string) => 
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
};

// API endpoints
export const API_ENDPOINTS = {
    chat: '/api/chat',
    email: '/api/email',
    aiSearch: '/api/ai-search',
} as const;

// Default values
export const DEFAULTS = {
    vendorImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    currency: 'ILS',
    currencySymbol: '₪',
} as const;

