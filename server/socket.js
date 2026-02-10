import jwt from "jsonwebtoken";
import Chat from "./models/Chat.js";

export default function socketHandler(io) {
  /* ================= SOCKET AUTH ================= */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.id || decoded._id;
      if (!socket.userId) return next(new Error("Authentication error"));

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  /* ================= SOCKET CONNECTION ================= */
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.userId);

    // ✅ Join personal room (CRITICAL)
    socket.join(socket.userId.toString());

    /* ================= SEND MESSAGE ================= */
    socket.on("sendMessage", async ({ messageId, receiverId }) => {
      try {
        if (!messageId || !receiverId) return;

        const chat = await Chat.findById(messageId)
          .populate("senderId", "name email")
          .populate("receiverId", "name email");

        if (!chat) return;

        // ✅ Security check
        if (chat.senderId._id.toString() !== socket.userId.toString()) return;
        if (chat.receiverId._id.toString() !== receiverId.toString()) return;

        // ✅ Update delivery status
        if (chat.status === "sent") {
          chat.status = "delivered";
          await chat.save();
        }

        // ✅ Emit message to RECEIVER
        io.to(receiverId.toString()).emit("receiveMessage", chat);

        // ✅ Emit message to SENDER (so sender UI updates)
        io.to(socket.userId.toString()).emit("receiveMessage", chat);

        // ✅ Update conversation list (BOTH SIDES)
        io.to(receiverId.toString()).emit("conversationUpdate", {
          courseId: chat.courseId,
          otherUserId: chat.senderId._id,
          lastMessage: chat.message,
          updatedAt: chat.updatedAt,
        });

        io.to(socket.userId.toString()).emit("conversationUpdate", {
          courseId: chat.courseId,
          otherUserId: chat.receiverId._id,
          lastMessage: chat.message,
          updatedAt: chat.updatedAt,
        });
      } catch (err) {
        console.error("❌ sendMessage error:", err);
      }
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.userId);
    });
  });
}
