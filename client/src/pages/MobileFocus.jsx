import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function MobileFocus() {
  // ✅ sessionId created ONCE
  const sessionIdRef = useRef(crypto.randomUUID());
  const sessionId = sessionIdRef.current;

  const qrUrl = `http://localhost:5173/mobile-focus/${sessionId}`;

console.log("QR URL:", qrUrl);

  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(25 * 60);

  // 1️⃣ Create session (desktop user must be logged in)
  useEffect(() => {
    API.post("/focus/create", { sessionId }).catch(console.log);
  }, []);

  // 2️⃣ Poll backend for status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await API.get(`/focus/status/${sessionId}`);

        if (data.status === "ACTIVE") {
          setActive(true);

          const remaining = Math.floor(
            (new Date(data.endTime) - new Date()) / 1000
          );

          setTimer(remaining > 0 ? remaining : 0);
        }
      } catch (err) {
        console.log(err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3️⃣ Fullscreen when active
  useEffect(() => {
    if (active) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [active]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {!active ? (
        <>
          <h1 className="text-3xl font-bold mb-4">📱 Mobile Focus Mode</h1>
          <p className="text-gray-400 mb-6">
            Scan this QR using your mobile browser
          </p>

          <div className="bg-white p-4 rounded-xl">
            <QRCode value={qrUrl} />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">🔒 Focus Active</h1>
          <p className="text-5xl font-mono">
            {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </p>
          <p className="text-gray-400 mt-4">
            Don’t switch tabs or leave the page
          </p>
        </>
      )}
    </div>
  );
}

export default MobileFocus;
