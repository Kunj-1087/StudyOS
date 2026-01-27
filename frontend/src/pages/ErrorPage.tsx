import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
    const navigate = useNavigate();

    const handleHome = () => {
        if (resetErrorBoundary) resetErrorBoundary();
        navigate('/');
        window.location.reload(); // Hard reset to clear state if needed
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="text-red-500">
                    <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900">
                    Oops! Something went wrong.
                </h1>

                <p className="text-gray-600">
                    We encountered an unexpected error.
                </p>

                {import.meta.env.DEV && error && (
                    <div className="bg-red-50 p-4 rounded-md text-left overflow-auto max-h-48">
                        <p className="text-xs font-mono text-red-800 break-words">{error.message}</p>
                        <p className="text-xs font-mono text-red-500 mt-1 whitespace-pre-wrap">{error.stack}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {resetErrorBoundary && (
                        <Button onClick={resetErrorBoundary}>
                            Try Again
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleHome}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
