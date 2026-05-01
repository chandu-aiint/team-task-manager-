const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ GLOBAL SYSTEM RESET (Top Level - Guaranteed to work)
app.post("/api/system-reset", (req, res) => {
  global.demoProjects = [];
  global.demoTasks = [];
  console.log("🧹 GLOBAL SYSTEM RESET EXECUTED");
  res.json({ msg: "System Reset Successful" });
});

// Routes Imports
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ethara", {
  serverSelectionTimeoutMS: 2000,
}).then(() => {
  console.log("✅ MongoDB Connected Successfully");
}).catch(err => {
  console.log("⚠️  Database offline. Continuing in HIGH-PERFORMANCE DEMO MODE.");
});
