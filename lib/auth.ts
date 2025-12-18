import { apiRequest } from './api';

export interface UserResponse {
  email: string;
  name?: string;
  id?: number | string;
  profile_image?: string;
}

export interface AuthResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user?: UserResponse; // Use this if backend returns user info on login, otherwise fetch separately
}

export const auth = {
  signup: async (email: string, password: string, name: string) => {
    return apiRequest<AuthResponse>('/api/auth/signup/', {
      method: 'POST',
      body: { email, password, name },
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<AuthResponse>('/api/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
  },

  logout: async () => {
    // Backend logout (blacklist token if implemented, or just ignored by stateless)
    // We still call it just in case backend does something
    return apiRequest<void>('/api/auth/logout/', {
      method: 'POST',
    });
  },

  googleLogin: async (idToken: string) => {
    const { googleAuth } = await import('./googleAuth');
    return googleAuth.login(idToken) as Promise<AuthResponse>;
  },

  // Validate session and get user info
  getCurrentUser: async () => {
    return apiRequest<UserResponse>('/api/auth/me/', {
      method: 'GET',
    });
  }
};
