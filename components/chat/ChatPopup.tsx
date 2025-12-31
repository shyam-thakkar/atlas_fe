'use client';

import { useRef, useEffect, useState } from 'react';
import { X, Send, Loader2, Trash2, WifiOff, History as HistoryIcon, Bot } from 'lucide-react';
import { ChatMessageComponent } from './ChatMessage';
import type { ChatMessage, ConnectionStatus } from '@/types/chat';

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
    title?: string;
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
    title = 'AI Assistant',
}: ChatPopupProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container || !isOpen) return;

        const handleScroll = () => {
            if (container.scrollTop < 50 && hasMoreHistory && !isLoadingHistory) {
                const previousScrollHeight = container.scrollHeight;
                onLoadMore();
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

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
                onClick={onClose}
            />

            {/* Chat Modal */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] h-[85vh] max-h-[700px] z-[101] flex flex-col animate-slide-in overflow-hidden rounded-2xl shadow-2xl
                           bg-white dark:bg-zinc-900
                           border border-zinc-200 dark:border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 
                                bg-zinc-50 dark:bg-zinc-900
                                border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-white">{title}</span>
                        {connectionStatus === 'connected' && (
                            <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        )}
                        {connectionStatus === 'connecting' && (
                            <span className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Connecting
                            </span>
                        )}
                        {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
                            <span className="flex items-center gap-1.5 text-[10px] text-red-600 dark:text-red-400 font-medium">
                                <WifiOff className="w-3 h-3" />
                                Offline
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button
                            onClick={onClearChat}
                            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                            title="Clear chat"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Status Banner */}
                {connectionStatus !== 'connected' && (
                    <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                        {connectionStatus === 'connecting' && 'Connecting to server...'}
                        {connectionStatus === 'disconnected' && 'Disconnected. Attempting to reconnect...'}
                        {connectionStatus === 'error' && 'Connection error. Please try again.'}
                    </div>
                )}

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4
                               bg-zinc-100 dark:bg-zinc-950"
                >
                    {isLoadingHistory && (
                        <div className="flex justify-center py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                        </div>
                    )}

                    {hasMoreHistory && !isLoadingHistory && (
                        <div className="flex justify-center py-2 mb-3">
                            <button
                                onClick={onLoadMore}
                                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 shadow-sm hover:shadow transition-all"
                            >
                                <HistoryIcon className="w-3 h-3" />
                                Load older messages
                            </button>
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-8">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-4">
                                <Bot className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-base font-medium text-zinc-900 dark:text-white mb-1">How can I help?</p>
                            <p className="text-sm text-zinc-500">Ask me anything about my work, skills, or experience.</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => {
                                // Find if this is the latest AI message
                                const isLatestAI = !message.isUser && 
                                    index === messages.length - 1 || 
                                    (index === messages.length - 2 && messages[messages.length - 1]?.isUser);
                                return (
                                    <ChatMessageComponent 
                                        key={message.id} 
                                        message={message} 
                                        isLatest={isLatestAI}
                                    />
                                );
                            })}
                            {isTyping && (
                                <div className="flex gap-2.5 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="p-3 border-t border-zinc-200 dark:border-zinc-800
                               bg-white dark:bg-zinc-900"
                >
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={connectionStatus !== 'connected'}
                            className="flex-1 px-4 py-2.5 text-sm rounded-xl 
                                       bg-zinc-100 dark:bg-zinc-800
                                       border border-zinc-200 dark:border-zinc-700
                                       text-zinc-900 dark:text-white 
                                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500 
                                       focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 focus:border-transparent
                                       disabled:opacity-50 transition-all"
                            maxLength={1000}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || connectionStatus !== 'connected'}
                            className="p-2.5 rounded-xl 
                                       bg-zinc-900 dark:bg-zinc-100
                                       text-white dark:text-zinc-900
                                       hover:bg-zinc-800 dark:hover:bg-white
                                       disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
