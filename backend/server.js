const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));

["uploads", "processed"].forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir); });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage }).array("images");

app.use(express.json());
app.use("/processed", express.static(path.join(__dirname, "processed")));

app.post("/process", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const files = req.files;
    const { operations } = req.body;
    if (!files || !operations) return res.status(400).json({ error: "No files or operations" });

    const ops = JSON.stringify(JSON.parse(operations));
    const args = [files.length, ops, ...files.map(f => path.resolve(f.path))];

    const cpp = spawn("./image_processor.exe", args);

    let stdoutData = "", stderrData = "";

    cpp.stdout.on("data", (data) => { stdoutData += data.toString(); });
    cpp.stderr.on("data", (data) => { stderrData += data.toString(); console.error("C++ Error:", data.toString()); });

    cpp.on("close", (code) => {
      if (code !== 0) return res.status(500).json({ error: "C++ process failed", details: stderrData });

      // Parse sequential and parallel times
      const seqMatch = stdoutData.match(/TIME_SEQ=(.*)/);
      const parMatch = stdoutData.match(/TIME_PAR=(.*)/);
      const seqTime = seqMatch ? parseFloat(seqMatch[1]) : null;
      const parTime = parMatch ? parseFloat(parMatch[1]) : null;

      // Calculate speedup and efficiency
      const speedup = (seqTime && parTime) ? (seqTime / parTime) : null;
      const numThreads = require("os").cpus().length; // use CPU cores
      const efficiency = speedup ? (speedup / numThreads) : null;

      // Extract processed image paths
      const outputPaths = stdoutData
        .split("\n")
        .filter(line => line && !line.startsWith("TIME_SEQ") && !line.startsWith("TIME_PAR"));

      const urls = outputPaths.map(p => ({
        name: path.basename(p),
        url: "/" + path.relative(__dirname, p).replace(/\\/g, "/"),
      }));

      console.log(`Processed ${urls.length} images`);
      console.log(`Sequential Time: ${seqTime}s, Parallel Time: ${parTime}s`);
      if (speedup) console.log(`Speedup: ${speedup.toFixed(2)}x`);
      if (efficiency) console.log(`Efficiency: ${(efficiency * 100).toFixed(1)}%`);

      res.json({
        images: urls,
        sequentialTime: seqTime,
        parallelTime: parTime,
        speedup: speedup ? speedup.toFixed(2) : null,
        efficiency: efficiency ? (efficiency * 100).toFixed(1) : null
      });

      // Cleanup uploaded files
      files.forEach(f => fs.unlinkSync(f.path));
    });
  });
});

app.get("/download-all", (req, res) => {
  const zipName = "all_processed.zip";
  res.setHeader("Content-Disposition", `attachment; filename=${zipName}`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);
  fs.readdirSync("processed").forEach(file => archive.file(path.join("processed", file), { name: file }));
  archive.finalize();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
