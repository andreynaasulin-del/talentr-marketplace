'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <FavoritesProvider>
                    {children}
                </FavoritesProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
