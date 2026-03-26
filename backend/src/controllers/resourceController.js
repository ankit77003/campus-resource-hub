const path = require("path");
const fs = require("fs");
const { z } = require("zod");
const { Resource, RESOURCE_TYPES } = require("../models/Resource");

const uploadSchema = z.object({
  title: z.string().min(1).max(200),
  subject: z.string().min(1).max(80),
  semester: z.coerce.number().int().min(1).max(12),
  type: z.enum(RESOURCE_TYPES),
});

async function uploadResource(req, res) {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  if (!req.file) return res.status(400).json({ error: "File is required" });

  const created = await Resource.create({
    ...parsed.data,
    filePath: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploader: req.user.id,
  });

  return res.status(201).json({ resource: created });
}

async function listResources(req, res) {
  const subject = req.query.subject?.toString();
  const type = req.query.type?.toString();
  const semester = req.query.semester ? Number(req.query.semester) : undefined;

  const filter = {};
  if (subject) filter.subject = subject;
  if (type) filter.type = type;
  if (Number.isFinite(semester)) filter.semester = semester;

  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .select("-voteByUser");

  return res.json({ resources });
}

async function searchResources(req, res) {
  const q = (req.query.q || "").toString().trim();
  if (!q) return res.json({ resources: [] });

  const resources = await Resource.find({ $text: { $search: q } })
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .limit(50)
    .select("-voteByUser");

  return res.json({ resources });
}

async function getResource(req, res) {
  const resource = await Resource.findById(req.params.id).select("-voteByUser");
  if (!resource) return res.status(404).json({ error: "Not found" });
  return res.json({ resource });
}

function resolveUploadPath(filename) {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  return path.join(process.cwd(), uploadDir, filename);
}

async function downloadResource(req, res) {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Not found" });

  const fullPath = resolveUploadPath(resource.filePath);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: "File missing on server" });

  // Set proper headers for download
  res.setHeader("Content-Disposition", `attachment; filename="${resource.originalName}"`);
  res.setHeader("Content-Type", resource.mimeType);
  res.download(fullPath, resource.originalName);
}

async function viewResource(req, res) {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Not found" });

  const fullPath = resolveUploadPath(resource.filePath);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: "File missing on server" });

  // Set proper headers for viewing
  res.setHeader("Content-Type", resource.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${resource.originalName}"`);
  return fs.createReadStream(fullPath).pipe(res);
}

const voteSchema = z.object({
  direction: z.enum(["up", "down"]),
});

async function voteResource(req, res) {
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Not found" });

  const userId = req.user.id;
  const prev = resource.voteByUser?.get(userId) || null;
  const next = parsed.data.direction;

  if (prev === next) {
    return res.json({ resource: { id: resource._id.toString(), upvotes: resource.upvotes, downvotes: resource.downvotes } });
  }

  if (prev === "up") resource.upvotes = Math.max(0, resource.upvotes - 1);
  if (prev === "down") resource.downvotes = Math.max(0, resource.downvotes - 1);

  if (next === "up") resource.upvotes += 1;
  if (next === "down") resource.downvotes += 1;
  resource.voteByUser.set(userId, next);

  await resource.save();
  return res.json({ resource: { id: resource._id.toString(), upvotes: resource.upvotes, downvotes: resource.downvotes } });
}

module.exports = {
  uploadResource,
  listResources,
  searchResources,
  getResource,
  downloadResource,
  viewResource,
  voteResource,
};
