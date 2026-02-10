import { AiOutlineVideoCamera, AiOutlineLink } from "react-icons/ai";

function Modules({ course, setCourse }) {
  const addModule = () => {
    setCourse({
      ...course,
      modules: [...course.modules, { title: "", lessons: [] }]
    });
  };

  const updateModule = (index, value) => {
    const updated = [...course.modules];
    updated[index].title = value;
    setCourse({ ...course, modules: updated });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={addModule}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        + Add Module
      </button>

      {course.modules.length === 0 && (
        <p className="text-gray-500 italic">No modules yet. Add a module to start.</p>
      )}

      {course.modules.map((module, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 mb-4 shadow hover:shadow-lg transition"
        >
          <input
            type="text"
            placeholder="Module Title"
            className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
            value={module.title}
            onChange={(e) => updateModule(index, e.target.value)}
          />

          {module.lessons.length > 0 ? (
            <div className="ml-4 mt-2 space-y-1">
              {module.lessons.map((lesson, idx) => (
                <p key={idx} className="text-gray-700 text-sm flex items-center gap-1">
                  • {lesson.title || "Untitled Lesson"}
                  {lesson.video && <AiOutlineVideoCamera className="inline text-blue-500" />}
                  {lesson.assessment?.length > 0 && <AiOutlineLink className="inline text-green-500" />}
                </p>
              ))}
            </div>
          ) : (
            <p className="ml-4 mt-2 text-gray-400 text-sm italic">No lessons yet</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Modules;
