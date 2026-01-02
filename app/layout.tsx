import type { Metadata, Viewport } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from '@/components/CookieConsent';

// Heebo - Modern geometric sans-serif with excellent Hebrew support
const heebo = Heebo({
    subsets: ['latin', 'hebrew'],
    display: 'swap',
    variable: '--font-heebo',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: {
        default: 'Talentr - Premium Talent Concierge',
        template: '%s | Talentr'
    },
    description: 'Connect with elite photographers, DJs, MCs, magicians, and more. Premium talent booking for exclusive experiences in Israel.',
    keywords: ['premium talent', 'exclusive entertainment', 'luxury events Israel', 'private concierge', 'elite performers'],
    authors: [{ name: 'Talentr' }],
    creator: 'Talentr',
    publisher: 'Talentr',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://talentr.co.il'),
    alternates: {
        canonical: '/',
        languages: {
            'en': '/en',
            'he': '/he',
        },
    },
    openGraph: {
        title: 'Talentr - Premium Talent Concierge',
        description: 'Elite talent booking for exclusive experiences.',
        url: 'https://talentr.co.il',
        siteName: 'Talentr',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Talentr - Premium Concierge',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Talentr - Premium Talent Concierge',
        description: 'Elite talent booking for exclusive experiences.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png',
    },
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#0f172a',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${heebo.variable} dark`} suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://images.unsplash.com" />
                <link rel="dns-prefetch" href="https://images.unsplash.com" />
            </head>
            <body className={`${heebo.className} antialiased bg-slate-950 text-white`}>
                <ThemeProvider>
                    <LanguageProvider>
                        <FavoritesProvider>
                            {children}
                            <CookieConsent />
                        </FavoritesProvider>
                    </LanguageProvider>
                </ThemeProvider>
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: 'rgba(30, 41, 59, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            color: 'white',
                        },
                    }}
                />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
