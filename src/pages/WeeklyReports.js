import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { BarChart3, TrendingUp, TrendingDown, Minus, Loader, Calendar } from "lucide-react";

const WeeklyReports = () => {
  const [current, setCurrent] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get("/reports/weekly/current"), API.get("/reports/weekly")])
      .then(([c, r]) => { setCurrent(c.data); setReports(r.data || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const delta = (curr, prev) => {
    if (!prev && prev !== 0) return null;
    const d = curr - prev;
    if (d > 0) return { icon: <TrendingUp size={12} />, color: "var(--green)", text: `+${d}` };
    if (d < 0) return { icon: <TrendingDown size={12} />, color: "var(--red, #ef4444)", text: `${d}` };
    return { icon: <Minus size={12} />, color: "var(--text-muted)", text: "0" };
  };

  if (loading) return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar /><div className="page-content" style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}><Loader size={24} className="animate-spin" style={{ color: "var(--green)" }} /></div></div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Weekly Reports</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>Track your progress week by week</p>

        {/* Current Week */}
        {current && (
          <div className="lc-card" style={{ padding: 20, marginBottom: 20, borderLeft: "3px solid var(--green)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>This Week</h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{current.weekStart} → {current.weekEnd}</p>
              </div>
              <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><BarChart3 size={14} /> Level {current.level}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
              {[
                { label: "Problems", val: current.problemsSolved, prev: current.prevProblems },
                { label: "Topics", val: current.topicsCompleted, prev: current.prevTopics },
                { label: "Quizzes", val: current.quizzesCompleted, prev: current.prevQuizzes },
                { label: "Total XP", val: current.xpTotal, prev: current.prevXp },
              ].map(s => {
                const d = delta(s.val, s.prev);
                return (
                  <div key={s.label} style={{ background: "var(--bg-secondary)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{s.val}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{s.label}</p>
                    {d && <span style={{ fontSize: 11, color: d.color, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>{d.icon} {d.text} vs last week</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Reports */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>PAST WEEKS</h3>
        {reports.length === 0 ? (
          <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
            <Calendar size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
            <p style={{ fontWeight: 500 }}>No past reports</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Reports are generated at the end of each week</p>
          </div>
        ) : reports.map(r => (
          <div key={r.id} className="lc-card" style={{ marginBottom: 8, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{r.weekStart} → {r.weekEnd}</p>
              <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>{r.xpGained} XP</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
              <span>📝 {r.problemsSolved} problems</span>
              <span>📚 {r.topicsCompleted} topics</span>
              <span>🧠 {r.quizzesCompleted} quizzes</span>
              <span>🔥 {r.streakDays}d streak</span>
            </div>
          </div>
        ))}
      </div></div>
    </div>
  );
};

export default WeeklyReports;
