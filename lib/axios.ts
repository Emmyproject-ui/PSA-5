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
    timeout: 30000, // 30 seconds — XAMPP/Laravel can be slow on cold start
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Pure token auth — no cookies needed
});

console.log('Axios initialized with baseURL:', api.defaults.baseURL);

// --- Interceptors ---

/**
 * Request Interceptor
 * Injects the Authorization header if a token exists.
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        // Never send Authorization header on public auth endpoints
        const publicPaths = ['/login', '/register', '/signup'];
        const isPublicAuth = publicPaths.some(path => config.url?.endsWith(path));

        if (typeof window !== 'undefined' && !isPublicAuth) {
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
        console.log(`[Axios Response] ${response.status} ${response.config.url}`);
        return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config;
        console.error(`[Axios Error] ${error.code} | ${error.message} | URL: ${originalRequest?.url}`);

        // Handle request timeout and low-level transport errors
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timed out after 30 seconds. Check if the backend is reachable from the browser network tab.');
            return Promise.reject(new Error('Request timed out. Please try again.'));
        }

        if (error.code === 'ERR_CANCELED') {
            return Promise.reject(new Error('Request was canceled.'));
        }

        if (!error.response) {
            return Promise.reject(new Error('Unable to reach the server. Please check API availability and CORS configuration.'));
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
