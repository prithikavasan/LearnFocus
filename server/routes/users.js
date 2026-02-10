import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* =====================================================
   CHECK USER BY EMAIL (NEW ROUTE 🔥)
   GET /api/users/check?email=example@gmail.com
===================================================== */
router.get("/check", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    res.status(200).json({
      exists: !!user,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE LEARNING GOAL
   PUT /api/users/:id/learningGoal
===================================================== */
router.put("/:id/learningGoal", async (req, res) => {
  try {
    const { learningGoal } = req.body;

    if (!learningGoal) {
      return res.status(400).json({ message: "Learning goal is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { learningGoal },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating learning goal" });
  }
});

/* =====================================================
   UPDATE SKILLS
   PUT /api/users/:id/skills
===================================================== */
router.put("/:id/skills", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills array is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { skills },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating skills" });
  }
});

export default router;
