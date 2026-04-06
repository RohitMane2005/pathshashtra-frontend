import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Save, Loader, Star, Code2, BookOpen, Brain, Trash2 } from "lucide-react";
import { ProfileSkeleton } from "../components/Skeleton";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ educationLevel: "", careerGoal: "", experienceLevel: "Beginner", skills: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ problems: 0, topics: 0, quizzes: 0 });

  useEffect(() => { fetchProfile(); fetchStats(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/profile/me");
      if (res.data) setForm({
        educationLevel: res.data.educationLevel || "",
        careerGoal: res.data.careerGoal || "",
        experienceLevel: res.data.experienceLevel || "Beginner",
        skills: res.data.skills || "",
      });
    } catch {} finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const [probs, prog, quiz] = await Promise.allSettled([
        API.get("/coding/problems"), API.get("/study/progress"), API.get("/quiz/results"),
      ]);
      // FIX: /coding/problems returns a paginated Page object, not a flat array
      const probList = probs.status === "fulfilled"
        ? (probs.value.data.content || probs.value.data)
        : [];
      setStats({
        problems: probList.filter(p => p.status === "SOLVED").length,
        topics: prog.status === "fulfilled" ? prog.value.data.completedTopics || 0 : 0,
        quizzes: quiz.status === "fulfilled" ? quiz.value.data.length : 0,
      });
    } catch {}
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("/profile", form);
      toast.success("Profile updated! ✅");
    } catch { toast.error("Failed to save profile"); }
    finally { setSaving(false); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account and all data. This cannot be undone.")) return;
    setDeleting(true);
    try {
      await API.delete("/users/me", { data: { confirm: "DELETE" } });
      logout();
      navigate("/login");
      toast.success("Account deleted");
    } catch (err) {
      if (!err.handled) toast.error("Failed to delete account");
    } finally { setDeleting(false); }
  };

  const xp = stats.problems * 50 + stats.topics * 30 + stats.quizzes * 100;
  const level = Math.floor(xp / 500) + 1;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-2xl mx-auto animate-fade-up">

          {/* Profile Header */}
          <div className="glass-bright p-6 mb-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-2xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #FF6B00, transparent)", transform: "translate(20px,-20px)" }} />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                style={{ fontFamily: "Bricolage Grotesque" }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>{user?.name}</h1>
                <p className="text-[#7A7890] text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-orange">{user?.role || "STUDENT"}</span>
                  <span className="badge badge-purple flex items-center gap-1">
                    <Star size={10} /> Level {level}
                  </span>
                  <span className="badge badge-teal">{xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: <Code2 size={18} />, label: "Problems Solved", value: stats.problems, color: "#9B6DFF" },
              { icon: <BookOpen size={18} />, label: "Topics Done", value: stats.topics, color: "#00D4C8" },
              { icon: <Brain size={18} />, label: "Assessments", value: stats.quizzes, color: "#FF6B00" },
            ].map((s, i) => (
              <div key={i} className="glass p-4 text-center">
                <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>{s.value}</p>
                <p className="text-[#3D3B52] text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="glass-bright p-6">
            <h2 className="text-white font-bold mb-5 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
              <User size={16} className="text-[#FF8C38]" /> Edit Profile
            </h2>

            {loading ? (
              <ProfileSkeleton />
            ) : (
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#7A7890] mb-2">Education Level</label>
                  <input value={form.educationLevel} onChange={e => setForm({...form, educationLevel: e.target.value})}
                    placeholder="e.g. B.Tech Computer Science, 3rd Year" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-[#7A7890] mb-2">Career Goal</label>
                  <input value={form.careerGoal} onChange={e => setForm({...form, careerGoal: e.target.value})}
                    placeholder="e.g. SDE at FAANG, Data Scientist" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-[#7A7890] mb-2">Experience Level</label>
                  <select value={form.experienceLevel} onChange={e => setForm({...form, experienceLevel: e.target.value})} className="input-dark">
                    {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#7A7890] mb-2">Current Skills</label>
                  <textarea value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                    placeholder="Java, Python, React, SQL, Data Structures..." rows={3}
                    className="input-dark resize-none" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                  {saving ? <Loader size={16} className="animate-spin" /> : <><Save size={16} /> Save Profile</>}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[#3D3B52] text-xs mt-6 pb-2">
            Your profile helps AI give better recommendations 🎯
          </p>

          {/* Danger zone */}
          <div className="glass mt-4 p-5 border border-[#F87171]/20">
            <h3 className="text-[#F87171] font-bold text-sm mb-2 flex items-center gap-2">
              <Trash2 size={14} /> Danger Zone
            </h3>
            <p className="text-[#7A7890] text-xs mb-3">
              Permanently delete your account and all data. This cannot be undone.
            </p>
            <button onClick={deleteAccount} disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10 disabled:opacity-40">
              {deleting ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
