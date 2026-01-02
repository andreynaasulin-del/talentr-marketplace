'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface GigCard {
    id: string;
    title: { en: string; he: string };
    hint: { en: string; he: string };
    image: string;
}

// Diverse unique talents - no duplicates
const gigs: GigCard[] = [
    { id: '1', title: { en: 'Magic Night', he: 'לילה קסום' }, hint: { en: 'wow for your friends', he: 'וואו לחברים' }, image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&h=500&fit=crop&q=80' },
    { id: '2', title: { en: 'Beat Drop', he: 'הביט שלך' }, hint: { en: 'turn on the mood', he: 'מדליק את הווייב' }, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&q=80' },
    { id: '3', title: { en: 'Chef’s Table', he: 'שולחן השף' }, hint: { en: 'tiny bites, big smiles', he: 'ביסים קטנים, חיוכים גדולים' }, image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&h=500&fit=crop&q=80' },
    { id: '4', title: { en: 'Your Story', he: 'הסיפור שלכם' }, hint: { en: 'make it feel cinematic', he: 'להפוך את זה לקולנועי' }, image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=500&fit=crop&q=80' },
    { id: '5', title: { en: 'Poker Night', he: 'ערב פוקר' }, hint: { en: 'instant game energy', he: 'אנרגיית משחק מיידית' }, image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=500&h=500&fit=crop&q=80' },
    { id: '6', title: { en: 'Stage Master', he: 'אדון הבמה' }, hint: { en: 'host the vibe', he: 'מנחה את הווייב' }, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&h=500&fit=crop&q=80' },
    { id: '7', title: { en: 'Live Voice', he: 'קול חי' }, hint: { en: 'goosebumps on cue', he: 'צמרמורת לפי דרישה' }, image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop&q=80' },
    { id: '8', title: { en: 'Cocktail Art', he: 'אומנות הקוקטייל' }, hint: { en: 'make it taste fancy', he: 'שיהיה טעים ויוקרתי' }, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=500&fit=crop&q=80' },
    { id: '9', title: { en: 'Face Painting', he: 'ציור פנים' }, hint: { en: 'cute chaos (good one)', he: 'בלגן חמוד (בקטע טוב)' }, image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500&h=500&fit=crop&q=80' },
    { id: '10', title: { en: 'Cinematic', he: 'קולנוע חי' }, hint: { en: 'make it a moment', he: 'לעשות מזה רגע' }, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=500&fit=crop&q=80' },
    { id: '11', title: { en: 'Sound Healer', he: 'מרפא בצלילים' }, hint: { en: 'deep chill reset', he: 'ריסט צ׳יל עמוק' }, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&q=80' },
    { id: '12', title: { en: 'Samba Queen', he: 'מלכת הסמבה' }, hint: { en: 'energy spike', he: 'בוסט אנרגיה' }, image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=500&h=500&fit=crop&q=80' },
    { id: '13', title: { en: 'Sushi Chef', he: 'שף סושי' }, hint: { en: 'so everyone’s happy', he: 'כדי שכולם יהיו מרוצים' }, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop&q=80' },
    { id: '14', title: { en: 'Fire Show', he: 'מופע אש' }, hint: { en: 'tiny wow explosion', he: 'פיצוץ וואו קטן' }, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop&q=80' },
    { id: '15', title: { en: 'Aerial Silk', he: 'משי אווירי' }, hint: { en: 'art in the air', he: 'אמנות באוויר' }, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=500&fit=crop&q=80' },
    { id: '16', title: { en: 'Sax Sunset', he: 'סקסופון שקיעה' }, hint: { en: 'romance button', he: 'כפתור רומנטיקה' }, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop&q=80' },
    { id: '17', title: { en: 'Balloon Art', he: 'אומנות בלונים' }, hint: { en: 'instant cute', he: 'חמוד מיידי' }, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop&q=80' },
    { id: '18', title: { en: 'Cartoonist', he: 'קריקטוריסט' }, hint: { en: 'funny portrait in 2 min', he: 'דיוקן מצחיק ב-2 דקות' }, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop&q=80' },
    { id: '19', title: { en: 'Harp Glow', he: 'נבל' }, hint: { en: 'soft luxury', he: 'יוקרה רכה' }, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&q=80' },
    { id: '20', title: { en: 'Body Painter', he: 'ציור גוף' }, hint: { en: 'festival energy', he: 'אנרגיית פסטיבל' }, image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500&h=500&fit=crop&q=80' },
];

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const handleCardClick = (title: string) => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = title;
            searchInput.focus();
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Split into two rows - NO duplicates, just different cards
    const row1 = gigs.slice(0, 10);
    const row2 = gigs.slice(10, 20);

    return (
        <section className="py-8 md:py-12 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Row 1 - Smooth horizontal scroll */}
            <div className="relative mb-4">
                <motion.div
                    className="flex gap-3 md:gap-4 ps-4"
                    animate={{ x: ['0%', '-100%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 35,
                            ease: 'linear',
                        },
                    }}
                >
                    {/* Duplicate for seamless loop */}
                    {[...row1, ...row1].map((gig, index) => (
                        <WoltCube 
                            key={`row1-${gig.id}-${index}`} 
                            gig={gig} 
                            lang={lang} 
                            onClick={() => handleCardClick(gig.title[lang])} 
                        />
                    ))}
                </motion.div>
            </div>

            {/* Row 2 - Opposite direction */}
            <div className="relative">
                <motion.div
                    className="flex gap-3 md:gap-4 ps-4"
                    animate={{ x: ['-100%', '0%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 40,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...row2, ...row2].map((gig, index) => (
                        <WoltCube 
                            key={`row2-${gig.id}-${index}`} 
                            gig={gig} 
                            lang={lang} 
                            onClick={() => handleCardClick(gig.title[lang])} 
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Wolt-style perfect square card
function WoltCube({ gig, lang, onClick }: { gig: GigCard; lang: 'en' | 'he'; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            className="flex-shrink-0 group focus:outline-none"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            {/* Perfect Square - Wolt rounded corners */}
            <div 
                className="relative w-36 h-36 md:w-44 md:h-44 rounded-[20px] md:rounded-[28px] overflow-hidden bg-black"
                style={{
                    boxShadow: '0 8px 30px -8px rgba(0,0,0,0.25)',
                }}
            >
                {/* Image */}
                <Image
                    src={gig.image}
                    alt={gig.title[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 144px, 176px"
                />

                {/* Gradient overlay - Wolt style */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hover shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Label - centered, no overflow */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <p className="text-white font-black text-sm md:text-base text-center leading-tight drop-shadow-2xl line-clamp-2">
                        {gig.title[lang]}
                    </p>
                    <p className="mt-1 text-white/90 text-[11px] md:text-xs text-center leading-tight drop-shadow-2xl line-clamp-1">
                        {gig.hint[lang]}
                    </p>
                </div>
            </div>
        </motion.button>
    );
}
