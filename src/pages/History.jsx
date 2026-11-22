import React, { useState, useEffect, useCallback } from "react";
import { History as HistoryIcon, Trash2, AlertCircle, CheckCircle, Clock, Cpu, Database } from "lucide-react";
import { loadHistory, clearHistory as clearStore } from "../utils/historyStore";

const MODEL_DISPLAY = {
  logistic_regression: "Logistic Regression",
  random_forest:       "Random Forest",
  svm:                 "SVM",
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const refresh = useCallback(() => setHistory(loadHistory()), []);

  useEffect(() => {
    refresh();
    // Refresh when user comes back to this tab / window
    const handler = () => refresh();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [refresh]);

  const handleClear = () => {
    clearStore();
    setHistory([]);
    setShowConfirm(false);
  };

  const malignantCount = history.filter(h => h.predictedLabel === "malignant").length;
  const benignCount    = history.filter(h => h.predictedLabel === "benign").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <HistoryIcon size={20} className="text-slate-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">Prediction History</div>
            <div className="text-xs text-slate-500">{history.length} record{history.length !== 1 ? "s" : ""} · stored locally in your browser</div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{benignCount}</span> benign ·{" "}
              <span className="text-rose-600 font-semibold">{malignantCount}</span> malignant
            </div>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-secondary text-xs text-rose-600 hover:bg-rose-50 gap-1.5"
              >
                <Trash2 size={13} /> Clear History
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Are you sure?</span>
                <button onClick={handleClear} className="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-rose-600">Yes, clear</button>
                <button onClick={() => setShowConfirm(false)} className="text-xs btn-secondary">Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Storage note */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
        <Database size={13} className="mt-0.5 flex-shrink-0" />
        History is stored only in <strong>your browser's localStorage</strong>. It is never sent to any server.
        Clearing browser data or using private browsing will remove it.
      </div>

      {/* Empty state */}
      {history.length === 0 && (
        <div className="card text-center py-20 text-slate-500">
          <HistoryIcon size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-medium text-slate-700">No predictions yet</div>
          <div className="text-sm mt-1">Head to the Prediction page to run your first classification.</div>
        </div>
      )}

      {/* Records */}
      <div className="space-y-3">
        {history.map((entry, idx) => {
          const isMalignant = entry.predictedLabel === "malignant";
          const benignProb    = entry.probabilities?.[1] ?? 0;
          const malignantProb = entry.probabilities?.[0] ?? 0;

          return (
            <div key={entry.id ?? idx} className={`card flex gap-4 items-start border ${isMalignant ? "border-rose-200 bg-rose-50/30" : "border-emerald-200 bg-emerald-50/30"}`}>
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${isMalignant ? "bg-rose-100" : "bg-emerald-100"}`}>
                {isMalignant
                  ? <AlertCircle size={20} className="text-rose-600" />
                  : <CheckCircle size={20} className="text-emerald-600" />
                }
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`font-bold text-sm ${isMalignant ? "text-rose-700" : "text-emerald-700"}`}>
                    {entry.predictedLabel?.toUpperCase()}
                  </span>
                  <span className={`badge text-[10px] ${isMalignant ? "badge-malignant" : "badge-benign"}`}>
                    #{history.length - idx}
                  </span>
                </div>

                {/* Probability bars */}
                {entry.probabilities && (
                  <div className="space-y-1.5 mb-2">
                    {[
                      { label: "Malignant", prob: malignantProb, color: "bg-rose-500" },
                      { label: "Benign",    prob: benignProb,    color: "bg-emerald-500" },
                    ].map(({ label, prob, color }) => (
                      <div key={label} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-16">{label}</span>
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${prob * 100}%` }} />
                        </div>
                        <span className="w-10 text-right font-mono font-medium">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Cpu size={10} /> {entry.modelLabel ?? MODEL_DISPLAY[entry.model] ?? entry.model}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {new Date(entry.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
