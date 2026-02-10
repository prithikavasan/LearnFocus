import { useEffect, useState } from "react";

function PomodoroMode() {
  const [time, setTime] = useState(25 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          alert("🎉 Pomodoro completed!");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold mb-4">🍅 Pomodoro</h2>
      <p className="text-6xl font-mono">
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
      </p>
    </div>
  );
}

export default PomodoroMode;
