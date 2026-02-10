import express from "express";
import FocusSession from "../models/FocusSession.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- CREATE SESSION (DESKTOP) ---------------- */
router.post("/create", protect, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId required" });
    }

    const session = await FocusSession.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        userId: req.user._id,
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, session });
  } catch (err) {
    console.error("FOCUS CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- MOBILE JOIN (QR SCAN) ---------------- */
router.post("/join", async (req, res) => {
  const { sessionId } = req.body;

  const session = await FocusSession.findOneAndUpdate(
    { sessionId },
    { mobileConnected: true },
    { new: true }
  );

  if (!session) {
    return res.status(404).json({ message: "Invalid QR session" });
  }

  res.json({ success: true });
});

/* ---------------- START SESSION ---------------- */
router.post("/start", async (req, res) => {
  const { sessionId } = req.body;

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 25 * 60 * 1000);

  const session = await FocusSession.findOneAndUpdate(
    { sessionId, mobileConnected: true },
    {
      status: "ACTIVE",
      startTime,
      endTime,
    },
    { new: true }
  );

  if (!session) {
    return res.status(400).json({
      message: "Mobile not connected yet",
    });
  }

  res.json(session);
});

/* ---------------- SESSION STATUS (POLLING) ---------------- */
router.get("/status/:sessionId", async (req, res) => {
  const session = await FocusSession.findOne({
    sessionId: req.params.sessionId,
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json(session);
});

/* ---------------- LOG VIOLATION ---------------- */
router.post("/violation", async (req, res) => {
  const { sessionId } = req.body;

  await FocusSession.findOneAndUpdate(
    { sessionId },
    { $inc: { violations: 1 } }
  );

  res.json({ success: true });
});

export default router;
