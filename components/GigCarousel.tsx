'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { gigPackages, GigPackage } from '@/lib/gigs';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const handleCardClick = (pkg: GigPackage) => {
        // Scroll to chat and trigger message
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
            const message = lang === 'he' 
                ? `${pkg.emoji} רוצה ${pkg.title.he}`
                : `${pkg.emoji} I want ${pkg.title.en}`;
            searchInput.value = message;
            searchInput.focus();
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Split packages into two rows
    const row1 = gigPackages.slice(0, 8);
    const row2 = gigPackages.slice(8, 16);

    return (
        <section className="py-6 md:py-10 bg-slate-950 overflow-hidden">
            {/* Minimal Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-5">
                <h2 className="text-lg md:text-xl font-black text-white/90 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    {lang === 'he' ? 'הזמן עכשיו' : 'Book Now'}
                </h2>
                <p className="text-white/40 text-sm mt-1">
                    {lang === 'he' ? 'קליק אחד והאמן בדרך' : 'One click and the artist is on the way'}
                </p>
            </div>

            {/* Row 1 - Smooth scroll left */}
            <div className="relative mb-3">
                <motion.div
                    className="flex gap-3 ps-4"
                    animate={{ x: ['0%', '-100%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 45,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...row1, ...row1].map((pkg, index) => (
                        <PackageCube 
                            key={`row1-${pkg.id}-${index}`} 
                            pkg={pkg} 
                            lang={lang} 
                            onClick={() => handleCardClick(pkg)} 
                        />
                    ))}
                </motion.div>
            </div>

            {/* Row 2 - Scroll right */}
            <div className="relative">
                <motion.div
                    className="flex gap-3 ps-4"
                    animate={{ x: ['-100%', '0%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 50,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...row2, ...row2].map((pkg, index) => (
                        <PackageCube 
                            key={`row2-${pkg.id}-${index}`} 
                            pkg={pkg} 
                            lang={lang} 
                            onClick={() => handleCardClick(pkg)} 
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Premium Package Card
function PackageCube({ pkg, lang, onClick }: { pkg: GigPackage; lang: 'en' | 'he'; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            className="flex-shrink-0 group focus:outline-none"
            whileHover={{ scale: 1.06, y: -6 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
        >
            <div 
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-[24px] md:rounded-[32px] overflow-hidden"
                style={{
                    boxShadow: '0 12px 40px -12px rgba(0,157,224,0.3)',
                }}
            >
                {/* Image */}
                <Image
                    src={pkg.image}
                    alt={pkg.title[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 160px, 192px"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Duration badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] text-white font-bold">
                    {pkg.duration}
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="text-3xl mb-1 block">{pkg.emoji}</span>
                    <p className="text-white font-black text-sm md:text-base leading-tight line-clamp-1">
                        {pkg.title[lang]}
                    </p>
                    <p className="text-white/60 text-xs leading-tight line-clamp-1 mt-0.5">
                        {pkg.subtitle[lang]}
                    </p>
                </div>

                {/* Quick action hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-full text-xs font-black shadow-xl shadow-cyan-500/50">
                        {lang === 'he' ? 'הזמן ←' : 'BOOK →'}
                    </div>
                </div>
            </div>
        </motion.button>
    );
}
