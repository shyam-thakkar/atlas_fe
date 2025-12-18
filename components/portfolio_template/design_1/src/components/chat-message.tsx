'use client';

import { type ChatMessage, MessageStatus } from '@/lib/chat-types';
import { CheckCircle2, Circle, XCircle, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
    const isUser = message.isUser;

    return (
        <div
            className={`flex gap-2.5 mb-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
        >
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center shadow-sm">
                {isUser ? (
                    <User className="w-4 h-4 text-zinc-100" />
                ) : (
                    <Bot className="w-4 h-4 text-zinc-100" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 ${isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'} max-w-[85%]`}>
                {/* User Message - Show Query */}
                {isUser && message.query && (
                    <>
                        <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-sm border border-zinc-800 dark:border-zinc-700">
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                {message.query}
                            </p>
                        </div>
                        {/* Status and Timestamp on same line for user messages */}
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                            {message.status && (
                                <>
                                    {message.status === MessageStatus.SENDING && (
                                        <Circle className="w-3 h-3 text-muted-foreground/60 animate-pulse" />
                                    )}
                                    {message.status === MessageStatus.SENT && (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                                    )}
                                    {message.status === MessageStatus.FAILED && (
                                        <XCircle className="w-3 h-3 text-red-500" />
                                    )}
                                </>
                            )}
                            <span className="text-[11px] text-muted-foreground/70">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </>
                )}

                {/* Bot Message - Show Only Response */}
                {!isUser && message.response && (
                    <>
                        <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-zinc-100 dark:bg-zinc-800/50 text-foreground shadow-sm border border-zinc-200 dark:border-zinc-800 w-full overflow-hidden">
                            <div className="text-[13px] leading-relaxed break-words prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                                        li: ({ children }) => <li className="pl-1">{children}</li>,
                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>,
                                        code: ({ className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isInline = !match && !className;
                                            return isInline ? (
                                                <code className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                                    {children}
                                                </code>
                                            ) : (
                                                <div className="relative group my-2">
                                                    <div className="absolute -top-3 right-2 text-[10px] text-zinc-500 font-mono uppercase select-none">
                                                        {match?.[1] || 'text'}
                                                    </div>
                                                    <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-3 rounded-lg overflow-x-auto text-xs font-mono border border-zinc-800">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                </div>
                                            );
                                        },
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-3 italic my-2 text-muted-foreground">
                                                {children}
                                            </blockquote>
                                        ),
                                        a: ({ href, children }) => (
                                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                                {children}
                                            </a>
                                        ),
                                    }}
                                >
                                    {message.response}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Timestamp for AI messages */}
                        <div className="text-[11px] text-muted-foreground/70 mt-1 px-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
