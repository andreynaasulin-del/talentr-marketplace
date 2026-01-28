import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

/**
 * Validate vendor ownership via edit_token header
 * Returns vendor_id if valid, null if invalid
 */
export async function validateVendorToken(
    request: NextRequest
): Promise<{ vendorId: string | null; error: string | null }> {
    const editToken = request.headers.get('x-vendor-token');

    if (!editToken) {
        return { vendorId: null, error: 'Missing vendor token' };
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('id')
        .eq('edit_token', editToken)
        .single();

    if (error || !vendor) {
        return { vendorId: null, error: 'Invalid vendor token' };
    }

    return { vendorId: vendor.id, error: null };
}

/**
 * Check if a gig belongs to a vendor
 */
export async function validateGigOwnership(
    gigId: string,
    vendorId: string
): Promise<{ valid: boolean; error: string | null }> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: gig, error } = await supabase
        .from('gigs')
        .select('vendor_id')
        .eq('id', gigId)
        .single();

    if (error || !gig) {
        return { valid: false, error: 'Gig not found' };
    }

    if (gig.vendor_id !== vendorId) {
        return { valid: false, error: 'Unauthorized: You do not own this gig' };
    }

    return { valid: true, error: null };
}
