'use client';

import { useAuth } from '@/context/AuthContext';
import { chatService } from '@/lib/chat-service';
import { CHAT_CONFIG } from '@/lib/chat-config';
import { ChatMessageComponent } from '@/components/chat/ChatMessage';
import { Send, Loader2, Bot, Trash2, MessageSquare, Sparkles, Users, Shield, Zap, Brain, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ConnectionStatus, type ChatMessage } from '@/types/chat';

export default function ChatPage() {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
    const [isTyping, setIsTyping] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRebuildingRAG, setIsRebuildingRAG] = useState(false);
    const [ragRebuildSuccess, setRagRebuildSuccess] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const unsubscribeMessage = chatService.onMessage((message) => {
                    setMessages((prev) => {
                        const exists = prev.some((m) => m.id === message.id);
                        if (exists) {
                            return prev.map((m) => (m.id === message.id ? message : m));
                        }
                        return [...prev, message];
                    });
                });

                const unsubscribeStatus = chatService.onStatusChange((status) => {
                    setConnectionStatus(status);
                });

                const unsubscribeTyping = chatService.onTypingChange((typing) => {
                    setIsTyping(typing);
                });

                const unsubscribeHistory = chatService.onHistory((history) => {
                    setMessages(history);
                });

                await chatService.connect({ isPublic: false });
                setIsInitialized(true);

                return () => {
                    unsubscribeMessage();
                    unsubscribeStatus();
                    unsubscribeTyping();
                    unsubscribeHistory();
                    chatService.disconnect();
                };
            } catch (error) {
                console.error('Failed to initialize chat:', error);
                setIsInitialized(true);
            }
        };

        initializeChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = useCallback(async (message: string) => {
        try {
            await chatService.sendMessage(message);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }, []);

    const handleClearChat = useCallback(async () => {
        try {
            await chatService.clearChat();
            setMessages([]);
            setTimeout(() => {
                chatService.connect({ isPublic: false });
            }, 500);
        } catch (error) {
            console.error('Failed to clear chat:', error);
        }
    }, []);

    // Trigger RAG rebuild to update chatbot knowledge
    const handleRebuildRAG = async () => {
        setIsRebuildingRAG(true);
        setRagRebuildSuccess(false);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(CHAT_CONFIG.RAG_REBUILD_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setRagRebuildSuccess(true);
                setTimeout(() => setRagRebuildSuccess(false), 3000);
            } else {
                console.error('Failed to rebuild RAG');
            }
        } catch (err) {
            console.error('Failed to rebuild RAG:', err);
        } finally {
            setIsRebuildingRAG(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && connectionStatus === 'connected') {
            handleSendMessage(input.trim());
            setInput('');
        }
    };

    const suggestions = [
        "What projects have I worked on?",
        "Summarize my experience",
        "What are my top skills?",
    ];

    const features = [
        { icon: Users, title: "Engage Visitors", description: "Let visitors ask questions and get instant AI responses" },
        { icon: Brain, title: "RAG-Powered", description: "Uses your portfolio data for accurate answers" },
        { icon: Shield, title: "Always Available", description: "24/7 availability when you're offline" },
        { icon: Zap, title: "Instant Responses", description: "Real-time AI responses with no delays" }
    ];

    if (!isInitialized) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card - Info */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Portfolio Chatbot</h2>
                            <p className="text-xs text-zinc-500">AI assistant for your visitors</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {features.map((feature, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                    <feature.icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white">{feature.title}</h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Update Chatbot Knowledge Button */}
                    <button
                        onClick={handleRebuildRAG}
                        disabled={isRebuildingRAG}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all mb-4 ${ragRebuildSuccess
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500'
                            } disabled:opacity-60`}
                    >
                        {ragRebuildSuccess ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Knowledge Updated!
                            </>
                        ) : isRebuildingRAG ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating Knowledge...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Update Chatbot Knowledge
                            </>
                        )}
                    </button>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-500/10 dark:to-indigo-500/10 border border-violet-100 dark:border-violet-500/20">
                        <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-300 mb-1">💡 Pro Tip</h3>
                        <p className="text-xs text-violet-700 dark:text-violet-400">
                            After editing your portfolio, click "Update Chatbot Knowledge" to sync changes with the AI!
                        </p>
                    </div>
                </div>

                {/* Right Card - Chat */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[600px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                            <span className="font-semibold text-sm text-zinc-900 dark:text-white">Test Chat</span>
                            {connectionStatus === 'connected' && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                </span>
                            )}
                        </div>
                        <button onClick={handleClearChat} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-950">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <Sparkles className="w-8 h-8 text-violet-400 mb-3" />
                                <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">Try it out!</p>
                                <p className="text-xs text-zinc-500 mb-4">Ask a question to test</p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setInput(s); inputRef.current?.focus(); }}
                                            className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-600 transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <ChatMessageComponent key={message.id} message={message} isLatest={!message.isUser && index === messages.length - 1} />
                                ))}
                                {isTyping && (
                                    <div className="flex gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                            <Bot className="w-3 h-3 text-zinc-500" />
                                        </div>
                                        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
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
                    <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                disabled={connectionStatus !== 'connected'}
                                className="flex-1 px-3 py-2 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
                                maxLength={1000}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || connectionStatus !== 'connected'}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
