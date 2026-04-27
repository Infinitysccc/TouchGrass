// src/pages/Dashboard.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, Box, Button, CardContent, Chip, Divider,
  InputAdornment, Skeleton, Stack, Tab, Tabs, TextField, Typography,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicationIcon from "@mui/icons-material/Medication";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, AreaChart, Area,
} from "recharts";
import { useNavigate } from "react-router-dom";

import SurfaceCard from "../components/SurfaceCard";
import PageHero from "../components/PageHero";
import RingProgress from "../components/RingProgress";
import DeviceConnect, { type LiveReading } from "../components/DeviceConnect";
import DemoMode from "../components/DemoMode";
import LiveBraceletWidget from "../components/LiveBraceletWidget";
import { API } from "../config/api";
import { type UserData, EMPTY_PROFILE } from "../types/user";
import { latestDeviceReading, weeklyDeviceReadings, type DeviceReading } from "../data/mockDeviceData";

type Result = { recommendedIU: number; category: string };
type LogEntry = { label: string; iu: number; time: string };
type DailyLogPayload = {
  suppIU: number; foodIU: number; sunIU: number;
  uvIndex: number; braceletStatus: string;
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtDay(ts: string) { return new Date(ts).toLocaleDateString("en-US", { weekday: "short" }); }
function fmtMonth(ts: string) { return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function fmtTime(ts: string) { return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }

function getSupportLabel(s: number) {
  if (s < 400) return "Needs attention";
  if (s < 800) return "Building momentum";
  if (s < 1200) return "On track";
  return "Strong day";
}
function getLevel(v: number) {
  if (v <= 0) return "None";
  if (v < 200) return "Light";
  if (v < 450) return "Moderate";
  return "Strong";
}

// ─── Research-based vitamin D synthesis model ─────────────────────────────────
//
// Based on: Holick MF (2007) "Vitamin D Deficiency", NEJM; Webb et al. (1988)
// "Influence of season and latitude on cutaneous vitamin D synthesis"
//
// Peak synthesis rate for a fair-skinned adult exposing full arms+legs at UV
// index 6 (solar noon, mid-latitude summer) is ~600–1000 IU per hour.
// We use 700 IU/hr as our calibrated baseline (midpoint of literature range).
//
// Skin tone multiplier (Fitzpatrick scale approximation):
//   Light  (Types I–II)   → 1.00  (least melanin, highest synthesis rate)
//   Medium (Types III–IV) → 0.72  (Clemens et al. 1982, ~28% reduction)
//   Dark   (Types V–VI)   → 0.42  (Matsuoka et al. 1991, ~58% reduction)
//
// Body surface area multiplier (fraction of total BSA exposed):
//   Full body             → 1.00  (maximal exposure baseline)
//   Arms & Legs           → 0.36  (forearms+lower legs ≈ 36% BSA, ASHP 2009)
//   Face only             → 0.09  (face ≈ 9% BSA)
//
// UV index scaling: synthesis scales approximately linearly with UVI up to ~8,
// then plateaus due to UV-induced degradation of pre-vitamin D3 (previtamin D3
// photoisomerisation equilibrium). We apply a soft cap using min(uvi/8, 1).
//
// Exposure time: readings are per-second from the bracelet.
// Each call contributes seconds_since_last_tick / 3600 hours of exposure.
// The accumulator (accumulatedSunIU) grows across the session.
//
// Formula:
//   ΔIU = 700 × skinMult × bsaMult × min(uvIndex / 8, 1) × Δt_hours
//
function estimateSunIUDelta(
  uvIndex: number,
  skinTone: string,
  bodyCoverage: string,
  deltaSeconds: number,
): number {
  if (uvIndex <= 0 || deltaSeconds <= 0) return 0;

  const skinMult: Record<string, number> = { Light: 1.00, Medium: 0.72, Dark: 0.42 };
  const bsaMult: Record<string, number>  = { "Full": 1.00, "Arms & Legs": 0.36, "Face only": 0.09 };

  const s = skinMult[skinTone]    ?? 0.72;
  const b = bsaMult[bodyCoverage] ?? 0.36;
  const uvScale = Math.min(uvIndex / 8, 1);
  const deltaHours = deltaSeconds / 3600;

  return Math.round(700 * s * b * uvScale * deltaHours);
}

// Snapshot estimate (for display / stat cards) — assumes 1-hour continuous exposure
function estimateSunIUSnapshot(uvIndex: number, skinTone: string, bodyCoverage: string): number {
  return estimateSunIUDelta(uvIndex, skinTone, bodyCoverage, 3600);
}

function deriveCategory(total: number, rec: number): string {
  if (rec <= 0) return "Awaiting data";
  const pct = (total / rec) * 100;
  if (pct >= 100) return "Sufficient";
  if (pct >= 70) return "Insufficient";
  return "Deficient";
}
function statusColor(cat: string): "success" | "warning" | "error" | "default" {
  if (cat === "Sufficient") return "success";
  if (cat === "Insufficient") return "warning";
  if (cat === "Deficient") return "error";
  return "default";
}

// ─── Deterministic monthly chart data ────────────────────────────────────────
// Uses a seeded pseudo-random based on day index so the chart is stable across
// page refreshes — important for a consistent live demo presentation.
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}
function buildMonthly() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const base = weeklyDeviceReadings[i % weeklyDeviceReadings.length];
    const rand = 0.75 + seededRand(i) * 0.5;
    return {
      day: fmtMonth(d.toISOString()),
      sun: Math.round(base.estimatedSunIU * rand),
      score: Math.round((base.estimatedSunIU + base.dietaryIU + base.supplementIU) * rand),
    };
  });
}

const monthlyData = buildMonthly();
const tooltipStyle = { borderRadius: 12, fontSize: 12, boxShadow: "0 4px 16px rgba(15,23,42,0.08)" };
const QUICK_DOSES = [400, 1000, 2000];

// ─── Empty states ─────────────────────────────────────────────────────────────

function ProfileEmptyState() {
  const navigate = useNavigate();
  return (
    <SurfaceCard sx={{
      mb: 3,
      background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,197,94,0.10) 100%)",
      border: "1px solid rgba(99,102,241,0.18)",
    }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: "14px", flexShrink: 0,
            display: "grid", placeItems: "center",
            bgcolor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)",
          }}>
            <PersonRoundedIcon sx={{ color: "primary.dark", fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={800} sx={{ mb: 0.5 }}>
              Complete your profile to unlock your targets
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Your rings are showing demo values. Fill in your profile so the dashboard
              can calculate your actual vitamin D target.
            </Typography>
          </Box>
          <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate("/profile")} size="small"
            sx={{ borderRadius: 999, fontWeight: 800, whiteSpace: "nowrap", flexShrink: 0 }}>
            Set up profile
          </Button>
        </Stack>
      </CardContent>
    </SurfaceCard>
  );
}

function GoalReachedBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Box sx={{
      mb: 3, p: { xs: 2, md: 3 }, borderRadius: "20px",
      background: "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(250,204,21,0.18) 100%)",
      border: "1px solid rgba(34,197,94,0.28)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 2,
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{
          width: 44, height: 44, borderRadius: "13px", flexShrink: 0,
          display: "grid", placeItems: "center", bgcolor: "rgba(34,197,94,0.2)",
        }}>
          <EmojiEventsRoundedIcon sx={{ color: "#16a34a", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={900}>🎉 Daily goal reached!</Typography>
          <Typography variant="body2" color="text.secondary">
            You've hit your vitamin D target for today. Great work.
          </Typography>
        </Box>
      </Stack>
      <Button size="small" startIcon={<CloseRoundedIcon />} onClick={onDismiss}
        sx={{ borderRadius: 999, fontWeight: 700, color: "text.secondary" }}>
        Dismiss
      </Button>
    </Box>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricTile({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
}) {
  return (
    <Box sx={{ p: { xs: 2, md: 2.5 }, borderRadius: "14px", border: "1px solid", borderColor: "divider", bgcolor: "background.default" }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "9px", display: "grid", placeItems: "center", bgcolor: "rgba(34,197,94,0.10)", flexShrink: 0 }}>
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: 12, lineHeight: 1.3 }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontSize: 11 }}>{sub}</Typography>}
    </Box>
  );
}

function StatCard({ title, value, subtitle, icon, tint }: {
  title: string; value: string; subtitle: string; icon: React.ReactNode; tint: string;
}) {
  return (
    <SurfaceCard>
      <CardContent sx={{ p: { xs: 1.75, md: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" color="text.secondary"
              sx={{ mb: 0.5, fontWeight: 600, fontSize: { xs: 11, md: 12 } }}>{title}</Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 800, letterSpacing: "-0.02em", mb: 0.25, lineHeight: 1.1 }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary"
              sx={{ lineHeight: 1.3, display: "block", fontSize: { xs: 10, md: 11 } }}>{subtitle}</Typography>
          </Box>
          <Box sx={{ flexShrink: 0, width: 38, height: 38, borderRadius: "11px", display: "grid", placeItems: "center", bgcolor: tint }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </SurfaceCard>
  );
}

function DashboardSkeleton() {
  return (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="rounded" height={52} sx={{ mb: 2, borderRadius: "14px" }} />
      <Skeleton variant="rounded" height={52} sx={{ mb: 3, borderRadius: "14px" }} />
      <Skeleton variant="rounded" height={120} sx={{ mb: 3, borderRadius: "20px" }} />
      <Skeleton variant="rounded" height={180} sx={{ mb: 3, borderRadius: "20px" }} />
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1.5, mb: 3 }}>
        {[...Array(4)].map((_, i) => <Skeleton key={i} variant="rounded" height={90} sx={{ borderRadius: "16px" }} />)}
      </Box>
      <Skeleton variant="rounded" height={280} sx={{ borderRadius: "20px" }} />
    </Box>
  );
}

// ─── Intake Logger ────────────────────────────────────────────────────────────

function IntakeLogger({ initialSuppIU, initialFoodIU, onLog }: {
  initialSuppIU: number; initialFoodIU: number; onLog: (s: number, f: number) => void;
}) {
  const [suppInput, setSuppInput] = useState("");
  const [foodInput, setFoodInput] = useState("");
  const [logged, setLogged] = useState(false);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [totalSuppLogged, setTotalSuppLogged] = useState(initialSuppIU);
  const [totalFoodLogged, setTotalFoodLogged] = useState(initialFoodIU);

  useEffect(() => { setTotalSuppLogged(initialSuppIU); }, [initialSuppIU]);
  useEffect(() => { setTotalFoodLogged(initialFoodIU); }, [initialFoodIU]);

  const handleLog = () => {
    const supp = Math.max(0, Number(suppInput) || 0);
    const food = Math.max(0, Number(foodInput) || 0);
    if (supp === 0 && food === 0) return;
    const now = new Date().toISOString();
    const newEntries: LogEntry[] = [];
    if (supp > 0) newEntries.push({ label: "Supplement", iu: supp, time: now });
    if (food > 0) newEntries.push({ label: "Food", iu: food, time: now });
    setEntries((prev) => [...prev, ...newEntries]);
    setTotalSuppLogged((p) => p + supp);
    setTotalFoodLogged((p) => p + food);
    onLog(supp, food);
    setLogged(true);
    setSuppInput(""); setFoodInput("");
    setTimeout(() => setLogged(false), 2000);
  };

  const totalLogged = totalSuppLogged + totalFoodLogged;

  return (
    <SurfaceCard sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.5 }}>
          <MedicationIcon sx={{ color: "#6366f1", fontSize: 20 }} />
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>
            Log today's intake
          </Typography>
          {totalLogged > 0 && (
            <Chip label={`${totalLogged} IU`} size="small"
              sx={{ borderRadius: 999, fontWeight: 700, bgcolor: "rgba(99,102,241,0.10)", color: "#4f46e5", fontSize: 11 }} />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: 12, md: 14 } }}>
          Enter supplements and food to update your rings. Saves automatically across sessions.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 1.5, sm: 2 }, mb: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75, fontSize: 13 }}>Supplement (IU)</Typography>
            <TextField placeholder="e.g. 1000" type="number" value={suppInput}
              onChange={(e) => setSuppInput(e.target.value)}
              inputProps={{ min: 0, step: 100 }}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">IU</Typography></InputAdornment> }}
              size="small" />
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
              {QUICK_DOSES.map((d) => (
                <Chip key={d} label={`+${d}`} size="small" clickable
                  onClick={() => setSuppInput(String((Number(suppInput) || 0) + d))}
                  sx={{ borderRadius: 999, fontSize: 11, fontWeight: 700, height: 24 }} />
              ))}
              <Chip label="+5000" size="small" clickable
                onClick={() => setSuppInput(String((Number(suppInput) || 0) + 5000))}
                sx={{ borderRadius: 999, fontSize: 11, fontWeight: 700, height: 24, display: { xs: "none", sm: "flex" } }} />
            </Stack>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75, fontSize: 13 }}>Food / dietary (IU)</Typography>
            <TextField placeholder="e.g. 200" type="number" value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              inputProps={{ min: 0, step: 50 }}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">IU</Typography></InputAdornment> }}
              size="small" />
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
              {[{ label: "Salmon", iu: 570 }, { label: "Egg", iu: 44 }, { label: "Milk", iu: 120 }].map(({ label, iu }) => (
                <Chip key={label} label={`${label} +${iu}`} size="small" clickable
                  onClick={() => setFoodInput(String((Number(foodInput) || 0) + iu))}
                  sx={{ borderRadius: 999, fontSize: 11, fontWeight: 700, height: 24 }} />
              ))}
            </Stack>
          </Box>
        </Box>

        <Button variant="contained" size="small"
          startIcon={logged ? <CheckRoundedIcon /> : <AddRoundedIcon />}
          onClick={handleLog} disabled={!suppInput && !foodInput}
          color={logged ? "success" : "primary"}
          sx={{ borderRadius: 999, fontWeight: 800, minWidth: 140 }}>
          {logged ? "Logged!" : "Add to today"}
        </Button>

        {(entries.length > 0 || totalSuppLogged > 0 || totalFoodLogged > 0) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>Today's log</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CloudDoneRoundedIcon sx={{ fontSize: 13, color: "success.main" }} />
                <Typography variant="caption" color="success.main" fontWeight={600}>Saved</Typography>
              </Stack>
            </Stack>
            <Stack spacing={0} divider={<Divider />}>
              {totalSuppLogged > 0 && entries.length === 0 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <MedicationIcon sx={{ fontSize: 13, color: "#6366f1" }} />
                    <Typography variant="caption" color="text.secondary">Supplement (saved)</Typography>
                  </Stack>
                  <Typography variant="caption" fontWeight={700}>{totalSuppLogged} IU</Typography>
                </Stack>
              )}
              {totalFoodLogged > 0 && entries.length === 0 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <RestaurantIcon sx={{ fontSize: 13, color: "#16a34a" }} />
                    <Typography variant="caption" color="text.secondary">Food (saved)</Typography>
                  </Stack>
                  <Typography variant="caption" fontWeight={700}>{totalFoodLogged} IU</Typography>
                </Stack>
              )}
              {entries.map((e, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    {e.label === "Supplement"
                      ? <MedicationIcon sx={{ fontSize: 13, color: "#6366f1" }} />
                      : <RestaurantIcon sx={{ fontSize: 13, color: "#16a34a" }} />}
                    <Typography variant="caption" color="text.secondary">{e.label}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="caption" fontWeight={700}>{e.iu} IU</Typography>
                    <Typography variant="caption" color="text.secondary">{fmtTime(e.time)}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 0.75 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" fontWeight={700}>Total</Typography>
              <Typography variant="caption" fontWeight={800} sx={{ color: "primary.dark" }}>{totalLogged} IU</Typography>
            </Stack>
          </Box>
        )}
      </CardContent>
    </SurfaceCard>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [profile, setProfile] = useState<UserData>(EMPTY_PROFILE);
  const [recommendedIU, setRecommendedIU] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // FIX #5: friendly error message instead of raw server string
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isLiveData, setIsLiveData] = useState(false); // true = history came from DB
  const [chartTab, setChartTab] = useState(0);
  const [liveUV, setLiveUV] = useState<number | null>(null);
  const [loggedSuppIU, setLoggedSuppIU] = useState(0);
  const [loggedFoodIU, setLoggedFoodIU] = useState(0);
  const [profileComplete, setProfileComplete] = useState(false);
  const [goalBannerDismissed, setGoalBannerDismissed] = useState(false);
  const [goalPreviouslyReached, setGoalPreviouslyReached] = useState(false);
  const [weeklyHistory, setWeeklyHistory] = useState<{day:string;sun:number;score:number}[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<{day:string;sun:number;score:number}[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX: Accumulate sunIU during live/demo sessions instead of using snapshot
  const [accumulatedSunIU, setAccumulatedSunIU] = useState(0);
  const lastReadingTimeRef = useRef<number | null>(null);
  // Refs mirror state so callbacks always have fresh values without stale closures
  const accumulatedSunIURef = useRef<number>(0);
  const loggedSuppIURef = useRef<number>(0);
  const loggedFoodIURef = useRef<number>(0);

  const user = useMemo(() => JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  ), []);
  const userId = user?.id;

  // Keep refs in sync with state so closures always read fresh values
  useEffect(() => { accumulatedSunIURef.current = accumulatedSunIU; }, [accumulatedSunIU]);
  useEffect(() => { loggedSuppIURef.current = loggedSuppIU; }, [loggedSuppIU]);
  useEffect(() => { loggedFoodIURef.current = loggedFoodIU; }, [loggedFoodIU]);

  const currentReading: DeviceReading = useMemo(() => {
    if (liveUV !== null) {
      return {
        ...latestDeviceReading,
        uvIndex: liveUV,
        estimatedSunIU: accumulatedSunIU,
        timestamp: new Date().toISOString(),
      };
    }
    return latestDeviceReading;
  }, [liveUV, accumulatedSunIU]);

  const saveDailyLog = useCallback((suppIU: number, foodIU: number, sunIU: number, uvIndex: number, braceletStatus: string) => {
    if (!userId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`${API.dailyLog}?userId=${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suppIU, foodIU, sunIU, uvIndex, braceletStatus } as DailyLogPayload),
        });
      } catch (e) { console.warn("Failed to save daily log:", e); }
    }, 800);
  }, [userId]);

  // Refetches chart history and today's log from DB without a full page reload.
  // Called after every demo tick save and every supplement log.
  const refetchCharts = useCallback(async () => {
    if (!userId) return;
    try {
      const [h7, h30, logRes] = await Promise.allSettled([
        fetch(`${API.dailyLog}/history?userId=${userId}&days=7`),
        fetch(`${API.dailyLog}/history?userId=${userId}&days=30`),
        fetch(`${API.dailyLog}?userId=${userId}&date=${todayStr()}`),
      ]);
      if (h7.status === "fulfilled" && h7.value.ok) {
        const rows = await h7.value.json();
        setWeeklyHistory(rows.map((r: any) => ({
          day: new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
          sun: r.sunIU ?? 0,
          score: (r.sunIU ?? 0) + (r.foodIU ?? 0) + (r.suppIU ?? 0),
        })));
      }
      if (h30.status === "fulfilled" && h30.value.ok) {
        const rows = await h30.value.json();
        setMonthlyHistory(rows.map((r: any) => ({
          day: new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          sun: r.sunIU ?? 0,
          score: (r.sunIU ?? 0) + (r.foodIU ?? 0) + (r.suppIU ?? 0),
        })));
      }
      if (logRes.status === "fulfilled" && logRes.value.ok) {
        const log: DailyLogPayload = await logRes.value.json();
        setLoggedSuppIU(log.suppIU ?? 0);
        setLoggedFoodIU(log.foodIU ?? 0);
        if (log.sunIU && log.sunIU > 0) setAccumulatedSunIU(log.sunIU);
      }
    } catch { /* silent — charts just keep showing last good data */ }
  }, [userId]);

  // handleReading: called on every real WiFi bracelet tick (every 3s)
  // Uses a fixed 3-second delta — matches the polling interval exactly
  const handleReading = useCallback((r: LiveReading) => {
    setLiveUV(r.uvIndex);
    setIsLive(true);
    lastReadingTimeRef.current = Date.now();
    const deltaIU = estimateSunIUDelta(r.uvIndex, profile.skinTone, profile.bodyCoverage, 3);
    setAccumulatedSunIU((prev) => {
      const newTotal = prev + deltaIU;
      accumulatedSunIURef.current = newTotal;
      saveDailyLog(loggedSuppIURef.current, loggedFoodIURef.current, newTotal, r.uvIndex, "Live");
      setTimeout(refetchCharts, 1000);
      return newTotal;
    });
  }, [profile.skinTone, profile.bodyCoverage, saveDailyLog, refetchCharts]);

  const handleIntakeLog = useCallback((suppIU: number, foodIU: number) => {
    const newSupp = loggedSuppIU + suppIU;
    const newFood = loggedFoodIU + foodIU;
    setLoggedSuppIU(newSupp);
    setLoggedFoodIU(newFood);
    saveDailyLog(newSupp, newFood, accumulatedSunIURef.current, liveUV ?? latestDeviceReading.uvIndex, currentReading.braceletStatus);
    // Refetch charts 1s after save so today's bar updates without a page refresh
    setTimeout(refetchCharts, 1000);
  }, [loggedSuppIU, loggedFoodIU, liveUV, profile, currentReading.braceletStatus, saveDailyLog, refetchCharts]);

  const sunIU = accumulatedSunIU > 0 ? accumulatedSunIU : currentReading.estimatedSunIU;
  const totalIU = sunIU + loggedFoodIU + loggedSuppIU;
  const supportLabel = getSupportLabel(totalIU);
  const liveCategory = useMemo(() => recommendedIU > 0 ? deriveCategory(totalIU, recommendedIU) : "Awaiting data", [totalIU, recommendedIU]);
  const intakePct = recommendedIU > 0 ? Math.min((totalIU / recommendedIU) * 100, 100) : 0;
  const sunlightPct = recommendedIU > 0 ? Math.min((sunIU / recommendedIU) * 100, 100) : Math.min((sunIU / 600) * 100, 100);
  const dietSuppPct = Math.min(((loggedFoodIU + loggedSuppIU) / 800) * 100, 100);
  const weeklyHealthScore = useMemo(() => {
    const scores = weeklyDeviceReadings.map((r) =>
      Math.min(((r.estimatedSunIU + r.dietaryIU + r.supplementIU) / Math.max(recommendedIU || 900, 1)) * 100, 100)
    );
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [recommendedIU]);

  // Goal reached detection
  const showGoalBanner = intakePct >= 100 && !goalBannerDismissed;
  useEffect(() => {
    if (intakePct >= 100 && !goalPreviouslyReached) {
      setGoalPreviouslyReached(true);
      setGoalBannerDismissed(false);
    }
  }, [intakePct]);

  // FIX #1: Bracelet LED derived from accumulated IU vs daily goal, not UV index
  const liveBraceletStatus = useMemo(() => {
    if (!isLive && !isDemoRunning) return "Disconnected";
    if (intakePct >= 100) return "Green";   // Goal reached
    if (intakePct >= 50)  return "Yellow";  // Halfway there
    return "Red";                           // Needs more exposure
  }, [isLive, isDemoRunning, intakePct]);

  const showLiveWidget = isLive || isDemoRunning;

  useEffect(() => {
    const load = async () => {
      try {
        if (!userId) { setLoading(false); return; }
        const pr = await fetch(`${API.profile}?userId=${userId}`);
        if (!pr.ok) throw new Error("profile_fetch_failed");
        const p = await pr.json();
        setProfileComplete(p.age > 0 || p.weight > 0);
        const norm: UserData = {
          age: p.age ?? 0, skinTone: p.skinTone ?? "Medium",
          bodyCoverage: p.bodyCoverage ?? "Full", timeOutdoors: 30,
          dietaryIU: 0, supplementIU: 0,
          weight: p.weight ?? 0, height: p.height ?? 0,
          medicalConditions: p.medicalConditions ?? false, bloodLevel: p.bloodLevel,
        };
        setProfile(norm);
        const logRes = await fetch(`${API.dailyLog}?userId=${userId}&date=${todayStr()}`);
        if (logRes.ok) {
          const log: DailyLogPayload = await logRes.json();
          setLoggedSuppIU(log.suppIU ?? 0);
          setLoggedFoodIU(log.foodIU ?? 0);
          // Restore sun IU directly into accumulatedSunIU so the rings
          // show saved data immediately on load, before any demo/BLE session
          if (log.sunIU && log.sunIU > 0) setAccumulatedSunIU(log.sunIU);
          if (log.uvIndex && log.uvIndex > 0) setLiveUV(log.uvIndex);
        }
        // Fetch 7-day and 30-day history for charts
        const [h7, h30] = await Promise.allSettled([
          fetch(`${API.dailyLog}/history?userId=${userId}&days=7`),
          fetch(`${API.dailyLog}/history?userId=${userId}&days=30`),
        ]);
        if (h7.status === "fulfilled" && h7.value.ok) {
          const rows = await h7.value.json();
          setWeeklyHistory(rows.map((r: any) => ({
            day: new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
            sun: r.sunIU ?? 0,
            score: (r.sunIU ?? 0) + (r.foodIU ?? 0) + (r.suppIU ?? 0),
          })));
        }
        if (h30.status === "fulfilled" && h30.value.ok) {
          const rows = await h30.value.json();
          setMonthlyHistory(rows.map((r: any) => ({
            day: new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            sun: r.sunIU ?? 0,
            score: (r.sunIU ?? 0) + (r.foodIU ?? 0) + (r.suppIU ?? 0),
          })));
        }

        const cr = await fetch(API.calculate, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...norm, dietaryIU: 0, supplementIU: 0 }),
        });
        if (!cr.ok) throw new Error("calculate_failed");
        setRecommendedIU((await cr.json()).recommendedIU);
        setIsLiveData(true);
      } catch (e: any) {
        // FIX #5: friendly error — dashboard still renders with mock/fallback data
        setLoadError("Could not reach the server — showing preview data.");
      } finally { setLoading(false); }
    };
    load();
  }, [userId]);

  const weeklyChart = weeklyHistory.length > 0
    ? weeklyHistory
    : weeklyDeviceReadings.map((r) => ({
        day: fmtDay(r.timestamp), sun: r.estimatedSunIU,
        score: r.estimatedSunIU + r.dietaryIU + r.supplementIU,
      }));
  const chartData = chartTab === 0 ? weeklyChart : (monthlyHistory.length > 0 ? monthlyHistory : monthlyData);

  const recommendation =
    sunIU < 100 ? "Your sunlight contribution is very low. Even 15–20 minutes outdoors would significantly boost your support."
    : intakePct < 50 ? "You're off to a slow start. More sun or a vitamin D meal could make a big difference."
    : intakePct < 80 ? "Good momentum — a supplement or 10 more minutes outdoors will help."
    : intakePct < 100 ? "You're close to your goal. A small top-up will finish the day strongly."
    : "Excellent — you've reached your daily target. Keep this routine going.";

  const nextAction =
    sunIU < 100 ? "Step outside for 15–20 min of direct sun."
    : intakePct < 100 ? "Log a supplement or vitamin D-rich meal."
    : "Maintain this routine and check your weekly trend.";

  if (loading) return <DashboardSkeleton />;

  return (
    <Box sx={{ width: "100%" }}>
      {/* FIX #5: Friendly error with preview badge, dashboard still renders */}
      {loadError && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: "14px" }}>
          {loadError}
        </Alert>
      )}

      {/* ── Connection controls ────────────────────────────────────────────── */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        {/* FIX #4: DeviceConnect is visually muted while demo is running */}
        <Box sx={{ opacity: isDemoRunning ? 0.4 : 1, pointerEvents: isDemoRunning ? "none" : "auto",
          transition: "opacity 0.2s" }}>
          <DeviceConnect onReading={handleReading} />
        </Box>
        <DemoMode
          onReading={handleReading}
          onDemoIU={(deltaIU) => {
            setAccumulatedSunIU((prev) => {
              const newTotal = prev + deltaIU;
              accumulatedSunIURef.current = newTotal;
              saveDailyLog(loggedSuppIURef.current, loggedFoodIURef.current, newTotal, liveUV ?? 0, "Demo");
              // Refetch charts 1s after save so today's bar updates live
              setTimeout(refetchCharts, 1000);
              return newTotal;
            });
          }}
          onStateChange={(running) => {
            setIsDemoRunning(running);
            if (!running) {
              setIsLive(false);
              lastReadingTimeRef.current = null;
            } else {
              // Do NOT reset accumulatedSunIU — resume from whatever was saved in DB
              lastReadingTimeRef.current = null;
            }
          }}
        />
      </Stack>

      {/* ── LIVE BRACELET WIDGET — only shows when connected or demo running ── */}
      {showLiveWidget && (
        <LiveBraceletWidget
          uvIndex={currentReading.uvIndex}
          sunIU={sunIU}
          braceletStatus={liveBraceletStatus}
          isDemo={isDemoRunning && !isLive}
        />
      )}

      {/* ── Profile empty state ───────────────────────────────────────────── */}
      {!profileComplete && <ProfileEmptyState />}

      {/* ── Goal reached banner ───────────────────────────────────────────── */}
      {showGoalBanner && <GoalReachedBanner onDismiss={() => setGoalBannerDismissed(true)} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        overline="TouchGrass dashboard"
        title={recommendedIU > 0 ? `${Math.round(intakePct)}% of today's goal` : "Today's snapshot"}
        subtitle={
          isLive ? `Live data · ${totalIU} IU total · ${supportLabel.toLowerCase()}.`
          : recommendedIU > 0 ? `${totalIU} IU total · ${supportLabel}.`
          : "Set up your profile to unlock personalised targets."
        }
        right={
          <Stack direction="row" spacing={1} alignItems="center">
            {/* FIX #6: Live data / Preview badge */}
            <Chip
              icon={<StorageRoundedIcon sx={{ fontSize: "14px !important" }} />}
              label={isLiveData ? "Live data" : "Preview"}
              size="small"
              color={isLiveData ? "success" : "default"}
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 11, borderRadius: 999 }}
            />
            <Chip label={liveCategory} color={statusColor(liveCategory)}
              sx={{ fontWeight: 800, fontSize: { xs: 12, md: 13 }, px: 1, py: 2.5,
                borderRadius: 999, height: "auto", "& .MuiChip-label": { py: 0.5 } }} />
          </Stack>
        }
      />

      {/* ── Rings ─────────────────────────────────────────────────────────── */}
      <SurfaceCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{ mb: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>
              Today's progress
            </Typography>
            <Typography variant="caption" color="text.secondary"
              sx={{ display: { xs: "none", sm: "block" } }}>
              Hover a ring for details
            </Typography>
          </Stack>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: { xs: 2, sm: 3, md: 4 },
            justifyItems: "center",
            "@media (min-width:600px)": { gridTemplateColumns: "repeat(4,1fr)" },
          }}>
            <RingProgress value={intakePct} size={110} color="#22c55e"
              label="Daily goal"
              sublabel={recommendedIU > 0 ? `${totalIU}/${recommendedIU} IU` : "No target"}
              tooltip="Total IU from all sources vs your personalised daily target." />
            <RingProgress value={sunlightPct} size={110} color="#eab308"
              label="Sunlight IU" sublabel={`${sunIU} IU from sun`}
              tooltip="Estimated vitamin D from UV exposure, based on your skin tone and body surface area exposed." />
            <RingProgress value={dietSuppPct} size={110} color="#6366f1"
              label="Diet + Supps" sublabel={`${loggedFoodIU + loggedSuppIU} IU`}
              tooltip="Vitamin D logged from food and supplements today." />
            <RingProgress value={weeklyHealthScore} size={110} color="#f97316"
              label="Weekly score" sublabel="7-day avg"
              tooltip="Average daily goal completion over the past 7 days." />
          </Box>
        </CardContent>
      </SurfaceCard>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" }, gap: { xs: 1.5, md: 2 }, mb: 3 }}>
        <StatCard title="Recommended" value={recommendedIU > 0 ? `${recommendedIU} IU` : "—"}
          subtitle="From your profile"
          icon={<MonitorHeartIcon sx={{ color: "#16a34a", fontSize: 18 }} />} tint="rgba(34,197,94,0.10)" />
        <StatCard title="Total today" value={`${totalIU} IU`} subtitle={supportLabel}
          icon={<TrendingUpIcon sx={{ color: "#16a34a", fontSize: 18 }} />} tint="rgba(16,185,129,0.10)" />
        <StatCard title="UV index" value={currentReading.uvIndex.toFixed(1)}
          subtitle={isLive ? "Live" : isDemoRunning ? "Demo" : "Last session"}
          icon={<WbSunnyIcon sx={{ color: "#eab308", fontSize: 18 }} />} tint="rgba(250,204,21,0.14)" />
        <StatCard title="Weekly score" value={`${weeklyHealthScore}%`} subtitle="7-day avg"
          icon={<FavoriteBorderRoundedIcon sx={{ color: "#f97316", fontSize: 18 }} />} tint="rgba(249,115,22,0.10)" />
      </Box>

      {/* ── Two-column content ──────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1.6fr) 320px" }, gap: 3 }}>

        {/* LEFT */}
        <Box>
          <IntakeLogger initialSuppIU={loggedSuppIU} initialFoodIU={loggedFoodIU} onLog={handleIntakeLog} />

          {/* Sunlight chart */}
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }} spacing={1} sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>Sunlight history</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, md: 14 } }}>
                    Estimated vitamin D from sunlight.
                  </Typography>
                </Box>
                <Tabs value={chartTab} onChange={(_, v) => setChartTab(v)} sx={{
                  minHeight: 32,
                  "& .MuiTab-root": { minHeight: 32, py: 0.5, px: 1.5, fontSize: 12, fontWeight: 700 },
                  "& .MuiTabs-indicator": { bgcolor: "primary.main" },
                }}>
                  <Tab label="7 days" /><Tab label="30 days" />
                </Tabs>
              </Stack>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }} interval={chartTab === 1 ? 5 : 0} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} unit=" IU" width={48} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} IU`, "Sunlight"]} />
                  <Area type="monotone" dataKey="sun" stroke="#eab308" strokeWidth={2}
                    fill="url(#sg)" dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </SurfaceCard>

          {/* Support trend */}
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>Total support trend</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, md: 14 } }}>Sunlight + food + supplements.</Typography>
                </Box>
                <Chip label={chartTab === 0 ? "7d" : "30d"} size="small"
                  sx={{ fontWeight: 700, bgcolor: "rgba(34,197,94,0.08)", color: "primary.dark", fontSize: 11 }} />
              </Stack>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }} interval={chartTab === 1 ? 5 : 0} />
                  <YAxis hide />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} IU`, "Total"]} />
                  <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </SurfaceCard>

          {/* Source breakdown */}
          <SurfaceCard>
            <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>Today's source breakdown</Typography>
                <Chip label="Breakdown" size="small" icon={<BoltRoundedIcon />}
                  sx={{ fontWeight: 700, bgcolor: "rgba(34,197,94,0.08)", color: "primary.dark", fontSize: 11 }} />
              </Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: { xs: 1, md: 2 } }}>
                <MetricTile icon={<WbSunnyIcon sx={{ color: "#eab308", fontSize: 16 }} />}
                  label="Sunlight" value={getLevel(sunIU)} sub={`${sunIU} IU`} />
                <MetricTile icon={<RestaurantIcon sx={{ color: "#16a34a", fontSize: 16 }} />}
                  label="Food" value={getLevel(loggedFoodIU)} sub={`${loggedFoodIU} IU`} />
                <MetricTile icon={<MedicationIcon sx={{ color: "#6366f1", fontSize: 16 }} />}
                  label="Supps" value={getLevel(loggedSuppIU)} sub={`${loggedSuppIU} IU`} />
              </Box>
            </CardContent>
          </SurfaceCard>
        </Box>

        {/* RIGHT sidebar */}
        <Box>
          <SurfaceCard sx={{
            mb: 3,
            background: "linear-gradient(180deg, rgba(255,250,230,0.9) 0%, transparent 100%)",
            border: "1px solid rgba(234,179,8,0.22)",
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <TipsAndUpdatesIcon sx={{ color: "#eab308", fontSize: 20 }} />
                <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>Smart insight</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>{recommendation}</Typography>
              <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "background.paper", border: "1px solid rgba(234,179,8,0.2)" }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                  <ArrowOutwardIcon fontSize="small" sx={{ color: "#eab308" }} />
                  <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>Next best action</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: 13 }}>{nextAction}</Typography>
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <SensorsRoundedIcon sx={{ color: "primary.dark", fontSize: 18 }} />
                <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>Device details</Typography>
              </Stack>
              <Stack spacing={0} divider={<Divider />}>
                {[
                  { label: "Last sync", value: fmtTime(currentReading.timestamp) },
                  { label: "UV index", value: currentReading.uvIndex.toFixed(1) },
                  { label: "Bracelet state", value: liveBraceletStatus },
                  { label: "Sun IU (session)", value: `${sunIU} IU` },
                  { label: "Food IU", value: `${loggedFoodIU} IU` },
                  { label: "Supp IU", value: `${loggedSuppIU} IU` },
                ].map((item) => (
                  <Stack key={item.label} direction="row" justifyContent="space-between"
                    alignItems="center" spacing={2} sx={{ py: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{item.label}</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <MonitorHeartIcon sx={{ color: "primary.dark", fontSize: 18 }} />
                <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 } }}>Profile factors</Typography>
              </Stack>
              <Stack spacing={0} divider={<Divider />}>
                {[
                  { label: "Skin tone", value: profile.skinTone },
                  { label: "Body coverage", value: profile.bodyCoverage },
                  { label: "Weight / height", value: `${profile.weight || "—"} kg / ${profile.height || "—"} cm` },
                  { label: "Medical concerns", value: profile.medicalConditions ? "Yes" : "No" },
                  { label: "Blood level", value: profile.bloodLevel != null ? `${profile.bloodLevel} ng/mL` : "Not provided" },
                ].map((item) => (
                  <Stack key={item.label} direction="row" justifyContent="space-between"
                    alignItems="center" spacing={2} sx={{ py: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{item.label}</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>
        </Box>
      </Box>
    </Box>
  );
}
