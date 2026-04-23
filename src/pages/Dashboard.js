import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuotaBar from "../components/QuotaBar";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Brain, BookOpen, Code2, ArrowRight, Map, Target, CheckCircle, TrendingUp } from "lucide-react";
import { calculateXP, calculateLevel, xpInCurrentLevel } from "../utils/xp";

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [todayTopics, setTodayTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [prog, today, probs, quiz, streakRes] = await Promise.allSettled([
      API.get("/study/progress"), API.get("/study/today"), API.get("/coding/problems"),
      API.get("/quiz/results"), API.get("/users/streak"),
    ]);
    if (prog.status === "fulfilled") setProgress(prog.value.data);
    if (today.status === "fulfilled") setTodayTopics(today.value.data);
    if (probs.status === "fulfilled") { const d = probs.value.data; setProblems(d.content || d); }
    if (quiz.status === "fulfilled") setQuizResults(quiz.value.data);
    if (streakRes.status === "fulfilled") setStreak(streakRes.value.data.streak || 0);
    setLoading(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0];
  const solvedProblems = problems.filter(p => p.status === "SOLVED").length;
  const xp = calculateXP({ solvedProblems, completedTopics: progress?.completedTopics || 0, quizzes: quizResults.length });
  const level = calculateLevel(xp);
  const xpInLevel = xpInCurrentLevel(xp);

  const modules = [
    { icon: <Brain size={18} />, title: "Career Quiz", desc: "AI psychometric assessment", path: "/quiz", stat: quizResults.length > 0 ? `${quizResults.length} done` : "Start now" },
    { icon: <BookOpen size={18} />, title: "Study Planner", desc: "Adaptive study schedule", path: "/study", stat: progress ? `${progress.completedTopics}/${progress.totalTopics}` : "No plan" },
    { icon: <Code2 size={18} />, title: "Coding Tutor", desc: "DSA practice with AI review", path: "/coding", stat: `${solvedProblems} solved` },
    { icon: <Map size={18} />, title: "Roadmap", desc: "Step-by-step learning path", path: "/roadmap", stat: "Any goal" },
    { icon: <Target size={18} />, title: "Career AI", desc: "Deep career analysis", path: "/career", stat: "Explore" },
  ];

  if (loading) return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <div style={{ width: 24, height: 24, border: "3px solid #e5e5e5", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div></div>
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content">
        <div className="page-inner" style={{ maxWidth: 900 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{greeting}, {firstName}</h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {streak > 0 && (
                <div className="lc-card" style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <div><p style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{streak}</p><p style={{ fontSize: 11, color: "var(--text-muted)" }}>day streak</p></div>
                </div>
              )}
              <div className="lc-card" style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--green-bg)", border: "1px solid var(--green-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--green)" }}>{level}</div>
                <div><p style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{xp}</p><p style={{ fontSize: 11, color: "var(--text-muted)" }}>XP</p></div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="lc-card" style={{ marginBottom: 20, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
              <span>Level {level}</span><span>{xpInLevel}/500 XP to next</span>
            </div>
            <div className="lc-progress"><div className="lc-progress-fill" style={{ width: `${(xpInLevel / 500) * 100}%` }} /></div>
          </div>

          <QuotaBar />

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Topics Done", value: progress?.completedTopics || 0, icon: <CheckCircle size={14} />, color: "var(--green)" },
              { label: "Problems Solved", value: solvedProblems, icon: <Code2 size={14} />, color: "var(--purple)" },
              { label: "Top Match", value: quizResults[0]?.topCareer || quizResults[0]?.careerMatches?.[0]?.title || "—", icon: <Brain size={14} />, color: "var(--orange)" },
              { label: "Study Progress", value: progress ? `${progress.overallPercent}%` : "—", icon: <TrendingUp size={14} />, color: "var(--blue)" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: "left", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Modules */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {modules.map((mod, i) => (
              <Link key={i} to={mod.path} className="lc-card" style={{ textDecoration: "none", display: "block", transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: "var(--text-muted)" }}>{mod.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{mod.title}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{mod.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--green)" }}>{mod.stat}</span>
                  <ArrowRight size={14} style={{ color: "var(--text-light)" }} />
                </div>
              </Link>
            ))}
          </div>

          {/* Today + Recent */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="lc-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Today's Topics</span>
                <Link to="/study" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none" }}>View all →</Link>
              </div>
              {todayTopics.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No topics for today. <Link to="/study" style={{ color: "var(--blue)" }}>Create a plan →</Link></p>
              ) : todayTopics.slice(0, 4).map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.status === "COMPLETED" ? "var(--green)" : "#d9d9d9" }} />
                    <span style={{ fontSize: 13, color: t.status === "COMPLETED" ? "var(--text-muted)" : "var(--text)", textDecoration: t.status === "COMPLETED" ? "line-through" : "none" }}>{t.topicName}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-light)" }}>{t.subject}</span>
                </div>
              ))}
            </div>
            <div className="lc-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Problems</span>
                <Link to="/coding" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none" }}>View all →</Link>
              </div>
              {problems.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No problems yet. <Link to="/coding" style={{ color: "var(--blue)" }}>Start practicing →</Link></p>
              ) : problems.slice(0, 4).map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.difficulty === "EASY" ? "var(--green)" : p.difficulty === "MEDIUM" ? "var(--orange)" : "var(--red)" }} />
                    <span style={{ fontSize: 13, color: "var(--text)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                  </div>
                  <span className={`lc-tag lc-tag-${p.status === "SOLVED" ? "green" : p.status === "REVIEWED" ? "purple" : "orange"}`} style={{ fontSize: 11 }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
