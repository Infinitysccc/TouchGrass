import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginPageProps = {
  onLogin: () => void;
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
        boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
        backgroundColor: "#ffffff",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Login failed");
      }

      const user = await response.json();

      if (data.rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      onLogin();
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f3f7f4 55%, #f8fafc 100%)",
        px: 2,
        py: { xs: 3, md: 5 },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1240,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) 460px",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <SurfaceCard
          sx={{
            display: { xs: "none", lg: "block" },
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(250,204,21,0.14) 100%)",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <CardContent sx={{ p: 4, height: "100%" }}>
            <Stack justifyContent="space-between" sx={{ height: "100%" }}>
              <Box>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <WbSunnyRoundedIcon sx={{ color: "#166534" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={900}>
                    TouchGrass
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: 42,
                    fontWeight: 900,
                    lineHeight: 1.04,
                    letterSpacing: "-0.03em",
                    mb: 1.5,
                    maxWidth: 560,
                  }}
                >
                  Welcome back to your vitamin D dashboard
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                  Log in to continue tracking sunlight, intake, and personalized
                  recommendations in one place.
                </Typography>
              </Box>

              <Stack spacing={2.25} sx={{ mt: 4 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                    border: "1px solid #e8eef3",
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
                    <WbSunnyRoundedIcon color="warning" />
                    <Typography fontWeight={800}>Track sunlight</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Monitor daily outdoor exposure and keep your routine consistent.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                    border: "1px solid #e8eef3",
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
                    <InsightsRoundedIcon color="success" />
                    <Typography fontWeight={800}>See smart insights</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    View recommendations shaped by your saved profile and daily inputs.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                    border: "1px solid #e8eef3",
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
                    <FavoriteRoundedIcon color="error" />
                    <Typography fontWeight={800}>Build healthier habits</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Use trends and progress to make your vitamin D routine easier to maintain.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </SurfaceCard>

        <SurfaceCard>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Chip
                  icon={<LoginRoundedIcon />}
                  label="Secure login"
                  sx={{
                    mb: 2,
                    borderRadius: 999,
                    fontWeight: 700,
                    backgroundColor: "rgba(34,197,94,0.10)",
                    color: "#166534",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: { xs: 30, md: 36 },
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    mb: 1,
                  }}
                >
                  Sign in
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Access your personalized dashboard and continue where you left off.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        autoComplete="email"
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        autoComplete="current-password"
                      />
                    )}
                  />

                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                          />
                        }
                        label="Remember me on this device"
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    endIcon={
                      loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardRoundedIcon />
                    }
                    sx={{
                      mt: 1,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 800,
                      boxShadow: "none",
                    }}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Stack>
              </form>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Don’t have an account?{" "}
                <Box
                  component={RouterLink}
                  to="/getstarted"
                  sx={{
                    color: "#166534",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
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