/**
 * Simple in-memory rate limiter for API routes
 * For production, use Redis-based solution (Upstash)
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetTime < now) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

interface RateLimitConfig {
    maxRequests: number;  // Max requests per window
    windowMs: number;     // Time window in milliseconds
}

interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetIn: number;
    limit: number;
}

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 }
): RateLimitResult {
    const now = Date.now();
    const key = identifier;

    const entry = rateLimitStore.get(key);

    // First request or window expired
    if (!entry || entry.resetTime < now) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });

        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs,
            limit: config.maxRequests,
        };
    }

    // Within window, check count
    if (entry.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetIn: entry.resetTime - now,
            limit: config.maxRequests,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);

    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetTime - now,
        limit: config.maxRequests,
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString(),
    };
}

// Preset configurations
export const RATE_LIMITS = {
    // AI Chat: 20 requests per minute
    chat: { maxRequests: 20, windowMs: 60 * 1000 },

    // Auth: 5 attempts per 15 minutes
    auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

    // Email: 3 per minute
    email: { maxRequests: 3, windowMs: 60 * 1000 },

    // General API: 100 per minute
    api: { maxRequests: 100, windowMs: 60 * 1000 },
} as const;
