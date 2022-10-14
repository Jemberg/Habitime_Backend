const express = require("express");
const schedule = require("../middleware/schedule");

const router = new express.Router();

// Create notification.
router.post("/notification", async (req, res) => {
  try {
    const payload = {
      time: req.body.time,
      days: req.body.days,
      title: req.body.title,
      body: req.body.body,
    };

    await schedule.createSchedule(payload);

    res.json({
      data: {},
      message: "Success",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
