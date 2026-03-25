import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

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

const defaultSettings: SettingsState = {
  reminderNotifications: true,
  weeklySummary: true,
  insightHighlights: true,
  autoRefreshDashboard: true,
  compactCards: false,
  preferredUnits: "metric",
  dashboardView: "overview",
  themeMode: "light",
};

function SurfaceCard({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        border: "1px solid #e8eef3",
        boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
        backgroundColor: "#ffffff",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(34,197,94,0.10)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box sx={{ pr: 2 }}>
          <Typography fontWeight={700} sx={{ mb: 0.4 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0 }}>{control}</Box>
      </Stack>
    </Box>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("touchgrass_settings");
    if (!saved) return defaultSettings;

    try {
      return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
      return defaultSettings;
    }
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  const user = JSON.parse(storedUser);
  const userName = user?.name || "User";
  const remembered = !!localStorage.getItem("user");

  const handleToggle =
    (key: keyof SettingsState) =>
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setSettings((prev) => ({
        ...prev,
        [key]: checked,
      }));
      setSuccessMessage(null);
    };

  const handleSelect = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSuccessMessage(null);
  };

  const handleSave = () => {
    localStorage.setItem("touchgrass_settings", JSON.stringify(settings));
    setSuccessMessage("Settings saved successfully.");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSuccessMessage(null);
  };

  const completionText = useMemo(() => {
    const enabledCount = [
      settings.reminderNotifications,
      settings.weeklySummary,
      settings.insightHighlights,
      settings.autoRefreshDashboard,
    ].filter(Boolean).length;

    if (enabledCount >= 4) return "Fully enabled";
    if (enabledCount >= 2) return "Balanced";
    return "Minimal";
  }, [settings]);

  return (
    <Box sx={{ width: "100%" }}>
      {successMessage && (
        <Alert
          severity="success"
          icon={<CheckCircleRoundedIcon />}
          sx={{ mb: 3, borderRadius: 3 }}
        >
          {successMessage}
        </Alert>
      )}

      <SurfaceCard
        sx={{
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(250,204,21,0.14) 100%)",
          border: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={2}
          >
            <Box sx={{ maxWidth: 760 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: "0.12em" }}
              >
                App preferences
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 28, md: 42 },
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  mb: 1,
                }}
              >
                Customize your TouchGrass experience
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Control how your dashboard behaves, how insights are shown, and
                how the app supports your daily vitamin D tracking routine.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`Experience: ${completionText}`}
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                }}
              />
              <Chip
                label={remembered ? "Persistent login enabled" : "Session login"}
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </SurfaceCard>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.7fr) minmax(320px, 1fr)",
          },
          gap: 3,
        }}
      >
        <Box>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<NotificationsRoundedIcon sx={{ color: "#166534" }} />}
                title="Notifications & reminders"
                subtitle="Choose how proactively the app supports your routine."
              />

              <Stack spacing={2.25}>
                <SettingRow
                  title="Reminder notifications"
                  description="Enable gentle reminders to log sunlight and vitamin D intake."
                  control={
                    <Switch
                      checked={settings.reminderNotifications}
                      onChange={handleToggle("reminderNotifications")}
                    />
                  }
                />
                <Divider />
                <SettingRow
                  title="Weekly summary"
                  description="Show a weekly wrap-up of progress, consistency, and recommendations."
                  control={
                    <Switch
                      checked={settings.weeklySummary}
                      onChange={handleToggle("weeklySummary")}
                    />
                  }
                />
                <Divider />
                <SettingRow
                  title="Insight highlights"
                  description="Surface more prominent personalized health insights on the dashboard."
                  control={
                    <Switch
                      checked={settings.insightHighlights}
                      onChange={handleToggle("insightHighlights")}
                    />
                  }
                />
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<DashboardRoundedIcon sx={{ color: "#166534" }} />}
                title="Dashboard behavior"
                subtitle="Adjust the way information is displayed across your main dashboard."
              />

              <Stack spacing={2.25}>
                <SettingRow
                  title="Auto-refresh recommendations"
                  description="Keep dashboard recommendations feeling more dynamic after updates."
                  control={
                    <Switch
                      checked={settings.autoRefreshDashboard}
                      onChange={handleToggle("autoRefreshDashboard")}
                    />
                  }
                />
                <Divider />
                <SettingRow
                  title="Compact card layout"
                  description="Use a denser dashboard layout with tighter spacing and shorter cards."
                  control={
                    <Switch
                      checked={settings.compactCards}
                      onChange={handleToggle("compactCards")}
                    />
                  }
                />
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                  mt: 3,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Dashboard view</InputLabel>
                  <Select
                    value={settings.dashboardView}
                    label="Dashboard view"
                    onChange={(e) =>
                      handleSelect(
                        "dashboardView",
                        e.target.value as SettingsState["dashboardView"]
                      )
                    }
                  >
                    <MenuItem value="overview">Overview</MenuItem>
                    <MenuItem value="detailed">Detailed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Preferred units</InputLabel>
                  <Select
                    value={settings.preferredUnits}
                    label="Preferred units"
                    onChange={(e) =>
                      handleSelect(
                        "preferredUnits",
                        e.target.value as SettingsState["preferredUnits"]
                      )
                    }
                  >
                    <MenuItem value="metric">Metric</MenuItem>
                    <MenuItem value="imperial">Imperial</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<PaletteRoundedIcon sx={{ color: "#166534" }} />}
                title="Appearance"
                subtitle="Control the visual feel of the app experience."
              />

              <FormControl fullWidth sx={{ maxWidth: 360 }}>
                <InputLabel>Theme mode</InputLabel>
                <Select
                  value={settings.themeMode}
                  label="Theme mode"
                  onChange={(e) =>
                    handleSelect(
                      "themeMode",
                      e.target.value as SettingsState["themeMode"]
                    )
                  }
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Right now this controls saved preference state locally. Later,
                you can connect it to a real theme switch across the entire app.
              </Typography>
            </CardContent>
          </SurfaceCard>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveRoundedIcon />}
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1.2,
                minWidth: { xs: "100%", sm: 220 },
                boxShadow: "none",
              }}
            >
              Save Settings
            </Button>

            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1.2,
                minWidth: { xs: "100%", sm: 180 },
              }}
            >
              Reset Defaults
            </Button>
          </Stack>
        </Box>

        <Box>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Account snapshot
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {userName}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Login type
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {remembered ? "Remember me" : "Session only"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Dashboard style
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {settings.dashboardView}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Units
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {settings.preferredUnits}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard
            sx={{
              mb: 3,
              background:
                "linear-gradient(180deg, rgba(255,250,235,1) 0%, rgba(255,255,255,1) 100%)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <SecurityRoundedIcon color="warning" />
                <Typography variant="h6" fontWeight={800}>
                  Product note
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These settings are currently saved in local browser storage to
                improve the product feel and give your capstone a more complete
                settings experience.
              </Typography>

              <Stack spacing={1.25}>
                <Chip
                  label="No backend settings table required yet"
                  sx={{ justifyContent: "flex-start", borderRadius: 999 }}
                />
                <Chip
                  label="Easy to connect to API later"
                  sx={{ justifyContent: "flex-start", borderRadius: 999 }}
                />
                <Chip
                  label="Adds realism to the app now"
                  sx={{ justifyContent: "flex-start", borderRadius: 999 }}
                />
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <LogoutRoundedIcon color="action" />
                <Typography variant="h6" fontWeight={800}>
                  Session behavior
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Your login persistence is determined by whether you signed in
                with “Remember me.” That matches how your current login flow
                stores the user in either local storage or session storage.
              </Typography>
            </CardContent>
          </SurfaceCard>
        </Box>
      </Box>
    </Box>
  );
}