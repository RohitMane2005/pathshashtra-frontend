import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Trophy, Zap, Code2, BookOpen, Brain } from "lucide-react";

const medal = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users/leaderboard")
      .then(r => setBoard(r.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Rankings</p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
              Leaderboard
            </h1>
            <p className="text-[#71717a] mt-1 text-sm">Top students ranked by XP earned</p>
            <p className="text-[#27272a] text-xs mt-2">
              XP = solved problems × 50 + study topics × 30 + quizzes × 100
            </p>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-white/5 rounded w-32 mb-1.5" />
                      <div className="h-2.5 bg-white/5 rounded w-24" />
                    </div>
                    <div className="h-5 bg-white/5 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : board.length === 0 ? (
            <div className="card p-12 text-center">
              <Trophy size={28} className="text-[#27272a] mx-auto mb-3" />
              <p className="text-white font-medium">No entries yet</p>
              <p className="text-[#52525b] text-sm mt-1">Be the first to earn XP</p>
            </div>
          ) : (
            <div className="space-y-2 animate-fade-up">
              {board.map((entry, i) => {
                const isMe = entry.email === user?.email;
                return (
                  <div key={i}
                    className={`card p-4 flex items-center gap-4 transition-all ${isMe ? "border-amber-500/20 bg-amber-500/[0.03]" : ""}`}>

                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {i < 3 ? (
                        <span className="text-lg">{medal[i]}</span>
                      ) : (
                        <span className="text-[#52525b] font-semibold text-sm">#{i + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {entry.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isMe ? "text-amber-500" : "text-white"}`}>
                        {entry.name} {isMe && <span className="text-xs font-normal text-[#71717a]">(you)</span>}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[#8b5cf6] text-xs">
                          <Code2 size={10} /> {entry.problems}
                        </span>
                        <span className="flex items-center gap-1 text-[#10b981] text-xs">
                          <BookOpen size={10} /> {entry.topics}
                        </span>
                        <span className="flex items-center gap-1 text-[#f59e0b] text-xs">
                          <Brain size={10} /> {entry.quizzes}
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold text-base" style={{ fontFamily: "Space Grotesk" }}>
                        {entry.xp.toLocaleString()}
                      </p>
                      <p className="text-[#27272a] text-xs flex items-center gap-1 justify-end">
                        <Zap size={9} /> XP
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-[#27272a] text-xs mt-8 pb-4">
            Updates in real-time · Keep solving to climb
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
