import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import CourseInfo from "./CourseInfo";
import Modules from "./Modules";
import Lessons from "./Lessons";
import Settings from "./Settings";
import Review from "./Review";

const steps = ["Info", "Modules", "Lessons", "Settings", "Review"];

export default function CreateCourseWizard() {
  const [step, setStep] = useState(0);
  const [loadingAI, setLoadingAI] = useState(false);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    modules: [],
    isPublic: true,
    status: "draft",
  });

  /* ================= SAVE TO DB ================= */
  const saveCourseToDB = async (finalStatus) => {
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...course,
          status: finalStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save course");
        return;
      }

      alert(
        finalStatus === "published"
          ? "Course published successfully 🎉"
          : "Course saved as draft 📝"
      );
    } catch (err) {
      console.error(err);
      alert("Server error while saving course");
    }
  };

  /* ================= ACTIONS ================= */
  const saveDraft = () => {
    saveCourseToDB("draft");
  };

  const publishCourse = () => {
    if (!course.title || !course.description) {
      alert("Please complete course info before publishing");
      return;
    }
    saveCourseToDB("published");
  };

  /* ================= AI SUGGEST ================= */
  const handleAISuggest = async () => {
    if (!course.category) {
      alert("Enter course category first!");
      return;
    }

    setLoadingAI(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: course.category }),
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        alert(data.error || "AI failed");
        return;
      }

      const aiModules = data.map((mod) => ({
        title: mod.moduleTitle || "Untitled Module",
        lessons: (mod.lessons || []).map((l) => ({
          title: l.title || "Untitled Lesson",
          description: l.description || "",
          video: l.youtube || "",
          assessment: l.assessment || [],
        })),
      }));

      setCourse({ ...course, modules: aiModules });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch AI suggestions");
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Create Course
            </h1>
            <p className="text-gray-500">
              Step {step + 1} of {steps.length}
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              course.status === "draft"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {course.status.toUpperCase()}
          </span>
        </div>

        {/* Step Content */}
        {step === 0 && <CourseInfo course={course} setCourse={setCourse} />}
        {step === 1 && <Modules course={course} setCourse={setCourse} />}
        {step === 2 && <Lessons course={course} setCourse={setCourse} />}
        {step === 3 && <Settings course={course} setCourse={setCourse} />}
        {step === 4 && <Review course={course} />}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="px-5 py-2 border rounded-xl disabled:opacity-50"
          >
            Back
          </button>

          <div className="flex gap-4">
            <button
              onClick={saveDraft}
              className="px-6 py-2 border rounded-xl"
            >
              Save Draft
            </button>

            {step === 1 && (
              <button
                onClick={handleAISuggest}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl flex items-center gap-2"
              >
                {loadingAI ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "AI Suggest Modules & Lessons"
                )}
              </button>
            )}

            <button
              onClick={() =>
                step === steps.length - 1
                  ? publishCourse()
                  : setStep(step + 1)
              }
              className="px-6 py-2 bg-green-600 text-white rounded-xl"
            >
              {step === steps.length - 1 ? "Publish Course" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
