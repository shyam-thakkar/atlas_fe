
export class APIError extends Error {
    status: number;
    data: any;

    constructor(status: number, data: any, message?: string) {
        super(message || 'An unexpected error occurred');
        this.status = status;
        this.data = data;
    }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
    body?: any;
}

export const AUTH_EVENT_CHANNEL = 'auth_channel';

/**
 * Core fetch function that handles:
 * - Authorization headers (Bearer token)
 * - 401 Token Refresh + Retry
 * - Network errors
 * Returns the raw Response object.
 */
export async function fetchWithAuth(endpoint: string, options: FetchOptions = {}): Promise<Response> {
    const { body, headers: customHeaders, ...customConfig } = options;
    const headers = new Headers(customHeaders);
    
    // Check if body is FormData
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    if (!headers.has('Content-Type') && !isFormData) {
        headers.set('Content-Type', 'application/json');
    }

    // Attach Access Token from LocalStorage
    if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
    }

    const config: RequestInit = {
        method: body ? 'POST' : 'GET',
        // credentials: 'include',
        ...customConfig,
        headers,
    };

    if (body) {
         config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        let response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Handle 401 Unauthorized - Attempt Refresh
        if (response.status === 401) {
            const isAuthEndpoint = endpoint.includes('/api/auth/login/') ||
                endpoint.includes('/api/auth/logout/') ||
                endpoint.includes('/api/auth/token/refresh/') ||
                endpoint.includes('/api/auth/signup/');

            if (!isAuthEndpoint) {
                try {
                    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

                    if (refreshToken) {
                        const refreshResponse = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refresh: refreshToken })
                        });

                        if (refreshResponse.ok) {
                            const data = await refreshResponse.json();
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('access_token', data.access);
                                if (data.refresh) {
                                  localStorage.setItem('refresh_token', data.refresh);
                                }
                            }

                            // Retry original request with new token
                            const newHeaders = new Headers(headers);
                            newHeaders.set('Authorization', `Bearer ${data.access}`);
                            config.headers = newHeaders;
                            
                            response = await fetch(`${BASE_URL}${endpoint}`, config);
                        } else {
                            throw new Error("Refresh failed");
                        }
                    } else {
                        throw new Error("No refresh token");
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.dispatchEvent(new Event('auth:logout'));
                    }
                }
            }
        }

        return response;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Network error');
    }
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    try {
        const response = await fetchWithAuth(endpoint, options);

        if (response.status === 204) {
            return {} as T;
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            handleErrorResponse(response.status, data);
        }

        return data as T;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw error; // Re-throw generic errors
    }
}

/**
 * specialized fetch for polling with ETag support
 */
export async function apiGetWithETag<T>(endpoint: string, currentEtag?: string | null): Promise<{ data: T | null; etag: string | null; status: number }> {
    const headers: Record<string, string> = {};
    if (currentEtag) {
        headers['If-None-Match'] = currentEtag;
    }

    try {
        const response = await fetchWithAuth(endpoint, {
            method: 'GET',
            headers
        });

        if (response.status === 304) {
            return { data: null, etag: currentEtag || null, status: 304 };
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            handleErrorResponse(response.status, data);
        }

        const newEtag = response.headers.get('ETag');
        return { data: data as T, etag: newEtag, status: 200 };

    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw error;
    }
}

function handleErrorResponse(status: number, data: any) {
    let errorMessage = 'An error occurred';
    if (data && typeof data === 'object') {
        if (data.detail) errorMessage = data.detail;
        else if (data.message) errorMessage = data.message;
        else if (data.error) errorMessage = data.error;
        else if (Object.keys(data).length > 0) {
            const firstKey = Object.keys(data)[0];
            const firstError = data[firstKey];
            errorMessage = `${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
        }
    }
    throw new APIError(status, data, errorMessage);
}
