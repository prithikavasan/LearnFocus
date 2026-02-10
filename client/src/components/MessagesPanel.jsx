import { MessageCircle } from "lucide-react";

export default function MessagesPanel({
  conversations = [],
  onOpenChat,
  onClose,
}) {
  return (
    <div className="fixed right-6 top-20 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Messages
        </h2>
        <button
          onClick={onClose}
          className="text-red-500 font-bold hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* CONVERSATION LIST */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-center mt-10 px-4">
            No messages yet
          </p>
        ) : (
          conversations.map((conv) => {
            // ✅ backend sends `otherUser`
            const user = conv.otherUser;
            const courseId = conv.courseId;

            if (!user?._id || !courseId) return null;

            const unreadCount = conv.unreadCount || 0;
            const hasUnread = unreadCount > 0;

            return (
              <div
                key={`${user._id}_${courseId}`}
                onClick={() =>
                  onOpenChat({
                    courseId,
                    otherUserId: user._id,
                  })
                }
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors
                  ${hasUnread ? "bg-blue-50" : "hover:bg-gray-50"}
                `}
              >
                {/* LEFT */}
                <div className="overflow-hidden">
                  <p
                    className={`truncate ${
                      hasUnread
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-800"
                    }`}
                  >
                    {user.name || "User"}
                  </p>

                  <p
                    className={`text-sm truncate max-w-[220px] ${
                      hasUnread
                        ? "text-gray-700 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {conv.lastMessage || "New message"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {hasUnread && (
                    <span className="min-w-[20px] h-5 px-2 flex items-center justify-center bg-green-600 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}

                  <MessageCircle
                    size={20}
                    className={hasUnread ? "text-green-600" : "text-blue-500"}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
