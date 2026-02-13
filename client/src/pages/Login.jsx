import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import API from "../services/api";

function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2000);
  };

  const redirectAfterLogin = (userData) => {
  if (!userData.skills || userData.skills.length === 0) {
    navigate("/dashboard"); // New user
  } else {
    navigate("/mylearning"); // Existing user
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await API.post("/auth/login", { email, password, role });

    loginUser(res.data.user, res.data.token);
    showSuccess("Logged in successfully!");

    // 🔥 ONLY THIS LOGIC
    const user = res.data.user;

// 👨‍🏫 Mentor → Instructor Page
if (user.role === "mentor") {
  navigate("/instructor");
  return;
}

// 👨‍🎓 Student logic
if (!user.skills || user.skills.length === 0) {
  navigate("/dashboard");
} else {
  navigate("/mylearning");
}


  } catch (err) {
    showError(err.response?.data?.message || "Login failed");
  }
};

  


  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setSuccess("");

    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await API.post("/auth/google", { name: decoded.name, email: decoded.email, role });
      loginUser(res.data.user, res.data.token);
      showSuccess("Logged in successfully via Google!");
      const user = res.data.user;

if (user.role === "mentor") {
  navigate("/instructor");
} else {
  redirectAfterLogin(user);
}

    } catch (err) {
      showError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 md:px-12">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left - Login Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl p-10">

            <h2 className="text-3xl font-extrabold text-center text-gray-800">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mt-2 mb-8">
              Login to continue your LearnFocus journey ✨
            </p>

            {/* Role Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-3 rounded-xl font-medium text-lg transition ${
                  role === "student"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole("mentor")}
                className={`flex-1 py-3 rounded-xl font-medium text-lg transition ${
                  role === "mentor"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Mentor
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 animate-fade">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 animate-fade">
                {success}
              </div>
            )}

            {/* Google Login */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showError("Google Sign In failed")}
            />

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full border px-5 py-3 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border px-5 py-3 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Info / Content */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-800">
            LearnFocus
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
              Learn with purpose 🎯
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-lg">
            A modern productivity platform designed for students and mentors
            to build consistency, track progress, and grow together.
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-lg">
            <div className="bg-gray-100 rounded-xl p-5 text-center shadow-md">
              📅 Daily focus tracking
            </div>
            <div className="bg-gray-100 rounded-xl p-5 text-center shadow-md">
              📈 Smart progress insights
            </div>
            <div className="bg-gray-100 rounded-xl p-5 text-center shadow-md">
              🎓 Mentor guidance
            </div>
            <div className="bg-gray-100 rounded-xl p-5 text-center shadow-md">
              🔥 Streak & habit system
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
