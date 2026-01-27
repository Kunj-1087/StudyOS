import axios from 'axios';
import { ENV } from '../config/env';
// import { getAuth } from 'firebase/auth'; // TODO: integrate when Auth is ready

export const apiClient = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Auth Token
apiClient.interceptors.request.use(async (config) => {
    // const auth = getAuth();
    // const user = auth.currentUser;
    // if (user) {
    //   const token = await user.getIdToken();
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const API = {
    get: (url: string) => apiClient.get(url).then(res => res.data),
    post: (url: string, data: any) => apiClient.post(url, data).then(res => res.data),
    put: (url: string, data: any) => apiClient.put(url, data).then(res => res.data),
    delete: (url: string) => apiClient.delete(url).then(res => res.data),
};
