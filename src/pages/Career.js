import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Loader, ChevronRight, ChevronLeft, RefreshCw, TrendingUp, Building2, MapPin, Lightbulb, BookOpen, CheckCircle2 } from "lucide-react";

const Career = () => {
  const [step, setStep] = useState("home");
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
    try { const res = await API.get("/career/my"); setHistory(res.data); } catch {} finally { setLoadingHistory(false); }
  };

  const startAssessment = async () => {
    setStep("loading-q");
    try {
      const res = await API.get("/career/questions");
      setQuestions(res.data.questions || []);
      setAnswers({}); setCurrentQ(0); setStep("quiz");
    } catch (err) { if (!err.handled) toast.error("Failed to load questions"); setStep("home"); }
  };

  const selectAnswer = (qIndex, option) => setAnswers(prev => ({ ...prev, [qIndex]: option.charAt(0) }));

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) { toast.error("Answer all questions first"); return; }
    setStep("submitting");
    try {
      const res = await API.post("/career/submit", { answers: questions.map((_, i) => answers[i]) });
      setResult(res.data); setStep("result"); fetchHistory(); toast.success("Career analysis complete!");
    } catch (err) { if (!err.handled) toast.error("Analysis failed"); setStep("quiz"); }
  };

  const viewPastResult = async (id) => {
    try { const res = await API.get(`/career/result/${id}`); setResult(res.data); setStep("result"); setActiveTab("new"); }
    catch (err) { if (!err.handled) toast.error("Failed to load result"); }
  };

  const progress = questions.length ? Math.round(((currentQ + 1) / questions.length) * 100) : 0;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Career Guidance</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>Psychometric assessment for career discovery</p>

        {step !== "quiz" && step !== "submitting" && step !== "loading-q" && (
          <div className="lc-tabs">
            {[{ id: "new", label: "Take Assessment" }, { id: "history", label: `My Results (${history.length})` }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`lc-tab ${activeTab === t.id ? "active" : ""}`}>{t.label}</button>
            ))}
          </div>
        )}

        {/* History */}
        {activeTab === "history" && step !== "result" && (
          loadingHistory ? <div style={{ textAlign: "center", padding: 40 }}><Loader size={20} className="animate-spin" style={{ color: "var(--green)" }} /></div> :
          history.length === 0 ? <div className="lc-card" style={{ textAlign: "center", padding: 40 }}><p style={{ color: "var(--text-muted)" }}>No assessments yet</p></div> :
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map(a => (
              <button key={a.id} onClick={() => viewPastResult(a.id)} className="lc-card" style={{ width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.topCareer || "Career Assessment"}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{a.personalitySummary?.substring(0, 80)}...</p>
                  {a.completedAt && <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 4 }}>{new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>}
                </div>
                {a.topMatchScore && <span className="lc-tag lc-tag-green">{a.topMatchScore}%</span>}
              </button>
            ))}
          </div>
        )}

        {/* Home */}
        {activeTab === "new" && step === "home" && (
          <div className="lc-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Discover Your Perfect Career</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              Answer 12 psychometric questions. AI analyzes your personality to match you with the best career paths.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
              {[{ n: "12", l: "Questions" }, { n: "5 min", l: "Duration" }, { n: "Free", l: "Always" }].map((f, i) => (
                <div key={i} style={{ textAlign: "center", padding: 12, background: "var(--bg-secondary)", borderRadius: 6 }}>
                  <p style={{ fontSize: 16, fontWeight: 700 }}>{f.n}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.l}</p>
                </div>
              ))}
            </div>
            <button onClick={startAssessment} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>Start Assessment</button>
          </div>
        )}

        {/* Loading */}
        {step === "loading-q" && <div className="lc-card" style={{ padding: 60, textAlign: "center" }}><Loader size={24} className="animate-spin" style={{ color: "var(--green)", marginBottom: 12 }} /><p style={{ fontWeight: 600 }}>Preparing your assessment...</p></div>}

        {/* Quiz */}
        {step === "quiz" && questions.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)" }}>Question {currentQ + 1} of {questions.length}</span>
              <span style={{ color: "var(--text-muted)" }}>{answered} answered</span>
            </div>
            <div className="lc-progress" style={{ marginBottom: 20 }}><div className="lc-progress-fill" style={{ width: `${progress}%` }} /></div>

            <div className="lc-card" style={{ padding: 20, marginBottom: 12 }}>
              {questions[currentQ]?.category && <span className="lc-tag lc-tag-purple" style={{ marginBottom: 8, display: "inline-flex", fontSize: 11 }}>{questions[currentQ].category}</span>}
              <h2 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>{questions[currentQ]?.question}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {questions[currentQ]?.options?.map((option, i) => {
                const selected = answers[currentQ] === option.charAt(0);
                return (
                  <button key={i} onClick={() => selectAnswer(currentQ, option)} style={{
                    width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 6, fontSize: 14,
                    border: `1px solid ${selected ? "var(--green)" : "var(--border)"}`,
                    background: selected ? "var(--green-bg)" : "var(--bg)", cursor: "pointer", color: "var(--text)",
                  }}>{option}</button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="btn-secondary" style={{ opacity: currentQ === 0 ? 0.4 : 1 }}><ChevronLeft size={14} /> Previous</button>
              {currentQ < questions.length - 1 ? (
                <button onClick={() => { if (answers[currentQ]) setCurrentQ(currentQ + 1); else toast.error("Select an answer"); }} className="btn-primary">Next <ChevronRight size={14} /></button>
              ) : (
                <button onClick={handleSubmit} disabled={answered < questions.length} className="btn-primary" style={{ opacity: answered < questions.length ? 0.4 : 1 }}>Analyze Career</button>
              )}
            </div>
            {answered === questions.length && currentQ < questions.length - 1 && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button onClick={handleSubmit} style={{ background: "none", border: "none", color: "var(--green)", fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={13} /> All answered — Submit now</button>
              </div>
            )}
          </div>
        )}

        {/* Submitting */}
        {step === "submitting" && <div className="lc-card" style={{ padding: 60, textAlign: "center" }}><Loader size={24} className="animate-spin" style={{ color: "var(--green)", marginBottom: 12 }} /><p style={{ fontWeight: 600 }}>Analyzing your answers...</p></div>}

        {/* Result */}
        {step === "result" && result && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button onClick={() => { setStep("home"); setResult(null); setAnswers({}); }} className="btn-secondary" style={{ fontSize: 12, padding: "4px 12px" }}><RefreshCw size={11} /> New Assessment</button>
            </div>

            {/* Personality */}
            <div className="lc-card" style={{ marginBottom: 12 }}>
              <span className="lc-tag lc-tag-purple" style={{ marginBottom: 8, display: "inline-flex", fontSize: 11 }}>Personality Profile</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{result.personalitySummary}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{result.strengthsOverview}</p>
              {result.personalityTraits?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{result.personalityTraits.map((t, i) => <span key={i} className="lc-tag lc-tag-purple" style={{ fontSize: 11 }}>{t}</span>)}</div>}
            </div>

            {/* Top Careers */}
            {result.topCareers?.map((career, i) => {
              const colors = ["var(--green)", "var(--blue)", "var(--purple)"];
              const color = colors[i] || "var(--text-muted)";
              return (
                <div key={i} className="lc-card" style={{ marginBottom: 8, borderLeft: `3px solid ${color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div><p style={{ fontWeight: 600, fontSize: 15 }}>{career.title}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{["🥇 Best Match", "🥈 Great Fit", "🥉 Also Suits"][i]}</p></div>
                    <div style={{ textAlign: "right" }}><p style={{ fontSize: 22, fontWeight: 800, color }}>{career.matchPercent}%</p></div>
                  </div>
                  <div className="lc-progress" style={{ marginBottom: 8 }}><div className="lc-progress-fill" style={{ width: `${career.matchPercent}%`, background: color }} /></div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{career.whyItFits}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>{career.keySkills.map((s, j) => <span key={j} className="lc-tag" style={{ fontSize: 11 }}>{s}</span>)}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                    <div style={{ display: "flex", gap: 6, padding: 8, borderRadius: 6, border: "1px solid var(--border)" }}><TrendingUp size={12} style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }} /><span style={{ color: "var(--text-muted)" }}>{career.indianMarketOutlook}</span></div>
                    <div style={{ display: "flex", gap: 6, padding: 8, borderRadius: 6, border: "1px solid var(--border)" }}><Building2 size={12} style={{ color: "var(--orange)", flexShrink: 0, marginTop: 1 }} /><span style={{ color: "var(--text-muted)" }}>{career.topCompanies}</span></div>
                  </div>
                </div>
              );
            })}

            {/* Skill Gaps */}
            {result.skillGaps?.length > 0 && (
              <div className="lc-card" style={{ marginBottom: 8 }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><BookOpen size={14} style={{ color: "var(--orange)" }} /> Skills to Develop</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{result.skillGaps.map((g, i) => <span key={i} className="lc-tag lc-tag-orange" style={{ fontSize: 11 }}>{g}</span>)}</div>
              </div>
            )}

            {/* Salary */}
            {result.salaryInsight && (
              <div className="lc-card" style={{ marginBottom: 8 }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>💰 Salary Insights — {result.salaryInsight.role}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
                  {[{ l: "Entry", v: result.salaryInsight.entryLevel, c: "var(--green)" }, { l: "Mid", v: result.salaryInsight.midLevel, c: "var(--orange)" }, { l: "Senior", v: result.salaryInsight.seniorLevel, c: "var(--red)" }].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", padding: 10, background: "var(--bg-secondary)", borderRadius: 6 }}><p style={{ fontWeight: 600, color: s.c }}>{s.v}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.l}</p></div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{result.salaryInsight.growthOutlook}</p>
                {result.salaryInsight.topHiringCities && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}><MapPin size={11} style={{ marginRight: 4 }} />{result.salaryInsight.topHiringCities}</p>}
              </div>
            )}

            {/* Next Steps */}
            {result.nextSteps?.length > 0 && (
              <div className="lc-card">
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Lightbulb size={14} style={{ color: "var(--green)" }} /> Action Plan</p>
                {result.nextSteps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, padding: 10, borderRadius: 6, border: "1px solid var(--border)" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 4, background: "var(--purple-bg)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                    <div><p style={{ fontWeight: 500, fontSize: 14 }}>{s.title} <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 12 }}>{s.timeframe}</span></p><p style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.description}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Career;
