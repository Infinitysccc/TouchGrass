// src/data/mockDeviceData.ts
//
// PURPOSE: Provides realistic-looking fallback data so the Dashboard renders
// even when the real UV bracelet is not connected.
//
// WHEN THE REAL DEVICE IS READY:
//   Replace the exported values with live API/BLE calls inside Dashboard.tsx.
//   The shape of DeviceReading must stay the same so the Dashboard UI
//   doesn't need changes — only the data source changes.

export type BraceletStatus = "Green" | "Yellow" | "Red" | "Disconnected";

export type DeviceReading = {
  timestamp: string;      // ISO 8601 string, e.g. "2026-03-25T14:30:00"
  uvIndex: number;        // 0–11+
  estimatedSunIU: number; // IU of vitamin D synthesised from sunlight today
  dietaryIU: number;      // IU logged from food (synced from profile)
  supplementIU: number;   // IU from supplements (synced from profile)
  braceletStatus: BraceletStatus;
};

// ─── Today's most recent reading ────────────────────────────────────────────

export const latestDeviceReading: DeviceReading = {
  timestamp: new Date().toISOString(),
  uvIndex: 0,
  estimatedSunIU: 0,
  dietaryIU: 0,
  supplementIU: 0,
  braceletStatus: "Red",
};

// ─── Past 7 days of daily readings (newest last) ────────────────────────────
// Each entry represents the end-of-day summary for that date.

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
}

export const weeklyDeviceReadings: DeviceReading[] = [
  {
    timestamp: daysAgo(6),
    uvIndex: 2.1,
    estimatedSunIU: 140,
    dietaryIU: 100,
    supplementIU: 400,
    braceletStatus: "Red",
  },
  {
    timestamp: daysAgo(5),
    uvIndex: 5.8,
    estimatedSunIU: 520,
    dietaryIU: 200,
    supplementIU: 400,
    braceletStatus: "Green",
  },
  {
    timestamp: daysAgo(4),
    uvIndex: 3.4,
    estimatedSunIU: 260,
    dietaryIU: 150,
    supplementIU: 400,
    braceletStatus: "Yellow",
  },
  {
    timestamp: daysAgo(3),
    uvIndex: 6.1,
    estimatedSunIU: 610,
    dietaryIU: 180,
    supplementIU: 400,
    braceletStatus: "Green",
  },
  {
    timestamp: daysAgo(2),
    uvIndex: 1.0,
    estimatedSunIU: 60,
    dietaryIU: 90,
    supplementIU: 400,
    braceletStatus: "Red",
  },
  {
    timestamp: daysAgo(1),
    uvIndex: 4.7,
    estimatedSunIU: 420,
    dietaryIU: 160,
    supplementIU: 400,
    braceletStatus: "Yellow",
  },
  {
    // today
    timestamp: new Date().toISOString(),
    uvIndex: 4.2,
    estimatedSunIU: 380,
    dietaryIU: 120,
    supplementIU: 400,
    braceletStatus: "Yellow",
  },
];
