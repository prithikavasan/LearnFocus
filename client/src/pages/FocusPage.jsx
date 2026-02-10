import { useState } from "react";
import PomodoroMode from "../components/PomodoroMode";
import ProtectedMode from "../components/ProtectedMode";
import MobileFocusMode from "../components/MobileFocusMode";
import FocusTips from "../components/FocusTips";

function FocusPage() {
  const [mode, setMode] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        🧠 Focus Center
      </h1>

      {!mode && (
        <>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <ModeCard
              title="Pomodoro"
              desc="Simple 25 min focus session"
              onClick={() => setMode("pomodoro")}
            />
            <ModeCard
              title="Protected Mode"
              desc="Strict focus with tab detection"
              onClick={() => setMode("protected")}
            />
            <ModeCard
              title="Stay Focus with Mobile"
              desc="Sync focus on mobile via QR"
              onClick={() => setMode("mobile")}
            />
          </div>

          <FocusTips />
        </>
      )}

      {mode === "pomodoro" && <PomodoroMode />}
      {mode === "protected" && <ProtectedMode />}
      {mode === "mobile" && <MobileFocusMode />}
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
