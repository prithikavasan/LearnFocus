import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function CreateRoomModal({ courses, onClose }) {
  const { token } = useContext(AuthContext);

  const [courseId, setCourseId] = useState("");
  const [customPasskey, setCustomPasskey] = useState("");
  const [generatedKey, setGeneratedKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePasskey = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreate = async () => {
    if (!courseId) return alert("Select a course");

    setLoading(true);
    try {
      const res = await API.post(
        "/rooms/create",
        {
          courseId,
          customPasskey: customPasskey || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGeneratedKey(res.data.passkey);
    } catch (err) {
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-3xl shadow-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Create Live Room
        </h2>

        {/* COURSE SELECT */}
        <label className="block text-sm font-medium mb-1">Course</label>
        <select
          className="w-full border rounded-xl p-2 mb-4"
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* PASSKEY */}
        <label className="block text-sm font-medium mb-1">
          Custom Passkey (optional)
        </label>
        <input
          className="w-full border rounded-xl p-2 mb-3"
          placeholder="Enter your own passkey"
          value={customPasskey}
          onChange={(e) => setCustomPasskey(e.target.value)}
        />

        <button
          onClick={() => setCustomPasskey(generatePasskey())}
          className="text-sm text-indigo-600 hover:underline mb-4"
        >
          Auto-generate passkey
        </button>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-xl"
          >
            Cancel
          </button>
        </div>

        {/* RESULT */}
        {generatedKey && (
          <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-xl text-center font-semibold">
            Room Passkey: {generatedKey}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateRoomModal;
