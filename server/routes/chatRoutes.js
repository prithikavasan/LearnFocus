import express from "express";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= SEND MESSAGE ================= */
router.post("/", protect, async (req, res) => {
  try {
    const { courseId, receiverId, message } = req.body;

    if (!courseId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ message: "Invalid IDs provided" });
    }

    const chat = await Chat.create({
      courseId,
      senderId: req.user._id,
      receiverId,
      message,
      status: "sent",
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    // ✅ emit socket event safely
    if (req.io) {
      req.io
        .to(receiverId.toString())
        .emit("receiveMessage", populatedChat);
    }

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error("❌ Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET CONVERSATION LIST ================= */
router.get("/conversations/list", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .populate("courseId", "title");

    const conversationMap = {};

    chats.forEach((chat) => {
      const otherUser =
        chat.senderId._id.toString() === userId.toString()
          ? chat.receiverId
          : chat.senderId;

      const key = `${otherUser._id}_${chat.courseId._id}`;

      if (!conversationMap[key]) {
        conversationMap[key] = {
          _id: key,
          otherUser,
          courseId: chat.courseId._id,
          courseTitle: chat.courseId.title,
          lastMessage: chat.message,
          lastUpdated: chat.createdAt,
          unreadCount: 0,
        };
      }

      if (
        chat.receiverId._id.toString() === userId.toString() &&
        chat.status !== "seen"
      ) {
        conversationMap[key].unreadCount += 1;
      }
    });

    res.json(Object.values(conversationMap));
  } catch (error) {
    console.error("❌ Conversation List Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET ALL MESSAGES ================= */
router.get("/:courseId/:otherUserId", protect, async (req, res) => {
  try {
    const { courseId, otherUserId } = req.params;
    const userId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const messages = await Chat.find({
      courseId,
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.json(messages);
  } catch (error) {
    console.error("❌ Fetch Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= MARK AS SEEN ================= */
router.put("/mark-seen", protect, async (req, res) => {
  try {
    const { courseId, otherUserId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    await Chat.updateMany(
      {
        courseId,
        senderId: otherUserId,
        receiverId: req.user._id,
        status: { $ne: "seen" },
      },
      { status: "seen" }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Mark Seen Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
