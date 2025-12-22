import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
}

export function AuthButton({ children, isLoading, className, ...props }: AuthButtonProps) {
    return (
        <button
            className={`
                w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-lg
                hover:from-violet-500 hover:to-indigo-500 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-violet-500
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-indigo-600
                flex items-center justify-center
                transform active:scale-[0.98]
                shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                ${className || ''}
            `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
}
