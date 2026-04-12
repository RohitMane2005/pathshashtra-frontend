import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Brain, BookOpen, Code2,
  Map, Target, Bookmark, Trophy, User,
  LogOut, Menu, X, ChevronLeft, ChevronRight,
  Sparkles
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { path: "/quiz", icon: <Brain size={18} />, label: "Career Quiz", badge: "AI", badgeColor: "#FF6B00" },
  { path: "/career", icon: <Target size={18} />, label: "Career AI", badge: "NEW", badgeColor: "#00D4C8" },
  { path: "/study", icon: <BookOpen size={18} />, label: "Study Planner" },
  { path: "/coding", icon: <Code2 size={18} />, label: "Coding Tutor" },
  { path: "/roadmap", icon: <Map size={18} />, label: "Roadmap" },
  { path: "/leaderboard", icon: <Trophy size={18} />, label: "Leaderboard" },
  { path: "/bookmarks", icon: <Bookmark size={18} />, label: "Bookmarks" },
];

// Sync sidebar collapse state to <main-content> margin
function applyMainContentClass(collapsed) {
  const el = document.querySelector(".main-content");
  if (!el) return;
  if (collapsed) el.classList.add("collapsed");
  else el.classList.remove("collapsed");
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Persist collapse state
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed") === "true";
    setCollapsed(saved);
    applyMainContentClass(saved);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebarCollapsed", next);
    applyMainContentClass(next);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close mobile overlay on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b"
        style={{ background: "rgba(10,10,15,0.95)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}>
            PS
          </div>
          <span className="font-bold text-white text-sm" style={{ fontFamily: "Bricolage Grotesque" }}>
            PathShashtra
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-[#7A7890] hover:text-white transition-all"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile spacer ── */}
      <div className="lg:hidden h-14" />

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}
        style={{ background: "var(--bg2)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}>
              PS
            </div>
            {!collapsed && (
              <span className="font-bold text-white text-sm truncate"
                style={{ fontFamily: "Bricolage Grotesque" }}>
                PathShashtra
              </span>
            )}
          </Link>
          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-6 h-6 rounded-lg items-center justify-center text-[#3D3B52] hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${active
                    ? "text-white"
                    : "text-[#7A7890] hover:text-white hover:bg-white/5"
                  }`}
                style={active ? {
                  background: "rgba(255,107,0,0.12)",
                  borderLeft: "2px solid #FF6B00",
                } : { borderLeft: "2px solid transparent" }}
              >
                {/* Icon */}
                <span className={`flex-shrink-0 transition-colors ${active ? "text-[#FF8C38]" : "text-[#3D3B52] group-hover:text-[#7A7890]"}`}>
                  {item.icon}
                </span>

                {/* Label + badge */}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: `${item.badgeColor}20`,
                          color: item.badgeColor,
                          border: `1px solid ${item.badgeColor}40`,
                        }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                    style={{ background: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* AI badge */}
        {!collapsed && (
          <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(255,107,0,0.07)", border: "1px solid rgba(255,107,0,0.12)" }}>
            <Sparkles size={13} className="text-[#FF8C38] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#FF8C38] uppercase tracking-wider">Powered by AI</p>
              <p className="text-[#3D3B52] text-[10px] truncate">Groq · LLaMA 3.3 70B</p>
            </div>
          </div>
        )}

        {/* User profile footer */}
        <div className="px-3 pb-4 pt-2 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name?.split(" ")[0]}</p>
                  <p className="text-[#3D3B52] text-xs truncate">{user?.email}</p>
                </div>
              )}
            </button>

            {/* Profile popup — opens upward */}
            {profileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border overflow-hidden z-50"
                style={{ background: "#111118", borderColor: "rgba(255,255,255,0.1)" }}>
                <Link to="/profile"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#7A7890] hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => setProfileOpen(false)}>
                  <User size={15} /> My Profile
                </Link>
                <div className="h-px mx-3" style={{ background: "rgba(255,255,255,0.07)" }} />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Close profile popup on outside click */}
      {profileOpen && (
        <div className="fixed inset-0 z-[45]" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
