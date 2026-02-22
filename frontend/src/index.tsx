import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";

// Debug Error Handler (development-only)
if (import.meta.env.DEV) {
  window.onerror = function(message, source, lineno, colno, error) {
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '0';
    debugDiv.style.left = '0';
    debugDiv.style.width = '100%';
    debugDiv.style.background = 'rgba(255, 0, 0, 0.9)';
    debugDiv.style.color = 'white';
    debugDiv.style.padding = '20px';
    debugDiv.style.zIndex = '99999';
    debugDiv.style.fontFamily = 'monospace';
    debugDiv.innerText = `CRITICAL ERROR: ${message}\nSource: ${source}\nLine: ${lineno}`;
    document.body.appendChild(debugDiv);
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
