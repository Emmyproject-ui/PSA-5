/**
 * Secure Storage Service
 * Abstracts localStorage to allow future migration to httpOnly cookies
 * Central management of all client-side storage
 */

const STORAGE_PREFIX = 'ggnf_';
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const USER_KEY = `${STORAGE_PREFIX}user`;

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
}

class TokenService {
    /**
     * Get authentication token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            return null;
        }
    }

    /**
     * Set authentication token
     */
    setToken(token: string): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error("Error saving token", e);
        }
    }

    /**
     * Remove authentication token
     */
    removeToken(): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (e) {
            // Ignore errors on removal
        }
    }

    /**
     * Get stored user data
     */
    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        try {
            const userData = localStorage.getItem(USER_KEY);
            if (!userData) return null;
            return JSON.parse(userData) as User;
        } catch (error) {
            this.removeUser(); // Corrupted data, clear it
            return null;
        }
    }

    /**
     * Set user data
     */
    setUser(user: User): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (e) {
            console.error("Error saving user data", e);
        }
    }

    /**
     * Remove user data
     */
    removeUser(): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(USER_KEY);
        } catch (e) {
            // Ignore
        }
    }

    /**
     * Clear all auth-related storage
     */
    clearAll(): void {
        this.removeToken();
        this.removeUser();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: User['role']): boolean {
        const user = this.getUser();
        return user?.role === role;
    }
}

/**
 * Singleton instance
 */
export const tokenService = new TokenService();
