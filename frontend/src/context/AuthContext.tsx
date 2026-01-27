import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, getAuth } from 'firebase/auth';
// Import initialized app if we had it, or use getAuth()

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For MVP Mocking purposes if Firebase isn't fully configured
        // We'll simulate a check. Use 'true' to simulate logged in for dev, 'false' for flow test.

        /* 
        // REAL FIREBASE IMPLEMENTATION:
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return unsubscribe;
        */

        // MOCK IMPLEMENTATION
        const checkAuth = async () => {
            // Simulate checking local storage or token
            setTimeout(() => {
                // Mock User
                setUser({ uid: '1', email: 'demo@studyos.com', displayName: 'Demo Student' } as User);
                // setUser(null); // Uncomment to test logged out
                setLoading(false);
            }, 500);
        };
        checkAuth();

    }, []);

    const logout = async () => {
        const auth = getAuth();
        await auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
