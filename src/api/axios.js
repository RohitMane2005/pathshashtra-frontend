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
  // CRIT-02 FIX: REACT_APP_API_URL already includes /api suffix — don't append again.
  // e.g. REACT_APP_API_URL=http://localhost:8080/api
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  withCredentials: true,   // send HttpOnly cookie on every request
  timeout: 15000,          // PERF M4: default 15s for quick endpoints (was 90s for everything)
  headers: {
    "Content-Type": "application/json",
  },
});

// ── PERF M4: Per-endpoint timeout overrides ───────────────────────────────────
// AI endpoints need longer timeouts (LLM calls take 5-30s).
// All other endpoints get the 15s default set above.
const AI_TIMEOUT_PATTERNS = [
  "/coding/problem/generate", "/coding/submit", "/coding/hint",
  "/roadmap/generate", "/career/", "/study/plan/generate", "/chat/",
];

API.interceptors.request.use((config) => {
  const url = config.url || "";
  if (AI_TIMEOUT_PATTERNS.some(p => url.includes(p))) {
    config.timeout = 90000; // 90s for AI calls
  }
  return config;
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
      // Skip redirect on pages that handle auth themselves
      const path = window.location.pathname;
      const skipRedirect = ["/login", "/register", "/oauth2/redirect", "/forgot-password", "/reset-password"];
      if (!skipRedirect.some(p => path.includes(p))) {
        window.location.href = "/login";
        // Mark as handled so page-level catch blocks don't double-toast
        error.handled = true;
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
