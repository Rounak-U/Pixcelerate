const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Setup ---
const allowedOrigins = [
  // local dev
  "https://pixcelerate.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  })
);

// --- Ensure directories exist ---
["uploads", "processed"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage }).array("images");

app.use(express.json());
app.use("/processed", express.static(path.join(__dirname, "processed")));

// --- Process images ---
app.post("/process", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const files = req.files;
    const { operations } = req.body;
    if (!files || !operations)
      return res.status(400).json({ error: "No files or operations" });

    const ops = JSON.stringify(JSON.parse(operations));
    const args = [files.length, ops, ...files.map((f) => path.resolve(f.path))];

    const cpp = spawn("./image_processor", args);

    let outputPaths = [];
    cpp.stdout.on("data", (data) => {
      outputPaths = data.toString().trim().split("\n");
    });

    cpp.stderr.on("data", (data) =>
      console.error("C++ Error:", data.toString())
    );

    cpp.on("close", (code) => {
      if (code !== 0)
        return res.status(500).json({ error: "C++ process failed" });

      const urls = outputPaths.map((p) => ({
        name: path.basename(p),
        url: `${
          process.env.BACKEND_URL || "https://pixcelerate.onrender.com"
        }/processed/${path.basename(p)}`,
      }));

      res.json({ files: urls }); // ✅ Wrap in 'files' for React

      // Clean uploaded files
      files.forEach((f) => fs.unlinkSync(f.path));
    });
  });
});

// --- Download all processed images ---
app.get("/download-all", (req, res) => {
  const zipName = "all_processed.zip";
  res.setHeader("Content-Disposition", `attachment; filename=${zipName}`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  fs.readdirSync("processed").forEach((file) => {
    archive.file(path.join("processed", file), { name: file });
  });

  archive.finalize();
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
