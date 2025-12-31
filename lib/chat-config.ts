// Chat configuration - uses environment variables for flexibility
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001';

export const CHAT_CONFIG = {
    // WebSocket URL for real-time chat (session_id appended at connect time)
    WS_BASE_URL: `${WS_URL}/ws/chat`,

    // REST API endpoints
    API_URL: API_URL,
    CREATE_SESSION_URL: `${API_URL}/api/chat/session/`,
    CREATE_PUBLIC_SESSION_URL: `${API_URL}/api/chat/session/public/`, // + username/
    CHAT_HISTORY_URL: `${API_URL}/api/chat/history/`, // + session_id/
    DELETE_SESSION_URL: `${API_URL}/api/chat/session/`, // + session_id/
    RAG_STATUS_URL: `${API_URL}/api/chat/rag/status/`,
    RAG_REBUILD_URL: `${API_URL}/api/chat/rag/rebuild/`,

    // Storage keys
    STORAGE_KEYS: {
        SESSION_DB: 'aifolio-chat-sessions-db',
        SESSION_STORE: 'sessions',
        SESSION_KEY: 'aifolio-chat-session',
    },

    // Connection settings
    RECONNECT: {
        MAX_ATTEMPTS: 5,
        INITIAL_DELAY: 1000,
        MAX_DELAY: 30000,
        BACKOFF_MULTIPLIER: 2,
    },
} as const;
