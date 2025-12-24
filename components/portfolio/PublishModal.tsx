'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { publish } from '@/lib/publish';
import { PublishStatusResponse } from '@/types/publish';

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type ModalState = 'loading' | 'first-publish' | 'republish' | 'publishing' | 'success' | 'error';

export function PublishModal({ isOpen, onClose, onSuccess }: PublishModalProps) {
    const [state, setState] = useState<ModalState>('loading');
    const [publishStatus, setPublishStatus] = useState<PublishStatusResponse | null>(null);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ url: string; version: number; firstPublish: boolean } | null>(null);
    const [copied, setCopied] = useState(false);

    // Load publish status on open
    useEffect(() => {
        if (isOpen) {
            loadPublishStatus();
        }
    }, [isOpen]);

    const loadPublishStatus = async () => {
        setState('loading');
        setError(null);
        try {
            const status = await publish.getPublishStatus();
            setPublishStatus(status);

            if (status.is_published) {
                setState('republish');
            } else if (status.username) {
                // Has username but not published
                setState('republish');
            } else {
                setState('first-publish');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load publish status');
            setState('error');
        }
    };

    // Debounced username check
    const checkUsername = useCallback(async (value: string) => {
        if (value.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            setUsernameAvailable(null);
            return;
        }

        // Basic validation
        const validPattern = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]$/;
        if (!validPattern.test(value.toLowerCase())) {
            setUsernameError('Letters, numbers, hyphens, and underscores only');
            setUsernameAvailable(null);
            return;
        }

        setIsCheckingUsername(true);
        setUsernameError(null);

        try {
            const result = await publish.checkUsername(value);
            setUsernameAvailable(result.available);
            if (!result.available) {
                setUsernameError(result.reason || 'Username is not available');
            }
        } catch (err: any) {
            setUsernameError(err.message || 'Error checking username');
            setUsernameAvailable(null);
        } finally {
            setIsCheckingUsername(false);
        }
    }, []);

    // Debounce username input
    useEffect(() => {
        if (!username) {
            setUsernameError(null);
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(() => {
            checkUsername(username);
        }, 400);

        return () => clearTimeout(timer);
    }, [username, checkUsername]);

    const handlePublish = async () => {
        setState('publishing');
        setError(null);

        try {
            const isFirstPublish = !publishStatus?.is_published && !publishStatus?.username;
            const result = await publish.publishPortfolio(isFirstPublish ? username : undefined);

            setSuccessData({
                url: result.public_url,
                version: result.version,
                firstPublish: result.first_publish,
            });
            setState('success');
            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Failed to publish portfolio');
            setState('error');
        }
    };

    const handleUnpublish = async () => {
        if (!confirm('Are you sure you want to unpublish your portfolio? Your username will be reserved.')) {
            return;
        }

        setState('publishing');
        try {
            await publish.unpublishPortfolio();
            await loadPublishStatus();
        } catch (err: any) {
            setError(err.message || 'Failed to unpublish');
            setState('error');
        }
    };

    const copyToClipboard = async () => {
        if (successData?.url) {
            await navigator.clipboard.writeText(successData.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const openInNewTab = () => {
        if (successData?.url) {
            window.open(successData.url, '_blank', 'noopener,noreferrer');
        } else if (publishStatus?.public_url) {
            window.open(publishStatus.public_url, '_blank', 'noopener,noreferrer');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {state === 'success' ? 'Published!' : 'Publish Portfolio'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                {state === 'success' ? 'Your portfolio is now live' : 'Share your work with the world'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Loading State */}
                    {state === 'loading' && (
                        <div className="flex flex-col items-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-600/20 border-t-violet-600 mb-4"></div>
                            <p className="text-gray-500 dark:text-zinc-400">Loading publish status...</p>
                        </div>
                    )}

                    {/* First Publish - Username Selection */}
                    {state === 'first-publish' && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    Choose your portfolio URL
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                            placeholder="yourname"
                                            className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0 transition-colors ${usernameError
                                                    ? 'border-red-400 dark:border-red-500'
                                                    : usernameAvailable
                                                        ? 'border-green-400 dark:border-green-500'
                                                        : 'border-gray-200 dark:border-zinc-700 focus:border-violet-500'
                                                }`}
                                        />
                                        {/* Status indicator */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isCheckingUsername && (
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-600/20 border-t-violet-600"></div>
                                            )}
                                            {!isCheckingUsername && usernameAvailable && (
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {!isCheckingUsername && usernameError && username && (
                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-zinc-400 font-mono truncate max-w-[120px]" title={publish.getUrlSuffix() || 'URL preview'}>
                                        {publish.getUrlSuffix() || ''}
                                    </span>
                                </div>
                                {usernameError && (
                                    <p className="mt-2 text-sm text-red-500">{usernameError}</p>
                                )}
                                {usernameAvailable && (
                                    <p className="mt-2 text-sm text-green-500">✓ Username is available!</p>
                                )}
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Choose wisely!</p>
                                        <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                                            Username changes are limited based on your plan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePublish}
                                disabled={!usernameAvailable || isCheckingUsername}
                                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Publish Portfolio
                            </button>
                        </div>
                    )}

                    {/* Republish */}
                    {state === 'republish' && publishStatus && (
                        <div className="space-y-5">
                            {/* Current URL */}
                            <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">Your portfolio URL</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-violet-600 dark:text-violet-400 font-mono text-sm truncate">
                                        {publishStatus.public_url || 'URL not available'}
                                    </code>
                                    <button
                                        onClick={openInNewTab}
                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                        title="Open in new tab"
                                    >
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-zinc-800">
                                <span className="text-sm text-gray-600 dark:text-zinc-400">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${publishStatus.is_published
                                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                                    }`}>
                                    {publishStatus.is_published ? 'Published' : 'Not Published'}
                                </span>
                            </div>

                            {publishStatus.current_version && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-zinc-400">Current Version</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">v{publishStatus.current_version}</span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePublish}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
                                >
                                    {publishStatus.is_published ? 'Republish Changes' : 'Publish Now'}
                                </button>
                                {publishStatus.is_published && (
                                    <button
                                        onClick={handleUnpublish}
                                        className="py-3 px-4 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Unpublish
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Publishing State */}
                    {state === 'publishing' && (
                        <div className="flex flex-col items-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-600/20 border-t-violet-600 mb-4"></div>
                            <p className="text-gray-500 dark:text-zinc-400">Publishing your portfolio...</p>
                        </div>
                    )}

                    {/* Success State */}
                    {state === 'success' && successData && (
                        <div className="space-y-5">
                            <div className="flex flex-col items-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {successData.firstPublish ? 'Portfolio Published!' : 'Changes Published!'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                    Version {successData.version} is now live
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-violet-600 dark:text-violet-400 font-mono text-sm truncate">
                                        {successData.url}
                                    </code>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-2 rounded-lg transition-colors ${copied
                                                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                : 'hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500'
                                            }`}
                                        title="Copy URL"
                                    >
                                        {copied ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={openInNewTab}
                                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Live Portfolio
                            </button>
                        </div>
                    )}

                    {/* Error State */}
                    {state === 'error' && (
                        <div className="space-y-5">
                            <div className="flex flex-col items-center py-4">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Something went wrong</h3>
                                <p className="text-sm text-red-500 mt-1 text-center">{error}</p>
                            </div>

                            <button
                                onClick={loadPublishStatus}
                                className="w-full py-3 px-4 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
