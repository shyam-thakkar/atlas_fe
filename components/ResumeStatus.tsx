import React, { useState } from 'react';
import { useResumePolling } from '@/hooks/useResumePolling';
import Link from 'next/link';
import { PortfolioReviewModal } from './PortfolioReviewModal';
import { ResumeResponse } from '@/lib/profile';

interface ResumeStatusProps {
    resumeData?: ResumeResponse | null;
}

export function ResumeStatus({ resumeData }: ResumeStatusProps) {
    // 1️⃣ Single Source of Truth: All props come from hook
    const { status, message, progress: backendProgress, can_review, can_publish, isFailed, retry, missing_items } = useResumePolling();
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Map status to progress for granular feedback
    const getProgress = () => {
        if (status === 'completed') return 100;
        switch (status) {
            case 'uploaded': return 10;
            case 'raw_extracting': return 25;
            case 'raw_extracted': return 40;
            case 'structure_extracting': return 60;
            case 'structure_extracted': return 80;
            case 'review_required': return 90;
            case 'completed': return 100;
            case 'failed': return 100;
            default: return backendProgress || 5; 
        }
    };

    const currentProgress = getProgress();

    // Helper for visual badges
    const getBadge = () => {
        if (status === 'completed') {
            return (
                <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Ready
                </span>
            );
        }
        if (status === 'review_required') {
            return (
                <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    Action Required
                </span>
            );
        }
        if (status === 'failed') {
            return (
                <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-100 rounded-full">
                    Failed
                </span>
            );
        }
        // Default: Processing (extracting, analyzing, etc.)
        return (
            <span className="px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                Processing
            </span>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Analysis Status</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">AI Pipeline</p>
                </div>
                {getBadge()}
            </div>

            {/* File Details (Transplanted from ResumePreview) */}
            {resumeData && (
                <div className="mb-6 bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                             <p className="text-sm font-semibold text-gray-900 truncate" title={resumeData.original_filename}>{resumeData.original_filename}</p>
                             <p className="text-xs text-gray-500">Uploaded {new Date(resumeData.uploaded_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <a
                        href={resumeData.file.startsWith('http') ? resumeData.file : `http://localhost:8000${resumeData.file.startsWith('/') ? '' : '/'}${resumeData.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                        title="Download Original Resume"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                     </a>
                </div>
            )}

            {/* Progress Bar */}
            <div className="relative mb-6">
                <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <span>Start</span>
                    <span>Finish</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ease-out relative ${isFailed ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                        style={{ width: `${currentProgress}%` }}
                    >
                        {!isFailed && status !== 'completed' && (
                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex items-start gap-4">
                {isFailed ? (
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                ) : status === 'completed' ? (
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                ) : (
                    <div className="p-2 bg-white border border-gray-200 shadow-sm rounded-lg relative">
                        <div className="w-5 h-5 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                )}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                        {isFailed ? "Pipeline Error" : "Current Step"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                {isFailed && (
                    <button
                        onClick={retry}
                        className="w-full py-3 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all"
                    >
                        Retry Processing
                    </button>
                )}

                {can_review && (
                    <button
                        onClick={() => setIsReviewOpen(true)}
                        className="w-full py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Review Extracted Data
                    </button>
                )}

                {can_publish && (
                    <Link href="/dashboard/portfolio/preview" className="block">
                        <button
                            className="w-full py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            View Live Portfolio
                        </button>
                    </Link>
                )}

                {missing_items && missing_items.length > 0 && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">Completion Required:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {missing_items.map((item, idx) => (
                                <li key={idx} className="text-xs text-amber-700">{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <PortfolioReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onFinish={() => {
                    setIsReviewOpen(false);
                    retry(); // Refresh status check
                }}
            />
        </div>
    );
}
