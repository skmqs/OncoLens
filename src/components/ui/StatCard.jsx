import React from "react";

export default function StatCard({ icon: Icon, label, value, sub, colorClass = "text-navy-600", bgClass = "bg-navy-50" }) {
  return (
    <div className="card flex items-start gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={colorClass} />
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
