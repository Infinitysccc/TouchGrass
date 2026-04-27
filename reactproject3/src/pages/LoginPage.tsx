// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Alert, Box, Button, CardContent, Checkbox, CircularProgress,
  FormControlLabel, FormHelperText, IconButton, InputAdornment,
  Stack, TextField, Typography, Chip,
} from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import SurfaceCard from "../components/SurfaceCard";
import { API } from "../config/api";

type LoginForm = { email: string; password: string; rememberMe: boolean };

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true); setApiError(null);
    try {
      const res = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.text()) || "Incorrect email or password.");
      const user = await res.json();
      if (data.rememberMe) localStorage.setItem("user", JSON.stringify(user));
      else sessionStorage.setItem("user", JSON.stringify(user));
      onLogin();
      navigate("/dashboard");
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: "100vh", bgcolor: "background.default",
      px: 2, py: { xs: 3, md: 5 }, display: "flex", alignItems: "center",
    }}>
      <Box sx={{
        width: "100%", maxWidth: 1240, mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 460px" },
        gap: 3, alignItems: "stretch",
      }}>

        {/* Left brand panel */}
        <SurfaceCard sx={{
          display: { xs: "none", lg: "block" },
          background: "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(250,204,21,0.14) 100%)",
          border: "1px solid rgba(34,197,94,0.2)",
        }}>
          <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ width: 42, height: 42, borderRadius: "14px", display: "grid",
                placeItems: "center", bgcolor: "background.paper",
                border: "1px solid rgba(34,197,94,0.2)" }}>
                <WbSunnyRoundedIcon sx={{ color: "primary.dark" }} />
              </Box>
              <Typography variant="h6" fontWeight={900}>TouchGrass</Typography>
            </Stack>
            <Typography sx={{ fontSize: 38, fontWeight: 900, lineHeight: 1.06,
              letterSpacing: "-0.03em", mb: 1.5, maxWidth: 500 }}>
              Welcome back to your vitamin D dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              Log in to continue tracking sunlight, intake, and personalised recommendations.
            </Typography>
            <Stack spacing={2} sx={{ mt: "auto" }}>
              {[
                { icon: <WbSunnyRoundedIcon color="warning" />, title: "Track sunlight", body: "Monitor daily exposure and keep your routine consistent." },
                { icon: <InsightsRoundedIcon color="success" />, title: "See smart insights", body: "Recommendations shaped by your profile and daily inputs." },
                { icon: <FavoriteRoundedIcon color="error" />, title: "Build healthier habits", body: "Use rings and trends to stay consistent over time." },
              ].map(({ icon, title, body }) => (
                <Box key={title} sx={{ p: 2.5, borderRadius: "16px",
                  bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
                    {icon}<Typography fontWeight={800}>{title}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{body}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </SurfaceCard>

        {/* Form */}
        <SurfaceCard>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Chip icon={<LoginRoundedIcon />} label="Secure login" sx={{
                  mb: 2, borderRadius: 999, fontWeight: 700,
                  bgcolor: "rgba(34,197,94,0.10)", color: "primary.dark",
                }} />
                <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 900,
                  lineHeight: 1.05, letterSpacing: "-0.03em", mb: 0.75 }}>
                  Sign in
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your personalised dashboard.
                </Typography>
              </Box>

              {apiError && <Alert severity="error" sx={{ borderRadius: "14px" }}>{apiError}</Alert>}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                  <Controller name="email" control={control}
                    rules={{
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                    }}
                    render={({ field }) => (
                      <Box>
                        <TextField {...field} label="Email" type="email"
                          error={!!errors.email} autoComplete="email" />
                        {errors.email && (
                          <FormHelperText error sx={{ ml: 1.5, mt: 0.5 }}>{errors.email.message}</FormHelperText>
                        )}
                      </Box>
                    )}
                  />

                  <Controller name="password" control={control}
                    rules={{
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    }}
                    render={({ field }) => (
                      <Box>
                        <TextField
                          {...field}
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          error={!!errors.password}
                          autoComplete="current-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword((v) => !v)}
                                  edge="end"
                                  size="small"
                                  aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword
                                    ? <VisibilityOffRoundedIcon fontSize="small" />
                                    : <VisibilityRoundedIcon fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {errors.password && (
                          <FormHelperText error sx={{ ml: 1.5, mt: 0.5 }}>{errors.password.message}</FormHelperText>
                        )}
                      </Box>
                    )}
                  />

                  <Controller name="rememberMe" control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Remember me on this device"
                      />
                    )}
                  />

                  <Button type="submit" variant="contained" fullWidth disabled={loading}
                    endIcon={loading
                      ? <CircularProgress size={18} color="inherit" />
                      : <ArrowForwardRoundedIcon />}
                    sx={{ mt: 0.5, py: 1.4, borderRadius: 999, fontWeight: 800 }}>
                    {loading ? "Signing in…" : "Login"}
                  </Button>
                </Stack>
              </form>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Don't have an account?{" "}
                <Box component={RouterLink} to="/getstarted"
                  sx={{ color: "primary.dark", fontWeight: 800, textDecoration: "none",
                    "&:hover": { textDecoration: "underline" } }}>
                  Get started
                </Box>
              </Typography>
            </Stack>
          </CardContent>
        </SurfaceCard>
      </Box>
    </Box>
  );
}
