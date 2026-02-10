import Chat from "../models/Chat.js";
import Course from "../models/Course.js";

// Start or get chat
export const startChat = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    let chat = await Chat.findOne({
      courseId,
      studentId,
      mentorId: course.mentorId
    });

    if (!chat) {
      chat = await Chat.create({
        courseId,
        studentId,
        mentorId: course.mentorId,
        messages: []
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to start chat" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat)
      return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({
      senderId: req.user._id,
      senderRole: req.user.role,
      text
    });

    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Message failed" });
  }
};

// Get chat messages
export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Cannot load chat" });
  }
};
