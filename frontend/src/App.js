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

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/hub" element={<HubPage />} />
                        <Route path="/domain/:slug" element={<DomainPage />} />
                        <Route path="/domain/:slug/toolkit" element={<ToolkitPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
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
