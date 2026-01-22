import { supabase } from './supabase';
import { Vendor, VendorCategory, City } from '@/types';

// NOTE: Mock data removed - only real data from Supabase is used

// Type for Supabase vendor row (matching actual schema - supports both old and new field names)
interface VendorRow {
    id: string;
    // Name fields (old: full_name, new: name)
    full_name?: string;
    name?: string;
    email: string | null;
    category: VendorCategory;
    city: City;
    rating: number;
    reviews_count: number;
    price_from: number;
    // Image fields (old: avatar_url, new: image_url)
    avatar_url?: string | null;
    image_url?: string | null;
    // Description fields (old: bio, new: description)
    bio?: string | null;
    description?: string | null;
    phone: string | null;
    portfolio_gallery?: string[] | null;
    // New fields
    is_verified?: boolean;
    is_featured?: boolean;
    is_active?: boolean;
    is_archived?: boolean;
    tags?: string[];
}

// Convert Supabase row to app Vendor type (camelCase) - handles both old and new field names
const toVendor = (row: VendorRow): Vendor => ({
    id: row.id,
    name: row.name || row.full_name || 'Unknown',
    category: row.category,
    city: row.city,
    rating: row.rating || 0,
    reviewsCount: row.reviews_count || 0,
    priceFrom: row.price_from || 0,
    imageUrl: row.image_url || row.avatar_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tags: row.tags || [],
    description: row.description || row.bio || undefined,
    phone: row.phone || undefined,
    isVerified: row.is_verified ?? true,
    isFeatured: row.is_featured ?? false,
});

// ========== VENDOR QUERIES ==========

/**
 * Get all active vendors
 */
export async function getVendors(): Promise<Vendor[]> {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('is_archived', false)
            .order('rating', { ascending: false });

        if (error || !data || data.length === 0) {
            // No vendors found in database
            return [];
        }

        return data.map(toVendor);
    } catch (e) {
        console.error('Supabase error:', e);
        return [];
    }
}

/**
 * Get vendors by category
 */
export async function getVendorsByCategory(category: VendorCategory): Promise<Vendor[]> {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('category', category)
            .eq('is_archived', false)
            .order('rating', { ascending: false });

        if (error || !data || data.length === 0) {
            return [];
        }

        return data.map(toVendor);
    } catch (e) {
        console.error('Supabase error:', e);
        return [];
    }
}

/**
 * Get vendors by city
 */
export async function getVendorsByCity(city: City): Promise<Vendor[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('city', city)
        .eq('is_archived', false)
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
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .eq('is_archived', false)
        .single();

    if (error || !data) {
        return null;
    }

    return toVendor(data);
}

/**
 * Get featured vendors (for homepage) - falls back to mock data
 */
export async function getFeaturedVendors(limit: number = 6): Promise<Vendor[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_archived', false)
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

    if (error || !data || data.length === 0) {
        // Fallback: get any active vendors if no featured
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('vendors')
            .select('*')
            .eq('is_archived', false)
            .order('rating', { ascending: false })
            .limit(limit);

        if (fallbackError || !fallbackData) return [];
        return fallbackData.map(toVendor);
    }

    return data.map(toVendor);
}

// Mock data functions removed - only real data is used

/**
 * Search vendors by query (name, description, tags)
 */
export async function searchVendors(query: string): Promise<Vendor[]> {
    if (!supabase) return [];
    const searchTerm = query.toLowerCase().trim();

    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_archived', false)
        .or(`name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
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
    if (!supabase) return [];
    try {
        let query = supabase
            .from('vendors')
            .select('*')
            .eq('is_archived', false);

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

        const { data, error } = await query.order('rating', { ascending: false }).limit(10);

        if (error || !data || data.length === 0) {
            return [];
        }

        return data.map(toVendor);
    } catch (e) {
        console.error('Filter vendors error:', e);
        return [];
    }
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
    if (!supabase) throw new Error('Supabase is not configured');
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
    if (!supabase) return [];
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
    if (!supabase) return [];
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
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

    if (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
}
