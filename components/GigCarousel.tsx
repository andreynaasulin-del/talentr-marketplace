'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { packages, Package } from '@/lib/gigs';
import { Clock, Users, ArrowRight } from 'lucide-react';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            title: 'Premium Packages',
            subtitle: 'Ready-made experiences. Fixed prices. No negotiations.',
            viewAll: 'View All',
            from: 'From',
            nis: '₪',
            min: 'min',
            guests: 'guests',
            book: 'Book Now',
        },
        he: {
            title: 'חבילות פרימיום',
            subtitle: 'חוויות מוכנות. מחירים קבועים. ללא מיקוח.',
            viewAll: 'הצג הכל',
            from: 'החל מ',
            nis: '₪',
            min: 'דק׳',
            guests: 'אורחים',
            book: 'הזמן עכשיו',
        },
    };

    const t = content[lang];

    return (
        <section id="packages" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-end justify-between mb-10 md:mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-2">
                            {t.title}
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                    {packages.map((pkg, index) => (
                        <PackageCard 
                            key={pkg.id} 
                            pkg={pkg} 
                            lang={lang} 
                            t={t}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface PackageCardProps {
    pkg: Package;
    lang: 'en' | 'he';
    t: {
        from: string;
        nis: string;
        min: string;
        guests: string;
        book: string;
    };
    index: number;
}

function PackageCard({ pkg, lang, t, index }: PackageCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Link
                href={`/package/${pkg.id}`}
                className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300"
            >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 start-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-semibold text-slate-700">
                        {pkg.category}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 end-3 px-3 py-1.5 bg-slate-900 rounded-full">
                        <span className="text-white font-bold text-sm">
                            {t.nis}{pkg.fixedPrice.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-slate-700 transition-colors">
                        {pkg.title[lang]}
                    </h3>
                    
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {pkg.description[lang]}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {pkg.duration} {t.min}
                        </span>
                        {pkg.maxGuests && (
                            <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {pkg.maxGuests} {t.guests}
                            </span>
                        )}
                    </div>

                    {/* Talent */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                            {pkg.talentName[lang]}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:gap-2 transition-all">
                            {t.book}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
