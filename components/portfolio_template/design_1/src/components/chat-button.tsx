'use client';

import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
    onClick: () => void;
    hasUnread?: boolean;
}

export function ChatButton({ onClick, hasUnread }: ChatButtonProps) {
    return (
        <div className="relative group">
            {/* Floating "Let's chat" text - Always visible with pulse animation */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 animate-fade-in">
                <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium animate-pulse-slow">
                    Let's chat
                    {/* Arrow pointing to button */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-zinc-900 dark:border-l-zinc-800"></div>
                    </div>
                </div>
            </div>

            {/* Chat Button */}
            <button
                onClick={onClick}
                className="relative group"
                aria-label="Open chat"
            >
                {/* Border with monochrome gradient */}
                <div className="relative p-[2px] rounded-full bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 dark:from-zinc-600 dark:via-zinc-500 dark:to-zinc-600 hover:from-zinc-600 hover:via-zinc-500 hover:to-zinc-600 dark:hover:from-zinc-500 dark:hover:via-zinc-400 dark:hover:to-zinc-500 transition-all duration-300">
                    <div className="bg-background rounded-full p-3">
                        <img
                            src="/profile.png"
                            alt="Chat"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    </div>
                </div>

                {/* Unread Badge */}
                {hasUnread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background" />
                )}

                {/* Hover effect - message icon overlay */}
                <div className="absolute inset-0 rounded-full bg-zinc-700/0 dark:bg-zinc-600/0 group-hover:bg-zinc-700/20 dark:group-hover:bg-zinc-600/20 transition-all duration-300 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </button>
        </div>
    );
}
