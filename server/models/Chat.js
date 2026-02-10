import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

// Optional index for faster querying
chatSchema.index({ courseId: 1, senderId: 1, receiverId: 1 });

export default mongoose.model("Chat", chatSchema);
