'use client';

import React from 'react';
import { ResumeResponse } from '@/lib/profile';

interface ResumePreviewProps {
    data: ResumeResponse;
}

export function ResumePreview({ data }: ResumePreviewProps) {
    const isProcessed = !!data.extracted_text;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Card Header with Status */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Current Resume</h3>
                        <p className="text-xs text-gray-500">Uploaded {new Date(data.uploaded_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className={`
             inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
             ${isProcessed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
        `}>
                    {isProcessed ? (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            AI Ready
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processing
                        </>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-5">
                <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">File Details</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="p-1.5 bg-gray-200 rounded text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                            </span>
                            <span className="text-sm font-medium text-gray-900 truncate" title={data.original_filename}>{data.original_filename}</span>
                        </div>
                        <a
                            href={data.file.startsWith('http') ? data.file : `${process.env.NEXT_PUBLIC_API_URL}${data.file.startsWith('/') ? '' : '/'}${data.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            title="Download Original Resume"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </a>
                    </div>
                </div>

                {/* Extracted content / status */}
                <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">AI Analysis</label>

                    {isProcessed ? (
                        <div className="relative">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 h-48 overflow-hidden relative">
                                <div className="font-mono text-xs text-gray-600 leading-relaxed opacity-80 whitespace-pre-wrap">
                                    {data.extracted_text}
                                </div>
                                {/* Fade out effect at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-medium">Skills detected</span>
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-100 font-medium">Experience parsed</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm mb-2 text-indigo-500">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">Analyzing document structure...</p>
                            <p className="text-xs text-gray-500 mt-1">This usually takes a few seconds.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
