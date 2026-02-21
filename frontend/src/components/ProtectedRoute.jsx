import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to auth page, but save the current location they were trying to go to
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}
