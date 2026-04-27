// src/components/DeviceConnect.tsx
//
// Connects to the TouchGrass ESP32 UV sensor over WiFi.
//
// HOW IT WORKS:
//   The ESP32 runs as a WiFi access point (SSID: ESP32_UV_SENSOR, password: 12345678).
//   Your laptop must be connected to that WiFi network.
//   This component polls http://192.168.4.1/data every 3 seconds for UV readings.
//
// ENDPOINT RESPONSE (JSON):
//   { "uvIndex": 3.24, "raw": 1205, "voltage": 1.97 }

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Stack, Typography,
} from "@mui/material";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";

const ESP32_URL     = "http://192.168.4.1/data";
const POLL_INTERVAL = 3000; // ms between readings
const FETCH_TIMEOUT = 5000; // ms before a single request is considered failed
const MAX_FAILURES  = 4;    // consecutive failures before declaring disconnect

export type LiveReading = {
  uvIndex: number;
  timestamp: string;
};

type Props = { onReading: (r: LiveReading) => void };
type State = "disconnected" | "connecting" | "connected" | "error";

export default function DeviceConnect({ onReading }: Props) {
  const [state, setState]   = useState<State>("disconnected");
  const [error, setError]   = useState<string | null>(null);
  const [lastUV, setLastUV] = useState<number | null>(null);

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const failCountRef = useRef(0);
  const mountedRef   = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, []);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Fetches one reading. Returns UV value or null on any failure. Never throws.
  const fetchOnce = async (): Promise<number | null> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    try {
      const res = await fetch(ESP32_URL, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timer);
      if (!res.ok) return null;
      const data = await res.json();
      const uv = parseFloat(data.uvIndex);
      return isNaN(uv) ? null : uv;
    } catch {
      clearTimeout(timer);
      return null;
    }
  };

  const connect = useCallback(async () => {
    if (!mountedRef.current) return;
    setError(null);
    setState("connecting");
    failCountRef.current = 0;

    // Try up to 3 times on initial connect before giving up
    let uv: number | null = null;
    for (let i = 0; i < 3; i++) {
      uv = await fetchOnce();
      if (uv !== null) break;
      await new Promise(r => setTimeout(r, 600));
    }

    if (!mountedRef.current) return;

    if (uv === null) {
      setState("error");
      setError("Could not reach the bracelet. Make sure your laptop is connected to the ESP32_UV_SENSOR WiFi network (password: 12345678).");
      return;
    }

    setLastUV(uv);
    onReading({ uvIndex: uv, timestamp: new Date().toISOString() });
    setState("connected");

    // Start polling — skip individual bad ticks, only disconnect after MAX_FAILURES in a row
    intervalRef.current = setInterval(async () => {
      if (!mountedRef.current) return;
      const uv = await fetchOnce();
      if (uv !== null) {
        failCountRef.current = 0;
        setLastUV(uv);
        onReading({ uvIndex: uv, timestamp: new Date().toISOString() });
      } else {
        failCountRef.current += 1;
        if (failCountRef.current >= MAX_FAILURES) {
          stopPolling();
          if (mountedRef.current) {
            setState("error");
            setError("Lost connection to bracelet. Reconnect when ready.");
          }
        }
        // Otherwise silently skip this tick and keep last UV displayed
      }
    }, POLL_INTERVAL);
  }, [onReading]);

  const disconnect = () => {
    stopPolling();
    failCountRef.current = 0;
    setState("disconnected");
    setLastUV(null);
    setError(null);
  };

  if (state === "disconnected" || state === "error") {
    return (
      <Box>
        {error && (
          <Alert severity="warning" icon={<WifiOffRoundedIcon />}
            sx={{ mb: 1.5, borderRadius: "14px" }}>
            {error}
          </Alert>
        )}
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<SensorsRoundedIcon />}
            label="No bracelet connected"
            variant="outlined"
            sx={{ borderRadius: 999, fontWeight: 600, color: "text.secondary" }}
          />
          <Button
            variant="contained" size="small"
            startIcon={<WifiRoundedIcon />}
            onClick={connect}
            sx={{ borderRadius: 999, fontWeight: 700 }}
          >
            Connect Bracelet
          </Button>

        </Stack>
      </Box>
    );
  }

  if (state === "connecting") {
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Connecting to bracelet…
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
      <Chip
        icon={<WifiRoundedIcon />}
        label={`Bracelet connected · UV ${lastUV?.toFixed(1) ?? "—"}`}
        color="success" variant="outlined"
        sx={{ borderRadius: 999, fontWeight: 700 }}
      />
      <Typography variant="caption" color="text.secondary">
        Live UV readings every 3 s.
      </Typography>
      <Button size="small" onClick={disconnect}
        sx={{ borderRadius: 999, fontWeight: 700, color: "text.secondary" }}>
        Disconnect
      </Button>
    </Stack>
  );
}
