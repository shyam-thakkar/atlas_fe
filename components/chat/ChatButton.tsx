'use client';

import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
    onClick: () => void;
    hasUnread?: boolean;
    profileImage?: string;
}

export function ChatButton({ onClick, hasUnread, profileImage }: ChatButtonProps) {
    return (
        <div className="relative group">
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap animate-pulse-slow">
                    Let&apos;s chat
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-zinc-900 dark:border-l-zinc-800" />
                    </div>
                </div>
            </div>

            {/* Button */}
            <button
                onClick={onClick}
                className="relative group transition-transform hover:scale-105 active:scale-95"
                aria-label="Open chat"
            >
                {/* Outer glow effect */}
                <div className="absolute inset-0 rounded-full bg-zinc-400/20 dark:bg-zinc-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Button ring */}
                <div className="relative p-[2px] rounded-full bg-gradient-to-br from-zinc-300 via-zinc-200 to-zinc-300 dark:from-zinc-600 dark:via-zinc-500 dark:to-zinc-600 shadow-lg">
                    <div className="bg-white dark:bg-zinc-900 rounded-full p-2">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Chat"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Unread indicator */}
                {hasUnread && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" />
                )}
            </button>
        </div>
    );
}
