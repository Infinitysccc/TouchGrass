export type DeviceReading = {
  timestamp: string;
  uvIndex: number;
  sunlightMinutes: number;
  estimatedSunIU: number;
  dietaryIU: number;
  supplementIU: number;
  braceletStatus: "Low" | "Partial" | "Goal met";
};

export const latestDeviceReading: DeviceReading = {
  timestamp: "2026-03-24T18:30:00Z",
  uvIndex: 5.8,
  sunlightMinutes: 18,
  estimatedSunIU: 420,
  dietaryIU: 180,
  supplementIU: 400,
  braceletStatus: "Partial",
};

export const weeklyDeviceReadings: DeviceReading[] = [
  {
    timestamp: "2026-03-18T18:00:00Z",
    uvIndex: 3.2,
    sunlightMinutes: 10,
    estimatedSunIU: 180,
    dietaryIU: 220,
    supplementIU: 400,
    braceletStatus: "Low",
  },
  {
    timestamp: "2026-03-19T18:00:00Z",
    uvIndex: 4.1,
    sunlightMinutes: 14,
    estimatedSunIU: 260,
    dietaryIU: 150,
    supplementIU: 400,
    braceletStatus: "Partial",
  },
  {
    timestamp: "2026-03-20T18:00:00Z",
    uvIndex: 5.4,
    sunlightMinutes: 21,
    estimatedSunIU: 470,
    dietaryIU: 200,
    supplementIU: 400,
    braceletStatus: "Goal met",
  },
  {
    timestamp: "2026-03-21T18:00:00Z",
    uvIndex: 2.7,
    sunlightMinutes: 8,
    estimatedSunIU: 120,
    dietaryIU: 300,
    supplementIU: 400,
    braceletStatus: "Low",
  },
  {
    timestamp: "2026-03-22T18:00:00Z",
    uvIndex: 6.0,
    sunlightMinutes: 24,
    estimatedSunIU: 520,
    dietaryIU: 120,
    supplementIU: 400,
    braceletStatus: "Goal met",
  },
  {
    timestamp: "2026-03-23T18:00:00Z",
    uvIndex: 4.8,
    sunlightMinutes: 16,
    estimatedSunIU: 340,
    dietaryIU: 210,
    supplementIU: 400,
    braceletStatus: "Partial",
  },
  latestDeviceReading,
];