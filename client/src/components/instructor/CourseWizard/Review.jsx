function Review({ course }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{course.title || "Untitled Course"}</h2>
      <p className="text-gray-700">{course.description || "No description provided"}</p>

      {course.modules.map((module, mi) => (
        <div key={mi} className="border p-4 rounded-xl">
          <h3 className="font-semibold text-lg">{module.title || "Untitled Module"}</h3>
          {module.lessons.length > 0 ? (
            <ul className="ml-4 list-disc mt-2">
              {module.lessons.map((lesson, li) => (
                <li key={li} className="mb-1">
                  <div className="font-medium">{lesson.title || "Untitled Lesson"}</div>
                  {lesson.description && (
                    <div className="text-gray-500 text-sm">{lesson.description}</div>
                  )}
                  {lesson.video && (
                    <div className="text-blue-600 text-sm">
                      🎥 Video: <a href={lesson.video} target="_blank" rel="noopener noreferrer">{lesson.video}</a>
                    </div>
                  )}
                  {lesson.assessment && lesson.assessment.length > 0 && (
                    <ul className="ml-4 list-circle text-sm text-gray-600">
                      {lesson.assessment.map((a, ai) => (
                        <li key={ai}>
                          {a.type === "link" ? (
                            <span>🔗 <a href={a.url} target="_blank" rel="noopener noreferrer">{a.url}</a></span>
                          ) : (
                            <span>❓ {a.question}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ml-4 text-gray-400">No lessons yet</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Review;
