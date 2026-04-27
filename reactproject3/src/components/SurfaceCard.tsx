// src/components/SurfaceCard.tsx
import React from "react";
import { Card } from "@mui/material";

export default function SurfaceCard({
  children, sx = {},
}: { children: React.ReactNode; sx?: object }) {
  return (
    <Card elevation={0} sx={{
      borderRadius: "20px",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 2px 12px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)",
      bgcolor: "background.paper",
      ...sx,
    }}>
      {children}
    </Card>
  );
}
