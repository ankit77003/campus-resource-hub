const express = require("express");
const cors = require("cors");

const { authRoutes } = require("./routes/authRoutes");
const { resourceRoutes } = require("./routes/resourceRoutes");

const app = express();
app.use(cors({                       // <-- add this here
    origin: "https://campus-resource-hub-five.vercel.app",
    credentials: true
}));


app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = { app };

