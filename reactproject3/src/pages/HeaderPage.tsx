import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import headpicture from "../assets/outsidePicture.png";

const HeaderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="img"
          src={headpicture}
          alt="Outside"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -3,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.48) 100%)",
            zIndex: -2,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 55%)",
            zIndex: -1,
          }}
        />

        <Box
          sx={{
            px: { xs: 2, md: 4 },
            pt: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              mx: "auto",
              px: { xs: 2, md: 2.5 },
              py: 1.5,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backdropFilter: "blur(14px)",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
           
                <WbSunnyRoundedIcon sx={{ color: "#fde047", fontSize: 22 }} />
              

              <Box>
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: 22,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  TouchGrass
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 12,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Vitamin D wellness tracker
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 999,
                  px: 2.5,
                }}
              >
                Login
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/getstarted")}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  borderRadius: 999,
                  px: 3,
                  py: 1.1,
                  bgcolor: "#22c55e",
                  boxShadow: "0 10px 24px rgba(34,197,94,0.28)",
                  "&:hover": {
                    bgcolor: "#16a34a",
                    boxShadow: "0 14px 28px rgba(34,197,94,0.34)",
                  },
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 920,
              textAlign: "center",
              px: { xs: 2.5, md: 5 },
              py: { xs: 4, md: 5 },
              borderRadius: 6,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(12,18,28,0.22)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            }}
          >
            {/* <Typography
              sx={{
                mb: 2.5,
                borderRadius: 999,
                fontWeight: 800,
                color: "white",
              }}
            >
              Personalized sunlight + vitamin D guidance
            </Typography> */}

            <Typography
              sx={{
                fontSize: { xs: 42, sm: 58, md: 76 },
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "white",
                mb: 2,
              }}
            >
              Optimize your vitamin D.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 18, md: 22 },
                color: "rgba(255,255,255,0.86)",
                maxWidth: 760,
                mx: "auto",
                lineHeight: 1.5,
                mb: 4,
              }}
            >
              Track sunlight, monitor intake, and get personalized
              recommendations in a dashboard that actually feels useful.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.75}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/getstarted")}
                sx={{
                  minWidth: 220,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 16,
                  borderRadius: 999,
                  px: 4,
                  py: 1.45,
                  bgcolor: "#22c55e",
                  boxShadow: "0 10px 24px rgba(34,197,94,0.28)",
                  "&:hover": {
                    bgcolor: "#16a34a",
                  },
                }}
              >
                Start Tracking
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  minWidth: 180,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 999,
                  px: 4,
                  py: 1.45,
                  color: "white",
                  borderColor: "rgba(255,255,255,0.42)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Login
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              justifyContent="center"
              sx={{ mt: 3 }}
            >
              <Typography sx={{ color: "rgba(255,255,255,0.74)", fontSize: 14 }}>
                Personalized recommendations
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.42)", display: { xs: "none", sm: "block" } }}>
                •
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.74)", fontSize: 14 }}>
                Clean dashboard insights
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.42)", display: { xs: "none", sm: "block" } }}>
                •
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.74)", fontSize: 14 }}>
                Built for daily habits
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", pb: 3 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 15 }}>
            
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderPage;