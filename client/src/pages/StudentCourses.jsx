import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function StudentCourses() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await API.get("/courses/all"); // Fetch all courses
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourses();
  }, [user]);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600 mt-1">{course.description}</p>
              <p className="text-gray-500 mt-2 text-sm">
                Mentor: {course.mentorId?.name || "Unknown"}
              </p>

              <button
                onClick={() => navigate(`/chat/start/${course._id}`)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Chat with Mentor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCourses;
