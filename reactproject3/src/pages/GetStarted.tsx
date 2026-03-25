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
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";

type GetStartedForm = {
  name: string;
  age: number;
  email: string;
  password: string;
  rememberMe: boolean;
};

type GetStartedProps = {
  onRegister: () => void;
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

export default function GetStarted({ onRegister }: GetStartedProps) {
  const { control, handleSubmit } = useForm<GetStartedForm>({
    defaultValues: {
      name: "",
      age: 18,
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: GetStartedForm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Registration failed");
      }

      const user = await response.json();

      if (data.rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      onRegister();
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
            lg: "minmax(0, 1fr) 500px",
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
                    maxWidth: 580,
                  }}
                >
                  Start building a smarter vitamin D routine
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                  Create your account to unlock personalized insights, sunlight
                  tracking, and a cleaner way to monitor daily vitamin D habits.
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
                    <Typography fontWeight={800}>Track daily sunlight</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Build awareness of your outdoor exposure and daily routine.
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
                    <Typography fontWeight={800}>Get personalized guidance</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Recommendations are shaped by your profile and daily intake.
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
                    <TrackChangesRoundedIcon color="primary" />
                    <Typography fontWeight={800}>See progress clearly</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Use dashboard visuals and trends to stay consistent over time.
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
                  icon={<PersonAddRoundedIcon />}
                  label="Create your account"
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
                  Get started
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Set up your TouchGrass account and jump right into your dashboard.
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
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Name"
                        fullWidth
                        required
                        autoComplete="name"
                      />
                    )}
                  />

                  <Controller
                    name="age"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Age"
                        type="number"
                        fullWidth
                        required
                        inputProps={{ min: 13 }}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />

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
                        autoComplete="new-password"
                      />
                    )}
                  />

                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
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
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <ArrowForwardRoundedIcon />
                      )
                    }
                    sx={{
                      mt: 1,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 800,
                      boxShadow: "none",
                    }}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </Stack>
              </form>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Already have an account?{" "}
                <Box
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "#166534",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Login
                </Box>
              </Typography>
            </Stack>
          </CardContent>
        </SurfaceCard>
      </Box>
    </Box>
  );
}