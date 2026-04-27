// src/components/LiveBraceletWidget.tsx
//
// Shown on the Dashboard ONLY when a device is connected (real BLE or demo).
// Features:
//   - Animating UV index number that flashes on every new reading
//   - Pulsing LED dot matching the bracelet's green/yellow/red state
//   - Estimated IU counter
//   - SVG sparkline of the last 20 readings with a live animated dot
//   - Subtle ambient glow behind the card that breathes with the LED colour

import React, { useEffect, useRef, useState } from "react";
import { Box, CardContent, Chip, Stack, Typography } from "@mui/material";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SurfaceCard from "./SurfaceCard";

type Props = {
  uvIndex: number;
  sunIU: number;
  braceletStatus: string;
  isDemo: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  Green: "#22c55e", Yellow: "#eab308", Red: "#ef4444", Disconnected: "#94a3b8",
};
const STATUS_LABELS: Record<string, string> = {
  Green: "Goal on track", Yellow: "Building momentum",
  Red: "Needs more sunlight", Disconnected: "Not connected",
};

function uvLabel(uv: number) {
  if (uv < 1) return "Minimal";
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}
function uvColor(uv: number) {
  if (uv < 3) return "#22c55e";
  if (uv < 6) return "#eab308";
  if (uv < 8) return "#f97316";
  return "#ef4444";
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const w = 160, h = 44;
  const min = Math.min(...data);
  const max = Math.max(...data, min + 0.1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 6) - 3;
    return [x, y] as [number, number];
  });
  const pathD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join(" ");
  const areaD = `M 0,${h} ${pts.map(([x, y]) => `L ${x},${y}`).join(" ")} L ${w},${h} Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={w} height={h} style={{ overflow: "visible", display: "block" }}>
      <path d={areaD} fill={color} fillOpacity={0.12} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={4} fill={color}>
        <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function LiveBraceletWidget({ uvIndex, sunIU, braceletStatus, isDemo }: Props) {
  const [history, setHistory] = useState<number[]>([uvIndex]);
  const [flash, setFlash] = useState(false);
  const prevUV = useRef(uvIndex);

  useEffect(() => {
    if (uvIndex !== prevUV.current) {
      setHistory((h) => [...h.slice(-19), uvIndex]);
      setFlash(true);
      prevUV.current = uvIndex;
      const t = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [uvIndex]);

  const sc = STATUS_COLORS[braceletStatus] ?? "#94a3b8";
  const sl = STATUS_LABELS[braceletStatus] ?? braceletStatus;
  const uc = uvColor(uvIndex);

  return (
    <SurfaceCard sx={{
      mb: 3,
      border: "1px solid",
      borderColor: `${sc}45`,
      background: `linear-gradient(135deg, ${sc}0d 0%, transparent 55%)`,
      overflow: "hidden",
      position: "relative",
      transition: "border-color 0.6s ease",
    }}>
      {/* Ambient glow blob */}
      <Box sx={{
        position: "absolute", top: -50, right: -50,
        width: 180, height: 180, borderRadius: "50%",
        bgcolor: sc, opacity: 0.06, pointerEvents: "none",
        animation: "ambientGlow 3s ease-in-out infinite",
        "@keyframes ambientGlow": {
          "0%,100%": { transform: "scale(1)", opacity: 0.06 },
          "50%": { transform: "scale(1.35)", opacity: 0.11 },
        },
      }} />

      <CardContent sx={{ p: { xs: 2, md: 3 }, position: "relative" }}>

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{
              width: 36, height: 36, borderRadius: "11px",
              display: "grid", placeItems: "center",
              bgcolor: `${sc}22`, border: `1px solid ${sc}44`,
            }}>
              <SensorsRoundedIcon sx={{
                color: sc, fontSize: 20,
                animation: "sensorPulse 2.2s ease-in-out infinite",
                "@keyframes sensorPulse": {
                  "0%,100%": { opacity: 1 }, "50%": { opacity: 0.45 },
                },
              }} />
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ lineHeight: 1.1, fontSize: { xs: 14, md: 16 } }}>
                Live bracelet feed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Updating every ~3 seconds
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.75} alignItems="center">
            <FiberManualRecordIcon sx={{
              fontSize: 9,
              color: isDemo ? "#6366f1" : "#22c55e",
              animation: "blink 1.6s ease-in-out infinite",
              "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.15 } },
            }} />
            <Chip label={isDemo ? "Demo" : "Live"} size="small" sx={{
              borderRadius: 999, fontWeight: 800, fontSize: 11,
              bgcolor: isDemo ? "rgba(99,102,241,0.12)" : "rgba(34,197,94,0.12)",
              color: isDemo ? "#4f46e5" : "#16a34a",
              border: `1px solid ${isDemo ? "rgba(99,102,241,0.28)" : "rgba(34,197,94,0.28)"}`,
            }} />
          </Stack>
        </Stack>

        {/* Main data grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "auto auto 1fr auto" },
          gap: { xs: 2.5, md: 3 },
          alignItems: "start",
        }}>

          {/* UV Index — big animated number */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700}
              sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>
              UV Index
            </Typography>
            <Typography sx={{
              fontSize: { xs: 52, md: 60 },
              fontWeight: 900, lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: uc,
              transition: "color 0.5s ease",
              animation: flash ? "numFlash 0.45s ease" : "none",
              "@keyframes numFlash": {
                "0%": { opacity: 0.25, transform: "scale(0.93)" },
                "55%": { opacity: 1, transform: "scale(1.05)" },
                "100%": { transform: "scale(1)" },
              },
            }}>
              {uvIndex.toFixed(1)}
            </Typography>
            <Chip label={uvLabel(uvIndex)} size="small" sx={{
              mt: 1, borderRadius: 999, fontWeight: 700, fontSize: 11,
              bgcolor: `${uc}18`, color: uc, border: `1px solid ${uc}30`,
            }} />
          </Box>

          {/* Estimated IU */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700}
              sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>
              Sun IU today
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography sx={{
                fontSize: { xs: 36, md: 42 }, fontWeight: 900,
                lineHeight: 1, letterSpacing: "-0.03em", color: "#eab308",
              }}>
                {sunIU}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 0.25 }}>IU</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              estimated from sunlight
            </Typography>
          </Box>

          {/* LED status — hidden on xs, shown inline on md */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}
              sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>
              Bracelet LED
            </Typography>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.5 }}>
              <Box sx={{
                width: 20, height: 20, borderRadius: "50%", bgcolor: sc, flexShrink: 0,
                boxShadow: `0 0 8px ${sc}bb, 0 0 20px ${sc}55`,
                animation: "ledGlow 2s ease-in-out infinite",
                "@keyframes ledGlow": {
                  "0%,100%": { boxShadow: `0 0 6px ${sc}bb, 0 0 14px ${sc}44` },
                  "50%": { boxShadow: `0 0 14px ${sc}, 0 0 28px ${sc}88` },
                },
              }} />
              <Typography fontWeight={800} sx={{ color: sc, fontSize: 18 }}>{braceletStatus}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">{sl}</Typography>
          </Box>

          {/* Sparkline */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}
              sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>
              UV trend
            </Typography>
            <Sparkline data={history} color={uc} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
              Last {history.length} readings
            </Typography>
          </Box>
        </Box>

        {/* Mobile: LED status row */}
        <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center"
            sx={{
              p: 1.5, borderRadius: "12px",
              bgcolor: `${sc}12`, border: `1px solid ${sc}28`,
            }}>
            <Box sx={{
              width: 14, height: 14, borderRadius: "50%", bgcolor: sc, flexShrink: 0,
              boxShadow: `0 0 6px ${sc}cc`,
              animation: "ledGlowMobile 2s ease-in-out infinite",
              "@keyframes ledGlowMobile": {
                "0%,100%": { boxShadow: `0 0 4px ${sc}bb` },
                "50%": { boxShadow: `0 0 10px ${sc}` },
              },
            }} />
            <Typography variant="body2" fontWeight={700} sx={{ color: sc }}>{braceletStatus}</Typography>
            <Typography variant="body2" color="text.secondary">·</Typography>
            <Typography variant="body2" color="text.secondary">{sl}</Typography>
          </Stack>
        </Box>

      </CardContent>
    </SurfaceCard>
  );
}
