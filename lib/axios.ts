import { env } from '@/lib/env';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenService } from '@/services/storage/token.service';

// --- Types ---

interface ApiErrorResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}

// --- Configuration ---

/**
 * Production-ready Axios instance
 *
 * Features:
 * - Strict typing
 * - Centralized configuration via env vars
 * - Automatic token injection
 * - Global error handling & normalization
 * - Automatic 401 handling
 * - 10s timeout
 */
const api: AxiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Specific for Laravel Sanctum/CSRF if needed, otherwise harmless
});

// --- Interceptors ---

/**
 * Request Interceptor
 * Injects the Authorization header if a token exists.
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Only access tokenService on client-side
        if (typeof window !== 'undefined') {
            const token = tokenService.getToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles success and global error scenarios (like 401s).
 */
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config;

        // Handle Network Errors
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        const { status, data } = error.response;

        // Handle 401 Unauthorized
        if (status === 401) {
            // Allow login errors to pass through (e.g. "Invalid credentials")
            if (originalRequest && originalRequest.url?.endsWith('/login')) {
                const message = data?.message || 'Invalid credentials';
                return Promise.reject(new Error(message));
            }

            // Prevent infinite loops if we are already on auth pages
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
                tokenService.clearAll();
                // Redirect to login
                window.location.href = `/auth/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
            }
            return Promise.reject(new Error('Session expired. Please log in again.'));
        }

        // Handle 403 Forbidden
        if (status === 403) {
            return Promise.reject(new Error('You do not have permission to perform this action.'));
        }

        // Handle 404 Not Found
        if (status === 404) {
            return Promise.reject(new Error('The requested resource was not found.'));
        }

        // Handle 422 Validation Errors (Laravel style)
        if (status === 422) {
            // You might want to return the raw object for form libraries to parse,
            // but here we normalize to a string for simple alerts.
            // Customize based on your form handling strategy.
            const message = data?.message || 'Validation failed';
            return Promise.reject(new Error(message));
        }

        // Handle 500 Server Errors
        if (status >= 500) {
            return Promise.reject(new Error('Internal server error. Please try again later.'));
        }

        // Fallback error message normalization
        const message = data?.message || data?.error || `Request failed with status ${status}`;
        return Promise.reject(new Error(message));
    }
);

export default api;
