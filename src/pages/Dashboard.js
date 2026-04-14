import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuotaBar from "../components/QuotaBar";
import { StatSkeleton, CardSkeleton, ListItemSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Brain, BookOpen, Code2, ArrowRight, Flame,
  Zap, TrendingUp, Star, CheckCircle, Clock,
  Sparkles, Map, Target, ArrowUpRight
} from "lucide-react";
import { calculateXP, calculateLevel, xpInCurrentLevel } from "../utils/xp";

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [todayTopics, setTodayTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchData = async () => {
    const [prog, today, probs, quiz, streakRes] = await Promise.allSettled([
      API.get("/study/progress"),
      API.get("/study/today"),
      API.get("/coding/problems"),
      API.get("/quiz/results"),
      API.get("/users/streak"),
    ]);
    if (prog.status === "fulfilled") setProgress(prog.value.data);
    if (today.status === "fulfilled") setTodayTopics(today.value.data);
    if (probs.status === "fulfilled") { const d = probs.value.data; setProblems(d.content || d); }
    if (quiz.status === "fulfilled") setQuizResults(quiz.value.data);
    if (streakRes.status === "fulfilled") setStreak(streakRes.value.data.streak || 0);
    setLoading(false);
  };

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0];

  const solvedProblems = problems.filter(p => p.status === "SOLVED").length;
  const xp = calculateXP({ solvedProblems, completedTopics: progress?.completedTopics || 0, quizzes: quizResults.length });
  const level = calculateLevel(xp);
  const xpInLevel = xpInCurrentLevel(xp);

  const modules = [
    {
      icon: <Brain size={20} />,
      title: "Career Quiz",
      desc: "AI psychometric career assessment",
      path: "/quiz",
      color: "#f59e0b",
      stat: quizResults.length > 0 ? `${quizResults.length} done` : "Start now",
      cta: quizResults.length > 0 ? "Retake" : "Begin",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Study Planner",
      desc: "Adaptive AI-generated schedule",
      path: "/study",
      color: "#10b981",
      stat: progress ? `${progress.completedTopics}/${progress.totalTopics}` : "No plan",
      cta: progress ? "Continue" : "Create",
    },
    {
      icon: <Code2 size={20} />,
      title: "Coding Tutor",
      desc: "DSA practice with AI review",
      path: "/coding",
      color: "#8b5cf6",
      stat: `${solvedProblems} solved`,
      cta: "Practice",
    },
    {
      icon: <Map size={20} />,
      title: "Roadmap",
      desc: "Step-by-step learning path",
      path: "/roadmap",
      color: "#38bdf8",
      stat: "Any goal",
      cta: "Generate",
    },
    {
      icon: <Target size={20} />,
      title: "Career AI",
      desc: "Deep psychometric analysis",
      path: "/career",
      color: "#a78bfa",
      stat: "NEW",
      cta: "Explore",
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="animate-fade-up mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#52525b] text-sm mb-1.5">
                  {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                  {greeting}, {firstName}
                </h1>
              </div>

              {/* Streak + Level */}
              <div className="flex items-center gap-2.5">
                {streak > 0 && (
                  <div className="card px-3.5 py-2 flex items-center gap-2">
                    <span className="flame text-lg">🔥</span>
                    <div>
                      <p className="text-white font-bold text-sm leading-none">{streak}</p>
                      <p className="text-[#52525b] text-[10px]">day streak</p>
                    </div>
                  </div>
                )}
                <div className="card px-3.5 py-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-500 text-[10px] font-bold">{level}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{xp}</p>
                    <p className="text-[#52525b] text-[10px]">XP earned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-5 card p-4">
              <div className="flex justify-between text-xs text-[#71717a] mb-2.5">
                <span className="flex items-center gap-1.5">Level {level}</span>
                <span>{xpInLevel}/500 XP to next</span>
              </div>
              <div className="progress-bar">
                <div className="xp-bar h-full rounded-full" style={{ width: `${(xpInLevel / 500) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* AI Brief */}
          <div className="animate-fade-up stagger-1 mb-6">
            <div className="card p-5 stripe-top">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={15} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-amber-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Daily Brief</p>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">
                    {progress && progress.completedTopics > 0
                      ? `You've completed ${progress.completedTopics} topics so far. ${(progress.weakTopicsCount || 0) > 0 ? `Focus on your ${progress.weakTopicsCount} weak topics today.` : "Great progress — keep going."}`
                      : `Welcome, ${firstName}. Start with the Career Quiz to discover your ideal path, then generate your study plan.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Quota Bar */}
          {!loading && <QuotaBar />}

          {/* Stats Row */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[1, 2, 3, 4].map(i => <StatSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-up stagger-2">
              {[
                { label: "Topics Done", value: progress?.completedTopics || 0, icon: <CheckCircle size={14} />, color: "#10b981" },
                { label: "Problems Solved", value: solvedProblems, icon: <Code2 size={14} />, color: "#8b5cf6" },
                { label: "Top Match", value: quizResults[0]?.topCareer || quizResults[0]?.careerMatches?.[0]?.title || "—", icon: <Brain size={14} />, color: "#f59e0b" },
                { label: "Study Progress", value: progress ? `${progress.overallPercent}%` : "—", icon: <TrendingUp size={14} />, color: "#38bdf8" },
              ].map((stat, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                    <span className="text-[11px] text-[#52525b] font-medium">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Module Cards */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 animate-fade-up stagger-3">
              {modules.map((mod, i) => (
                <Link key={i} to={mod.path} className="card group p-5 hover:border-white/10 transition-all duration-200 block">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${mod.color}12`, color: mod.color }}>
                      {mod.icon}
                    </div>
                    <ArrowUpRight size={14} className="text-[#27272a] group-hover:text-[#52525b] transition-colors" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "Space Grotesk" }}>{mod.title}</h3>
                  <p className="text-[#52525b] text-xs mb-4">{mod.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium" style={{ color: mod.color }}>{mod.stat}</span>
                    <span className="text-xs text-[#71717a] font-medium group-hover:text-white transition-colors flex items-center gap-1">
                      {mod.cta} <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Today's Topics + Recent Problems */}
          <div className="grid md:grid-cols-2 gap-3 animate-fade-up stagger-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                  <Clock size={14} className="text-emerald-500" /> Today's Topics
                </h3>
                <Link to="/study" className="text-xs text-[#52525b] hover:text-white transition-colors">View all →</Link>
              </div>
              {todayTopics.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[#52525b] text-sm">No topics for today</p>
                  <Link to="/study" className="text-emerald-500 text-xs mt-2 block hover:underline">Create a study plan →</Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {todayTopics.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.status === "COMPLETED" ? "bg-emerald-500" : "bg-[#27272a]"}`} />
                        <span className={`text-sm ${t.status === "COMPLETED" ? "text-[#52525b] line-through" : "text-[#a1a1aa]"}`}>{t.topicName}</span>
                      </div>
                      <span className="text-xs text-[#27272a]">{t.subject}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                  <Code2 size={14} className="text-violet-400" /> Recent Problems
                </h3>
                <Link to="/coding" className="text-xs text-[#52525b] hover:text-white transition-colors">View all →</Link>
              </div>
              {problems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[#52525b] text-sm">No problems yet</p>
                  <Link to="/coding" className="text-violet-400 text-xs mt-2 block hover:underline">Start practicing →</Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {problems.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.difficulty === "EASY" ? "bg-emerald-500" :
                          p.difficulty === "MEDIUM" ? "bg-amber-500" : "bg-rose-500"}`} />
                        <span className="text-[#a1a1aa] text-sm truncate max-w-[160px]">{p.title}</span>
                      </div>
                      <span className={`badge text-[10px] ${p.status === "SOLVED" ? "badge-green" :
                        p.status === "REVIEWED" ? "badge-violet" : "badge-amber"}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-[#27272a] text-xs mt-8 pb-4">
            PathShashtra · Built for India's students
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
