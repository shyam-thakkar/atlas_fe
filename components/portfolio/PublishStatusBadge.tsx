'use client';

import React, { useState, useEffect } from 'react';
import { publish } from '@/lib/publish';
import { PublishStatusResponse } from '@/types/publish';

interface PublishStatusBadgeProps {
    onClick?: () => void;
    showUrl?: boolean;
    compact?: boolean;
}

export function PublishStatusBadge({ onClick, showUrl = false, compact = false }: PublishStatusBadgeProps) {
    const [status, setStatus] = useState<PublishStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const data = await publish.getPublishStatus();
            setStatus(data);
        } catch (err) {
            console.error('Failed to load publish status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`animate-pulse bg-gray-200 dark:bg-zinc-700 rounded-lg ${compact ? 'h-6 w-16' : 'h-8 w-24'}`} />
        );
    }

    if (!status) {
        return null;
    }

    const isPublished = status.is_published;

    if (compact) {
        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${isPublished
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
                {isPublished ? 'Live' : 'Draft'}
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${isPublished
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/40'
                    : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                }`}
        >
            {/* Status indicator */}
            <div className={`w-2.5 h-2.5 rounded-full ${isPublished
                    ? 'bg-green-500 shadow-sm shadow-green-500/50'
                    : 'bg-gray-400 dark:bg-zinc-500'
                }`} />

            <div className="flex flex-col items-start">
                <span className={`text-sm font-semibold ${isPublished
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-gray-700 dark:text-zinc-300'
                    }`}>
                    {isPublished ? 'Published' : 'Not Published'}
                </span>

                {showUrl && isPublished && status.public_url && (
                    <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono truncate max-w-[200px]">
                        {status.public_url.replace('https://', '')}
                    </span>
                )}
            </div>

            {/* Arrow icon */}
            <svg
                className="w-4 h-4 text-gray-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}

interface PublishButtonProps {
    onClick?: () => void;
    className?: string;
}

export function PublishButton({ onClick, className = '' }: PublishButtonProps) {
    const [status, setStatus] = useState<PublishStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const data = await publish.getPublishStatus();
            setStatus(data);
        } catch (err) {
            console.error('Failed to load publish status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const isPublished = status?.is_published;

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isPublished
                    ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
                } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {/* Globe/Rocket icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            {isLoading ? 'Loading...' : isPublished ? 'Republish' : 'Publish'}

            {/* Published indicator dot */}
            {isPublished && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
            )}
        </button>
    );
}
