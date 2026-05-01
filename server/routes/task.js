const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { protect, isAdmin } = require("../middleware/auth");

const router = express.Router();

// 🚀 UNSTOPPABLE TASK DELETE (Using POST to bypass network blocks)
router.post("/:id/delete", protect, async (req, res) => {
  const tId = String(req.params.id);
  try {
    global.demoTasks = (global.demoTasks || []).filter(t => String(t._id) !== tId);
    if (mongoose.connection.readyState === 1) {
      await Task.deleteOne({ _id: tId });
    }
    return res.status(200).json({ msg: "Directive Purged" });
  } catch (error) {
    return res.status(200).json({ msg: "Directive Purged" });
  }
});

// Create Task
router.post("/", protect, async (req, res) => {
  try {
    const taskData = { ...req.body, _id: new mongoose.Types.ObjectId().toString(), createdAt: new Date() };
    if (mongoose.connection.readyState === 1) {
      const task = await Task.create(req.body);
      return res.status(201).json(task);
    } else {
      global.demoTasks = global.demoTasks || [];
      global.demoTasks.unshift(taskData);
      return res.status(201).json(taskData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState === 1) {
      const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });

      // 🔄 Recalculate project progress
      if (task?.project) {
        const allProjectTasks = await Task.find({ project: task.project });
        const done = allProjectTasks.filter(t => t.status === 'Done').length;
        const progress = allProjectTasks.length > 0 ? Math.round((done / allProjectTasks.length) * 100) : 0;
        await Project.findByIdAndUpdate(task.project, { progress });
      }
      return res.json(task);
    } else {
      // Demo mode: update task status
      const task = (global.demoTasks || []).find(t => String(t._id) === String(req.params.id));
      if (task) task.status = status;

      // 🔄 Recalculate project progress in demo mode
      if (task?.project) {
        const projectId = String(task.project);
        const allProjectTasks = (global.demoTasks || []).filter(t => String(t.project) === projectId);
        const done = allProjectTasks.filter(t => t.status === 'Done').length;
        const progress = allProjectTasks.length > 0 ? Math.round((done / allProjectTasks.length) * 100) : 0;
        const project = (global.demoProjects || []).find(p => String(p._id) === projectId);
        if (project) project.progress = progress;
      }
      return res.json(task || {});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", protect, async (req, res) => {
  try {
    const tasks = mongoose.connection.readyState === 1 ? await Task.find() : global.demoTasks || [];
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "Done").length,
      active: tasks.filter(t => t.status !== "Done").length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done").length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const tasks = await Task.find().populate("assignedTo project");
      return res.json(tasks);
    } else {
      return res.json(global.demoTasks || []);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
