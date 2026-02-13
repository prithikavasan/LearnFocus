import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Clipboard, Check } from "lucide-react";

const ViewRoom = () => {
  const { token } = useContext(AuthContext);
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [updatingRule, setUpdatingRule] = useState(false);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to fetch room:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, token]);

  // Copy room code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(room?.roomCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle "Allow Late Join"
  const handleToggleLateJoin = async () => {
    if (!room) return;

    // Optimistic UI update
    const newValue = !room.rules.allowLateJoin;
    setRoom({
      ...room,
      rules: {
        ...room.rules,
        allowLateJoin: newValue,
      },
    });
    setUpdatingRule(true);

    try {
      await API.put(
        `/rooms/${roomId}/update-rule`,
        { allowLateJoin: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update rule:", err.response?.data || err.message);
      // Rollback on error
      setRoom({
        ...room,
        rules: {
          ...room.rules,
          allowLateJoin: !newValue,
        },
      });
    } finally {
      setUpdatingRule(false);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading room details...</p>;
  if (!room)
    return <p className="text-center mt-20 text-red-500">Room not found</p>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-12 space-y-10">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          {room.roomName}
        </h2>

        {/* ROOM CODE */}
        <div className="flex justify-between items-center bg-indigo-50 p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <span className="font-semibold text-gray-700 text-lg">Room Code:</span>
          <div className="flex items-center gap-4">
            <span className="font-bold text-indigo-600 text-xl tracking-wider">
              {room.roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110
                ${copied ? "bg-green-500 hover:bg-green-600 text-white shadow-lg" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"}`}
              title="Copy Room Code"
            >
              {copied ? <Check size={20} /> : <Clipboard size={20} />}
            </button>
          </div>
        </div>

        {/* ROOM DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Schedule */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="font-semibold text-indigo-700 text-lg mb-3">Schedule</h3>
            <p>
              <span className="font-medium text-gray-600">Start:</span>{" "}
              {new Date(room.startTime).toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-gray-600">End:</span>{" "}
              {new Date(room.endTime).toLocaleString()}
            </p>
          </div>

          {/* Capacity & Rules */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 space-y-3">
            <h3 className="font-semibold text-indigo-700 text-lg mb-3">Capacity & Rules</h3>
            <p>
              <span className="font-medium text-gray-600">Capacity:</span> {room.capacity}
            </p>

            {/* Toggle Late Join */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Allow Late Join:</span>
              <button
                onClick={handleToggleLateJoin}
                disabled={updatingRule}
                className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none
                  ${room.rules.allowLateJoin ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300
                    ${room.rules.allowLateJoin ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <p>
              <span className="font-medium text-gray-600">Mentor Approval Required:</span>{" "}
              {room.rules?.requireMentorApproval ? "Yes" : "No"}
            </p>
          </div>

          {/* Focus Configuration */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="font-semibold text-indigo-700 text-lg mb-3">Focus Configuration</h3>
            <p>
  <span className="font-medium text-gray-600">Type:</span>{" "}
  {room.focusSettings?.sessionType || "N/A"}
</p>
<p>
  <span className="font-medium text-gray-600">Duration:</span>{" "}
  {room.focusSettings?.sessionDuration || "N/A"} mins
</p>
<p>
  <span className="font-medium text-gray-600">Total Sessions:</span>{" "}
  {room.focusSettings?.totalSessions || "N/A"}
</p>

          </div>

          {/* Students Joined */}
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="font-semibold text-indigo-700 text-lg mb-3">Students Joined</h3>
            {room.students?.length === 0 ? (
              <p className="text-gray-400">No students have joined yet</p>
            ) : (
              <ul className="space-y-2">
                {room.students.map((s) => (
                  <li key={s.student._id || s.student} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{s.student.name || s.student}</span>
                    <span className={`text-sm font-semibold ${s.status === "completed" ? "text-green-500" : "text-gray-500"}`}>
                      {s.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewRoom;
