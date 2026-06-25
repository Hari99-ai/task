const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const recommendationRoutes = require("./routes/recommendation");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: false,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "product-recommendation-backend" });
});

app.use("/", recommendationRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong while processing the request.",
  });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
