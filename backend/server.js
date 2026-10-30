require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const db = require("./database");

const app = express();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
}

app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5500")
  .split(",")
  .map(origin => origin.trim());

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (e.g. curl/Postman) are allowed.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  credentials: true
}));

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", api: "CineIT", database: "connected" });
  } catch (error) {
    console.error("Health check database error:", error.message);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  if (err.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({ message: "This frontend origin is not allowed." });
  }
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`CineIT API listening at http://localhost:${PORT}`);
});