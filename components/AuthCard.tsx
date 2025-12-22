import React from 'react';

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    description?: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
    return (
        <div className="w-full max-w-[440px] relative">
            {/* Subtle glow effect behind card - only visible in dark mode */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 dark:opacity-70 transition-opacity" />
            
            {/* Main card */}
            <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-zinc-800/50 p-8 sm:p-10 shadow-xl dark:shadow-2xl dark:shadow-black/20">
                {/* Gradient accent line at top - only visible in dark mode */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 dark:opacity-100" />
                
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
                    {description && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">{description}</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
