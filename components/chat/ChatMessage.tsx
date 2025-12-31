'use client';

import { type ChatMessage, MessageStatus } from '@/types/chat';
import { CheckCircle2, Circle, XCircle, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';

interface ChatMessageProps {
    message: ChatMessage;
    isLatest?: boolean; // Flag to indicate if this is the latest AI message (for typing animation)
}

// Custom hook for typing animation
function useTypingAnimation(text: string, isEnabled: boolean, speed: number = 15) {
    const [displayedText, setDisplayedText] = useState(isEnabled ? '' : text);
    const [isTyping, setIsTyping] = useState(isEnabled);
    const indexRef = useRef(0);

    useEffect(() => {
        if (!isEnabled) {
            setDisplayedText(text);
            setIsTyping(false);
            return;
        }

        setDisplayedText('');
        indexRef.current = 0;
        setIsTyping(true);

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                // Add characters in chunks for smoother animation
                const chunkSize = Math.min(3, text.length - indexRef.current);
                setDisplayedText(text.slice(0, indexRef.current + chunkSize));
                indexRef.current += chunkSize;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, isEnabled, speed]);

    return { displayedText, isTyping };
}

export function ChatMessageComponent({ message, isLatest = false }: ChatMessageProps) {
    const isUser = message.isUser;

    // Only animate the latest AI message that was just received
    const shouldAnimate = Boolean(!isUser && isLatest && message.response);
    const { displayedText, isTyping } = useTypingAnimation(
        message.response || '',
        shouldAnimate,
        12 // Speed in ms per chunk
    );

    return (
        <div className={`flex gap-2.5 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                {isUser ? (
                    <User className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                ) : (
                    <Bot className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* User Message */}
                {isUser && message.query && (
                    <>
                        <div className="px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm
                                        bg-white dark:bg-zinc-800
                                        border border-zinc-100 dark:border-zinc-700
                                        text-zinc-900 dark:text-white">
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                {message.query}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 px-1">
                            {message.status === MessageStatus.SENDING && (
                                <Circle className="w-2.5 h-2.5 text-zinc-400 animate-pulse" />
                            )}
                            {message.status === MessageStatus.SENT && (
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                            )}
                            {message.status === MessageStatus.FAILED && (
                                <XCircle className="w-2.5 h-2.5 text-red-500" />
                            )}
                            <span className="text-[10px] text-zinc-400">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </>
                )}

                {/* Bot Message */}
                {!isUser && message.response && (
                    <>
                        <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm w-full
                                        bg-white dark:bg-zinc-800
                                        border border-zinc-100 dark:border-zinc-700">
                            <div className="text-[13px] leading-relaxed text-zinc-900 dark:text-white prose prose-zinc dark:prose-invert prose-sm max-w-none
                                            prose-p:mb-2 prose-p:last:mb-0
                                            prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-white
                                            prose-strong:font-semibold prose-strong:text-zinc-900 dark:prose-strong:text-white
                                            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => (
                                            <p className="text-zinc-700 dark:text-zinc-200">{children}</p>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="list-disc ml-4 mb-2 space-y-1 text-zinc-700 dark:text-zinc-200">{children}</ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="list-decimal ml-4 mb-2 space-y-1 text-zinc-700 dark:text-zinc-200">{children}</ol>
                                        ),
                                        li: ({ children }) => <li>{children}</li>,
                                        h1: ({ children }) => (
                                            <h1 className="text-base font-bold mb-2 mt-3 text-zinc-900 dark:text-white">{children}</h1>
                                        ),
                                        h2: ({ children }) => (
                                            <h2 className="text-sm font-bold mb-2 mt-2.5 text-zinc-900 dark:text-white">{children}</h2>
                                        ),
                                        h3: ({ children }) => (
                                            <h3 className="text-sm font-semibold mb-1.5 mt-2 text-zinc-900 dark:text-white">{children}</h3>
                                        ),
                                        code: ({ className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isInline = !match && !className;
                                            return isInline ? (
                                                <code
                                                    className="bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2 border border-zinc-200 dark:border-zinc-700">
                                                    <code className={`${className} text-zinc-800 dark:text-zinc-200`} {...props}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            );
                                        },
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-3 italic my-2 text-zinc-500 dark:text-zinc-400">
                                                {children}
                                            </blockquote>
                                        ),
                                        a: ({ href, children }) => (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {children}
                                            </a>
                                        ),
                                        strong: ({ children }) => (
                                            <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>
                                        ),
                                    }}
                                >
                                    {shouldAnimate ? displayedText : message.response}
                                </ReactMarkdown>
                                {/* Typing cursor */}
                                {isTyping && (
                                    <span className="inline-block w-0.5 h-4 bg-zinc-500 dark:bg-zinc-400 animate-pulse ml-0.5" />
                                )}
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-1.5 px-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
