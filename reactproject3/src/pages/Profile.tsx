import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type UserData = {
  age: number;
  skinTone: "Light" | "Medium" | "Dark";
  bodyCoverage: "Full" | "Arms & Legs" | "Face only";
  timeOutdoors: number;
  dietaryIU: number;
  supplementIU: number;
  weight: number;
  height: number;
  medicalConditions: boolean;
  bloodLevel?: number;
};

const SKIN_TONES = ["Light", "Medium", "Dark"] as const;
const BODY_COVERAGE = ["Full", "Arms & Legs", "Face only"] as const;

const emptyProfile: UserData = {
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

function SurfaceCard({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        border: "1px solid #e8eef3",
        boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
        backgroundColor: "#ffffff",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(34,197,94,0.10)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<UserData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  const user = JSON.parse(storedUser);
  const userId = user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:8080/profile?userId=${userId}`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();

        setProfile({
          age: data.age ?? 0,
          skinTone: data.skinTone ?? "Medium",
          bodyCoverage: data.bodyCoverage ?? "Full",
          timeOutdoors: data.timeOutdoors ?? 0,
          dietaryIU: data.dietaryIU ?? 0,
          supplementIU: data.supplementIU ?? 0,
          weight: data.weight ?? 0,
          height: data.height ?? 0,
          medicalConditions: data.medicalConditions ?? false,
          bloodLevel: data.bloodLevel,
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const completion = useMemo(() => {
    const checks = [
      profile.age > 0,
      profile.weight > 0,
      profile.height > 0,
      profile.timeOutdoors >= 0,
      profile.dietaryIU >= 0,
      profile.supplementIU >= 0,
      !!profile.skinTone,
      !!profile.bodyCoverage,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const totalAverageIU = (profile.dietaryIU || 0) + (profile.supplementIU || 0);

  const handleChange = <K extends keyof UserData>(field: K, value: UserData[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!userId) throw new Error("No logged in user found.");

      const res = await fetch(`http://localhost:8080/profile?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error(await res.text());

      setSuccessMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          icon={<CheckCircleRoundedIcon />}
          sx={{ mb: 3, borderRadius: 3 }}
        >
          {successMessage}
        </Alert>
      )}

      <SurfaceCard
        sx={{
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(250,204,21,0.14) 100%)",
          border: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={2}
          >
            <Box sx={{ maxWidth: 760 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: "0.12em" }}
              >
                Personalized health inputs
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 28, md: 42 },
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  mb: 1,
                }}
              >
                Build a more accurate vitamin D profile
              </Typography>

              <Typography variant="body1" color="text.secondary">
                These values help TouchGrass tailor your vitamin D recommendation,
                sunlight guidance, and dashboard insights.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`Profile completion: ${completion}%`}
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                }}
              />
              <Chip
                label={`Avg daily intake: ${totalAverageIU} IU`}
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </SurfaceCard>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.7fr) minmax(320px, 1fr)",
          },
          gap: 3,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<PersonRoundedIcon sx={{ color: "#166534" }} />}
                title="Basic information"
                subtitle="General physical details used to personalize your recommendation."
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleChange("age", Number(e.target.value))}
                />

                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => handleChange("weight", Number(e.target.value))}
                />

                <TextField
                  label="Height (cm)"
                  type="number"
                  value={profile.height}
                  onChange={(e) => handleChange("height", Number(e.target.value))}
                />
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<WbSunnyRoundedIcon sx={{ color: "#166534" }} />}
                title="Sunlight exposure factors"
                subtitle="These affect how your body may naturally produce vitamin D."
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Skin tone</InputLabel>
                  <Select
                    value={profile.skinTone}
                    label="Skin tone"
                    onChange={(e) =>
                      handleChange("skinTone", e.target.value as UserData["skinTone"])
                    }
                  >
                    {SKIN_TONES.map((tone) => (
                      <MenuItem key={tone} value={tone}>
                        {tone}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Body coverage</InputLabel>
                  <Select
                    value={profile.bodyCoverage}
                    label="Body coverage"
                    onChange={(e) =>
                      handleChange(
                        "bodyCoverage",
                        e.target.value as UserData["bodyCoverage"]
                      )
                    }
                  >
                    {BODY_COVERAGE.map((coverage) => (
                      <MenuItem key={coverage} value={coverage}>
                        {coverage}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Average time outdoors (minutes/day)"
                  type="number"
                  value={profile.timeOutdoors}
                  onChange={(e) =>
                    handleChange("timeOutdoors", Number(e.target.value))
                  }
                />
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<RestaurantRoundedIcon sx={{ color: "#166534" }} />}
                title="Vitamin D intake"
                subtitle="Track your average vitamin D from diet and supplements."
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Average dietary vitamin D (IU/day)"
                  type="number"
                  value={profile.dietaryIU}
                  onChange={(e) => handleChange("dietaryIU", Number(e.target.value))}
                />

                <TextField
                  label="Average supplement vitamin D (IU/day)"
                  type="number"
                  value={profile.supplementIU}
                  onChange={(e) =>
                    handleChange("supplementIU", Number(e.target.value))
                  }
                />
              </Box>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <SectionHeader
                icon={<MonitorHeartRoundedIcon sx={{ color: "#166534" }} />}
                title="Health factors"
                subtitle="Optional health inputs can improve recommendation quality."
              />

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={profile.medicalConditions}
                      onChange={(e) =>
                        handleChange("medicalConditions", e.target.checked)
                      }
                    />
                  }
                  label="Medical conditions affecting vitamin D absorption"
                />

                <TextField
                  label="Blood vitamin D level (optional)"
                  type="number"
                  value={profile.bloodLevel ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "bloodLevel",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </Stack>
            </CardContent>
          </SurfaceCard>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={<SaveRoundedIcon />}
              sx={{
                minWidth: { xs: "100%", sm: 220 },
              }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                setProfile(emptyProfile);
                setSuccessMessage(null);
                setError(null);
              }}
              sx={{
                minWidth: { xs: "100%", sm: 180 },
              }}
            >
              Reset Form
            </Button>
          </Stack>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <SurfaceCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Profile snapshot
              </Typography>

              <Stack spacing={1.25}>
                {[
                  { label: "Skin tone", value: profile.skinTone },
                  { label: "Body coverage", value: profile.bodyCoverage },
                  { label: "Outdoor average", value: `${profile.timeOutdoors} min/day` },
                  { label: "Daily intake", value: `${totalAverageIU} IU` },
                  {
                    label: "Medical concerns",
                    value: profile.medicalConditions ? "Yes" : "No",
                  },
                ].map((item, index, arr) => (
                  <Box key={item.label}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          minWidth: 140,
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                          color: "text.primary",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Stack>

                    {index < arr.length - 1 && <Divider sx={{ mt: 1.25 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </SurfaceCard>

          <SurfaceCard
            sx={{
              background:
                "linear-gradient(180deg, rgba(255,250,235,1) 0%, rgba(255,255,255,1) 100%)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                <MedicationRoundedIcon color="warning" />
                <Typography variant="h6" fontWeight={800}>
                  Why this matters
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your profile drives the recommendations shown on the dashboard.
                More complete information leads to more personalized vitamin D guidance.
              </Typography>

              <Stack spacing={1.25}>
                <Chip
                  label="Sunlight exposure affects natural synthesis"
                  sx={{ justifyContent: "flex-start", borderRadius: 999 }}
                />
                <Chip
                  label="Diet and supplements affect daily intake"
                  sx={{ justifyContent: "flex-start", borderRadius: 999 }}
                />
                <Chip
                  label="Health factors improve recommendation quality"
                  sx={{ justifyContent: "flex-start", borderRadius: 999 }}
                />
              </Stack>
            </CardContent>
          </SurfaceCard>
        </Box>
      </Box>
    </Box>
  );
}