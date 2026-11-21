import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const THEME_KEY = "oncolens_theme";
let savedTheme = null;
try {
  savedTheme = localStorage.getItem(THEME_KEY);
} catch {
  // Fall back to the operating-system preference.
}
const initialTheme = savedTheme === "light" || savedTheme === "dark"
  ? savedTheme
  : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.dataset.theme = initialTheme;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
