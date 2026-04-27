// src/pages/Settings.tsx
import React, { useMemo, useState } from "react";
import {
  Alert, Box, Button, CardContent, Chip, Divider,
  FormControl, InputLabel, MenuItem, Select,
  Stack, Switch, Typography,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import SurfaceCard from "../components/SurfaceCard";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import { useThemeMode } from "../main";

type SettingsState = {
  reminderNotifications: boolean;
  weeklySummary: boolean;
  insightHighlights: boolean;
  autoRefreshDashboard: boolean;
  compactCards: boolean;
  preferredUnits: "metric" | "imperial";
  dashboardView: "overview" | "detailed";
  themeMode: "light" | "system";
};

const defaults: SettingsState = {
  reminderNotifications: true, weeklySummary: true,
  insightHighlights: true, autoRefreshDashboard: true,
  compactCards: false, preferredUnits: "metric",
  dashboardView: "overview", themeMode: "light",
};

function SettingRow({ title, description, control }: {
  title: string; description: string; control: React.ReactNode;
}) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}>
      <Box sx={{ pr: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={700} sx={{ mb: 0.25 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {description}
        </Typography>
      </Box>
      <Box sx={{ flexShrink: 0 }}>{control}</Box>
    </Stack>
  );
}

export default function Settings() {
  const { mode: currentThemeMode, setMode: setThemeMode } = useThemeMode();

  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem("touchgrass_settings");
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  });
  const [success, setSuccess] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  const user = JSON.parse(storedUser);
  const userName = user?.name || "User";
  const remembered = !!localStorage.getItem("user");

  const toggle = (key: keyof SettingsState) =>
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setSettings((p) => ({ ...p, [key]: checked }));
      setSuccess(null);
    };

  const selectVal = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((p) => ({ ...p, [key]: value }));
    if (key === "themeMode") setThemeMode(value as "light" | "system");
    setSuccess(null);
  };

  const save = () => {
    localStorage.setItem("touchgrass_settings", JSON.stringify(settings));
    setThemeMode(settings.themeMode);
    setSuccess("Settings saved.");
  };

  const completionText = useMemo(() => {
    const n = [settings.reminderNotifications, settings.weeklySummary,
      settings.insightHighlights, settings.autoRefreshDashboard].filter(Boolean).length;
    return n >= 4 ? "Fully enabled" : n >= 2 ? "Balanced" : "Minimal";
  }, [settings]);

  const isDark = currentThemeMode === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : currentThemeMode === "dark";

  return (
    <Box sx={{ width: "100%" }}>
      {success && (
        <Alert severity="success" icon={<CheckCircleRoundedIcon />}
          sx={{ mb: 3, borderRadius: "14px" }}>{success}
        </Alert>
      )}

      <PageHero
        overline="App preferences"
        title="Customise your TouchGrass experience"
        subtitle="Control how the dashboard behaves, how insights are shown, and how the app looks."
        chips={[`Experience: ${completionText}`, remembered ? "Persistent login" : "Session login"]}
      />

      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1.6fr) 300px" },
        gap: 3,
      }}>
        {/* LEFT */}
        <Box>
          {/* Notifications */}
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<NotificationsRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Notifications & reminders"
                subtitle="Choose how proactively the app supports your routine." />
              <Stack spacing={2.5} divider={<Divider />}>
                <SettingRow title="Reminder notifications"
                  description="Gentle reminders to log sunlight and vitamin D intake."
                  control={<Switch checked={settings.reminderNotifications} onChange={toggle("reminderNotifications")} />} />
                <SettingRow title="Weekly summary"
                  description="Weekly wrap-up of your progress, consistency, and recommendations."
                  control={<Switch checked={settings.weeklySummary} onChange={toggle("weeklySummary")} />} />
                <SettingRow title="Insight highlights"
                  description="Show more prominent health insights on the dashboard."
                  control={<Switch checked={settings.insightHighlights} onChange={toggle("insightHighlights")} />} />
              </Stack>
            </CardContent>
          </SurfaceCard>

          {/* Dashboard */}
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<DashboardRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Dashboard behaviour"
                subtitle="Adjust how information is displayed on your main dashboard." />
              <Stack spacing={2.5} divider={<Divider />} sx={{ mb: 3 }}>
                <SettingRow title="Auto-refresh recommendations"
                  description="Keep dashboard insights dynamic after profile updates."
                  control={<Switch checked={settings.autoRefreshDashboard} onChange={toggle("autoRefreshDashboard")} />} />
                <SettingRow title="Compact card layout"
                  description="Denser dashboard with tighter spacing."
                  control={<Switch checked={settings.compactCards} onChange={toggle("compactCards")} />} />
              </Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)" }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Dashboard view</InputLabel>
                  <Select value={settings.dashboardView} label="Dashboard view"
                    onChange={(e) => selectVal("dashboardView", e.target.value as SettingsState["dashboardView"])}>
                    <MenuItem value="overview">Overview</MenuItem>
                    <MenuItem value="detailed">Detailed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Preferred units</InputLabel>
                  <Select value={settings.preferredUnits} label="Preferred units"
                    onChange={(e) => selectVal("preferredUnits", e.target.value as SettingsState["preferredUnits"])}>
                    <MenuItem value="metric">Metric</MenuItem>
                    <MenuItem value="imperial">Imperial</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </SurfaceCard>

          {/* Appearance — theme toggle actually works */}
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<PaletteRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Appearance"
                subtitle="Switch between light and system (dark) mode — changes take effect immediately." />
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <LightModeRoundedIcon sx={{ color: settings.themeMode === "light" ? "#eab308" : "text.disabled" }} />
                <Switch
                  checked={settings.themeMode === "system"}
                  onChange={(_, checked) => selectVal("themeMode", checked ? "system" : "light")}
                />
                <DarkModeRoundedIcon sx={{ color: settings.themeMode === "system" ? "#6366f1" : "text.disabled" }} />
                <Typography variant="body2" fontWeight={700}>
                  {settings.themeMode === "system" ? "System (follows device)" : "Light mode"}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                This toggle is wired to <code>ThemeModeContext</code> in <code>main.tsx</code> and
                applies immediately across the whole app without a page reload.
              </Typography>
            </CardContent>
          </SurfaceCard>

          {/* Save */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" onClick={save} startIcon={<SaveRoundedIcon />}
              sx={{ minWidth: 200, py: 1.3, borderRadius: 999, fontWeight: 800 }}>
              Save Settings
            </Button>
            <Button variant="outlined"
              onClick={() => { setSettings(defaults); setThemeMode("light"); setSuccess(null); }}
              sx={{ minWidth: 160, py: 1.3, borderRadius: 999 }}>
              Reset Defaults
            </Button>
          </Stack>
        </Box>

        {/* RIGHT */}
        <Box>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Account snapshot</Typography>
              <Stack spacing={0} divider={<Divider />}>
                {[
                  { label: "Signed in as", value: userName },
                  { label: "Login type", value: remembered ? "Remember me" : "Session only" },
                  { label: "Dashboard style", value: settings.dashboardView },
                  { label: "Units", value: settings.preferredUnits },
                  { label: "Theme", value: settings.themeMode === "system" ? "System / dark" : "Light" },
                ].map((item) => (
                  <Stack key={item.label} direction="row" justifyContent="space-between"
                    alignItems="center" spacing={2} sx={{ py: 1.25 }}>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{
            mb: 3,
            background: "linear-gradient(180deg, rgba(255,250,230,0.8) 0%, transparent 100%)",
            border: "1px solid rgba(234,179,8,0.22)",
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <SecurityRoundedIcon sx={{ color: "#eab308" }} />
                <Typography variant="h6" fontWeight={800}>Product note</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                Settings are saved to local browser storage for a complete demo experience.
              </Typography>
              <Stack spacing={1}>
                {["No backend settings table needed", "Easy to extend to API later", "Adds realism to the demo"].map((t) => (
                  <Chip key={t} label={t} size="small"
                    sx={{ justifyContent: "flex-start", borderRadius: 999, fontSize: 12 }} />
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <LogoutRoundedIcon color="action" />
                <Typography variant="h6" fontWeight={800}>Session behaviour</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Login persistence is controlled by the "Remember me" option at sign-in.
                It determines whether your session uses local storage or session storage.
              </Typography>
            </CardContent>
          </SurfaceCard>
        </Box>
      </Box>
    </Box>
  );
}
