function CourseInfo({ course, setCourse, onSuggest }) {
  return (
    <div className="space-y-5">
      <input
        placeholder="Course Title"
        className="w-full border p-3 rounded-xl"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
      />
      <textarea
        placeholder="Course Description"
        className="w-full border p-3 rounded-xl"
        rows={4}
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <input
        placeholder="Category"
        className="w-full border p-3 rounded-xl"
        value={course.category}
        onChange={(e) => setCourse({ ...course, category: e.target.value })}
      />

      {/* Suggest content button */}
      <button
        type="button"
        onClick={onSuggest}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 mt-3"
      >
        Suggest Content Automatically
      </button>
    </div>
  );
}

export default CourseInfo;
