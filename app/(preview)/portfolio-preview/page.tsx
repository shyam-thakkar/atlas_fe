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
                // 404 means no resume uploaded - this is expected, not an error
                if (err.status !== 404) {
                    console.error('Failed to load portfolio:', err);
                }
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

    if (!portfolioData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-md text-center p-8 bg-indigo-50 dark:bg-zinc-900 rounded-2xl border border-indigo-100 dark:border-zinc-700">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">No Portfolio Data</h3>
                    <p className="text-indigo-700 dark:text-zinc-400 mb-6 text-sm">Please upload your resume to generate your portfolio data.</p>
                    <a href="/dashboard/resume" target="_top" className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm cursor-pointer">
                        Go to Resume Upload
                    </a>
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
