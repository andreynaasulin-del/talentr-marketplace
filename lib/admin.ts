import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Server-side Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client only if keys are available
let adminSupabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
    adminSupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Helper to get admin client with error handling
function getAdminClient(): SupabaseClient {
    if (!adminSupabaseClient) {
        throw new Error('Admin Supabase client not configured. Check SUPABASE_SERVICE_ROLE_KEY.');
    }
    return adminSupabaseClient;
}

// Check if admin is configured
export function isAdminConfigured(): boolean {
    return adminSupabaseClient !== null;
}

// Types for admin operations
export interface PendingVendor {
    id: string;
    created_at: string;
    updated_at: string;
    confirmation_token: string;
    confirmation_expires_at: string;
    source_type: 'instagram' | 'google' | 'manual' | 'referral';
    source_url?: string;
    source_data?: Record<string, unknown>;
    name: string;
    category?: string;
    city?: string;
    email?: string;
    phone?: string;
    instagram_handle?: string;
    website?: string;
    description?: string;
    image_url?: string;
    portfolio_urls?: string[]; // Legacy
    portfolio_gallery?: string[]; // New standard
    price_from?: number;
    tags?: string[];
    instagram_followers?: number;
    google_rating?: number;
    google_reviews_count?: number;
    status: 'pending' | 'invited' | 'viewed' | 'confirmed' | 'declined' | 'expired';
    invitation_sent_at?: string;
    invitation_method?: string;
    reminder_count: number;
    last_reminder_at?: string;
    admin_notes?: string;
    created_by?: string;
    converted_vendor_id?: string;
}

export interface AdminUser {
    id: string;
    user_id: string;
    created_at: string;
    role: 'super_admin' | 'admin' | 'moderator';
    permissions: {
        can_create_pending: boolean;
        can_view_vendors: boolean;
        can_edit_vendors: boolean;
        can_delete: boolean;
    };
    is_active: boolean;
}

// Check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
    try {
        const client = getAdminClient();
        const { data, error } = await client
            .from('admin_users')
            .select('id, is_active')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single();

        return !error && !!data;
    } catch {
        return false;
    }
}

// Get admin user details
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
    try {
        const client = getAdminClient();
        const { data, error } = await client
            .from('admin_users')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single();

        if (error) return null;
        return data as AdminUser;
    } catch {
        return null;
    }
}

// Create pending vendor (pre-registration)
export async function createPendingVendor(data: Partial<PendingVendor>, adminId?: string): Promise<{ data: PendingVendor | null; error: string | null }> {
    try {
        const client = getAdminClient();
        const { data: pending, error } = await client
            .from('pending_vendors')
            .insert({
                ...data,
                created_by: adminId,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            return { data: null, error: error.message };
        }

        return { data: pending as PendingVendor, error: null };
    } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Get all pending vendors
export async function getPendingVendors(filters?: {
    status?: string;
    source_type?: string;
    search?: string;
}): Promise<PendingVendor[]> {
    try {
        const client = getAdminClient();
        let query = client
            .from('pending_vendors')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.source_type) {
            query = query.eq('source_type', filters.source_type);
        }

        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,instagram_handle.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching pending vendors:', error);
            return [];
        }

        return data as PendingVendor[];
    } catch {
        return [];
    }
}

// Get pending vendor by confirmation token (for public confirmation page)
export async function getPendingVendorByToken(token: string): Promise<PendingVendor | null> {
    try {
        const client = getAdminClient();
        const { data, error } = await client
            .from('pending_vendors')
            .select('*')
            .eq('confirmation_token', token)
            .single();

        if (error) return null;

        // Check if expired
        if (data.confirmation_expires_at && new Date(data.confirmation_expires_at) < new Date()) {
            // Mark as expired
            await client
                .from('pending_vendors')
                .update({ status: 'expired' })
                .eq('id', data.id);
            return null;
        }

        // Mark as viewed if first time
        if (data.status === 'pending' || data.status === 'invited') {
            await client
                .from('pending_vendors')
                .update({ status: 'viewed' })
                .eq('id', data.id);
            data.status = 'viewed';
        }

        return data as PendingVendor;
    } catch {
        return null;
    }
}

// Confirm pending vendor and create real vendor account
export async function confirmPendingVendor(
    token: string,
    userId?: string,
    updates?: Partial<PendingVendor>
): Promise<{ vendorId: string | null; editToken: string | null; error: string | null }> {
    try {
        const client = getAdminClient();

        // Get pending vendor by token
        const pending = await getPendingVendorByToken(token);
        if (!pending) {
            return { vendorId: null, editToken: null, error: 'Invalid or expired confirmation link' };
        }

        if (pending.status === 'confirmed') {
            // If already confirmed, try to find the vendor and its edit token
            const { data: existingVendor } = await client
                .from('vendors')
                .select('id, edit_token')
                .eq('id', pending.converted_vendor_id)
                .single();

            return {
                vendorId: pending.converted_vendor_id || null,
                editToken: existingVendor?.edit_token || null,
                error: null
            };
        }

        // If updates provided, apply them first
        if (updates) {
            await client
                .from('pending_vendors')
                .update(updates)
                .eq('id', pending.id);
        }

        // Generate unique edit token for magic link
        const editToken = crypto.randomUUID();

        // Create the real vendor with SAFETY defaults
        // Support both old field names (full_name, bio, avatar_url) and new (name, description, image_url)
        const vendorId = crypto.randomUUID();
        const vendorName = updates?.name || pending.name || 'Unknown Vendor';
        const vendorDescription = updates?.description || pending.description || '';
        const vendorImage = updates?.image_url || pending.image_url || null;
        const vendorCategory = updates?.category || pending.category || 'Other';
        const vendorCity = updates?.city || pending.city || 'Tel Aviv';
        const vendorPhone = updates?.phone || pending.phone || null;
        const vendorEmail = updates?.email || pending.email || null;
        const vendorPrice = Number(updates?.price_from || pending.price_from || 0);

        // Ensure portfolio is a valid array of strings, filter out empty strings
        const rawPortfolio = updates?.portfolio_gallery || pending.portfolio_urls || [];
        const vendorPortfolio = Array.isArray(rawPortfolio)
            ? rawPortfolio.filter(url => typeof url === 'string' && url.length > 0)
            : [];

        const vendorTags = Array.isArray(pending.tags) ? pending.tags : [];

        const { data: vendor, error } = await client
            .from('vendors')
            .insert({
                id: vendorId,
                user_id: userId || null, // Can be null for initial invite
                // Both old and new field names for compatibility
                name: vendorName,
                full_name: vendorName,
                category: vendorCategory,
                city: vendorCity,
                description: vendorDescription,
                bio: vendorDescription,
                image_url: vendorImage,
                avatar_url: vendorImage,
                phone: vendorPhone,
                email: vendorEmail,
                instagram_handle: pending.instagram_handle || null,
                website: pending.website || null,
                price_from: isNaN(vendorPrice) ? 0 : vendorPrice,
                portfolio_gallery: vendorPortfolio,
                tags: vendorTags,
                rating: 0,
                reviews_count: 0,
                edit_token: editToken, // Magic link token
                is_archived: false,
                is_active: true,
                is_verified: false,
                is_featured: false,
                status: 'active'
            })
            .select()
            .single();


        if (error) {
            return { vendorId: null, editToken: null, error: error.message };
        }

        // Update pending vendor status
        await client
            .from('pending_vendors')
            .update({
                status: 'confirmed',
                converted_vendor_id: vendor.id
            })
            .eq('id', pending.id);

        // Log the activity
        await logAdminActivity(null, 'vendor_confirmed', 'pending_vendor', pending.id, {
            vendor_id: vendor.id,
            user_id: userId
        });

        return { vendorId: vendor.id, editToken, error: null };
    } catch (err) {
        console.error('Error in confirmPendingVendor:', err);
        return { vendorId: null, editToken: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Send invitation (mark as invited and return the link)
export async function sendInvitation(
    pendingId: string,
    method: 'email' | 'instagram_dm' | 'whatsapp'
): Promise<{ link: string | null; error: string | null }> {
    try {
        const client = getAdminClient();

        // First get pending vendor info for email
        const { data: pending, error: fetchError } = await client
            .from('pending_vendors')
            .select('name, email, confirmation_token')
            .eq('id', pendingId)
            .single();

        if (fetchError || !pending) {
            return { link: null, error: 'Pending vendor not found' };
        }

        // Update status
        const { error: updateError } = await client
            .from('pending_vendors')
            .update({
                status: 'invited',
                invitation_sent_at: new Date().toISOString(),
                invitation_method: method
            })
            .eq('id', pendingId);

        if (updateError) {
            return { link: null, error: updateError.message };
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentr.co.il';
        const link = `${baseUrl}/confirm/${pending.confirmation_token}`;

        // Send actual email if method is email and we have an email address
        if (method === 'email' && pending.email) {
            try {
                const { sendInviteEmail } = await import('@/lib/email');
                await sendInviteEmail({
                    vendorName: pending.name || 'Vendor',
                    vendorEmail: pending.email,
                    confirmLink: link
                });
            } catch (emailError) {
                console.error('Failed to send invitation email:', emailError);
                // Don't fail - the invitation was marked, just email didn't send
            }
        }

        return { link, error: null };
    } catch (err) {
        return { link: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Decline pending vendor
export async function declinePendingVendor(pendingId: string, reason?: string): Promise<{ error: string | null }> {
    try {
        const client = getAdminClient();
        const { error } = await client
            .from('pending_vendors')
            .update({
                status: 'declined',
                admin_notes: reason ? `Declined: ${reason}` : 'Declined by vendor'
            })
            .eq('id', pendingId);

        return { error: error?.message || null };
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Get all vendors (for admin view)
// Support both old field names (full_name, bio, avatar_url) and new (name, description, image_url)
export async function getAllVendors(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
}): Promise<{ vendors: unknown[]; total: number }> {
    try {
        const client = getAdminClient();
        let query = client
            .from('vendors')
            .select('*', { count: 'exact' });

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.search) {
            // Search in both old and new field names
            query = query.or(`name.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,instagram_handle.ilike.%${filters.search}%`);
        }

        // Apply pagination
        const limit = filters?.limit || 20;
        const offset = filters?.offset || 0;
        query = query.range(offset, offset + limit - 1);
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching vendors:', error);
            return { vendors: [], total: 0 };
        }

        // Map to expected format for admin panel - support both old and new field names
        const mappedVendors = (data || []).map(v => ({
            id: v.id,
            created_at: v.created_at,
            name: v.name || v.full_name || 'Unknown',
            category: v.category,
            city: v.city,
            email: v.email,
            phone: v.phone,
            instagram_handle: v.instagram_handle,
            image_url: v.image_url || v.avatar_url,
            description: v.description || v.bio,
            is_active: v.is_active ?? true,
            is_verified: v.is_verified ?? false,
            is_featured: v.is_featured ?? false,
            is_archived: v.is_archived ?? false,
            rating: v.rating || 0,
            reviews_count: v.reviews_count || 0,
            price_from: v.price_from || 0,
            edit_token: v.edit_token
        }));

        return { vendors: mappedVendors, total: count || 0 };
    } catch {
        return { vendors: [], total: 0 };
    }
}

// Log admin activity
export async function logAdminActivity(
    adminId: string | null,
    action: string,
    targetType: string,
    targetId: string,
    details?: Record<string, unknown>
): Promise<void> {
    try {
        const client = getAdminClient();
        await client
            .from('admin_activity_log')
            .insert({
                admin_id: adminId,
                action,
                target_type: targetType,
                target_id: targetId,
                details: details || {}
            });
    } catch (err) {
        console.error('Failed to log admin activity:', err);
    }
}

// Update vendor details
export async function updateVendor(vendorId: string, updates: Record<string, any>): Promise<{ data: any; error: string | null }> {
    try {
        const client = getAdminClient();
        const { data, error } = await client
            .from('vendors')
            .update(updates)
            .eq('id', vendorId)
            .select()
            .single();

        if (error) return { data: null, error: error.message };
        return { data, error: null };
    } catch (err) {
        return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Toggle vendor archive status
export async function toggleVendorArchive(vendorId: string, currentStatus: boolean): Promise<{ success: boolean; error: string | null }> {
    try {
        const client = getAdminClient();
        const { error } = await client
            .from('vendors')
            .update({ is_archived: !currentStatus })
            .eq('id', vendorId);

        if (error) return { success: false, error: error.message };
        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Delete pending vendor profile
export async function deletePendingVendor(pendingId: string): Promise<{ error: string | null }> {
    try {
        const client = getAdminClient();
        const { error } = await client
            .from('pending_vendors')
            .delete()
            .eq('id', pendingId);

        return { error: error?.message || null };
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Delete vendor profile (hard delete)
export async function deleteVendor(vendorId: string): Promise<{ error: string | null }> {
    try {
        const client = getAdminClient();
        const { error } = await client
            .from('vendors')
            .delete()
            .eq('id', vendorId);

        return { error: error?.message || null };
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Get dashboard stats
export async function getAdminDashboardStats(): Promise<{
    totalVendors: number;
    activeVendors: number;
    pendingVendors: number;
    invitedPending: number;
    confirmedThisMonth: number;
    totalBookings: number;
}> {
    try {
        const client = getAdminClient();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const [vendorsCount, activeCount, pending, bookingsResult] = await Promise.all([
            client.from('vendors').select('id', { count: 'exact', head: true }),
            client.from('vendors').select('id', { count: 'exact', head: true }).eq('is_active', true),
            client.from('pending_vendors').select('id, status', { count: 'exact' }),
            client.from('bookings').select('id', { count: 'exact', head: true })
        ]);

        const pendingCount = pending.data?.filter((p: any) => p.status === 'pending').length || 0;
        const invitedCount = pending.data?.filter((p: any) => p.status === 'invited').length || 0;

        // Get confirmed this month
        const { count: confirmedCount } = await client
            .from('pending_vendors')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'confirmed')
            .gte('updated_at', startOfMonth);

        return {
            totalVendors: vendorsCount.count || 0,
            activeVendors: activeCount.count || 0,
            pendingVendors: pendingCount,
            invitedPending: invitedCount,
            confirmedThisMonth: confirmedCount || 0,
            totalBookings: (bookingsResult as { count: number | null }).count || 0
        };
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        return {
            totalVendors: 0,
            activeVendors: 0,
            pendingVendors: 0,
            invitedPending: 0,
            confirmedThisMonth: 0,
            totalBookings: 0
        };
    }
}
