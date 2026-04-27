// src/pages/Help.tsx
import React from "react";
import { Box, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import SurfaceCard from "../components/SurfaceCard";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";

function HelpCard({ icon, title, subtitle, items }: {
  icon: React.ReactNode; title: string; subtitle: string; items: string[];
}) {
  return (
    <SurfaceCard sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <SectionHeader icon={icon} title={title} subtitle={subtitle} />
        <Stack spacing={1.25}>
          {items.map((item) => (
            <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
              <CheckCircleRoundedIcon sx={{ fontSize: 17, color: "primary.main", mt: "2px", flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {item}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </SurfaceCard>
  );
}

export default function Help() {
  return (
    <Box sx={{ width: "100%" }}>
      <PageHero
        overline="Help center"
        title="Get support and use TouchGrass with confidence"
        subtitle="Quick guidance on setup, login, tracking, and common issues."
        chips={["Setup guidance", "Troubleshooting", "Product tips"]}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" }, gap: 3, mb: 3 }}>
        <HelpCard
          icon={<RocketLaunchRoundedIcon sx={{ color: "primary.dark" }} />}
          title="Getting started"
          subtitle="The fastest path from sign-up to your dashboard."
          items={[
            "Create an account from the Get Started page.",
            "Log in using your email and password.",
            "Use 'Remember me' to keep your session across visits.",
            "Head to the dashboard after login to see your daily overview.",
          ]}
        />
        <HelpCard
          icon={<LockRoundedIcon sx={{ color: "primary.dark" }} />}
          title="Account & login"
          subtitle="Tips for smoother sign-in and session behaviour."
          items={[
            "Double-check your email address is entered correctly.",
            "Passwords must be at least 8 characters.",
            "Log out and back in if the session seems stuck.",
            "Clear local storage if issues persist after a refresh.",
          ]}
        />
        <HelpCard
          icon={<WbSunnyRoundedIcon sx={{ color: "primary.dark" }} />}
          title="Vitamin D tracking"
          subtitle="How to get the most useful recommendations."
          items={[
            "Fill in your profile so recommendations are personalised.",
            "Log outdoor time, dietary intake, and supplements regularly.",
            "Use the dashboard rings to compare against your daily target.",
            "Switch between 7-day and 30-day charts to spot trends.",
          ]}
        />
        <HelpCard
          icon={<BuildRoundedIcon sx={{ color: "primary.dark" }} />}
          title="Technical issues"
          subtitle="Simple checks before assuming something is broken."
          items={[
            "Check your internet connection first.",
            "Refresh the page if data doesn't appear.",
            "Try another browser if a page behaves unexpectedly.",
            "Restart the local frontend or Go backend if data looks stale.",
          ]}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1.5fr) 320px" }, gap: 3 }}>
        <SurfaceCard>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
              <AutoAwesomeRoundedIcon sx={{ color: "#eab308" }} />
              <Typography variant="h6" fontWeight={800}>Best practices</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
              TouchGrass works best when your profile and daily tracker values are kept up to date.
              That gives the dashboard useful context and makes the product feel meaningful day to day.
            </Typography>
            <Divider sx={{ mb: 2.5 }} />
            <Stack spacing={1.25}>
              {[
                "Complete your profile before relying on recommendations",
                "Log intake consistently for better dashboard trends",
                "Use both sunlight and intake data for the clearest picture",
                "Check your trend charts weekly to spot patterns",
              ].map((t) => (
                <Stack key={t} direction="row" spacing={1.25} alignItems="flex-start">
                  <CheckCircleRoundedIcon sx={{ fontSize: 17, color: "primary.main", mt: "2px", flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{t}</Typography>
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
              <ContactSupportRoundedIcon sx={{ color: "#eab308" }} />
              <Typography variant="h6" fontWeight={800}>Need more help?</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
              If something still doesn't make sense, reach out or flag it during the capstone demo.
            </Typography>
            <Divider sx={{ mb: 2.5 }} />
            <Stack spacing={1.75}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Support email
                </Typography>
                <Typography variant="body1" fontWeight={800} sx={{ color: "primary.dark" }}>
                  support@touchgrass.app
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Project team
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  Group 27 — McMaster University
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </SurfaceCard>
      </Box>
    </Box>
  );
}
