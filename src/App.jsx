import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Overview from "./pages/Overview";
import Prediction from "./pages/Prediction";
import ModelComparison from "./pages/ModelComparison";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import About from "./pages/About";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Keep an intentionally collapsed drawer across viewport changes.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const syncDrawer = event => setSidebarOpen(false);
    media.addEventListener?.("change", syncDrawer);
    return () => media.removeEventListener?.("change", syncDrawer);
  }, []);

  // Close the mobile drawer after navigation.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell flex h-screen overflow-hidden bg-slate-50 ${sidebarOpen ? "drawer-open" : "drawer-closed"}`} onKeyDown={event => { if (event.key === "Escape") setSidebarOpen(false); }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(value => !value)} />

      <div className={`drawer-scrim ${sidebarOpen ? "is-open" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className={`app-main flex flex-col flex-1 min-w-0 overflow-hidden ${sidebarOpen ? "drawer-is-open" : "drawer-is-closed"}`}>
        <TopBar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div key={location.pathname} className="page-enter">
          <Routes>
            <Route path="/"               element={<Overview />} />
            <Route path="/prediction"     element={<Prediction />} />
            <Route path="/comparison"     element={<ModelComparison />} />
            <Route path="/analytics"      element={<Analytics />} />
            <Route path="/history"        element={<History />} />
            <Route path="/about"          element={<About />} />
            <Route path="*"              element={<Navigate to="/" replace />} />
          </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
