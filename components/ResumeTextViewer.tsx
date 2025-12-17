import React, { useState, useEffect } from 'react';
import { profile } from '@/lib/profile';

interface ResumeTextViewerProps {
    status: string | null;
}

export function ResumeTextViewer({ status }: ResumeTextViewerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Show button only if status is one of the following
    const showButton = ['extracted', 'analyzing', 'generated'].includes(status || '');

    const handleOpen = async () => {
        setIsOpen(true);
        // Fetch if we haven't already
        if (!text && !loading) {
            setLoading(true);
            setError(null);
            try {
                const response = await profile.getExtractedText();
                setText(response.extracted_text || 'No text extracted successfully.');
            } catch (err) {
                setError('Failed to load extracted text');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    if (!showButton) return null;

    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="text-xs font-medium text-gray-500 underline hover:text-gray-800 transition-colors"
            >
                View Extracted Text
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 border border-gray-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Extracted Resume Text</h3>
                        <p className="text-sm text-gray-500">Raw text content extracted from your document.</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-3" />
                            <span className="text-sm">Fetching raw text...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-red-500">
                            <svg className="w-10 h-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="font-medium">{error}</p>
                            <button onClick={handleOpen} className="mt-4 text-sm text-black underline">Try Again</button>
                        </div>
                    ) : (
                        <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm leading-relaxed overflow-x-auto">
                            {text}
                        </pre>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
