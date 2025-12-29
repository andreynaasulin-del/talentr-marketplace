'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryRail from '@/components/CategoryRail';
import { supabase } from '@/lib/supabase';

// Dynamic imports for below-fold components (lazy loading)
const VendorGrid = dynamic(() => import('@/components/VendorGrid'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-3xl" />
});
const FeaturedVendors = dynamic(() => import('@/components/FeaturedVendors'));
const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const vendorGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await supabase.auth.getUser();
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        checkAuth().finally(() => clearTimeout(timeout));
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <HeroSection />

            {/* Categories */}
            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    <CategoryRail onCategoryChange={(cat) => {
                        setSelectedCategory(cat);
                        if (cat !== 'All') {
                            vendorGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }} />
                </div>
            </section>

            {/* Vendor Grid - Only show when category selected */}
            {selectedCategory !== 'All' && (
                <section ref={vendorGridRef} className="py-12 md:py-20 scroll-mt-20">
                    <VendorGrid category={selectedCategory} />
                </section>
            )}

            {/* Featured Vendors */}
            <section className="py-16 md:py-24">
                <FeaturedVendors />
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24 bg-gray-50">
                <HowItWorks />
            </section>

            <Footer />
        </main>
    );
}
