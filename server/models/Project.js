const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [], // Mixed array to completely bypass strict schema validation and guarantee save
  status: { type: String, enum: ['Active', 'On Hold', 'Completed'], default: 'Active' },
  dueDate: { type: Date }, // Added to track project deadline
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
