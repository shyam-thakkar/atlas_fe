import { apiRequest } from './api';
import {
    UsernameCheckResponse,
    UsernameInfoResponse,
    UsernameChangeResponse,
    PublishStatusResponse,
    PublishResponse,
    UnpublishResponse,
    PublishHistoryResponse,
    PublicPortfolioResponse,
} from '@/types/publish';

// URL template for display purposes - actual URLs come from backend
const PORTFOLIO_URL_TEMPLATE = process.env.NEXT_PUBLIC_PORTFOLIO_URL_TEMPLATE || 'http://localhost:3000/portfolio/{username}';

export const publish = {
    /**
     * Check if a username is available
     */
    checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
        return apiRequest<UsernameCheckResponse>(
            `/api/profile/username/check/?username=${encodeURIComponent(username)}`,
            { method: 'GET' }
        );
    },

    /**
     * Get current user's username info and tier limits
     */
    getUsernameInfo: async (): Promise<UsernameInfoResponse> => {
        return apiRequest<UsernameInfoResponse>('/api/profile/username/info/', {
            method: 'GET',
        });
    },

    /**
     * Change username (counts against tier limit)
     */
    changeUsername: async (username: string): Promise<UsernameChangeResponse> => {
        return apiRequest<UsernameChangeResponse>('/api/profile/username/change/', {
            method: 'POST',
            body: { username },
        });
    },

    /**
     * Get current publish status
     */
    getPublishStatus: async (): Promise<PublishStatusResponse> => {
        return apiRequest<PublishStatusResponse>('/api/profile/portfolio/publish/status/', {
            method: 'GET',
        });
    },

    /**
     * Publish portfolio (with username for first publish, without for republish)
     */
    publishPortfolio: async (username?: string): Promise<PublishResponse> => {
        const body = username ? { username } : {};
        return apiRequest<PublishResponse>('/api/profile/portfolio/publish/', {
            method: 'POST',
            body,
        });
    },

    /**
     * Unpublish portfolio (keeps username)
     */
    unpublishPortfolio: async (): Promise<UnpublishResponse> => {
        return apiRequest<UnpublishResponse>('/api/profile/portfolio/unpublish/', {
            method: 'POST',
        });
    },

    /**
     * Get publish version history
     */
    getPublishHistory: async (): Promise<PublishHistoryResponse> => {
        return apiRequest<PublishHistoryResponse>('/api/profile/portfolio/publish/history/', {
            method: 'GET',
        });
    },

    /**
     * Get public portfolio by username (for preview)
     */
    getPublicPortfolio: async (username: string): Promise<PublicPortfolioResponse> => {
        return apiRequest<PublicPortfolioResponse>(`/api/public/portfolio/${username}/`, {
            method: 'GET',
        });
    },

    /**
     * Generate preview URL for display (before publish - actual URL comes from backend)
     * Only used for showing user what their URL will look like
     */
    getPreviewUrl: (username: string): string => {
        return PORTFOLIO_URL_TEMPLATE.replace('{username}', username);
    },

    /**
     * Get the domain suffix for display (extracted from template)
     */
    getUrlSuffix: (): string => {
        // Extract the part after {username} from template
        const template = PORTFOLIO_URL_TEMPLATE;
        const parts = template.split('{username}');
        if (parts.length > 1) {
            return parts[1]; // e.g., ".aifolio.in" or "" for path-based
        }
        return '';
    },

    /**
     * Get the URL prefix for display (extracted from template)
     */
    getUrlPrefix: (): string => {
        const template = PORTFOLIO_URL_TEMPLATE;
        const parts = template.split('{username}');
        return parts[0] || ''; // e.g., "https://" or "http://localhost:3000/portfolio/"
    },

    /**
     * Open published portfolio in new tab - uses the actual URL from backend
     */
    openPublishedPortfolio: (publicUrl: string): void => {
        window.open(publicUrl, '_blank', 'noopener,noreferrer');
    },
};
