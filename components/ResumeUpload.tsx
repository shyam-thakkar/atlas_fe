'use client';

import React, { useRef, useState } from 'react';
import { profile, ResumeResponse } from '@/lib/profile';

interface ResumeUploadProps {
  onUploadSuccess: (data: ResumeResponse) => void;
  hasExistingResume?: boolean;
}

export function ResumeUpload({ onUploadSuccess, hasExistingResume }: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!isUploading) {
        fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
      <div className="w-full">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Resume uploaded</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Your resume is ready for analysis</p>
            </div>
            <button
              onClick={handleClick}
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Replace
            </button>
          </div>
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
    <div className="w-full">
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-xl border transition-all duration-200 ease-out cursor-pointer
          ${isDragging 
            ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
            : 'border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900'
          }
          ${isUploading ? 'opacity-60 pointer-events-none' : ''}
          p-8 flex flex-col items-center justify-center text-center min-h-[180px]
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
          w-12 h-12 mb-4 rounded-xl flex items-center justify-center transition-all duration-200
          ${isDragging 
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
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
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {isUploading ? 'Uploading...' : 'Drop your resume here'}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {isUploading ? 'Extracting content' : 'PDF or DOCX, up to 5MB'}
          </p>
        </div>
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
