import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import API from "../services/api";
import ChatDrawer from "../components/ChatDrawer";
import MessagesPanel from "../components/MessagesPanel";
import socket from "../socket";

function CoursesOverview() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showMessages, setShowMessages] = useState(false);
  const [conversations, setConversations] = useState([]);

  const [openChat, setOpenChat] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [unreadTotal, setUnreadTotal] = useState(0);

  /* ---------------- FETCH COURSES ---------------- */
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await API.get("/courses/all");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ---------------- FETCH CONVERSATIONS ---------------- */
  const fetchConversations = async () => {
    const res = await API.get("/chat/conversations/list");
    setConversations(res.data);

    const totalUnread = res.data.reduce(
      (sum, c) => sum + (c.unreadCount || 0),
      0
    );
    setUnreadTotal(totalUnread);
  };

  /* ---------------- SOCKET LISTENER ---------------- */
  useEffect(() => {
    fetchConversations(); // initial load

    socket.on("newMessage", (msg) => {
      setUnreadTotal((prev) => prev + 1);
      fetchConversations();
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Explore Courses</h1>
            <p className="text-gray-500">
              Learn from expert mentors
            </p>
          </div>

          {/* MESSAGES BUTTON */}
          <button
            onClick={() => {
              fetchConversations();
              setShowMessages(true);
              setUnreadTotal(0); // clear badge
            }}
            className="relative flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow"
          >
            <MessageCircle className="text-blue-600" />

            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadTotal}
              </span>
            )}

            <span className="font-medium">Messages</span>
          </button>
        </div>

        {/* COURSES GRID */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-6 rounded-xl shadow"
              >
                <h2 className="font-semibold text-lg">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {course.description}
                </p>

                <div className="flex justify-between mt-4">
                  <span className="text-sm">
                    Mentor: {course.mentorId?.name || "N/A"}
                  </span>

                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="text-blue-600 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGES PANEL */}
      {showMessages && (
        <MessagesPanel
          conversations={conversations}
          onClose={() => setShowMessages(false)}
          onOpenChat={(conv) => {
            setSelectedCourse({ _id: conv.courseId });
            setSelectedUserId(conv.otherUserId);
            setOpenChat(true);
            setShowMessages(false);
          }}
        />
      )}

      {/* CHAT DRAWER */}
      {openChat && selectedCourse && selectedUserId && (
        <ChatDrawer
          course={selectedCourse}
          otherUserId={selectedUserId}
          onClose={() => setOpenChat(false)}
        />
      )}
    </div>
  );
}

export default CoursesOverview;
