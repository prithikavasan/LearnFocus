import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

function PomodoroMode({ onComplete }) {
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);

          // Trigger celebration overlay
          setCelebrate(true);

          // Notify parent that a Pomodoro is completed
          onComplete?.();

          // Hide celebration and reset timer after 3 seconds
          setTimeout(() => {
            setCelebrate(false);
            setTime(25 * 60);
          }, 3000);

          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toString().padStart(2, "0");

  return (
    <div className="text-center mt-10 relative min-h-[300px]">
      <h2 className="text-3xl font-bold mb-4">Pomodoro Timer</h2>
      <p className="text-6xl font-mono">{minutes}:{seconds}</p>

      {/* Celebration Overlay */}
      {celebrate && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-800/80 backdrop-blur-sm animate-fadeIn z-50">
          <Trophy className="text-yellow-400 w-16 h-16 animate-bounceIcon" />
          <p className="text-3xl font-bold text-white mt-4 animate-pulseText">
            Streak Achieved!
          </p>

          {/* Confetti Bars */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-6 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random()}s`,
                  backgroundColor: ['#facc15', '#fbbf24', '#fde68a'][Math.floor(Math.random() * 3)],
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PomodoroMode;
