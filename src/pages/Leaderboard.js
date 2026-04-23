import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Trophy, Code2, BookOpen, Brain } from "lucide-react";

const medal = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users/leaderboard").then(r => setBoard(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Leaderboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 4 }}>Top students ranked by XP</p>
        <p style={{ color: "var(--text-light)", fontSize: 12, marginBottom: 24 }}>XP = solved × 50 + topics × 30 + quizzes × 100</p>

        {loading ? (
          <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: 28, height: 14, background: "#f0f0f0", borderRadius: 4 }} />
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0" }} />
                <div style={{ flex: 1 }}><div style={{ width: 100, height: 12, background: "#f0f0f0", borderRadius: 4, marginBottom: 4 }} /><div style={{ width: 60, height: 10, background: "#f0f0f0", borderRadius: 4 }} /></div>
                <div style={{ width: 40, height: 16, background: "#f0f0f0", borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : board.length === 0 ? (
          <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
            <Trophy size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
            <p style={{ fontWeight: 500 }}>No entries yet</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Be the first to earn XP</p>
          </div>
        ) : (
          <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
            {board.map((entry, i) => {
              const isMe = entry.email === user?.email;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                  borderBottom: i < board.length - 1 ? "1px solid #f0f0f0" : "none",
                  background: isMe ? "var(--green-bg)" : "transparent",
                }}>
                  <div style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
                    {i < 3 ? <span style={{ fontSize: 16 }}>{medal[i]}</span> : <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 13 }}>#{i + 1}</span>}
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", flexShrink: 0 }}>
                    {entry.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: 14, color: isMe ? "var(--green)" : "var(--text)" }}>
                      {entry.name} {isMe && <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: 12 }}>(you)</span>}
                    </p>
                    <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "var(--purple)" }}><Code2 size={10} /> {entry.problems}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "var(--green)" }}><BookOpen size={10} /> {entry.topics}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "var(--orange)" }}><Brain size={10} /> {entry.quizzes}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 15 }}>{entry.xp.toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: "var(--text-light)" }}>XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Leaderboard;
