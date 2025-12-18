export enum ConnectionStatus {
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
}

export enum MessageStatus {
    SENDING = 'sending',
    SENT = 'sent',
    FAILED = 'failed',
}

export interface ChatMessage {
    id: string;
    query: string;
    response?: string;
    timestamp: string;
    isUser: boolean;
    status?: MessageStatus;
    sources?: Source[];
}

export interface Source {
    id: number;
    category: string;
    title: string;
    snippet: string;
}

export interface WSQueryMessage {
    type: 'query';
    query: string;
}

export interface WSResponseMessage {
    type: 'response' | 'typing' | 'session_info';
    query?: string;
    response?: string;
    sources?: Source[];
    success?: boolean;
    timestamp?: string;
    message?: string; // For typing indicator or connection messages
    session_id?: string; // For session initialization
    is_new_session?: boolean; // Whether this is a new or existing session
}

export interface ChatHistoryResponse {
    session_id: string;
    created_at: string;
    last_activity: string;
    messages: HistoryMessage[];
    pagination: {
        page: number;
        page_size: number;
        total_messages: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
    };
    success: boolean;
}

export interface HistoryMessage {
    query: string;
    response: string;
    timestamp: string;
    retrieved_documents?: number[];
}

export interface ChatSession {
    sessionId: string;
    createdAt: string;
    lastActivity: string;
}
