const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// Shared In-Memory storage for Demo Mode
global.demoUsers = global.demoUsers || [];

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.create({ name, email, password: hashedPassword, role });
      return res.status(201).json(user);
    } else {
      // Demo Mode Fallback
      const newUser = { _id: Date.now().toString(), name, email, password: hashedPassword, role };
      global.demoUsers.push(newUser);
      return res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = global.demoUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "secret123"
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
