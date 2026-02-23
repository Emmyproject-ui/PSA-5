import api from './axios';

// --- Types ---
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

// --- Auth Service ---
export const authApi = {
    login: (credentials: any) => api.post('/login', credentials).then(res => res.data.data),
    register: (data: any) => api.post('/register', data).then(res => res.data.data),
    logout: () => api.post('/logout').then(res => res.data),
    me: () => api.get('/me').then(res => res.data.data),
};

// --- Customer Service ---
export const customerApi = {
    donate: (data: any) => api.post('/donate', data).then(res => res.data?.data),
    volunteer: (data: any) => api.post('/volunteer', data).then(res => res.data?.data),
    getMyDonations: () => api.get('/my-donations').then(res => res.data?.data?.data || []),
    getMyVolunteering: () => api.get('/my-volunteering').then(res => res.data?.data?.data || []),
    updateProfile: (data: any) => api.put('/profile', data).then(res => res.data?.data),
    updatePassword: (data: any) => api.put('/password', data).then(res => res.data),
};

// --- Admin Service ---
export const adminApi = {
    getUsers: () => api.get('/admin/users').then(res => res.data?.data?.data || []),
    getDonations: () => api.get('/admin/donations').then(res => res.data?.data?.data || []),
    getPayments: () => api.get('/admin/payments').then(res => res.data?.data?.data || []),
    getContributions: () => api.get('/admin/contributions').then(res => res.data?.data || []), // Non-paginated array
    getVolunteers: () => api.get('/admin/volunteers').then(res => res.data?.data?.data || []),
    getMessages: () => api.get('/admin/messages').then(res => res.data?.data?.data || []),
    getStats: () => api.get('/admin/stats').then(res => res.data?.data || {}),
    getActivityLogs: () => api.get('/admin/activity-logs').then(res => res.data?.data?.data || []),
    getSecurityLogs: () => api.get('/admin/security-logs').then(res => res.data?.data?.data || []),
};

// --- Settings Service ---
export const settingsApi = {
    getSessions: () => api.get('/settings/sessions').then(res => res.data?.data || []),
    revokeSession: (id: number) => api.delete(`/settings/sessions/${id}`).then(res => res.data),
    revokeOtherSessions: () => api.delete('/settings/sessions').then(res => res.data),
    exportData: () => api.get('/settings/export').then(res => res.data?.data),
};

// --- Contact Service ---
export const contactApi = {
    sendMessage: (data: any) => api.post('/contact', data).then(res => res.data?.data),
};

// Default export
export { api };
export default {
    auth: authApi,
    customer: customerApi,
    admin: adminApi,
    contact: contactApi,
    settings: settingsApi,
};
