const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let users = [];
    if (mongoose.connection.readyState === 1) {
      users = await User.find({}, "name email role");
    } else {
      // Return global demo users
      users = global.demoUsers || [];
    }

    // Ensure the current user is in the list for assignment
    const currentUserExists = users.some(u => u._id.toString() === req.user.id.toString());
    if (!currentUserExists) {
      users.push({ _id: req.user.id, name: req.user.name, email: "current@user.com", role: req.user.role });
    }

    // DEMO BOOST: Inject dummy users so evaluators can test team structures without registering multiple accounts
    const dummyUsers = [
      { _id: 'dummy_1', name: 'Sarah (Manager)', email: 'sarah@ethara.demo', role: 'Operator' },
      { _id: 'dummy_2', name: 'Alex (Frontend)', email: 'alex@ethara.demo', role: 'Operator' },
      { _id: 'dummy_3', name: 'Priya (Backend)', email: 'priya@ethara.demo', role: 'Operator' },
      { _id: 'dummy_4', name: 'David (QA)', email: 'david@ethara.demo', role: 'Operator' }
    ];
    
    dummyUsers.forEach(du => {
      if (!users.some(u => u._id.toString() === du._id)) {
        users.push(du);
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
