import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { Trophy, Lock, Loader } from "lucide-react";

const Achievements = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/achievements").then(r => setBadges(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const unlocked = badges.filter(b => b.unlocked).length;
  const total = badges.length;

  const categories = { coding: "Coding", streak: "Streaks", quiz: "Quizzes", study: "Study", social: "Community" };
  const grouped = {};
  badges.forEach(b => { const cat = b.category || "other"; if (!grouped[cat]) grouped[cat] = []; grouped[cat].push(b); });

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Achievements</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>{unlocked}/{total} badges unlocked</p>

        {/* Progress bar */}
        <div className="lc-card" style={{ padding: 16, marginBottom: 20 }}>
          <div className="lc-progress" style={{ height: 8 }}>
            <div className="lc-progress-fill" style={{ width: `${total > 0 ? (unlocked/total)*100 : 0}%` }} />
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, textAlign: "center" }}>
            {total - unlocked > 0 ? `${total - unlocked} more to unlock` : "🎉 All badges unlocked!"}
          </p>
        </div>

        {loading ? <div style={{textAlign:"center",padding:40}}><Loader size={20} className="animate-spin" style={{color:"var(--green)"}}/></div> : (
          Object.entries(grouped).map(([cat, catBadges]) => (
            <div key={cat} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                {categories[cat] || cat}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {catBadges.map(b => (
                  <div key={b.key} className="lc-card" style={{
                    padding: 16, textAlign: "center", position: "relative",
                    opacity: b.unlocked ? 1 : 0.45, transition: "all 0.3s",
                    boxShadow: b.unlocked ? "0 0 20px rgba(45,181,93,0.12)" : "none",
                  }}>
                    {!b.unlocked && <Lock size={12} style={{ position: "absolute", top: 10, right: 10, color: "var(--text-light)" }} />}
                    <div style={{ fontSize: 32, marginBottom: 6 }}>{b.emoji}</div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{b.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.desc}</p>
                    {b.unlocked && b.unlockedAt && (
                      <p style={{ fontSize: 11, color: "var(--green)", marginTop: 6, fontWeight: 500 }}>
                        ✓ Unlocked {new Date(b.unlockedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div></div>
    </div>
  );
};

export default Achievements;
