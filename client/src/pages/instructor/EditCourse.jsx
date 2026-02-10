import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}`).then(res => setCourse(res.data));
  }, [id]);

  const addModule = () => {
    setCourse({
      ...course,
      modules: [...course.modules, { title: "", content: "" }]
    });
  };

  const saveChanges = async () => {
    await API.put(`/courses/${id}`, course);
    alert("Course updated successfully");
    navigate("/instructor/my-courses");
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>

      <input
        className="border p-2 w-full mb-3"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
        placeholder="Course Title"
      />

      <textarea
        className="border p-2 w-full mb-4"
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        placeholder="Description"
      />

      <h2 className="font-semibold mb-2">Modules</h2>

      {course.modules.map((mod, mIndex) => (
  <div key={mIndex} className="mb-6 p-4 bg-gray-100 rounded">
    <input
      className="border p-2 w-full mb-2"
      value={mod.title}
      placeholder="Module title"
      onChange={(e) => {
        const updated = [...course.modules];
        updated[mIndex].title = e.target.value;
        setCourse({ ...course, modules: updated });
      }}
    />

    <textarea
      className="border p-2 w-full mb-3"
      value={mod.description || ""}
      placeholder="Module description"
      onChange={(e) => {
        const updated = [...course.modules];
        updated[mIndex].description = e.target.value;
        setCourse({ ...course, modules: updated });
      }}
    />

    {/* Lessons */}
    {mod.lessons?.map((lesson, lIndex) => (
      <div key={lIndex} className="bg-white p-3 mb-3 rounded">
        <input
          className="border p-2 w-full mb-2"
          value={lesson.title}
          placeholder="Lesson title"
          onChange={(e) => {
            const updated = [...course.modules];
            updated[mIndex].lessons[lIndex].title = e.target.value;
            setCourse({ ...course, modules: updated });
          }}
        />

        <select
          className="border p-2 w-full mb-2"
          value={lesson.type}
          onChange={(e) => {
            const updated = [...course.modules];
            updated[mIndex].lessons[lIndex].type = e.target.value;
            setCourse({ ...course, modules: updated });
          }}
        >
          <option value="text">Text</option>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
        </select>

        <textarea
          className="border p-2 w-full"
          value={lesson.content}
          placeholder="Lesson content / URL"
          onChange={(e) => {
            const updated = [...course.modules];
            updated[mIndex].lessons[lIndex].content = e.target.value;
            setCourse({ ...course, modules: updated });
          }}
        />
      </div>
    ))}
  </div>
))}

      <button
        onClick={addModule}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-3"
      >
        + Add Module
      </button>

      <button
        onClick={saveChanges}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditCourse;
