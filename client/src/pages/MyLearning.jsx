import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Clock,
  Target,
  Flame,
  BarChart3,
  Settings,
  LogOut,
  Users
} from "lucide-react";

function MyLearning() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [joinedRooms, setJoinedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const focusOptions = [25, 50, 90, 120, 180, 300];
  const dailyTarget = 120;

  const progressPercent = Math.min(
    (todayFocusMinutes / dailyTarget) * 100,
    100
  );

  const startFocus = () => {
    navigate("/focus", {
      state: { minutes: focusMinutes }
    });
  };

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      setLoadingCourses(true);
      try {
        const res = await API.get("/courses/all");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [user]);

  /* ================= FETCH JOINED ROOMS ================= */
  useEffect(() => {
    const fetchJoinedRooms = async () => {
      if (!user) return;

      setLoadingRooms(true);
      try {
        const res = await API.get("/rooms/student/rooms");
        setJoinedRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch joined rooms:", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchJoinedRooms();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-8 relative">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">My Learning 🚀</h1>
          <p className="text-gray-600 text-lg mt-1">
            Stay consistent. Small focus, big results.
          </p>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-lg"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-20">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700"
              >
                <Settings size={18} />
                Edit Skills
              </button>
              {/* ================= Profile ================= */}
<div className="relative">
  <button
    onClick={() => navigate("/profile")}
    className="fw-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600"
  >
    View Profile
  </button>
</div>


              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Skill Goal */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-700">
              Current Skill Goal
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            {user?.learningGoal || "Not set yet"}
          </p>
        </div>

        {/* Focus Session */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-700">
              Focus Session
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            {focusOptions.map((min) => (
              <button
                key={min}
                onClick={() => setFocusMinutes(min)}
                className={`px-4 py-2 rounded-full border transition ${
                  focusMinutes === min
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {min < 60 ? `${min} min` : `${min / 60} hr`}
              </button>
            ))}
          </div>

          <button
            onClick={startFocus}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Start Focus 🚀
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-700">
              Today’s Progress
            </h2>
          </div>

          <p className="text-gray-600 mb-2">
            {todayFocusMinutes} / {dailyTarget} minutes
          </p>

          <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-5 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {Math.floor(progressPercent)}% completed
          </p>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-700">
              Streak Count
            </h2>
          </div>

          <p className="text-4xl font-bold text-orange-500">
            {user?.streak || 0}
            <span className="text-lg text-gray-600 ml-2">days</span>
          </p>
        </div>
      </div>

      {/* ================= JOIN ROOM BUTTON ================= */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
          <Users className="mx-auto text-indigo-600 mb-4" size={40} />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Join a Study Room
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your mentor’s room and stay accountable.
          </p>

          <button
            onClick={() => navigate("/join-room")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg transition transform hover:scale-105"
          >
            Join Room →
          </button>
        </div>
      </div>

      {/* ================= YOUR STUDY ROOMS ================= */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Study Rooms
          </h2>

          {loadingRooms ? (
            <p className="text-gray-500">Loading rooms...</p>
          ) : joinedRooms.length === 0 ? (
            <p className="text-gray-500">
              You haven't joined any study rooms yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {joinedRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {room.roomName}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    Instructor: {room.instructor?.name}
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    Code: <span className="font-semibold">{room.roomCode}</span>
                  </p>
<button
  onClick={() => navigate(`/room/${room._id}`)}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition"
>
  Enter Room →
</button>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
       {/* 🏫 Explore Courses */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

          <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Explore Expert-Led Courses 🎓
              </h2>
              <p className="text-white/90 text-lg max-w-lg">
                Learn from mentors, follow structured paths, and upgrade your skills step by step.
              </p>
            </div>

            <button
              onClick={() => navigate("/courses")}
              className="group bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition flex items-center gap-3"
            >
              Explore Now
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

    </div>
    
  );
}
export default MyLearning;
