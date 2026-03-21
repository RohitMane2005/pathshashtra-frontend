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
    } catch { toast.error("Failed to start quiz. Try again."); }
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
      setStep("result");
    } catch { toast.error("Failed to submit quiz."); }
    finally { setLoading(false); }
  };

  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content" style={{ paddingTop: "32px" }}>
        <div className="max-w-2xl mx-auto">

          {/* INTRO */}
          {step === "intro" && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-4 animate-float">
                  <Brain size={32} className="text-[#FF8C38]" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  AI Career Assessment
                </h1>
                <p className="text-[#7A7890]">Discover your ideal career path in 5 minutes</p>
              </div>

              <div className="glass-bright p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: "🧠", label: "10 Questions", desc: "Psychometric" },
                    { icon: "⚡", label: "5 Minutes", desc: "Quick & precise" },
                    { icon: "🎯", label: "AI Analysis", desc: "Deep insights" },
                  ].map((f, i) => (
                    <div key={i} className="glass p-4 text-center">
                      <p className="text-2xl mb-2">{f.icon}</p>
                      <p className="text-white font-semibold text-sm">{f.label}</p>
                      <p className="text-[#7A7890] text-xs">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[#7A7890] text-sm text-center mb-6">
                  You'll receive top career matches, skill gap analysis, salary projections, and a personalized roadmap.
                </p>

                <button onClick={startQuiz} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                  {loading ? <Loader size={18} className="animate-spin" /> : <><Sparkles size={18} /> Start Assessment</>}
                </button>
              </div>
            </div>
          )}

          {/* QUESTIONS */}
          {step === "questions" && questions.length > 0 && (
            <div className="animate-fade-up">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="badge badge-orange">Question {current + 1} of {questions.length}</span>
                <span className="text-[#7A7890] text-sm">{answered} answered</span>
              </div>

              {/* Progress */}
              <div className="progress-bar mb-8">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Question */}
              <div className="glass-bright p-6 mb-4">
                <h2 className="text-white text-lg font-semibold leading-relaxed" style={{ fontFamily: "Bricolage Grotesque" }}>
                  {questions[current].question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {questions[current].options.map((option, i) => {
                  const letter = option.charAt(0);
                  const selected = answers[questions[current].number] === letter;
                  return (
                    <button key={i} onClick={() => selectAnswer(questions[current].number, option)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm ${
                        selected
                          ? "border-[#FF6B00]/50 bg-[#FF6B00]/10 text-white"
                          : "border-white/7 bg-white/3 text-[#7A7890] hover:border-white/15 hover:text-white hover:bg-white/5"
                      }`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3 ${
                        selected ? "bg-[#FF6B00] text-white" : "bg-white/5 text-[#3D3B52]"}`}>
                        {letter}
                      </span>
                      {option.substring(3)}
                    </button>
                  );
                })}
              </div>

              {/* Nav */}
              <div className="flex justify-between">
                <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="btn-ghost">
                  ← Previous
                </button>
                {current === questions.length - 1 ? (
                  <button onClick={submitQuiz} disabled={loading || answered < questions.length}
                    className="btn-primary flex items-center gap-2">
                    {loading ? <Loader size={16} className="animate-spin" /> : <><Trophy size={16} /> Get My Results</>}
                  </button>
                ) : (
                  <button onClick={() => setCurrent(current + 1)} disabled={!answers[questions[current].number]}
                    className="btn-primary flex items-center gap-2">
                    Next <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}
          {step === "result" && result && (
            <div className="animate-fade-up space-y-4">
              {/* Header */}
              <div className="glass-bright p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center mx-auto mb-3">
                  <Trophy size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>Your Career Report</h2>
                <p className="text-[#7A7890] text-sm">{result.summary}</p>
              </div>

              {/* Career Matches */}
              <div className="glass p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <Trophy size={16} className="text-[#FF8C38]" /> Top Career Matches
                </h3>
                {result.careerMatches?.map((career, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white font-semibold text-sm">{career.title}</span>
                      <span className="text-[#FF8C38] font-bold text-sm">{career.matchPercent}%</span>
                    </div>
                    <div className="progress-bar mb-1">
                      <div className="progress-fill" style={{ width: `${career.matchPercent}%` }} />
                    </div>
                    <p className="text-[#7A7890] text-xs">{career.reason}</p>
                  </div>
                ))}
              </div>

              {/* Skill Gaps */}
              <div className="glass p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <AlertCircle size={16} className="text-yellow-400" /> Skills to Build
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillGaps?.map((gap, i) => (
                    <span key={i} className="badge badge-orange">{gap}</span>
                  ))}
                </div>
              </div>

              {/* Salary */}
              {result.salaryInfo && (
                <div className="glass p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                    <TrendingUp size={16} className="text-[#00D4C8]" /> Salary Outlook
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { label: "Entry", value: result.salaryInfo.entryLevel },
                      { label: "Mid", value: result.salaryInfo.midLevel },
                      { label: "Senior", value: result.salaryInfo.seniorLevel },
                    ].map((s, i) => (
                      <div key={i} className="glass p-3 text-center">
                        <p className="text-[#00D4C8] font-bold text-sm">{s.value}</p>
                        <p className="text-[#7A7890] text-xs mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#7A7890] text-xs">{result.salaryInfo.growthOutlook}</p>
                </div>
              )}

              {/* Roadmap */}
              <div className="glass p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <Map size={16} className="text-[#9B6DFF]" /> Your Roadmap
                </h3>
                {result.roadmap?.map((phase, i) => (
                  <div key={i} className="flex gap-4 mb-5 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#9B6DFF]/20 border border-[#9B6DFF]/30 text-[#9B6DFF] flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {phase.phase}
                      </div>
                      {i < result.roadmap.length - 1 && <div className="w-px flex-1 bg-white/7 mt-2" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-white font-semibold text-sm">{phase.title} <span className="text-[#3D3B52] font-normal">({phase.duration})</span></p>
                      <ul className="mt-1 space-y-1">
                        {phase.actions?.map((a, j) => (
                          <li key={j} className="text-[#7A7890] text-xs flex items-start gap-1.5">
                            <span className="text-[#9B6DFF] mt-0.5">→</span>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setStep("intro"); setResult(null); }}
                className="btn-ghost w-full flex items-center justify-center gap-2">
                <RotateCcw size={16} /> Retake Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
