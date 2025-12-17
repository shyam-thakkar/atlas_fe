'use client';

import React, { useState, useEffect } from 'react';
import { profile } from '@/lib/profile';
import { StructuredPortfolio } from '@/types/portfolio';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';

export default function PortfolioPreviewPage() {
    const [data, setData] = useState<StructuredPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        profile.getStructuredPortfolio()
            .then(setData)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return (
        <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!data) return (
        <div className="p-8 text-center">
            Portfolio data not found.
        </div>
    );

    return (
        <div className="w-full h-full overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white shadow-xl rounded-2xl p-12 space-y-12">
                    <div className="pb-8 border-b border-gray-100 flex items-center justify-center relative">
                        <span className="text-xs font-mono text-gray-400 absolute left-0 top-0">LIVE PREVIEW MODE</span>
                        {/* A nice header for the preview wrapper? Optional. */}
                        <div className="text-center">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">LIVE PREVIEW</span>
                        </div>
                    </div>

                    {/* Render the portfolio components */}
                    <PortfolioPreview data={data} />
                </div>
            </div>
        </div>
    );
}
