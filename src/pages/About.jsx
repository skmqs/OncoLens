import React from "react";

const TEAM_DEFAULTS = [
  { id: 1, name: "SK Muhtashamun Quadir", role: "Frontend & Inference Engineer", desc: "React application, UI design, Recharts integration, ONNX inference pipeline and application architecture" },
  { id: 2, name: "Abdul Hakim Zain", role: "ML Engineer", desc: "Dataset preprocessing, model training and ONNX export" },
  { id: 3, name: "Umme Haney Jarin", role: "Researcher & Tester", desc: "Feature analysis, model evaluation and documentation" },
];

function TeamCard({ member }) {
  return (
    <div className="card">
      <div>
        <div className="font-semibold text-slate-800">{member.name}</div>
        <div className="text-xs text-teal-600 font-medium">{member.role}</div>
      </div>
      <p className="text-sm text-slate-600 mt-1">{member.desc}</p>
    </div>
  );
}

export default function About() {
  const team = TEAM_DEFAULTS;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Project Introduction */}
      <section className="card space-y-3">
        <h3 className="section-title">Project Introduction</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          OncoLens demonstrates how classical classification algorithms can be applied to a biomedical dataset. It
          is an interactive application for entering diagnostic measurements and exploring predictions from
          three independently trained models running in the browser.
        </p>
      </section>

      {/* Problem Statement */}
      <section className="card space-y-3">
        <h3 className="section-title">Problem Statement</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Breast cancer is one of the most prevalent cancers worldwide. Early and accurate classification
          of a tumour as benign (non-cancerous) or malignant (cancerous) enables timely treatment and
          The project explores whether a set of measurable
          cell-nucleus characteristics can be used to train machine learning classifiers that reliably
          distinguish the two classes.
        </p>
      </section>

      {/* Dataset */}
      <section className="card space-y-3">
        <h3 className="section-title">Dataset</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm mb-3">
          {[
            { label: "Total Samples", val: 569 },
            { label: "Benign",        val: 357 },
            { label: "Malignant",     val: 212 },
            { label: "Features",      val: 30  },
          ].map(({ label, val }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3">
              <div className="text-xl font-bold text-navy-700">{val}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          The <strong>Wisconsin Breast Cancer Diagnostic Dataset</strong> (available via{" "}
          <code className="text-xs bg-slate-100 px-1 rounded font-mono">sklearn.datasets.load_breast_cancer</code>)
          contains 30 real-valued features computed from digitised images of fine-needle aspirate (FNA) biopsies.
          Ten cell-nucleus characteristics are measured three ways each — mean, standard error, and worst value.
        </p>
      </section>

      {/* ML Methodology */}
      <section className="card space-y-3">
        <h3 className="section-title">Machine Learning Methodology</h3>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            The dataset is split 80/20 (stratified by class) into training and test sets using a fixed
            <code className="text-xs bg-slate-100 px-1 rounded font-mono mx-1">random_state</code>
            for reproducibility. All preprocessing (StandardScaler) is fitted exclusively on the training
            split to prevent data leakage.
          </p>
          <p>
            Each model is wrapped in a Scikit-learn Pipeline so preprocessing and inference remain
            consistent during training and export. After training, all three pipelines are exported to
            ONNX format using <code className="text-xs bg-slate-100 px-1 rounded font-mono">skl2onnx</code>
            and verified against the original Scikit-learn predictions (zero class mismatches, probability
            difference {'<'} 1×10⁻⁴).
          </p>
          <p>
            Evaluation metrics (accuracy, precision, recall, F1) are calculated with the malignant class
            as the positive class. <strong>Recall</strong> is weighted most heavily when selecting the
            default model — minimising false negatives (missed malignant cases) is clinically more
            important than minimising false positives.
          </p>
        </div>
      </section>

      {/* Algorithms */}
      <section className="card space-y-4">
        <h3 className="section-title">Algorithms Used</h3>
        {[
          { name: "Logistic Regression", detail: "Linear model with L2 regularisation (C=1). Scaled features. Coefficients used as feature explanation." },
          { name: "Random Forest", detail: "200 trees, unlimited depth. No feature scaling required. Feature importances from mean decrease in impurity." },
          { name: "Support Vector Machine (SVM)", detail: "RBF kernel, C=1, gamma='scale'. Scaled features. Probability estimates via Platt scaling. Permutation importance for explanation." },
        ].map(({ name, detail }) => (
          <div key={name} className="border-l-4 border-navy-300 pl-4">
            <div className="font-semibold text-slate-800 text-sm">{name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{detail}</div>
          </div>
        ))}
      </section>

      {/* Tech Stack */}
      <section className="card">
        <h3 className="section-title mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { cat: "Frontend", items: ["React 18", "Vite", "Tailwind CSS", "Recharts", "Lucide React"] },
            { cat: "ML / Python", items: ["Scikit-learn", "NumPy", "Pandas", "skl2onnx", "ONNX Runtime"] },
            { cat: "Inference", items: ["ONNX Runtime Web", "WebAssembly", "Browser-only (no server)"] },
            { cat: "Deployment", items: ["Netlify", "Static SPA build", "GitHub"] },
          ].map(({ cat, items }) => (
            <div key={cat} className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-slate-700 mb-2">{cat}</div>
              <ul className="space-y-0.5">
                {items.map(i => <li key={i} className="text-xs text-slate-500">· {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h3 className="section-title mb-4">Team Contributions</h3>
        <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
          {team.map((m, index) => (
            <div
              key={m.id}
              className={index === 0 ? "md:col-span-2 md:justify-self-center md:w-1/2" : ""}
            >
              <TeamCard member={m} />
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      <section className="card space-y-2">
        <h3 className="section-title">References</h3>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li>• Wolberg, W.H., Street, W.N., & Mangasarian, O.L. (1995). <em>Breast cancer Wisconsin (diagnostic) dataset</em>. UCI Machine Learning Repository.</li>
          <li>• Pedregosa et al. (2011). Scikit-learn: Machine Learning in Python. <em>Journal of Machine Learning Research</em>, 12, 2825–2830.</li>
          <li>• ONNX Runtime: <a href="https://onnxruntime.ai" className="text-navy-600 underline" target="_blank" rel="noopener noreferrer">onnxruntime.ai</a></li>
          <li>• Lemaître, G., Nogueira, F., & Aridas, C. K. (2017). Imbalanced-learn: A Python Toolbox. <em>JMLR</em>.</li>
        </ul>
      </section>
    </div>
  );
}
