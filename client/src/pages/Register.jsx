import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from 'jwt-decode';
import API from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 4000); // auto-hide after 4s
  };

  const showSuccess = (msg, redirectPath) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
      if (redirectPath) navigate(redirectPath);
    }, 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      showError(
        "Password must be at least 8 characters long and include:\n" +
        "- 1 uppercase letter\n" +
        "- 1 lowercase letter\n" +
        "- 1 number\n" +
        "- 1 special character (@$!%*?#&)"
      );
      return;
    }

    try {
      await API.post("/auth/register", { name: username, email, password, role });
      showSuccess("Account created successfully! Redirecting to login...", "/login");
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
     const decoded = jwt_decode.default(credentialResponse.credential);

const res = await API.post("/auth/google", {
  name: decoded.name,
  email: decoded.email,
  role
});

localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

if (res.data.user.role === "mentor") {
  navigate("/instructor");
} else {
  navigate("/dashboard");
}


localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
navigate("/dashboard");

      showSuccess("Registered via Google! Redirecting...", "/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Google signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 md:px-12">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left - Registration Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-3xl bg-gray-50 shadow-2xl p-8">

            <h2 className="text-3xl font-extrabold text-center text-gray-800">
              Create your account
            </h2>
            <p className="text-center text-gray-500 mt-2 mb-6">
              Start your focused learning journey ✨
            </p>

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

            <div className="flex items-center gap-3 mb-5 mt-5">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">

              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Sign In
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
            <div className="bg-gray-100 rounded-xl p-4 text-center shadow">
              📅 Daily focus tracking
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center shadow">
              📈 Smart progress insights
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center shadow">
              🎓 Mentor guidance
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center shadow">
              🔥 Streak & habit system
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
