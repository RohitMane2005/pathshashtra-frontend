import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { ChevronRight, Loader, Trophy, TrendingUp, AlertCircle, Map, RotateCcw } from "lucide-react";

const Quiz = () => {
  const [step, setStep] = useState("intro");
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareToken, setShareToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [current, setCurrent] = useState(0);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await API.post("/quiz/start");
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setStep("questions");
      setCurrent(0);
      setAnswers({});
    } catch (err) { if (!err.handled) toast.error("Failed to start quiz. Try again."); }
    finally { setLoading(false); }
  };

  const selectAnswer = (questionNum, option) => {
    setAnswers({ ...answers, [questionNum]: option.charAt(0) });
    if (current < questions.length - 1) setTimeout(() => setCurrent(c => c + 1), 200);
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await API.post("/quiz/submit", { sessionId, answers });
      setResult(res.data);
      setShareToken(res.data.shareToken || null);
      setStep("result");
    } catch (err) { if (!err.handled) toast.error("Failed to submit quiz."); }
    finally { setLoading(false); }
  };

  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content">
        <div className="page-inner" style={{ maxWidth: 640 }}>

          {step === "intro" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Career Quiz</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>Discover your ideal career path in under 5 minutes</p>
              <div className="lc-card" style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[{ n: "10", l: "Questions" }, { n: "5 min", l: "Duration" }, { n: "AI", l: "Analysis" }].map((f, i) => (
                    <div key={i} style={{ textAlign: "center", padding: 16, background: "var(--bg-secondary)", borderRadius: 6 }}>
                      <p style={{ fontSize: 18, fontWeight: 700 }}>{f.n}</p>
                      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{f.l}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", marginBottom: 20 }}>
                  You'll receive career matches, skill gaps, salary projections, and a roadmap.
                </p>
                <button onClick={startQuiz} disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
                  {loading ? <Loader size={16} className="animate-spin" /> : "Start Assessment"}
                </button>
              </div>
            </div>
          )}

          {step === "questions" && questions.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "var(--text-secondary)" }}>Question {current + 1} of {questions.length}</span>
                <span style={{ color: "var(--text-muted)" }}>{answered} answered</span>
              </div>
              <div className="lc-progress" style={{ marginBottom: 24 }}><div className="lc-progress-fill" style={{ width: `${progress}%` }} /></div>

              <div className="lc-card" style={{ padding: 24, marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>{questions[current].question}</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {questions[current].options.map((option, i) => {
                  const letter = option.charAt(0);
                  const selected = answers[questions[current].number] === letter;
                  return (
                    <button key={i} onClick={() => selectAnswer(questions[current].number, option)} style={{
                      width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: 6, fontSize: 14,
                      border: `1px solid ${selected ? "var(--green)" : "var(--border)"}`,
                      background: selected ? "var(--green-bg)" : "var(--bg)", cursor: "pointer",
                      color: "var(--text)", transition: "all 0.15s",
                    }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 4, fontSize: 12, fontWeight: 600, marginRight: 10,
                        background: selected ? "var(--green)" : "var(--bg-secondary)", color: selected ? "#fff" : "var(--text-muted)" }}>{letter}</span>
                      {option.substring(3)}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="btn-secondary" style={{ opacity: current === 0 ? 0.4 : 1 }}>← Previous</button>
                {current === questions.length - 1 ? (
                  <button onClick={submitQuiz} disabled={loading || answered < questions.length} className="btn-primary">
                    {loading ? <Loader size={14} className="animate-spin" /> : <><Trophy size={14} /> Get Results</>}
                  </button>
                ) : (
                  <button onClick={() => setCurrent(current + 1)} disabled={!answers[questions[current].number]} className="btn-primary">
                    Next <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "result" && result && (
            <div>
              <div className="lc-card" style={{ textAlign: "center", marginBottom: 16, padding: 24 }}>
                <Trophy size={28} style={{ color: "var(--orange)", marginBottom: 8 }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Your Career Report</h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>{result.summary}</p>
                {shareToken && (
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${shareToken}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="btn-secondary" style={{ fontSize: 13 }}>{copied ? "✓ Copied!" : "Share result →"}</button>
                )}
              </div>

              {result.careerMatches?.length > 0 && (
                <div className="lc-card" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}><Trophy size={14} style={{ color: "var(--orange)" }} /> Top Career Matches</h3>
                  {result.careerMatches.map((c, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{c.title}</span>
                        <span style={{ color: "var(--green)", fontWeight: 600, fontSize: 14 }}>{c.matchPercent}%</span>
                      </div>
                      <div className="lc-progress"><div className="lc-progress-fill" style={{ width: `${c.matchPercent}%` }} /></div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.skillGaps?.length > 0 && (
                <div className="lc-card" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={14} style={{ color: "var(--orange)" }} /> Skills to Build</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{result.skillGaps.map((g, i) => <span key={i} className="lc-tag lc-tag-orange">{g}</span>)}</div>
                </div>
              )}

              {result.salaryInfo && (
                <div className="lc-card" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><TrendingUp size={14} style={{ color: "var(--green)" }} /> Salary Outlook</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
                    {[{ l: "Entry", v: result.salaryInfo.entryLevel }, { l: "Mid", v: result.salaryInfo.midLevel }, { l: "Senior", v: result.salaryInfo.seniorLevel }].map((s, i) => (
                      <div key={i} style={{ padding: 12, textAlign: "center", background: "var(--bg-secondary)", borderRadius: 6 }}>
                        <p style={{ color: "var(--green)", fontWeight: 600, fontSize: 14 }}>{s.v}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{result.salaryInfo.growthOutlook}</p>
                </div>
              )}

              {result.roadmap?.length > 0 && (
                <div className="lc-card" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Map size={14} style={{ color: "var(--purple)" }} /> Your Roadmap</h3>
                  {result.roadmap.map((phase, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--purple-bg)", border: "1px solid var(--purple-border)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{phase.phase}</div>
                        {i < result.roadmap.length - 1 && <div style={{ width: 1, flex: 1, background: "#e5e5e5", marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingBottom: 8 }}>
                        <p style={{ fontWeight: 500, fontSize: 14 }}>{phase.title} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({phase.duration})</span></p>
                        <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                          {phase.actions?.map((a, j) => <li key={j} style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>→ {a}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => { setStep("intro"); setResult(null); }} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                <RotateCcw size={14} /> Retake Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
