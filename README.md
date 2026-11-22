# OncoLens

OncoLens is a group-built, educational web application for exploring machine-learning classification of breast tumors as **malignant** or **benign**. The team combines model development and evaluation with a React-based prediction and analytics interface. It uses the Wisconsin Breast Cancer Diagnostic Dataset and runs trained ONNX models in the browser. **This project is an academic demonstration, not a clinical diagnostic tool.**

**Live web app:** [https://oncolenz.netlify.app/](https://oncolenz.netlify.app/)  
**Android app:** Additionally the Android application is published in this repository's [Releases](https://github.com/skmqs/OncoLens/releases) section.

## Project objectives

- Train and compare three classical classifiers on a consistent, stratified held-out test set.
- Treat malignant (class `0`) as the positive class for precision, recall, and F1 reporting.
- Export the fitted pipelines to ONNX and check browser-deployable outputs against their Scikit-learn counterparts.
- Present model performance, feature analysis, and predictions through an interactive client-side application.

## Dataset

The project uses `sklearn.datasets.load_breast_cancer`, the Wisconsin Breast Cancer Diagnostic dataset distributed with Scikit-learn. The current generated dataset artifact reports **569 samples** and **30 numeric features**: ten cell-nucleus measurements, each represented as mean, standard error, and worst value. Labels are **0 = malignant** and **1 = benign** (212 malignant, 357 benign in this dataset). Feature names and order are recorded in `public/data/dataset_stats.json` and mirrored for the prediction form in `src/utils/featureGroups.js`.

## Technologies

- React 18, Vite, React Router, Tailwind CSS, Recharts, and Lucide React
- JavaScript and CSS for the browser application
- Python, NumPy, Pandas, and Scikit-learn for training and evaluation
- `skl2onnx` for model export; ONNX Runtime for export checks and ONNX Runtime Web (WASM) for browser inference
- Netlify for static-site hosting and SPA routing

## Machine-learning methodology

`ml/train_and_export.py` loads the dataset and performs an 80/20 stratified train/test split with `random_state=42`. StandardScaler is placed inside the Logistic Regression and SVM Scikit-learn pipelines, so it is fitted on the training data; Random Forest uses unscaled features. The script trains:

- **Logistic Regression:** `C=1.0`, `lbfgs`, maximum 10,000 iterations.
- **Random Forest:** 200 trees, no maximum depth, `min_samples_split=2`.
- **Support Vector Machine:** RBF kernel, `C=1.0`, `gamma="scale"`, probability estimates enabled.

The script evaluates each model on the held-out split. It treats malignant (class 0) as the positive class for precision, recall, and F1, and saves the two-class confusion matrix in `[malignant, benign]` class order. The selected default is determined by malignant recall, then F1. Feature analysis uses Logistic Regression coefficients, Random Forest impurity-based importances, and SVM permutation importance (`f1_macro`). The script exports three ONNX files and checks ONNX labels and probabilities against Scikit-learn outputs.

## Evaluation results

These are the current values in `public/data/model_metrics.json`, generated for the stratified test set. Precision, recall, and F1 use malignant as the positive class.

| Model | Accuracy | Precision | Recall | F1 |
|---|---:|---:|---:|---:|
| Logistic Regression | 98.25% | 97.62% | 97.62% | 97.62% |
| Random Forest | 95.61% | 95.12% | 92.86% | 93.98% |
| Support Vector Machine | 98.25% | 97.62% | 97.62% | 97.62% |

The checked-in generated artifacts also include per-model confusion matrices and feature importance data under `public/data/`. Results describe this dataset and split only; they are not clinical performance claims.

## Application features

- **Overview:** dataset statistics, default-model summary, and model charts.
- **Prediction:** 30-feature form, input validation, sample loading, model selection, ONNX inference, and class probabilities.
- **Model Comparison:** metric table and per-metric comparison charts.
- **Analytics:** selectable confusion matrices, metric charts, and feature-importance views.
- **Prediction History:** browser-local prediction history using localStorage.
- **About:** dataset, methods, algorithms, team details, and references.
- **Light/dark appearance** with stored theme preference and system preference detection.

Predictions are performed in the browser using `src/utils/onnxInference.js` and models in `public/models/`. The application fetches JSON artifacts from `public/data/` through Vite's public-asset paths.

## Repository layout

```text
.
├── ml/
│   └── train_and_export.py
├── public/
│   ├── data/
│   │   ├── confusion_matrices.json
│   │   ├── dataset_stats.json
│   │   ├── feature_importance.json
│   │   ├── model_metrics.json
│   │   └── sample_input.json
│   ├── models/
│   │   ├── logistic_regression.onnx
│   │   ├── random_forest.onnx
│   │   └── svm.onnx
│   ├── favicon.svg
│   └── logo.png
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── utils/
├── Shadeed/                 # Frontend & Inference contribution documentation/copies
├── Abdul Hakim Zain/        # ML engineering contribution documentation/copies
├── Umme Haney Jarin/        # Research/testing contribution documentation/copies
├── index.html
├── netlify.toml
├── package.json
└── README.md
```

The contribution folders contain selected copies for review, not separate runnable applications. See each folder's README for file descriptions and overlap with the other contribution bundles.

## Installation and local development

Requirements: Node.js 18 or newer and npm 9 or newer. Python 3.9 or newer is needed only if retraining or regenerating artifacts.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The committed model and JSON artifacts support the app without running Python first.

To build the production site locally:

```bash
npm run build
npm run preview
```

The build output is `dist/`. Generated training artifacts are already present. If you intentionally regenerate them, install the Python libraries imported in `ml/train_and_export.py` (`numpy`, `pandas`, `scikit-learn`, `skl2onnx`, and `onnxruntime`) and run the script from the `ml/` directory because its output paths are relative to that working directory:

```bash
cd ml
python train_and_export.py
cd ..
```

## Netlify deployment

The root `netlify.toml` configures `npm run build`, publishes `dist`, specifies Node.js 20, and includes an SPA fallback to `index.html`. Connect the repository in Netlify and use the project root as the base directory. Ensure `public/models/` and `public/data/` are included in the repository; Vite copies these public assets into `dist/` during the build. The configuration also sets COOP/COEP headers for the WASM runtime and caching headers for model/data assets.

Do not commit `node_modules/`, `dist/`, `.netlify/`, local environment files, or caches. The root `.gitignore` excludes these common generated/local paths.

## Team and contribution areas

- **Shadeed — Project Lead & Application Developer:** application structure and routing, UI and page integration, responsive drawer and navigation, branding, theme system, and application-level prediction/analytics presentation.
- **Abdul Hakim Zain — ML Engineer:** dataset loading and preparation, Scikit-learn pipelines and model training, ONNX export, and export parity checks.
- **Umme Haney Jarin — Researcher & Tester:** feature analysis and interpretation, model evaluation outputs, and analytics/comparison presentation and documentation.

Some files are intentionally shared between contribution folders because they support more than one assigned area. The folder READMEs identify those overlaps; a copied file alone is not proof of independent authorship.

## License and use

The root project describes the project as MIT-licensed for educational use. This software and its predictions are not intended for diagnosis or medical decisions.
