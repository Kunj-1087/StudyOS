import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import LandingPage from "./pages/LandingPage";
import HubPage from "./pages/HubPage";
import DomainPage from "./pages/DomainPage";
import ToolkitPage from "./pages/ToolkitPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Protected Routes */}
                    <Route path="/hub" element={
                        <ProtectedRoute>
                            <HubPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Aliasing /dashboard to /hub */}
                    <Route path="/dashboard" element={<Navigate to="/hub" replace />} />

                    <Route path="/domain/:slug" element={
                        <ProtectedRoute>
                            <DomainPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/domain/:slug/toolkit" element={
                        <ProtectedRoute>
                            <ToolkitPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster 
                position="bottom-right" 
                toastOptions={{
                    style: {
                        background: '#13161C',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#E2E8F0'
                    }
                }}
            />
        </div>
    );
}

export default App;
