import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Sparkles, Loader, ChevronRight, ChevronLeft,
  Target, TrendingUp, DollarSign, Zap, Brain,
  MapPin, Building2, ArrowRight, RefreshCw,
  CheckCircle2, Star, AlertCircle, Clock,
  BarChart3, Trophy, Lightbulb, BookOpen
} from "lucide-react";

// ─── Career result sub-components ──────────────────────────────────────────

const TraitBadge = ({ trait }) => (
  <span className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
    style={{ background: "rgba(155,109,255,0.08)", color: "#C4A3FF", borderColor: "rgba(155,109,255,0.2)" }}>
    {trait}
  </span>
);

const CareerCard = ({ career, rank }) => {
  const colors = ["#FF6B00", "#00D4C8", "#9B6DFF"];
  const color = colors[rank] || "#7A7890";
  const rankLabels = ["🥇 Best Match", "🥈 Great Fit", "🥉 Also Suits"];

  return (
    <div className="glass hover:border-white/15 transition-all duration-300 overflow-hidden"
      style={{ borderLeft: `3px solid ${color}` }}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold mb-1 block" style={{ color }}>{rankLabels[rank]}</span>
            <h3 className="text-white font-bold text-lg" style={{ fontFamily: "Bricolage Grotesque" }}>
              {career.title}
            </h3>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-3xl font-black" style={{ color, fontFamily: "Bricolage Grotesque" }}>
              {career.matchPercent}%
            </div>
            <div className="text-xs text-[#7A7890]">match</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${career.matchPercent}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
        </div>

        {/* Why it fits */}
        <p className="text-[#7A7890] text-sm mb-4 leading-relaxed">{career.whyItFits}</p>

        {/* Key skills */}
        <div className="mb-3">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Key Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {career.keySkills.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs border"
                style={{ background: `${color}10`, color, borderColor: `${color}30` }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Market + Companies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          <div className="flex items-start gap-2 p-3 rounded-xl border border-white/7">
            <TrendingUp size={13} className="text-[#34D399] mt-0.5 flex-shrink-0" />
            <p className="text-[#7A7890] text-xs leading-relaxed">{career.indianMarketOutlook}</p>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl border border-white/7">
            <Building2 size={13} className="text-[#FBBF24] mt-0.5 flex-shrink-0" />
            <p className="text-[#7A7890] text-xs leading-relaxed">{career.topCompanies}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalaryCard = ({ salary }) => (
  <div className="glass p-5">
    <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
      <DollarSign size={16} className="text-[#34D399]" /> Salary Insights — {salary.role}
    </h3>
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: "Entry Level", value: salary.entryLevel, color: "#34D399" },
        { label: "Mid Level", value: salary.midLevel, color: "#FBBF24" },
        { label: "Senior Level", value: salary.seniorLevel, color: "#FF6B00" },
      ].map(({ label, value, color }) => (
        <div key={label} className="p-3 rounded-xl border border-white/7 text-center">
          <p className="text-xs text-[#7A7890] mb-1">{label}</p>
          <p className="font-bold text-sm" style={{ color, fontFamily: "Bricolage Grotesque" }}>{value}</p>
        </div>
      ))}
    </div>
    <div className="flex items-start gap-2 p-3 rounded-xl border border-white/7 mb-2">
      <TrendingUp size={13} className="text-[#34D399] mt-0.5 flex-shrink-0" />
      <p className="text-[#7A7890] text-sm">{salary.growthOutlook}</p>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <MapPin size={13} className="text-[#9B6DFF]" />
      <span className="text-[#7A7890] text-xs">{salary.topHiringCities}</span>
    </div>
  </div>
);

const NextStepCard = ({ step }) => {
  const timeColors = {
    "This week": "#34D399",
    "Next month": "#FBBF24",
    "In 3 months": "#FF6B00",
  };
  const color = Object.entries(timeColors).find(([k]) => step.timeframe?.includes(k.split(" ")[1]))?.[1] || "#7A7890";

  return (
    <div className="flex gap-4 p-4 glass hover:border-white/15 transition-all">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ background: "rgba(155,109,255,0.15)", color: "#9B6DFF" }}>
        {step.step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-white font-semibold text-sm">{step.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
            {step.timeframe}
          </span>
        </div>
        <p className="text-[#7A7890] text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
};

// ─── Past assessment card ───────────────────────────────────────────────────

const PastAssessmentCard = ({ assessment, onView }) => (
  <button onClick={() => onView(assessment.id)}
    className="w-full glass hover:border-white/15 transition-all p-5 text-left">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={14} className="text-[#FF6B00]" />
          <p className="text-white font-semibold">{assessment.topCareer || "Career Assessment"}</p>
          {assessment.topMatchScore && (
            <span className="badge text-xs" style={{ background: "rgba(255,107,0,0.1)", color: "#FF8C38", border: "1px solid rgba(255,107,0,0.2)" }}>
              {assessment.topMatchScore}% match
            </span>
          )}
        </div>
        <p className="text-[#7A7890] text-sm line-clamp-2">{assessment.personalitySummary}</p>
        <p className="text-[#3D3B52] text-xs mt-1">
          {assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
          }) : ""}
        </p>
      </div>
      <ArrowRight size={16} className="text-[#3D3B52] flex-shrink-0 ml-3" />
    </div>
  </button>
);

// ─── Main Career page ───────────────────────────────────────────────────────

const Career = () => {
  const [step, setStep] = useState("home"); // home | loading-q | quiz | submitting | result | history
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await API.get("/career/my");
      setHistory(res.data);
    } catch {} finally { setLoadingHistory(false); }
  };

  const startAssessment = async () => {
    setStep("loading-q");
    try {
      const res = await API.get("/career/questions");
      setQuestions(res.data.questions || []);
      setAnswers({});
      setCurrentQ(0);
      setStep("quiz");
    } catch (err) {
      if (!err.handled) toast.error("Failed to load questions. Try again.");
      setStep("home");
    }
  };

  const selectAnswer = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option.charAt(0) }));
  };

  const handleNext = () => {
    if (!answers[currentQ]) { toast.error("Please select an answer"); return; }
    if (currentQ < questions.length - 1) setCurrentQ(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions first");
      return;
    }
    setStep("submitting");
    const orderedAnswers = questions.map((_, i) => answers[i] || "A");
    try {
      const res = await API.post("/career/submit", { answers: orderedAnswers });
      setResult(res.data);
      setStep("result");
      fetchHistory();
      toast.success("Career analysis complete! 🎯");
    } catch (err) {
      if (!err.handled) toast.error("Analysis failed. Please try again.");
      setStep("quiz");
    }
  };

  const viewPastResult = async (id) => {
    try {
      const res = await API.get(`/career/result/${id}`);
      setResult(res.data);
      setStep("result");
      setActiveTab("new");
    } catch (err) { if (!err.handled) toast.error("Failed to load result"); }
  };

  const progress = questions.length ? Math.round(((currentQ + 1) / questions.length) * 100) : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content" style={{ paddingTop: "32px" }}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6 animate-fade-up">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
              AI Career Guidance
            </h1>
            <p className="text-[#7A7890] mt-1">Discover your ideal career path through psychometric assessment</p>
          </div>

          {/* Tabs */}
          {step !== "quiz" && step !== "submitting" && step !== "loading-q" && (
            <div className="flex gap-2 mb-6">
              {[
                { id: "new", label: "🎯 Take Assessment" },
                { id: "history", label: `📋 My Results (${history.length})` },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === t.id
                      ? "bg-[#9B6DFF]/15 text-[#9B6DFF] border border-[#9B6DFF]/20"
                      : "text-[#7A7890] border border-white/7 hover:border-white/15"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === "history" && step !== "result" && (
            <div className="animate-fade-up">
              {loadingHistory ? (
                <div className="flex justify-center py-12">
                  <Loader size={24} className="animate-spin text-[#9B6DFF]" />
                </div>
              ) : history.length === 0 ? (
                <div className="glass-bright p-12 text-center">
                  <p className="text-4xl mb-3">🧠</p>
                  <p className="text-white font-semibold">No assessments yet</p>
                  <p className="text-[#7A7890] text-sm mt-1">Take your first career assessment above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map(a => (
                    <PastAssessmentCard key={a.id} assessment={a} onView={viewPastResult} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── HOME / START ── */}
          {activeTab === "new" && step === "home" && (
            <div className="animate-fade-up space-y-5">
              {/* Hero card */}
              <div className="relative overflow-hidden rounded-2xl p-8 border border-[#9B6DFF]/20"
                style={{ background: "linear-gradient(135deg, rgba(155,109,255,0.08), rgba(0,212,200,0.05))" }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, #9B6DFF, transparent)", transform: "translate(30px,-30px)" }} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 animate-float"
                    style={{ background: "rgba(155,109,255,0.15)" }}>
                    <Brain size={28} className="text-[#9B6DFF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                    Discover Your Perfect Career
                  </h2>
                  <p className="text-[#7A7890] leading-relaxed mb-6">
                    Answer 12 science-backed psychometric questions. Our AI will analyze your personality,
                    strengths, and preferences to match you with the best career paths in the Indian job market.
                  </p>
                  <button onClick={startAssessment}
                    className="btn-primary flex items-center gap-2 text-base px-6 py-3">
                    <Sparkles size={18} /> Start Assessment
                  </button>
                </div>
              </div>

              {/* What you'll get */}
              <div className="glass p-6">
                <h3 className="text-white font-bold mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
                  What you'll get
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: <Target size={16} />, color: "#FF6B00", title: "Top 3 Career Matches", desc: "Ranked by how well they suit your personality" },
                    { icon: <Brain size={16} />, color: "#9B6DFF", title: "Personality Profile", desc: "Understand your unique traits and work style" },
                    { icon: <DollarSign size={16} />, color: "#34D399", title: "Salary Insights", desc: "Entry to senior level salary data for India" },
                    { icon: <Zap size={16} />, color: "#FBBF24", title: "Actionable Next Steps", desc: "Concrete steps to start your career journey" },
                    { icon: <BarChart3 size={16} />, color: "#00D4C8", title: "Skill Gap Analysis", desc: "Know exactly what to learn next" },
                    { icon: <MapPin size={16} />, color: "#FF6B00", title: "Indian Market Data", desc: "Top hiring cities and companies in India" },
                  ].map(({ icon, color, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 p-3 rounded-xl border border-white/7">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}15`, color }}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{title}</p>
                        <p className="text-[#7A7890] text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LOADING QUESTIONS ── */}
          {step === "loading-q" && (
            <div className="glass-bright p-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#9B6DFF]/15 flex items-center justify-center mx-auto mb-5 animate-float">
                <Brain size={30} className="text-[#9B6DFF]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                Personalizing your assessment...
              </h2>
              <p className="text-[#7A7890] text-sm">Crafting questions based on your profile</p>
            </div>
          )}

          {/* ── QUIZ ── */}
          {step === "quiz" && questions.length > 0 && (
            <div className="animate-fade-up">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#7A7890]">Question {currentQ + 1} of {questions.length}</span>
                  <span className="text-[#9B6DFF] font-semibold">{answeredCount}/{questions.length} answered</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, #9B6DFF, #00D4C8)" }} />
                </div>
              </div>

              {/* Question card */}
              <div className="glass-bright p-6 mb-4">
                {/* Category badge */}
                {questions[currentQ]?.category && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
                    style={{ background: "rgba(155,109,255,0.1)", color: "#9B6DFF", borderColor: "rgba(155,109,255,0.2)" }}>
                    {questions[currentQ].category}
                  </span>
                )}

                <h2 className="text-white font-bold text-xl mb-6 leading-snug"
                  style={{ fontFamily: "Bricolage Grotesque" }}>
                  {questions[currentQ]?.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQ]?.options?.map((option, i) => {
                    const isSelected = answers[currentQ] === option.charAt(0);
                    return (
                      <button key={i} onClick={() => selectAnswer(currentQ, option)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "border-[#9B6DFF]/40 text-white"
                            : "border-white/7 text-[#7A7890] hover:border-white/20 hover:text-white"
                        }`}
                        style={isSelected ? { background: "rgba(155,109,255,0.1)" } : {}}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? "border-[#9B6DFF]" : "border-[#3D3B52]"
                          }`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#9B6DFF]" />}
                          </div>
                          <span className="text-sm leading-relaxed">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                  disabled={currentQ === 0}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={16} /> Previous
                </button>

                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <button key={i} onClick={() => setCurrentQ(i)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{
                        background: i === currentQ ? "#9B6DFF" : answers[i] ? "rgba(155,109,255,0.4)" : "rgba(255,255,255,0.1)"
                      }} />
                  ))}
                </div>

                {currentQ < questions.length - 1 ? (
                  <button onClick={handleNext}
                    className="btn-primary flex items-center gap-2">
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleSubmit}
                    disabled={answeredCount < questions.length}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Sparkles size={16} /> Analyze My Career
                  </button>
                )}
              </div>

              {/* Skip to submit if all answered */}
              {answeredCount === questions.length && currentQ < questions.length - 1 && (
                <div className="mt-4 flex justify-center">
                  <button onClick={handleSubmit} className="text-[#9B6DFF] text-sm flex items-center gap-1.5 hover:underline">
                    <CheckCircle2 size={14} /> All answered — Submit now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── SUBMITTING ── */}
          {step === "submitting" && (
            <div className="glass-bright p-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#9B6DFF]/15 flex items-center justify-center mx-auto mb-5 animate-float">
                <Sparkles size={30} className="text-[#9B6DFF]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                Analyzing your answers...
              </h2>
              <p className="text-[#7A7890] text-sm mb-6">Building your personalized career report</p>
              <div className="flex justify-center gap-2">
                {["Reading personality", "Matching careers", "Calculating salaries", "Finalizing report"].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9B6DFF] animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }} />
                    <span className="text-[#3D3B52] text-xs hidden md:block">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === "result" && result && (
            <div className="animate-fade-up space-y-5">

              {/* Reset button */}
              <div className="flex justify-end">
                <button onClick={() => { setStep("home"); setResult(null); setAnswers({}); }}
                  className="btn-ghost flex items-center gap-2 text-sm">
                  <RefreshCw size={14} /> New Assessment
                </button>
              </div>

              {/* Personality overview */}
              <div className="relative overflow-hidden rounded-2xl p-6 border border-[#9B6DFF]/20"
                style={{ background: "linear-gradient(135deg, rgba(155,109,255,0.08), rgba(0,212,200,0.04))" }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, #9B6DFF, transparent)", transform: "translate(20px,-20px)" }} />
                <div className="relative z-10">
                  <span className="badge mb-3 inline-block" style={{ background: "rgba(155,109,255,0.1)", color: "#9B6DFF", border: "1px solid rgba(155,109,255,0.2)" }}>
                    🧠 Your Personality Profile
                  </span>
                  <p className="text-white text-base leading-relaxed mb-3">{result.personalitySummary}</p>
                  <p className="text-[#7A7890] text-sm leading-relaxed mb-4">{result.strengthsOverview}</p>
                  {result.personalityTraits?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.personalityTraits.map((t, i) => <TraitBadge key={i} trait={t} />)}
                    </div>
                  )}
                </div>
              </div>

              {/* Top Careers */}
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <Target size={16} className="text-[#FF6B00]" /> Your Career Matches
                </h3>
                <div className="space-y-4">
                  {result.topCareers?.map((career, i) => (
                    <CareerCard key={i} career={career} rank={i} />
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              {result.skillGaps?.length > 0 && (
                <div className="glass p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                    <BookOpen size={16} className="text-[#FBBF24]" /> Skills to Develop
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skillGaps.map((gap, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl text-sm border"
                        style={{ background: "rgba(251,191,36,0.08)", color: "#FBBF24", borderColor: "rgba(251,191,36,0.2)" }}>
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary Insights */}
              {result.salaryInsight && <SalaryCard salary={result.salaryInsight} />}

              {/* Next Steps */}
              {result.nextSteps?.length > 0 && (
                <div className="glass p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                    <Lightbulb size={16} className="text-[#34D399]" /> Your Action Plan
                  </h3>
                  <div className="space-y-3">
                    {result.nextSteps.map((s, i) => <NextStepCard key={i} step={s} />)}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Career;
