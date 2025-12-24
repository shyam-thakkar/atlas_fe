'use client';

import React, { useRef, useEffect, useState } from 'react';
import { publish } from '@/lib/publish';
import { PublishStatusResponse, PublicPortfolioResponse } from '@/types/publish';
import { StructuredPortfolio } from '@/types/portfolio';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';

type PreviewMode = 'draft' | 'live';

export default function PortfolioPreviewPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeTheme, setIframeTheme] = useState<'light' | 'dark'>('light');
    const [previewMode, setPreviewMode] = useState<PreviewMode>('draft');
    const [publishStatus, setPublishStatus] = useState<PublishStatusResponse | null>(null);
    const [liveData, setLiveData] = useState<StructuredPortfolio | null>(null);
    const [isLoadingLive, setIsLoadingLive] = useState(false);
    const [liveError, setLiveError] = useState<string | null>(null);

    // Load publish status on mount
    useEffect(() => {
        loadPublishStatus();
    }, []);

    const loadPublishStatus = async () => {
        try {
            const status = await publish.getPublishStatus();
            setPublishStatus(status);
        } catch (err) {
            console.error('Failed to load publish status:', err);
        }
    };

    // Load live portfolio when switching to live mode
    useEffect(() => {
        if (previewMode === 'live' && publishStatus?.is_published && publishStatus.username) {
            loadLivePortfolio(publishStatus.username);
        }
    }, [previewMode, publishStatus]);

    const loadLivePortfolio = async (username: string) => {
        setIsLoadingLive(true);
        setLiveError(null);
        try {
            const data = await publish.getPublicPortfolio(username);
            console.log('Live portfolio API response:', data);
            
            // The API returns the portfolio data directly at the root level
            // Check if data has portfolio fields directly (hero, projects, etc.)
            // or if it's nested under a 'portfolio' key
            let portfolioData: any;
            const rawData = data as any;
            
            if (rawData.hero && rawData.projects) {
                // Data is at root level (direct portfolio structure)
                portfolioData = data;
            } else if ((data as any).portfolio) {
                // Data is nested under 'portfolio' key
                portfolioData = (data as any).portfolio;
            } else if ((data as any).snapshot_data) {
                // Data is under 'snapshot_data' key
                portfolioData = (data as any).snapshot_data;
            } else {
                // Fallback - treat response as portfolio data
                portfolioData = data;
            }
            
            // If portfolio is a string (JSON), parse it
            if (typeof portfolioData === 'string') {
                try {
                    portfolioData = JSON.parse(portfolioData);
                } catch (e) {
                    console.error('Failed to parse portfolio JSON:', e);
                }
            }
            
            console.log('Parsed portfolio data:', portfolioData);
            setLiveData(portfolioData as StructuredPortfolio);
        } catch (err: any) {
            console.error('Failed to load live portfolio:', err);
            setLiveError(err.message || 'Failed to load published portfolio');
        } finally {
            setIsLoadingLive(false);
        }
    };

    // Refresh iframe data when component mounts
    useEffect(() => {
        if (previewMode === 'draft') {
            const timer = setTimeout(() => {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({
                        type: 'PORTFOLIO_DATA_REFRESH'
                    }, '*');
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [previewMode]);

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

    const openLivePortfolio = () => {
        if (publishStatus?.public_url) {
            publish.openPublishedPortfolio(publishStatus.public_url);
        }
    };

    // Browser chrome classes based on iframe theme
    const chromeClasses = iframeTheme === 'dark'
        ? 'bg-zinc-900 border-zinc-700'
        : 'bg-gray-50 border-gray-200';
    const chromeLabelClasses = iframeTheme === 'dark'
        ? 'text-gray-400'
        : 'text-gray-500';

    const isPublished = publishStatus?.is_published;

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-100 dark:bg-zinc-900 p-8">
            {/* Mode Toggle & Actions */}
            <div className="flex items-center justify-between mb-4">
                {/* Toggle Tabs */}
                <div className="inline-flex bg-gray-200 dark:bg-zinc-800 rounded-xl p-1">
                    <button
                        onClick={() => setPreviewMode('draft')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            previewMode === 'draft'
                                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Draft Preview
                        </span>
                    </button>
                    <button
                        onClick={() => setPreviewMode('live')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            previewMode === 'live'
                                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
                            Live Portfolio
                        </span>
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {isPublished && publishStatus?.public_url && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono truncate max-w-[200px]">
                                {publishStatus.public_url.replace('https://', '')}
                            </span>
                        </div>
                    )}
                    
                    {isPublished && (
                        <button
                            onClick={openLivePortfolio}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open Live Site
                        </button>
                    )}
                </div>
            </div>

            {/* Preview Container */}
            <div className="flex-1 max-w-8xl mx-auto w-full shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
                {/* Browser Chrome - synced with iframe theme */}
                <div className={`${chromeClasses} border-b p-2 flex justify-between items-center px-4 transition-colors duration-300 flex-shrink-0`}>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold transition-colors duration-300 ${
                            previewMode === 'draft'
                                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                : isPublished
                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400'
                        }`}>
                            {previewMode === 'draft' ? 'DRAFT PREVIEW' : isPublished ? 'LIVE' : 'NOT PUBLISHED'}
                        </span>
                        <span className={`text-xs font-mono ${chromeLabelClasses} transition-colors duration-300`}>
                            {previewMode === 'draft' ? 'preview: design_1' : publishStatus?.username ? `${publishStatus.username}.aifolio.in` : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                {previewMode === 'draft' ? (
                    // Draft Preview - iframe
                    <iframe
                        ref={iframeRef}
                        src="/portfolio-preview?mode=preview"
                        className="w-full flex-1 border-0 bg-white"
                        title="Portfolio Draft Preview"
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    // Live Preview - iframe or placeholder
                    <>
                        {!isPublished ? (
                            // Not Published State
                            <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center p-8 max-w-md">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-8 h-8 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            Not Published Yet
                                        </h3>
                                        <p className="text-gray-500 dark:text-zinc-400 mb-6">
                                            Your portfolio hasn't been published. Publish it to get a live URL and share your work with the world.
                                        </p>
                                        <button
                                            onClick={() => setPreviewMode('draft')}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            View Draft Instead
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Live Preview - iframe with published portfolio
                            <iframe
                                src={`/portfolio/${publishStatus?.username}?mode=preview`}
                                className="w-full flex-1 border-0 bg-white"
                                title="Portfolio Live Preview"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
