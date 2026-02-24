import axios from 'axios';

// Vite uses import.meta.env.VITE_* — falls back to '' which is forwarded
// by the Vite dev-server proxy to http://localhost:8001
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(async (config) => {
    // Internal Project - Always Authenticated
    const token = localStorage.getItem('studyos_token') || 'internal-token';
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Universal error handler with retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        
        // Retry logic for transient errors
        if (!config || !config.retry) config.retry = 0;
        
        const MAX_RETRIES = 2;
        if (config.retry < MAX_RETRIES && (!response || response.status >= 500)) {
            config.retry += 1;
            const delay = config.retry * 1000;
            console.warn(`[API] Retry attempt ${config.retry} after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return api(config);
        }

        if (response?.status === 401) {
            // Uncomment to auto-logout on 401
            // localStorage.removeItem('studyos_token');
            // window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Domains API
export const domainsApi = {
    getAll: () => api.get('/domains'),
    getBySlug: (slug) => api.get(`/domains/${slug}`),
    getResources: (slug, category) => {
        const params = category ? { category } : {};
        return api.get(`/domains/${slug}/resources`, { params });
    }
};

// Resources API
export const resourcesApi = {
    getById: (id) => api.get(`/resources/${id}`),
    upvote: (id) => api.post(`/resources/${id}/upvote`)
};

// Progress API
export const progressApi = {
    getAll: () => api.get('/progress'),
    startDomain: (slug) => api.post(`/progress/${slug}/start`),
    completeResource: (slug, resourceId) => 
        api.post(`/progress/${slug}/complete-resource/${resourceId}`)
};

// Personal Plan API
export const planApi = {
    getAll: () => api.get('/personal-plan'),
    add: (resourceId) => api.post('/personal-plan/add', { resource_id: resourceId }),
    remove: (resourceId) => api.delete(`/personal-plan/${resourceId}`),
    complete: (resourceId) => api.put(`/personal-plan/${resourceId}/complete`)
};

// User Stats API
export const userApi = {
    getStats: () => api.get('/user/stats'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

export default api;
