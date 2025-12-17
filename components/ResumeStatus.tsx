import React, { useState } from 'react';
import { useResumePolling } from '@/hooks/useResumePolling';
import Link from 'next/link';
import { ResumeTextViewer } from './ResumeTextViewer';
import { PortfolioReviewModal } from './PortfolioReviewModal';

export function ResumeStatus() {
    const { status, message, isComplete, isFailed, retry } = useResumePolling();
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Map status to progress for a visual bar (approximate)

    const getProgress = () => {
        switch (status) {
            case 'uploaded': return 10;
            case 'extracting': return 30;
            case 'extracted': return 50;
            case 'analyzing': return 75;
            case 'generated': return 100;
            case 'failed': return 100; // Full bar but red
            default: return 5;
        }
    };

    const progress = getProgress();

    if (!status && !isFailed) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-500">Connecting...</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume Processing</h3>
                {isComplete && (
                  <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Completed
                  </span>
                )}
                {isFailed && (
                   <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                     Failed
                   </span>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div 
                    className={`h-full transition-all duration-500 ease-out ${isFailed ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Status Message */}
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    {!isComplete && !isFailed && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    )}
                    <p className={`text-sm font-medium ${isFailed ? 'text-red-600' : 'text-gray-700'}`}>
                        {message}
                    </p>
                 </div>
                 {/* Raw Text Viewer Trigger (Conditional) */}
                 <ResumeTextViewer status={status} />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                {isFailed && (
                    <button 
                        onClick={retry}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                )}
                
                {isComplete && (
                    <div className="w-full">
                         <button 
                            onClick={() => setIsReviewOpen(true)}
                            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                            Review Extracted Portfolio
                        </button>
                    </div>
                )}
            </div>

            <PortfolioReviewModal 
                isOpen={isReviewOpen} 
                onClose={() => setIsReviewOpen(false)} 
            />
        </div>
    );
}
