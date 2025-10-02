import React from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  Switch,
  Snackbar,
  Alert,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const Process = ({ images = [] }) => {
  const [resizeWidth, setResizeWidth] = React.useState(400);
  const [resizeHeight, setResizeHeight] = React.useState(300);
  const [grayscale, setGrayscale] = React.useState(false);
  const [rotate, setRotate] = React.useState(0);
  const [flipH, setFlipH] = React.useState(false);
  const [flipV, setFlipV] = React.useState(false);
  const [brightness, setBrightness] = React.useState(0);
  const [contrast, setContrast] = React.useState(0);
  const [invert, setInvert] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [processedImages, setProcessedImages] = React.useState([]);

  const handleProcess = async () => {
    if (!images.length) return;

    setLoading(true);
    setError("");
    setProcessedImages([]);

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img.file));

      const operations = [
        {
          type: "resize",
          params: { width: resizeWidth, height: resizeHeight },
        },
        { type: "rotate", params: { angle: rotate } },
        { type: "flip", params: { horizontal: flipH, vertical: flipV } },
        { type: "brightness", params: { value: brightness } },
        { type: "contrast", params: { value: contrast } },
      ];
      if (grayscale) operations.push({ type: "grayscale", params: {} });
      if (invert) operations.push({ type: "invert", params: {} });

      formData.append("operations", JSON.stringify(operations));

      const res = await fetch("http://localhost:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Processing failed");

      const data = await res.json();
      setProcessedImages(data.images);
    } catch (err) {
      console.error(err);
      setError("Processing failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        color: "#000",
        px: 2,
        mt: -5,
      }}
    >
      <Stack
        spacing={4}
        alignItems="center"
        sx={{ width: "100%", maxWidth: 600 }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
        >
          <ImageIcon sx={{ mr: 1 }} />
          Image Processor
        </Typography>

        <Card
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 3,
            boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              {/* Resize Width */}
              <Box>
                <Typography
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TuneIcon sx={{ mr: 1 }} />
                  Resize Width: {resizeWidth}px
                </Typography>
                <Slider
                  value={resizeWidth}
                  min={50}
                  max={2000}
                  onChange={(e, val) => setResizeWidth(val)}
                  valueLabelDisplay="auto"
                  sx={{ color: "#000" }}
                />
              </Box>

              {/* Resize Height */}
              <Box>
                <Typography
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TuneIcon sx={{ mr: 1 }} />
                  Resize Height: {resizeHeight}px
                </Typography>
                <Slider
                  value={resizeHeight}
                  min={50}
                  max={2000}
                  onChange={(e, val) => setResizeHeight(val)}
                  valueLabelDisplay="auto"
                  sx={{ color: "#000" }}
                />
              </Box>

              {/* Rotate */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Rotate</InputLabel>
                  <Select
                    value={rotate}
                    onChange={(e) => setRotate(parseInt(e.target.value))}
                  >
                    <MenuItem value={0}>0°</MenuItem>
                    <MenuItem value={90}>90°</MenuItem>
                    <MenuItem value={180}>180°</MenuItem>
                    <MenuItem value={270}>270°</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Flip */}
              <Box display="flex" alignItems="center">
                <Typography sx={{ mr: 2 }}>Flip Horizontal</Typography>
                <Switch
                  checked={flipH}
                  onChange={(e) => setFlipH(e.target.checked)}
                  color="default"
                />
                <Typography sx={{ mx: 2 }}>Flip Vertical</Typography>
                <Switch
                  checked={flipV}
                  onChange={(e) => setFlipV(e.target.checked)}
                  color="default"
                />
              </Box>

              {/* Brightness */}
              <Box>
                <Typography gutterBottom sx={{ fontWeight: 500 }}>
                  Brightness: {brightness}
                </Typography>
                <Slider
                  value={brightness}
                  min={-100}
                  max={100}
                  onChange={(e, val) => setBrightness(val)}
                  valueLabelDisplay="auto"
                  sx={{ color: "#000" }}
                />
              </Box>

              {/* Contrast */}
              <Box>
                <Typography gutterBottom sx={{ fontWeight: 500 }}>
                  Contrast: {contrast}
                </Typography>
                <Slider
                  value={contrast}
                  min={-100}
                  max={100}
                  onChange={(e, val) => setContrast(val)}
                  valueLabelDisplay="auto"
                  sx={{ color: "#000" }}
                />
              </Box>

              {/* Grayscale */}
              <Box display="flex" alignItems="center">
                <ColorLensIcon sx={{ mr: 1 }} />
                <Typography gutterBottom sx={{ mr: 2, fontWeight: 500 }}>
                  Grayscale
                </Typography>
                <Switch
                  checked={grayscale}
                  onChange={(e) => setGrayscale(e.target.checked)}
                  color="default"
                />
              </Box>

              {/* Invert */}
              <Box display="flex" alignItems="center">
                <Typography gutterBottom sx={{ mr: 2, fontWeight: 500 }}>
                  Invert Colors
                </Typography>
                <Switch
                  checked={invert}
                  onChange={(e) => setInvert(e.target.checked)}
                  color="default"
                />
              </Box>

              {/* Process Button */}
              <Button
                variant="contained"
                onClick={handleProcess}
                disabled={loading || !images.length}
                sx={{
                  mt: 2,
                  backgroundColor: "#000",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#333" },
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                {loading ? "Processing..." : `Process ${images.length} Images`}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Download Processed Images */}
        {processedImages.length > 0 && (
          <Stack spacing={2} sx={{ mt: 4, width: "100%" }}>
            {/* Removed individual downloads */}

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1e40af",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1e3a8a" },
                borderRadius: 2,
                py: 1.5,
              }}
              onClick={() =>
                window.open("http://localhost:5000/download-all", "_blank")
              }
            >
              Download All as ZIP
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Process;
