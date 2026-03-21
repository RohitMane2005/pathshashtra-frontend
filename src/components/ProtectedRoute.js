import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
      <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
