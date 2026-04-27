// src/pages/HeaderPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";

import headpicture from "../assets/outsidePicture.png";

const features = [
  {
    icon: <WbSunnyRoundedIcon sx={{ color: "#eab308", fontSize: 22 }} />,
    title: "UV bracelet tracking",
    body: "Wear the bracelet outdoors and get real-time UV readings sent straight to your dashboard.",
  },
  {
    icon: <InsightsRoundedIcon sx={{ color: "#22c55e", fontSize: 22 }} />,
    title: "Personalised guidance",
    body: "Recommendations shaped by your skin tone, lifestyle, diet, and health factors.",
  },
  {
    icon: <TrackChangesRoundedIcon sx={{ color: "#6366f1", fontSize: 22 }} />,
    title: "Daily progress rings",
    body: "Visual rings show UV exposure, food intake, and supplement totals against your daily goal.",
  },
  {
    icon: <DevicesRoundedIcon sx={{ color: "#f97316", fontSize: 22 }} />,
    title: "7 and 30-day trends",
    body: "Spot patterns in your sunlight and support levels with weekly and monthly chart views.",
  },
];

export default function HeaderPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", overflowX: "hidden", minHeight: "100vh", bgcolor: "#0f172a" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box sx={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Box component="img" src={headpicture} alt="Outdoors"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0, opacity: 0.85 }} />
        <Box sx={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.65) 100%)",
        }} />

        {/* Nav */}
        <Box sx={{ position: "relative", zIndex: 2, px: { xs: 2, md: 4 }, pt: 2.5 }}>
          <Box sx={{
            maxWidth: 1360, mx: "auto",
            px: { xs: 2, md: 3 }, py: 1.5, borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            backdropFilter: "blur(16px)",
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{
                width: 38, height: 38, borderRadius: "12px",
                display: "grid", placeItems: "center",
                background: "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(250,204,21,0.3))",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <WbSunnyRoundedIcon sx={{ color: "#fde047", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ color: "white", fontWeight: 900, fontSize: 20,
                  lineHeight: 1, letterSpacing: "-0.02em" }}>
                  TouchGrass
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 11,
                  display: { xs: "none", sm: "block" } }}>
                  Vitamin D wellness tracker
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button onClick={() => navigate("/login")} sx={{
                color: "white", textTransform: "none", fontWeight: 700, borderRadius: 999, px: 2.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}>
                Login
              </Button>
              <Button variant="contained" onClick={() => navigate("/getstarted")} sx={{
                textTransform: "none", fontWeight: 800, borderRadius: 999, px: 3, py: 1.1,
                bgcolor: "#22c55e", boxShadow: "0 8px 24px rgba(34,197,94,0.35)",
                "&:hover": { bgcolor: "#16a34a" },
              }}>
                Get Started
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Hero copy */}
        <Box sx={{
          position: "relative", zIndex: 2,
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          px: 2, py: 6,
        }}>
          <Box sx={{
            width: "100%", maxWidth: 840, textAlign: "center",
            px: { xs: 2.5, md: 6 }, py: { xs: 5, md: 7 },
            borderRadius: "28px",
            backdropFilter: "blur(14px)",
            bgcolor: "rgba(10,16,26,0.3)",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          }}>
            <Chip label="Capstone Project — McMaster Engineering" sx={{
              mb: 3, borderRadius: 999, fontWeight: 700, fontSize: 12,
              bgcolor: "rgba(34,197,94,0.22)", color: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(34,197,94,0.35)",
            }} />

            <Typography sx={{
              fontSize: { xs: 40, sm: 54, md: 60 },
              fontWeight: 900, lineHeight: 0.96,
              letterSpacing: "-0.04em", color: "white", mb: 2.5,
            }}>
              Optimise your vitamin D.
            </Typography>

            <Typography sx={{
              fontSize: { xs: 16, md: 19 },
              color: "rgba(255,255,255,0.82)",
              maxWidth: 600, mx: "auto", lineHeight: 1.65, mb: 4.5,
            }}>
              TouchGrass pairs a UV-sensing wearable bracelet with a personalised dashboard
              to help you track sunlight exposure and hit your daily vitamin D goals.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
              justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
              <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/getstarted")} sx={{
                  minWidth: 220, textTransform: "none", fontWeight: 800,
                  fontSize: 16, borderRadius: 999, px: 4, py: 1.5,
                  bgcolor: "#22c55e", boxShadow: "0 10px 28px rgba(34,197,94,0.32)",
                  "&:hover": { bgcolor: "#16a34a" },
                }}>
                Start Tracking
              </Button>
              <Button variant="outlined" onClick={() => navigate("/login")} sx={{
                minWidth: 180, textTransform: "none", fontWeight: 700,
                fontSize: 16, borderRadius: 999, px: 4, py: 1.5,
                color: "white", borderColor: "rgba(255,255,255,0.4)",
                bgcolor: "rgba(255,255,255,0.06)",
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
              }}>
                Login
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 2 }}
              justifyContent="center" alignItems="center">
              {["UV wearable bracelet", "Personalised daily targets", "7 & 30-day trend charts"].map((t, i, arr) => (
                <React.Fragment key={t}>
                  <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{t}</Typography>
                  {i < arr.length - 1 && (
                    <Typography sx={{ color: "rgba(255,255,255,0.28)", display: { xs: "none", sm: "block" } }}>
                      •
                    </Typography>
                  )}
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", pb: 3 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em" }}>
            SCROLL TO LEARN MORE
          </Typography>
        </Box>
      </Box>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "#f8fafc", px: { xs: 2, md: 6 }, py: { xs: 7, md: 10 } }}>
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
            <Chip label="What TouchGrass does" sx={{
              mb: 2, borderRadius: 999, fontWeight: 700,
              bgcolor: "rgba(34,197,94,0.10)", color: "#166534",
              border: "1px solid rgba(34,197,94,0.2)",
            }} />
            <Typography sx={{
              fontSize: { xs: 30, md: 44 }, fontWeight: 900,
              letterSpacing: "-0.03em", lineHeight: 1.06, mb: 1.5, color: "#0f172a",
            }}>
              Everything you need to stay on track
            </Typography>
            <Typography variant="body1" color="text.secondary"
              sx={{ maxWidth: 520, mx: "auto", lineHeight: 1.7 }}>
              From hardware sensor to polished dashboard — designed as a complete capstone system.
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)" }, gap: 3 }}>
            {features.map(({ icon, title, body }) => (
              <Box key={title} sx={{
                p: { xs: 3, md: 3.5 }, borderRadius: "20px",
                border: "1px solid #e8eef3", bgcolor: "#ffffff",
                boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": { boxShadow: "0 8px 28px rgba(15,23,42,0.10)", transform: "translateY(-2px)" },
              }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: "14px",
                  display: "grid", placeItems: "center",
                  bgcolor: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.14)", mb: 2,
                }}>
                  {icon}
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 0.75 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{body}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: "center", mt: { xs: 6, md: 8 } }}>
            <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate("/getstarted")} sx={{
                textTransform: "none", fontWeight: 800, fontSize: 16,
                borderRadius: 999, px: 5, py: 1.6,
              }}>
              Create Your Free Account
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Already have an account?{" "}
              <Box component="span" onClick={() => navigate("/login")}
                sx={{ color: "#166534", fontWeight: 700, cursor: "pointer",
                  "&:hover": { textDecoration: "underline" } }}>
                Log in here
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
