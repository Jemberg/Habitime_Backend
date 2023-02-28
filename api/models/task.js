const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completionDate: {
    type: Date,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: Number,
    default: 3,
  },
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
