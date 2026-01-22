// Validation utilities for vendor registration

/**
 * Validates Israeli phone number format
 * Accepts: +972..., 972..., 05..., 0...
 */
export function validateIsraeliPhone(phone: string): { valid: boolean; message?: string } {
    if (!phone) return { valid: true }; // Phone is optional

    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check for spam/test numbers
    const spamPatterns = [
        /^[0+]*9{5,}$/,  // All 9s: 999999999
        /^[0+]*1{5,}$/,  // All 1s: 111111111
        /^[0+]*2{5,}$/,  // All 2s
        /^[0+]*3{5,}$/,  // All 3s
        /^[0+]*4{5,}$/,  // All 4s
        /^[0+]*5{5,}$/,  // All 5s
        /^[0+]*6{5,}$/,  // All 6s
        /^[0+]*7{5,}$/,  // All 7s
        /^[0+]*8{5,}$/,  // All 8s
        /^(012|123|234|345|456|567|678|789){3,}$/, // Sequential
    ];

    for (const pattern of spamPatterns) {
        if (pattern.test(cleaned)) {
            return { valid: false, message: 'Invalid phone number format' };
        }
    }

    // Valid Israeli phone formats
    const validFormats = [
        /^\+972(5[0-9]|[2-4]|7[0-9]|8|9)\d{7}$/,  // +972501234567
        /^972(5[0-9]|[2-4]|7[0-9]|8|9)\d{7}$/,     // 972501234567
        /^0(5[0-9]|[2-4]|7[0-9]|8|9)\d{7}$/,       // 0501234567
    ];

    const isValid = validFormats.some(format => format.test(cleaned));

    if (!isValid) {
        return { valid: false, message: 'Please enter a valid Israeli phone number (e.g., +972501234567)' };
    }

    return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
    if (!email) return { valid: true }; // Email is optional

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check for spam patterns
    const spamDomains = ['test.com', 'example.com', 'temp.com', 'fake.com'];
    const domain = email.split('@')[1]?.toLowerCase();

    if (spamDomains.includes(domain)) {
        return { valid: false, message: 'Please use a real email address' };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true };
}

/**
 * Validates Instagram handle
 */
export function validateInstagram(handle: string): { valid: boolean; message?: string } {
    if (!handle) return { valid: true }; // Instagram is optional

    // Remove @ if present
    const cleaned = handle.replace('@', '');

    // Instagram username rules: 1-30 characters, alphanumeric + underscores and dots
    const instagramRegex = /^[a-zA-Z0-9._]{1,30}$/;

    if (!instagramRegex.test(cleaned)) {
        return { valid: false, message: 'Invalid Instagram username' };
    }

    // Check for spam patterns
    if (/test|fake|spam|demo/i.test(cleaned)) {
        return { valid: false, message: 'Please use a real Instagram account' };
    }

    return { valid: true };
}

/**
 * Check for duplicate vendors by email, phone, or Instagram
 */
export async function checkDuplicateVendor(data: {
    email?: string;
    phone?: string;
    instagram_handle?: string;
}): Promise<{ isDuplicate: boolean; field?: string; message?: string }> {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check in vendors table
    const checks: Promise<any>[] = [];

    if (data.email) {
        checks.push(
            supabase
                .from('vendors')
                .select('id')
                .eq('email', data.email.toLowerCase())
                .single()
        );
    }

    if (data.phone) {
        const cleaned = data.phone.replace(/[\s-]/g, '');
        checks.push(
            supabase
                .from('vendors')
                .select('id')
                .eq('phone', cleaned)
                .single()
        );
    }

    if (data.instagram_handle) {
        const cleaned = data.instagram_handle.replace('@', '').toLowerCase();
        checks.push(
            supabase
                .from('vendors')
                .select('id')
                .ilike('instagram_handle', cleaned)
                .single()
        );
    }

    const results = await Promise.all(checks);

    // Check if any returned data (duplicate found)
    for (let i = 0; i < results.length; i++) {
        if (results[i].data) {
            const fields = ['email', 'phone', 'instagram_handle'];
            const field = [data.email, data.phone, data.instagram_handle][i];
            return {
                isDuplicate: true,
                field: fields[i],
                message: `A vendor with this ${fields[i]} already exists`
            };
        }
    }

    return { isDuplicate: false };
}

/**
 * Rate limiting helper (simple in-memory for now)
 */
const registrationAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkRateLimit(identifier: string): { allowed: boolean; message?: string } {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxAttempts = 3; // 3 registrations per hour per IP

    const attempt = registrationAttempts.get(identifier);

    if (!attempt) {
        registrationAttempts.set(identifier, { count: 1, firstAttempt: now });
        return { allowed: true };
    }

    // Reset if window has passed
    if (now - attempt.firstAttempt > windowMs) {
        registrationAttempts.set(identifier, { count: 1, firstAttempt: now });
        return { allowed: true };
    }

    // Check if exceeded
    if (attempt.count >= maxAttempts) {
        return {
            allowed: false,
            message: 'Too many registration attempts. Please try again later.'
        };
    }

    // Increment
    attempt.count++;
    return { allowed: true };
}
