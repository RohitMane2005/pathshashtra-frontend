import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import Dashboard from "./pages/Dashboard";

import StudyPlanner from "./pages/StudyPlanner";
import CodingTutor from "./pages/CodingTutor";
import Profile from "./pages/Profile";
import Roadmap from "./pages/Roadmap";
import Leaderboard from "./pages/Leaderboard";
import Bookmarks from "./pages/Bookmarks";
import SharedResult from "./pages/SharedResult";
import Career from "./pages/Career";
import Discussion from "./pages/Discussion";
import Contests from "./pages/Contests";
import ChatAssistant from "./pages/ChatAssistant";
import Notes from "./pages/Notes";
import Notifications from "./pages/Notifications";
import Achievements from "./pages/Achievements";
import Social from "./pages/Social";
import WeeklyReports from "./pages/WeeklyReports";
import NotFound from "./pages/NotFound";

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
        <Routes>
          {/* Public */}
          <Route path="/"                element={<ErrorBoundary><Landing /></ErrorBoundary>} />
          <Route path="/login"           element={<ErrorBoundary><Login /></ErrorBoundary>} />
          <Route path="/register"        element={<ErrorBoundary><Register /></ErrorBoundary>} />
          <Route path="/forgot-password" element={<ErrorBoundary><ForgotPassword /></ErrorBoundary>} />
          <Route path="/reset-password"  element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
          <Route path="/oauth2/redirect" element={<ErrorBoundary><OAuth2RedirectHandler /></ErrorBoundary>} />

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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
