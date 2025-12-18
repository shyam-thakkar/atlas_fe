'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, WifiOff, Loader2, Trash2 } from 'lucide-react';
import { ChatMessageComponent } from './chat-message';
import type { ChatMessage, ConnectionStatus } from '@/lib/chat-types';

interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    connectionStatus: ConnectionStatus;
    isTyping: boolean;
    onClearChat: () => void;
    onLoadMore: () => void;
    hasMoreHistory: boolean;
    isLoadingHistory: boolean;
}

export function ChatPopup({
    isOpen,
    onClose,
    messages,
    onSendMessage,
    connectionStatus,
    isTyping,
    onClearChat,
    onLoadMore,
    hasMoreHistory,
    isLoadingHistory,
}: ChatPopupProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    // Focus input when popup opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle scroll to top for loading more history
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container || !isOpen) return;

        const handleScroll = () => {
            // If user scrolls near the top (within 50px), load more
            if (container.scrollTop < 50 && hasMoreHistory && !isLoadingHistory) {
                const previousScrollHeight = container.scrollHeight;
                onLoadMore();

                // After loading, maintain scroll position
                setTimeout(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight;
                }, 100);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [isOpen, hasMoreHistory, isLoadingHistory, onLoadMore]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && connectionStatus === 'connected') {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleClearChat = () => {
        onClearChat();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with blur - always visible */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
                onClick={onClose}
            />

            {/* Chat Popup - Centered Modal */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[550px] h-[90vh] max-h-[750px] rounded-lg shadow-2xl z-[101] flex flex-col bg-background border border-border animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-800 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="text-white font-semibold text-sm tracking-wide">SHYAM-DEV-1</div>
                        {/* Connection Status */}
                        {connectionStatus === 'connected' && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] text-emerald-500 font-medium">Online</span>
                            </div>
                        )}
                        {connectionStatus === 'connecting' && (
                            <div className="flex items-center gap-1.5">
                                <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />
                                <span className="text-[10px] text-yellow-500 font-medium">Connecting...</span>
                            </div>
                        )}
                        {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
                            <div className="flex items-center gap-1.5">
                                <WifiOff className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] text-red-500 font-medium">Offline</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Clear Chat Button */}
                        <button
                            onClick={handleClearChat}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                            title="Clear chat history"
                        >
                            <Trash2 className="w-4 h-4 text-zinc-300 hover:text-white transition-colors" />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                            aria-label="Close chat"
                        >
                            <X className="w-4 h-4 text-zinc-300 hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Connection Status Banner */}
                {connectionStatus !== 'connected' && (
                    <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {connectionStatus === 'connecting' && 'Connecting...'}
                            {connectionStatus === 'disconnected' && 'Disconnected. Attempting to reconnect...'}
                            {connectionStatus === 'error' && 'Connection error. Please try again later.'}
                        </p>
                    </div>
                )}

                {/* Messages Area */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-4">
                    {/* Loading Indicator for History */}
                    {isLoadingHistory && (
                        <div className="flex justify-center py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-16 h-16 rounded-full bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center mb-4">
                                <span className="text-3xl">👋</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                Welcome to the chat!
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Ask me anything about Shyam's experience, projects, or skills.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <ChatMessageComponent key={message.id} message={message} />
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex gap-3 mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <span className="text-white text-sm">🤖</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-muted">
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex gap-2.5 items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={connectionStatus !== 'connected'}
                            className="flex-1 px-4 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            maxLength={1000}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || connectionStatus !== 'connected'}
                            className="p-2.5 rounded-full bg-zinc-900 dark:bg-zinc-700 text-white hover:bg-zinc-800 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                            aria-label="Send message"
                        >
                            <Send className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
