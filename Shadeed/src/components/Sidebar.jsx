import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Activity, BarChart2, PieChart,
  History, Info, X, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

const NAV = [
  { to: "/",           icon: LayoutDashboard, label: "Overview" },
  { to: "/prediction", icon: Activity,        label: "Prediction" },
  { to: "/comparison", icon: BarChart2,       label: "Model Comparison" },
  { to: "/analytics",  icon: PieChart,        label: "Analytics" },
  { to: "/history",    icon: History,         label: "History" },
  { to: "/about",      icon: Info,            label: "About" },
];

export default function Sidebar({ open, onClose, onToggle }) {
  return (
    <aside
      id="oncolens-navigation"
      aria-label="Main navigation"
      className={`
        app-drawer fixed inset-y-0 left-0 z-40
        flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm
        ${open ? "is-open" : "is-closed"}
      `}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="drawer-brand flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="OncoLens mark" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
          <div className="text-sm font-bold text-navy-800 leading-tight">OncoLens</div>
        </div>
        <button onClick={onClose} className="drawer-close p-1 rounded-lg hover:bg-slate-100" aria-label="Close navigation drawer">
          <X size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Navigation
        </div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => { if (window.matchMedia("(max-width: 767px)").matches) onClose(); }}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        onClick={onToggle}
        className="drawer-edge-toggle"
        aria-label={open ? "Close navigation drawer" : "Open navigation drawer"}
        aria-expanded={open}
        aria-controls="oncolens-navigation"
        title={open ? "Close navigation drawer" : "Open navigation drawer"}
      >
        {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
      </button>
    </aside>
  );
}
