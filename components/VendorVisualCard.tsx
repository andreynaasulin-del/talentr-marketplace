'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Heart, ChevronRight, Check, Zap } from 'lucide-react';
import { Vendor } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface VendorVisualCardProps {
    vendor: Vendor;
    context?: string;
}

export default function VendorVisualCard({ vendor, context }: VendorVisualCardProps) {
    const { convertPrice, t, language } = useLanguage();
    const [isLiked, setIsLiked] = useState(false);

    const whatsappMessage = encodeURIComponent(
        language === 'ru'
            ? `Привет, ${vendor.name}! Нашёл вас на Talentr${context ? ` для ${context}` : ''}. Можем обсудить детали?`
            : language === 'he'
                ? `שלום ${vendor.name}! מצאתי אותך ב-Talentr${context ? ` עבור ${context}` : ''}. נוכל לדון בפרטים?`
                : `Hi ${vendor.name}! I found you on Talentr${context ? ` for ${context}` : ''}. Can we discuss details?`
    );

    const whatsappUrl = vendor.phone
        ? `https://wa.me/${vendor.phone}?text=${whatsappMessage}`
        : `https://wa.me/972501234567?text=${whatsappMessage}`;

    const isTopRated = vendor.rating >= 4.8;

    return (
        <div className="group relative w-full max-w-sm card-interactive">
            {/* 3D Container */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
                {/* Image Section - Click to View Profile */}
                <Link href={`/vendor/${vendor.id}`} className="block relative aspect-[4/5] w-full overflow-hidden cursor-pointer">
                    <Image
                        src={vendor.imageUrl}
                        alt={vendor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, 384px"
                    />

                    {/* Image Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-4 inset-x-4 flex items-start justify-between">
                        {/* Category Badge - Glassmorphism */}
                        <span className="px-3.5 py-1.5 glass-strong rounded-full text-gray-900 text-xs font-bold shadow-sm">
                            {t(vendor.category).toUpperCase()}
                        </span>

                        {/* TOP Badge */}
                        {isTopRated && (
                            <div className="flex flex-col gap-2">
                                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center gap-1.5 text-white text-[10px] font-black shadow-lg animate-pulse">
                                    <Star className="w-3 h-3 fill-current" />
                                    TOP RATED
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 end-4 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                        {/* Like Button */}
                        <button
                            onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                transition-all duration-200 shadow-lg
                                ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:text-red-500'}
                            `}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Quick Info Bottom Overlay */}
                    <div className="absolute bottom-4 inset-x-4">
                        <div className="flex items-end justify-between">
                            <div className="text-white">
                                <h3 className="text-2xl font-bold leading-tight mb-1 drop-shadow-md">
                                    {vendor.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-white/90">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold">{vendor.rating}</span>
                                    <span className="opacity-70">({vendor.reviewsCount})</span>
                                </div>
                            </div>

                            {/* Price Badge */}
                            <div className="flex flex-col items-end">
                                <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider">{t('from')}</span>
                                <div className="bg-blue-500 text-white px-3 py-1.5 rounded-xl font-bold text-lg shadow-lg border border-blue-400/50">
                                    {convertPrice(vendor.priceFrom)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Content Section / Footer */}
                <div className="p-5 bg-white border-t border-gray-50">
                    {/* Tags & Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                            <Check className="w-3.5 h-3.5" />
                            {t('Verified Pro')}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                            <Zap className="w-3.5 h-3.5" />
                            {t('Fast Reply')}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold">
                            <MapPin className="w-3.5 h-3.5" />
                            {t(vendor.city)}
                        </div>
                    </div>

                    {/* CTA Button - WhatsApp Green */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 flex items-center justify-center gap-3 text-base bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {t('Chat on WhatsApp')}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>

            {/* Gradient Border Decor */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        </div >
    );
}
