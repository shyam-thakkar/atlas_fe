'use client';

import React, { useRef, useState } from 'react';
import { profile, ResumeResponse } from '@/lib/profile';
import { useAuth } from '@/context/AuthContext';

interface ResumeUploadProps {
  onUploadSuccess: (data: ResumeResponse) => void;
  hasExistingResume?: boolean;
}

export function ResumeUpload({ onUploadSuccess, hasExistingResume }: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getTierLimits = (tier?: string) => {
    switch (tier) {
      case 'free': return 5;
      case 'pro': return 50;
      case 'enterprise': return Infinity;
      case 'beta':
      default: return 5;
    }
  };

  const limit = getTierLimits(user?.user_tier || user?.tier);
  const usage = user?.resume_process_count || 0;
  const isLimitReached = usage >= limit;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleClick = () => {
    if (!isUploading && !isLimitReached) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isLimitReached) return;
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const data = await profile.uploadResume(file);
      onUploadSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Completed state when resume exists
  if (hasExistingResume && !isUploading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-end text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/30 text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="capitalize text-violet-600 dark:text-violet-400">
              {(user?.user_tier || user?.tier || 'Beta')} Plan
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span>
              Resume Processed: <span className={isLimitReached ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}>{usage} / {limit === Infinity ? '∞' : limit}</span>
            </span>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/60 p-6 transition-all duration-200">
          <div className={`flex items-center gap-4 transition-all duration-300 ${isLimitReached ? 'blur-[2px] opacity-40 select-none pointer-events-none' : ''}`}>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Resume uploaded</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Your resume is ready for analysis</p>
            </div>
            <button
              onClick={handleClick}
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 border border-transparent hover:border-violet-200 dark:hover:border-violet-500/20"
            >
              Replace
            </button>
          </div>

          {/* Upgrade Overlay */}
          {isLimitReached && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-black/5 backdrop-blur-[1px] animate-in fade-in duration-500">
               <button 
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => {/* Handle upgrade route */}}
               >
                 Upgrade Plan
               </button>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx"
        />
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end text-[10px] sm:text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/30 text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="capitalize text-violet-600 dark:text-violet-400">
            {(user?.user_tier || user?.tier || 'Beta')} Plan
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span>
            Resume Processed: <span className={isLimitReached ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}>{usage} / {limit === Infinity ? '∞' : limit}</span>
          </span>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-2xl">
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-2xl border-2 transition-all duration-500 ease-out
            ${isDragging
              ? 'border-violet-400 dark:border-violet-500 bg-violet-50/50 dark:bg-violet-950/20'
              : isLimitReached
                ? 'border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 cursor-default'
                : 'border-dashed border-gray-300 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500/50 bg-white dark:bg-zinc-900/60 cursor-pointer'
            }
            ${isUploading ? 'opacity-60 pointer-events-none' : ''}
            ${isLimitReached ? 'blur-[3px] opacity-40 select-none pointer-events-none' : ''}
            p-8 flex flex-col items-center justify-center text-center min-h-[220px]
          `}
        >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx"
        />

        {/* Upload indicator line */}
        {isUploading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse rounded-t-xl" />
        )}

        <div className={`
          w-14 h-14 mb-4 rounded-2xl flex items-center justify-center transition-all duration-200
          ${isDragging
            ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400'
            : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
          }
        `}>
          {isUploading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
            {isUploading ? 'Uploading...' : isLimitReached ? 'Processing Limit Reached' : 'Drop your resume here'}
          </p>
          <p className="text-xs text-gray-400 dark:text-zinc-500">
            {isUploading ? 'Extracting content' : isLimitReached ? 'Upgrade to process more resumes' : 'or click to browse • PDF or DOCX, up to 5MB'}
          </p>
        </div>
        </div>

        {/* Upgrade Overlay */}
        {isLimitReached && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 dark:bg-black/5 backdrop-blur-[2px] animate-in fade-in zoom-in duration-500">
            <div className="bg-white/90 dark:bg-zinc-900/90 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col items-center gap-4 max-w-[280px]">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-900 dark:text-white">Limit Reached</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Upgrade to process unlimited resumes and unlock pro features.</p>
              </div>
              <button 
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {/* Handle upgrade route */}}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
