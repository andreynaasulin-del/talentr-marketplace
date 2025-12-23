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
 * Get single vendor by ID
 */
export async function getVendorById(id: string): Promise<Vendor | null> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching vendor:', error);
        return null;
    }

    return data ? toVendor(data) : null;
}

/**
 * Get featured vendors (for homepage)
 */
export async function getFeaturedVendors(limit: number = 6): Promise<Vendor[]> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured vendors:', error);
        return [];
    }

    return (data || []).map(toVendor);
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
