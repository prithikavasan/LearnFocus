import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function ChatWindow({
  courseId,
  otherUserId,
  closeChat,
  socket, // 👈 socket comes from parent
}) {
  const { user, token } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!socket || !courseId || !otherUserId) return;

    socket.emit("joinRoom", { courseId, otherUserId });

    return () => {
      socket.emit("leaveRoom", { courseId, otherUserId });
    };
  }, [socket, courseId, otherUserId]);

  /* ================= FETCH OLD MESSAGES ================= */
  useEffect(() => {
    if (!courseId || !otherUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/${courseId}/${otherUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data || []);
      } catch (err) {
        console.error("❌ Fetch messages failed", err);
      }
    };

    fetchMessages();
  }, [courseId, otherUserId, token]);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      const senderId =
        typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

      if (
        msg.courseId === courseId &&
        (senderId === otherUserId || senderId === user._id)
      ) {
        setMessages((prev) =>
          prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
        );
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, courseId, otherUserId, user._id]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      courseId,
      receiverId: otherUserId,
      message: newMessage.trim(),
    };

    const tempId = Date.now().toString();

    const tempMessage = {
      _id: tempId,
      senderId: user._id,
      message: payload.message,
      courseId,
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const res = await API.post("/chat", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.data : m))
      );

      socket.emit("sendMessage", res.data);
    } catch (err) {
      console.error("❌ Send failed", err);

      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...m, status: "failed" } : m
        )
      );
    }
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= UI ================= */
  return (
    <div
      className="fixed w-96 h-96 bg-white border rounded-xl shadow-lg flex flex-col"
      style={{ bottom: 12, right: 12, zIndex: 100 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="font-semibold text-gray-700">Chat</h2>
        <button
          onClick={closeChat}
          className="text-red-500 font-bold hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
          const isMe = senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`p-2 rounded-lg max-w-[75%] text-sm break-words ${
                isMe
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-100 mr-auto text-left"
              }`}
            >
              {msg.message}
              {isMe && (
                <div className="text-[10px] text-gray-500 mt-1">
                  {msg.status || "sent"}
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 rounded-lg text-sm text-white bg-blue-500 hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
