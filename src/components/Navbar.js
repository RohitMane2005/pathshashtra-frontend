import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Brain, BookOpen, Code2,
  Map, Target, Bookmark, Trophy, User,
  LogOut, Menu, X, ChevronLeft, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
  { path: "/quiz", icon: <Brain size={17} />, label: "Career Quiz" },
  { path: "/career", icon: <Target size={17} />, label: "Career AI" },
  { path: "/study", icon: <BookOpen size={17} />, label: "Study Planner" },
  { path: "/coding", icon: <Code2 size={17} />, label: "Coding Tutor" },
  { path: "/roadmap", icon: <Map size={17} />, label: "Roadmap" },
  { path: "/leaderboard", icon: <Trophy size={17} />, label: "Leaderboard" },
  { path: "/bookmarks", icon: <Bookmark size={17} />, label: "Bookmarks" },
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
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: "rgba(9,9,11,0.92)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(16px)" }}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-black text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-white text-sm" style={{ fontFamily: "Space Grotesk" }}>
            PathShashtra
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-[#71717a] hover:text-white transition-all"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile spacer ── */}
      <div className="lg:hidden h-14" />

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-bold">P</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-white text-sm truncate"
                style={{ fontFamily: "Space Grotesk" }}>
                PathShashtra
              </span>
            )}
          </Link>
          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-6 h-6 rounded-md items-center justify-center text-[#52525b] hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2">
            <span className="text-[10px] font-semibold text-[#52525b] uppercase tracking-widest">Menu</span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group relative ${active
                    ? "text-white"
                    : "text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/[0.03]"
                  }`}
                style={active ? {
                  background: "var(--amber-bg)",
                  color: "#f59e0b",
                } : {}}
              >
                {/* Icon */}
                <span className={`flex-shrink-0 transition-colors ${active ? "text-amber-500" : "text-[#52525b] group-hover:text-[#71717a]"}`}>
                  {item.icon}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {/* Active dot */}
                {active && !collapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                )}

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-xs font-medium text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="px-3 pb-4 pt-2 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)" }}>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-all ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name?.split(" ")[0]}</p>
                  <p className="text-[#52525b] text-xs truncate">{user?.email}</p>
                </div>
              )}
            </button>

            {/* Profile popup — opens upward */}
            {profileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border overflow-hidden z-50"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                <Link to="/profile"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#a1a1aa] hover:text-white hover:bg-white/[0.03] transition-all"
                  onClick={() => setProfileOpen(false)}>
                  <User size={14} /> My Profile
                </Link>
                <div className="h-px mx-3" style={{ background: "var(--border)" }} />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-400/5 transition-all">
                  <LogOut size={14} /> Sign Out
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
