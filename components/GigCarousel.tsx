'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { packages, Package } from '@/lib/gigs';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            title: 'Thematic Experiences',
            subtitle: 'Curated sets designed for specific vibes and moments.',
            explore: 'Explore',
            min: 'min',
            guests: 'guests',
        },
        he: {
            title: 'חוויות נושאיות',
            subtitle: 'סטים שנבחרו בקפידה לאווירה ורגעים ספציפיים.',
            explore: 'גלה',
            min: 'דק׳',
            guests: 'אורחים',
        },
    };

    const t = content[lang];

    // Split packages for two rows
    const firstRow = packages.slice(0, 10);
    const secondRow = packages.slice(10, 20);

    return (
        <section id="packages" className="py-20 md:py-28 bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        {t.title}
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            {/* Marquee Row 1 - Right to Left */}
            <div className="flex mb-8">
                <MarqueeRow items={firstRow} direction="left" lang={lang} t={t} />
            </div>

            {/* Marquee Row 2 - Left to Right */}
            <div className="flex">
                <MarqueeRow items={secondRow} direction="right" lang={lang} t={t} />
            </div>
        </section>
    );
}

interface MarqueeRowProps {
    items: Package[];
    direction: 'left' | 'right';
    lang: 'en' | 'he';
    t: any;
}

function MarqueeRow({ items, direction, lang, t }: MarqueeRowProps) {
    // Duplicate items for seamless loop
    const doubledItems = [...items, ...items, ...items];

    return (
        <div className="flex w-full overflow-hidden select-none">
            <motion.div
                className="flex gap-4 md:gap-6"
                animate={{
                    x: direction === 'left' ? [0, -280 * items.length] : [-280 * items.length, 0],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((pkg, idx) => (
                    <div key={`${pkg.id}-${idx}`} className="flex-shrink-0 w-[240px] md:w-[280px]">
                        <PackageCube pkg={pkg} lang={lang} t={t} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function PackageCube({ pkg, lang, t }: { pkg: Package; lang: 'en' | 'he'; t: any }) {
    return (
        <Link
            href={`/package/${pkg.id}`}
            className="group block relative aspect-square overflow-hidden rounded-[32px] md:rounded-[40px] bg-slate-900 border border-white/5 transition-all duration-500 hover:border-white/20"
        >
            {/* Image */}
            <Image
                src={pkg.image}
                alt={pkg.title[lang]}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 240px, 280px"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Content Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <span className="inline-block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                            {pkg.category}
                        </span>
                        <h3 className="text-lg md:text-xl font-black text-white leading-snug mb-2 drop-shadow-md min-h-[3rem]">
                            {pkg.title[lang]}
                        </h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl group-hover:bg-white group-hover:text-slate-950 transition-colors duration-300">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>

                {/* Thematic description hint */}
                <p className="text-white/60 text-xs font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {pkg.description[lang]}
                </p>
            </div>
        </Link>
    );
}
