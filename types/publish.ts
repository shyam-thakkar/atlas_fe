// Publishing Types for Portfolio Publishing System

export interface UsernameCheckResponse {
    available: boolean;
    username: string;
    reason: string | null;
}

export interface UsernameInfoResponse {
    username: string | null;
    has_username: boolean;
    can_change: boolean;
    changes_used: number;
    changes_remaining: number;
    tier: 'beta' | 'free' | 'pro' | 'enterprise';
}

export interface UsernameChangeResponse {
    success: boolean;
    message: string;
    username: string;
    public_url: string;
    changes_remaining: number;
}

export interface PublishStatusResponse {
    is_published: boolean;
    username: string | null;
    public_url: string | null;
    current_version: number | null;
    last_published_at: string | null;
    can_publish: boolean;
    can_republish: boolean;
}

export interface PublishResponse {
    success: boolean;
    message: string;
    first_publish: boolean;
    username: string;
    public_url: string;
    version: number;
}

export interface UnpublishResponse {
    success: boolean;
    message: string;
}

export interface PublishedSnapshot {
    version: number;
    published_at: string;
    is_active: boolean;
}

export interface PublishHistoryResponse {
    username: string;
    total_versions: number;
    active_version: number | null;
    history: PublishedSnapshot[];
}

export interface PublicPortfolioResponse {
    username: string;
    version: number;
    published_at: string;
    portfolio: {
        hero: any;
        socials: any;
        tech_stack: string[];
        experience: any[];
        education: any[];
        projects: any[];
        about: any;
        contact: any;
    };
}
