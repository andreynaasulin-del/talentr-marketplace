'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { packages, Package } from '@/lib/gigs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, MouseEvent } from 'react';

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = (language === 'he' ? 'he' : 'en') as 'en' | 'he';

    const content = {
        en: {
            title: 'The Collection',
            subtitle: 'Curated artistic experiences, encased in digital crystal.',
        },
        he: {
            title: 'האוסף',
            subtitle: 'חוויות אמנותיות נבחרות, עטופות בקריסטל דיגיטלי.',
        },
    };

    const t = content[lang];

    // Show all packages
    const allPackages = packages;

    return (
        <section className="py-12 md:py-16 bg-white border-b border-gray-100">
            <div className="container-wolt">
                {/* Header */}
                <div className="mb-8 md:mb-12" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-[#202125] mb-2">{t.title}</h2>
                        <p className="text-[#545454] text-base md:text-lg max-w-2xl">{t.subtitle}</p>
                    </motion.div>
                </div>

                {/* Grid Layout - No Cut-offs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                    {allPackages.map((pkg, i) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                        >
                            <GigCard pkg={pkg} lang={lang} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function GigCard({ pkg, lang }: { pkg: Package; lang: 'en' | 'he' }) {
    const isHebrew = lang === 'he';

    return (
        <div className="w-full">
            <Link
                href={`/package/${pkg.id}`}
                className="block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
            >
                {/* IMAGE - Real category image */}
                <div className="h-48 relative overflow-hidden">
                    <Image
                        src={pkg.image}
                        alt={pkg.title[lang]}
                        fill
                        className="object-cover"
                        sizes="300px"
                        priority={false}
                    />
                </div>

                {/* CONTENT CONTAINER - White, bottom rounded */}
                <div className="p-4">
                    {/* Category - Small, muted */}
                    <p className="text-[#999999] text-xs font-medium uppercase tracking-wide mb-1">
                        {pkg.category}
                    </p>

                    {/* Title - Bold, dark, max 2 lines */}
                    <h3 className="text-[#202125] font-bold text-base leading-snug line-clamp-2 mb-3">
                        {pkg.title[lang]}
                    </h3>

                    {/* Bottom row - Price/CTA */}
                    <div className="flex items-center justify-between">
                        <span className="text-[#009DE0] text-sm font-semibold">
                            {isHebrew ? 'לפרטים נוספים' : 'View Details'}
                        </span>
                        <svg className="w-4 h-4 text-[#009DE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </Link>
        </div>
    );
}