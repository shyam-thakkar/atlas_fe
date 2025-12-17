import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
}

export function AuthButton({ children, isLoading, className, ...props }: AuthButtonProps) {
    return (
        <button
            className={`
        w-full h-10 bg-gray-900 text-white text-sm font-medium rounded-md
        hover:bg-gray-800 transition-all duration-200 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
        disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center justify-center
        transform active:scale-[0.98]
        ${className || ''}
      `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
}
