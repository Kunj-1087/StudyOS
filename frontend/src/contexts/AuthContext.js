import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('studyos_token'));

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Fetch current user
    const fetchUser = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/me`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // Clear invalid token
            localStorage.removeItem('studyos_token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Register
    const register = async (email, password, name) => {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            name
        });
        
        const { access_token } = response.data;
        localStorage.setItem('studyos_token', access_token);
        setToken(access_token);
        
        // Fetch user data
        await fetchUser();
        
        return response.data;
    };

    // Login
    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        
        const { access_token } = response.data;
        localStorage.setItem('studyos_token', access_token);
        setToken(access_token);
        
        // Fetch user data
        await fetchUser();
        
        return response.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('studyos_token');
        setToken(null);
        setUser(null);
    };

    // Update profile
    const updateProfile = async (data) => {
        const response = await axios.put(`${API_URL}/auth/profile`, data);
        setUser(response.data.user);
        return response.data;
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
