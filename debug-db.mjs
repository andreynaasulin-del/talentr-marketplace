import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debug() {
    // 1. Find vendor by edit_token
    const vendorToken = '38961cab-440d-4f5c-b420-7ff353e891ab';
    const { data: vendor, error: vendorErr } = await supabase
        .from('vendors')
        .select('*')
        .eq('edit_token', vendorToken)
        .single();

    console.log('=== VENDOR ===');
    console.log('Vendor:', vendor);
    console.log('Error:', vendorErr);

    if (vendor) {
        // 2. Find gigs for this vendor
        const { data: gigs, error: gigsErr } = await supabase
            .from('gigs')
            .select('id, title, vendor_id, status, created_at')
            .eq('vendor_id', vendor.id);

        console.log('\n=== GIGS FOR VENDOR ===');
        console.log('Gigs:', gigs);
        console.log('Error:', gigsErr);
    }

    // 3. Find orphan gigs (vendor_id is null)
    const { data: orphanGigs, error: orphanErr } = await supabase
        .from('gigs')
        .select('id, title, vendor_id, status, invite_token, created_at')
        .is('vendor_id', null)
        .order('created_at', { ascending: false })
        .limit(10);

    console.log('\n=== ORPHAN GIGS (no vendor) ===');
    console.log('Orphan gigs:', orphanGigs);
    console.log('Error:', orphanErr);

    // 4. Find gig by created gigId
    const gigId = '12190d6a-17bd-4c32-8cf3-3a121d368c06';
    const { data: specificGig, error: gigErr } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', gigId)
        .single();

    console.log('\n=== SPECIFIC GIG ===');
    console.log('Gig:', specificGig);
    console.log('Error:', gigErr);
}

debug().catch(console.error);
