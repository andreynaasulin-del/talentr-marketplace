import React from 'react';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] rounded ${className}`}
            style={{
                animation: 'shimmer 2s infinite',
            }}
        />
    );
}

// Vendor Card Skeleton (for Home Page grid)
export function VendorCardSkeleton() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-card">
            {/* Image Skeleton */}
            <Skeleton className="w-full aspect-[4/3]" />

            <div className="p-5">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-12" />
                </div>

                {/* Location */}
                <Skeleton className="h-4 w-40 mb-4" />

                {/* Footer Row */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <div className="flex gap-1.5">
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// Auth Form Skeleton
export function AuthFormSkeleton() {
    return (
        <div className="space-y-5">
            {/* Title */}
            <div className="mb-10">
                <Skeleton className="h-12 w-48 mb-3" />
                <Skeleton className="h-6 w-64" />
            </div>

            {/* Form Fields */}
            <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-14 w-full rounded-xl" />
            </div>

            <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-14 w-full rounded-xl" />
            </div>

            {/* Button */}
            <Skeleton className="h-14 w-full rounded-xl mt-6" />

            {/* Divider */}
            <div className="relative my-8">
                <Skeleton className="h-px w-full" />
            </div>

            {/* Social Button */}
            <Skeleton className="h-14 w-full rounded-xl" />
        </div>
    );
}

// Vendor Profile Page Skeleton
export function VendorProfileSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors">
            {/* Hero Skeleton */}
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-[400px] rounded-b-3xl" />
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About */}
                        <div>
                            <Skeleton className="h-10 w-32 mb-4" />
                            <Skeleton className="h-5 w-full mb-2" />
                            <Skeleton className="h-5 w-full mb-2" />
                            <Skeleton className="h-5 w-3/4 mb-6" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-20 rounded-full" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-16 rounded-full" />
                            </div>
                        </div>

                        {/* Portfolio Grid */}
                        <div>
                            <Skeleton className="h-10 w-40 mb-6" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="aspect-square rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-6">
                                <Skeleton className="h-6 w-24 mb-1" />
                                <Skeleton className="h-12 w-32 mb-6" />
                                <Skeleton className="h-12 w-full rounded-xl mb-4" />
                                <Skeleton className="h-5 w-40 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Page Loading Overlay
export function PageLoader() {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-900/50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-zinc-400 font-medium">Loading...</p>
            </div>
        </div>
    );
}

// Inline Spinner (for buttons)
export function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
}
