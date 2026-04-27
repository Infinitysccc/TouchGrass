// src/components/SectionHeader.tsx
import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function SectionHeader({ icon, title, subtitle }: {
  icon: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: "12px",
        display: "grid", placeItems: "center",
        bgcolor: "rgba(34,197,94,0.10)",
        border: "1px solid rgba(34,197,94,0.16)",
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.5 }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}
