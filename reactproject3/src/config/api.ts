// src/config/api.ts
// All backend route URLs in one place.
// Matches routes registered in backend/main.go exactly.

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080";

export const API = {
  login:           `${API_BASE}/login`,
  register:        `${API_BASE}/register`,
  profile:         `${API_BASE}/profile`,
  calculate:       `${API_BASE}/calculate`,
  dailyLog:        `${API_BASE}/daily-log`,          // GET + POST today's data
  dailyLogHistory: `${API_BASE}/daily-log/history`,  // GET ?userId=X&days=7|30
} as const;
