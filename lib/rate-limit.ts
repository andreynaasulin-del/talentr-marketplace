/**
 * Hybrid Rate Limiter: Upstash Redis (production) + In-memory (fallback)
 * 
 * Priority:
 * 1. If UPSTASH_REDIS_REST_URL is set → Use Upstash (serverless-compatible, distributed)
 * 2. Otherwise → Use in-memory (for local development)
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ============================================================
// TYPES
// ============================================================

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

// ============================================================
// UPSTASH REDIS RATE LIMITER (Production)
// ============================================================

let upstashRatelimit: Ratelimit | null = null;

function getUpstashRatelimit(config: RateLimitConfig): Ratelimit | null {
    // Check if Upstash credentials are available
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }

    // Create Upstash Redis client
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Create rate limiter with sliding window algorithm
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs}ms`),
        analytics: true, // Enable analytics in Upstash dashboard
        prefix: 'talentr_ratelimit',
    });
}

// ============================================================
// IN-MEMORY RATE LIMITER (Fallback for development)
// ============================================================

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

function inMemoryRateLimit(
    identifier: string,
    config: RateLimitConfig
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

// ============================================================
// UNIFIED RATE LIMIT FUNCTION
// ============================================================

/**
 * Check if request should be rate limited
 * Uses Upstash Redis in production, falls back to in-memory for development
 * 
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 */
export async function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 }
): Promise<RateLimitResult> {
    // Try Upstash first (production)
    const upstash = getUpstashRatelimit(config);

    if (upstash) {
        try {
            const result = await upstash.limit(identifier);
            return {
                success: result.success,
                remaining: result.remaining,
                resetIn: result.reset - Date.now(),
                limit: result.limit,
            };
        } catch (error) {
            console.warn('[RateLimit] Upstash error, falling back to in-memory:', error);
            // Fall through to in-memory
        }
    }

    // Fallback to in-memory (development or Upstash error)
    return inMemoryRateLimit(identifier, config);
}

// Synchronous version for backwards compatibility
export function rateLimitSync(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 }
): RateLimitResult {
    return inMemoryRateLimit(identifier, config);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    // Vercel/Cloudflare headers
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) return cfConnectingIP;

    // X-Forwarded-For (most common)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();

    // X-Real-IP (Nginx)
    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;

    // Vercel specific
    const vercelIP = request.headers.get('x-vercel-forwarded-for');
    if (vercelIP) return vercelIP.split(',')[0].trim();

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

// ============================================================
// PRESET CONFIGURATIONS
// ============================================================

export const RATE_LIMITS = {
    // AI Chat: 20 requests per minute
    chat: { maxRequests: 20, windowMs: 60 * 1000 },

    // AI Search: 10 requests per minute (more expensive)
    aiSearch: { maxRequests: 10, windowMs: 60 * 1000 },

    // Auth: 5 attempts per 15 minutes (brute force protection)
    auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

    // Email: 3 per minute (spam protection)
    email: { maxRequests: 3, windowMs: 60 * 1000 },

    // Booking: 10 per minute
    booking: { maxRequests: 10, windowMs: 60 * 1000 },

    // General API: 100 per minute
    api: { maxRequests: 100, windowMs: 60 * 1000 },
} as const;
