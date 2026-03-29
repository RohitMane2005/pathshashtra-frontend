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

// Public routes that should never trigger a redirect to /login
const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.error;

    // FIX: Auto-logout on 401 — but only when NOT already on a public page.
    // Without this check, hitting /login while unauthenticated caused an
    // infinite redirect loop: login page → 401 → redirect to /login → repeat.
    if (status === 401) {
      const currentPath = window.location.pathname;
      const isPublic = PUBLIC_PATHS.some(p => currentPath === p || currentPath.startsWith("/reset-password"));
      if (!isPublic) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // Show rate limit toast centrally
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
