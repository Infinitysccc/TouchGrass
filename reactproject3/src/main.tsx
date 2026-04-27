// src/main.tsx
// Reads saved theme preference from localStorage and applies the correct
// MUI theme at startup. Settings page writes to the same key.
import React, { useMemo, useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import App from "./App";

// ── Theme context ─────────────────────────────────────────────────────────────
// Any component can call useThemeMode() to read or toggle the current mode.

type ThemeMode = "light" | "system";

type ThemeModeCtx = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
};

export const ThemeModeContext = createContext<ThemeModeCtx>({
  mode: "light",
  setMode: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

// ── Root ──────────────────────────────────────────────────────────────────────

function Root() {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("touchgrass_settings");
      return saved ? (JSON.parse(saved).themeMode ?? "light") : "light";
    } catch {
      return "light";
    }
  });

  const setMode = (m: ThemeMode) => setModeState(m);

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const activeTheme = useMemo(() => {
    if (mode === "system") return prefersDark ? darkTheme : lightTheme;
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode, prefersDark]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
