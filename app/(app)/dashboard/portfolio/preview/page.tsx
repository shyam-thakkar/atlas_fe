'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function PortfolioPreviewPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeTheme, setIframeTheme] = useState<'light' | 'dark'>('light');

    // Refresh iframe data when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'PORTFOLIO_DATA_REFRESH'
                }, '*');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

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
    const badgeClasses = iframeTheme === 'dark'
        ? 'bg-green-900 text-green-300'
        : 'bg-green-100 text-green-700';

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-100 dark:bg-zinc-900 p-8">
            <div className="flex-1 max-w-8xl mx-auto w-full shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
                {/* Browser Chrome - synced with iframe theme */}
                <div className={`${chromeClasses} border-b p-2 flex justify-between items-center px-4 transition-colors duration-300 flex-shrink-0`}>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 ${badgeClasses} text-xs rounded-full font-bold transition-colors duration-300`}>LIVE PREVIEW</span>
                        <span className={`text-xs font-mono ${chromeLabelClasses} transition-colors duration-300`}>preview: design_1</span>
                    </div>
                </div>

                {/* Iframe Preview - scrolls internally */}
                <iframe
                    ref={iframeRef}
                    src="/portfolio-preview?mode=preview"
                    className="w-full flex-1 border-0"
                    title="Portfolio Preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
}
