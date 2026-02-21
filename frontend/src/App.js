import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import HubPage from "./pages/HubPage";
import DomainPage from "./pages/DomainPage";
import ToolkitPage from "./pages/ToolkitPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/hub" element={
                            <ProtectedRoute>
                                <HubPage />
                            </ProtectedRoute>
                        } />
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
                        <Route path="/auth" element={<AuthPage />} />
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
        </AuthProvider>
    );
}

export default App;
