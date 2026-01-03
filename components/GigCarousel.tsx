'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import './GigCarousel.css';

interface GigCard {
    id: string;
    title: { en: string; he: string };
    image: string;
    category: string;
    price: string;
}

// Gig cards as user requested - service descriptions like Wolt
const gigs: GigCard[] = [
    {
        id: '1',
        title: { en: 'Magician for anniversary', he: 'קוסם ליום נישואין' },
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=400&fit=crop&q=80',
        category: 'Magician',
        price: '₪1,500'
    },
    {
        id: '2',
        title: { en: 'DJ for house party', he: 'DJ למסיבת בית' },
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=400&fit=crop&q=80',
        category: 'DJ',
        price: '₪2,000'
    },
    {
        id: '3',
        title: { en: 'Chef for romantic dinner', he: 'שף לארוחת ערב רומנטית' },
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&q=80',
        category: 'Chef',
        price: '₪1,800'
    },
    {
        id: '4',
        title: { en: 'Photographer for wedding', he: 'צלם לחתונה' },
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop&q=80',
        category: 'Photographer',
        price: '₪3,500'
    },
    {
        id: '5',
        title: { en: 'Poker dealer for friends night', he: 'דילר לערב פוקר עם חברים' },
        image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=400&fit=crop&q=80',
        category: 'Bartender',
        price: '₪800'
    },
    {
        id: '6',
        title: { en: 'MC for Bar Mitzvah', he: 'מנחה לבר מצווה' },
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=400&fit=crop&q=80',
        category: 'MC',
        price: '₪2,500'
    },
    {
        id: '7',
        title: { en: 'Singer for birthday party', he: 'זמר למסיבת יום הולדת' },
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&q=80',
        category: 'Singer',
        price: '₪2,200'
    },
    {
        id: '8',
        title: { en: 'Bartender for cocktail party', he: 'ברמן למסיבת קוקטיילים' },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80',
        category: 'Bartender',
        price: '₪1,200'
    },
    {
        id: '9',
        title: { en: 'Face painter for kids party', he: 'ציור פנים למסיבת ילדים' },
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80',
        category: 'Face Painter',
        price: '₪600'
    },
    {
        id: '10',
        title: { en: 'Videographer for event', he: 'צלם וידאו לאירוע' },
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&q=80',
        category: 'Videographer',
        price: '₪2,800'
    },
];

export default function GigCarousel() {
    const { language } = useLanguage();
    const lang = language as 'en' | 'he';

    // Duplicate gigs for seamless infinite scroll
    const duplicatedGigs = [...gigs, ...gigs];

    return (
        <section className="gig-carousel-section">
            {/* Marquee container with mask for fade effect */}
            <div className="gig-carousel-container">
                <div className="gig-carousel-track">
                    {duplicatedGigs.map((gig, index) => (
                        <GigCardComponent
                            key={`gig-${gig.id}-${index}`}
                            gig={gig}
                            lang={lang}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GigCardComponent({ gig, lang }: { gig: GigCard; lang: 'en' | 'he' }) {
    return (
        <Link
            href={`/?category=${gig.category}`}
            className="gig-card"
        >
            {/* Image */}
            <Image
                src={gig.image}
                alt={gig.title[lang]}
                fill
                className="gig-card-image"
                sizes="320px"
            />

            {/* Gradient overlay */}
            <div className="gig-card-overlay" />

            {/* Price badge */}
            <div className="gig-card-price">
                <span>{gig.price}</span>
            </div>

            {/* Content */}
            <div className="gig-card-content">
                <h3 className="gig-card-title">
                    {gig.title[lang]}
                </h3>
            </div>

            {/* Hover overlay */}
            <div className="gig-card-hover-overlay" />
        </Link>
    );
}
