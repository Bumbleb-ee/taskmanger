const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();
const taskRoutes = require("./routes/taskRoutes");

// Global middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
module.exports = app;