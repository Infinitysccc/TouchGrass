import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

function HelpSection({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <SurfaceCard sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
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
            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.4}>
          {items.map((item) => (
            <Stack key={item} direction="row" spacing={1.2} alignItems="flex-start">
              <CheckCircleRoundedIcon
                sx={{ fontSize: 18, color: "#16a34a", mt: "2px", flexShrink: 0 }}
              />
              <Typography variant="body2" color="text.secondary">
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
                Help center
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
                Get support and use TouchGrass with confidence
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Find quick guidance on setup, login, tracking, and common issues
                so you can keep your vitamin D routine smooth and consistent.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label="Setup guidance"
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                }}
              />
              <Chip
                label="Troubleshooting"
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                }}
              />
              <Chip
                label="Product tips"
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
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <HelpSection
          icon={<RocketLaunchRoundedIcon sx={{ color: "#166534" }} />}
          title="Getting started"
          subtitle="The fastest path from sign-up to seeing your dashboard."
          items={[
            "Create an account from the Get Started page.",
            "Log in using your email and password.",
            "Use “Remember me” if you want your login to persist on this device.",
            "After sign-in, head straight to the dashboard to see your daily overview.",
          ]}
        />

        <HelpSection
          icon={<LockRoundedIcon sx={{ color: "#166534" }} />}
          title="Account & login"
          subtitle="Tips for smoother sign-in and session behavior."
          items={[
            "Double-check that your email is entered correctly.",
            "If login seems stuck, try logging out and signing back in.",
            "If issues continue, clear local or session storage and try again.",
            "Persistent sign-in depends on whether you selected “Remember me.”",
          ]}
        />

        <HelpSection
          icon={<WbSunnyRoundedIcon sx={{ color: "#166534" }} />}
          title="Vitamin D tracking"
          subtitle="How to get the most useful recommendations and insights."
          items={[
            "Update your profile so recommendations are more personalized.",
            "Log your outdoor time, dietary intake, and supplement intake regularly.",
            "Use the dashboard to compare your intake against your recommended target.",
            "Track trends over time to build stronger daily habits.",
          ]}
        />

        <HelpSection
          icon={<BuildRoundedIcon sx={{ color: "#166534" }} />}
          title="Technical issues"
          subtitle="Simple checks before assuming something is broken."
          items={[
            "Make sure your internet connection is working normally.",
            "Refresh the page if profile or dashboard data does not appear.",
            "Try another browser if a page behaves unexpectedly.",
            "If a page looks outdated, restart the local frontend or backend server.",
          ]}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1.5fr) minmax(320px, 1fr)",
          },
          gap: 3,
        }}
      >
        <SurfaceCard>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
              <AutoAwesomeRoundedIcon color="warning" />
              <Typography variant="h6" fontWeight={800}>
                Best practices
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              TouchGrass works best when profile inputs and daily tracker values
              are kept reasonably up to date. That gives the dashboard more
              useful context and makes the product feel more meaningful day to day.
            </Typography>

            <Stack spacing={1.4}>
              <Chip
                label="Complete your profile before relying on recommendations"
                sx={{ justifyContent: "flex-start", borderRadius: 999 }}
              />
              <Chip
                label="Log intake consistently for better dashboard trends"
                sx={{ justifyContent: "flex-start", borderRadius: 999 }}
              />
              <Chip
                label="Use both sunlight and intake data for the clearest picture"
                sx={{ justifyContent: "flex-start", borderRadius: 999 }}
              />
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
              <ContactSupportRoundedIcon color="warning" />
              <Typography variant="h6" fontWeight={800}>
                Need more help?
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If something still does not make sense, this is where you can show
              a support contact for your capstone demo.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Support email
              </Typography>
              <Typography fontWeight={800}>
                support@touchgrass.app
              </Typography>
            </Stack>
          </CardContent>
        </SurfaceCard>
      </Box>
    </Box>
  );
}