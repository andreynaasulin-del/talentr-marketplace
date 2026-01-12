// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        // Performance Monitoring - sample 10% of transactions in production
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Session Replay - capture 10% of sessions, 100% on error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        // Integrations
        integrations: [
            Sentry.replayIntegration({
                // Don't mask inputs (we don't have sensitive forms)
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],

        // Environment
        environment: process.env.NODE_ENV,

        // Ignore common browser errors that aren't actionable
        ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            'Non-Error exception captured',
            'Non-Error promise rejection captured',
            /^Network request failed$/,
            /^AbortError$/,
            /^ChunkLoadError$/,
            /^Loading chunk/,
            /^Failed to fetch/,
            // Browser extensions
            /^chrome-extension:/,
            /^moz-extension:/,
        ],

        // Add user context if available
        beforeSend(event) {
            // Filter out events from browser extensions
            if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
                frame => frame.filename?.includes('chrome-extension') ||
                    frame.filename?.includes('moz-extension')
            )) {
                return null;
            }
            return event;
        },
    });
}
