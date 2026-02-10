import express from "express";
import protect from "../middleware/authMiddleware.js";
import Room from "../models/Room.js";
import crypto from "crypto";

const router = express.Router();

/* CREATE ROOM */
router.post("/rooms/create", protect, async (req, res) => {
  const { courseId, customPasskey } = req.body;

  const passkey =
    customPasskey?.trim() ||
    crypto.randomBytes(4).toString("hex"); // auto-generate

  const room = await Room.create({
    course: courseId,
    instructor: req.user._id,
    passkey,
  });

  res.status(201).json(room);
});

/* JOIN ROOM */
router.post("/rooms/join", protect, async (req, res) => {
  const { passkey } = req.body;

  const room = await Room.findOne({ passkey, isActive: true });
  if (!room) {
    return res.status(404).json({ message: "Invalid passkey" });
  }

  res.json(room);
});

export default router;
