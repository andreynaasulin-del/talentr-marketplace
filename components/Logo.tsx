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
    md: 'text-[22px]',
    lg: 'text-[28px]',
    xl: 'text-[42px]',
};

export default function Logo({ size = 'md', asLink = true, className }: LogoProps) {
    const textClass = sizeClasses[size];

    const content = (
        <span
            dir="ltr"
            className={cn(
                "font-bold text-white flex items-baseline tracking-[-0.04em]",
                textClass,
                className
            )}
        >
            <span>talent</span>
            <span className="relative inline-flex">
                <span>r</span>
                {/* Идеально отрисованный голубой хвостик (вектор) */}
                <svg
                    className="absolute -top-[0.1em] -right-[0.05em] w-[0.55em] h-[0.55em] pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 16C4 16 6 6 16 5C20 4.5 22 8 22 8C22 8 18 9 14 12C10 15 4 16 4 16Z"
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
