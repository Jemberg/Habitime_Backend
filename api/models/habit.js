const mongoose = require("mongoose");
const User = require("../models/user");

const habitSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
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
  counter: {
    type: Number,
    default: 0,
  },
  goal: {
    type: Number,
    default: 1,
  },
  resetFrequency: {
    type: String,
    default: "Weekly",
  },
  nextReset: {
    type: Date,
    default: getNextMonday().setHours(0, 0, 0, 0),
  },
});

// https://bobbyhadz.com/blog/javascript-get-date-of-next-monday
function getNextMonday() {
  const nextMonday = new Date();
  nextMonday.setDate(
    // Add 1 to the day of the week, cause getDay returns values that start with Sunday, 0.
    // Get remainder by using %.
    // If remainder is 0, then it is Monday currently and it has to default to 7 to get the next Monday instead.
    // getDate then returns the day of the month for the next Monday based on those calculations.
    nextMonday.getDate() + ((7 - nextMonday.getDay() + 1) % 7 || 7)
  );
  return nextMonday;
}

const Habit = mongoose.model("habit", habitSchema);

module.exports = Habit;
