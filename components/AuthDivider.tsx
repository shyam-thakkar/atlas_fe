import React from 'react';

export function AuthDivider() {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-zinc-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className="bg-white dark:bg-zinc-900 px-3 text-gray-400 dark:text-zinc-500 font-medium">Or</span>
            </div>
        </div>
    );
}

