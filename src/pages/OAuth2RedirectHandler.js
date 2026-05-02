import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    // FIX: Handle OAuth error redirects (from failure handler or missing email)
    if (error) {
      navigate("/login", { state: { error } });
      return;
    }

    if (token) {
      // Save token temporarily to fetch user data
      localStorage.setItem("token", token);

      API.get("/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        login(token, res.data);
        navigate("/dashboard");
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login", { state: { error: "Failed to load user profile. Please try again." } });
      });
    } else {
      // FIX: Generic message — not hardcoded to "Google"
      navigate("/login", { state: { error: "Login failed. Please try again." } });
    }
  }, [location, navigate, login]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg-secondary)" }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: "4px solid var(--border)", borderTopColor: "var(--green)", borderRadius: "50%" }}></div>
    </div>
  );
};

export default OAuth2RedirectHandler;
