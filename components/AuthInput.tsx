'use client';

import React, { useState } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function AuthInput({ label, error, type = 'text', className, ...props }: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="flex flex-col gap-2 mb-4 group">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 select-none">
                {label}
            </label>
            <div className="relative">
                <input
                    type={isPassword && showPassword ? 'text' : type}
                    className={`
                        w-full h-11 px-4 rounded-lg border text-sm transition-all duration-300
                        bg-white dark:bg-zinc-800/50
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400 dark:placeholder:text-zinc-500
                        focus:outline-none focus:ring-2 
                        focus:ring-violet-500/20 dark:focus:ring-violet-500/30
                        focus:border-violet-500 dark:focus:border-violet-500/50
                        focus:bg-white dark:focus:bg-zinc-800
                        hover:border-gray-400 dark:hover:border-zinc-600
                        hover:bg-gray-50 dark:hover:bg-zinc-800/70
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error 
                            ? 'border-red-500 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 dark:border-zinc-700/50'}
                        ${className || ''}
                    `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 focus:outline-none p-1 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5 animate-in slide-in-from-top-1 fade-in duration-200">{error}</p>
            )}
        </div>
    );
}
