import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, Loader, Code2, BookOpen, Brain, Trash2 } from "lucide-react";
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
    } catch {} finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const [probs, prog, quiz] = await Promise.allSettled([
        API.get("/coding/problems"), API.get("/study/progress"), API.get("/quiz/results"),
      ]);
      const probList = probs.status === "fulfilled" ? (probs.value.data.content || probs.value.data) : [];
      setStats({
        problems: probList.filter(p => p.status === "SOLVED").length,
        topics: prog.status === "fulfilled" ? prog.value.data.completedTopics || 0 : 0,
        quizzes: quiz.status === "fulfilled" ? quiz.value.data.length : 0,
      });
    } catch {}
  };

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await API.post("/profile", form); toast.success("Profile updated"); }
    catch { toast.error("Failed to save profile"); } finally { setSaving(false); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account and all data.")) return;
    // FIX H3: Require password confirmation before account deletion
    const password = window.prompt("Enter your password to confirm account deletion:");
    if (!password) return;
    setDeleting(true);
    try { await API.delete("/users/me", { data: { confirm: "DELETE", password } }); logout(); navigate("/login"); toast.success("Account deleted"); }
    catch (err) { if (!err.handled) toast.error(err.response?.data?.error || "Failed to delete account"); } finally { setDeleting(false); }
  };

  const xp = calculateXP({ solvedProblems: stats.problems, completedTopics: stats.topics, quizzes: stats.quizzes });
  const level = calculateLevel(xp);

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 600 }}>

        {/* Header */}
        <div className="lc-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--green)", flexShrink: 0 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{user?.email}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <span className="lc-tag">{user?.role || "STUDENT"}</span>
                <span className="lc-tag lc-tag-green">Level {level}</span>
                <span className="lc-tag lc-tag-blue">{xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          {[
            { icon: <Code2 size={14} />, label: "Problems", value: stats.problems, color: "var(--purple)" },
            { icon: <BookOpen size={14} />, label: "Topics", value: stats.topics, color: "var(--green)" },
            { icon: <Brain size={14} />, label: "Quizzes", value: stats.quizzes, color: "var(--orange)" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <span style={{ color: s.color, marginBottom: 4, display: "block" }}>{s.icon}</span>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lc-card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Edit Profile</h2>
          {loading ? <ProfileSkeleton /> : (
            <form onSubmit={saveProfile}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Education Level</label>
                <input value={form.educationLevel} onChange={e => setForm({ ...form, educationLevel: e.target.value })} placeholder="e.g. B.Tech CS, 3rd Year" className="lc-input" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Career Goal</label>
                <input value={form.careerGoal} onChange={e => setForm({ ...form, careerGoal: e.target.value })} placeholder="e.g. SDE at FAANG" className="lc-input" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Experience Level</label>
                <select value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })} className="lc-input">
                  {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Skills</label>
                <textarea value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Java, Python, React..." rows={3} className="lc-input" style={{ resize: "vertical" }} />
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
                {saving ? <Loader size={14} className="animate-spin" /> : <><Save size={14} /> Save Profile</>}
              </button>
            </form>
          )}
        </div>

        {/* Danger Zone */}
        <div className="lc-card" style={{ borderColor: "var(--red-border)" }}>
          <h3 style={{ color: "var(--red)", fontWeight: 600, fontSize: 13, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><Trash2 size={12} /> Danger Zone</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Permanently delete your account and all data.</p>
          <button onClick={deleteAccount} disabled={deleting} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
            border: "1px solid var(--red-border)", background: "var(--bg)", color: "var(--red)", cursor: "pointer", opacity: deleting ? 0.4 : 1,
          }}>{deleting ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete account</button>
        </div>
      </div></div>
    </div>
  );
};

export default Profile;
