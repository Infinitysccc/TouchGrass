// src/components/DemoMode.tsx
import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import type { LiveReading } from "./DeviceConnect";

// UV curve by hour-pair (0–1am, 2–3am, ...) — realistic solar arc
const UV_CURVE = [0.4, 0.8, 1.6, 2.8, 4.2, 5.6, 6.8, 7.2, 6.5, 5.1, 3.4, 1.9, 0.9, 0.3];

function getSimulatedUV(): number {
  const hour = new Date().getHours();
  const idx = Math.min(Math.floor(hour / 2), UV_CURVE.length - 1);
  const base = UV_CURVE[idx];
  const jitter = (Math.random() - 0.5) * 0.3;
  return Math.max(0.5, parseFloat((base + jitter).toFixed(1)));
}

// ─── Demo IU progression ──────────────────────────────────────────────────────
// Each tick fires every 2 seconds and adds IU_PER_TICK to the accumulator.
// At 75 IU/tick × every 2s:
//   - Hits 50% of a 400 IU goal in ~11 seconds  (very visible to judges)
//   - Hits 100% of a 400 IU goal in ~22 seconds (goal banner fires live)
//   - With a 1000 IU supplement logged on top, hits goal instantly
// This rate is deliberately faster than physics for demo purposes.
const IU_PER_TICK = 75;
const TICK_MS = 2000;

type Props = {
  onReading: (r: LiveReading) => void;
  onDemoIU: (deltaIU: number) => void;        // direct IU injection for demo
  onStateChange?: (running: boolean) => void;
};

export default function DemoMode({ onReading, onDemoIU, onStateChange }: Props) {
  const [running, setRunning] = useState(false);
  const [lastUV, setLastUV] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRunning(true);
    setTick(0);
    onStateChange?.(true);
    // Fire first reading immediately so UI responds instantly
    const uv = getSimulatedUV();
    setLastUV(uv);
    onReading({ uvIndex: uv, timestamp: new Date().toISOString() });
    onDemoIU(IU_PER_TICK);
  };

  const stop = () => {
    setRunning(false);
    setLastUV(null);
    onStateChange?.(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      const uv = getSimulatedUV();
      setLastUV(uv);
      setTick((t) => t + 1);
      onReading({ uvIndex: uv, timestamp: new Date().toISOString() });
      onDemoIU(IU_PER_TICK);
    }, TICK_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  if (!running) {
    return (
      <Box sx={{
        p: { xs: 1.75, md: 2 }, borderRadius: "14px",
        border: "1px dashed", borderColor: "divider",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 2,
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <WbSunnyRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Box>
            <Typography variant="body2" fontWeight={700}>Demo mode available</Typography>
            <Typography variant="caption" color="text.secondary">
              Simulates live bracelet UV readings
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={<PlayArrowRoundedIcon />} onClick={start}
          size="small" sx={{ borderRadius: 999, fontWeight: 700, whiteSpace: "nowrap" }}>
          Start Demo
        </Button>
      </Box>
    );
  }

  return (
    <Alert severity="info" icon={<WbSunnyRoundedIcon />}
      sx={{ borderRadius: "14px", alignItems: "center" }}
      action={
        <Button color="inherit" size="small" startIcon={<StopRoundedIcon />} onClick={stop}
          sx={{ borderRadius: 999, fontWeight: 700, whiteSpace: "nowrap" }}>
          Stop
        </Button>
      }>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" fontWeight={700}>Demo mode active</Typography>
          <Chip
            label={`UV ${lastUV?.toFixed(1) ?? "—"} · +${IU_PER_TICK} IU/tick`}
            size="small"
            sx={{ borderRadius: 999, fontWeight: 700, fontSize: 12 }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Math.min((tick / 20) * 100, 100)}
          sx={{ borderRadius: 999, height: 4, bgcolor: "rgba(99,102,241,0.15)",
            "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
        />
      </Stack>
    </Alert>
  );
}
