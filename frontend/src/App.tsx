import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import HubPage from "./pages/HubPage";
import DomainPage from "./pages/DomainPage";
import ToolkitPage from "./pages/ToolkitPage";
import ProfilePage from "./pages/ProfilePage";

import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hub" element={<HubPage />} />
          <Route path="/dashboard" element={<HubPage />} />
          <Route path="/domains" element={<DomainPage />} />
          <Route path="/domain/:slug" element={<DomainPage />} />
          <Route path="/domain/:slug/toolkit" element={<ToolkitPage />} />
          <Route path="/toolkit" element={<ToolkitPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#0D110C',
            border: '1px solid rgba(200, 244, 0, 0.15)',
            color: '#EEFCE8'
          }
        }}
      />
    </div>
  );
}

export default App;
