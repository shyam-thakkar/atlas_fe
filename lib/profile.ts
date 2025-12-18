import { apiRequest } from './api';
import { StructuredPortfolio, PipelineStatus } from '@/types/portfolio';

export interface ResumeResponse {
    id: number;
    original_filename: string;
    uploaded_at: string;
    file: string;
    extracted_text?: string;
}

export const profile = {
    getStatus: async () => {
        return apiRequest<PipelineStatus>('/api/profile/resume/status/', {
            method: 'GET',
        });
    },

    uploadResume: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiRequest<ResumeResponse>('/api/profile/resume/', {
            method: 'POST',
            body: formData,
        });
    },

    getResume: async () => {
        return apiRequest<ResumeResponse>('/api/profile/resume/', {
            method: 'GET',
        });
    },

    getExtractedText: async () => {
        return apiRequest<{ extracted_text: string }>('/api/profile/resume/extracted-text/', {
            method: 'GET',
        });
    },

    getStructuredPortfolio: async () => {
        return apiRequest<StructuredPortfolio>('/api/profile/portfolio/structured/', {
            method: 'GET',
        });
    },

    updateStructuredPortfolio: async (section: keyof StructuredPortfolio, data: any) => {
        const patchBody = { [section]: data };
        return apiRequest<StructuredPortfolio>('/api/profile/portfolio/structured/', {
            method: 'PATCH',
            body: patchBody,
        });
    },

    saveFullPortfolio: async (data: StructuredPortfolio) => {
        return apiRequest<StructuredPortfolio>('/api/profile/portfolio/structured/', {
            method: 'PATCH',
            body: data,
        });
    },

    confirmReview: async () => {
        return apiRequest<any>('/api/profile/portfolio/confirm/', {
            method: 'POST',
        });
    },

    // Search for a technology by exact code_name match
    searchTech: async (query: string) => {
        return apiRequest<{
            id: number;
            display_name: string;
            code_name: string;
            icon_path: string;
            icon_source_url?: string;
            doc_url?: string;
            color_variant?: string;
        } | { error: string }>(`/api/profile/tech/search/?q=${encodeURIComponent(query)}`, {
            method: 'GET',
        });
    },
};
