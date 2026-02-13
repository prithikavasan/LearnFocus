import { useState, useEffect, useContext } from "react";
import PomodoroMode from "../components/PomodoroMode";
import ProtectedMode from "../components/ProtectedMode";
import MobileFocusMode from "../components/MobileFocusMode";
import FocusTips from "../components/FocusTips";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

function FocusPage() {
  const { user, setUser } = useContext(AuthContext);
  const [mode, setMode] = useState(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const POMODORO_TARGET = 4; // 4 Pomodoros = 2 hours

  // When completedPomodoros reach the target, increment streak
  useEffect(() => {
    if (completedPomodoros >= POMODORO_TARGET) {
      incrementStreak();
    }
  }, [completedPomodoros]);

  const incrementStreak = async () => {
    try {
      // API call to increment streak
      const res = await API.post("/users/me/incrementStreak");
      setUser((prev) => ({
        ...prev,
        streak: res.data.streak,
        totalActiveDays: res.data.totalActiveDays,
      }));
      setCompletedPomodoros(0); // reset counter after streak increment
    } catch (err) {
      console.error("Failed to update streak:", err);
    }
  };

  // Called after each Pomodoro session completion
  const handlePomodoroComplete = () => {
    setCompletedPomodoros((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-6">🧠 Focus Center</h1>

      {!mode && (
        <>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <ModeCard title="Pomodoro" desc="Simple 25 min focus session" onClick={() => setMode("pomodoro")} />
            <ModeCard title="Protected Mode" desc="Strict focus with tab detection" onClick={() => setMode("protected")} />
            <ModeCard title="Stay Focus with Mobile" desc="Sync focus on mobile via QR" onClick={() => setMode("mobile")} />
          </div>
          <FocusTips />
        </>
      )}

      {mode === "pomodoro" && <PomodoroMode onComplete={handlePomodoroComplete} />}
      {mode === "protected" && <ProtectedMode />}
      {mode === "mobile" && <MobileFocusMode />}

      {/* Show daily progress */}
      <div className="max-w-5xl mx-auto mt-8 text-center">
        <p>
          Completed Pomodoros: <span className="font-bold">{completedPomodoros}</span> / {POMODORO_TARGET}
        </p>
      </div>
    </div>
  );
}

function ModeCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl hover:scale-105 transition border border-white/20 text-left"
    >
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300">{desc}</p>
    </button>
  );
}

export default FocusPage;
