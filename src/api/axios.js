import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

// ─── Request interceptor: attach JWT ────────────────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // FIX: Detect expired JWT client-side before sending to avoid round-trips.
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public routes that should never trigger a redirect to /login
const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/oauth2/redirect"];

// ─── Response interceptor: global error handling ─────────────────────────────
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.error;

    // FIX: Auto-logout on 401 — only when NOT already on a public page.
    if (status === 401) {
      const currentPath = window.location.pathname;
      const isPublic =
        PUBLIC_PATHS.some((p) => currentPath === p) ||
        currentPath.startsWith("/reset-password") ||
        currentPath.startsWith("/share/");
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

    // FIX: Handle AI service unavailable centrally
    if (status === 503) {
      toast.error(message || "AI service is temporarily unavailable. Please try again in a moment.", {
        duration: 6000,
        icon: "🤖",
      });
      err.handled = true;
    }

    return Promise.reject(err);
  }
);

export default API;
