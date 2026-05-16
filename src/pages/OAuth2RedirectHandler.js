import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

/**
 * SEC-01 FIX: OAuth2 code exchange handler.
 *
 * Old flow:  /oauth2/redirect?token=JWT  → stored in localStorage (XSS vulnerable + URL logged)
 * New flow:  /oauth2/redirect?code=CODE  → exchange with backend → HttpOnly cookie set
 *
 * The code is a one-time, 30-second Redis token that maps to the user's email.
 * POST /api/auth/exchange-code consumes the code and sets the HttpOnly auth cookie.
 * We then call /users/me to get the user object for React state.
 */
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      navigate("/login", { state: { error } });
      return;
    }

    if (!code) {
      navigate("/login", { state: { error: "Login failed. Please try again." } });
      return;
    }

    // Exchange the one-time code for an HttpOnly cookie
    API.post("/auth/exchange-code", { code })
      .then(() => {
        // Cookie is now set — fetch the user profile
        return API.get("/users/me");
      })
      .then((res) => {
        login(res.data);       // store user in React state (no JWT in JS!)
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("OAuth exchange failed:", err);
        navigate("/login", {
          state: { error: "Login failed. Please try again." },
        });
      });
  }, [location, navigate, login]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "var(--bg-secondary)",
      flexDirection: "column",
      gap: 16,
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: "4px solid var(--border)",
        borderTopColor: "var(--green)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
        Completing sign-in…
      </p>
    </div>
  );
};

export default OAuth2RedirectHandler;
