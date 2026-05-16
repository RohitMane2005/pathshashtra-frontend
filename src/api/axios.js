import axios from "axios";

/**
 * CRIT-01 FIX: axios no longer reads JWT from localStorage or adds Authorization headers.
 * 
 * All requests now include `withCredentials: true` which causes the browser to
 * automatically send the HttpOnly auth cookie with every request.
 * The backend reads the cookie in JwtAuthenticationFilter.
 * 
 * For CORS to allow credentials:
 *   - Backend must set Access-Control-Allow-Credentials: true
 *   - Backend must NOT use Access-Control-Allow-Origin: * (must be explicit origin)
 *   Both are already configured in SecurityConfig.
 */

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : "http://localhost:8080/api",
  withCredentials: true,   // send HttpOnly cookie on every request
  timeout: 90000,          // 90s for AI calls
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Response interceptor ──────────────────────────────────────────────────────

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // No internet / server down
      console.error("[API] Network error:", error.message);
      return Promise.reject({
        ...error,
        userMessage: "No internet connection. Please check your network.",
      });
    }

    const { status } = error.response;

    if (status === 401) {
      // Cookie expired or invalid — redirect to login
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
    }

    if (status === 429) {
      console.warn("[API] Rate limit hit:", error.config?.url);
    }

    if (status === 503) {
      console.warn("[API] Service unavailable:", error.config?.url);
    }

    return Promise.reject(error);
  }
);

export default API;
