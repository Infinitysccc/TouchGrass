import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#facc15",
      light: "#fde047",
      dark: "#eab308",
      contrastText: "#1f2937",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
    success: {
      main: "#16a34a",
    },
    warning: {
      main: "#eab308",
    },
    error: {
      main: "#dc2626",
    },
    info: {
      main: "#2563eb",
    },
    divider: "#e8eef3",
  },

  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontWeight: 900,
      letterSpacing: "-0.04em",
      lineHeight: 1,
    },
    h2: {
      fontWeight: 900,
      letterSpacing: "-0.035em",
      lineHeight: 1.05,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.08,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 800,
      letterSpacing: "-0.015em",
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    overline: {
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },

  shape: {
    borderRadius: 18,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(15,23,42,0.04)",
    "0 2px 6px rgba(15,23,42,0.05)",
    "0 4px 10px rgba(15,23,42,0.05)",
    "0 6px 14px rgba(15,23,42,0.06)",
    "0 8px 18px rgba(15,23,42,0.06)",
    "0 10px 22px rgba(15,23,42,0.07)",
    "0 12px 26px rgba(15,23,42,0.07)",
    "0 14px 30px rgba(15,23,42,0.08)",
    "0 16px 34px rgba(15,23,42,0.08)",
    "0 18px 38px rgba(15,23,42,0.08)",
    "0 20px 42px rgba(15,23,42,0.09)",
    "0 22px 46px rgba(15,23,42,0.09)",
    "0 24px 50px rgba(15,23,42,0.10)",
    "0 26px 54px rgba(15,23,42,0.10)",
    "0 28px 58px rgba(15,23,42,0.10)",
    "0 30px 62px rgba(15,23,42,0.11)",
    "0 32px 66px rgba(15,23,42,0.11)",
    "0 34px 70px rgba(15,23,42,0.11)",
    "0 36px 74px rgba(15,23,42,0.12)",
    "0 38px 78px rgba(15,23,42,0.12)",
    "0 40px 82px rgba(15,23,42,0.12)",
    "0 42px 86px rgba(15,23,42,0.13)",
    "0 44px 90px rgba(15,23,42,0.13)",
    "0 46px 94px rgba(15,23,42,0.13)",
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: "100%",
          height: "100%",
          scrollBehavior: "smooth",
        },
        body: {
          width: "100%",
          minHeight: "100%",
          margin: 0,
          background:
            "linear-gradient(180deg, #f8fafc 0%, #f3f7f4 55%, #f8fafc 100%)",
        },
        "#root": {
          width: "100%",
          minHeight: "100vh",
        },
        "*": {
          boxSizing: "border-box",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
        containedPrimary: {
          boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
        },
      },
    },

    MuiCard: {
        styleOverrides: {
            root: {
            borderRadius: 18,
            border: "1px solid #e8eef3",
            boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
            backgroundImage: "none",
            },
        },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "#ffffff",
          transition: "all 0.2s ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "#22c55e",
          },
        },
        notchedOutline: {
          borderColor: "#dbe4ec",
        },
        input: {
          paddingTop: 14,
          paddingBottom: 14,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          overflow: "hidden",
          backgroundColor: "#eef2f7",
        },
      },
    },
  },
});

export default theme;