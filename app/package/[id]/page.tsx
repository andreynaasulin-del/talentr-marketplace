'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackageDetailPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home - all interactions through AI assistant
        router.replace('/#packages');
    }, [router]);

    return null;
}
