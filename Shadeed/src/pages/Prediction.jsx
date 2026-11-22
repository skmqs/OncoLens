import React, { useState, useRef, useCallback } from "react";
import {
  ChevronDown, ChevronUp, Play, RefreshCw, Trash2,
  CheckCircle, AlertCircle, Clock, Cpu
} from "lucide-react";
import { GROUPS, FEATURE_NAMES } from "../utils/featureGroups";
import { runInference } from "../utils/onnxInference";
import { addPrediction } from "../utils/historyStore";
import { useArtifacts } from "../hooks/useArtifacts";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const MODEL_OPTIONS = [
  { key: "logistic_regression", label: "Logistic Regression" },
  { key: "random_forest",       label: "Random Forest" },
  { key: "svm",                 label: "Support Vector Machine" },
];

function validateValue(v) {
  if (v === "" || v === null || v === undefined) return "Required";
  const n = Number(v);
  if (isNaN(n)) return "Must be a number";
  if (!isFinite(n)) return "Must be finite";
  if (n < 0) return "Must be ≥ 0";
  return null;
}

export default function Prediction() {
  const { loading: artLoading, data: artData } = useArtifacts();

  const [values, setValues]       = useState({});
  const [errors, setErrors]       = useState({});
  const [expanded, setExpanded]   = useState({ mean: true, se: false, worst: false });
  const [model, setModel]         = useState("logistic_regression");
  const [result, setResult]       = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predError, setPredError] = useState(null);
  const resultRef = useRef(null);

  // Load sample from artifacts
  const loadSample = useCallback(() => {
    if (!artData?.sampleInput) return;
    const map = {};
    artData.sampleInput.featureNames.forEach((name, i) => {
      map[name] = artData.sampleInput.values[i];
    });
    setValues(map);
    setErrors({});
  }, [artData]);

  const clearAll = () => { setValues({}); setErrors({}); setResult(null); setPredError(null); };

  const handleChange = (key, raw) => {
    setValues(prev => ({ ...prev, [key]: raw }));
    const err = validateValue(raw);
    setErrors(prev => ({ ...prev, [key]: err }));
  };

  const validate = () => {
    const errs = {};
    FEATURE_NAMES.forEach(name => {
      const err = validateValue(values[name]);
      if (err) errs[name] = err;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const predict = async () => {
    // Open all groups so errors are visible
    setExpanded({ mean: true, se: true, worst: true });
    if (!validate()) return;

    setPredicting(true);
    setPredError(null);
    setResult(null);
    try {
      const features = FEATURE_NAMES.map(n => Number(values[n]));
      const res = await runInference(model, features);
      const ts = new Date().toISOString();
      const entry = {
        model,
        modelLabel: MODEL_OPTIONS.find(m => m.key === model)?.label,
        predictedClass: res.predictedClass,
        predictedLabel: res.predictedLabel,
        probabilities: res.probabilities,
        timestamp: ts,
      };
      setResult(entry);
      addPrediction(entry);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setPredError(err.message);
    } finally {
      setPredicting(false);
    }
  };

  if (artLoading) return <LoadingSpinner text="Loading sample data…" />;

  const totalErrors = Object.values(errors).filter(Boolean).length;
  const isMalignant = result?.predictedLabel === "malignant";

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Controls */}
      <div className="card flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <label className="label mb-0 text-sm font-medium text-slate-700">Model:</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="input w-auto text-sm"
          >
            {MODEL_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSample} className="btn-secondary text-xs gap-1.5">
            <RefreshCw size={13} /> Load Sample
          </button>
          <button onClick={clearAll} className="btn-secondary text-xs gap-1.5 text-rose-600 hover:bg-rose-50">
            <Trash2 size={13} /> Clear All
          </button>
        </div>
      </div>

      {/* Input sections */}
      {GROUPS.map(group => (
        <FeatureSection
          key={group.id}
          group={group}
          values={values}
          errors={errors}
          expanded={expanded[group.id]}
          onToggle={() => setExpanded(e => ({ ...e, [group.id]: !e[group.id] }))}
          onChange={handleChange}
        />
      ))}

      {/* Validation summary */}
      {totalErrors > 0 && (
        <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} />
          {totalErrors} field{totalErrors > 1 ? "s" : ""} require attention before predicting.
        </div>
      )}

      {/* Predict button */}
      <button
        onClick={predict}
        disabled={predicting}
        className="btn-primary w-full justify-center py-3 text-base"
      >
        {predicting ? (
          <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Running inference…</>
        ) : (
          <><Play size={18} /> Predict Tumor Classification</>
        )}
      </button>

      {predError && (
        <div className="card border-rose-200 bg-rose-50 flex gap-3">
          <AlertCircle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-700 text-sm">Inference error</div>
            <div className="text-xs text-rose-600 mt-1">{predError}</div>
          </div>
        </div>
      )}

      {/* Result panel */}
      {result && (
        <div ref={resultRef} className={`result-panel card border-2 ${isMalignant ? "border-rose-300 bg-rose-50/50" : "border-emerald-300 bg-emerald-50/50"} space-y-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={`text-3xl font-black tracking-wide ${isMalignant ? "text-rose-700" : "text-emerald-700"}`}>
                {result.predictedLabel.toUpperCase()}
              </div>
              <div className="result-supporting-text text-sm mt-1">
                Classification by <strong>{result.modelLabel}</strong>
              </div>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isMalignant ? "bg-rose-200" : "bg-emerald-200"}`}>
              {isMalignant
                ? <AlertCircle size={32} className="text-rose-600" />
                : <CheckCircle size={32} className="text-emerald-600" />
              }
            </div>
          </div>

          {/* Probabilities */}
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Model Class Probabilities</div>
            <div className="grid grid-cols-2 gap-3">
              {["malignant","benign"].map((cls, i) => {
                const prob = result.probabilities[i] ?? 0;
                return (
                  <div key={cls} className={`result-probability-card rounded-xl p-3 border ${i === result.predictedClass ? `is-predicted ring-2 ${isMalignant ? "ring-rose-400" : "ring-emerald-400"}` : ""}`}>
                    <div className="text-xs text-slate-500 mb-1 capitalize">{cls}</div>
                    <div className={`text-lg font-bold ${i === result.predictedClass ? (isMalignant ? "text-rose-700" : "text-emerald-700") : "text-slate-700"}`}>
                      {(prob * 100).toFixed(1)}%
                    </div>
                    <div className="result-progress-track mt-1.5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${i === 0 ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metadata */}
          <div className="result-metadata flex flex-wrap gap-4 text-xs pt-1 border-t">
            <span className="flex items-center gap-1"><Cpu size={11} /> {result.modelLabel}</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {new Date(result.timestamp).toLocaleString()}</span>
          </div>

        </div>
      )}
    </div>
  );
}

function FeatureSection({ group, values, errors, expanded, onToggle, onChange }) {
  const COLOR = {
    navy: { header: "bg-navy-50 border-navy-200",   title: "text-navy-700",   dot: "bg-navy-500" },
    teal: { header: "bg-teal-50 border-teal-200",   title: "text-teal-700",   dot: "bg-teal-500" },
    rose: { header: "bg-rose-50 border-rose-200",   title: "text-rose-700",   dot: "bg-rose-500" },
  }[group.color];

  const groupErrors = group.features.filter(f => errors[f.key]).length;

  return (
    <div className="card p-0 overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-5 py-4 ${COLOR.header} border-b text-left transition-colors`}
      >
        <div className={`w-2.5 h-2.5 rounded-full ${COLOR.dot}`} />
        <div className="flex-1">
          <div className={`font-semibold text-sm ${COLOR.title}`}>{group.label}</div>
          <div className="text-xs text-slate-500">{group.description}</div>
        </div>
        {groupErrors > 0 && (
          <span className="badge bg-rose-100 text-rose-600">{groupErrors} errors</span>
        )}
        {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-5">
          {group.features.map(feat => (
            <FeatureInput
              key={feat.key}
              feat={feat}
              value={values[feat.key] ?? ""}
              error={errors[feat.key]}
              onChange={v => onChange(feat.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeatureInput({ feat, value, error, onChange }) {
  return (
    <div>
      <label className="label" htmlFor={feat.key}>
        {feat.label}
        {feat.unit && <span className="text-slate-400 font-normal ml-1">({feat.unit})</span>}
      </label>
      <input
        id={feat.key}
        type="number"
        step="any"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={feat.hint ? `Typical: ${feat.hint}` : "Enter value"}
        className={`input text-sm ${error ? "input-error" : ""}`}
        aria-label={feat.label}
        aria-describedby={error ? `${feat.key}-err` : undefined}
      />
      {error && (
        <p id={`${feat.key}-err`} className="text-xs text-rose-500 mt-1">{error}</p>
      )}
    </div>
  );
}
