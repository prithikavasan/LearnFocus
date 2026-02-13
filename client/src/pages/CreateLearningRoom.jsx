import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CreateLearningRoom = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [totalSessions, setTotalSessions] = useState(4);
  const [sessionDuration, setSessionDuration] = useState(25);
  const [sessionType, setSessionType] = useState("pomodoro");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (new Date(endTime) <= new Date(startTime)) {
      alert("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        roomName,
        startTime,
        endTime,
        capacity: parseInt(capacity),
        focusConfig: {
          totalSessions: parseInt(totalSessions),
          sessionDuration: parseInt(sessionDuration),
          sessionType,
        },
      };

      await API.post("/rooms", payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("Learning Room created successfully!");
      navigate("/instructor/dashboard");
    } catch (err) {
      console.error("Create Room Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 space-y-6 border border-gray-200">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Create a New Learning Room</h2>
          <p className="text-gray-500 text-lg">Set up a focused session for your students.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Room Name</label>
            <input
              type="text"
              placeholder="Advanced JavaScript"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Capacity & Total Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min={1}
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Total Sessions</label>
              <input
                type="number"
                value={totalSessions}
                onChange={(e) => setTotalSessions(e.target.value)}
                min={1}
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Session Duration & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Session Duration (mins)</label>
              <input
                type="number"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                min={5}
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Session Type</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="pomodoro">Pomodoro</option>
                <option value="deep_focus">Deep Focus</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            {loading ? "Creating Room..." : "Create Learning Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLearningRoom;
