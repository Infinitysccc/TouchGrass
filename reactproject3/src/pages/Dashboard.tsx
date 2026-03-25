import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicationIcon from "@mui/icons-material/Medication";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeviceThermostatRoundedIcon from "@mui/icons-material/DeviceThermostatRounded";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import {
  latestDeviceReading,
  weeklyDeviceReadings,
  type DeviceReading,
} from "../data/mockDeviceData";

type UserData = {
  age: number;
  skinTone: "Light" | "Medium" | "Dark";
  bodyCoverage: "Full" | "Arms & Legs" | "Face only";
  timeOutdoors: number;
  dietaryIU: number;
  supplementIU: number;
  weight: number;
  height: number;
  medicalConditions: boolean;
  bloodLevel?: number;
};

type Result = {
  recommendedIU: number;
  category: string;
};

const emptyProfile: UserData = {
  age: 0,
  skinTone: "Medium",
  bodyCoverage: "Full",
  timeOutdoors: 0,
  dietaryIU: 0,
  supplementIU: 0,
  weight: 0,
  height: 0,
  medicalConditions: false,
};

const chipWrapSx = {
  borderRadius: 999,
  maxWidth: "100%",
  height: "auto",
  "& .MuiChip-label": {
    display: "block",
    whiteSpace: "normal",
    lineHeight: 1.2,
    py: 0.75,
  },
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

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tint,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  tint: string;
}) {
  return (
    <SurfaceCard sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 0.75,
                fontWeight: 600,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 28, md: 34 },
                fontWeight: 800,
                lineHeight: 1.05,
                mb: 0.75,
                letterSpacing: "-0.02em",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {value}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              width: 56,
              height: 56,
              borderRadius: "18px",
              display: "grid",
              placeItems: "center",
              bgcolor: tint,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </SurfaceCard>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #e8eef3",
        backgroundColor: "#f8fafc",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: 2.5,
            bgcolor: "#ecfdf5",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          sx={{ minWidth: 0, whiteSpace: "normal", wordBreak: "break-word" }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        fontWeight={800}
        sx={{ fontSize: 20, whiteSpace: "normal", wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function formatDay(timestamp: string) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getSupportLabel(totalScore: number) {
  if (totalScore < 400) return "Needs attention";
  if (totalScore < 800) return "Building momentum";
  if (totalScore < 1200) return "On track";
  return "Strong day";
}

function getContributionLabel(value: number) {
  if (value <= 0) return "None";
  if (value < 200) return "Light";
  if (value < 450) return "Moderate";
  return "Strong";
}

function getContributionDescription(
  source: "sunlight" | "food" | "supplements",
  value: number
) {
  const level = getContributionLabel(value);

  if (source === "sunlight") {
    if (level === "None") return "No sunlight support logged";
    if (level === "Light") return "A small sunlight boost";
    if (level === "Moderate") return "Good sunlight support";
    return "Strong sunlight support";
  }

  if (source === "food") {
    if (level === "None") return "No food support logged";
    if (level === "Light") return "A small food contribution";
    if (level === "Moderate") return "Good food support";
    return "Strong food support";
  }

  if (level === "None") return "No supplement support logged";
  if (level === "Light") return "A small supplement contribution";
  if (level === "Moderate") return "Good supplement support";
  return "Strong supplement support";
}

function getProgressMessage(progress: number) {
  if (progress < 30) return "Just getting started";
  if (progress < 70) return "Making steady progress";
  if (progress < 100) return "Almost there";
  return "Goal reached";
}

function getStatusMeta(category?: string) {
  if (category === "Optimal" || category === "Sufficient") {
    return { label: category, color: "success" as const };
  }
  if (category === "Insufficient") {
    return { label: category, color: "warning" as const };
  }
  if (category) {
    return { label: category, color: "error" as const };
  }
  return { label: "Awaiting sync", color: "default" as const };
}

function DeviceStatusWidget({
  reading,
  supportLabel,
}: {
  reading: DeviceReading;
  supportLabel: string;
}) {
  const lastSync = formatTime(reading.timestamp);

  return (
    <SurfaceCard
      sx={{
        mb: 3,
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="overline" color="text.secondary">
              Live bracelet feed
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ mb: 0.75, whiteSpace: "normal", wordBreak: "break-word" }}
            >
              Device snapshot
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
            >
              This demo is using simulated bracelet readings.
            </Typography>
          </Box>

          <Box
            sx={{
              minWidth: { xs: "100%", md: 240 },
              maxWidth: { xs: "100%", md: 260 },
              p: 2,
              borderRadius: 3,
              border: "1px solid #e8eef3",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Today’s support level
            </Typography>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {supportLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Based on sunlight, food, and supplement activity
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <MiniMetric
            icon={<AccessTimeIcon color="warning" fontSize="small" />}
            label="Sunlight detected"
            value={`${reading.sunlightMinutes} min`}
          />
          <MiniMetric
            icon={<DeviceThermostatRoundedIcon color="warning" fontSize="small" />}
            label="UV index"
            value={reading.uvIndex.toFixed(1)}
          />
          <MiniMetric
            icon={<SensorsRoundedIcon color="success" fontSize="small" />}
            label="Bracelet status"
            value={reading.braceletStatus}
          />
          <MiniMetric
            icon={<SyncRoundedIcon color="success" fontSize="small" />}
            label="Last sync"
            value={lastSync}
          />
        </Box>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ width: "100%" }}
        >
          <Chip
            icon={<WbSunnyIcon />}
            label={getContributionDescription("sunlight", reading.estimatedSunIU)}
            sx={chipWrapSx}
          />
          <Chip
            icon={<RestaurantIcon />}
            label={getContributionDescription("food", reading.dietaryIU)}
            sx={chipWrapSx}
          />
          <Chip
            icon={<MedicationIcon />}
            label={getContributionDescription("supplements", reading.supplementIU)}
            sx={chipWrapSx}
          />
          <Chip
            icon={<BoltRoundedIcon />}
            label={`${supportLabel} support level`}
            sx={chipWrapSx}
          />
        </Stack>
      </CardContent>
    </SurfaceCard>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserData>(emptyProfile);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const user = useMemo(() => {
    const local = localStorage.getItem("user");
    const session = sessionStorage.getItem("user");
    return JSON.parse(local || session || "{}");
  }, []);

  const userId = user?.id;
  const currentReading = latestDeviceReading;
  const outdoorGoal = 30;

  const outdoorMinutes = currentReading.sunlightMinutes;
  const sunlightScore = currentReading.estimatedSunIU;
  const foodScore = currentReading.dietaryIU;
  const supplementScore = currentReading.supplementIU;
  const totalSupportScore = sunlightScore + foodScore + supplementScore;
  const supportLabel = getSupportLabel(totalSupportScore);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoadError(null);

        if (!userId) {
          setLoading(false);
          return;
        }

        const profileRes = await fetch(
          `http://localhost:8080/profile?userId=${userId}`
        );
        if (!profileRes.ok) throw new Error(await profileRes.text());

        const p = await profileRes.json();

        const normalizedProfile: UserData = {
          age: p.age ?? 0,
          skinTone: p.skinTone ?? "Medium",
          bodyCoverage: p.bodyCoverage ?? "Full",
          timeOutdoors: outdoorMinutes,
          dietaryIU: foodScore,
          supplementIU: supplementScore,
          weight: p.weight ?? 0,
          height: p.height ?? 0,
          medicalConditions: p.medicalConditions ?? false,
          bloodLevel: p.bloodLevel,
        };

        setProfile(normalizedProfile);

        const calcRes = await fetch("http://localhost:8080/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedProfile),
        });

        if (!calcRes.ok) throw new Error(await calcRes.text());

        const calc = await calcRes.json();
        setResult(calc);
      } catch (err: any) {
        console.error("Dashboard load failed:", err);
        setLoadError(err?.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [userId, outdoorMinutes, foodScore, supplementScore]);

  const outdoorProgress = Math.min((outdoorMinutes / outdoorGoal) * 100, 100);

  const intakeProgress = result
    ? Math.min(
        (totalSupportScore / Math.max(result.recommendedIU || 1, 1)) * 100,
        100
      )
    : 0;

  const profileReadiness = Math.round(
    ([profile.age, profile.weight, profile.height, profile.bloodLevel]
      .filter((v) => v !== undefined && v !== null && Number(v) > 0).length /
      4) *
      100
  );

  const statusMeta = getStatusMeta(result?.category);

  const mainHeadline = result
    ? `${Math.round(intakeProgress)}% of today’s goal`
    : "Today’s wellness snapshot";

  const subHeadline = result
    ? `Your bracelet, food, and supplement activity suggest a ${supportLabel.toLowerCase()} so far today.`
    : "Using your latest bracelet sync and saved profile factors.";

  const recommendationText =
    outdoorMinutes < 15
      ? "Your sunlight exposure is still fairly low today. A bit more outdoor time could improve your overall support."
      : intakeProgress < 70
      ? "You have a decent base started today, but your overall support is still below your personalized target."
      : intakeProgress < 100
      ? "You are getting close to your recommended target. A small boost from sunlight, food, or supplements could finish the day strongly."
      : "You are in a strong position today. Your current readings suggest you are meeting your target well.";

  const nextAction =
    outdoorMinutes < outdoorGoal
      ? `Try to get about ${Math.max(outdoorGoal - outdoorMinutes, 0)} more minutes outside today.`
      : intakeProgress < 100
      ? "Sun exposure looks solid. A meal or supplement boost could help close the gap."
      : "You’ve reached a strong daily position. Keep logging consistent readings through the week.";

  const recentSunData = weeklyDeviceReadings.map((reading) => ({
    day: formatDay(reading.timestamp),
    sun: reading.sunlightMinutes,
  }));

  const recentSupportData = weeklyDeviceReadings.map((reading) => ({
    day: formatDay(reading.timestamp),
    score: reading.estimatedSunIU + reading.dietaryIU + reading.supplementIU,
  }));

  const sourceBreakdownData = [
    {
      label: "Sunlight",
      value: getContributionLabel(sunlightScore),
      description: `${currentReading.sunlightMinutes} min exposure`,
      icon: <WbSunnyIcon color="warning" />,
      tint: "rgba(250,204,21,0.18)",
    },
    {
      label: "Food",
      value: getContributionLabel(foodScore),
      description: "Logged from meals",
      icon: <RestaurantIcon color="success" />,
      tint: "rgba(34,197,94,0.10)",
    },
    {
      label: "Supplements",
      value: getContributionLabel(supplementScore),
      description: "Logged from tablets or drops",
      icon: <MedicationIcon color="success" />,
      tint: "rgba(16,185,129,0.12)",
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 1, px: { xs: 0, md: 0.5 } }}>
      {loadError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {loadError}
        </Alert>
      )}

      <SurfaceCard
        sx={{
          mb: 3,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.14) 0%, rgba(250,204,21,0.18) 100%)",
          border: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", lg: "center" }}
              spacing={2}
            >
              <Box sx={{ maxWidth: 760, minWidth: 0 }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ letterSpacing: "0.12em" }}
                >
                  TouchGrass dashboard
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 30, md: 46 },
                    fontWeight: 900,
                    lineHeight: 1.02,
                    letterSpacing: "-0.03em",
                    mb: 1,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {mainHeadline}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 680,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {subHeadline}
                </Typography>
              </Box>

              <Chip
                label={`Status: ${statusMeta.label}`}
                color={statusMeta.color}
                sx={{
                  fontWeight: 800,
                  px: 1.5,
                  py: 2.7,
                  fontSize: 15,
                  borderRadius: 999,
                  maxWidth: "100%",
                  height: "auto",
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                    lineHeight: 1.2,
                    py: 0.75,
                  },
                }}
              />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <MiniMetric
                icon={<WbSunnyIcon color="warning" fontSize="small" />}
                label="Sunlight time"
                value={`${outdoorMinutes} min`}
              />
              <MiniMetric
                icon={<TrendingUpIcon color="success" fontSize="small" />}
                label="Support level"
                value={supportLabel}
              />
              <MiniMetric
                icon={<SensorsRoundedIcon color="success" fontSize="small" />}
                label="Bracelet state"
                value={currentReading.braceletStatus}
              />
              <MiniMetric
                icon={<CheckCircleRoundedIcon color="success" fontSize="small" />}
                label="Goal progress"
                value={getProgressMessage(intakeProgress)}
              />
            </Box>
          </Stack>
        </CardContent>
      </SurfaceCard>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <StatCard
          title="Recommended target"
          value={result ? getProgressMessage(intakeProgress) : "Loading"}
          subtitle="Personalized from your saved profile"
          icon={<MonitorHeartIcon color="success" />}
          tint="rgba(34,197,94,0.10)"
        />

        <StatCard
          title="Estimated daily total"
          value={supportLabel}
          subtitle="Based on sunlight, food, and supplements"
          icon={<TrendingUpIcon color="success" />}
          tint="rgba(16,185,129,0.12)"
        />

        <StatCard
          title="Outdoor progress"
          value={`${Math.round(outdoorProgress)}%`}
          subtitle={`${outdoorMinutes} of ${outdoorGoal} min target`}
          icon={<WbSunnyIcon color="warning" />}
          tint="rgba(250,204,21,0.18)"
        />

        <StatCard
          title="Profile readiness"
          value={`${profileReadiness}%`}
          subtitle="Completeness of saved health factors"
          icon={<PersonIcon color="success" />}
          tint="rgba(59,130,246,0.10)"
        />
      </Box>

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
          <DeviceStatusWidget
            reading={currentReading}
            supportLabel={supportLabel}
          />

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={1}
                sx={{ mb: 2.5 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Recent sunlight trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily outdoor exposure captured from recent device readings.
                  </Typography>
                </Box>
                <Chip label="Sunlight" icon={<WbSunnyIcon />} />
              </Stack>

              <ResponsiveContainer width="100%" height={285}>
                <AreaChart data={recentSunData}>
                  <defs>
                    <linearGradient id="sunFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sun"
                    stroke="#eab308"
                    strokeWidth={3}
                    fill="url(#sunFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={1}
                sx={{ mb: 2.5 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Recent support trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A simple view of how your overall daily support has changed this week.
                  </Typography>
                </Box>
                <Chip label="Support" icon={<TrendingUpIcon />} />
              </Stack>

              <ResponsiveContainer width="100%" height={285}>
                <LineChart data={recentSupportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value: number) => getSupportLabel(Number(value))}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={1}
                sx={{ mb: 2.5 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Today’s source breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Where your support is coming from right now.
                  </Typography>
                </Box>
                <Chip label="Breakdown" icon={<BoltRoundedIcon />} />
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {sourceBreakdownData.map((item) => (
                  <StatCard
                    key={item.label}
                    title={item.label}
                    value={item.value}
                    subtitle={item.description}
                    icon={item.icon}
                    tint={item.tint}
                  />
                ))}
              </Box>
            </CardContent>
          </SurfaceCard>
        </Box>

        <Box>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2.5 }}>
                Today’s progress
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Outdoor time goal
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    {Math.round(outdoorProgress)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={outdoorProgress}
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: "#eef2f7",
                  }}
                />
              </Box>

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Daily goal progress
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    {Math.round(intakeProgress)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={intakeProgress}
                  color="success"
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: "#eef2f7",
                  }}
                />
              </Box>
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
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <TipsAndUpdatesIcon color="warning" />
                <Typography variant="h6" fontWeight={800}>
                  Smart insight
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                sx={{ mb: 2, whiteSpace: "normal", wordBreak: "break-word" }}
              >
                {recommendationText}
              </Typography>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "1px solid #f1e4b5",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <ArrowOutwardIcon fontSize="small" color="warning" />
                  <Typography variant="body2" fontWeight={700}>
                    Next best action
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {nextAction}
                </Typography>
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Device reading details
              </Typography>

              <Stack spacing={1.5}>
                {[
                  { label: "Last sync", value: formatTime(currentReading.timestamp) },
                  { label: "UV index", value: currentReading.uvIndex.toFixed(1) },
                  {
                    label: "Bracelet state",
                    value: currentReading.braceletStatus,
                  },
                  {
                    label: "Sunlight contribution",
                    value: getContributionDescription("sunlight", currentReading.estimatedSunIU),
                  },
                  {
                    label: "Food contribution",
                    value: getContributionDescription("food", currentReading.dietaryIU),
                  },
                  {
                    label: "Supplement contribution",
                    value: getContributionDescription("supplements", currentReading.supplementIU),
                  },
                ].map((item, index, arr) => (
                  <Box key={item.label}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                      alignItems="flex-start"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          textAlign: "right",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Stack>

                    {index < arr.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Profile factors
              </Typography>

              <Stack spacing={1.5}>
                {[
                  { label: "Skin tone", value: profile.skinTone },
                  { label: "Body coverage", value: profile.bodyCoverage },
                  {
                    label: "Weight / height",
                    value: `${profile.weight || 0} kg / ${profile.height || 0} cm`,
                  },
                  {
                    label: "Medical absorption concerns",
                    value: profile.medicalConditions ? "Yes" : "No",
                  },
                  {
                    label: "Blood vitamin D level",
                    value: profile.bloodLevel ?? "Not provided",
                  },
                ].map((item, index, arr) => (
                  <Box key={item.label}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                      alignItems="flex-start"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          textAlign: "right",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Stack>

                    {index < arr.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>
        </Box>
      </Box>
    </Box>
  );
}
