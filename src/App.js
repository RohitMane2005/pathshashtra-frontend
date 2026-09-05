import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

/*
 * PERF C1: Route-level code splitting via React.lazy().
 *
 * Before: All 25 pages + CodeMirror bundled into a single 1 MB main.js.
 * After:  Each page is a separate chunk loaded on-demand.
 *         Initial bundle drops to ~250-350 KB.
 *         CodeMirror (~300 KB) only loads when visiting /coding.
 */
const Landing            = lazy(() => import("./pages/Landing"));
const Login              = lazy(() => import("./pages/Login"));
const Register           = lazy(() => import("./pages/Register"));
const ForgotPassword     = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword      = lazy(() => import("./pages/ResetPassword"));
const OAuth2RedirectHandler = lazy(() => import("./pages/OAuth2RedirectHandler"));
const Dashboard          = lazy(() => import("./pages/Dashboard"));
const StudyPlanner       = lazy(() => import("./pages/StudyPlanner"));
const CodingTutor        = lazy(() => import("./pages/CodingTutor"));
const Profile            = lazy(() => import("./pages/Profile"));
const Roadmap            = lazy(() => import("./pages/Roadmap"));
const Leaderboard        = lazy(() => import("./pages/Leaderboard"));
const Bookmarks          = lazy(() => import("./pages/Bookmarks"));
const SharedResult       = lazy(() => import("./pages/SharedResult"));
const Career             = lazy(() => import("./pages/Career"));
const Discussion         = lazy(() => import("./pages/Discussion"));
const Contests           = lazy(() => import("./pages/Contests"));
const ChatAssistant      = lazy(() => import("./pages/ChatAssistant"));
const Notes              = lazy(() => import("./pages/Notes"));
const Notifications      = lazy(() => import("./pages/Notifications"));
const Achievements       = lazy(() => import("./pages/Achievements"));
const Social             = lazy(() => import("./pages/Social"));
const WeeklyReports      = lazy(() => import("./pages/WeeklyReports"));
const Pricing            = lazy(() => import("./pages/Pricing"));
const NotFound           = lazy(() => import("./pages/NotFound"));

/* Lightweight loading fallback — minimal DOM, no external dependencies */
const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "var(--bg, #070a12)" }}>
    <div style={{ width: 28, height: 28, border: "3px solid rgba(255,255,255,0.1)",
      borderTopColor: "#06b6d4", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"                element={<ErrorBoundary><Landing /></ErrorBoundary>} />
          <Route path="/login"           element={<ErrorBoundary><Login /></ErrorBoundary>} />
          <Route path="/register"        element={<ErrorBoundary><Register /></ErrorBoundary>} />
          <Route path="/forgot-password" element={<ErrorBoundary><ForgotPassword /></ErrorBoundary>} />
          <Route path="/reset-password"  element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
          <Route path="/oauth2/redirect" element={<ErrorBoundary><OAuth2RedirectHandler /></ErrorBoundary>} />
          <Route path="/pricing"         element={<ErrorBoundary><Pricing /></ErrorBoundary>} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/quiz"      element={<Navigate to="/career" />} />
          <Route path="/study"     element={<ProtectedRoute><ErrorBoundary><StudyPlanner /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/coding"    element={<ProtectedRoute><ErrorBoundary><CodingTutor /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/roadmap"   element={<ProtectedRoute><ErrorBoundary><Roadmap /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><ErrorBoundary><Profile /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><ErrorBoundary><Leaderboard /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/bookmarks"   element={<ProtectedRoute><ErrorBoundary><Bookmarks /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/share/:token" element={<ErrorBoundary><SharedResult /></ErrorBoundary>} />
          <Route path="/career" element={<ProtectedRoute><ErrorBoundary><Career /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/discussions" element={<ProtectedRoute><ErrorBoundary><Discussion /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/contests" element={<ProtectedRoute><ErrorBoundary><Contests /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ErrorBoundary><ChatAssistant /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><ErrorBoundary><Notes /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><ErrorBoundary><Notifications /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><ErrorBoundary><Achievements /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><ErrorBoundary><Social /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ErrorBoundary><WeeklyReports /></ErrorBoundary></ProtectedRoute>} />

          {/* HIGH-04 FIX: Show 404 page instead of silently redirecting to landing */}
          <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
