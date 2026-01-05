'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { publish } from '@/lib/publish';
import { StructuredPortfolio } from '@/types/portfolio';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import { ChatWidget } from '@/components/chat';
import { PortfolioJsonLd } from './PortfolioJsonLd';

export default function PublicPortfolioPage() {
    const params = useParams();
    const username = params.username as string;

    const [portfolio, setPortfolio] = useState<StructuredPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            loadPortfolio();
        }
    }, [username]);

    const loadPortfolio = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await publish.getPublicPortfolio(username);
            const rawData = data as any;

            // API returns portfolio data directly at root level
            let portfolioData: any;
            if (rawData.hero && rawData.projects) {
                // Data is at root level
                portfolioData = rawData;
            } else if (rawData.portfolio) {
                // Data is nested under 'portfolio' key
                portfolioData = rawData.portfolio;
            } else {
                portfolioData = rawData;
            }

            setPortfolio(portfolioData as StructuredPortfolio);
        } catch (err: any) {
            if (err.status === 404) {
                setError('Portfolio not found. This user may not have published their portfolio yet.');
            } else {
                setError(err.message || 'Failed to load portfolio');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-violet-600/20 border-t-violet-600"></div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Portfolio Not Found
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 mb-6">
                        {error}
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return null;
    }

    return (
        <div className="min-h-screen">
            {/* JSON-LD Structured Data */}
            <PortfolioJsonLd portfolio={portfolio} username={username} />

            <PortfolioPreview data={portfolio}>
                {/* Chat widget inside themed container so it responds to theme toggle */}
                <ChatWidget
                    isPublic={true}
                    username={username}
                    title={`Chat with ${portfolio.hero?.full_name || username}`}
                />
            </PortfolioPreview>
        </div>
    );
}
