'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'dark' | 'light';
    asLink?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
};

const tailSizes = {
    sm: { width: 8, height: 10, top: -2, right: -1 },
    md: { width: 10, height: 12, top: -2, right: -1 },
    lg: { width: 12, height: 14, top: -3, right: -1 },
    xl: { width: 16, height: 20, top: -4, right: -2 },
};

export default function Logo({ size = 'md', variant = 'dark', asLink = true, className }: LogoProps) {
    const textClass = sizeClasses[size];
    const tail = tailSizes[size];

    const content = (
        <span
            className={cn(
                "font-bold tracking-[-0.02em] inline-flex items-baseline",
                textClass,
                variant === 'dark' ? 'text-slate-900' : 'text-white',
                className
            )}
        >
            <span>talentr</span>
            {/* Blue swoosh tail on the 'r' */}
            <svg
                className="relative"
                style={{
                    width: tail.width,
                    height: tail.height,
                    marginLeft: tail.right,
                    marginTop: tail.top,
                    marginBottom: 'auto',
                }}
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2 14C2 14 3 8 6 5C9 2 11 2 11 2"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    );

    if (asLink) {
        return (
            <Link href="/" className="focus:outline-none inline-block">
                {content}
            </Link>
        );
    }

    return content;
}
