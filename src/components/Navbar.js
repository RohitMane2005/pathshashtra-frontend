import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Brain, BookOpen, Code2, User,
  LogOut, Compass, Zap, Menu, X, Trophy, Bookmark
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { path: "/quiz", icon: <Brain size={18} />, label: "Career Quiz", badge: "AI" },
  { path: "/study", icon: <BookOpen size={18} />, label: "Study Planner" },
  { path: "/coding", icon: <Code2 size={18} />, label: "Coding Tutor" },
  { path: "/roadmap", icon: <Compass size={18} />, label: "Roadmap", badge: "NEW" },
  { path: "/profile", icon: <User size={18} />, label: "Profile" },
  { path: "/leaderboard", icon: <Trophy size={18} />, label: "Leaderboard", badge: "🏆" },
  { path: "/bookmarks", icon: <Bookmark size={18} />, label: "Bookmarks" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("See you soon! 👋");
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
          <Compass size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-white" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
          PathShashtra
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                active
                  ? "bg-[#FF6B00]/15 text-[#FF8C38] border border-[#FF6B00]/20"
                  : "text-[#7A7890] hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={active ? "text-[#FF8C38]" : "text-[#3D3B52] group-hover:text-white transition-colors"}>
                {item.icon}
              </span>
              {item.label}
              {item.badge && (
                <span className="ml-auto badge badge-orange text-[10px] py-0.5">{item.badge}</span>
              )}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#FF6B00] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="mt-auto">
        <div className="glass p-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[#7A7890] text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-[#7A7890] hover:text-red-400 hover:bg-red-400/5 rounded-xl text-sm transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0A0A0F]/95 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
            <Compass size={13} className="text-white" />
          </div>
          <span className="text-base font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#7A7890] hover:text-white transition-colors">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`md:hidden sidebar flex flex-col ${mobileOpen ? "open" : ""}`} style={{ paddingTop: "64px" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur border-t border-white/5 flex justify-around py-2 px-2">
        {navItems.filter(item => item.path !== "/roadmap").map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? "text-[#FF8C38]" : "text-[#3D3B52]"}`}>
              {item.icon}
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
