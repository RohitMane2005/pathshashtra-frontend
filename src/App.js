import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
          <Route path="/"                element={<Landing />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/quiz"      element={<Navigate to="/career" />} />
          <Route path="/study"     element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
          <Route path="/coding"    element={<ProtectedRoute><CodingTutor /></ProtectedRoute>} />
          <Route path="/roadmap"   element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/bookmarks"   element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/share/:token" element={<SharedResult />} />
          <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />
          <Route path="/discussions" element={<ProtectedRoute><Discussion /></ProtectedRoute>} />
          <Route path="/contests" element={<ProtectedRoute><Contests /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><WeeklyReports /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
