import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'talentr - Find the best talent',
    description: 'Connect with top-rated professionals for your events',
    icons: {
        icon: '/icon.png',
    },
};

export const viewport: Viewport = {
    themeColor: '#ffffff',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <LanguageProvider>{children}</LanguageProvider>
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        style: {
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '16px',
                        },
                    }}
                />
            </body>
        </html>
    );
}
