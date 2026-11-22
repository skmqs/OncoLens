import React from "react";
import { Link } from "react-router-dom";
import {
  Database, Users, Shield, AlertCircle, Cpu, Award,
  ArrowRight, TrendingUp, Layers
} from "lucide-react";
import { useArtifacts } from "../hooks/useArtifacts";
import StatCard from "../components/ui/StatCard";
import MetricBadge from "../components/ui/MetricBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const MODEL_DISPLAY = {
  logistic_regression: "Logistic Regression",
  random_forest: "Random Forest",
  svm: "Support Vector Machine",
};

const COLORS = ["var(--series-lr)","var(--series-rf)","var(--series-svm)"];

export default function Overview() {
  const { loading, error, data } = useArtifacts();

  if (loading) return <LoadingSpinner text="Loading dataset and model statistics…" size="lg" />;
  if (error)   return <ErrorState msg={error} />;

  const { datasetStats, modelMetrics } = data;
  const models = modelMetrics.models;
  const defaultModel = modelMetrics.defaultModel;
  const dm = models[defaultModel];

  const modelKeys = ["logistic_regression", "random_forest", "svm"];

  const barData = modelKeys.map((k) => ({
    name: MODEL_DISPLAY[k].replace(" ", "\n"),
    shortName: k === "logistic_regression" ? "LR" : k === "random_forest" ? "RF" : "SVM",
    Accuracy:  +(models[k].accuracy * 100).toFixed(1),
    Recall:    +(models[k].recall * 100).toFixed(1),
    F1:        +(models[k].f1 * 100).toFixed(1),
  }));

  const radarData = ["accuracy","precision","recall","f1"].map((m) => ({
    metric: m.charAt(0).toUpperCase() + m.slice(1),
    LR:  +(models.logistic_regression[m] * 100).toFixed(1),
    RF:  +(models.random_forest[m] * 100).toFixed(1),
    SVM: +(models.svm[m] * 100).toFixed(1),
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 via-navy-600 to-teal-600 text-white p-8">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight mb-2">
            OncoLens
          </h2>
          <p className="text-white/75 max-w-xl text-sm leading-relaxed mb-6">
            An interactive machine learning application classifying breast tumors as benign or
            malignant using the Wisconsin Breast Cancer Diagnostic Dataset. Three trained algorithms
            run entirely in your browser via ONNX Runtime Web.
          </p>
          <Link to="/prediction" className="inline-flex items-center gap-2 bg-white text-navy-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-50 transition-colors">
            Start Prediction <ArrowRight size={16} />
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Dataset Stats */}
      <div>
        <h3 className="section-title mb-4">Dataset Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Database} label="Total Samples"    value={datasetStats.totalSamples}  bgClass="bg-navy-50"    colorClass="text-navy-600" />
          <StatCard icon={Shield}   label="Benign Samples"   value={datasetStats.benignCount}    bgClass="bg-emerald-50" colorClass="text-emerald-600" sub="Target class: 1" />
          <StatCard icon={AlertCircle} label="Malignant Samples" value={datasetStats.malignantCount} bgClass="bg-rose-50" colorClass="text-rose-600" sub="Target class: 0" />
          <StatCard icon={Layers}   label="Features"         value={datasetStats.featureCount}   bgClass="bg-teal-50"   colorClass="text-teal-600" sub="30 diagnostics" />
        </div>
      </div>

      {/* Model Summary */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Default model */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 justify-between">
            <h3 className="section-title">Default Model</h3>
            <span className="badge bg-teal-100 text-teal-700">
              <Award size={10} /> Best Recall
            </span>
          </div>
          <div className="text-xl font-bold text-navy-700">{MODEL_DISPLAY[defaultModel]}</div>
          <div className="grid grid-cols-2 gap-2">
            <MetricBadge label="Accuracy"  value={dm.accuracy}  highlight />
            <MetricBadge label="Precision" value={dm.precision} />
            <MetricBadge label="Recall"    value={dm.recall}    highlight />
            <MetricBadge label="F1-Score"  value={dm.f1} />
          </div>
          <p className="text-xs text-slate-500">
            Selected as default because it maximises recall on the malignant class — minimising
            missed detections is a key model evaluation consideration.
          </p>
          <Link to="/comparison" className="btn-secondary text-xs">
            Compare all models <ArrowRight size={13} />
          </Link>
        </div>

        {/* Bar chart */}
        <div className="card">
          <h3 className="section-title mb-4">Accuracy · Recall · F1 Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: "var(--chart-axis)" }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, backgroundColor: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-line)", color: "var(--ink)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "var(--ink-secondary)" }} />
              <Bar dataKey="Accuracy" fill="var(--series-lr)" radius={[4,4,0,0]} />
              <Bar dataKey="Recall"   fill="var(--series-rf)" radius={[4,4,0,0]} />
              <Bar dataKey="F1"       fill="var(--series-svm)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar */}
      <div className="card">
        <h3 className="section-title mb-4">Multi-Metric Radar Comparison</h3>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--chart-grid)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "var(--chart-axis)" }} />
            <PolarRadiusAxis angle={30} domain={[80, 100]} tick={{ fontSize: 9, fill: "var(--chart-axis)" }} />
            <Radar name="Logistic Regression" dataKey="LR"  stroke="var(--series-lr)" fill="var(--series-lr)" fillOpacity={0.1} />
            <Radar name="Random Forest"       dataKey="RF"  stroke="var(--series-rf)" fill="var(--series-rf)" fillOpacity={0.1} />
            <Radar name="SVM"                 dataKey="SVM" stroke="var(--series-svm)" fill="var(--series-svm)" fillOpacity={0.1} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, backgroundColor: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-line)", color: "var(--ink)" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: "/prediction", icon: Cpu,       label: "Run Prediction",     color: "bg-navy-600" },
          { to: "/comparison", icon: TrendingUp, label: "Model Comparison",   color: "bg-teal-600" },
          { to: "/analytics",  icon: Layers,     label: "View Analytics",     color: "bg-violet-600" },
          { to: "/history",    icon: Users,       label: "Prediction History", color: "bg-slate-600" },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="card-hover flex items-center gap-3 group"
          >
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-navy-700">{label}</span>
            <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-navy-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="card text-center py-16 max-w-lg mx-auto">
      <AlertCircle size={40} className="text-rose-400 mx-auto mb-3" />
      <h3 className="font-semibold text-slate-800 mb-1">Failed to load artifacts</h3>
      <p className="text-sm text-slate-500 mb-4">{msg}</p>
      <p className="text-xs text-slate-400">
        Run <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">python ml/train_and_export.py</code> to generate the required JSON files, then rebuild.
      </p>
    </div>
  );
}
