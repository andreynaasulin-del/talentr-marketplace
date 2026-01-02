'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    asLink?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
};

const svgSizes = {
    sm: { width: 6, height: 8, top: -1 },
    md: { width: 8, height: 10, top: -2 },
    lg: { width: 10, height: 12, top: -2 },
    xl: { width: 12, height: 14, top: -3 },
};

export default function Logo({ size = 'md', asLink = true, className }: LogoProps) {
    const textClass = sizeClasses[size];
    const svg = svgSizes[size];
    
    const content = (
        <span 
            dir="ltr" 
            className={cn(
                "font-black text-gray-900 dark:text-white flex items-baseline",
                textClass,
                className
            )}
        >
            <span>talent</span>
            <span className="relative">
                <span>r</span>
                {/* Blue accent - only the top curve of "r" */}
                <svg 
                    className="absolute right-0 pointer-events-none" 
                    style={{ 
                        top: svg.top,
                        width: svg.width,
                        height: svg.height,
                    }}
                    viewBox="0 0 10 12" 
                    fill="none"
                >
                    <path 
                        d="M2 12V6C2 3 4 1 8 1" 
                        stroke="#009de0" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            </span>
        </span>
    );

    if (asLink) {
        return (
            <Link href="/" className="focus:outline-none">
                {content}
            </Link>
        );
    }

    return content;
}

