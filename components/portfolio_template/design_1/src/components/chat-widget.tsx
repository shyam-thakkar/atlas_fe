'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatButton } from './chat-button';
import { ChatPopup } from './chat-popup';
import { DeleteConfirmModal } from './delete-confirm-modal';
import { chatService } from '@/lib/chat-service';
import { sessionManager } from '@/lib/session-manager';
import type { ChatMessage, ConnectionStatus } from '@/lib/chat-types';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected' as ConnectionStatus);
    const [isTyping, setIsTyping] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreHistory, setHasMoreHistory] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Lock body scroll when chat is open
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

    // Initialize chat service and load history
    useEffect(() => {
        const initializeChat = async () => {
            try {
                // Initialize session manager
                await sessionManager.init();

                // Subscribe to chat service events
                const unsubscribeMessage = chatService.onMessage((message) => {
                    setMessages((prev) => {
                        // Check if message already exists (avoid duplicates)
                        const exists = prev.some((m) => m.id === message.id);
                        if (exists) {
                            // Update existing message (for status changes)
                            return prev.map((m) => (m.id === message.id ? message : m));
                        }
                        // Add new message
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
                    console.log('History loaded, displaying messages');
                    setMessages(history);
                    setCurrentPage(1);
                    setHasMoreHistory(true); // Initially assume there might be more, loadMore will update this
                });

                // Connect to WebSocket (history will be loaded automatically for existing sessions)
                await chatService.connect();

                setIsInitialized(true);

                // Cleanup on unmount
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

    // Check pagination state after messages load
    useEffect(() => {
        if (messages.length > 0 && (window as any).__chatHasMore !== undefined) {
            setHasMoreHistory((window as any).__chatHasMore);
            console.log('Set hasMoreHistory to:', (window as any).__chatHasMore);
        }
    }, [messages]);

    // Handle sending messages
    const handleSendMessage = useCallback(async (message: string) => {
        try {
            await chatService.sendMessage(message);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }, []);

    // Handle clearing chat - show modal
    const handleClearChat = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    // Handle confirmed delete
    const handleConfirmDelete = useCallback(async () => {
        try {
            await chatService.clearChat();
            setMessages([]);
            setIsOpen(false);
            setCurrentPage(1);
            setHasMoreHistory(false);
            setShowDeleteModal(false);
            
            // Reconnect to start a new session
            setTimeout(() => {
                chatService.connect();
            }, 500);
        } catch (error) {
            console.error('Failed to clear chat:', error);
            setShowDeleteModal(false);
        }
    }, []);

    // Load more history (older messages)
    const handleLoadMoreHistory = useCallback(async () => {
        if (isLoadingHistory || !hasMoreHistory) return;

        try {
            setIsLoadingHistory(true);
            const nextPage = currentPage + 1;
            const result = await chatService.fetchChatHistory(nextPage, 5);
            
            if (result.messages.length > 0) {
                // Prepend older messages to the beginning
                setMessages(prev => [...result.messages, ...prev]);
                setCurrentPage(nextPage);
                setHasMoreHistory(result.hasMore);
                console.log(`Loaded page ${nextPage}/${result.totalPages}, hasMore: ${result.hasMore}`);
            } else {
                setHasMoreHistory(false);
            }
        } catch (error) {
            console.error('Failed to load more history:', error);
            setHasMoreHistory(false);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [currentPage, hasMoreHistory, isLoadingHistory]);

    // Don't render until initialized
    if (!isInitialized) {
        return null;
    }

    return (
        <>
            {/* Chat Button Container */}
            <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
                <div className="mx-auto w-full md:w-[50%] px-4 md:px-8 flex justify-end pointer-events-auto">
                    {/* Chat Button */}
                    {!isOpen && (
                        <ChatButton
                            onClick={() => setIsOpen(true)}
                            hasUnread={false} // Can add logic to track unread messages
                        />
                    )}
                </div>
            </div>

            {/* Chat Popup - Separate container with higher z-index */}
            <ChatPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                messages={messages}
                onSendMessage={handleSendMessage}
                connectionStatus={connectionStatus}
                isTyping={isTyping}
                onClearChat={handleClearChat}
                onLoadMore={handleLoadMoreHistory}
                hasMoreHistory={hasMoreHistory}
                isLoadingHistory={isLoadingHistory}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}
