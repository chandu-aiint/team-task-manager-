const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const { protect, isAdmin } = require("../middleware/auth");

const router = express.Router();

// 🛡️ SYSTEM RESET (Absolute Priority - No Auth Required for Demo)
router.post("/admin/wipe/now", (req, res) => {
  global.demoProjects = [];
  global.demoTasks = [];
  console.log("🧹 System Memory Wiped by Admin Request");
  res.json({ msg: "System Reset Successful" });
});

// Create - Admin Only
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    let { name, description, dueDate, members } = req.body;
    
    // Ensure all manual members get a pseudo ObjectId so tasks can be assigned to them
    members = (members || []).map(m => ({
      ...m,
      user: m.user || new mongoose.Types.ObjectId().toString()
    }));

    // Backend Validation for Roles
    const teamLeads = members.filter(m => m.role === 'Team Lead').length;
    const managers = members.filter(m => m.role === 'Manager').length;

    if (teamLeads !== 1) return res.status(400).json({ error: "Project must have exactly 1 Team Lead." });
    if (managers !== 1) return res.status(400).json({ error: "Project must have exactly 1 Manager." });

    const newId = new mongoose.Types.ObjectId().toString();
    const projectData = { 
      _id: newId, name, description, dueDate, 
      owner: req.user.id, 
      createdAt: new Date(), 
      members, 
      progress: 0, 
      status: 'Active'
    };

    if (mongoose.connection.readyState === 1) {
      // Use explicit fields - DO NOT spread req.body as it causes members to be overwritten
      const project = await Project.create(projectData);
      return res.status(201).json(project);
    } else {
      global.demoProjects = global.demoProjects || [];
      global.demoProjects.unshift(projectData);
      return res.status(201).json(projectData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get
router.get("/", protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const projects = await Project.find();
      return res.json(projects);
    } else {
      return res.json(global.demoProjects || []);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get One
router.get("/:id", protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(req.params.id);
      if (project) return res.json(project);
      
      // Fallback: If DB is connected but project not found, check Demo Mode memory
      // (This happens if a project was created while DB was temporarily offline)
      const demoProject = (global.demoProjects || []).find(p => String(p._id) === req.params.id);
      if (demoProject) return res.json(demoProject);

      return res.status(404).json({ error: "Project not found" });
    } else {
      const project = (global.demoProjects || []).find(p => String(p._id) === req.params.id);
      if (!project) return res.status(404).json({ error: "Project not found" });
      return res.json(project);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
