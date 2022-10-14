const express = require("express");
const moment = require("moment"); // require
moment().format();

const Habit = require("../models/habit");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

// Get all habits.
router.get("/habits", auth, async (request, response) => {
  try {
    let habits = await Habit.find({ createdBy: request.user._id });

    for (let habit of habits) {
      if (habit.nextReset < new Date()) {
        let nextReset = moment().utc().toDate();
        switch (habit.resetFrequency) {
          case "Monthly":
            nextReset = moment()
              .utc()
              .startOf("month")
              .add(1, "month")
              .toDate();
            break;
          case "Weekly":
            nextReset = moment()
              .utc()
              .startOf("isoWeek")
              .add(1, "week")
              .toDate();
            break;
          case "Daily":
            nextReset = moment().utc().startOf("day").add(1, "day").toDate();
            break;
          default:
            break;
        }

        await Habit.findByIdAndUpdate(habit.id, {
          counter: 0,
          nextReset: nextReset,
        }).exec();
      }
    }

    const checkedHabits = await Habit.find({
      createdBy: request.user._id,
    });

    response.status(200).send({ habits: checkedHabits });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// Creating habit.
router.post("/habits", auth, async (request, response) => {
  const habit = new Habit({
    ...request.body,
    createdBy: request.user._id,
  });

  try {
    await habit.save();
    response.status(201).send({ habit: habit });
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
});

// Updating habit.
router.patch("/habits/:id", auth, async (request, response) => {
  const requestedUpdates = Object.keys(request.body);

  const allowedUpdates = [
    "category",
    "name",
    "description",
    "priority",
    "counter",
    "goal",
    "resetFrequency",
    "nextReset",
  ];

  switch (request.body.resetFrequency) {
    case "Monthly":
      request.body.nextReset = moment()
        .utc()
        .startOf("month")
        .add(1, "month")
        .toDate();
      break;
    case "Weekly":
      request.body.nextReset = moment()
        .utc()
        .startOf("isoWeek")
        .add(1, "week")
        .toDate();
      break;
    case "Daily":
      request.body.nextReset = moment()
        .utc()
        .startOf("day")
        .add(1, "day")
        .toDate();
      break;
    default:
      break;
  }

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return response.status(400).send({ error: "Updates not permitted." });
  }

  try {
    const habit = await Habit.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (request.body.counter === habit.goal) {
      const user = await User.findById(request.user._id);

      user.doneHabits++;
      user.save();
    }

    if (!habit) {
      return response.status(404).send({ error: "Habit not found." });
    }

    if (request.body.nextReset) {
      habit["nextReset"] = request.body.nextReset;
      await habit.save();
    }

    requestedUpdates.forEach((update) => {
      habit[update] = request.body[update];
    });

    await habit.save();

    response.status(200).send({ habit: habit });
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
});

// Deleting habit.
router.delete("/habits/:id", auth, async (request, response) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!habit) {
      return response.status(404).send({ error: "Habit was not found." });
    }

    response.status(200).send({ habit: habit });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

module.exports = router;
