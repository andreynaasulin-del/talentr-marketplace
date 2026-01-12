"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Report to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{
                backgroundColor: '#000',
                color: '#fff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '500px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Talentr
                    </h1>

                    <div style={{
                        fontSize: '64px',
                        marginBottom: '16px',
                    }}>
                        😓
                    </div>

                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#f87171',
                    }}>
                        Something went wrong!
                    </h2>

                    <p style={{
                        color: '#a1a1aa',
                        marginBottom: '24px',
                        lineHeight: '1.6',
                    }}>
                        We apologize for the inconvenience. Our team has been notified and is working on a fix.
                    </p>

                    {error.digest && (
                        <p style={{
                            color: '#71717a',
                            fontSize: '12px',
                            marginBottom: '24px',
                            fontFamily: 'monospace',
                        }}>
                            Error ID: {error.digest}
                        </p>
                    )}

                    <button
                        onClick={() => reset()}
                        style={{
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginRight: '12px',
                        }}
                    >
                        Try again
                    </button>

                    <a
                        href="/"
                        style={{
                            backgroundColor: 'transparent',
                            color: '#a1a1aa',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: '1px solid #3f3f46',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        Go home
                    </a>
                </div>
            </body>
        </html>
    );
}
