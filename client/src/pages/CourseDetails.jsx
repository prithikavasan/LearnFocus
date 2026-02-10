import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Info,
} from "lucide-react";
import ChatWindow from "../components/ChatWindow";

function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  /* ================= FETCH COURSE + PROGRESS ================= */
  useEffect(() => {
    if (!user) {
      setError("Please login to view this course.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          API.get(`/courses/${courseId}`),
          API.get(`/progress/${courseId}`),
        ]);

        setCourse(courseRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        setError("Unable to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  /* ================= HELPERS ================= */
  const isLessonCompleted = (moduleIndex, lessonIndex) =>
    progress?.completedLessons?.some(
      (l) => l.moduleIndex === moduleIndex && l.lessonIndex === lessonIndex
    );

  const isModuleCompleted = (moduleIndex) => {
    const module = course?.modules[moduleIndex];
    if (!module || !progress) return false;

    return module.lessons.every((_, lessonIndex) =>
      isLessonCompleted(moduleIndex, lessonIndex)
    );
  };

  /* ================= TOGGLE LESSON (COMPLETE / UNDO) ================= */
  const toggleLessonStatus = async (moduleIndex, lessonIndex) => {
    try {
      const alreadyCompleted = isLessonCompleted(moduleIndex, lessonIndex);

      await API.post("/progress/lesson", {
        courseId,
        moduleIndex,
        lessonIndex,
      });

      const res = await API.get(`/progress/${courseId}`);
      setProgress(res.data);

      setActionMessage(
        alreadyCompleted
          ? "Lesson marked as incomplete"
          : "Lesson marked as complete"
      );

      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update lesson status");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>

        <p className="text-sm text-gray-500 mb-4">
          Created by{" "}
          <span className="font-medium text-gray-700">
            {course.mentorId?.name || "Unknown Mentor"}
          </span>
        </p>

        {/* USER GUIDANCE */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mb-4">
          <Info size={18} />
          <p className="text-sm">
            Click on a lesson to <b>mark it as completed</b>. Click again to{" "}
            <b>undo</b> if needed.
          </p>
        </div>

        {/* ACTION MESSAGE */}
        {actionMessage && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm border ${
              actionMessage.includes("incomplete")
                ? "bg-gray-50 border-gray-300 text-gray-700"
                : "bg-green-50 border-green-200 text-green-800"
            }`}
          >
            {actionMessage.includes("incomplete") ? "↩️" : "✅"} {actionMessage}
          </div>
        )}

        <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>

        {/* CHAT BUTTON */}
        <button
          onClick={() => setChatOpen(true)}
          className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Chat with Mentor
        </button>

        {/* Chat Window */}
        {chatOpen && (
          <ChatWindow
            courseId={courseId}
           otherUserId={course.mentorId._id}

            closeChat={() => setChatOpen(false)}
          />
        )}

        {/* Modules */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Modules</h2>
        <div className="space-y-5">
          {course.modules.map((module, mIndex) => {
            const isOpen = openModuleIndex === mIndex;
            const moduleCompleted = isModuleCompleted(mIndex);

            return (
              <div
                key={mIndex}
                className={`rounded-2xl border transition ${
                  moduleCompleted ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
                }`}
              >
                {/* Module Header */}
                <button
                  onClick={() => setOpenModuleIndex(isOpen ? null : mIndex)}
                  className="w-full flex justify-between items-center p-5 hover:bg-gray-50 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    {moduleCompleted && <CheckCircle className="text-green-500" size={20} />}
                    <span className="font-semibold text-gray-800">
                      {mIndex + 1}. {module.title}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {/* Lessons */}
                {isOpen && (
                  <div className="px-6 pb-5 space-y-3">
                    {module.lessons.map((lesson, lIndex) => {
                      const completed = isLessonCompleted(mIndex, lIndex);

                      return (
                        <div
                          key={lIndex}
                          onClick={() => toggleLessonStatus(mIndex, lIndex)}
                          className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-all group ${
                            completed ? "bg-green-100 text-green-800" : "bg-blue-50 hover:bg-blue-100"
                          }`}
                        >
                          <span className="text-sm font-medium">{lesson.title}</span>

                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-70 hidden group-hover:block">
                              {completed ? "Click to undo" : "Click to complete"}
                            </span>

                            {completed && <CheckCircle size={18} className="text-green-600" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
