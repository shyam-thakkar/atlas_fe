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

  return (
    <div className="w-full group">
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={` 
          relative overflow-hidden rounded-xl border border-dashed transition-all duration-300 ease-out cursor-pointer
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01] shadow-lg shadow-indigo-100' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50 hover:shadow-sm'
          }
          ${isUploading ? 'opacity-80 pointer-events-none bg-gray-50' : 'bg-white'}
          p-8 flex flex-col items-center justify-center text-center min-h-[240px]
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.docx"
        />

        {/* Decorative background blob */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-opacity duration-300 ${isUploading ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />

        <div className={`
            w-16 h-16 mb-6 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-indigo-100 text-indigo-600 rotate-3 scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 group-hover:scale-105'}
        `}>
             {isUploading ? (
                  <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
             ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
             )}
        </div>

        <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-900">
               {isUploading ? 'Uploading & Analyzing...' : (hasExistingResume ? 'Replace existing resume' : 'Upload your resume')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
               {isUploading 
                 ? 'We are securing your file and extracting key details.' 
                 : 'Drag and drop your PDF or DOCX file here, or click to browse.'}
            </p>
        </div>

        {!isUploading && (
             <div className="mt-8 flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    PDF / DOCX
                 </span>
                 <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                 <span>Max 5MB</span>
             </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
