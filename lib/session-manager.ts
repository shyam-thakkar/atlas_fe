import { CHAT_CONFIG } from './chat-config';
import type { ChatSession } from '@/types/chat';

class SessionManager {
    private db: IDBDatabase | null = null;
    private dbInitialized = false;
    private currentContext: string = 'default'; // Username for public, 'dashboard' for authenticated

    /**
     * Initialize IndexedDB for session storage
     */
    async init(): Promise<void> {
        if (this.dbInitialized) return;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(CHAT_CONFIG.STORAGE_KEYS.SESSION_DB, 2); // Bumped version for schema change

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

                // Delete old object store if it exists (schema migration)
                if (db.objectStoreNames.contains(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE)) {
                    db.deleteObjectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);
                }

                // Create object store with contextKey as the primary key
                db.createObjectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE, { keyPath: 'contextKey' });
            };
        });
    }

    /**
     * Set the context (username for public chat, 'dashboard' for authenticated)
     */
    setContext(context: string): void {
        this.currentContext = context || 'default';
    }

    /**
     * Get the storage key for localStorage (context-specific)
     */
    private getLocalStorageKey(): string {
        return `${CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY}-${this.currentContext}`;
    }

    /**
     * Save session to IndexedDB (context-specific)
     */
    async saveSession(session: Omit<ChatSession, 'lastActivity'>): Promise<void> {
        try {
            await this.init();

            const fullSession = {
                ...session,
                contextKey: this.currentContext, // Add context as the key
                lastActivity: new Date().toISOString(),
            };

            if (!this.db) {
                localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(fullSession));
                return;
            }

            const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readwrite');
            const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

            await new Promise<void>((resolve, reject) => {
                const request = store.put(fullSession);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });

            // Also save to localStorage as backup
            localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(fullSession));
        } catch (error) {
            console.error('Failed to save session to IndexedDB:', error);
            localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(session));
        }
    }

    /**
     * Get session from IndexedDB or localStorage (context-specific)
     */
    async getSession(): Promise<ChatSession | null> {
        try {
            await this.init();

            if (!this.db) {
                const stored = localStorage.getItem(this.getLocalStorageKey());
                return stored ? JSON.parse(stored) : null;
            }

            const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readonly');
            const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

            return new Promise<ChatSession | null>((resolve) => {
                const request = store.get(this.currentContext);

                request.onsuccess = () => {
                    const session = request.result as ChatSession | undefined;
                    if (session) {
                        resolve(session);
                    } else {
                        // Check localStorage as fallback
                        const stored = localStorage.getItem(this.getLocalStorageKey());
                        resolve(stored ? JSON.parse(stored) : null);
                    }
                };

                request.onerror = () => {
                    const stored = localStorage.getItem(this.getLocalStorageKey());
                    resolve(stored ? JSON.parse(stored) : null);
                };
            });
        } catch (error) {
            console.error('Failed to get session from IndexedDB:', error);
            const stored = localStorage.getItem(this.getLocalStorageKey());
            return stored ? JSON.parse(stored) : null;
        }
    }

    /**
     * Clear session for current context
     */
    async clearSession(): Promise<void> {
        try {
            await this.init();

            if (this.db) {
                const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readwrite');
                const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

                await new Promise<void>((resolve, reject) => {
                    const request = store.delete(this.currentContext);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }

            localStorage.removeItem(this.getLocalStorageKey());
        } catch (error) {
            console.error('Failed to clear session:', error);
            localStorage.removeItem(this.getLocalStorageKey());
        }
    }

    /**
     * Clear ALL sessions (for logout)
     */
    async clearAllSessions(): Promise<void> {
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

            // Clear all session keys from localStorage
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CHAT_CONFIG.STORAGE_KEYS.SESSION_KEY)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Failed to clear all sessions:', error);
        }
    }

    /**
     * Update last activity timestamp
     */
    async updateActivity(): Promise<void> {
        try {
            const session = await this.getSession();
            if (!session) return;

            await this.init();

            if (!this.db) return;

            const transaction = this.db.transaction([CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE], 'readwrite');
            const store = transaction.objectStore(CHAT_CONFIG.STORAGE_KEYS.SESSION_STORE);

            const getRequest = store.get(this.currentContext);

            getRequest.onsuccess = () => {
                const storedSession = getRequest.result;
                if (storedSession) {
                    storedSession.lastActivity = new Date().toISOString();
                    store.put(storedSession);
                }
            };
        } catch (error) {
            console.error('Failed to update activity:', error);
        }
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();
