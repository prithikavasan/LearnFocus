import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { BookOpen, FileText, CheckSquare, Users, CheckCircle, Circle } from "lucide-react";

function StudentRoom() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  // Toggle course completion
  const toggleCourseComplete = async (courseId) => {
    setRoom((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c._id === courseId ? { ...c, completed: !c.completed } : c
      ),
    }));
    try {
      await API.post(`/rooms/${roomId}/courses/${courseId}/toggle-complete`);
    } catch (err) {
      console.error(err);
      // Revert
      setRoom((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c._id === courseId ? { ...c, completed: !c.completed } : c
        ),
      }));
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId) => {
    setRoom((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t._id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
    try {
      await API.post(`/rooms/${roomId}/tasks/${taskId}/toggle-complete`);
    } catch (err) {
      console.error(err);
      // Revert
      setRoom((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t._id === taskId ? { ...t, completed: !t.completed } : t
        ),
      }));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading room...</p>
      </div>
    );

  if (!room)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">Room not found</p>
      </div>
    );

  // Calculate course progress dynamically
  

  // Calculate overall room progress
  const getRoomProgress = () => {
  if (!room) return 0;

  const today = new Date();
  const start = new Date(room.startTime);
  const end = new Date(room.endTime);

  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

  // How many days have passed since the start
  let dayIndex = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  dayIndex = Math.max(0, Math.min(dayIndex, totalDays));

  const totalItems = room.courses.length + room.tasks.length;
  if (totalItems === 0) return 0;

  const completedItems =
    room.courses.filter((c) => c.completed).length +
    room.tasks.filter((t) => t.completed).length;

  const completionProgress = Math.floor((completedItems / totalItems) * 100);

  // Minimum allowed progress based on time
  const timeProgress = Math.floor((dayIndex / totalDays) * 100);

  // Return the **max** of time-based and completion-based progress
  return Math.min(Math.max(completionProgress, timeProgress), 100);
};



  const roomProgress = getRoomProgress();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Room Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">{room.roomName}</h1>
            <p className="text-gray-600 mb-2">{room.description}</p>
            <p className="text-sm text-gray-500">
              Mentor: <span className="font-semibold">{room.instructor?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Room Code */}
            <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
              Code: {room.roomCode}
            </span>
            <Users className="text-indigo-600" size={28} />

            {/* Room Progress */}
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="#16a34a"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * (1 - roomProgress / 100)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-gray-800">
                {roomProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Materials */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-700">Materials</h2>
          </div>
          {room.materials && room.materials.length ? (
            <ul className="space-y-3">
              {room.materials.map((m) => (
                <li
                  key={m._id}
                  className="flex justify-between bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-2 transition"
                >
                  <span>{m.title}</span>
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {m.type}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No materials uploaded yet.</p>
          )}
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-700">Courses</h2>
          </div>
          {room.courses && room.courses.length ? (
            <ul className="space-y-3">
              {room.courses.map((course) => (
                <li
                  key={course._id}
                  className="bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 transition flex justify-between items-center"
                >
                  <div>
                    <p
                      className={`${
                        course.completed ? "line-through text-gray-400" : "font-medium"
                      }`}
                    >
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">{course.duration} mins</p>
                  </div>
                  <button
                    onClick={() => toggleCourseComplete(course._id)}
                    className={`p-1 rounded-full transition ${
                      course.completed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {course.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No courses added yet.</p>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-700">Tasks</h2>
          </div>
          {room.tasks && room.tasks.length ? (
            <ul className="space-y-3">
              {room.tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 transition"
                >
                  <div>
                    <p
                      className={`${
                        task.completed ? "line-through text-gray-400" : "font-medium"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-500">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleTaskComplete(task._id)}
                    className={`p-1 rounded-full transition ${
                      task.completed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No tasks assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentRoom;
