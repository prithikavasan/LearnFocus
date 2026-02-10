// controllers/roomController.js
import Room from "../models/Room.js";
import crypto from "crypto"; // for unique room code generation

// Generate a unique room code
const generateRoomCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., "A1B2C3"
};

export const createRoom = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) return res.status(400).json({ error: "Course ID is required" });

  try {
    // Check if room already exists
    let room = await Room.findOne({ courseId });
    if (room) {
      return res.json({ roomCode: room.roomCode, existing: true });
    }

    // Create new room
    const roomCode = generateRoomCode();
    room = new Room({ courseId, roomCode });
    await room.save();

    res.json({ roomCode, existing: false });
  } catch (err) {
    console.error("❌ Room creation failed:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
};
