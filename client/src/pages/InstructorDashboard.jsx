import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { io } from "socket.io-client";

import {
  UploadCloud,
  Layers,
  BookOpen,
  MessageSquare,
  Eye,
} from "lucide-react";

import ChatWindow from "../components/ChatWindow";

/* ================= DASHBOARD ================= */
function InstructorDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= CHAT ================= */
  const [showChatList, setShowChatList] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeCourseChat, setActiveCourseChat] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  /* ================= ROOM ================= */
  const [rooms, setRooms] = useState({}); // store courseId => roomCode

  /* ================= SOCKET ================= */
  const socketRef = useRef(null);

  /* ================= CONNECT SOCKET ================= */
  useEffect(() => {
    if (!user?._id || !token) return;

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Mentor socket connected:", socketRef.current.id);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      const conversationId = msg.conversationId || `${msg.courseId}-${msg.senderId}`;
      const course = { _id: msg.courseId, title: msg.courseTitle || "Course" };
      const student = { _id: msg.senderId, name: msg.senderName || "Student" };

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c._id === conversationId);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: msg.message,
            unreadCount: (updated[existingIndex].unreadCount || 0) + 1,
          };
          return updated;
        }
        return [
          {
            _id: conversationId,
            course,
            otherUser: student,
            lastMessage: msg.message,
            unreadCount: 1,
          },
          ...prev,
        ];
      });

      setShowChatList(true);
      setActiveCourseChat(msg.courseId);
      setSelectedStudent(student);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, token]);

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    if (!user?._id) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await API.get("/courses");
        setCourses(res.data || []);
      } catch (err) {
        console.error("❌ Course fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?._id]);

  /* ================= FETCH CONVERSATIONS ================= */
  useEffect(() => {
    if (!showChatList) return;

    const fetchConversations = async () => {
      try {
        const res = await API.get("/chat/conversations/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data || []);
      } catch (err) {
        console.error("❌ Failed to load conversations", err);
      }
    };

    fetchConversations();
  }, [showChatList, token]);

  /* ================= OPEN CHAT ================= */
  const openChat = (conv) => {
    const courseId = conv.course?._id || conv.courseId;
    const student = conv.otherUser || conv.user;

    if (!courseId || !student?._id) return;

    setActiveCourseChat(courseId);
    setSelectedStudent(student);
    setShowChatList(true);

    setConversations((prev) =>
      prev.map((c) =>
        c._id === conv._id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const closeChatCompletely = () => {
    setActiveCourseChat(null);
    setSelectedStudent(null);
  };

  /* ================= CREATE ROOM ================= */
  const handleCreateRoom = async (courseId) => {
    try {
      // Check if room already exists
      if (rooms[courseId]) {
        alert(`Room already exists! Share this code: ${rooms[courseId]}`);
        return;
      }

      // Create new room on server
      const res = await API.post(
        `/courses/${courseId}/create-room`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const roomCode = res.data.roomCode;
      setRooms((prev) => ({ ...prev, [courseId]: roomCode }));
      alert(`Room created! Share this code with students: ${roomCode}`);
    } catch (err) {
      console.error("❌ Failed to create room", err);
      alert("Failed to create room");
    }
  };

  /* ================= COURSE ACTIONS ================= */
  const handleEditCourse = (courseId) => navigate(`/instructor/edit-course/${courseId}`);
  const handleViewCourse = (courseId) => navigate(`/instructor/view-course/${courseId}`);
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      alert("Course deleted successfully");
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Failed to delete course");
    }
  };
  const handleUpdateCourse = (courseId) => alert(`Update course ${courseId}`);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex gap-6">
      {/* ================= MAIN ================= */}
      <div className="flex-1">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500">Instructor Dashboard</p>
          </div>
          <button
            onClick={() => navigate("/instructor/create-course")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            + Create Course
          </button>
        </div>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <ActionCard icon={<BookOpen size={32} />} title="My Courses" desc="Manage courses" />
          <ActionCard icon={<UploadCloud size={32} />} title="Upload" desc="Materials" />
          <ActionCard icon={<Layers size={32} />} title="Programs" desc="Learning paths" />
          <ActionCard
            icon={<MessageSquare size={32} />}
            title="Course Chat"
            desc="Student messages"
            onClick={() => setShowChatList(true)}
          />
        </div>

        {/* COURSES */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Courses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between hover:shadow-lg transition duration-300"
              >
                <div className="mb-3 h-36 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-semibold ${
                      course.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewCourse(course._id)}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded font-medium transition flex items-center justify-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => handleUpdateCourse(course._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-medium transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleEditCourse(course._id)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-medium transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleCreateRoom(course._id)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-medium transition"
                  >
                    Create Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= CHAT SIDEBAR ================= */}
      {showChatList && (
        <div className="w-80 bg-white rounded-3xl shadow-2xl p-4 flex flex-col">
          <div className="flex justify-between mb-4 items-center border-b border-gray-200 pb-2">
            <h2 className="font-semibold text-gray-800 text-lg">Course Chats</h2>
            <button
              onClick={() => {
                setShowChatList(false);
                closeChatCompletely();
              }}
              className="text-red-500 font-bold hover:text-red-700 transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {conversations.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-10">No messages yet</p>
            )}

            {conversations.map((conv, index) => {
              const student = conv.otherUser || conv.user;
              const courseTitle = conv.course?.title || conv.courseTitle || "Course";

              if (!student) return null;

              const isActiveChat =
                activeCourseChat === (conv.courseId || conv.course?._id) &&
                selectedStudent?._id === student._id;

              return (
                <button
                  key={conv._id || index}
                  onClick={() => openChat(conv)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isActiveChat ? "bg-blue-50 shadow-md" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium text-sm">
                    {student.name?.charAt(0) || "S"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">{student.name || "Student"}</p>
                    <p className="text-xs text-gray-500 truncate">{courseTitle}</p>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage || "No message"}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeCourseChat && selectedStudent && (
            <ChatWindow
              courseId={activeCourseChat}
              otherUserId={selectedStudent._id}
              closeChat={closeChatCompletely}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ================= ACTION CARD ================= */
const ActionCard = ({ icon, title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-3xl shadow-md cursor-pointer hover:shadow-lg transition flex flex-col items-center justify-center text-center"
  >
    <div className="mb-4 text-indigo-500">{icon}</div>
    <h3 className="font-bold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

export default InstructorDashboard;
