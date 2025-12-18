import { CHAT_CONFIG } from '@/constants/chat-config';
import type { ChatSession } from './chat-types';

class SessionManager {
    private db: IDBDatabase | null = null;
    private dbInitialized = false;

    /**
     * Initialize IndexedDB for session storage
     */
    async init(): Promise<void> {
        if (this.dbInitialized) return;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(CHAT_CONFIG.STORAGE_KEYS.SESSION_DB, 1);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.dbInitialized = true;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE)) {
                    db.createObjectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE, { keyPath: 'sessionId' });
                }
            };
        });
    }

    /**
     * Save session ID to IndexedDB
     */
    async saveSession(sessionId: string): Promise<void> {
        try {
            await this.init();

            if (!this.db) {
                // Fallback to localStorage if IndexedDB fails
                localStorage.setItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY, sessionId);
                return;
            }

            const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readwrite');
            const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

            const session: ChatSession = {
                sessionId,
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
            };

            await new Promise<void>((resolve, reject) => {
                const request = store.put(session);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });

            // Also save to localStorage as backup
            localStorage.setItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY, sessionId);
        } catch (error) {
            console.error('Failed to save session to IndexedDB:', error);
            // Fallback to localStorage
            localStorage.setItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY, sessionId);
        }
    }

    /**
     * Get session ID from IndexedDB or localStorage
     */
    async getSession(): Promise<string | null> {
        try {
            await this.init();

            if (!this.db) {
                // Fallback to localStorage
                return localStorage.getItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY);
            }

            const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readonly');
            const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

            return new Promise<string | null>((resolve) => {
                const request = store.getAll();

                request.onsuccess = () => {
                    const sessions = request.result as ChatSession[];
                    if (sessions.length > 0) {
                        // Get the most recent session
                        const latestSession = sessions.reduce((prev, current) =>
                            new Date(current.lastActivity) > new Date(prev.lastActivity) ? current : prev
                        );
                        resolve(latestSession.sessionId);
                    } else {
                        // Check localStorage as fallback
                        resolve(localStorage.getItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY));
                    }
                };

                request.onerror = () => {
                    // Fallback to localStorage
                    resolve(localStorage.getItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY));
                };
            });
        } catch (error) {
            console.error('Failed to get session from IndexedDB:', error);
            // Fallback to localStorage
            return localStorage.getItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY);
        }
    }

    /**
     * Clear session (user-initiated logout)
     */
    async clearSession(): Promise<void> {
        try {
            await this.init();

            if (this.db) {
                const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readwrite');
                const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

                await new Promise<void>((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }

            // Also clear localStorage
            localStorage.removeItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY);
        } catch (error) {
            console.error('Failed to clear session:', error);
            // At least clear localStorage
            localStorage.removeItem(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY);
        }
    }

    /**
     * Update last activity timestamp
     */
    async updateActivity(): Promise<void> {
        try {
            const sessionId = await this.getSession();
            if (!sessionId) return;

            await this.init();

            if (!this.db) return;

            const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readwrite');
            const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

            const getRequest = store.get(sessionId);

            getRequest.onsuccess = () => {
                const session = getRequest.result as ChatSession;
                if (session) {
                    session.lastActivity = new Date().toISOString();
                    store.put(session);
                }
            };
        } catch (error) {
            console.error('Failed to update activity:', error);
        }
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();
