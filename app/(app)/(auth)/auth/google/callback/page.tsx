'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get tokens from URL parameters (set by backend after OAuth)
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');
        const error = searchParams.get('error');

        if (error) {
            // Redirect to login with error message
            router.push(`/login?error=${encodeURIComponent(error)}`);
            return;
        }

        if (access && refresh) {
            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Redirect to dashboard
            router.push('/dashboard');
        } else {
            // No tokens, redirect to login
            router.push('/login?error=Authentication failed');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
}
