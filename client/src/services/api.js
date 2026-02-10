import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // Temporary log
    console.log("TOKEN:", token);

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // Optional: set JSON content type
    req.headers["Content-Type"] = "application/json";

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
