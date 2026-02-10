import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Edit, ArrowLeft } from "lucide-react";

function ViewCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p className="p-6">Loading course...</p>;
  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/instructor")}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button
          onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
          className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2 rounded-xl hover:bg-yellow-600"
        >
          <Edit size={18} /> Edit Course
        </button>
      </div>

      {/* Course Info */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {course.title}
        </h1>

        <p className="text-gray-600 text-lg mb-4">
          {course.description}
        </p>

        <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm">
          Status: {course.status}
        </span>
      </div>

      {/* Modules */}
      {/* Modules */}
<div>
  <h2 className="text-2xl font-bold mb-4">Course Modules</h2>

  {course.modules.length === 0 ? (
    <p className="text-gray-500 italic">No modules added yet.</p>
  ) : (
    <div className="space-y-6">
      {course.modules.map((module, mIndex) => (
        <div key={mIndex} className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold mb-1">
            Module {mIndex + 1}: {module.title}
          </h3>

          {module.description && (
            <p className="text-gray-600 mb-4">{module.description}</p>
          )}

          {/* Lessons */}
          {module.lessons?.length > 0 ? (
            <div className="space-y-3">
              {module.lessons.map((lesson, lIndex) => (
                <div
                  key={lIndex}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <h4 className="font-semibold">
                    {lIndex + 1}. {lesson.title}
                  </h4>

                  {lesson.type === "video" && (
                    <a
                      href={lesson.content}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Watch Video
                    </a>
                  )}

                  {lesson.type === "pdf" && (
                    <a
                      href={lesson.content}
                      target="_blank"
                      className="text-purple-600 underline"
                    >
                      View PDF
                    </a>
                  )}

                  {lesson.type === "text" && (
                    <p className="text-gray-600">{lesson.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-400">No lessons added</p>
          )}
        </div>
      ))}
    </div>
  )}
</div>
</div>
  );
}

export default ViewCourse;
