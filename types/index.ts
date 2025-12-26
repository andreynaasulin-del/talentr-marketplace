export type VendorCategory =
    | 'Photographer'
    | 'Videographer'
    | 'DJ'
    | 'MC'
    | 'Magician'
    | 'Singer'
    | 'Musician'
    | 'Comedian'
    | 'Dancer'
    | 'Bartender'
    | 'Bar Show'
    | 'Event Decor'
    | 'Kids Animator'
    | 'Face Painter'
    | 'Piercing/Tattoo'
    | 'Chef';

export type City =
    | 'Tel Aviv'
    | 'Haifa'
    | 'Jerusalem'
    | 'Eilat'
    | 'Rishon LeZion'
    | 'Netanya'
    | 'Ashdod'
    | 'Beer Sheva'
    | 'Petah Tikva'
    | 'Herzliya'
    | 'Ramat Gan';

export interface Vendor {
    id: string;
    name: string;
    category: VendorCategory;
    city: City;
    rating: number;
    reviewsCount: number;
    priceFrom: number;
    imageUrl: string;
    tags: string[];
    description?: string;
    phone?: string; // WhatsApp number format: 972XXXXXXXXX
    isVerified?: boolean;
    isFeatured?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'completed';

export interface Booking {
    id: string;
    created_at: string;
    client_id: string;
    vendor_id: string;
    event_date: string;
    event_type: string;
    status: BookingStatus;
    details?: string;
    price_quoted?: number;
}
