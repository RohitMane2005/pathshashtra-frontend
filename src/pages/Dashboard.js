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
  Sparkles, Map
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [todayTopics, setTodayTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchData = async () => {
    const [prog, today, probs, quiz] = await Promise.allSettled([
      API.get("/study/progress"),
      API.get("/study/today"),
      API.get("/coding/problems"),
      API.get("/quiz/results"),
    ]);
    if (prog.status === "fulfilled") setProgress(prog.value.data);
    if (today.status === "fulfilled") setTodayTopics(today.value.data);
    if (probs.status === "fulfilled") setProblems(probs.value.data);
    if (quiz.status === "fulfilled") setQuizResults(quiz.value.data);
    setLoading(false);
  };

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0];

  const solvedProblems = problems.filter(p => p.status === "SOLVED").length;
  const xp = solvedProblems * 50 + (progress?.completedTopics || 0) * 30 + quizResults.length * 100;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;

  const modules = [
    {
      icon: <Brain size={22} />,
      title: "Career Quiz",
      desc: "Discover your ideal career path with AI psychometrics",
      path: "/quiz",
      color: "#FF6B00",
      badge: "AI Powered",
      stat: quizResults.length > 0 ? `${quizResults.length} assessment${quizResults.length > 1 ? "s" : ""} done` : "Not started yet",
      cta: quizResults.length > 0 ? "Retake Quiz" : "Start Assessment",
    },
    {
      icon: <BookOpen size={22} />,
      title: "Study Planner",
      desc: "AI-generated adaptive schedule based on your exam",
      path: "/study",
      color: "#00D4C8",
      badge: "Smart Schedule",
      stat: progress ? `${progress.completedTopics}/${progress.totalTopics} topics done` : "No plan yet",
      cta: progress ? "Continue Studying" : "Create Plan",
    },
    {
      icon: <Code2 size={22} />,
      title: "Coding Tutor",
      desc: "DSA problems with AI hints & personalized roadmap",
      path: "/coding",
      color: "#9B6DFF",
      badge: "Any Language",
      stat: `${solvedProblems} problems solved`,
      cta: "Practice Now",
    },
    {
      icon: <Map size={22} />,
      title: "Roadmap Generator",
      desc: "Get a step-by-step AI learning path for any career goal",
      path: "/roadmap",
      color: "#34D399",
      badge: "NEW ✨",
      stat: "Full Stack, ML, DevOps & more",
      cta: "Generate Roadmap",
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content" style={{ paddingTop: "32px" }}>
        <div className="max-w-5xl mx-auto">

          {/* Hero Header */}
          <div className="animate-fade-up mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#7A7890] text-sm mb-1 flex items-center gap-2">
                  <span>{time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
                  <span className="w-1 h-1 rounded-full bg-[#3D3B52]" />
                  <span>{time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </p>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
                  {greeting}, {firstName} 👋
                </h1>
                <p className="text-[#7A7890] mt-1">Your AI-powered success dashboard</p>
              </div>

              {/* Level */}
              <div className="flex items-center gap-3">
                <div className="glass px-4 py-2.5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{level}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">{xp}</p>
                    <p className="text-[#7A7890] text-xs">XP earned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-4 glass p-4">
              <div className="flex justify-between text-xs text-[#7A7890] mb-2">
                <span className="flex items-center gap-1"><Star size={12} className="text-[#FF6B00]" /> Level {level}</span>
                <span>{xpInLevel}/500 XP to Level {level + 1}</span>
              </div>
              <div className="progress-bar">
                <div className="xp-bar h-full rounded-full" style={{ width: `${(xpInLevel / 500) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* AI Daily Brief */}
          <div className="animate-fade-up stagger-1 mb-8">
            <div className="relative overflow-hidden rounded-2xl p-5 border border-[#FF6B00]/20"
              style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(155,109,255,0.05) 100%)" }}>
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={18} className="text-[#FF8C38]" />
                </div>
                <div>
                  <p className="text-[#FF8C38] text-xs font-bold uppercase tracking-wider mb-1">AI Daily Brief</p>
                  <p className="text-white text-sm leading-relaxed">
                    {progress && progress.completedTopics > 0
                      ? `You've completed ${progress.completedTopics} topics so far. ${progress.weakTopicsCount > 0 ? `Focus on your ${progress.weakTopicsCount} weak topics today.` : "Great progress — keep the momentum going!"}`
                      : `Welcome to PathShashtra, ${firstName}! Start by taking the Career Quiz to discover your ideal path, then generate your personalized study plan. 🚀`
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-up stagger-2">
            {[
              { label: "Topics Done", value: progress?.completedTopics || 0, icon: <CheckCircle size={16} />, color: "#00D4C8" },
              { label: "Problems Solved", value: solvedProblems, icon: <Code2 size={16} />, color: "#9B6DFF" },
              { label: "Top Career Match", value: quizResults[0]?.topCareer ?? "—", icon: <Brain size={16} />, color: "#FF6B00" },
              { label: "Study Progress", value: progress ? `${progress.overallPercent}%` : "—", icon: <TrendingUp size={16} />, color: "#34D399" },
            ].map((stat, i) => (
              <div key={i} className="glass p-4 hover:border-white/15 transition-all">
                <div className="flex items-center gap-2 mb-2" style={{ color: stat.color }}>
                  {stat.icon}
                  <span className="text-xs text-[#7A7890]">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>{stat.value}</p>
              </div>
            ))}
          </div>
          )}

          {/* Module Cards */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-up stagger-3">
            {modules.map((mod, i) => (
              <div key={i} className="glass group hover:border-white/15 transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-px opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)` }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${mod.color}20`, color: mod.color }}>
                      {mod.icon}
                    </div>
                    <span className="badge text-[10px]" style={{
                      background: `${mod.color}18`, color: mod.color, border: `1px solid ${mod.color}33`,
                    }}>{mod.badge}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>{mod.title}</h3>
                  <p className="text-[#7A7890] text-sm mb-4 leading-relaxed">{mod.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#3D3B52]">{mod.stat}</span>
                    <Link to={mod.path}
                      className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                      style={{ color: mod.color }}>
                      {mod.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Topics + Recent Problems */}
          <div className="grid md:grid-cols-2 gap-4 animate-fade-up stagger-4">
            <div className="glass p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <Clock size={16} className="text-[#00D4C8]" /> Today's Topics
                </h3>
                <Link to="/study" className="text-xs text-[#7A7890] hover:text-white transition-colors">View all →</Link>
              </div>
              {todayTopics.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[#3D3B52] text-sm">No topics for today</p>
                  <Link to="/study" className="text-[#00D4C8] text-xs mt-2 block hover:underline">Create a study plan →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTopics.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === "COMPLETED" ? "bg-[#34D399]" : "bg-[#3D3B52]"}`} />
                        <span className={`text-sm ${t.status === "COMPLETED" ? "text-[#7A7890] line-through" : "text-white"}`}>{t.topicName}</span>
                      </div>
                      <span className="text-xs text-[#3D3B52]">{t.subject}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <Zap size={16} className="text-[#9B6DFF]" /> Recent Problems
                </h3>
                <Link to="/coding" className="text-xs text-[#7A7890] hover:text-white transition-colors">View all →</Link>
              </div>
              {problems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[#3D3B52] text-sm">No problems attempted yet</p>
                  <Link to="/coding" className="text-[#9B6DFF] text-xs mt-2 block hover:underline">Start practicing →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {problems.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          p.difficulty === "EASY" ? "bg-[#34D399]" :
                          p.difficulty === "MEDIUM" ? "bg-[#FBBF24]" : "bg-[#F87171]"}`} />
                        <span className="text-white text-sm truncate max-w-[140px]">{p.title}</span>
                      </div>
                      <span className={`badge text-[10px] ${
                        p.status === "SOLVED" ? "badge-green" :
                        p.status === "REVIEWED" ? "badge-purple" : "badge-orange"}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-[#3D3B52] text-xs mt-8 pb-4">
            PathShashtra · Empowering India's 38M college students 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
