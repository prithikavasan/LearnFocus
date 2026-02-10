import { useEffect, useState } from "react";

function ProtectedMode() {
  const [warnings, setWarnings] = useState(0);

  useEffect(() => {
    document.documentElement.requestFullscreen();

    const onHide = () => {
      setWarnings((w) => w + 1);
      alert("🚫 Stay focused! Tab switching detected.");
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) onHide();
    });

    return () => document.exitFullscreen();
  }, []);

  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold mb-4">🔒 Protected Focus</h2>
      <p className="text-xl">Warnings: {warnings}</p>
    </div>
  );
}

export default ProtectedMode;
