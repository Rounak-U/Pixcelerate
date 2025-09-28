import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Material UI Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import MemoryIcon from "@mui/icons-material/Memory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SpeedIcon from "@mui/icons-material/Speed";
import CalculateIcon from "@mui/icons-material/Calculate";
import GavelIcon from "@mui/icons-material/Gavel";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

// --- Theme Setup ---
const theme = createTheme({
  palette: {
    primary: { main: "#1a1a1a" },
    secondary: { main: "#545454" },
    background: { default: "#f9f9f9", paper: "#ffffff" },
    error: { main: "#c94a4a" },
    warning: { main: "#e09341" },
    info: { main: "#41a3e0" },
    success: { main: "#41a041" },
    text: { primary: "#1a1a1a", secondary: "#4a4a4a" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

// --- Styled Metric Card ---
const MetricCard = styled(Card)(({ theme, bgcolor }) => ({
  flex: 1,
  padding: theme.spacing(3),
  textAlign: "center",
  color: "white",
  backgroundColor: bgcolor,
  borderRadius: 10,
  boxShadow: `0 6px 12px ${bgcolor}70`,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 12px 20px ${bgcolor}80`,
  },
  minWidth: 150,
}));

// --- Sample Data (replace with dynamic fetch) ---
const sampleData = {
  sequentialTime: 3.2,
  parallelTime: 1.23,
  speedupFactor: 2.61,
  cpuUsage: 48.48,
  memoryUsage: 77,
  efficiency: 0.65,
  parallelizableFraction: 0.9,
  cores: 4,
};

// --- Helper Functions ---
const getSpeedupBadge = (speedup) => {
  if (speedup >= 3) return { color: "success", text: "Excellent" };
  if (speedup >= 2) return { color: "primary", text: "Good" };
  if (speedup >= 1.5) return { color: "warning", text: "Fair" };
  return { color: "error", text: "Poor" };
};

const getProgressColor = (usage) => {
  if (usage > 85) return "error";
  if (usage > 65) return "warning";
  return "primary";
};

// --- Main Component ---
const Metrics = () => {
  const [activeTab, setActiveTab] = useState("Speedup Factor");
  const data = sampleData;
  const speedupBadge = getSpeedupBadge(data.speedupFactor);
  const speedupPercentage = ((data.speedupFactor - 1) * 100).toFixed(0);

  const p = data.parallelizableFraction;
  const n = data.cores;
  const maxSpeedup = 1 / (1 - p + p / n);

  const cpuColor = getProgressColor(data.cpuUsage);
  const memoryColor = getProgressColor(data.memoryUsage);

  // --- Render Theory Content ---
  const renderTheoryContent = () => {
    switch (activeTab) {
      case "Speedup Factor":
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 2, border: "2px solid", borderColor: "primary.main" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalculateIcon color="primary" />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Speedup Formula
                </Typography>
              </Stack>
              <Typography sx={{ mt: 1, fontSize: "1.3rem", fontWeight: "bold" }}>
                S = T_sequential / T_parallel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Measures performance improvement using parallelization.
              </Typography>
            </Paper>
          </Stack>
        );
      case "Amdahl's Law":
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 2, border: "2px solid", borderColor: "secondary.main" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <GavelIcon color="secondary" />
                <Typography variant="h6" fontWeight="bold">
                  The Limit of Parallelism
                </Typography>
              </Stack>
              <Typography sx={{ mt: 1, fontSize: "1.3rem", fontWeight: "bold" }}>
                S_max = 1 / ((1-P) + P / N)
              </Typography>
              <Typography variant="body1">
                Maximum speedup limited by sequential fraction.
              </Typography>
              <Typography variant="subtitle1" mt={2}>
                Max Theoretical Speedup:{" "}
                <Chip
                  label={`${maxSpeedup.toFixed(2)}x`}
                  color="primary"
                  variant="outlined"
                  size="medium"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Paper>
          </Stack>
        );
      case "Efficiency":
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 2, border: "2px solid", borderColor: "primary.main" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SpeedIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Efficiency (E)
                </Typography>
              </Stack>
              <Typography sx={{ mt: 1, fontSize: "1.3rem", fontWeight: "bold" }}>
                E = Speedup / N
              </Typography>
              <Typography variant="body1">
                Efficiency measures processor utilization.
              </Typography>
              <Typography variant="h6" mt={2}>
                Current Efficiency:{" "}
                <Chip
                  label={data.efficiency.toFixed(2)}
                  color={data.efficiency >= 0.7 ? "success" : data.efficiency >= 0.5 ? "warning" : "error"}
                  size="medium"
                  sx={{ ml: 1, fontWeight: "bold" }}
                />
              </Typography>
            </Paper>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {/* Left Panel */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 2, height: "100%" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Current Performance Metrics
                    </Typography>
                  </Stack>
                  <Chip label={`Using ${data.cores} Cores`} size="medium" color="secondary" variant="outlined" />
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={4}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <MetricCard bgcolor={theme.palette.primary.main}>
                      <AccessTimeIcon sx={{ fontSize: 28 }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Sequential Time
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {data.sequentialTime.toFixed(2)}s
                      </Typography>
                    </MetricCard>
                    <MetricCard bgcolor={theme.palette.secondary.main}>
                      <SpeedIcon sx={{ fontSize: 28 }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Parallel Time
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {data.parallelTime.toFixed(2)}s
                      </Typography>
                    </MetricCard>
                  </Stack>
                  <Divider />
                  <Stack spacing={2}>
                    <Typography variant="h6">Speedup Factor (S)</Typography>
                    <Typography variant="h2" fontWeight="extrabold" color="primary">
                      {data.speedupFactor.toFixed(2)}x
                    </Typography>
                    <Chip label={speedupBadge.text} color={speedupBadge.color} size="medium" sx={{ fontWeight: "bold" }} />
                  </Stack>
                  <Divider />
                  <Stack spacing={2}>
                    <Typography variant="h6">Resource Utilization</Typography>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <SettingsInputComponentIcon sx={{ fontSize: 18 }} color={cpuColor} />
                          <Typography>CPU Usage</Typography>
                        </Stack>
                        <Typography fontWeight="bold">{data.cpuUsage.toFixed(2)}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={Math.min(data.cpuUsage, 100)} color={cpuColor} />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <MemoryIcon sx={{ fontSize: 18 }} color={memoryColor} />
                          <Typography>Memory Usage</Typography>
                        </Stack>
                        <Typography fontWeight="bold">{data.memoryUsage}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={Math.min(data.memoryUsage, 100)} color={memoryColor} />
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel */}
          <Grid item xs={12} md="auto">
            <Card sx={{ p: 2, height: "100%", width: 800, minWidth: 400 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Parallel Computing Theory
                    </Typography>
                  </Stack>
                  <Chip label="Educational Insights" color="secondary" variant="outlined" size="medium" />
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                  {["Speedup Factor", "Amdahl's Law", "Efficiency"].map((tab) => (
                    <Chip
                      key={tab}
                      label={tab}
                      clickable
                      color={activeTab === tab ? "primary" : "default"}
                      variant={activeTab === tab ? "filled" : "outlined"}
                      size="medium"
                      onClick={() => setActiveTab(tab)}
                      sx={{ mb: 1, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ minHeight: 400 }}>{renderTheoryContent()}</Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Metrics;
