import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from '@/components/CookieConsent';


// Optimize font loading
const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    variable: '--font-inter',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-serif',
});

export const metadata: Metadata = {
    title: {
        default: 'Talentr - Find the Best Event Professionals in Israel',
        template: '%s | Talentr'
    },
    description: 'Connect with top-rated photographers, DJs, MCs, magicians, and more for your events. Book trusted professionals in Tel Aviv, Haifa, Jerusalem and across Israel.',
    keywords: ['event professionals', 'wedding photographer Israel', 'DJ Tel Aviv', 'event planner', 'bar mitzvah entertainment', 'corporate events Israel'],
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
            'ru': '/ru',
            'he': '/he',
        },
    },
    openGraph: {
        title: 'Talentr - Find the Best Event Professionals',
        description: 'Connect with top-rated photographers, DJs, MCs, and more for your events in Israel.',
        url: 'https://talentr.co.il',
        siteName: 'Talentr',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Talentr - Event Marketplace',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Talentr - Find the Best Event Professionals',
        description: 'Connect with top-rated professionals for your events in Israel.',
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
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#000000' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
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
        <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
            <head>
                {/* Preconnect to external domains for performance */}
                <link rel="preconnect" href="https://images.unsplash.com" />
                <link rel="dns-prefetch" href="https://images.unsplash.com" />
            </head>
            <body className={`${inter.className} antialiased`}>
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
                    toastOptions={{
                        style: {
                            background: '#18181b',
                            border: '1px solid #27272a',
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
