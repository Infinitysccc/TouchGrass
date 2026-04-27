// src/vitaminD.ts
import { API } from "./config/api";
import type { UserData, VitaminDResult } from "./types/user";

export type { UserData, VitaminDResult };

export async function calculateVitaminD(user: UserData): Promise<VitaminDResult> {
  // Uses API.calculate → http://localhost:8080/calculate (matches Go route)
  const response = await fetch(API.calculate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to calculate vitamin D");
  }

  return response.json();
}
