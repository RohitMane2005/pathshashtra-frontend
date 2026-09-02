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
      // Cookie expired or invalid — redirect to login only from protected pages.
      // Public pages (landing, auth pages) must NOT be redirected.
      // Share pages: show a toast but don't redirect — the page is publicly accessible
      // and the 401 just means some personalized content (e.g. "did you bookmark this?")
      // won't be available, not that the whole page is blocked.
      const path = window.location.pathname;
      const isSharePage = path.startsWith("/share/");
      const publicRoutes = [
        "/", "/login", "/register", "/oauth2/redirect",
        "/forgot-password", "/reset-password",
      ];
      const isPublicPage = publicRoutes.some(p =>
        p === "/" ? path === "/" : path.startsWith(p)
      );

      if (isSharePage) {
        // FIX-6: Don't silently swallow 401 on share pages. Show a soft warning
        // so the user knows some features need them to be logged in.
        // Import toast lazily to avoid circular dependency issues.
        import("react-hot-toast").then(({ default: toast }) => {
          toast("Log in to access all features on this page.", { icon: "🔒" });
        }).catch(() => {});
        error.handled = true;
      } else if (!isPublicPage) {
        window.location.href = "/login";
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
