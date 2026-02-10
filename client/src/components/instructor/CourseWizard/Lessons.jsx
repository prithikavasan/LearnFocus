import { AiOutlineVideoCamera, AiOutlineLink } from "react-icons/ai";

function Lessons({ course, setCourse }) {
  const addLesson = (moduleIndex) => {
    const updated = [...course.modules];
    updated[moduleIndex].lessons.push({
      title: "",
      description: "",
      video: "",
      assessment: []
    });
    setCourse({ ...course, modules: updated });
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updated = [...course.modules];
    updated[moduleIndex].lessons[lessonIndex][field] = value;
    setCourse({ ...course, modules: updated });
  };

  const updateAssessment = (moduleIndex, lessonIndex, value) => {
    const lines = value.split("\n").filter(Boolean);
    const assessments = lines.map((line) => {
      if (line.startsWith("http")) return { type: "link", url: line };
      return { type: "question", question: line };
    });
    updateLesson(moduleIndex, lessonIndex, "assessment", assessments);
  };

  return (
    <div className="space-y-6">
      {course.modules.map((module, mIdx) => (
        <div key={mIdx} className="border rounded-xl p-4 shadow-md mb-4">
          <h3 className="font-semibold text-lg">{module.title || "Untitled Module"}</h3>

          {module.lessons.map((lesson, lIdx) => (
            <div key={lIdx} className="ml-4 mt-4 space-y-2 border-l pl-3">
              <input
                type="text"
                placeholder="Lesson Title"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                value={lesson.title}
                onChange={(e) => updateLesson(mIdx, lIdx, "title", e.target.value)}
              />
              <textarea
                placeholder="Lesson Description"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                rows={2}
                value={lesson.description}
                onChange={(e) => updateLesson(mIdx, lIdx, "description", e.target.value)}
              />
              <input
                type="text"
                placeholder="YouTube Link (optional)"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                value={lesson.video || ""}
                onChange={(e) => updateLesson(mIdx, lIdx, "video", e.target.value)}
              />
              <textarea
                placeholder="Assessments (one per line, link or question)"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                rows={3}
                value={lesson.assessment?.map(a => a.type === "link" ? a.url : a.question).join("\n") || ""}
                onChange={(e) => updateAssessment(mIdx, lIdx, e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={() => addLesson(mIdx)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            + Add Lesson
          </button>
        </div>
      ))}
    </div>
  );
}

export default Lessons;
