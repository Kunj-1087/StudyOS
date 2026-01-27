import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from '../pages/ErrorPage';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error('Uncaught error:', error, errorInfo);
        }
        // TODO: Send to logging service (e.g. Sentry) in production
    }

    public resetErrorBoundary = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    error={this.state.error}
                    resetErrorBoundary={this.resetErrorBoundary}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
