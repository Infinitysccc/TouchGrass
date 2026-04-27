// src/App.tsx
import {
  BrowserRouter as Router, Routes, Route, Navigate,
  Outlet, Link as RouterLink, useLocation, useNavigate,
} from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Avatar, Box, Button, BottomNavigation, BottomNavigationAction,
  Chip, Container, CssBaseline, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Paper, Stack, Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

import HeaderPage from "./pages/HeaderPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import GetStarted from "./pages/GetStarted";

// ─── Page transition ──────────────────────────────────────────────────────────

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <Box
      key={location.pathname}
      sx={{
        animation: "fadeSlideIn 0.22s ease forwards",
        "@keyframes fadeSlideIn": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {children}
    </Box>
  );
}

// ─── Desktop nav pill ─────────────────────────────────────────────────────────

function NavPill({ to, label, icon, active }: {
  to: string; label: string; icon: React.ReactNode; active: boolean;
}) {
  return (
    <Button
      component={RouterLink}
      to={to}
      startIcon={icon}
      sx={{
        minWidth: "auto", px: 2, py: 1, borderRadius: 999,
        textTransform: "none", fontWeight: 700,
        color: active ? "primary.dark" : "text.secondary",
        backgroundColor: active ? "rgba(34,197,94,0.12)" : "transparent",
        border: active ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
        "&:hover": {
          backgroundColor: active ? "rgba(34,197,94,0.16)" : "rgba(148,163,184,0.08)",
        },
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </Button>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function AppLayout({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const pageMeta = useMemo(() => {
    switch (location.pathname) {
      case "/profile":  return { title: "Profile",   subtitle: "Manage the personal factors used to tailor your vitamin D guidance." };
      case "/settings": return { title: "Settings",  subtitle: "Adjust your app preferences and experience." };
      case "/help":     return { title: "Help",      subtitle: "Learn how to use TouchGrass and troubleshoot common issues." };
      default:          return { title: "Dashboard", subtitle: "Your daily sunlight and vitamin D snapshot in one place." };
    }
  }, [location.pathname]);

  // Map path → bottom nav index
  const bottomNavValue = useMemo(() => {
    switch (location.pathname) {
      case "/dashboard": return 0;
      case "/profile":   return 1;
      case "/settings":  return 2;
      case "/help":      return 3;
      default:           return 0;
    }
  }, [location.pathname]);

  const bottomNavRoutes = ["/dashboard", "/profile", "/settings", "/help"];

  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  const user = JSON.parse(storedUser);
  const userName = user?.name || "User";
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  const isDashboard = location.pathname === "/dashboard";
  const isProfile   = location.pathname === "/profile";
  const isSettings  = location.pathname === "/settings";
  const isHelp      = location.pathname === "/help";

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    onLogout();
    setLogoutOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <CssBaseline />

      {/* ── Desktop / tablet top navbar (hidden on mobile) ────────────────── */}
      <Box sx={{
        position: "sticky", top: 0, zIndex: 1100,
        px: { xs: 2, md: 3 }, pt: 2,
        display: { xs: "none", sm: "block" },  // hidden on phone — bottom nav takes over
      }}>
        <Box sx={{
          maxWidth: 1600, mx: "auto",
          px: { xs: 1.5, md: 2 }, py: 1.5,
          borderRadius: 999,
          border: "1px solid", borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 28px rgba(15,23,42,0.07)",
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between"
            spacing={2} sx={{ minHeight: 52 }}>

            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: "13px",
                display: "grid", placeItems: "center",
                background: "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(250,204,21,0.26) 100%)",
                border: "1px solid rgba(34,197,94,0.18)", flexShrink: 0,
              }}>
                <WbSunnyRoundedIcon sx={{ color: "primary.dark", fontSize: 20 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  TouchGrass
                </Typography>
                <Typography variant="caption" color="text.secondary"
                  sx={{ display: { xs: "none", md: "block" } }}>
                  Vitamin D wellness tracker
                </Typography>
              </Box>
            </Stack>

            {/* Nav pills */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <NavPill to="/dashboard" label="Dashboard" icon={<DashboardRoundedIcon fontSize="small" />} active={isDashboard} />
              <NavPill to="/profile"   label="Profile"   icon={<PersonRoundedIcon fontSize="small" />}    active={isProfile} />
              <NavPill to="/settings"  label="Settings"  icon={<SettingsRoundedIcon fontSize="small" />}  active={isSettings} />
              <NavPill to="/help"      label="Help"      icon={<HelpOutlineRoundedIcon fontSize="small" />} active={isHelp} />
            </Stack>

            {/* Right side */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip label="Wellness Mode" sx={{
                display: { xs: "none", lg: "inline-flex" },
                borderRadius: 999, fontWeight: 700,
                bgcolor: "rgba(34,197,94,0.10)", color: "primary.dark",
                border: "1px solid rgba(34,197,94,0.16)",
              }} />
              <Button onClick={() => navigate("/profile")} sx={{
                minWidth: "auto", borderRadius: 999, px: 1,
                textTransform: "none", color: "text.primary",
              }}>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: "rgba(34,197,94,0.16)", color: "primary.dark", fontWeight: 800 }}>
                    {initial}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", lg: "block" }, textAlign: "left" }}>
                    <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.1 }}>{userName}</Typography>
                    <Typography variant="caption" color="text.secondary">View profile</Typography>
                  </Box>
                </Stack>
              </Button>
              <Button onClick={() => setLogoutOpen(true)} startIcon={<LogoutRoundedIcon />} sx={{
                borderRadius: 999, px: 2, textTransform: "none", fontWeight: 700, color: "text.secondary",
                "&:hover": { bgcolor: "rgba(220,38,38,0.06)", color: "error.main" },
                transition: "all 0.18s ease",
              }}>
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* ── Mobile top bar (shown on phone only) ─────────────────────────── */}
      <Box sx={{
        display: { xs: "flex", sm: "none" },
        position: "sticky", top: 0, zIndex: 1100,
        alignItems: "center", justifyContent: "space-between",
        px: 2, py: 1.25,
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid", borderColor: "divider",
        boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
      }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{
            width: 34, height: 34, borderRadius: "10px",
            display: "grid", placeItems: "center",
            background: "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(250,204,21,0.26) 100%)",
            border: "1px solid rgba(34,197,94,0.18)",
          }}>
            <WbSunnyRoundedIcon sx={{ color: "primary.dark", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em" }}>
            TouchGrass
          </Typography>
        </Stack>

        {/* Mobile: avatar + logout */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar onClick={() => navigate("/profile")}
            sx={{
              width: 32, height: 32,
              bgcolor: "rgba(34,197,94,0.16)", color: "primary.dark",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
            }}>
            {initial}
          </Avatar>
          <Button size="small" onClick={() => setLogoutOpen(true)}
            sx={{
              minWidth: "auto", p: 1, borderRadius: 999,
              color: "text.secondary",
              "&:hover": { color: "error.main", bgcolor: "rgba(220,38,38,0.06)" },
            }}>
            <LogoutRoundedIcon fontSize="small" />
          </Button>
        </Stack>
      </Box>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 1.5, sm: 3, md: 4, lg: 5 },
          py: { xs: 2, sm: 3 },
          // Bottom padding on mobile so content isn't hidden behind bottom nav
          pb: { xs: "80px", sm: 3 },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1500, px: { xs: 0, sm: 1, md: 1.5 }, mx: "auto" }}>
          <Box sx={{ mb: { xs: 2, md: 3 }, px: { xs: 0, md: 1 } }}>
            <Typography sx={{
              fontSize: { xs: 22, md: 34 }, fontWeight: 900,
              lineHeight: 1.05, letterSpacing: "-0.03em", mb: 0.5,
            }}>
              {pageMeta.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
              {pageMeta.subtitle}
            </Typography>
          </Box>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Container>
      </Box>

      {/* ── Mobile bottom navigation ──────────────────────────────────────── */}
      <Paper
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 1100,
          borderTop: "1px solid", borderColor: "divider",
          // Safe area for iPhone home indicator
          pb: "env(safe-area-inset-bottom)",
        }}
        elevation={0}
      >
        <BottomNavigation
          value={bottomNavValue}
          onChange={(_, newValue) => navigate(bottomNavRoutes[newValue])}
          sx={{
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px)",
            height: 60,
            "& .MuiBottomNavigationAction-root": {
              minWidth: 0, color: "text.secondary",
              "&.Mui-selected": { color: "primary.dark" },
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
              fontWeight: 700,
              "&.Mui-selected": { fontSize: "11px !important" },
            },
          }}
        >
          <BottomNavigationAction label="Dashboard" icon={<DashboardRoundedIcon />} />
          <BottomNavigationAction label="Profile"   icon={<PersonRoundedIcon />} />
          <BottomNavigationAction label="Settings"  icon={<SettingsRoundedIcon />} />
          <BottomNavigationAction label="Help"      icon={<HelpOutlineRoundedIcon />} />
        </BottomNavigation>
      </Paper>

      {/* ── Logout dialog ─────────────────────────────────────────────────── */}
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: 380, mx: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: 20, pb: 1 }}>
          Log out of TouchGrass?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your progress is saved. You can log back in anytime to pick up where you left off.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setLogoutOpen(false)} variant="outlined"
            sx={{ borderRadius: 999, fontWeight: 700, flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error"
            sx={{ borderRadius: 999, fontWeight: 800, flex: 1 }}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("user") || !!sessionStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {!loggedIn && (
          <>
            <Route path="/"           element={<HeaderPage />} />
            <Route path="/login"      element={<LoginPage onLogin={() => setLoggedIn(true)} />} />
            <Route path="/getstarted" element={<GetStarted onRegister={() => setLoggedIn(true)} />} />
            <Route path="*"           element={<Navigate to="/" />} />
          </>
        )}
        {loggedIn && (
          <Route element={<AppLayout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="/help"      element={<Help />} />
            <Route path="*"          element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
