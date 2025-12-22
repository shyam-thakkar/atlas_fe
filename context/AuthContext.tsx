'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, UserResponse } from '@/lib/auth';

interface AuthContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signupAndLogin: (email: string, password: string, name: string) => Promise<void>;
    loginWithGoogle: () => void; // Changed: no idToken needed, just redirects
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CHANNEL_NAME = 'atlas_auth_channel';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<UserResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Auth Check and User Fetch helper
    const checkUser = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const userData = await auth.getCurrentUser();
            if (userData && userData.email) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                // If API returns something but not valid user, might be weird state
                throw new Error("Invalid user data");
            }
        } catch (e) {
            // Token likely invalid
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const publicRoutes = ['/login', '/signup'];
        const isPublicRoute = publicRoutes.includes(pathname);

        // Client-side route protection
        // If we have no token and are on a protected route, redirect
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        if (!token && !isPublicRoute) {
            setIsLoading(false);
            router.push('/login');
            return;
        }

        // If we are on public route and have token, maybe redirect to dashboard?
        if (token && isPublicRoute) {
             router.push('/dashboard');
             // We still fetch user to confirm valid token
        }

        checkUser();
    }, [pathname]); // Depend on pathname to re-check if user navigates to protected route manually

    // Event Listeners for Logout Sync
    useEffect(() => {
        // 1. Listen for API 401 events (from same tab)
        const handleAuthLogoutEvent = () => {
            performLogout(false); // don't call API again if we are forced out
        };

        // 2. Listen for Multi-tab Logout (BroadcastChannel)
        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        channel.onmessage = (event) => {
            if (event.data === 'logout') {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.push('/login');
            }
        };

        window.addEventListener('auth:logout', handleAuthLogoutEvent);

        return () => {
            window.removeEventListener('auth:logout', handleAuthLogoutEvent);
            channel.close();
        };
    }, [router]);


    const performLogout = async (callApi: boolean = true) => {
        if (callApi) {
            try {
                await auth.logout();
            } catch (e) {
                console.error("Logout API failed", e);
            }
        }

        // Broadcast to other tabs
        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        channel.postMessage('logout');
        channel.close();

        // Local cleanup
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
    };

    const handleAuthSuccess = async () => {
        // Re-fetch user data to ensure state is fresh (critical for Google Auth first login)
        await checkUser();
        router.push('/dashboard');
    };

    const login = async (email: string, password: string) => {
        const response = await auth.login(email, password);
        if (response.tokens) {
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
        }
        await handleAuthSuccess();
    };

    const signupAndLogin = async (email: string, password: string, name: string) => {
        const response = await auth.signup(email, password, name);
        if (response.tokens) {
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
        }
        await handleAuthSuccess();
    };

    const loginWithGoogle = () => {
        // Use OAuth redirect flow - NO fetch, NO CORS
        const { googleAuth } = require('@/lib/googleAuth');
        googleAuth.initiateLogin();
        // User will be redirected to Google, then back to our callback URL
    };
    const logout = () => {
        performLogout(true);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            signupAndLogin,
            loginWithGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
