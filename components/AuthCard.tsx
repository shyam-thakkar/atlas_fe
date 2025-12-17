import React from 'react';

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    description?: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
    return (
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-200/60 p-8 sm:p-10">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
                {description && (
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}
