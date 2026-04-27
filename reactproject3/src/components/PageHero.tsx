// src/components/PageHero.tsx
import React from "react";
import { Box, CardContent, Chip, Stack, Typography } from "@mui/material";
import SurfaceCard from "./SurfaceCard";

type PageHeroProps = {
  overline?: string;
  title: string;
  subtitle: string;
  chips?: string[];
  right?: React.ReactNode;
};

export default function PageHero({ overline, title, subtitle, chips, right }: PageHeroProps) {
  return (
    <SurfaceCard sx={{
      mb: 3,
      background: "linear-gradient(135deg, rgba(34,197,94,0.13) 0%, rgba(250,204,21,0.16) 100%)",
      border: "1px solid rgba(34,197,94,0.20)",
    }}>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }} spacing={2.5}>
          <Box sx={{ maxWidth: 700, minWidth: 0 }}>
            {overline && (
              <Typography variant="overline" color="text.secondary"
                sx={{ letterSpacing: "0.1em", display: "block", mb: 0.5 }}>
                {overline}
              </Typography>
            )}
            <Typography sx={{
              fontSize: { xs: 24, md: 38 }, fontWeight: 900,
              lineHeight: 1.06, letterSpacing: "-0.03em", mb: 1,
            }}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {subtitle}
            </Typography>
          </Box>
          {(chips || right) && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap
              alignItems="center" sx={{ flexShrink: 0 }}>
              {chips?.map((c) => (
                <Chip key={c} label={c} sx={{
                  borderRadius: 999, fontWeight: 700,
                  bgcolor: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  color: "primary.dark",
                }} />
              ))}
              {right}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </SurfaceCard>
  );
}
