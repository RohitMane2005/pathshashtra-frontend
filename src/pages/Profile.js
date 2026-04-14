import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Save, Loader, Star, Code2, BookOpen, Brain, Trash2 } from "lucide-react";
import { ProfileSkeleton } from "../components/Skeleton";
import { calculateXP, calculateLevel } from "../utils/xp";

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
    } catch { } finally { setLoading(false); }
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
    } catch { }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("/profile", form);
      toast.success("Profile updated");
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

  const xp = calculateXP({ solvedProblems: stats.problems, completedTopics: stats.topics, quizzes: stats.quizzes });
  const level = calculateLevel(xp);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-2xl mx-auto animate-fade-up">

          {/* Profile Header */}
          <div className="card p-6 mb-4 relative overflow-hidden">
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ fontFamily: "Space Grotesk" }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{user?.name}</h1>
                <p className="text-[#71717a] text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="badge badge-amber text-[10px]">{user?.role || "STUDENT"}</span>
                  <span className="badge badge-violet text-[10px] flex items-center gap-1">
                    Level {level}
                  </span>
                  <span className="badge badge-green text-[10px]">{xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: <Code2 size={16} />, label: "Problems Solved", value: stats.problems, color: "#8b5cf6" },
              { icon: <BookOpen size={16} />, label: "Topics Done", value: stats.topics, color: "#10b981" },
              { icon: <Brain size={16} />, label: "Assessments", value: stats.quizzes, color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} className="card p-4 text-center">
                <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
                <p className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{s.value}</p>
                <p className="text-[#52525b] text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="card p-6">
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
              <User size={14} className="text-amber-500" /> Edit Profile
            </h2>

            {loading ? (
              <ProfileSkeleton />
            ) : (
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2 font-medium">Education Level</label>
                  <input value={form.educationLevel} onChange={e => setForm({ ...form, educationLevel: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science, 3rd Year" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2 font-medium">Career Goal</label>
                  <input value={form.careerGoal} onChange={e => setForm({ ...form, careerGoal: e.target.value })}
                    placeholder="e.g. SDE at FAANG, Data Scientist" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2 font-medium">Experience Level</label>
                  <select value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })} className="input-dark">
                    {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2 font-medium">Current Skills</label>
                  <textarea value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
                    placeholder="Java, Python, React, SQL, Data Structures..." rows={3}
                    className="input-dark resize-none" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {saving ? <Loader size={15} className="animate-spin" /> : <><Save size={15} /> Save Profile</>}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[#27272a] text-xs mt-5 pb-2">
            Your profile helps AI give better recommendations
          </p>

          {/* Danger zone */}
          <div className="card mt-4 p-5" style={{ borderColor: "var(--rose-border)" }}>
            <h3 className="text-rose-500 font-semibold text-sm mb-2 flex items-center gap-2">
              <Trash2 size={13} /> Danger Zone
            </h3>
            <p className="text-[#71717a] text-xs mb-3">
              Permanently delete your account and all data. This cannot be undone.
            </p>
            <button onClick={deleteAccount} disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border text-rose-400 hover:bg-rose-400/5 disabled:opacity-40"
              style={{ borderColor: "var(--rose-border)" }}>
              {deleting ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
