// src/pages/Profile.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, CardContent, Checkbox, Chip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider, FormControl, FormControlLabel, InputLabel, MenuItem,
  Select, Skeleton, Stack, TextField, Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import SurfaceCard from "../components/SurfaceCard";
import PageHero from "../components/PageHero";
import RingProgress from "../components/RingProgress";
import SectionHeader from "../components/SectionHeader";
import { API } from "../config/api";
import { type UserData, SKIN_TONES, BODY_COVERAGE_OPTIONS, EMPTY_PROFILE } from "../types/user";
import { useNavigate } from "react-router-dom";

function ProfileSkeleton() {
  return (
    <Box>
      <Skeleton variant="rounded" height={140} sx={{ mb: 3, borderRadius: "20px" }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" }, gap: 3 }}>
        <Stack spacing={3}>
          {[140, 160, 120, 120].map((h, i) => (
            <Skeleton key={i} variant="rounded" height={h} sx={{ borderRadius: "20px" }} />
          ))}
        </Stack>
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: "20px" }} />
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: "20px" }} />
        </Stack>
      </Box>
    </Box>
  );
}

// ── Empty state shown when user has never saved a profile ─────────────────────
function EmptyProfileState() {
  const navigate = useNavigate();
  return (
    <SurfaceCard sx={{
      mb: 3,
      background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,197,94,0.08) 100%)",
      border: "1px solid rgba(99,102,241,0.18)",
    }}>
      <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
        <Box sx={{
          width: 64, height: 64, borderRadius: "20px",
          display: "grid", placeItems: "center", mx: "auto", mb: 2.5,
          bgcolor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)",
        }}>
          <PersonRoundedIcon sx={{ color: "primary.dark", fontSize: 32 }} />
        </Box>
        <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>
          Complete your profile to get started
        </Typography>
        <Typography variant="body1" color="text.secondary"
          sx={{ maxWidth: 480, mx: "auto", mb: 3, lineHeight: 1.7 }}>
          Your profile is what makes the dashboard personalised. Fill in your age, skin tone,
          sunlight habits, and dietary intake to unlock accurate vitamin D targets and recommendations.
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          {["Skin tone affects sun synthesis", "Diet shapes your daily total", "Age sets your RDI target"].map((t) => (
            <Chip key={t} label={t} size="small"
              sx={{ borderRadius: 999, fontWeight: 600, bgcolor: "rgba(34,197,94,0.10)", color: "primary.dark" }} />
          ))}
        </Stack>
        <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => document.getElementById("profile-form")?.scrollIntoView({ behavior: "smooth" })}
          sx={{ borderRadius: 999, fontWeight: 800, px: 4, py: 1.3 }}>
          Fill in my profile
        </Button>
      </CardContent>
    </SurfaceCard>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<UserData>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  const userId = JSON.parse(storedUser)?.id;

  useEffect(() => {
    const load = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const res = await fetch(`${API.profile}?userId=${userId}`);
        if (!res.ok) throw new Error(await res.text());
        const d = await res.json();

        // Check if profile has any meaningful data
        const hasData = d.age > 0 || d.weight > 0 || d.height > 0;
        setHasExistingProfile(hasData);

        setProfile({
          age: d.age ?? 0, skinTone: d.skinTone ?? "Medium",
          bodyCoverage: d.bodyCoverage ?? "Full", timeOutdoors: d.timeOutdoors ?? 0,
          dietaryIU: d.dietaryIU ?? 0, supplementIU: d.supplementIU ?? 0,
          weight: d.weight ?? 0, height: d.height ?? 0,
          medicalConditions: d.medicalConditions ?? false, bloodLevel: d.bloodLevel,
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load profile.");
      } finally { setLoading(false); }
    };
    load();
  }, [userId]);

  const completion = useMemo(() => {
    const checks = [
      profile.age > 0, profile.weight > 0, profile.height > 0,
      profile.timeOutdoors > 0, profile.dietaryIU >= 0,
      profile.supplementIU >= 0, !!profile.skinTone, !!profile.bodyCoverage,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const set = <K extends keyof UserData>(field: K, value: UserData[K]) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setSuccess(null);
  };

  const save = async () => {
    if (!userId) { setError("No logged-in user found."); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      const res = await fetch(`${API.profile}?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Profile saved successfully.");
      setHasExistingProfile(true);
    } catch (e: any) {
      setError(e?.message || "Failed to save profile.");
    } finally { setSaving(false); }
  };

  const handleReset = () => {
    setProfile(EMPTY_PROFILE);
    setSuccess(null);
    setError(null);
    setResetOpen(false);
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <Box sx={{ width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>{error}</Alert>}
      {success && (
        <Alert severity="success" icon={<CheckCircleRoundedIcon />} sx={{ mb: 3, borderRadius: "14px" }}>
          {success}
        </Alert>
      )}

      {/* Empty state — shown only when profile has never been saved */}
      {!hasExistingProfile && <EmptyProfileState />}

      <PageHero
        overline="Your health profile"
        title="Personalise your vitamin D guidance"
        subtitle="The more complete your profile, the more accurate the dashboard recommendations."
        right={
          <RingProgress value={completion} size={80} thickness={8}
            color="#22c55e" label="Complete" sublabel={`${completion}%`} />
        }
      />

      <Box id="profile-form" sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 300px" },
        gap: 3, alignItems: "start",
      }}>

        {/* Form */}
        <Box>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<PersonRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Personal information" subtitle="Basic details used to personalise your vitamin D targets." />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 2 }}>
                <TextField label="Age" type="number" value={profile.age || ""}
                  placeholder="e.g. 25"
                  onChange={(e) => set("age", Number(e.target.value))} />
                <TextField label="Weight (kg)" type="number" value={profile.weight || ""}
                  placeholder="e.g. 70"
                  onChange={(e) => set("weight", Number(e.target.value))} />
                <TextField label="Height (cm)" type="number" value={profile.height || ""}
                  placeholder="e.g. 175"
                  onChange={(e) => set("height", Number(e.target.value))} />
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<WbSunnyRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Sunlight exposure" subtitle="Skin tone and coverage affect how much vitamin D you synthesise." />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Skin tone</InputLabel>
                  <Select value={profile.skinTone} label="Skin tone"
                    onChange={(e) => set("skinTone", e.target.value as UserData["skinTone"])}>
                    {SKIN_TONES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Body coverage</InputLabel>
                  <Select value={profile.bodyCoverage} label="Body coverage"
                    onChange={(e) => set("bodyCoverage", e.target.value as UserData["bodyCoverage"])}>
                    {BODY_COVERAGE_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Avg outdoor time (min/day)" type="number"
                  value={profile.timeOutdoors || ""} placeholder="e.g. 30"
                  onChange={(e) => set("timeOutdoors", Number(e.target.value))} />
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<RestaurantRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Vitamin D intake" subtitle="Average daily vitamin D from diet and supplements." />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" }, gap: 2 }}>
                <TextField label="Dietary vitamin D (IU/day)" type="number"
                  value={profile.dietaryIU || ""} placeholder="e.g. 200"
                  onChange={(e) => set("dietaryIU", Number(e.target.value))} />
                <TextField label="Supplement vitamin D (IU/day)" type="number"
                  value={profile.supplementIU || ""} placeholder="e.g. 1000"
                  onChange={(e) => set("supplementIU", Number(e.target.value))} />
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader icon={<MonitorHeartRoundedIcon sx={{ color: "primary.dark" }} />}
                title="Health factors" subtitle="Optional inputs that improve recommendation accuracy." />
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Checkbox checked={profile.medicalConditions}
                    onChange={(e) => set("medicalConditions", e.target.checked)} />}
                  label="I have a medical condition affecting vitamin D absorption"
                />
                <Box sx={{ maxWidth: 340 }}>
                  <TextField label="Blood vitamin D level (ng/mL, optional)" type="number"
                    value={profile.bloodLevel ?? ""} placeholder="e.g. 25"
                    onChange={(e) => set("bloodLevel", e.target.value ? Number(e.target.value) : undefined)} />
                </Box>
              </Stack>
            </CardContent>
          </SurfaceCard>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" onClick={save} disabled={saving}
              startIcon={<SaveRoundedIcon />}
              sx={{ minWidth: 200, py: 1.3, borderRadius: 999, fontWeight: 800 }}>
              {saving ? "Saving…" : "Save Profile"}
            </Button>
            <Button variant="outlined" color="error"
              onClick={() => setResetOpen(true)}
              sx={{ minWidth: 160, py: 1.3, borderRadius: 999 }}>
              Reset Form
            </Button>
          </Stack>
        </Box>

        {/* Sidebar */}
        <Box>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Profile snapshot</Typography>
              <Stack spacing={0} divider={<Divider />}>
                {[
                  { label: "Skin tone", value: profile.skinTone },
                  { label: "Body coverage", value: profile.bodyCoverage },
                  { label: "Outdoor avg", value: profile.timeOutdoors ? `${profile.timeOutdoors} min/day` : "Not set" },
                  { label: "Daily intake", value: `${(profile.dietaryIU || 0) + (profile.supplementIU || 0)} IU` },
                  { label: "Medical concerns", value: profile.medicalConditions ? "Yes" : "No" },
                ].map((item) => (
                  <Stack key={item.label} direction="row" justifyContent="space-between"
                    alignItems="center" spacing={2} sx={{ py: 1.25 }}>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="body2" fontWeight={700}
                      sx={{ color: item.value === "Not set" ? "text.disabled" : "text.primary" }}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{
            background: "linear-gradient(180deg, rgba(255,250,230,0.8) 0%, transparent 100%)",
            border: "1px solid rgba(234,179,8,0.22)",
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <MedicationRoundedIcon sx={{ color: "#eab308" }} />
                <Typography variant="h6" fontWeight={800}>Why this matters</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                Your profile drives every recommendation. More complete = more accurate.
              </Typography>
              <Stack spacing={1}>
                {["Sunlight exposure affects natural synthesis",
                  "Diet and supplements affect daily intake",
                  "Health factors refine your target IU"].map((t) => (
                  <Chip key={t} label={t} size="small"
                    sx={{ justifyContent: "flex-start", borderRadius: 999, fontSize: 12 }} />
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>
        </Box>
      </Box>

      {/* Reset confirmation dialog */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: 380 } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: 20, pb: 1 }}>
          Reset your profile?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all the fields in the form. Your previously saved profile on the server
            won't be affected until you click Save again.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setResetOpen(false)} variant="outlined"
            sx={{ borderRadius: 999, fontWeight: 700, flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleReset} variant="contained" color="error"
            sx={{ borderRadius: 999, fontWeight: 800, flex: 1 }}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
