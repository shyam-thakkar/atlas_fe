'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { publish } from '@/lib/publish';
import { UsernameInfoResponse } from '@/types/publish';

interface UsernameSettingsProps {
    onUsernameChange?: (username: string) => void;
}

export function UsernameSettings({ onUsernameChange }: UsernameSettingsProps) {
    const [info, setInfo] = useState<UsernameInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Change username form
    const [isChanging, setIsChanging] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadUsernameInfo();
    }, []);

    const loadUsernameInfo = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await publish.getUsernameInfo();
            setInfo(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load username info');
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced username check
    const checkUsername = useCallback(async (value: string) => {
        if (value.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            setUsernameAvailable(null);
            return;
        }

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
        if (!newUsername || !isChanging) {
            setUsernameError(null);
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(() => {
            checkUsername(newUsername);
        }, 400);

        return () => clearTimeout(timer);
    }, [newUsername, isChanging, checkUsername]);

    const handleChangeUsername = async () => {
        if (!usernameAvailable || isCheckingUsername) return;

        setIsSubmitting(true);
        try {
            const result = await publish.changeUsername(newUsername);
            setInfo(prev => prev ? {
                ...prev,
                username: result.username,
                changes_used: prev.changes_used + 1,
                changes_remaining: result.changes_remaining,
                can_change: result.changes_remaining > 0,
            } : null);
            setIsChanging(false);
            setNewUsername('');
            onUsernameChange?.(result.username);
        } catch (err: any) {
            setUsernameError(err.message || 'Failed to change username');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelChange = () => {
        setIsChanging(false);
        setNewUsername('');
        setUsernameError(null);
        setUsernameAvailable(null);
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                <button
                    onClick={loadUsernameInfo}
                    className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-200"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!info) return null;

    const tierLabels: Record<string, string> = {
        beta: 'Beta',
        free: 'Free',
        pro: 'Pro',
        enterprise: 'Enterprise',
    };

    return (
        <div className="space-y-6">
            {/* Current Username */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Your Portfolio URL
                </label>
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                        {info.has_username ? (
                            <code className="font-mono text-sm text-violet-600 dark:text-violet-400 truncate">
                                {publish.getPreviewUrl(info.username!)}
                            </code>
                        ) : (
                            <span className="text-gray-400 dark:text-zinc-500 italic">No username claimed yet</span>
                        )}
                    </div>
                    
                    {info.has_username && info.can_change && !isChanging && (
                        <button
                            onClick={() => setIsChanging(true)}
                            className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Change
                        </button>
                    )}
                </div>
            </div>

            {/* Change Username Form */}
            {isChanging && (
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            New username
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                                    placeholder="newusername"
                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0 transition-colors ${
                                        usernameError 
                                            ? 'border-red-400 dark:border-red-500' 
                                            : usernameAvailable 
                                                ? 'border-green-400 dark:border-green-500' 
                                                : 'border-gray-200 dark:border-zinc-700 focus:border-violet-500'
                                    }`}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isCheckingUsername && (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-600/20 border-t-violet-600"></div>
                                    )}
                                    {!isCheckingUsername && usernameAvailable && (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {!isCheckingUsername && usernameError && newUsername && (
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-zinc-400 font-mono truncate max-w-[100px]">
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

                    <div className="flex gap-3">
                        <button
                            onClick={handleChangeUsername}
                            disabled={!usernameAvailable || isCheckingUsername || isSubmitting}
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                        >
                            {isSubmitting ? 'Changing...' : 'Confirm Change'}
                        </button>
                        <button
                            onClick={cancelChange}
                            className="py-2.5 px-4 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl font-medium text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Tier Info */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50">
                <div>
                    <span className="text-sm text-gray-500 dark:text-zinc-400">Username changes</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {info.changes_remaining === -1 
                            ? 'Unlimited' 
                            : `${info.changes_remaining} remaining`
                        }
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    info.tier === 'enterprise' 
                        ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400'
                        : info.tier === 'pro'
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400'
                }`}>
                    {tierLabels[info.tier] || info.tier}
                </span>
            </div>

            {!info.can_change && info.has_username && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                No username changes remaining
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                                Upgrade your plan to get more username changes.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
