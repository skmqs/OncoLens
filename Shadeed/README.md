# OncoLens — Shadeed's Application Contributions

**Contributor:** Shadeed  
**Assigned role:** Project Lead & Application Developer

## Contribution summary

This folder contains copies of the application shell, navigation, theme handling, visual styling, brand assets, and principal page components. Together these files represent how OncoLens is assembled and how users move through its overview, prediction, comparison, analytics, and project-information experiences. Copies are included for contribution documentation; the application originals remain in their project locations.

## File-by-file contributions

| File | Contribution represented |
|---|---|
| `index.html` | HTML document entry shell, OncoLens page title and metadata, favicon reference, and early theme initialization to reduce a flash before React mounts. |
| `public/logo.png` | PNG brand asset referenced by the application for OncoLens identity. |
| `src/App.jsx` | Main React application shell; declares routes for the six app sections; coordinates drawer open/close state, route changes, Escape handling, and theme props. |
| `src/main.jsx` | React root entry point; wraps the app in `BrowserRouter` and initializes the saved or system-selected theme before rendering. |
| `src/index.css` | Global Tailwind-based component styling, light/dark theme tokens and overrides, chart appearance, responsive layouts, focus and reduced-motion treatment, and animated drawer styles. |
| `src/components/Sidebar.jsx` | Main route navigation and responsive drawer UI, including the drawer edge toggle and mobile close control. |
| `src/components/TopBar.jsx` | Route-aware page title/subtitle toolbar and accessible light/dark theme switch. |
| `src/hooks/useTheme.js` | Theme state management: reads saved preference, follows system preference when no manual choice is saved, updates the root theme attribute, and persists toggle choices in localStorage. |
| `src/pages/About.jsx` | About page with project methodology and dataset information, fixed team cards, and the team-card layout. |
| `src/pages/Overview.jsx` | Dashboard overview that loads dataset/model artifacts and presents summary metrics, charts, and navigation links. |
| `src/pages/Prediction.jsx` | Prediction form, feature validation, model selection, sample loading, and result/history handling. It calls the existing `runInference` utility from `src/utils/onnxInference.js`, which loads and runs the ONNX Runtime Web model; the inference utility itself is not included in this folder. |
| `src/pages/Analytics.jsx` | Analytics page integration for confusion matrices, model metric charts, and selectable feature-importance views. Shared copy with Umme Haney Jarin's folder; the overlap is not independent authorship evidence. |
| `src/pages/ModelComparison.jsx` | Model comparison page integration for performance tables, metric highlighting, and comparison charts. Shared copy with Umme Haney Jarin's folder; the overlap is not independent authorship evidence. |

## Shared files and scope

All listed files are copies from the project. `Analytics.jsx` and `ModelComparison.jsx` are also present in Jarin's Researcher & Tester bundle because they present evaluation results. Their matching contents document shared project files, not separate independent implementations. This folder does not include ML training code, ONNX model files, or generated evaluation JSON artifacts.
