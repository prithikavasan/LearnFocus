import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function CategoryCourses() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await API.get("/courses/all");
        const filtered = res.data.filter(
          (course) => (course.category || course.title) === category
        );
        setCourses(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-6">{category} Courses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 mt-1">{course.description}</p>
              <p className="text-gray-500 mt-2 text-sm">
                Mentor: {course.mentorId?.name || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryCourses;
