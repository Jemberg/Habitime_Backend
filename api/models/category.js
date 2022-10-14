const mongoose = require("mongoose");
const validator = require("validator");
const Task = require("./task");
const Habit = require("./habit");
const Periodical = require("./periodical");

const categorySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    default: "#ff0000",
    validate(value) {
      if (!validator.isHexColor(value)) {
        throw new Error("Invalid HEX color provided.");
      }
    },
  },
});

// Delete user tasks when user is removed.
categorySchema.pre("remove", async function (next) {
  const category = this;

  // Removes deleted category from all tasks that have it.
  await Task.updateMany({ category: category.name }, { category: undefined });
  await Habit.updateMany({ category: category.name }, { category: undefined });
  await Periodical.updateMany(
    { category: category.name },
    { category: undefined }
  );

  next();
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
