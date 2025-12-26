'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';

interface FavoritesContextType {
    favorites: string[];
    isLoading: boolean;
    isFavorite: (vendorId: string) => boolean;
    toggleFavorite: (vendorId: string, vendorName?: string) => Promise<void>;
    favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { language } = useLanguage();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Load favorites on mount
    useEffect(() => {
        const loadFavorites = async () => {
            // Check for test mode
            const testMode = localStorage.getItem('test_mode');
            if (testMode === 'true') {
                const stored = localStorage.getItem('favorites');
                setFavorites(stored ? JSON.parse(stored) : []);
                setUserId('test-user');
                setIsLoading(false);
                return;
            }

            // Check real auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // No auth - use localStorage
                const stored = localStorage.getItem('favorites');
                setFavorites(stored ? JSON.parse(stored) : []);
                setIsLoading(false);
                return;
            }

            setUserId(user.id);

            // Load from Supabase
            try {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('vendor_id')
                    .eq('user_id', user.id);

                if (!error && data) {
                    setFavorites(data.map(f => f.vendor_id));
                }
            } catch (e) {
                console.error('Error loading favorites:', e);
            }

            setIsLoading(false);
        };

        loadFavorites();
    }, []);

    // Sync to localStorage as backup
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }, [favorites, isLoading]);

    const isFavorite = useCallback((vendorId: string) => {
        return favorites.includes(vendorId);
    }, [favorites]);

    const toggleFavorite = useCallback(async (vendorId: string, vendorName?: string) => {
        const isCurrentlyFavorite = favorites.includes(vendorId);

        // Optimistic update
        if (isCurrentlyFavorite) {
            setFavorites(prev => prev.filter(id => id !== vendorId));
        } else {
            setFavorites(prev => [...prev, vendorId]);
        }

        // Show toast
        if (isCurrentlyFavorite) {
            toast.success(
                language === 'ru' ? 'Удалено из избранного'
                    : language === 'he' ? 'הוסר מהמועדפים'
                        : 'Removed from favorites',
                { description: vendorName }
            );
        } else {
            toast.success(
                language === 'ru' ? '❤️ Добавлено в избранное'
                    : language === 'he' ? '❤️ נוסף למועדפים'
                        : '❤️ Added to favorites',
                { description: vendorName }
            );
        }

        // Sync to Supabase if authenticated
        if (userId && userId !== 'test-user') {
            try {
                if (isCurrentlyFavorite) {
                    await supabase
                        .from('favorites')
                        .delete()
                        .eq('user_id', userId)
                        .eq('vendor_id', vendorId);
                } else {
                    await supabase
                        .from('favorites')
                        .insert({ user_id: userId, vendor_id: vendorId });
                }
            } catch (e) {
                console.error('Error syncing favorite:', e);
                // Revert on error
                if (isCurrentlyFavorite) {
                    setFavorites(prev => [...prev, vendorId]);
                } else {
                    setFavorites(prev => prev.filter(id => id !== vendorId));
                }
            }
        }
    }, [favorites, userId, language]);

    return (
        <FavoritesContext.Provider value={{
            favorites,
            isLoading,
            isFavorite,
            toggleFavorite,
            favoritesCount: favorites.length,
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
