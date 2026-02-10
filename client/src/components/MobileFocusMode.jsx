import QRCode from "react-qr-code";
import { useEffect, useRef } from "react";
import API from "../services/api";

function MobileFocusMode() {
  // ✅ sessionId generated ONLY ONCE (important)
  const sessionIdRef = useRef(null);

  if (!sessionIdRef.current) {
    sessionIdRef.current = crypto.randomUUID();
  }

  const sessionId = sessionIdRef.current;

  // ✅ Use your frontend URL + port (Vite usually 5173)
  const qrUrl = `http://localhost:5173/mobile-focus/${sessionId}`;


  // ✅ Create focus session ONCE
  useEffect(() => {
    const createSession = async () => {
      try {
        await API.post("/focus/create", { sessionId });
        console.log("✅ Focus session created:", sessionId);
      } catch (err) {
        console.error(
          "❌ Focus create failed:",
          err.response?.data || err.message
        );
      }
    };

    createSession();
  }, []); // ⚠️ empty dependency array is MUST

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-3xl font-bold mb-4">📱 Mobile Focus Mode</h2>

      <p className="text-gray-400 mb-6">
        Scan this QR using your mobile browser
      </p>

      <div className="bg-white p-4 rounded-xl">
        <QRCode value={qrUrl} />
      </div>

      <p className="text-xs text-gray-500 mt-6 break-all">
        Session ID: {sessionId}
      </p>
    </div>
  );
}

export default MobileFocusMode;
