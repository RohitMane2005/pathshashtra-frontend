import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Brain, BookOpen, Code2,
  Map, Target, Bookmark, Trophy, User,
  LogOut, Menu, X, ChevronDown
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard",  icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { path: "/quiz",       icon: <Brain size={18} />,           label: "Career Quiz",  badge: "AI" },
  { path: "/career",     icon: <Target size={18} />,          label: "Career AI",    badge: "NEW" },
  { path: "/study",      icon: <BookOpen size={18} />,        label: "Study Planner" },
  { path: "/coding",     icon: <Code2 size={18} />,           label: "Coding Tutor" },
  { path: "/roadmap",    icon: <Map size={18} />,             label: "Roadmap" },
  { path: "/leaderboard",icon: <Trophy size={18} />,          label: "Leaderboard" },
  { path: "/bookmarks",  icon: <Bookmark size={18} />,        label: "Bookmarks" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
              style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}
            >
              PS
            </div>
            <span
              className="font-bold text-white hidden sm:block"
              style={{ fontFamily: "Bricolage Grotesque" }}
            >
              PathShashtra
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto flex-1 justify-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(item.path)
                    ? "bg-white/10 text-white"
                    : "text-[#7A7890] hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: item.badge === "NEW" ? "rgba(0,212,200,0.15)" : "rgba(255,107,0,0.15)",
                      color: item.badge === "NEW" ? "#00D4C8" : "#FF8C38",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right: profile + mobile toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/7 hover:border-white/15 transition-all"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-white text-sm hidden sm:block max-w-[100px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-[#7A7890]" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border overflow-hidden z-50"
                  style={{ background: "#111118", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#7A7890] hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <div className="h-px mx-3" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-[#7A7890] hover:text-white transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{
              background: "rgba(10,10,15,0.98)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-white/10 text-white"
                      : "text-[#7A7890] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span
                      className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: item.badge === "NEW" ? "rgba(0,212,200,0.15)" : "rgba(255,107,0,0.15)",
                        color: item.badge === "NEW" ? "#00D4C8" : "#FF8C38",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#7A7890] hover:text-white hover:bg-white/5 transition-all"
              >
                <User size={18} /> My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/5 transition-all"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: "56px" }} />

      {/* Close profile dropdown when clicking outside */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
