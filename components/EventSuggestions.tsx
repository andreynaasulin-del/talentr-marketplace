'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Users, Music, Camera, Cake, Heart, Briefcase, GraduationCap, PartyPopper } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface EventSuggestionsProps {
    onSelect: (event: string) => void;
    className?: string;
}

interface EventType {
    id: string;
    icon: React.ReactNode;
    label: { en: string; ru: string; he: string };
    query: string;
    color: string;
    emoji: string;
}

const eventTypes: EventType[] = [
    {
        id: 'wedding',
        icon: <Heart className="w-5 h-5" />,
        label: { en: 'Dream Wedding', ru: 'Свадьба мечты', he: 'חתונת חלומות' },
        query: 'wedding photographer and DJ',
        color: 'from-pink-500 to-rose-500',
        emoji: '💒'
    },
    {
        id: 'barmitzvah',
        icon: <GraduationCap className="w-5 h-5" />,
        label: { en: 'Bar/Bat Mitzvah', ru: 'Бар/Бат-мицва', he: 'בר/בת מצווה' },
        query: 'bar mitzvah entertainment and photographer',
        color: 'from-blue-500 to-indigo-500',
        emoji: '📿'
    },
    {
        id: 'birthday',
        icon: <Cake className="w-5 h-5" />,
        label: { en: 'Birthday Bash', ru: 'День рождения', he: 'יום הולדת' },
        query: 'birthday party DJ and magician',
        color: 'from-purple-500 to-violet-500',
        emoji: '🎂'
    },
    {
        id: 'corporate',
        icon: <Briefcase className="w-5 h-5" />,
        label: { en: 'Corporate Event', ru: 'Корпоратив', he: 'אירוע עסקי' },
        query: 'corporate event MC and entertainment',
        color: 'from-gray-600 to-slate-700',
        emoji: '🏢'
    },
    {
        id: 'kids',
        icon: <PartyPopper className="w-5 h-5" />,
        label: { en: 'Kids Party', ru: 'Детский праздник', he: 'מסיבת ילדים' },
        query: 'kids animator and face painter',
        color: 'from-yellow-400 to-orange-500',
        emoji: '🎈'
    },
    {
        id: 'clubnight',
        icon: <Music className="w-5 h-5" />,
        label: { en: 'Club Night', ru: 'Клубная вечеринка', he: 'ערב מועדון' },
        query: 'club DJ',
        color: 'from-emerald-500 to-teal-500',
        emoji: '🎧'
    },
];

export default function EventSuggestions({ onSelect, className }: EventSuggestionsProps) {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (event: EventType) => {
        setSelectedId(event.id);

        // Animate then call callback
        setTimeout(() => {
            onSelect(event.query);
            setIsVisible(false);
        }, 300);
    };

    const title = {
        en: 'What are you planning?',
        ru: 'Что планируете?',
        he: 'מה אתה מתכנן?'
    };

    if (!isVisible) return null;

    return (
        <motion.div
            className={cn("py-8", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4"
                >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-700">AI Suggestions</span>
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900">
                    {title[language as keyof typeof title]}
                </h3>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {eventTypes.map((event, index) => (
                    <motion.button
                        key={event.id}
                        onClick={() => handleSelect(event)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: selectedId === event.id ? 0.95 : 1,
                        }}
                        transition={{
                            delay: index * 0.05,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20
                        }}
                        whileHover={{
                            scale: 1.05,
                            y: -5,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "relative p-6 rounded-2xl text-center transition-all group overflow-hidden",
                            "bg-white border-2 border-gray-100 hover:border-transparent",
                            selectedId === event.id && "ring-4 ring-blue-500/50"
                        )}
                    >
                        {/* Background Gradient on Hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
                            event.color
                        )} />

                        {/* Emoji Background */}
                        <span className="absolute top-2 right-2 text-3xl opacity-20 group-hover:opacity-40 group-hover:scale-125 transition-all">
                            {event.emoji}
                        </span>

                        {/* Icon */}
                        <div className={cn(
                            "w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg",
                            event.color
                        )}>
                            {event.icon}
                        </div>

                        {/* Label */}
                        <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                            {event.label[language as keyof typeof event.label]}
                        </p>

                        {/* Selected Checkmark */}
                        <AnimatePresence>
                            {selectedId === event.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-white text-xs">✓</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
