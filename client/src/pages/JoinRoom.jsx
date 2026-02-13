import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ArrowLeft, Users } from "lucide-react";

function JoinRoom() {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!roomCode.trim()) {
      setError("Please enter a valid room code.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/rooms/join", {
        roomCode: roomCode.toUpperCase(),
      });

      setSuccess("Successfully joined the room! Redirecting...");

      setTimeout(() => {
        navigate(`/room/${res.data.room._id}`);
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid room code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <Users className="text-indigo-600" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Join Study Room
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Enter the room code shared by your mentor
        </p>

        <form onSubmit={handleJoin} className="space-y-5">

          {/* Input */}
          <div>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter Room Code"
              className={`w-full px-4 py-3 rounded-xl border text-center text-lg tracking-widest uppercase focus:outline-none focus:ring-2 transition ${
                error
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-300"
              }`}
            />

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center animate-pulse">
                {error}
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p className="text-green-600 text-sm mt-2 text-center">
                {success}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;
