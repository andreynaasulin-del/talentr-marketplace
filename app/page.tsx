'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GigCarousel from '@/components/GigCarousel';

const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    return (
        <main className="min-h-screen bg-white dark:bg-black transition-colors">
            <Navbar />
            <HeroSection />
            <GigCarousel />
            <Footer />
        </main>
    );
}
