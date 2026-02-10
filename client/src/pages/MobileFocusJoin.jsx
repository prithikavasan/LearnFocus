import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function MobileFocusJoin() {
  const { sessionId } = useParams();
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const joinSession = async () => {
      try {
        await API.post("/focus/join", { sessionId });
        setJoined(true);
      } catch (err) {
        setError("Invalid or expired focus session");
      }
    };

    joinSession();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {joined ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">📱 Mobile Connected</h1>
          <p className="text-gray-400">
            You are now synced with desktop focus mode.
          </p>
          <p className="mt-4 text-sm text-red-400">
            ⚠️ Do not switch apps
          </p>
        </div>
      ) : (
        <p>{error || "Connecting..."}</p>
      )}
    </div>
  );
}
export default MobileFocusJoin;