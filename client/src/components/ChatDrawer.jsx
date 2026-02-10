import ChatWindow from "./ChatWindow";
import socket from "../socket";

function ChatDrawer({ course, otherUserId, onClose }) {
  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-50">
      <ChatWindow
        courseId={course._id}
        otherUserId={otherUserId}
        closeChat={onClose}
        socket={socket}
      />
    </div>
  );
}

export default ChatDrawer;
