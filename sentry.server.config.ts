// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize if DSN is provided
if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 0.1,

        // Capture 100% of error events
        sampleRate: 1.0,

        // Environment
        environment: process.env.NODE_ENV,

        // Release tracking (set by Vercel automatically)
        release: process.env.VERCEL_GIT_COMMIT_SHA,

        // Ignore common errors that aren't actionable
        ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            'Non-Error exception captured',
            'Non-Error promise rejection captured',
            /^Network request failed$/,
            /^AbortError$/,
            /^ChunkLoadError$/,
        ],

        // Filter out noisy transactions
        beforeSendTransaction(event) {
            // Don't send transactions for static assets
            if (event.transaction?.includes('/_next/static')) {
                return null;
            }
            return event;
        },
    });
}
