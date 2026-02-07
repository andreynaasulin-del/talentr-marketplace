'use client';

import { useEffect } from 'react';
import { getUtmParams } from '@/lib/analytics';

export default function TrafficTracker() {
    useEffect(() => {
        // This function checks URL params and saves them to Cookie/LocalStorage if found
        getUtmParams();
    }, []);

    return null;
}
