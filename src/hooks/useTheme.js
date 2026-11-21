import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "oncolens_theme";

function getInitialTheme() {
  const stampedTheme = document.documentElement.dataset.theme;
  if (stampedTheme === "light" || stampedTheme === "dark") return stampedTheme;

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    // Storage may be disabled; follow the operating system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let manuallySelected = false;
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      manuallySelected = savedTheme === "light" || savedTheme === "dark";
    } catch {
      // The system theme listener remains useful when storage is unavailable.
    }

    if (manuallySelected) return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = event => setTheme(event.matches ? "dark" : "light");
    media.addEventListener?.("change", followSystem);
    return () => media.removeEventListener?.("change", followSystem);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // The chosen theme still applies for this session.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
