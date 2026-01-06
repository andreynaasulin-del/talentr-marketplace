'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

// Web Speech API types
interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
}

interface VoiceSearchProps {
    onTranscript: (text: string) => void;
    className?: string;
}

export default function VoiceSearch({ onTranscript, className }: VoiceSearchProps) {
    const { language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    useEffect(() => {
        // Check for browser support
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognitionAPI) {
                setIsSupported(false);
                return;
            }

            const recognition = new SpeechRecognitionAPI() as SpeechRecognitionInstance;
            recognition.continuous = false;
            recognition.interimResults = true;

            // Set language based on current app language
            recognition.lang = language === 'he' ? 'he-IL' : 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const current = event.resultIndex;
                const result = event.results[current];
                const text = result[0].transcript;
                setTranscript(text);

                if (result.isFinal) {
                    onTranscript(text);
                    setTranscript('');
                }
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                // Silently handle errors - 'aborted' is normal when user stops
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [language, onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            recognitionRef.current.start();
        }
    };

    if (!isSupported) {
        return null;
    }

    const getTooltip = () => {
        if (isListening) {
            return language === 'he' ? 'מקשיב...' : 'Listening...';
        }
        return language === 'he' ? 'חיפוש קולי' : 'Voice search';
    };

    return (
        <div className={cn("relative group", className)}>
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap">
                    {getTooltip()}
                </div>
            </div>

            {/* Button */}
            <motion.button
                onClick={toggleListening}
                className={cn(
                    "relative p-3 rounded-full transition-all duration-300",
                    isListening
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={getTooltip()}
            >
                <AnimatePresence mode="wait">
                    {isListening ? (
                        <motion.div
                            key="listening"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                        >
                            <MicOff className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ scale: 0, rotate: 90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -90 }}
                        >
                            <Mic className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse Animation when listening */}
                {isListening && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-red-500/50 animate-ping" />
                        <span className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse" />
                    </>
                )}
            </motion.button>

            {/* Live Transcript */}
            <AnimatePresence>
                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 p-3 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                Recognizing...
                            </span>
                        </div>
                        <p className="text-gray-900 font-medium">{transcript}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

