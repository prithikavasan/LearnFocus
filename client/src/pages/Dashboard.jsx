import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext); // make sure setUser exists in AuthContext
  const navigate = useNavigate();
  const isStudent = user?.role === "student";

  const allSkills = [
    { id: "dsa", name: "DSA", color: "bg-blue-100" },
    { id: "web", name: "Web Development", color: "bg-green-100" },
    { id: "aptitude", name: "Aptitude", color: "bg-yellow-100" },
    { id: "custom", name: "Custom Skill", color: "bg-purple-100" },
    { id: "os", name: "Operating Systems", color: "bg-pink-100" },
    { id: "dbms", name: "DBMS", color: "bg-indigo-100" },
    { id: "java", name: "Core Java", color: "bg-red-100" },
    { id: "python", name: "Python", color: "bg-teal-100" },
    { id: "mern", name: "MERN Stack", color: "bg-orange-100" },
    { id: "uiux", name: "UI/UX Design", color: "bg-gray-100" },
    { id: "machine", name: "Machine Learning", color: "bg-lime-100" },
    { id: "cloud", name: "Cloud Computing", color: "bg-cyan-100" },
  ];

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(""); // For success/error

  // Initialize selected skills from user on page load
  useEffect(() => {
    if (user?.skills) {
      setSelectedSkills(user.skills);
    }
  }, [user]);

  const toggleSkill = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const saveSkills = async () => {
    if (!user) return;
    try {
      setSaving(true);
      setMessage("");
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}/skills`,
        { skills: selectedSkills }
      );
      setUser(res.data); // update context
      setMessage("✅ Skills updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save skills. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {user?.name || "Learner"} 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Select the skills you want to focus on 🚀
      </p>

      {isStudent && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Skills</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allSkills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`cursor-pointer p-4 rounded-lg border transition
                  ${skill.color} 
                  ${selectedSkills.includes(skill.id)
                    ? "border-green-500 ring-2 ring-green-400"
                    : "border-gray-200 hover:ring-1 hover:ring-gray-400"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  {selectedSkills.includes(skill.id) && (
                    <CheckCircle className="text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={saveSkills}
            disabled={saving || selectedSkills.length === 0}
            className={`mt-6 px-6 py-2 rounded-lg text-white transition ${
              saving || selectedSkills.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save Skills"}
          </button>

          <button
  onClick={() => navigate("/mylearning")}
  disabled={selectedSkills.length === 0}
  className={`mt-4 ml-4 px-6 py-2 rounded-lg text-white transition ${
    selectedSkills.length === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  Next →
</button>


          {message && (
            <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
