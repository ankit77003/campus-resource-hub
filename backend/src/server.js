require("dotenv").config();


const fs = require("fs");
const path = require("path");
const { app } = require("./app");
const { connectDb } = require("./db");

async function main() {
  const port = Number(process.env.PORT || 4001);
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment.");
    process.exit(1);
  }

  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const absUploadDir = path.join(process.cwd(), uploadDir);
  fs.mkdirSync(absUploadDir, { recursive: true });

  await connectDb();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

