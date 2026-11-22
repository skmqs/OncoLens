import React from "react";

export default function MetricBadge({ label, value, highlight }) {
  return (
    <div className={`rounded-xl p-3 text-center ${highlight ? "bg-navy-50 ring-1 ring-navy-200" : "bg-slate-50"}`}>
      <div className={`text-lg font-bold ${highlight ? "text-navy-700" : "text-slate-800"}`}>
        {typeof value === "number" ? (value * 100).toFixed(1) + "%" : value}
      </div>
      <div className="text-xs text-slate-500 mt-0.5 font-medium">{label}</div>
    </div>
  );
}
