import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Brain, BookOpen, Code2,
  Map, Target, Bookmark, Trophy, User,
  LogOut, Menu, X, ChevronDown, MoreHorizontal
} from "lucide-react";

// Primary nav — always visible on desktop
const PRIMARY_NAV = [
  { path: "/dashboard",   icon: <LayoutDashboard size={17} />, label: "Dashboard" },
  { path: "/quiz",        icon: <Brain size={17} />,           label: "Career Quiz",  badge: "AI" },
  { path: "/career",      icon: <Target size={17} />,          label: "Career AI",    badge: "NEW" },
  { path: "/study",       icon: <BookOpen size={17} />,        label: "Study Planner" },
  { path: "/coding",      icon: <Code2 size={17} />,           label: "Coding Tutor" },
];

// Secondary nav — in "More" dropdown on desktop, shown fully in mobile
const SECONDARY_NAV = [
  { path: "/roadmap",     icon: <Map size={17} />,     label: "Roadmap" },
  { path: "/leaderboard", icon: <Trophy size={17} />,  label: "Leaderboard" },
  { path: "/bookmarks",   icon: <Bookmark size={17} />, label: "Bookmarks" },
];

const ALL_NAV = [...PRIMARY_NAV, ...SECONDARY_NAV];

const badgeStyle = (badge) => ({
  background: badge === "NEW" ? "rgba(0,212,200,0.15)" : "rgba(255,107,0,0.15)",
  color:      badge === "NEW" ? "#00D4C8"               : "#FF8C38",
});

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen]       = useState(false);
  const moreRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const secondaryActive = SECONDARY_NAV.some(i => isActive(i.path));

  const handleLogout = () => { logout(); navigate("/login"); };

  // Close "More" on outside click
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        <div className="max-w-7xl mx-auto px-3 h-14 flex items-center gap-1">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0 mr-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}
            >
              PS
            </div>
            {/* Show name only on very wide screens */}
            <span className="font-bold text-white hidden xl:block whitespace-nowrap"
              style={{ fontFamily: "Bricolage Grotesque" }}>
              PathShashtra
            </span>
          </Link>

          {/* Desktop primary nav — icons only on lg, icons+labels on xl */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive(item.path)
                    ? "bg-white/10 text-white"
                    : "text-[#7A7890] hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded-full hidden xl:inline"
                    style={badgeStyle(item.badge)}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative flex-shrink-0" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                title="More pages"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  secondaryActive || moreOpen
                    ? "bg-white/10 text-white"
                    : "text-[#7A7890] hover:text-white hover:bg-white/5"
                }`}
              >
                <MoreHorizontal size={17} />
                <span className="hidden xl:inline">More</span>
              </button>

              {moreOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-44 rounded-xl border overflow-hidden z-50 py-1"
                  style={{ background: "#111118", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  {SECONDARY_NAV.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                        isActive(item.path)
                          ? "text-white bg-white/8"
                          : "text-[#7A7890] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Push profile to the right */}
          <div className="flex-1 hidden lg:block" />

          {/* Profile dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/7 hover:border-white/15 transition-all"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)" }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-white text-sm hidden sm:block max-w-[72px] truncate">
                {user?.name?.split(" ")[0]}
              </span>
              <ChevronDown size={13} className="text-[#7A7890]" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-xl border overflow-hidden z-50"
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
            className="lg:hidden p-2 rounded-lg text-[#7A7890] hover:text-white transition-all flex-shrink-0 ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile full menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{ background: "rgba(10,10,15,0.98)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="px-4 py-3 space-y-0.5 max-h-[75vh] overflow-y-auto">
              {ALL_NAV.map((item) => (
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
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={badgeStyle(item.badge)}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.07)" }} />
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#7A7890] hover:text-white hover:bg-white/5 transition-all"
              >
                <User size={17} /> My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/5 transition-all"
              >
                <LogOut size={17} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: "56px" }} />

      {/* Backdrop closes all dropdowns */}
      {(profileOpen || moreOpen) && (
        <div className="fixed inset-0 z-40"
          onClick={() => { setProfileOpen(false); setMoreOpen(false); }} />
      )}
    </>
  );
};

export default Navbar;