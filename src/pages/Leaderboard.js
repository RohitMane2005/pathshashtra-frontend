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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content" style={{ paddingTop: "32px" }}>
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-4 animate-float">
              <Trophy size={30} className="text-[#FF8C38]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
              Leaderboard
            </h1>
            <p className="text-[#7A7890] mt-1">Top students ranked by XP earned</p>
            <p className="text-[#3D3B52] text-xs mt-2">
              XP = solved problems × 50 + study topics × 30 + quizzes × 100
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="glass p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="flex-1">
                      <div className="h-4 bg-white/5 rounded w-32 mb-1" />
                      <div className="h-3 bg-white/5 rounded w-24" />
                    </div>
                    <div className="h-6 bg-white/5 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : board.length === 0 ? (
            <div className="glass-bright p-12 text-center">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-white font-semibold">No entries yet</p>
              <p className="text-[#7A7890] text-sm mt-1">Be the first to earn XP!</p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-up">
              {board.map((entry, i) => {
                const isMe = entry.name === user?.name;
                return (
                  <div key={i}
                    className={`glass p-4 flex items-center gap-4 transition-all ${isMe ? "border-[#FF6B00]/30 bg-[#FF6B00]/5" : "hover:border-white/15"}`}>

                    {/* Rank */}
                    <div className="w-10 text-center flex-shrink-0">
                      {i < 3 ? (
                        <span className="text-xl">{medal[i]}</span>
                      ) : (
                        <span className="text-[#3D3B52] font-bold text-sm">#{i + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {entry.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isMe ? "text-[#FF8C38]" : "text-white"}`}>
                        {entry.name} {isMe && <span className="text-xs font-normal">(you)</span>}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[#9B6DFF] text-xs">
                          <Code2 size={10} /> {entry.problems}
                        </span>
                        <span className="flex items-center gap-1 text-[#00D4C8] text-xs">
                          <BookOpen size={10} /> {entry.topics}
                        </span>
                        <span className="flex items-center gap-1 text-[#FF6B00] text-xs">
                          <Brain size={10} /> {entry.quizzes}
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold text-lg" style={{ fontFamily: "Bricolage Grotesque" }}>
                        {entry.xp.toLocaleString()}
                      </p>
                      <p className="text-[#3D3B52] text-xs flex items-center gap-1 justify-end">
                        <Zap size={10} /> XP
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-[#3D3B52] text-xs mt-8 pb-4">
            Updates in real-time · Keep solving to climb the ranks 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
