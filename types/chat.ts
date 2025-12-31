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
    section: string;
    title: string;
    snippet: string;
}

// WebSocket message types
export interface WSQueryMessage {
    type: 'query';
    query: string;
    top_k?: number;
    section?: 'bio' | 'experience' | 'projects' | 'skills' | 'education' | null;
}

export interface WSResponseMessage {
    type: 'response' | 'typing' | 'session_info' | 'error' | 'pong';
    query?: string;
    response?: string;
    sources?: Source[];
    success?: boolean;
    timestamp?: string;
    message?: string;
    session_id?: string;
    is_public?: boolean;
    history_loaded?: number;
    error?: string;
}

// REST API response types
export interface CreateSessionResponse {
    session_id: string;
    is_public: boolean;
    created_at: string;
    portfolio_owner?: string; // Only for public sessions
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
}

export interface HistoryMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    retrieved_documents: number[];
}

export interface ChatSession {
    sessionId: string;
    isPublic: boolean;
    createdAt: string;
    lastActivity: string;
    portfolioOwner?: string;
}

export interface RAGStatus {
    total_documents: number;
    sections: {
        bio: number;
        experience: number;
        projects: number;
        skills: number;
        education: number;
        other: number;
    };
    last_updated: string;
}
