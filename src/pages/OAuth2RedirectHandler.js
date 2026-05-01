import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Assume login takes a token and saves it

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

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
        navigate("/login", { state: { error: "Failed to load user profile." } });
      });
    } else {
      // Handle error, redirect to login
      navigate("/login", { state: { error: "Google login failed. Please try again." } });
    }
  }, [location, navigate, login]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg-secondary)" }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: "4px solid var(--border)", borderTopColor: "var(--green)", borderRadius: "50%" }}></div>
    </div>
  );
};

export default OAuth2RedirectHandler;
