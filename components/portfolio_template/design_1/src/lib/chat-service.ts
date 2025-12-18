import { CHAT_CONFIG } from '@/constants/chat-config';
import { sessionManager } from './session-manager';
import type {
    ChatMessage,
    ConnectionStatus,
    WSQueryMessage,
    WSResponseMessage,
    ChatHistoryResponse,
    MessageStatus
} from './chat-types';

type MessageCallback = (message: ChatMessage) => void;
type StatusCallback = (status: ConnectionStatus) => void;
type TypingCallback = (isTyping: boolean) => void;
type HistoryCallback = (messages: ChatMessage[]) => void;

class ChatService {
    private ws: WebSocket | null = null;
    private sessionId: string | null = null;
    private messageCallbacks: MessageCallback[] = [];
    private statusCallbacks: StatusCallback[] = [];
    private typingCallbacks: TypingCallback[] = [];
    private historyCallbacks: HistoryCallback[] = [];
    private reconnectAttempts = 0;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private isIntentionallyClosed = false;

    /**
     * Initialize the chat service and connect to WebSocket
     */
    async connect(): Promise<void> {
        try {
            this.isIntentionallyClosed = false;

            // Get existing session ID if available
            this.sessionId = await sessionManager.getSession();

            // Build WebSocket URL with session ID if available
            const wsUrl = this.sessionId
                ? `${CHAT_CONFIG.WS_URL}?session_id=${this.sessionId}`
                : CHAT_CONFIG.WS_URL;

            this.updateStatus('connecting' as ConnectionStatus);

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = async () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.updateStatus('connected' as ConnectionStatus);

                // If we don't have a session ID yet, extract it from the WebSocket URL
                if (!this.sessionId && this.ws) {
                    try {
                        const wsUrl = this.ws.url;
                        const urlParams = new URLSearchParams(wsUrl.split('?')[1]);
                        const extractedSessionId = urlParams.get('session_id');

                        if (extractedSessionId) {
                            console.log('Session ID extracted from WebSocket URL:', extractedSessionId);
                            await this.setSessionId(extractedSessionId);
                        }
                    } catch (error) {
                        console.error('Failed to extract session ID from WebSocket URL:', error);
                    }
                }
            };

            this.ws.onmessage = async (event) => {
                try {
                    const data: WSResponseMessage = JSON.parse(event.data);
                    await this.handleMessage(data);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                console.error('WebSocket URL:', wsUrl);
                console.error('WebSocket readyState:', this.ws?.readyState);
                this.updateStatus('error' as ConnectionStatus);
            };

            this.ws.onclose = () => {
                console.log('WebSocket closed');
                this.updateStatus('disconnected' as ConnectionStatus);

                // Only attempt reconnection if not intentionally closed
                if (!this.isIntentionallyClosed) {
                    this.attemptReconnect();
                }
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            this.updateStatus('error' as ConnectionStatus);
        }
    }

    /**
     * Handle incoming WebSocket messages
     */
    private async handleMessage(data: WSResponseMessage): Promise<void> {
        // Handle session_info message type
        if (data.type === 'session_info') {
            if (data.session_id) {
                console.log(
                    data.is_new_session
                        ? `New session created: ${data.session_id}`
                        : `Existing session restored: ${data.session_id}`
                );
                await this.setSessionId(data.session_id);

                // If this is an existing session, fetch and load chat history
                if (!data.is_new_session) {
                    console.log('Fetching chat history for existing session...');
                    const historyResult = await this.fetchChatHistory(1, 5);
                    if (historyResult.messages.length > 0) {
                        console.log(`Loaded ${historyResult.messages.length} messages from history (page 1/${historyResult.totalPages})`);
                        console.log(`Has more pages: ${historyResult.hasMore}`);

                        // Store pagination state for client
                        (window as any).__chatHasMore = historyResult.hasMore;
                        (window as any).__chatCurrentPage = 1;

                        this.historyCallbacks.forEach(callback => callback(historyResult.messages));
                    }
                }
            }
            if (data.message) {
                console.log('Server message:', data.message);
            }
            return;
        }

        if (data.type === 'typing') {
            // Handle typing indicator
            this.updateTyping(true);
            return;
        }

        if (data.type === 'response') {
            // Stop typing indicator
            this.updateTyping(false);

            // Create chat message from response
            const message: ChatMessage = {
                id: `${Date.now()}-bot`,
                query: data.query || '',
                response: data.response,
                timestamp: data.timestamp || new Date().toISOString(),
                isUser: false,
                status: 'sent' as MessageStatus,
                sources: data.sources,
            };

            // Notify listeners
            this.messageCallbacks.forEach(callback => callback(message));

            // Update activity timestamp
            await sessionManager.updateActivity();
        }
    }

    /**
     * Send a message to the chatbot
     */
    async sendMessage(query: string): Promise<ChatMessage> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }

        // Create user message
        const userMessage: ChatMessage = {
            id: `${Date.now()}-user`,
            query,
            timestamp: new Date().toISOString(),
            isUser: true,
            status: 'sending' as MessageStatus,
        };

        // Notify listeners about user message
        this.messageCallbacks.forEach(callback => callback(userMessage));

        try {
            // Send message via WebSocket
            const wsMessage: WSQueryMessage = {
                type: 'query',
                query,
            };

            this.ws.send(JSON.stringify(wsMessage));

            // Update message status to sent
            userMessage.status = 'sent' as MessageStatus;
            this.messageCallbacks.forEach(callback => callback(userMessage));

            // Update activity timestamp
            await sessionManager.updateActivity();

            return userMessage;
        } catch (error) {
            console.error('Failed to send message:', error);
            userMessage.status = 'failed' as MessageStatus;
            this.messageCallbacks.forEach(callback => callback(userMessage));
            throw error;
        }
    }

    /**
     * Fetch chat history from API with pagination support
     */
    async fetchChatHistory(page: number = 1, pageSize: number = 20): Promise<{ messages: ChatMessage[], hasMore: boolean, currentPage: number, totalPages: number }> {
        try {
            this.sessionId = await sessionManager.getSession();

            if (!this.sessionId) {
                return { messages: [], hasMore: false, currentPage: 1, totalPages: 1 };
            }

            const response = await fetch(
                `${CHAT_CONFIG.CHAT_HISTORY_URL}${this.sessionId}/?page=${page}&page_size=${pageSize}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch chat history: ${response.statusText}`);
            }

            const data: ChatHistoryResponse = await response.json();

            // Convert history messages to ChatMessage format
            const messages: ChatMessage[] = [];

            data.messages.forEach((msg) => {
                // Generate truly unique IDs using crypto.randomUUID
                const baseId = crypto.randomUUID();

                // Add user message
                messages.push({
                    id: `user-${baseId}`,
                    query: msg.query,
                    timestamp: msg.timestamp,
                    isUser: true,
                    status: 'sent' as MessageStatus,
                });

                // Add bot response
                messages.push({
                    id: `bot-${baseId}`,
                    query: msg.query,
                    response: msg.response,
                    timestamp: msg.timestamp,
                    isUser: false,
                    status: 'sent' as MessageStatus,
                });
            });

            return {
                messages,
                hasMore: data.pagination.has_next,
                currentPage: data.pagination.page,
                totalPages: data.pagination.total_pages,
            };
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
            return { messages: [], hasMore: false, currentPage: 1, totalPages: 1 };
        }
    }

    /**
     * Set session ID and save it
     */
    async setSessionId(sessionId: string): Promise<void> {
        this.sessionId = sessionId;
        await sessionManager.saveSession(sessionId);
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect(): void {
        this.isIntentionallyClosed = true;

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    /**
     * Attempt to reconnect to WebSocket
     */
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= CHAT_CONFIG.RECONNECT.MAX_ATTEMPTS) {
            console.error('Max reconnection attempts reached');
            this.updateStatus('error' as ConnectionStatus);
            return;
        }

        const delay = Math.min(
            CHAT_CONFIG.RECONNECT.INITIAL_DELAY *
            Math.pow(CHAT_CONFIG.RECONNECT.BACKOFF_MULTIPLIER, this.reconnectAttempts),
            CHAT_CONFIG.RECONNECT.MAX_DELAY
        );

        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    /**
     * Subscribe to new messages
     */
    onMessage(callback: MessageCallback): () => void {
        this.messageCallbacks.push(callback);
        return () => {
            this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Subscribe to connection status changes
     */
    onStatusChange(callback: StatusCallback): () => void {
        this.statusCallbacks.push(callback);
        return () => {
            this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Subscribe to typing indicator changes
     */
    onTypingChange(callback: TypingCallback): () => void {
        this.typingCallbacks.push(callback);
        return () => {
            this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Subscribe to chat history loaded events
     */
    onHistory(callback: HistoryCallback): () => void {
        this.historyCallbacks.push(callback);
        return () => {
            this.historyCallbacks = this.historyCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Update connection status
     */
    private updateStatus(status: ConnectionStatus): void {
        this.statusCallbacks.forEach(callback => callback(status));
    }

    /**
     * Update typing indicator
     */
    private updateTyping(isTyping: boolean): void {
        this.typingCallbacks.forEach(callback => callback(isTyping));
    }

    /**
     * Delete session from backend
     */
    async deleteSession(sessionId: string): Promise<boolean> {
        try {
            const response = await fetch(
                `${CHAT_CONFIG.DELETE_SESSION_URL}${sessionId}/`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to delete session: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Session deleted: ${data.deleted_messages} messages removed`);
            return data.success;
        } catch (error) {
            console.error('Failed to delete session from backend:', error);
            return false;
        }
    }

    /**
     * Clear chat history and session
     */
    async clearChat(): Promise<void> {
        // Delete from backend if we have a session ID
        if (this.sessionId) {
            await this.deleteSession(this.sessionId);
        }

        await sessionManager.clearSession();
        this.sessionId = null;

        // Clean up window state
        delete (window as any).__chatHasMore;
        delete (window as any).__chatCurrentPage;

        this.disconnect();
    }
}

// Export singleton instance
export const chatService = new ChatService();
