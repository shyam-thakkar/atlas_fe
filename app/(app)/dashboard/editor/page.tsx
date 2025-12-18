'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';
import { StructuredPortfolio } from '@/types/portfolio';

export default function PortfolioPlayground() {
    const [previewData, setPreviewData] = useState<StructuredPortfolio | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Send data updates to iframe
    useEffect(() => {
        if (previewData && iframeRef.current?.contentWindow) {
            console.log('📤 Sending data to iframe:', previewData);
            iframeRef.current.contentWindow.postMessage({
                type: 'PORTFOLIO_DATA_UPDATE',
                data: previewData
            }, '*'); // Use wildcard for cross-origin iframe
        }
    }, [previewData]);

    return (
        <div className="h-full flex overflow-hidden bg-gray-50 dark:bg-zinc-900 transition-colors">
            {/* Main Content Area */}
            <div className="flex w-full h-full">
                {/* Left Side: Editor */}
                <div className="w-1/2 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex flex-col shadow-lg z-10 relative">
                    <div className="flex-1 min-h-0">
                        <PortfolioManager
                            defaultEdit={true}
                            onDataChange={setPreviewData}
                        />
                    </div>
                </div>

                {/* Right Side: Live Preview (Iframe) */}
                <div className="w-1/2 flex-1 overflow-hidden bg-gray-100 dark:bg-zinc-900 p-8 shadow-inner">
                    <div className="h-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
                        {/* Browser Chrome */}
                        <div className="bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 p-2 flex justify-between items-center bg-gray-50 dark:bg-zinc-800 px-4 transition-colors flex-shrink-0">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500">preview: design_1</span>
                        </div>

                        {/* Iframe Preview */}
                        <iframe
                            ref={iframeRef}
                            src="/portfolio-preview"
                            className="w-full flex-1 border-0"
                            title="Portfolio Preview"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

