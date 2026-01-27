'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This page redirects to the slug-based URL if available
// Or shows the gig directly if no slug exists

export default function GigPage() {
    const params = useParams();
    const router = useRouter();
    const gigId = params.id as string;

    useEffect(() => {
        const checkGigAndRedirect = async () => {
            try {
                const res = await fetch(`/api/gigs/${gigId}`);
                const data = await res.json();

                if (!res.ok || !data.gig) {
                    router.push('/');
                    return;
                }

                // If gig has a share_slug and is accessible, redirect to pretty URL
                if (data.gig.share_slug && (data.gig.status === 'published' || data.gig.status === 'unlisted')) {
                    router.replace(`/g/${data.gig.share_slug}`);
                } else {
                    // For drafts or gigs without slug, keep on this page
                    // In a real app, you'd render the gig here
                    // For now, redirect to home as drafts shouldn't be publicly visible
                    router.push('/');
                }
            } catch (error) {
                router.push('/');
            }
        };

        checkGigAndRedirect();
    }, [gigId, router]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
    );
}
