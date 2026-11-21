import React from "react";
import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const TITLES = {
  "/":           { title: "Overview Dashboard",   sub: "Project summary and dataset statistics" },
  "/prediction": { title: "Prediction", sub: "Enter measurements to classify a tumor" },
  "/comparison": { title: "Model Comparison",     sub: "Side-by-side algorithm performance metrics" },
  "/analytics":  { title: "Model Analytics",      sub: "Confusion matrices and feature importance" },
  "/history":    { title: "Prediction History",   sub: "Locally stored prediction records" },
  "/about":      { title: "About This Project",   sub: "Methodology, dataset, and team information" },
};

export default function TopBar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const info = TITLES[pathname] ?? TITLES["/"];

  return (
    <header className="top-toolbar sticky top-0 z-10 border-b px-4 md:px-8 py-3 flex items-center gap-4">
      <div className="toolbar-heading flex-1 min-w-0">
        <h1 className="font-semibold text-slate-900 truncate">{info.title}</h1>
        <p className="text-xs text-slate-500 truncate">{info.sub}</p>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        className="theme-toggle flex-shrink-0"
        role="switch"
        aria-checked={theme === "dark"}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <span className="theme-toggle-icon"><Sun size={15} /></span>
        <span className="theme-toggle-track"><span className="theme-toggle-thumb" /></span>
        <span className="theme-toggle-icon"><Moon size={14} /></span>
      </button>
    </header>
  );
}
