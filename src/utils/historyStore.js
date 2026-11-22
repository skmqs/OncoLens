/**
 * Prediction history — stored in localStorage, never sent to any server.
 */
const KEY = "bcps_prediction_history";

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  try {
    localStorage.setItem(KEY, JSON.stringify(history));
  } catch {
    /* storage quota exceeded — silently ignore */
  }
}

export function addPrediction(entry) {
  const hist = loadHistory();
  hist.unshift({ id: Date.now(), ...entry });
  saveHistory(hist.slice(0, 200)); // keep at most 200 entries
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch {}
}
