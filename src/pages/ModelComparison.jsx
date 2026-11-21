import React, { useState } from "react";
import { Award, CheckCircle, TrendingUp } from "lucide-react";
import { useArtifacts } from "../hooks/useArtifacts";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from "recharts";

const MODEL_DISPLAY = {
  logistic_regression: "Logistic Regression",
  random_forest:       "Random Forest",
  svm:                 "Support Vector Machine (SVM)",
};
const COLORS = { logistic_regression: "var(--series-lr)", random_forest: "var(--series-rf)", svm: "var(--series-svm)" };
const METRICS = ["accuracy","precision","recall","f1"];
const METRIC_LABELS = { accuracy: "Accuracy", precision: "Precision", recall: "Recall", f1: "F1-Score" };

export default function ModelComparison() {
  const { loading, error, data } = useArtifacts();
  const [highlight, setHighlight] = useState("recall");

  if (loading) return <LoadingSpinner text="Loading model metrics…" />;
  if (error)   return <div className="card text-rose-600 text-sm p-6">{error}</div>;

  const { modelMetrics } = data;
  const models = modelMetrics.models;
  const defaultModel = modelMetrics.defaultModel;
  const keys = ["logistic_regression","random_forest","svm"];

  // Best per metric
  const best = {};
  METRICS.forEach(m => {
    best[m] = keys.reduce((a, b) => models[a][m] >= models[b][m] ? a : b);
  });

  const chartData = keys.map(k => ({
    name:  k === "logistic_regression" ? "LR" : k === "random_forest" ? "RF" : "SVM",
    fullName: MODEL_DISPLAY[k],
    Accuracy:  +(models[k].accuracy * 100).toFixed(2),
    Precision: +(models[k].precision * 100).toFixed(2),
    Recall:    +(models[k].recall * 100).toFixed(2),
    "F1-Score":+(models[k].f1 * 100).toFixed(2),
    modelKey:  k,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Comparison Table */}
      <div className="card overflow-x-auto">
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp size={20} className="text-navy-600" />
          <h3 className="section-title">Performance Metrics Comparison</h3>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Model</th>
              {METRICS.map(m => (
                <th
                  key={m}
                  onClick={() => setHighlight(m)}
                  className={`metric-header text-center py-3 px-4 font-semibold cursor-pointer transition-colors rounded-t ${highlight === m ? "is-selected" : ""}`}
                >
                  {METRIC_LABELS[m]}
                </th>
              ))}
              <th className="text-center py-3 px-4 font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k, ri) => {
              const m = models[k];
              return (
                <tr key={k} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${k === defaultModel ? "bg-navy-50/50" : ""}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[k] }} />
                      <div>
                        <div className="font-medium text-slate-800">{MODEL_DISPLAY[k]}</div>
                        {k === defaultModel && (
                          <span className="text-[10px] text-teal-600 font-semibold uppercase tracking-wide">Default</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {METRICS.map(metric => (
                    <td key={metric} className={`text-center py-4 px-4 ${highlight === metric ? "bg-navy-50/70" : ""}`}>
                      <span className={`font-mono text-sm ${best[metric] === k ? "font-bold text-navy-700" : "text-slate-700"}`}>
                        {(m[metric] * 100).toFixed(2)}%
                      </span>
                      {best[metric] === k && <span className="ml-1 text-teal-500">▲</span>}
                    </td>
                  ))}
                  <td className="text-center py-4 px-4">
                    {k === defaultModel
                      ? <span className="badge bg-teal-100 text-teal-700"><Award size={10} /> Selected</span>
                      : <span className="badge bg-slate-100 text-slate-500"><CheckCircle size={10} /> Trained</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">
          ▲ indicates best value per metric. Positive class: malignant (class 0). Evaluated on a held-out 20% stratified test set.
        </p>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { key: "Accuracy",  color: "var(--series-lr)" },
          { key: "Precision", color: "var(--series-rf)" },
          { key: "Recall",    color: "var(--series-svm)" },
          { key: "F1-Score",  color: "var(--series-warm)" },
        ].map(({ key, color }) => (
          <div key={key} className="card">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">{key} by Model</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: "var(--chart-axis)" }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  formatter={(v, _, props) => [`${v}%`, props.payload.fullName]}
                  contentStyle={{ fontSize: 12, backgroundColor: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-line)", color: "var(--ink)" }}
                />
                <Bar dataKey={key} radius={[4,4,0,0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.modelKey} fill={COLORS[entry.modelKey]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="card bg-slate-50">
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Why recall matters most</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          In cancer classification, minimising false negatives (missed malignant tumors) is paramount.
          A high <strong>recall</strong> for the malignant class means fewer actual malignant cases are
          incorrectly labelled as benign. This is why recall is weighted more heavily than accuracy alone
          when selecting the default model — even at the cost of slightly lower precision.
        </p>
      </div>
    </div>
  );
}
