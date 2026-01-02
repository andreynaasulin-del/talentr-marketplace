'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    asLink?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { width: 80, height: 24 },
    md: { width: 110, height: 32 },
    lg: { width: 140, height: 40 },
    xl: { width: 200, height: 60 },
};

export default function Logo({ size = 'md', asLink = true, className }: LogoProps) {
    const { width, height } = sizeMap[size];

    const content = (
        <div className={cn("relative flex items-center", className)}>
            <Image
                src="/logo.jpg"
                alt="Talentr"
                width={width}
                height={height}
                className="object-contain"
                priority
            />
        </div>
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
