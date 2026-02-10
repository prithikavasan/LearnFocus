import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
