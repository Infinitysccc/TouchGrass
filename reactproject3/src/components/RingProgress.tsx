// src/components/RingProgress.tsx
import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";

export default function RingProgress({
  value, size = 120, thickness = 10,
  color = "#22c55e", trackColor, label, sublabel, tooltip,
}: {
  value: number; size?: number; thickness?: number;
  color?: string; trackColor?: string;
  label: string; sublabel?: string;
  tooltip?: string;
}) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (clamped / 100) * circ;
  const track = trackColor ?? "rgba(148,163,184,0.2)";

  const ring = (
    <Box sx={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
      cursor: tooltip ? "help" : "default",
    }}>
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thickness} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
            strokeWidth={thickness} strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: "stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: size < 100 ? 15 : 20, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {Math.round(clamped)}%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" fontWeight={700}>{label}</Typography>
        {sublabel && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{sublabel}</Typography>
        )}
      </Box>
    </Box>
  );

  if (!tooltip) return ring;

  return (
    <Tooltip title={tooltip} arrow placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            borderRadius: "10px", fontSize: 12, fontWeight: 600,
            maxWidth: 200, textAlign: "center",
            bgcolor: "rgba(15,23,42,0.92)", px: 1.5, py: 1,
          },
        },
      }}>
      {ring}
    </Tooltip>
  );
}
