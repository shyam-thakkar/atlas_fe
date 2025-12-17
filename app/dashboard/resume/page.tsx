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

    // 2️⃣ Upload Section: Enabled only if status ∈ {uploaded, completed, failed}
    // "uploaded" is debatable as "ready". 
    // Usually: if status is 'analyzing' or 'extracting' (processing), we disable upload.
    const isProcessing = ['uploaded', 'raw_extracting', 'raw_extracted', 'structure_extracting', 'structure_extracted'].includes(status);
    const canUpload = !isProcessing;

    return (
        <div className="w-full h-full p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto">

            {/* Header Section */}
            <div className="border-b border-gray-100 pb-6 ml-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Resume & Context</h1>
                <p className="mt-2 text-lg text-gray-500 max-w-3xl">
                    Upload your resume to establish the baseline for your AI portfolio.
                    We use this to extract your skills, experience, and projects.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Left Column: Upload */}
                <div className="lg:col-span-7 space-y-8">
                    <section className={!canUpload ? "opacity-50 pointer-events-none grayscale transition-all" : "transition-all"}>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs">1</span>
                                Upload Resume
                            </h2>
                            {!canUpload && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Processing in progress...</span>}
                        </div>
                        <div className="bg-white p-1 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
                            <ResumeUpload
                                onUploadSuccess={handleUploadSuccess}
                                hasExistingResume={!!resumeData}
                            />
                        </div>
                    </section>

                    {/* Benefits / Context (visual filler) */}
                    <section className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-xl p-6 border border-indigo-50/50">
                        <h3 className="font-semibold text-indigo-900 text-sm mb-3">Why this matters?</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-indigo-800">
                                <span className="text-indigo-400">✓</span>
                                Auto-detection of top technical skills
                            </li>
                            <li className="flex gap-3 text-sm text-indigo-800">
                                <span className="text-indigo-400">✓</span>
                                Timeline extraction for work history
                            </li>
                            <li className="flex gap-3 text-sm text-indigo-800">
                                <span className="text-indigo-400">✓</span>
                                Matching projects to job requirements
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Right Column: Preview & Status */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs">2</span>
                            Analysis Status
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="h-64 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
                    ) : resumeData ? (
                        <ResumeStatus resumeData={resumeData} {...pollingState} />
                    ) : (
                        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <span className="text-xl text-gray-400">📄</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">No Resume Uploaded</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">
                                Upload a resume on the left to see the analysis here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
