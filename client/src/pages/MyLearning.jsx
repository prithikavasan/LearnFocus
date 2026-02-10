import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Axios instance

import {
  Clock,
  Target,
  Flame,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

function MyLearning() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // focus session
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);

  // profile dropdown
  const [showMenu, setShowMenu] = useState(false);

  // courses
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const focusOptions = [25, 50, 90, 120, 180, 300];
  const dailyTarget = 120; // 2 hours

  const progressPercent = Math.min(
    (todayFocusMinutes / dailyTarget) * 100,
    100
  );

  const startFocus = () => {
    navigate("/focus", {
      state: { minutes: focusMinutes }
    });
  };

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      setLoadingCourses(true);
      try {
        const res = await API.get("/courses/all"); // Backend route to get all courses
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-8 relative">

      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">My Learning 🚀</h1>
          <p className="text-gray-600 text-lg mt-1">
            Stay consistent. Small focus, big results.
          </p>
        </div>

        {/* 👤 Profile */}
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

              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 📦 Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* 🎯 Current Goal */}
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

        {/* ⏱️ Focus Session */}
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

        {/* 📊 Today’s Progress */}
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

        {/* 🔥 Streak */}
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

      {/* 🧠 Skills */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your Skills
        </h2>

        <div className="flex flex-wrap gap-3">
          {user?.skills?.length > 0 ? (
            user.skills.map((skill) => (
              <button
                key={skill}
                onClick={() => navigate(`/learning-path/${skill}`)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition"
              >
                {skill}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No skills selected yet</p>
          )}
        </div>
      </div>

      {/* 🏫 Courses */}
     {/* 🏫 Explore Courses */}
{/* 🏫 Explore Courses */}
<div className="max-w-6xl mx-auto mt-12">
  <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

    {/* Decorative blur */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

    <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
      
      {/* Left text */}
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Explore Expert-Led Courses 🎓
        </h2>
        <p className="text-white/90 text-lg max-w-lg">
          Learn from mentors, follow structured paths, and upgrade your skills
          step by step.
        </p>
      </div>

      {/* CTA Button */}
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
