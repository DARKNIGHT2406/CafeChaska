'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FallbackDashboard() {
    const router = useRouter();

    useEffect(() => {
        // This route exists to catch redirects to /dashboard (missing slug)
        // We redirect them back to login or handle it gracefully
        console.warn('Redirected to /dashboard without slug. Redirecting to login.');
        router.replace('/login');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream font-sans">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-dark mb-2">Redirecting...</h1>
                <p className="text-dark/60">Please wait while we send you to the right place.</p>
            </div>
        </div>
    );
}
