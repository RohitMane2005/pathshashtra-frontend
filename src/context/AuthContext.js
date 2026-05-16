import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";

/**
 * CRIT-01 FIX: Auth state is no longer persisted in localStorage.
 * 
 * New flow:
 *  - Login/register: backend sets HttpOnly cookie + returns user object in body
 *  - On mount: call GET /users/me to check if the cookie is still valid
 *  - All API requests automatically include the cookie (axios withCredentials:true)
 *  - The JWT is never accessible to JavaScript — stored only in HttpOnly cookie
 *
 * The `user` object (non-sensitive: name, email, id) is stored in React state
 * and optionally in sessionStorage for fast page reload (sessionStorage is 
 * cleared when the browser/tab closes, unlike localStorage).
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount by calling the protected /users/me endpoint.
  // If the HttpOnly cookie is valid, this succeeds and we get the user.
  // If not, it returns 401 and we treat the user as logged out.
  const checkAuth = useCallback(async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
      // Cache non-sensitive user info in sessionStorage for fast re-renders
      sessionStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      setUser(null);
      sessionStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fast path: restore user from sessionStorage to avoid flash of loading state
    const cached = sessionStorage.getItem("user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {}
    }
    // Always verify against the server in the background
    checkAuth();
  }, [checkAuth]);

  /**
   * Called after successful login/register.
   * The backend sets the HttpOnly cookie — frontend just stores the user object.
   */
  const login = useCallback((userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, []);

  /**
   * Called after logout.
   * Backend clears the cookie via POST /api/auth/logout.
   */
  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // Even if the request fails, clear local state
    } finally {
      setUser(null);
      sessionStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
