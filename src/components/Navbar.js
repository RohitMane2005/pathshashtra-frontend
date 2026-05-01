import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User, ChevronDown, Bell } from "lucide-react";
import API from "../api/axios";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/quiz", label: "Quiz" },
  { path: "/career", label: "Career" },
  { path: "/study", label: "Study" },
  { path: "/coding", label: "Coding" },
  { path: "/roadmap", label: "Roadmap" },
  { path: "/leaderboard", label: "Board" },
  { path: "/discussions", label: "Forum" },
  { path: "/contests", label: "Contests" },
  { path: "/chat", label: "AI Chat" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      API.get("/notifications/unread-count").then(r => setUnreadCount(r.data?.count || 0)).catch(() => {});
      const interval = setInterval(() => {
        API.get("/notifications/unread-count").then(r => setUnreadCount(r.data?.count || 0)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className="top-navbar">
        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 32, textDecoration: "none" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "#2cbb5d", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700
          }}>P</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>PathShashtra</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hide-mobile" style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              color: isActive(item.path) ? "var(--text)" : "var(--text-muted)",
              background: isActive(item.path) ? "var(--bg-secondary)" : "transparent",
              transition: "all 0.15s", textDecoration: "none",
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Notification Bell + User Section */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <Link to="/notifications" style={{ position: "relative", padding: 6, borderRadius: 6, color: isActive("/notifications") ? "var(--text)" : "var(--text-muted)", transition: "color 0.15s" }}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg)" }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </Link>
          <button onClick={() => setProfileOpen(!profileOpen)} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: "#e8e8e8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, color: "var(--text-secondary)"
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hide-mobile" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown size={14} className="hide-mobile" style={{ color: "var(--text-light)" }} />
          </button>

          {profileOpen && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 4,
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)", width: 200, overflow: "hidden", zIndex: 100,
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{user?.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setProfileOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px", fontSize: 14, color: "var(--text-secondary)",
                textDecoration: "none", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <User size={14} /> Profile
              </Link>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "10px 16px", fontSize: 14, color: "var(--red)",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          marginLeft: 8, color: "var(--text-muted)", padding: 4,
        }} className="mobile-menu-btn">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.3)" }}
          onClick={() => setMobileOpen(false)}>
          <div style={{
            position: "absolute", top: "var(--navbar-h)", left: 0, right: 0,
            background: "var(--bg)", borderBottom: "1px solid var(--border)",
            padding: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }} onClick={e => e.stopPropagation()}>
            {NAV_ITEMS.map(item => (
              <Link key={item.path} to={item.path} style={{
                display: "block", padding: "10px 16px", borderRadius: 6,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                color: isActive(item.path) ? "var(--text)" : "var(--text-muted)",
                background: isActive(item.path) ? "var(--bg-secondary)" : "transparent",
              }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Close profile dropdown on outside click */}
      {profileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 45 }} onClick={() => setProfileOpen(false)} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
