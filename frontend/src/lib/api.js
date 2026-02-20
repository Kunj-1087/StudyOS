import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('studyos_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    getStats: () => api.get('/user/stats')
};

export default api;
