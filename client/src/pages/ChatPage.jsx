import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function ChatPage() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    getChat(chatId).then((res) => setChat(res.data));
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const res = await sendMessage(chatId, text);
    setChat(res.data);
    setText("");
  };

  if (!chat) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="h-[400px] overflow-y-auto space-y-2 border p-4 rounded-lg">
        {chat.messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.senderRole === "student"
                ? "text-right"
                : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-2 rounded-lg bg-gray-100">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
