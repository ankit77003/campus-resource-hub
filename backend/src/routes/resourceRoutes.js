const express = require("express");
const multer = require("multer");
const path = require("path");
const { requireAuth } = require("../middleware/requireAuth");
const {
  uploadResource,
  listResources,
  searchResources,
  getResource,
  downloadResource,
  viewResource,
  voteResource,
} = require("../controllers/resourceController");

function ensureUploadDir() {
  const dir = process.env.UPLOAD_DIR || "uploads";
  return path.join(process.cwd(), dir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ensureUploadDir()),
  filename: (req, file, cb) => {
    const safeBase = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = path.extname(file.originalname);
    cb(null, safeBase + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

const router = express.Router();

router.get("/", listResources);
router.get("/search", searchResources);
router.get("/:id", getResource);
router.get("/:id/download", downloadResource);
router.get("/:id/view", viewResource);

router.post("/", requireAuth, upload.single("file"), uploadResource);
router.post("/:id/vote", requireAuth, voteResource);

module.exports = { resourceRoutes: router };