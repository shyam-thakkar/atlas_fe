import { apiRequest } from './api';
import { StructuredPortfolio } from '@/types/portfolio';

export interface ResumeResponse {
    id: number;
    original_filename: string;
    uploaded_at: string;
    file: string;
    extracted_text?: string; // Optional as it might not be present immediately
}

export const profile = {
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
        // Construct the patch body dynamically based on the section
        const patchBody = { [section]: data };
        return apiRequest<StructuredPortfolio>('/api/profile/portfolio/structured/', {
            method: 'PATCH',
            body: patchBody,
        });
    }
};
