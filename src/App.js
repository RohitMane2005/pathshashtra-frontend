import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import StudyPlanner from "./pages/StudyPlanner";
import CodingTutor from "./pages/CodingTutor";
import Profile from "./pages/Profile";
import Roadmap from "./pages/Roadmap";
import Leaderboard from "./pages/Leaderboard";
import Bookmarks from "./pages/Bookmarks";
import SharedResult from "./pages/SharedResult";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A24",
              color: "#F0EEF8",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
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

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/quiz"      element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/study"     element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
          <Route path="/coding"    element={<ProtectedRoute><CodingTutor /></ProtectedRoute>} />
          <Route path="/roadmap"   element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/bookmarks"   element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/share/:token" element={<SharedResult />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
