const express = require("express");

const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

// Get user data.
router.get("/users/me", auth, async (req, res) => {
  res.send({ user: req.user });
});

// Create user/registration.
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const usernameCheck = await User.findOne({ username: req.body.username });
    const mailCheck = await User.findOne({ email: req.body.email });

    if (usernameCheck) {
      throw new Error("Username already exists.");
    }

    if (mailCheck) {
      throw new Error("Email already exists.");
    }

    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user: user, token: token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Logging in with existing account.
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );

    user.lastLogin = Date.now();

    const token = await user.generateAuthToken();

    res.status(200).send({
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Log out.
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Log out all active sessions.
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // Removes all tokens that are saved for user.
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Update user.
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["username", "email", "password", "isNotified"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "At least one update is invalid." });
  }

  try {
    const usernameCheck = await User.findOne({ username: req.body.username });
    const mailCheck = await User.findOne({ email: req.body.email });

    if (usernameCheck) {
      throw new Error("Username already exists.");
    }

    if (mailCheck) {
      throw new Error("Email already exists.");
    }

    const user = await User.findById(req.user._id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    user.updatedIn = Date.now();

    await user.save();

    res.status(200).send({ user: user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete user.
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
