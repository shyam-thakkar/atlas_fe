'use client';

import React, { useEffect, useState } from 'react';
import { profile, ResumeResponse } from '@/lib/profile';
import { ResumeUpload } from '@/components/ResumeUpload';

import { ResumeStatus } from '@/components/ResumeStatus';
import { useResumePolling } from '@/hooks/useResumePolling';

export default function ResumePage() {
    const [resumeData, setResumeData] = useState<ResumeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pollingState = useResumePolling();
    const { status, reset } = pollingState;

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const data = await profile.getResume();
                if (data && data.original_filename) {
                    setResumeData(data);
                }
            } catch (e) {
                // Fail silently
            } finally {
                setIsLoading(false);
            }
        };

        fetchResume();
    }, []);

    const handleUploadSuccess = (data: ResumeResponse) => {
        setResumeData(data);
        reset('uploaded'); // Optimistic update
    };

    const isProcessing = ['uploaded', 'raw_extracting', 'raw_extracted', 'structure_extracting', 'structure_extracted'].includes(status);
    const canUpload = !isProcessing;

    return (
        <div className="w-full h-full p-8 lg:p-12 animate-in fade-in duration-500 overflow-y-auto bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header Section */}
                <header className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Resume & Context
                    </h1>
                    <p className="mt-2 text-base text-gray-500 dark:text-zinc-400">
                        Upload your resume to establish the foundation for your AI-generated portfolio.
                    </p>
                </header>

                {/* Upload Section Card */}
                <div className={`relative overflow-hidden bg-white dark:bg-zinc-900/80 rounded-2xl border border-gray-200 dark:border-zinc-800/50 p-6 shadow-sm dark:shadow-2xl transition-all duration-300 ${!canUpload ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 dark:opacity-100" />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">1</span>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            Upload Resume
                        </h2>
                        {!canUpload && (
                            <span className="text-xs text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-1 rounded-full font-medium">
                                Processing...
                            </span>
                        )}
                    </div>
                    <ResumeUpload
                        onUploadSuccess={handleUploadSuccess}
                        hasExistingResume={!!resumeData}
                    />
                </div>

                {/* Status Section Card */}
                <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 rounded-2xl border border-gray-200 dark:border-zinc-800/50 p-6 shadow-sm dark:shadow-2xl">
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 dark:opacity-100" />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">2</span>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            Analysis Status
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                    ) : resumeData ? (
                        <ResumeStatus resumeData={resumeData} {...pollingState} />
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-8 text-center bg-gray-50 dark:bg-zinc-800/50">
                            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-700 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">No resume uploaded</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                                Upload a resume to begin analysis
                            </p>
                        </div>
                    )}
                </div>

                {/* Why this matters - collapsible */}
                <details className="group bg-white dark:bg-zinc-900/60 rounded-2xl border border-gray-200 dark:border-zinc-800/50 p-5">
                    <summary className="cursor-pointer text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-2 select-none">
                        <svg className="w-4 h-4 transition-transform group-open:rotate-90 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Why this matters
                    </summary>
                    <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400 pl-6">
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 mt-1.5 bg-violet-500 dark:bg-violet-400 rounded-full flex-shrink-0"></span>
                            Auto-detection of technical skills and expertise
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 mt-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex-shrink-0"></span>
                            Timeline extraction for work history
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 mt-1.5 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0"></span>
                            Project matching for portfolio generation
                        </li>
                    </ul>
                </details>
            </div>
        </div>
    );
}


