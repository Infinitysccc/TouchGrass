import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Stack,
  Typography,
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

type AppLayoutProps = {
  onLogout: () => void;
};

function NavPill({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Button
      component={RouterLink}
      to={to}
      startIcon={icon}
      sx={{
        minWidth: "auto",
        px: 2,
        py: 1,
        borderRadius: 999,
        textTransform: "none",
        fontWeight: 700,
        color: active ? "#166534" : "#475569",
        backgroundColor: active ? "rgba(34,197,94,0.14)" : "transparent",
        border: active ? "1px solid rgba(34,197,94,0.18)" : "1px solid transparent",
        "&:hover": {
          backgroundColor: active
            ? "rgba(34,197,94,0.18)"
            : "rgba(148,163,184,0.10)",
        },
      }}
    >
      {label}
    </Button>
  );
}

function AppLayout({ onLogout }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const pageMeta = useMemo(() => {
    switch (location.pathname) {
      case "/profile":
        return {
          title: "Profile",
          subtitle: "Manage the personal factors used to tailor your vitamin D guidance.",
        };
      case "/settings":
        return {
          title: "Settings",
          subtitle: "Adjust your app preferences and experience.",
        };
      case "/help":
        return {
          title: "Help",
          subtitle: "Learn how to use TouchGrass and troubleshoot common issues.",
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Your daily sunlight and vitamin D snapshot in one place.",
        };
    }
  }, [location.pathname]);

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  const user = JSON.parse(storedUser);
  const userName = user?.name || "User";
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  const isDashboard = location.pathname === "/dashboard";
  const isProfile = location.pathname === "/profile";
  const isSettings = location.pathname === "/settings";
  const isHelp = location.pathname === "/help";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f3f7f4 55%, #f8fafc 100%)",
      }}
    >
      <CssBaseline />

      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          px: { xs: 2, md: 3 },
          pt: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1600,
            mx: "auto",
            px: { xs: 1.5, md: 2 },
            py: 1.5,
            borderRadius: 999,
            border: "1px solid rgba(226,232,240,0.95)",
            backgroundColor: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ minHeight: 52 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(34,197,94,0.16) 0%, rgba(250,204,21,0.24) 100%)",
                  border: "1px solid rgba(34,197,94,0.16)",
                  flexShrink: 0,
                }}
              >
                <WbSunnyRoundedIcon sx={{ color: "#166534" }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  TouchGrass
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Vitamin D wellness tracker
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <NavPill
                to="/dashboard"
                label="Dashboard"
                icon={<DashboardRoundedIcon fontSize="small" />}
                active={isDashboard}
              />
              <NavPill
                to="/profile"
                label="Profile"
                icon={<PersonRoundedIcon fontSize="small" />}
                active={isProfile}
              />
              <NavPill
                to="/settings"
                label="Settings"
                icon={<SettingsRoundedIcon fontSize="small" />}
                active={isSettings}
              />
              <NavPill
                to="/help"
                label="Help"
                icon={<HelpOutlineRoundedIcon fontSize="small" />}
                active={isHelp}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Chip
                label="Wellness Mode"
                sx={{
                  display: { xs: "none", lg: "inline-flex" },
                  borderRadius: 999,
                  fontWeight: 700,
                  backgroundColor: "rgba(34,197,94,0.10)",
                  color: "#166534",
                  border: "1px solid rgba(34,197,94,0.14)",
                }}
              />

              <Button
                onClick={() => navigate("/profile")}
                sx={{
                  minWidth: "auto",
                  borderRadius: 999,
                  px: 1,
                  textTransform: "none",
                  color: "text.primary",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.25}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "rgba(34,197,94,0.16)",
                      color: "#166534",
                      fontWeight: 800,
                    }}
                  >
                    {initial}
                  </Avatar>
                  <Box
                    sx={{
                      display: { xs: "none", lg: "block" },
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={800}
                      sx={{ lineHeight: 1.1 }}
                    >
                      {userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      View profile
                    </Typography>
                  </Box>
                </Stack>
              </Button>

              <Button
                onClick={onLogout}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#475569",
                  "&:hover": {
                    backgroundColor: "rgba(148,163,184,0.10)",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "flex", md: "none" },
              mt: 1.5,
              overflowX: "auto",
              pb: 0.5,
            }}
          >
            <NavPill
              to="/dashboard"
              label="Dashboard"
              icon={<DashboardRoundedIcon fontSize="small" />}
              active={isDashboard}
            />
            <NavPill
              to="/profile"
              label="Profile"
              icon={<PersonRoundedIcon fontSize="small" />}
              active={isProfile}
            />
            <NavPill
              to="/settings"
              label="Settings"
              icon={<SettingsRoundedIcon fontSize="small" />}
              active={isSettings}
            />
            <NavPill
              to="/help"
              label="Help"
              icon={<HelpOutlineRoundedIcon fontSize="small" />}
              active={isHelp}
            />
          </Stack>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          py: 3,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1500,
            px: { xs: 0.5, sm: 1, md: 1.5 },
            mx: "auto",
          }}
        >
          <Box
            sx={{
              mb: 3,
              px: { xs: 0.5, md: 1 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 28, md: 36 },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                mb: 0.75,
              }}
            >
              {pageMeta.title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 760 }}
            >
              {pageMeta.subtitle}
            </Typography>
          </Box>

          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

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
            <Route path="/" element={<HeaderPage />} />
            <Route
              path="/login"
              element={<LoginPage onLogin={() => setLoggedIn(true)} />}
            />
            <Route
              path="/getstarted"
              element={<GetStarted onRegister={() => setLoggedIn(true)} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {loggedIn && (
          <Route element={<AppLayout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}