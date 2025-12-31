import { CHAT_CONFIG } from './chat-config';
import { sessionManager } from './session-manager';
import { apiRequest } from './api';
import type {
    ChatMessage,
    ConnectionStatus,
    WSQueryMessage,
    WSResponseMessage,
    ChatHistoryResponse,
    CreateSessionResponse,
    MessageStatus,
    ChatSession,
} from '@/types/chat';

type MessageCallback = (message: ChatMessage) => void;
type StatusCallback = (status: ConnectionStatus) => void;
type TypingCallback = (isTyping: boolean) => void;
type HistoryCallback = (messages: ChatMessage[]) => void;

interface ChatServiceOptions {
    isPublic?: boolean;
    username?: string; // Required for public sessions
}

class ChatService {
    private ws: WebSocket | null = null;
    private session: ChatSession | null = null;
    private messageCallbacks: MessageCallback[] = [];
    private statusCallbacks: StatusCallback[] = [];
    private typingCallbacks: TypingCallback[] = [];
    private historyCallbacks: HistoryCallback[] = [];
    private reconnectAttempts = 0;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private isIntentionallyClosed = false;
    private options: ChatServiceOptions = {};

    /**
     * Initialize the chat service and connect to WebSocket
     */
    async connect(options: ChatServiceOptions = {}): Promise<void> {
        try {
            this.options = options;
            this.isIntentionallyClosed = false;

            // Initialize session manager with context
            // For public portfolios: use username as context
            // For dashboard: use 'dashboard' as context
            const context = options.isPublic && options.username 
                ? options.username 
                : 'dashboard';
            sessionManager.setContext(context);
            await sessionManager.init();

            // Get existing session for this context if available
            this.session = await sessionManager.getSession();

            // If no session, create one
            if (!this.session) {
                await this.createSession();
            }

            if (!this.session) {
                throw new Error('Failed to create or retrieve session');
            }

            // Build WebSocket URL
            const wsUrl = this.buildWebSocketUrl();

            this.updateStatus('connecting' as ConnectionStatus);

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.updateStatus('connected' as ConnectionStatus);
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
                this.updateStatus('error' as ConnectionStatus);
            };

            this.ws.onclose = (event) => {
                console.log('WebSocket closed', event.code);
                this.updateStatus('disconnected' as ConnectionStatus);

                // Only attempt reconnection if not intentionally closed
                if (!this.isIntentionallyClosed && event.code !== 1000) {
                    this.attemptReconnect();
                }
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            this.updateStatus('error' as ConnectionStatus);
        }
    }

    /**
     * Build WebSocket URL with session ID and optional token
     */
    private buildWebSocketUrl(): string {
        if (!this.session) {
            throw new Error('No session available');
        }

        let url = `${CHAT_CONFIG.WS_BASE_URL}/${this.session.sessionId}/`;

        // Add JWT token for authenticated sessions
        if (!this.options.isPublic && typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                url += `?token=${token}`;
            }
        }

        return url;
    }

    /**
     * Create a new session via REST API
     */
    private async createSession(): Promise<void> {
        try {
            let response: CreateSessionResponse;

            if (this.options.isPublic && this.options.username) {
                // Public session - no auth required
                const res = await fetch(
                    `${CHAT_CONFIG.CREATE_PUBLIC_SESSION_URL}${this.options.username}/`,
                    { method: 'POST' }
                );
                if (!res.ok) {
                    throw new Error(`Failed to create public session: ${res.statusText}`);
                }
                response = await res.json();
            } else {
                // Dashboard session - requires auth
                response = await apiRequest<CreateSessionResponse>(
                    '/api/chat/session/',
                    { method: 'POST' }
                );
            }

            this.session = {
                sessionId: response.session_id,
                isPublic: response.is_public,
                createdAt: response.created_at,
                lastActivity: response.created_at,
                portfolioOwner: response.portfolio_owner,
            };

            await sessionManager.saveSession(this.session);
            console.log('Session created:', this.session.sessionId);
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    }

    /**
     * Handle incoming WebSocket messages
     */
    private async handleMessage(data: WSResponseMessage): Promise<void> {
        // Handle session_info message type
        if (data.type === 'session_info') {
            console.log(`Session connected: ${data.session_id}, history_loaded: ${data.history_loaded}`);

            // Fetch chat history if there are previous messages
            if (data.history_loaded && data.history_loaded > 0) {
                const historyResult = await this.fetchChatHistory(1, 20);
                if (historyResult.messages.length > 0) {
                    console.log(`Loaded ${historyResult.messages.length} messages from history`);

                    // Store pagination state
                    if (typeof window !== 'undefined') {
                        (window as any).__chatHasMore = historyResult.hasMore;
                        (window as any).__chatCurrentPage = 1;
                    }

                    this.historyCallbacks.forEach(callback => callback(historyResult.messages));
                }
            }
            return;
        }

        if (data.type === 'typing') {
            this.updateTyping(true);
            return;
        }

        if (data.type === 'pong') {
            // Keep-alive response, no action needed
            return;
        }

        if (data.type === 'error') {
            console.error('Chat error:', data.error);
            this.updateTyping(false);
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
    async sendMessage(query: string, topK?: number, section?: string): Promise<ChatMessage> {
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

            if (topK) wsMessage.top_k = topK;
            if (section) wsMessage.section = section as WSQueryMessage['section'];

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
    async fetchChatHistory(page: number = 1, pageSize: number = 20): Promise<{
        messages: ChatMessage[];
        hasMore: boolean;
        currentPage: number;
        totalPages: number;
    }> {
        try {
            if (!this.session) {
                return { messages: [], hasMore: false, currentPage: 1, totalPages: 1 };
            }

            // Build headers with auth token for non-public sessions
            const headers: Record<string, string> = {};
            if (!this.options.isPublic && typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(
                `${CHAT_CONFIG.CHAT_HISTORY_URL}${this.session.sessionId}/?page=${page}&page_size=${pageSize}`,
                { headers }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch chat history: ${response.statusText}`);
            }

            const data: ChatHistoryResponse = await response.json();

            // Convert history messages to ChatMessage format
            const messages: ChatMessage[] = [];

            data.messages.forEach((msg) => {
                const baseId = crypto.randomUUID();

                if (msg.role === 'user') {
                    messages.push({
                        id: `user-${baseId}`,
                        query: msg.content,
                        timestamp: msg.timestamp,
                        isUser: true,
                        status: 'sent' as MessageStatus,
                    });
                } else {
                    messages.push({
                        id: `bot-${baseId}`,
                        query: '',
                        response: msg.content,
                        timestamp: msg.timestamp,
                        isUser: false,
                        status: 'sent' as MessageStatus,
                    });
                }
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
            this.connect(this.options);
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
    async deleteSession(): Promise<boolean> {
        if (!this.session) return false;

        try {
            const response = await apiRequest<{ success: boolean; deleted_messages: number }>(
                `/api/chat/session/${this.session.sessionId}/`,
                { method: 'DELETE' }
            );
            console.log(`Session deleted: ${response.deleted_messages} messages removed`);
            return true;
        } catch (error) {
            console.error('Failed to delete session from backend:', error);
            return false;
        }
    }

    /**
     * Clear chat history and session
     */
    async clearChat(): Promise<void> {
        // Delete from backend if we have a session
        if (this.session) {
            await this.deleteSession();
        }

        await sessionManager.clearSession();
        this.session = null;

        // Clean up window state
        if (typeof window !== 'undefined') {
            delete (window as any).__chatHasMore;
            delete (window as any).__chatCurrentPage;
        }

        this.disconnect();
    }

    /**
     * Get current session
     */
    getSession(): ChatSession | null {
        return this.session;
    }

    /**
     * Send ping to keep connection alive
     */
    sendPing(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }));
        }
    }
}

// Export singleton instance
export const chatService = new ChatService();
