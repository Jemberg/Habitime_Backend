const mongoose = require("mongoose");
const moment = require("moment"); // require
const { utc } = require("moment");
moment().format();

const periodicalSchema = new mongoose.Schema({
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
    default: new Date(),
  },
  completed: {
    type: Boolean,
    default: false,
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
  frequency: {
    type: String,
    default: "Daily",
  },
  nextDueDate: {
    type: Date,
    default: getNextDay().setHours(0, 0, 0, 0),
  },
});

// Gets next day.
function getNextDay() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

const Periodical = mongoose.model("periodical", periodicalSchema);

module.exports = Periodical;
