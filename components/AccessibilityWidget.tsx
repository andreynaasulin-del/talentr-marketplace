'use client';

import { useState, useEffect } from 'react';
import { Accessibility, Type, Eye, X, RotateCcw, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function AccessibilityWidget() {
    const { language } = useLanguage();
    const isHebrew = language === 'he';

    const t = {
        en: {
            title: 'Accessibility',
            textSize: 'Text Size',
            contrast: 'High Contrast',
            links: 'Highlight Links',
            font: 'Readable Font',
            reset: 'Reset Settings'
        },
        he: {
            title: 'נגישות',
            textSize: 'גודל טקסט',
            contrast: 'ניגודיות גבוהה',
            links: 'הדגשת קישורים',
            font: 'גופן קריא',
            reset: 'איפוס הגדרות'
        }
    }[isHebrew ? 'he' : 'en'];

    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const [highlightLinks, setHighlightLinks] = useState(false);
    const [readableFont, setReadableFont] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('accessibility_settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                setFontSize(settings.fontSize || 100);
                setContrast(settings.contrast || false);
                setHighlightLinks(settings.highlightLinks || false);
                setReadableFont(settings.readableFont || false);
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.style.fontSize = `${fontSize}%`;

        if (contrast) document.documentElement.classList.add('high-contrast-mode');
        else document.documentElement.classList.remove('high-contrast-mode');

        if (highlightLinks) document.body.classList.add('highlight-links-mode');
        else document.body.classList.remove('highlight-links-mode');

        if (readableFont) document.body.classList.add('readable-font-mode');
        else document.body.classList.remove('readable-font-mode');

        localStorage.setItem('accessibility_settings', JSON.stringify({
            fontSize, contrast, highlightLinks, readableFont
        }));
    }, [fontSize, contrast, highlightLinks, readableFont, mounted]);

    const reset = () => {
        setFontSize(100);
        setContrast(false);
        setHighlightLinks(false);
        setReadableFont(false);
    };

    if (!mounted) return null;

    return (
        <div className={`absolute top-24 z-40 font-sans ${isHebrew ? 'right-4' : 'left-4'}`}>
            <style jsx global>{`
                .high-contrast-mode { filter: contrast(130%) grayscale(100%) !important; }
                .highlight-links-mode a { text-decoration: underline !important; text-decoration-thickness: 2px !important; text-underline-offset: 4px !important; color: #2563eb !important; }
                .readable-font-mode * { font-family: Arial, Helvetica, sans-serif !important; letter-spacing: 0.05em !important; line-height: 1.5 !important; }
            `}</style>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className={`absolute top-16 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${isHebrew ? 'right-0' : 'left-0'}`}
                        dir={isHebrew ? 'rtl' : 'ltr'}
                    >
                        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Accessibility className="w-5 h-5" />
                                {t.title}
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Font Size */}
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    <span>{t.textSize}</span><span>{fontSize}%</span>
                                </div>
                                <div className="flex gap-2" dir="ltr">
                                    <button onClick={() => setFontSize(f => Math.max(70, f - 10))} className="flex-1 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-sm hover:bg-zinc-50 font-bold border border-zinc-200 dark:border-zinc-700">A-</button>
                                    <button onClick={() => setFontSize(f => Math.min(150, f + 10))} className="flex-1 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-sm hover:bg-zinc-50 font-bold border border-zinc-200 dark:border-zinc-700">A+</button>
                                </div>
                            </div>
                            {/* Toggles */}
                            <div className="grid grid-cols-1 gap-2">
                                <ToggleButton active={contrast} onClick={() => setContrast(!contrast)} icon={Eye} label={t.contrast} />
                                <ToggleButton active={highlightLinks} onClick={() => setHighlightLinks(!highlightLinks)} icon={MousePointer2} label={t.links} />
                                <ToggleButton active={readableFont} onClick={() => setReadableFont(!readableFont)} icon={Type} label={t.font} />
                            </div>
                            <button onClick={reset} className="w-full flex items-center justify-center gap-2 p-3 mt-4 text-zinc-500 hover:text-red-500 rounded-xl transition-colors text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                                <RotateCcw className="w-4 h-4" /> {t.reset}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 border-4 border-white dark:border-zinc-900"
                aria-label={t.title}
            >
                <Accessibility className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
        </div>
    );
}

function ToggleButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between p-3 rounded-xl transition-all border ${active ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]' : 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-bold">{label}</span>
            </div>
            {active && <Check className="w-5 h-5 bg-white text-blue-600 rounded-full p-0.5 flex-shrink-0" />}
        </button>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
