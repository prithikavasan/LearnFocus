import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import learningPaths from "../data/learningPaths";
import { CheckCircle, Circle, ChevronLeft, FileText, Video, Code } from "lucide-react";
import API from "../services/api";

function LearningPath() {
  const { skill } = useParams();
  const navigate = useNavigate();

  const data = learningPaths[skill];
  const [completedSteps, setCompletedSteps] = useState([]);
  const [instructorMaterials, setInstructorMaterials] = useState({});
  const [systemMaterials, setSystemMaterials] = useState({});

  // Fetch materials for all steps dynamically
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!data) return;
      const instr = {};
      const sys = {};

      for (const step of data.steps) {
        try {
          const { data: res } = await API.get(`/materials/${skill}/${encodeURIComponent(step)}`);
          instr[step] = res.instructorMaterials || [];
          sys[step] = res.systemMaterials || [];
        } catch (err) {
          console.error(`Failed to fetch materials for ${step}:`, err);
          instr[step] = [];
          sys[step] = [];
        }
      }
      setInstructorMaterials(instr);
      setSystemMaterials(sys);
    };

    fetchMaterials();
  }, [skill, data]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Learning path not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ChevronLeft className="inline mr-2" size={18} />
          Go Back
        </button>
      </div>
    );
  }

  const toggleComplete = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case "pdf":
      case "article":
        return <FileText className="inline mr-2" size={16} />;
      case "video":
        return <Video className="inline mr-2" size={16} />;
      case "code":
      case "practice":
        return <Code className="inline mr-2" size={16} />;
      default:
        return <FileText className="inline mr-2" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">
        {data.title}
      </h1>

      <div className="max-w-4xl mx-auto">
        {data.steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);

          return (
            <div key={index} className="mb-12">
              {/* Step header */}
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={20} /> : <Circle size={16} />}
                  </div>

                  {index !== data.steps.length - 1 && (
                    <div
                      className={`w-1 h-full mt-1 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>

                <div
                  onClick={() => toggleComplete(index)}
                  className={`cursor-pointer flex-1 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
                    isCompleted
                      ? "bg-green-50 border border-green-300"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p className="text-lg font-semibold text-gray-800">
                    Step {index + 1}: {step}
                  </p>
                  <p
                    className={`mt-1 text-sm font-medium ${
                      isCompleted ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isCompleted ? "Completed" : "Click to mark complete"}
                  </p>
                </div>
              </div>

              {/* Materials Section */}
              <div className="ml-14 mt-4">
                {/* Instructor Materials */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Instructor Materials
                  </h3>
                  {instructorMaterials[step]?.length === 0 && (
                    <p className="text-gray-500 text-sm">No instructor materials uploaded.</p>
                  )}
                  <ul>
                    {instructorMaterials[step]?.map((mat) => (
                      <li key={mat._id} className="my-1">
                        <a
                          href={mat.url}
                          target="_blank"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {getMaterialIcon(mat.type)}
                          {mat.title} ({mat.type})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* System-Curated Materials */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Suggested for You
                  </h3>
                  {systemMaterials[step]?.length === 0 && (
                    <p className="text-gray-500 text-sm">No suggestions available.</p>
                  )}
                  <ul>
                    {systemMaterials[step]?.map((mat) => (
                      <li key={mat._id} className="my-1">
                        <a
                          href={mat.url}
                          target="_blank"
                          className="text-green-600 hover:underline flex items-center"
                        >
                          {getMaterialIcon(mat.type)}
                          {mat.title} ({mat.type})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back button at the bottom */}
      <div className="max-w-4xl mx-auto mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ChevronLeft className="mr-2" size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default LearningPath;
