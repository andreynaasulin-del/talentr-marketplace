'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTranslation, type Language } from '@/utils/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    convertPrice: (priceInShekels: number) => string;
    getCurrencySymbol: () => string;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('he');

    // Load saved language preference on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language') as Language | null;
            if (saved && (saved === 'en' || saved === 'he')) {
                setLanguageState(saved);
            }
        }
    }, []);

    // Persist language preference and update RTL
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    // RTL Support: Update HTML dir attribute when language changes
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
        }
    }, [language]);

    // Fixed Currency: Always display in Shekels (₪)
    const convertPrice = (priceInShekels: number): string => {
        return `₪${priceInShekels.toLocaleString('en-US')}`;
    };

    // Fixed Currency Symbol: Always return Shekel
    const getCurrencySymbol = (): string => {
        return '₪';
    };

    // Translation function
    const t = (key: string): string => {
        return getTranslation(key, language);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, convertPrice, getCurrencySymbol, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
