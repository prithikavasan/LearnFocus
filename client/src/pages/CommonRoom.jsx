import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const CommonRoom = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await API.get(`/rooms/${roomId}`);
        setRoom(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading Room...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* Room Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">{room.title}</h1>
          <p className="text-gray-500">Room Code: {room.roomCode}</p>
        </div>

        {/* Instructor */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Instructor</h2>
          <div className="bg-blue-50 p-3 rounded-lg">
            {room.instructor?.name} ({room.instructor?.email})
          </div>
        </div>

        {/* Students */}
        <div>
          <h2 className="font-semibold mb-2">Students</h2>
          {room.students.length === 0 ? (
            <p className="text-gray-500">No students joined yet.</p>
          ) : (
            <div className="space-y-2">
              {room.students.map((s, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  {s.student?.name} ({s.student?.email})
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CommonRoom;
