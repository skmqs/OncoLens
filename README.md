# OncoLens

OncoLens is an educational machine-learning web application that demonstrates breast tumor classification on the Wisconsin Breast Cancer Diagnostic Dataset. This repository contains Shadeed's application-development contribution bundle, not the complete runnable application: the project root `package.json`, ML training script, ONNX model files, generated evaluation data, and other members' contribution folders are intentionally not included.

## Included contribution areas

- React application shell and client-side route configuration.
- Navigation drawer, top toolbar, responsive styling, and persisted light/dark theme behavior.
- Overview, prediction, comparison, analytics, and About page UI contributions.
- OncoLens page metadata and PNG brand asset.

## File guide

- `index.html` — document metadata, favicon, and pre-render theme selection.
- `public/logo.png` — OncoLens mark.
- `src/App.jsx`, `src/main.jsx` — application composition, routes, and React bootstrap.
- `src/components/` — drawer navigation and toolbar/theme control.
- `src/hooks/useTheme.js` — system-preference detection and saved theme selection.
- `src/index.css` — global visual design, themes, charts, responsive layout, and drawer interaction styling.
- `src/pages/` — About, Overview, Prediction, Analytics, and Model Comparison page implementations.
- `docs/README-project.md` — full project overview, methodology, evaluation summary, setup, and deployment notes.

## Project context

The application uses React, Vite, Tailwind CSS, React Router, Recharts, Lucide icons, and ONNX Runtime Web. The prediction page calls the shared inference utility expected at `src/utils/onnxInference.js`; that utility and the model/data assets are outside this contribution-only repository. Model evaluation metrics are summarized in the project documentation and were computed by the shared training/evaluation script. See the full project copy in `docs/README-project.md` for the currently documented dataset, methods, results, and team roles.

The Analytics and Model Comparison page files overlap with Umme Haney Jarin's contribution bundle because those views present the generated evaluation results. Matching copies represent shared project files and do not establish independent authorship.

## Running the complete application

This bundle does not include a package manifest or all application dependencies/assets, so it is not standalone. To run OncoLens, use the complete project repository containing the root package manifest, utilities, models, and JSON artifacts.
