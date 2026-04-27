// src/theme.ts
import { createTheme, type ThemeOptions } from "@mui/material/styles";

const shared: ThemeOptions = {
  typography: {
    fontFamily: [
      "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont",
      '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif",
    ].join(","),
    h6: { fontWeight: 800, letterSpacing: "-0.015em" },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: "-0.01em" },
    overline: { fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, paddingBlock: 10 },
        containedPrimary: { boxShadow: "0 10px 24px rgba(34,197,94,0.22)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, backgroundImage: "none" },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          transition: "all 0.2s ease",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "#22c55e",
          },
        },
        input: { paddingTop: 14, paddingBottom: 14 },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 999, overflow: "hidden" } },
    },
    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#22c55e", light: "#4ade80", dark: "#16a34a", contrastText: "#ffffff" },
    secondary: { main: "#facc15", light: "#fde047", dark: "#eab308", contrastText: "#1f2937" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#475569" },
    success: { main: "#16a34a" },
    warning: { main: "#eab308" },
    error: { main: "#dc2626" },
    info: { main: "#2563eb" },
    divider: "#e8eef3",
  },
  components: {
    ...shared.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg, #f8fafc 0%, #f3f7f4 55%, #f8fafc 100%)",
          minHeight: "100vh",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#22c55e", light: "#4ade80", dark: "#16a34a", contrastText: "#ffffff" },
    secondary: { main: "#facc15", light: "#fde047", dark: "#eab308", contrastText: "#1f2937" },
    background: { default: "#0f172a", paper: "#1e293b" },
    text: { primary: "#f1f5f9", secondary: "#94a3b8" },
    success: { main: "#22c55e" },
    warning: { main: "#facc15" },
    error: { main: "#f87171" },
    info: { main: "#60a5fa" },
    divider: "#334155",
  },
  components: {
    ...shared.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg, #0f172a 0%, #0d1f14 55%, #0f172a 100%)",
          minHeight: "100vh",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.04)",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "#22c55e",
          },
        },
        input: { paddingTop: 14, paddingBottom: 14 },
      },
    },
  },
});

// Keep default export as light for backwards compat
export default lightTheme;
