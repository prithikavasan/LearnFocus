import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  User,
  MoreVertical,
  BookOpen,
  Clock,
  FileText,
  Video,
  CheckCircle,
  Plus,
  Edit,
  Link,
  Copy,
  X,
  Eye,
  EyeOff,
  Trash2,
  Pin
} from "lucide-react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function RoomPage() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalType, setModalType] = useState(null);
const [formData, setFormData] = useState({});
const [activeMenu, setActiveMenu] = useState(null);
const [deleteCourseId, setDeleteCourseId] = useState(null);
const [editingTaskId, setEditingTaskId] = useState(null);
const [editTaskData, setEditTaskData] = useState({});
const [deleteTaskId, setDeleteTaskId] = useState(null);

const [editingCourseId, setEditingCourseId] = useState(null);
const [editCourseData, setEditCourseData] = useState({});


  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await API.get(`/rooms/${roomId}`);
        setRoom(data);
      } catch (error) {
        console.error("Room fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const inviteLink = `${window.location.origin}/join/${room?.roomCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 const handleReset = async (studentId) => {
  try {
    await API.put(`/rooms/${roomId}/students/${studentId}/reset`);

    setRoom((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.student._id === studentId
          ? {
              ...s,
              progress: 0,
              status: "not_started",
              completedTasks: [],
              courseProgress: {},
            }
          : s
      ),
    }));

    setActiveMenu(null);
  } catch (error) {
    console.error("Reset error:", error);
  }
};


const handleRemove = async (studentId) => {
  try {
    await API.delete(`/rooms/${roomId}/students/${studentId}`);

    setRoom((prev) => ({
      ...prev,
      students: prev.students.filter(
        (s) => s.student._id !== studentId
      ),
    }));

    setActiveMenu(null);
  } catch (error) {
    console.error("Remove error:", error);
  }
};


  if (loading) return <div className="p-10">Loading...</div>;
  if (!room) return <div className="p-10">Room not found</div>;

  const pythonQuotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Python is executable pseudocode.",
  "Experience is the name everyone gives to their mistakes."
];

const getRandomQuote = () =>
  pythonQuotes[Math.floor(Math.random() * pythonQuotes.length)];
const isCourseCompletedByAll = (courseId) => {
  if (!room.students.length) return false;

  return room.students.every((s) =>
    s.completedCourses?.includes(courseId)
  );
};


  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10">
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-4xl font-bold">"{room.roomName}"</h1>

            <div className="flex gap-6 mt-6 text-white/90">
              <div className="flex items-center gap-2">
                <User size={18} />
                {room.instructor?.name}
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(room.startTime).toLocaleDateString()} →
                {new Date(room.endTime).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Users size={18} />
                {room.students.length} Students
              </div>
            </div>
          </div>

          {/* 🔥 EDIT + INVITE BUTTONS */}
          <div className="flex gap-4">
            <button className="bg-white/20 px-4 py-2 rounded-lg flex gap-2 items-center">
              <Edit size={16} />
              Edit
            </button>

            <button
              onClick={() => setShowInvite(true)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg flex gap-2 items-center"
            >
              <Link size={16} />
              Invite
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-10 grid grid-cols-2 gap-8">

        {/* STUDENTS */}
        <Card
          title="Student Management"
          icon={<Users size={20} />}
          actionLabel="Invite Student"
          onAction={() => setShowInvite(true)}
        >
          {room.students.map((s) => (
            <div key={s.student._id} className="border rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{s.student.name}</h3>
                 <div className="flex items-center gap-2 mt-1">
  <span
    className={`text-xs px-2 py-1 rounded-full font-medium ${
      s.status === "completed"
        ? "bg-green-100 text-green-700"
        : s.status === "in_progress"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {s.status === "not_started"
      ? "Not Started"
      : s.status === "in_progress"
      ? "In Progress"
      : "Completed"}
  </span>
</div>

                </div>
                <div className="relative">
  <button onClick={() => setActiveMenu(activeMenu === s.student._id ? null : s.student._id)}>
    <MoreVertical size={18} />
  </button>

  {activeMenu === s.student._id && (
    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border w-36 z-10">
      <button
        onClick={() => handleReset(s.student._id)}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        Reset Stats
      </button>

      <button
        onClick={() => handleRemove(s.student._id)}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Remove
      </button>
    </div>
  )}
</div>

              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            </div>
          ))}
        </Card>

        {/* COURSES */}
      <Card
  title="Courses & Learning Path"
  icon={<BookOpen size={20} />}
  actionLabel="Add Course"
  onAction={() => setModalType("course")}
>
  {room.courses.map((course) => {
    const allCompleted = isCourseCompletedByAll(course._id);

    return (
      <div
        key={course._id}
        className={`border rounded-xl p-4 space-y-2 relative transition-all duration-300 ${
          course.hidden
            ? "blur-sm opacity-60 pointer-events-none"
            : ""
        }`}
      >
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            {editingCourseId === course._id ? (
              <>
                <input
                  type="text"
                  value={editCourseData.title}
                  className="border p-2 rounded w-full mb-2"
                  onChange={(e) =>
                    setEditCourseData({
                      ...editCourseData,
                      title: e.target.value,
                    })
                  }
                />

                <textarea
                  value={editCourseData.description}
                  className="border p-2 rounded w-full"
                  onChange={(e) =>
                    setEditCourseData({
                      ...editCourseData,
                      description: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <>
                <div className="font-semibold text-lg">
                  {course.title}
                </div>
                <p className="text-sm text-gray-600">
                  {course.description}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-3 items-center">

            {/* ✅ Completed Indicator */}
            {allCompleted && (
              <div className="group relative cursor-pointer">
                <CheckCircle
                  size={20}
                  className="text-green-600"
                />
                <div className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-8 right-0 whitespace-nowrap">
                  All Students Completed
                </div>
              </div>
            )}

            {/* 👁 Toggle Visibility */}
            <button
              onClick={async () => {
                const updatedCourses = room.courses.map((c) =>
                  c._id === course._id
                    ? { ...c, hidden: !c.hidden }
                    : c
                );

                await API.put(`/rooms/${roomId}/courses`, {
                  courses: updatedCourses,
                });

                const { data } = await API.get(`/rooms/${roomId}`);
                setRoom(data);
              }}
              className="hover:text-blue-600 transition"
            >
              {course.hidden ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

            {/* ✏ Edit */}
            {/* ✏ Edit / Save */}
{editingCourseId === course._id ? (
  <div className="flex gap-2">
    {/* Save Button */}
    <button
      onClick={async () => {
        try {
          const updatedCourses = room.courses.map((c) =>
            c._id === course._id
              ? { ...c, ...editCourseData }
              : c
          );

          await API.put(`/rooms/${roomId}/courses`, {
            courses: updatedCourses,
          });

          const { data } = await API.get(`/rooms/${roomId}`);
          setRoom(data);

          setEditingCourseId(null);
          setEditCourseData({});
        } catch (error) {
          console.error("Error updating course:", error);
        }
      }}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Save
    </button>

    {/* Cancel Button */}
    <button
      onClick={() => {
        setEditingCourseId(null);
        setEditCourseData({});
      }}
      className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition"
    >
      Cancel
    </button>
  </div>
) : (
  <button
    onClick={() => {
      setEditingCourseId(course._id);
      setEditCourseData({
        title: course.title,
        description: course.description,
      });
    }}
    className="hover:text-yellow-600 transition"
  >
    <Edit size={18} />
  </button>
)}

            {/* 🗑 Delete */}
            <button
              onClick={() => setDeleteCourseId(course._id)}
              className="text-red-600 hover:text-red-800 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* 🔒 Hidden Overlay */}
        {course.hidden && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl backdrop-blur-sm">
            <span className="text-sm font-medium text-gray-700">
              Course Hidden
            </span>
          </div>
        )}
      </div>
    );
  })}

  {/* ================= DELETE CONFIRM MODAL ================= */}
  {deleteCourseId && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">
        <h3 className="text-lg font-semibold mb-3">
          Confirm Deletion
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Do you want to delete this course? This action
          cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteCourseId(null)}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              const updatedCourses = room.courses.filter(
                (c) => c._id !== deleteCourseId
              );

              await API.put(`/rooms/${roomId}/courses`, {
                courses: updatedCourses,
              });

              const { data } = await API.get(`/rooms/${roomId}`);
              setRoom(data);

              setDeleteCourseId(null);
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )}
</Card>

        {/* TASKS */}
       <Card
  title="Tasks & Deadlines"
  icon={<Clock size={20} />}
  actionLabel="Add Task"
  onAction={() => setModalType("task")}
>

         {room.tasks.map((task) => (
  <div
    key={task._id}
    className="border rounded-xl p-4 flex justify-between items-start"
  >
    {editingTaskId === task._id ? (
      <div className="flex-1 space-y-3">
        <input
          type="text"
          value={editTaskData.title}
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setEditTaskData({
              ...editTaskData,
              title: e.target.value,
            })
          }
        />

        <input
          type="date"
          value={editTaskData.deadline?.split("T")[0]}
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setEditTaskData({
              ...editTaskData,
              deadline: e.target.value,
            })
          }
        />

        <div className="flex gap-2">
          {/* SAVE */}
          <button
            onClick={async () => {
              try {
                const updatedTasks = room.tasks.map((t) =>
                  t._id === task._id
                    ? { ...t, ...editTaskData }
                    : t
                );

                await API.put(`/rooms/${roomId}/tasks`, {
                  tasks: updatedTasks,
                });

                const { data } = await API.get(`/rooms/${roomId}`);
                setRoom(data);

                setEditingTaskId(null);
                setEditTaskData({});
              } catch (error) {
                console.error("Task update error:", error);
              }
            }}
            className="px-3 py-1 bg-green-600 text-white rounded-lg"
          >
            Save
          </button>

          {/* CANCEL */}
          <button
            onClick={() => {
              setEditingTaskId(null);
              setEditTaskData({});
            }}
            className="px-3 py-1 border rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <>
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-gray-500">
            Due: {new Date(task.deadline).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-3">
          {/* EDIT */}
          <button
            onClick={() => {
              setEditingTaskId(task._id);
              setEditTaskData({
                title: task.title,
                deadline: task.deadline,
              });
            }}
            className="hover:text-yellow-600"
          >
            <Edit size={18} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => setDeleteTaskId(task._id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </>
    )}
  </div>
))}
{deleteTaskId && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">
      <h3 className="text-lg font-semibold mb-3">
        Confirm Task Deletion
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        This task will be permanently deleted.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteTaskId(null)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              const updatedTasks = room.tasks.filter(
                (t) => t._id !== deleteTaskId
              );

              await API.put(`/rooms/${roomId}/tasks`, {
                tasks: updatedTasks,
              });

              const { data } = await API.get(`/rooms/${roomId}`);
              setRoom(data);

              setDeleteTaskId(null);
            } catch (error) {
              console.error("Delete task error:", error);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

        </Card>

        {/* MATERIALS */}
       {/* MATERIALS */}
<Card
  title="Materials"
  icon={<FileText size={20} />}
  actionLabel="Upload Material"
  onAction={() => setModalType("material")}
>
  {[...(room.materials || [])]
    .sort((a, b) => b.isPinned - a.isPinned)   // 🔥 pinned first
    .map((mat) => (
      <div
        key={mat._id}
        className="border rounded-xl p-4 hover:shadow-md transition bg-white"
      >
        {/* Title */}
        <div className="font-semibold text-lg mb-1">
          {mat.title}
        </div>

        {/* Description */}
        {mat.description && (
          <p className="text-sm text-gray-600 mb-3">
            {mat.description}
          </p>
        )}

        {/* Bottom Row */}
        <div className="flex justify-between items-center">

          {/* Open Link */}
          <a
            href={mat.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-indigo-600 hover:underline text-sm"
          >
            <Link size={16} />
            Open Material
          </a>

          {/* Pin / Unpin */}
          <button
  onClick={async () => {
    try {
      const updatedMaterials = room.materials.map((m) =>
        m._id === mat._id
          ? { ...m, isPinned: !m.isPinned }
          : m
      );

      await API.put(`/rooms/${roomId}/materials`, {
        materials: updatedMaterials,
      });

      const { data } = await API.get(`/rooms/${roomId}`);
      setRoom(data);

    } catch (error) {
      console.error("Pin update failed:", error);
    }
  }}
  className={`p-1 rounded transition ${
    mat.isPinned
      ? "text-yellow-500"
      : "text-gray-400 hover:text-yellow-500"
  }`}
>
  <Pin
    size={18}
    fill={mat.isPinned ? "currentColor" : "none"}
  />
</button>

        </div>
      </div>
    ))}
</Card>


        {/* LIVE SESSION */}
        <Card
  title="Live Session"
  icon={<Video size={20} />}
  actionLabel="Add Session"
  onAction={() => setModalType("session")}
>

          {room.liveSession?.meetingLink ? (
            <a
              href={room.liveSession.meetingLink}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Join Session
            </a>
          ) : (
            <p>No session scheduled</p>
          )}
        </Card>
      </div>

      {/* ================= INVITE MODAL ================= */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-8 w-[450px] relative">

            <button
              onClick={() => setShowInvite(false)}
              className="absolute top-4 right-4"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              Invite to Room
            </h2>

            <div className="border rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm truncate">
                {inviteLink}
              </span>

              <button
                onClick={copyToClipboard}
                className="text-indigo-600 flex gap-1 items-center"
              >
                <Copy size={16} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Room Code: <b>{room.roomCode}</b>
            </div>
          </div>
        </div>
      )}

      {modalType && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white rounded-2xl p-8 w-[450px] relative">

      <button
        onClick={() => setModalType(null)}
        className="absolute top-4 right-4"
      >
        <X size={18} />
      </button>

      <h2 className="text-xl font-semibold mb-6 capitalize">
        Add {modalType}
      </h2>

      {/* COURSE FORM */}
      {modalType === "course" && (
        <>
          <input
            type="text"
            placeholder="Course Title"
            className="w-full border p-3 rounded-lg mb-4"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full border p-3 rounded-lg mb-4"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button
            onClick={async () => {
  try {
   const updatedCourses = [
  ...(room.courses || []),
  { ...formData }   // ✅ REMOVE _id
];


await API.put(`/rooms/${roomId}/courses`, {
  courses: updatedCourses,
});


    const { data } = await API.get(`/rooms/${roomId}`);
    setRoom(data);

    setModalType(null);
    setFormData({});
  } catch (error) {
    console.error("Error adding course:", error);
  }
}}

            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Save Course
          </button>
        </>
      )}

      {/* TASK FORM */}
     {modalType === "task" && (
  <>
    <input
      type="text"
      placeholder="Task Title"
      className="w-full border p-3 rounded-lg mb-4"
      onChange={(e) =>
        setFormData({ ...formData, title: e.target.value })
      }
    />

    <input
      type="date"
      className="w-full border p-3 rounded-lg mb-4"
      onChange={(e) =>
        setFormData({ ...formData, deadline: e.target.value })
      }
    />

    <button
      onClick={async () => {
        try {
          const updatedTasks = [
            ...(room.tasks || []),
            { ...formData }
          ];

          await API.put(`/rooms/${roomId}/tasks`, {
            tasks: updatedTasks,
          });

          const { data } = await API.get(`/rooms/${roomId}`);
          setRoom(data);

          setModalType(null);
          setFormData({});
        } catch (error) {
          console.error("Error adding task:", error);
        }
      }}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
    >
      Save Task
    </button>
  </>
)}


      {/* MATERIAL FORM */}
    {modalType === "material" && (
  <>
    <input
      type="text"
      placeholder="Material Title"
      className="w-full border p-3 rounded-lg mb-4"
      onChange={(e) =>
        setFormData({ ...formData, title: e.target.value })
      }
    />

    <textarea
      placeholder="Material Description"
      className="w-full border p-3 rounded-lg mb-4"
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
    />

    <input
      type="text"
      placeholder="Material Link (Google Drive / PDF URL)"
      className="w-full border p-3 rounded-lg mb-4"
      onChange={(e) =>
        setFormData({ ...formData, fileUrl: e.target.value })
      }
    />

    <button
      onClick={async () => {
        try {
          const updatedMaterials = [
            ...(room.materials || []),
            {
              ...formData,
              isPinned: false,   // default
            },
          ];

          await API.put(`/rooms/${roomId}/materials`, {
            materials: updatedMaterials,
          });

          const { data } = await API.get(`/rooms/${roomId}`);
          setRoom(data);

          setModalType(null);
          setFormData({});
        } catch (error) {
          console.error("Error adding material:", error);
        }
      }}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
    >
      Upload Material
    </button>
  </>
)}
      {/* SESSION FORM */}
      {modalType === "session" && (
        <>
          <input
            type="text"
            placeholder="Meeting Link"
            className="w-full border p-3 rounded-lg mb-4"
            onChange={(e) =>
              setFormData({ ...formData, meetingLink: e.target.value })
            }
          />

          <button
            onClick={async () => {
  try {
    await API.put(`/rooms/${roomId}/live`, {
  liveSession: formData,
});


    const { data } = await API.get(`/rooms/${roomId}`);
    setRoom(data);

    setModalType(null);
    setFormData({});
  } catch (error) {
    console.error("Error saving session:", error);
  }
}}

            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Save Session
          </button>
        </>
      )}
    </div>
  </div>
)}


    </div>
  );
}

/* ================= REUSABLE CARD ================= */

function Card({ title, icon, actionLabel, onAction, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 font-semibold text-lg">
          {icon}
          {title}
        </div>

        {actionLabel && (
          <button
            onClick={onAction}
            className="text-indigo-600 flex gap-1 items-center text-sm"
          >
            <Plus size={16} />
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}