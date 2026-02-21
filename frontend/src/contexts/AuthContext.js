import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { userApi } from '../lib/api';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sync session with state
    useEffect(() => {
        // Check active sessions and sets the user
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Fetch extra profile data from our backend
                await fetchUserData(session.user.id);
            }
            setLoading(false);
        };

        initializeAuth();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                await fetchUserData(session.user.id);
            } else {
                setUser(null);
                localStorage.removeItem('studyos_token');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch profile data from backend/public.users table
    const fetchUserData = async (supabaseId) => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
            // If the user exists in Supabase Auth but not in our public.users table yet
            // we might need to provision them. For now, just set basic info.
        }
    };

    // Register
    const register = async (email, password, name) => {
        console.log("Starting registration for:", email);
        
        // 1. Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });

        if (error) {
            console.error("Supabase sign-up failed:", error.message);
            throw error;
        }

        // 2. Call backend to ensure user is in public.users table
        // We still use our backend /auth/register but it should be updated 
        // to handle existing Supabase users if we want to be clean.
        // For now, we'll call it to create the profile.
        try {
            await api.post('/auth/register', {
                email,
                password,
                name
            });
        } catch (backendError) {
            console.warn("Backend profile creation failed (might already exist):", backendError);
        }
        
        return data;
    };

    // Login
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Backend will verify the token in subsequent requests via axios interceptor
        await fetchUserData(data.user.id);
        
        return data;
    };

    // Logout
    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('studyos_token');
    };

    // Update profile
    const updateProfile = async (data) => {
        const response = await userApi.updateProfile(data);
        if (user) await fetchUserData(user.id);
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
