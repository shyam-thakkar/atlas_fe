import { apiRequest } from './api';

export const googleAuth = {
    login: async (idToken: string) => {
        return apiRequest<any>('/api/auth/google/', {
            method: 'POST',
            body: { id_token: idToken },
        });
    }
};
