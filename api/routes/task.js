const express = require("express");

const Task = require("../models/task");
const User = require("../models/user");

const auth = require("../middleware/auth");

const router = new express.Router();

// Get all tasks.
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });

    res.status(200).send({ tasks: tasks });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Create task.
router.post("/tasks", auth, async (request, response) => {
  const task = new Task({
    name: request.body.name,
    createdBy: request.user._id,
  });

  try {
    await task.save();
    response.status(201).send({ task: task });
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
});

// Edit task.
router.patch("/tasks/:id", auth, async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const allowedUpdates = [
    "category",
    "dueDate",
    "completed",
    "name",
    "description",
    "priority",
  ];

  if (req.body.completed) {
    const user = await User.findById(req.user._id);

    user.doneTasks++;
    user.save();
  }

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return res.status(400).send({ error: "Updates not permitted." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Task has not been found." });
    }

    requestedUpdates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send({ task: task });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete task.
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Task has not been found." });
    }

    res.send({ task: task });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
