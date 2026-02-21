import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { userApi } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('studyos_token'));

    // Fetch current user
    const fetchUser = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // Clear invalid token if it was a 401
            if (error.response?.status === 401) {
                localStorage.removeItem('studyos_token');
                setToken(null);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Register
    const register = async (email, password, name) => {
        const response = await api.post('/auth/register', {
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
        const response = await api.post('/auth/login', {
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
        const response = await userApi.updateProfile(data);
        // Refresh local user state
        await fetchUser();
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
