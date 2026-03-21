import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.error;

    // Auto-logout on 401
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Show rate limit toast centrally — mark error so page catch blocks
    // can check err.handled and skip showing a second generic toast.
    if (status === 429) {
      toast.error(message || "Daily limit reached. Please try again tomorrow.", {
        duration: 5000,
        icon: "⏳",
      });
      err.handled = true;
    }

    return Promise.reject(err);
  }
);

export default API;
