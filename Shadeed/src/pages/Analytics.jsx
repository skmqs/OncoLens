import React, { useState } from "react";
import { useArtifacts } from "../hooks/useArtifacts";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from "recharts";

const MODEL_DISPLAY = {
  logistic_regression: "Logistic Regression",
  random_forest:       "Random Forest",
  svm:                 "Support Vector Machine",
};
const MODEL_KEYS = ["logistic_regression","random_forest","svm"];
const COLORS = { logistic_regression: "var(--series-lr)", random_forest: "var(--series-rf)", svm: "var(--series-svm)" };
const IMP_COLORS = Array.from({ length: 10 }, (_, i) => `var(--series-imp-${i + 1})`);
const CHART_TOOLTIP_STYLE = { fontSize: 11, backgroundColor: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-line)", color: "var(--ink)" };
const TOP_N = 12;

const IMP_DESC = {
  coefficients: "Logistic Regression coefficients — positive values push toward benign, negative toward malignant. Larger absolute values = stronger influence.",
  feature_importances: "Random Forest feature importances — mean decrease in impurity across all trees. Larger = more discriminative feature.",
  permutation_importance: "SVM permutation importances — mean decrease in F1 when a feature's values are randomly shuffled. Larger = feature the model relies on more.",
};

export default function Analytics() {
  const { loading, error, data } = useArtifacts();
  const [impModel, setImpModel] = useState("random_forest");
  const [cmModel,  setCmModel]  = useState("logistic_regression");

  if (loading) return <LoadingSpinner text="Loading analytics data…" />;
  if (error)   return <div className="card text-rose-600 text-sm p-6">{error}</div>;

  const { modelMetrics, confusionMatrices, featureImportance } = data;
  const models = modelMetrics.models;

  // ── Feature importance ────────────────────────────────────────────────────
  const impData = featureImportance[impModel];
  const sortedImp = impData.featureNames
    .map((name, i) => ({ name, value: impData.values[i] }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, TOP_N)
    .reverse();

  // ── Confusion matrix ───────────────────────────────────────────────────────
  const cm = confusionMatrices[cmModel];
  // sklearn matrix rows = actual class, cols = predicted class
  // class 0 = malignant, class 1 = benign
  // matrix[0][0] = actual mal, pred mal = TP
  // matrix[0][1] = actual mal, pred ben = FN
  // matrix[1][0] = actual ben, pred mal = FP
  // matrix[1][1] = actual ben, pred ben = TN
  const [[TP, FN],[FP, TN]] = cm.matrix;

  const cmCells = [
    { label: "True Malignant\n(TP)",   val: TP, type: "pos", row: "Actual Malignant", col: "Pred Malignant" },
    { label: "False Benign\n(FN)",     val: FN, type: "neg", row: "Actual Malignant", col: "Pred Benign" },
    { label: "False Malignant\n(FP)",  val: FP, type: "neg", row: "Actual Benign",    col: "Pred Malignant" },
    { label: "True Benign\n(TN)",      val: TN, type: "pos", row: "Actual Benign",    col: "Pred Benign" },
  ];

  // ── Metric bar data ────────────────────────────────────────────────────────
  const metricCharts = [
    { label: "Accuracy",  key: "accuracy" },
    { label: "Precision", key: "precision" },
    { label: "Recall",    key: "recall" },
    { label: "F1-Score",  key: "f1" },
  ].map(({ label, key }) => ({
    label,
    data: MODEL_KEYS.map(k => ({
      name: k === "logistic_regression" ? "LR" : k === "random_forest" ? "RF" : "SVM",
      value: +(models[k][key] * 100).toFixed(2),
      modelKey: k,
    })),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Metric charts */}
      <div>
        <h3 className="section-title mb-4">Metric Comparison Charts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCharts.map(({ label, data }) => (
            <div key={label} className="card">
              <div className="text-xs font-semibold text-slate-600 mb-3">{label}</div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={data} margin={{ top: 10, right: 4, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--chart-axis)" }} />
                  <YAxis domain={[85, 100]} tick={{ fontSize: 9, fill: "var(--chart-axis)" }} tickFormatter={v => `${v}`} />
                  <Tooltip formatter={v => `${v}%`} contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="value" radius={[3,3,0,0]}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: 9 }} formatter={v => `${v}%`} />
                    {data.map(d => <Cell key={d.modelKey} fill={COLORS[d.modelKey]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h3 className="section-title">Confusion Matrix</h3>
          <select value={cmModel} onChange={e => setCmModel(e.target.value)} className="input w-auto text-sm">
            {MODEL_KEYS.map(k => <option key={k} value={k}>{MODEL_DISPLAY[k]}</option>)}
          </select>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Grid */}
          <div>
            <div className="text-xs text-slate-500 text-center mb-2 font-medium">Predicted →</div>
            <div className="grid grid-cols-3 gap-1 text-sm">
              {/* Header row */}
              <div />
              <div className="text-center font-semibold text-rose-700 py-2 px-4 text-xs bg-rose-50 rounded-t">Pred Malignant</div>
              <div className="text-center font-semibold text-emerald-700 py-2 px-4 text-xs bg-emerald-50 rounded-t">Pred Benign</div>

              {/* Row 1: Actual Malignant */}
              <div className="text-xs font-semibold text-rose-700 flex items-center justify-end pr-3 bg-rose-50 rounded-l">Actual<br/>Malignant</div>
              <div className="bg-emerald-100 border-2 border-emerald-400 rounded-xl flex flex-col items-center justify-center w-32 h-24">
                <div className="text-3xl font-black text-emerald-700">{TP}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">True Positive</div>
              </div>
              <div className="bg-rose-100 border-2 border-rose-300 rounded-xl flex flex-col items-center justify-center w-32 h-24">
                <div className="text-3xl font-black text-rose-600">{FN}</div>
                <div className="text-[10px] text-rose-500 font-semibold mt-1">False Negative</div>
              </div>

              {/* Row 2: Actual Benign */}
              <div className="text-xs font-semibold text-emerald-700 flex items-center justify-end pr-3 bg-emerald-50 rounded-l">Actual<br/>Benign</div>
              <div className="bg-rose-100 border-2 border-rose-300 rounded-xl flex flex-col items-center justify-center w-32 h-24">
                <div className="text-3xl font-black text-rose-600">{FP}</div>
                <div className="text-[10px] text-rose-500 font-semibold mt-1">False Positive</div>
              </div>
              <div className="bg-emerald-100 border-2 border-emerald-400 rounded-xl flex flex-col items-center justify-center w-32 h-24">
                <div className="text-3xl font-black text-emerald-700">{TN}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">True Negative</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl text-xs text-center">
            {[
              { label: "True Positive (TP)",  val: TP, desc: "Malignant correctly predicted", cls: "bg-emerald-50 text-emerald-700" },
              { label: "False Negative (FN)", val: FN, desc: "Missed malignant (critical)",   cls: "bg-rose-50 text-rose-700" },
              { label: "False Positive (FP)", val: FP, desc: "Benign predicted as malignant", cls: "bg-rose-50 text-rose-700" },
              { label: "True Negative (TN)",  val: TN, desc: "Benign correctly predicted",    cls: "bg-emerald-50 text-emerald-700" },
            ].map(({ label, val, desc, cls }) => (
              <div key={label} className={`${cls} rounded-xl p-2`}>
                <div className="text-lg font-bold">{val}</div>
                <div className="font-semibold leading-tight">{label}</div>
                <div className="text-slate-500 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h3 className="section-title">Feature Importance / Explanation</h3>
          <select value={impModel} onChange={e => setImpModel(e.target.value)} className="input w-auto text-sm">
            {MODEL_KEYS.map(k => <option key={k} value={k}>{MODEL_DISPLAY[k]}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-500 mb-4">{IMP_DESC[impData.type]}</p>

        <ResponsiveContainer width="100%" height={Math.max(300, TOP_N * 28)}>
          <BarChart data={sortedImp} layout="vertical" margin={{ top: 0, right: 60, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "var(--chart-axis)" }} tickFormatter={v => v.toFixed(3)} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 10, fill: "var(--chart-axis)" }} />
            <Tooltip formatter={v => v.toFixed(5)} contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={[0,4,4,0]}>
              <LabelList dataKey="value" position="right" style={{ fontSize: 9 }} formatter={v => v.toFixed(3)} />
              {sortedImp.map((_, i) => (
                <Cell key={i} fill={IMP_COLORS[i % IMP_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <p className="text-xs text-slate-400 mt-3">
          Feature importance shows which inputs most influence <em>this model's predictions</em>.
          Top {TOP_N} features are ranked by absolute importance.
        </p>
      </div>
    </div>
  );
}
