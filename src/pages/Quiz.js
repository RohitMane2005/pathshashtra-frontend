import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Brain, ChevronRight, Loader, Trophy, TrendingUp, AlertCircle, Map, Sparkles, RotateCcw } from "lucide-react";

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
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300);
    }
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-2xl mx-auto">

          {/* INTRO */}
          {step === "intro" && (
            <div className="animate-fade-up">
              <div className="mb-8">
                <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Assessment</p>
                <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
                  AI Career Quiz
                </h1>
                <p className="text-[#71717a] text-sm">Discover your ideal career path in under 5 minutes</p>
              </div>

              <div className="card p-6 mb-5">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { num: "10", label: "Questions", desc: "Psychometric" },
                    { num: "5", label: "Minutes", desc: "Quick & precise" },
                    { num: "AI", label: "Analysis", desc: "Deep insights" },
                  ].map((f, i) => (
                    <div key={i} className="text-center p-4 rounded-xl" style={{ background: "var(--bg3)" }}>
                      <p className="text-white font-bold text-lg mb-0.5" style={{ fontFamily: "Space Grotesk" }}>{f.num}</p>
                      <p className="text-[#a1a1aa] text-sm font-medium">{f.label}</p>
                      <p className="text-[#52525b] text-xs mt-0.5">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[#71717a] text-sm text-center mb-6">
                  You'll receive career matches, skill gap analysis, salary projections, and a personalized roadmap.
                </p>

                <button onClick={startQuiz} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                  {loading ? <Loader size={17} className="animate-spin" /> : <><Sparkles size={17} /> Start Assessment</>}
                </button>
              </div>
            </div>
          )}

          {/* QUESTIONS */}
          {step === "questions" && questions.length > 0 && (
            <div className="animate-fade-up">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-medium text-[#a1a1aa]">Question {current + 1} of {questions.length}</span>
                <span className="text-[#52525b] text-sm">{answered} answered</span>
              </div>

              {/* Progress */}
              <div className="progress-bar mb-8">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Question */}
              <div className="card p-6 mb-5">
                <h2 className="text-white text-lg font-medium leading-relaxed" style={{ fontFamily: "Space Grotesk" }}>
                  {questions[current].question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {questions[current].options.map((option, i) => {
                  const letter = option.charAt(0);
                  const selected = answers[questions[current].number] === letter;
                  return (
                    <button key={i} onClick={() => selectAnswer(questions[current].number, option)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 text-sm ${
                        selected
                          ? "border-amber-500/40 bg-amber-500/[0.06] text-white"
                          : "border-white/[0.06] bg-[#111114] text-[#a1a1aa] hover:border-white/10 hover:text-white"
                      }`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-semibold mr-3 ${
                        selected ? "bg-amber-500 text-black" : "bg-white/5 text-[#52525b]"}`}>
                        {letter}
                      </span>
                      {option.substring(3)}
                    </button>
                  );
                })}
              </div>

              {/* Nav */}
              <div className="flex justify-between">
                <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="btn-ghost disabled:opacity-30">
                  ← Previous
                </button>
                {current === questions.length - 1 ? (
                  <button onClick={submitQuiz} disabled={loading || answered < questions.length}
                    className="btn-primary flex items-center gap-2">
                    {loading ? <Loader size={15} className="animate-spin" /> : <><Trophy size={15} /> Get Results</>}
                  </button>
                ) : (
                  <button onClick={() => setCurrent(current + 1)} disabled={!answers[questions[current].number]}
                    className="btn-primary flex items-center gap-2">
                    Next <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}
          {step === "result" && result && (
            <div className="animate-fade-up space-y-4">
              {/* Header */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mx-auto mb-3">
                  <Trophy size={20} className="text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>Your Career Report</h2>
                <p className="text-[#71717a] text-sm mb-3">{result.summary}</p>
                {shareToken && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/share/${shareToken}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border text-amber-500 hover:bg-amber-500/5"
                    style={{ borderColor: "var(--amber-border)" }}>
                    {copied ? "✓ Link copied!" : "Share result →"}
                  </button>
                )}
              </div>

              {/* Career Matches */}
              <div className="card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
                  <Trophy size={14} className="text-amber-500" /> Top Career Matches
                </h3>
                {result.careerMatches?.map((career, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white font-medium text-sm">{career.title}</span>
                      <span className="text-amber-500 font-semibold text-sm">{career.matchPercent}%</span>
                    </div>
                    <div className="progress-bar mb-1.5">
                      <div className="progress-fill" style={{ width: `${career.matchPercent}%` }} />
                    </div>
                    <p className="text-[#52525b] text-xs">{career.reason}</p>
                  </div>
                ))}
              </div>

              {/* Skill Gaps */}
              <div className="card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
                  <AlertCircle size={14} className="text-amber-400" /> Skills to Build
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillGaps?.map((gap, i) => (
                    <span key={i} className="badge badge-amber">{gap}</span>
                  ))}
                </div>
              </div>

              {/* Salary */}
              {result.salaryInfo && (
                <div className="card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
                    <TrendingUp size={14} className="text-emerald-500" /> Salary Outlook
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { label: "Entry", value: result.salaryInfo.entryLevel },
                      { label: "Mid", value: result.salaryInfo.midLevel },
                      { label: "Senior", value: result.salaryInfo.seniorLevel },
                    ].map((s, i) => (
                      <div key={i} className="p-3 text-center rounded-xl" style={{ background: "var(--bg3)" }}>
                        <p className="text-emerald-500 font-semibold text-sm">{s.value}</p>
                        <p className="text-[#52525b] text-xs mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#71717a] text-xs">{result.salaryInfo.growthOutlook}</p>
                </div>
              )}

              {/* Roadmap */}
              <div className="card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
                  <Map size={14} className="text-violet-400" /> Your Roadmap
                </h3>
                {result.roadmap?.map((phase, i) => (
                  <div key={i} className="flex gap-4 mb-5 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {phase.phase}
                      </div>
                      {i < result.roadmap.length - 1 && <div className="w-px flex-1 bg-white/[0.04] mt-2" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-white font-medium text-sm">{phase.title} <span className="text-[#52525b] font-normal">({phase.duration})</span></p>
                      <ul className="mt-1.5 space-y-1">
                        {phase.actions?.map((a, j) => (
                          <li key={j} className="text-[#71717a] text-xs flex items-start gap-1.5">
                            <span className="text-violet-400 mt-0.5">→</span>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setStep("intro"); setResult(null); }}
                className="btn-ghost w-full flex items-center justify-center gap-2">
                <RotateCcw size={15} /> Retake Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
