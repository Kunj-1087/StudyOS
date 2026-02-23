import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import HubPage from "./pages/HubPage";
import DomainPage from "./pages/DomainPage";
import ToolkitPage from "./pages/ToolkitPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/hub" element={<ProtectedRoute><HubPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><HubPage /></ProtectedRoute>} />
          <Route path="/domains" element={<ProtectedRoute><DomainPage /></ProtectedRoute>} />
          <Route path="/domain/:slug" element={<ProtectedRoute><DomainPage /></ProtectedRoute>} />
          <Route path="/domain/:slug/toolkit" element={<ProtectedRoute><ToolkitPage /></ProtectedRoute>} />
          <Route path="/toolkit" element={<ProtectedRoute><ToolkitPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
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
