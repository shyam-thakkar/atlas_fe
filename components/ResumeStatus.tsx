import React, { useState } from 'react';
import Link from 'next/link';
import { PortfolioReviewModal } from './PortfolioReviewModal';
import { ResumeResponse } from '@/lib/profile';
import { PipelineStatusEnum } from '@/types/portfolio';

interface ResumeStatusProps {
    resumeData?: ResumeResponse | null;
    status: PipelineStatusEnum;
    message: string;
    progress: number;
    can_review: boolean;
    can_publish: boolean;
    isFailed: boolean;
    retry: () => void;
    missing_items?: string[];
}

export function ResumeStatus({
    resumeData,
    status,
    message,
    progress: backendProgress,
    can_review,
    can_publish,
    isFailed,
    retry,
    missing_items
}: ResumeStatusProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Map status to progress
    const getProgress = () => {
        switch (status) {
            case 'uploaded': return 10;
            case 'raw_extracting': return 25;
            case 'raw_extracted': return 40;
            case 'structure_extracting': return 60;
            case 'structure_extracted': return 80;
            case 'review_required': return 90;
            case 'failed': return 100;
            case 'idle': return 0;
            default: return backendProgress || 5;
        }
    };

    const currentProgress = getProgress();

    // Status indicator
    const getStatusIndicator = () => {
        if (status === 'completed') {
            return (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Ready</span>
                </div>
            );
        }
        if (status === 'review_required') {
            return (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Review needed</span>
                </div>
            );
        }
        if (status === 'failed') {
            return (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Failed</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Processing</span>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">AI Analysis</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Pipeline status</p>
                </div>
                {getStatusIndicator()}
            </div>

            {/* File info */}
            {resumeData && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 truncate">{resumeData.original_filename}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">{new Date(resumeData.uploaded_at).toLocaleDateString()}</p>
                    </div>
                    <a
                        href={resumeData.file.startsWith('http') ? resumeData.file : `${process.env.NEXT_PUBLIC_API_URL}${resumeData.file.startsWith('/') ? '' : '/'}${resumeData.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
                        title="Download"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>
                </div>
            )}

            {/* Progress bar */}
            <div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ease-out ${isFailed ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}
                        style={{ width: `${currentProgress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">{message}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                {isFailed && (
                    <button
                        onClick={retry}
                        className="w-full py-2.5 px-4 text-sm font-medium text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Retry
                    </button>
                )}

                {/* Primary CTA */}
                {can_review && (
                    <button
                        onClick={() => setIsReviewOpen(true)}
                        className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                    >
                        Review extracted data
                    </button>
                )}

                {/* Secondary CTA */}
                {can_publish && (
                    <Link href="/dashboard/portfolio/preview" className="block">
                        <button className="w-full py-2.5 px-4 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10">
                            View portfolio →
                        </button>
                    </Link>
                )}

                {missing_items && missing_items.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">Required fields:</p>
                        <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5">
                            {missing_items.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {can_publish && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 text-center">
                    You can edit all data before publishing
                </p>
            )}

            <PortfolioReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onFinish={() => {
                    setIsReviewOpen(false);
                    retry();
                }}
            />
        </div>
    );
}
