'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PortfolioDesign1 } from '@/components/portfolio_template/design_1';
import { StructuredPortfolio } from '@/types/portfolio';
import { profile } from '@/lib/profile';

function PortfolioPreviewContent() {
    const [portfolioData, setPortfolioData] = useState<StructuredPortfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Check if this is for the live preview page (constrained width) or editor (full width)
    const isPreviewMode = searchParams.get('mode') === 'preview';

    useEffect(() => {
        // Listen for data from parent window (editor)
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'PORTFOLIO_DATA_UPDATE') {
                setPortfolioData(event.data.data);
            }
        };

        window.addEventListener('message', handleMessage);

        // Load initial data from API
        profile.getStructuredPortfolio()
            .then(data => {
                setPortfolioData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load portfolio:', err);
                setLoading(false);
            });

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    // Editor uses fullWidth, Live Preview uses constrained width
    return <PortfolioDesign1 data={portfolioData} fullWidth={!isPreviewMode} />;
}

export default function PortfolioPreviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
                </div>
            </div>
        }>
            <PortfolioPreviewContent />
        </Suspense>
    );
}
