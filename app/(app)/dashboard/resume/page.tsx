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
        <div className="w-full h-full p-8 lg:p-12 space-y-10 animate-in fade-in duration-500 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">

            {/* Header Section - Minimal */}
            <header className="max-w-4xl">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Resume & Context
                </h1>
                <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                    Upload your resume to establish the foundation for your AI-generated portfolio.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                {/* Left Column: Upload */}
                <div className="lg:col-span-7 space-y-8">
                    <section className={!canUpload ? "opacity-40 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-medium">1</span>
                            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                                Upload Resume
                            </h2>
                            {!canUpload && (
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                    Processing...
                                </span>
                            )}
                        </div>
                        <ResumeUpload
                            onUploadSuccess={handleUploadSuccess}
                            hasExistingResume={!!resumeData}
                        />
                    </section>

                    {/* Why this matters - Muted secondary info */}
                    <section className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                        <details className="group">
                            <summary className="cursor-pointer text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide flex items-center gap-2 select-none">
                                <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Why this matters
                            </summary>
                            <ul className="mt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="w-1 h-1 mt-2 bg-zinc-400 dark:bg-zinc-600 rounded-full flex-shrink-0"></span>
                                    Auto-detection of technical skills and expertise
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1 h-1 mt-2 bg-zinc-400 dark:bg-zinc-600 rounded-full flex-shrink-0"></span>
                                    Timeline extraction for work history
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1 h-1 mt-2 bg-zinc-400 dark:bg-zinc-600 rounded-full flex-shrink-0"></span>
                                    Project matching for portfolio generation
                                </li>
                            </ul>
                        </details>
                    </section>
                </div>

                {/* Right Column: Status */}
                <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">2</span>
                        <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                            Analysis Status
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                    ) : resumeData ? (
                        <ResumeStatus resumeData={resumeData} {...pollingState} />
                    ) : (
                        <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="mx-auto w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No resume uploaded</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                Upload a resume to begin analysis
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
