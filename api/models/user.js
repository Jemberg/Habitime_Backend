require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const Task = require("./task");
const Habit = require("./habit");
const Periodical = require("./periodical");
const Category = require("./category");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error("Password is too short, has to be at least 7 symbols.");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email.");
      }
    },
  },
  createdIn: {
    type: Date,
    default: new Date(),
  },
  updatedIn: {
    type: Date,
    default: new Date(),
  },
  lastLogin: {
    type: Date,
    default: new Date(),
  },
  doneTasks: {
    type: Number,
    default: 0,
    min: 0,
  },
  doneRecurring: {
    type: Number,
    default: 0,
    min: 0,
  },
  doneHabits: {
    type: Number,
    default: 0,
    min: 0,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Sanitizes user object so response does not contain sensitive info.
// https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
userSchema.methods.toJSON = function () {
  const sanitizedOutput = this.toObject();

  delete sanitizedOutput.password;
  delete sanitizedOutput.tokens;

  return sanitizedOutput;
};

// Generates authentication token.
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    `${process.env.JWT_SECRET}`
  );

  this.tokens = this.tokens.concat({
    token: token,
  });

  await this.save();

  return token;
};

// Resets all user statistics.
userSchema.statics.resetStats = async () => {
  await User.updateMany(
    {},
    {
      doneTasks: 0,
      doneRecurring: 0,
      doneHabits: 0,
    }
  );
  console.log("All user statistics set to 0.");
};

// Finds user by credentials.
userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username: username });

  if (!user) {
    throw new Error("Login details invalid.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Login details invalid.");
  }

  return user;
};

// Check if password is hashed before saving.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Before removing user object, removes all it's tasks.
userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ createdBy: this._id });
  await Periodical.deleteMany({ createdBy: this._id });
  await Habit.deleteMany({ createdBy: this._id });
  await Category.deleteMany({ createdBy: this._id });
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
