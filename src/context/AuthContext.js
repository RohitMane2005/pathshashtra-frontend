import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // FIX: only hydrate safe fields — never trust arbitrary stored objects
        setToken(savedToken);
        setUser({ id: parsed.id, name: parsed.name, email: parsed.email, role: parsed.role });
      } catch {
        // Corrupt storage — clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, userData) => {
    // FIX: only persist safe fields — never store password or sensitive server fields
    const safeUser = {
      id:    userData.id,
      name:  userData.name,
      email: userData.email,
      role:  userData.role || "STUDENT",
    };
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(safeUser));
    setToken(tokenValue);
    setUser(safeUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
