'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Sparkles, Loader2, X, Wand2, Check, RotateCcw } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface AITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    section: 'bio_short' | 'bio_long' | 'headline' | 'experience' | 'project' | 'project_features' | 'project_challenges' | 'education';
    itemIndex?: number;
    onAIRewrite?: (newContent: string) => void;
    showDelay?: number; // ms before showing AI button (default 1000)
}

interface RewriteResponse {
    success: boolean;
    original: string;
    rewritten: string | string[];
    section: string;
}

export const AITextarea = forwardRef<HTMLTextAreaElement, AITextareaProps>(
    ({ section, itemIndex, onAIRewrite, showDelay = 1000, className, value, ...props }, ref) => {
        const [showAIButton, setShowAIButton] = useState(false);
        const [isOpen, setIsOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [instruction, setInstruction] = useState('');
        const [error, setError] = useState<string | null>(null);
        const [rewrittenContent, setRewrittenContent] = useState<string | null>(null);
        const [originalContent, setOriginalContent] = useState<string>('');

        const focusTimerRef = useRef<NodeJS.Timeout | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const popoverRef = useRef<HTMLDivElement>(null);

        const contentValue = typeof value === 'string' ? value : '';

        // Handle focus - show button after delay
        const handleFocus = () => {
            focusTimerRef.current = setTimeout(() => {
                if (contentValue.trim()) {
                    setShowAIButton(true);
                }
            }, showDelay);
        };

        // Handle blur - hide button (with delay for clicking)
        const handleBlur = (e: React.FocusEvent) => {
            if (focusTimerRef.current) {
                clearTimeout(focusTimerRef.current);
            }

            // Don't hide if clicking on AI button or popover
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (containerRef.current?.contains(relatedTarget)) {
                return;
            }

            // Delay hide to allow button clicks
            setTimeout(() => {
                if (!isOpen && rewrittenContent === null) {
                    setShowAIButton(false);
                }
            }, 200);
        };

        // Close popover on outside click
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (
                    popoverRef.current &&
                    !popoverRef.current.contains(event.target as Node) &&
                    !containerRef.current?.contains(event.target as Node)
                ) {
                    if (!rewrittenContent) {
                        setIsOpen(false);
                    }
                }
            }

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [isOpen, rewrittenContent]);

        const handleRewrite = async () => {
            if (!contentValue.trim()) {
                setError('Please add some content first');
                return;
            }

            setError(null);
            setIsLoading(true);
            setOriginalContent(contentValue);

            try {
                const response = await apiRequest<RewriteResponse>('/api/profile/rewrite/', {
                    method: 'POST',
                    body: {
                        section,
                        content: contentValue.trim(),
                        user_instruction: instruction.trim() || 'Rewrite this content to make it more professional and impactful',
                        item_index: itemIndex ?? 0
                    }
                });

                if (response.success && response.rewritten) {
                    const rewrittenValue = Array.isArray(response.rewritten)
                        ? JSON.stringify(response.rewritten)
                        : response.rewritten;
                    setRewrittenContent(rewrittenValue);
                    onAIRewrite?.(rewrittenValue);
                    setIsOpen(false);
                    setInstruction('');
                } else {
                    setError('Failed to rewrite content');
                }
            } catch (err) {
                console.error('Rewrite error:', err);
                setError(err instanceof Error ? err.message : 'Failed to rewrite content');
            } finally {
                setIsLoading(false);
            }
        };

        const handleAccept = () => {
            setRewrittenContent(null);
            setOriginalContent('');
            setShowAIButton(false);
        };

        const handleReject = () => {
            if (originalContent) {
                onAIRewrite?.(originalContent);
            }
            setRewrittenContent(null);
            setOriginalContent('');
            setShowAIButton(false);
        };

        const handleOpenPopover = () => {
            setInstruction('');
            setError(null);
            setIsOpen(true);
        };

        // Auto-resize logic
        const internalRef = useRef<HTMLTextAreaElement>(null);

        const adjustHeight = () => {
            const textarea = (internalRef.current || (ref as any)?.current);
            if (!textarea) return;
            // Reset height to auto to get correct scrollHeight
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        // Adjust height on value change
        useEffect(() => {
            adjustHeight();
        }, [value]);

        return (
            <div ref={containerRef} className="relative">
                <textarea
                    ref={(node) => {
                        // Maintain internal ref for resize and external ref
                        internalRef.current = node;
                        if (typeof ref === 'function') {
                            ref(node);
                        } else if (ref) {
                            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
                        }
                    }}
                    value={value}
                    className={`resize-none overflow-hidden ${className}`}
                    onFocus={(e) => {
                        handleFocus();
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        handleBlur(e);
                        props.onBlur?.(e);
                    }}
                    onChange={(e) => {
                        adjustHeight();
                        props.onChange?.(e);
                    }}
                    {...props}
                />

                {/* Contextual AI Button - appears below textarea after focus delay */}
                {(showAIButton || rewrittenContent !== null) && (
                    <div className="flex justify-end mt-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                        {rewrittenContent !== null ? (
                            // Accept/Reject buttons
                            <div className="inline-flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-1">
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
                                               text-gray-600 dark:text-zinc-400
                                               hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400
                                               transition-all duration-200"
                                    title="Reject and revert"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAccept}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
                                               bg-green-500 text-white
                                               hover:bg-green-600
                                               transition-all duration-200"
                                    title="Accept changes"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept</span>
                                </button>
                            </div>
                        ) : (
                            // AI Rewrite button
                            <button
                                type="button"
                                onClick={handleOpenPopover}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg
                                           bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400
                                           border border-violet-200 dark:border-violet-800
                                           hover:from-violet-500/20 hover:to-purple-500/20
                                           transition-all duration-200"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                )}
                                <span>Improve with AI</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Popover */}
                {isOpen && (
                    <div
                        ref={popoverRef}
                        className="absolute z-50 right-0 mt-2 w-72 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 p-4 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                                    <Wand2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">AI Rewrite</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-zinc-400 mb-1.5">
                                    Custom instructions (optional)
                                </label>
                                <textarea
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                    placeholder="e.g., Make it more concise..."
                                    className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700/50 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all resize-none placeholder:text-gray-400"
                                    rows={2}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRewrite}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Rewriting...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Rewrite
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-gray-400 dark:text-zinc-500 text-center">
                                Leave empty for smart auto-rewrite
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

AITextarea.displayName = 'AITextarea';
