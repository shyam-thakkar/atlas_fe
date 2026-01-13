import { apiRequest } from './api';

export interface UserResponse {
  email: string;
  name?: string;
  id?: number | string;
  profile_image?: string;
  resume_process_count?: number;
  user_tier?: 'beta' | 'free' | 'pro' | 'enterprise' | 'lifetime';
  plan_type?: 'pro_monthly' | 'lifetime' | null;
  subscription_expiry?: string | null; // ISO date string
  authentication_method?: string;
  tier?: 'beta' | 'free' | 'pro' | 'enterprise' | 'lifetime'; // Deprecated in favor of user_tier
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

  // Validate session and get user info
  getCurrentUser: async () => {
    return apiRequest<UserResponse>('/api/auth/me/', {
      method: 'GET',
    });
  }
};
