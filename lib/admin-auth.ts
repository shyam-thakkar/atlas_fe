// Admin-specific authentication API
import { apiRequest } from './api';
import type { UserResponse } from './auth';

export interface AdminAuthResponse {
    message: string;
    user: {
        id: number;
        email: string;
        name: string;
        is_staff: boolean;
        is_superuser: boolean;
    };
    tokens: {
        access: string;
        refresh: string;
    };
}

export const adminAuth = {
    login: async (email: string, password: string): Promise<AdminAuthResponse> => {
        return apiRequest<AdminAuthResponse>('/api/admin/auth/login/', {
            method: 'POST',
            body: { email, password },
        });
    },

    getCurrentUser: async (): Promise<UserResponse> => {
        return apiRequest<UserResponse>('/api/admin/auth/me/', {
            method: 'GET',
        });
    },

    logout: async (): Promise<void> => {
        const refreshToken = localStorage.getItem('refresh_token');
        return apiRequest<void>('/api/admin/auth/logout/', {
            method: 'POST',
            body: { refresh: refreshToken },
        });
    },
};
