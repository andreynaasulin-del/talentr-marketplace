'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    asLink?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'text-[18px]',
    md: 'text-[24px]',
    lg: 'text-[32px]',
    xl: 'text-[48px]',
};

export default function Logo({ size = 'md', asLink = true, className }: LogoProps) {
    const textClass = sizeClasses[size];
    
    const content = (
        <span 
            dir="ltr" 
            className={cn(
                "font-bold text-[#1a1a1a] dark:text-white flex items-baseline tracking-[-0.04em]",
                textClass,
                className
            )}
        >
            <span>talent</span>
            <span className="relative inline-flex items-baseline ml-[0.05em]">
                {/* SVG 'r' - STRICTLY MATCHED TO REFERENCE */}
                <svg 
                    className="h-[0.7em] w-auto overflow-visible translate-y-[0.05em]" 
                    viewBox="0 0 20 20" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Stem */}
                    <path 
                        d="M0 5H5V20H0V5Z" 
                        fill="currentColor"
                    />
                    {/* The specific blue accent shape */}
                    <path 
                        d="M5 10C5 10 7 4 15 4C19 4 20 7 20 7C20 7 17 8.5 13 11.5C9 14.5 5 15 5 15V10Z" 
                        fill="#009de0"
                    />
                </svg>
            </span>
        </span>
    );

    if (asLink) {
        return (
            <Link href="/" className="focus:outline-none group inline-block">
                {content}
            </Link>
        );
    }

    return content;
}
