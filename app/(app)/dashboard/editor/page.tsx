'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';
import { StructuredPortfolio } from '@/types/portfolio';

export default function PortfolioPlayground() {
    const [previewData, setPreviewData] = useState<StructuredPortfolio | null>(null);
    const [iframeTheme, setIframeTheme] = useState<'light' | 'dark'>('light');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Send data updates to iframe
    useEffect(() => {
        if (previewData && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'PORTFOLIO_DATA_UPDATE',
                data: previewData
            }, '*');
        }
    }, [previewData]);

    // Listen for theme changes from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'PORTFOLIO_THEME_CHANGE') {
                setIframeTheme(event.data.isDark ? 'dark' : 'light');
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Browser chrome classes based on iframe theme
    const chromeClasses = iframeTheme === 'dark'
        ? 'bg-zinc-900 border-zinc-700'
        : 'bg-gray-50 border-gray-200';
    const chromeLabelClasses = iframeTheme === 'dark'
        ? 'text-gray-400'
        : 'text-gray-500';

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
                <div className="w-1/2 flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-zinc-900 p-8 shadow-inner">
                    <div className="flex-1 max-w-4xl mx-auto w-full shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
                        {/* Browser Chrome - synced with iframe theme */}
                        <div className={`${chromeClasses} border-b p-2 flex justify-between items-center px-4 transition-colors duration-300 flex-shrink-0`}>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <span className={`text-xs font-mono ${chromeLabelClasses} transition-colors duration-300`}>preview: design_1</span>
                        </div>

                        {/* Iframe Preview - scrolls internally */}
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
