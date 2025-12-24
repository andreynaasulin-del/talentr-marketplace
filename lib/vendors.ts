import { supabase } from './supabase';
import { Vendor, VendorCategory, City } from '@/types';

// Type for Supabase vendor row (snake_case)
interface VendorRow {
    id: string;
    name: string;
    category: VendorCategory;
    city: City;
    rating: number;
    reviews_count: number;
    price_from: number;
    image_url: string;
    tags: string[];
    description: string | null;
    phone: string | null;
    is_verified: boolean;
    is_featured: boolean;
}

// Convert Supabase row to app Vendor type (camelCase)
const toVendor = (row: VendorRow): Vendor => ({
    id: row.id,
    name: row.name,
    category: row.category,
    city: row.city,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    priceFrom: row.price_from,
    imageUrl: row.image_url,
    tags: row.tags || [],
    description: row.description || undefined,
    phone: row.phone || undefined,
    isVerified: row.is_verified,
    isFeatured: row.is_featured,
});

// ========== VENDOR QUERIES ==========

/**
 * Get all active vendors
 */
export async function getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching vendors:', error);
        return [];
    }

    return (data || []).map(toVendor);
}

/**
 * Get vendors by category
 */
export async function getVendorsByCategory(category: VendorCategory): Promise<Vendor[]> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching vendors by category:', error);
        return [];
    }

    return (data || []).map(toVendor);
}

/**
 * Get vendors by city
 */
export async function getVendorsByCity(city: City): Promise<Vendor[]> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching vendors by city:', error);
        return [];
    }

    return (data || []).map(toVendor);
}

/**
 * Get single vendor by ID - falls back to mock data
 */
export async function getVendorById(id: string): Promise<Vendor | null> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.log('Using fallback vendor data for ID:', id);
        return getMockVendorById(id);
    }

    return toVendor(data);
}

/**
 * Get featured vendors (for homepage) - falls back to mock data
 */
export async function getFeaturedVendors(limit: number = 6): Promise<Vendor[]> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(limit);

    if (error || !data || data.length === 0) {
        console.log('Using fallback vendor data');
        return getMockFeaturedVendors(limit);
    }

    return data.map(toVendor);
}

// Mock data for when Supabase is unavailable
const mockVendorsList: Vendor[] = [
    { id: 'mock-1', name: 'David Cohen Photography', category: 'Photographer', city: 'Tel Aviv', rating: 4.9, reviewsCount: 127, priceFrom: 2500, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', tags: ['Wedding', 'Bar Mitzvah', 'Corporate'], description: 'Professional wedding and event photographer with 10+ years experience.', phone: '+972501234567', isVerified: true, isFeatured: true },
    { id: 'mock-2', name: 'DJ Noam - Electronic Vibes', category: 'DJ', city: 'Tel Aviv', rating: 4.8, reviewsCount: 94, priceFrom: 3000, imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80', tags: ['Wedding', 'Birthday', 'Club Night'], description: 'High-energy DJ specializing in EDM and Top 40 hits.', phone: '+972551234567', isVerified: true, isFeatured: true },
    { id: 'mock-3', name: 'Yael Levi - Master of Ceremonies', category: 'MC', city: 'Haifa', rating: 5.0, reviewsCount: 156, priceFrom: 1800, imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', tags: ['Wedding', 'Bar Mitzvah', 'Corporate'], description: 'Charismatic host making your event unforgettable.', phone: '+972521234567', isVerified: true, isFeatured: true },
    { id: 'mock-4', name: 'Magic Mike - Illusions Show', category: 'Magician', city: 'Jerusalem', rating: 4.9, reviewsCount: 89, priceFrom: 2000, imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80', tags: ['Kids Party', 'Bar Mitzvah', 'Corporate'], description: 'Award-winning magician bringing wonder to every event.', phone: '+972541234567', isVerified: true, isFeatured: true },
    { id: 'mock-5', name: 'Dream Decorations', category: 'Event Decor', city: 'Tel Aviv', rating: 5.0, reviewsCount: 234, priceFrom: 3000, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', tags: ['Wedding', 'Bar Mitzvah', 'Corporate'], description: 'Transforming venues into magical spaces.', phone: '+972531234567', isVerified: true, isFeatured: true },
    { id: 'mock-6', name: 'Sarah Gold - Wedding Singer', category: 'Singer', city: 'Tel Aviv', rating: 4.7, reviewsCount: 203, priceFrom: 3500, imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80', tags: ['Wedding', 'Corporate', 'Private Party'], description: 'Soul and pop singer with 15 years experience.', phone: '+972561234567', isVerified: true, isFeatured: true },
];

function getMockFeaturedVendors(limit: number): Vendor[] {
    return mockVendorsList.slice(0, limit);
}

function getMockVendorById(id: string): Vendor | null {
    return mockVendorsList.find(v => v.id === id) || mockVendorsList[0];
}

/**
 * Search vendors by query (name, description, tags)
 */
export async function searchVendors(query: string): Promise<Vendor[]> {
    const searchTerm = query.toLowerCase().trim();

    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('rating', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error searching vendors:', error);
        return [];
    }

    return (data || []).map(toVendor);
}

/**
 * Filter vendors with multiple criteria
 */
export interface VendorFilters {
    category?: VendorCategory;
    city?: City;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isVerified?: boolean;
}

export async function filterVendors(filters: VendorFilters): Promise<Vendor[]> {
    let query = supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true);

    if (filters.category) {
        query = query.eq('category', filters.category);
    }

    if (filters.city) {
        query = query.eq('city', filters.city);
    }

    if (filters.minPrice !== undefined) {
        query = query.gte('price_from', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        query = query.lte('price_from', filters.maxPrice);
    }

    if (filters.minRating !== undefined) {
        query = query.gte('rating', filters.minRating);
    }

    if (filters.isVerified !== undefined) {
        query = query.eq('is_verified', filters.isVerified);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
        console.error('Error filtering vendors:', error);
        return [];
    }

    return (data || []).map(toVendor);
}

// ========== BOOKING QUERIES ==========

export interface CreateBookingData {
    clientId: string;
    vendorId: string;
    eventDate: string;
    eventType: string;
    details?: string;
}

export async function createBooking(data: CreateBookingData) {
    const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
            client_id: data.clientId,
            vendor_id: data.vendorId,
            event_date: data.eventDate,
            event_type: data.eventType,
            details: data.details,
            status: 'pending',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error);
        throw error;
    }

    return booking;
}

export async function getClientBookings(clientId: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            vendor:vendors(id, name, category, city, image_url)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }

    return data || [];
}

export async function getVendorBookings(vendorId: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('event_date', { ascending: true });

    if (error) {
        console.error('Error fetching vendor bookings:', error);
        return [];
    }

    return data || [];
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'declined' | 'completed' | 'cancelled') {
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

    if (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
}
