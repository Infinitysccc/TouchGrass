// src/types/user.ts
// Single source of truth for UserData and related types.
// Import from here in Dashboard, Profile, VitaminDTracker, and vitaminD.ts

export type SkinTone = "Light" | "Medium" | "Dark";
export type BodyCoverage = "Full" | "Arms & Legs" | "Face only";

export type UserData = {
  age: number;
  skinTone: SkinTone;
  bodyCoverage: BodyCoverage;
  timeOutdoors: number;
  dietaryIU: number;
  supplementIU: number;
  weight: number;
  height: number;
  medicalConditions: boolean;
  bloodLevel?: number;
};

export type VitaminDResult = {
  recommendedIU: number;
  category: string;
};

export const SKIN_TONES: SkinTone[] = ["Light", "Medium", "Dark"];
export const BODY_COVERAGE_OPTIONS: BodyCoverage[] = ["Full", "Arms & Legs", "Face only"];

export const EMPTY_PROFILE: UserData = {
  age: 0,
  skinTone: "Medium",
  bodyCoverage: "Full",
  timeOutdoors: 0,
  dietaryIU: 0,
  supplementIU: 0,
  weight: 0,
  height: 0,
  medicalConditions: false,
  bloodLevel: undefined,
};
