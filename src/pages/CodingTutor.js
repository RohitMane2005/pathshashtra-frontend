import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Code2, Lightbulb, Send, Map, Loader, CheckCircle, XCircle, List, Zap, Trophy, RefreshCw } from "lucide-react";

const CodingTutor = () => {
  const [tab, setTab] = useState("generate");
  const [form, setForm] = useState({ topic: "Arrays", difficulty: "MEDIUM", language: "Java" });
  const [problem, setProblem] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [code, setCode] = useState("");
  const [hint, setHint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [problems, setProblems] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => { if (tab === "problems") fetchProblems(); }, [tab]);
  useEffect(() => { highlightCode(); }, [code, problem]);

  const generateProblem = async () => {
    setLoading(true); setProblem(null); setFeedback(null); setHint(null); setCode(""); setHintsUsed(0);
    try {
      const res = await API.post("/coding/problem/generate", form);
      setProblem(res.data.problem); setProblemId(res.data.problemId);
      toast.success("Problem ready! 🧩");
    } catch (err) { if (!err.handled) toast.error("Failed to generate problem"); }
    finally { setLoading(false); }
  };

  const getHint = async () => {
    if (hintsUsed >= 3) { toast.error("Max 3 hints per problem"); return; }
    setLoading(true);
    try {
      const res = await API.post("/coding/hint", { problemId, currentCode: code });
      setHint(res.data.hint); setHintsUsed(res.data.hintsUsed);
      toast.success(`Hint ${res.data.hintsUsed}/3 unlocked 💡`);
    } catch (err) { if (!err.handled) toast.error("Failed to get hint"); }
    finally { setLoading(false); }
  };

  const submitCode = async () => {
    if (!code.trim()) { toast.error("Write some code first!"); return; }
    setLoading(true);
    try {
      const res = await API.post("/coding/submit", { problemId, code, language: form.language });
      setFeedback(res.data);
      toast.success(res.data.isCorrect ? "Correct! 🎉 +50 XP" : "Reviewed! Check feedback 👇");
    } catch (err) { if (!err.handled) toast.error("Failed to submit"); }
    finally { setLoading(false); }
  };

  const fetchProblems = async () => {
    try {
      const res = await API.get("/coding/problems?page=0&size=20");
      // Backend now returns Page<> — use content array
      setProblems(res.data.content || res.data);
    } catch {}
  };

  const retryProblem = async (id) => {
    setLoading(true); setFeedback(null); setHint(null); setCode(""); setHintsUsed(0);
    try {
      const res = await API.post(`/coding/problem/${id}/retry`);
      setProblem(res.data.problem); setProblemId(res.data.problemId);
      toast.success("Ready to retry! 🔄");
    } catch (err) { if (!err.handled) toast.error("Failed to retry"); }
    finally { setLoading(false); }
  };

  const fetchRoadmap = async () => {
    setLoading(true);
    try { const res = await API.get("/coding/roadmap?goal=Campus Placement"); setRoadmap(res.data.roadmap); }
    catch (err) { if (!err.handled) toast.error("Failed to generate roadmap"); }
    finally { setLoading(false); }
  };

  const langMap = { Java: "java", Python: "python", "C++": "cpp", JavaScript: "javascript", C: "c", Kotlin: "kotlin" };

  const highlightCode = () => {
    if (window.Prism) window.Prism.highlightAll();
  };

  const topics = ["Arrays", "Linked Lists", "Stacks", "Queues", "Binary Trees", "BST", "Graphs", "Dynamic Programming", "Sorting", "Searching", "Recursion", "Hashing"];
  const languages = ["Java", "Python", "C++", "JavaScript", "C", "Kotlin"];
  const diffColors = { EASY: "#34D399", MEDIUM: "#FBBF24", HARD: "#F87171" };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content" style={{ paddingTop: "32px" }}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>Coding Tutor</h1>
              <p className="text-[#7A7890] text-sm mt-1">AI-powered DSA practice with hints & reviews</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { id: "generate", label: "🧩 Practice" },
              { id: "problems", label: "📋 My Problems" },
              { id: "roadmap", label: "🗺️ DSA Roadmap" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  tab === t.id
                    ? "bg-[#9B6DFF]/15 text-[#9B6DFF] border border-[#9B6DFF]/20"
                    : "text-[#7A7890] border border-white/7 hover:border-white/15"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* GENERATE TAB */}
          {tab === "generate" && (
            <div className="space-y-4 animate-fade-up">
              {/* Config */}
              <div className="glass-bright p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-[#7A7890] mb-1.5">Topic</label>
                    <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="input-dark text-sm py-2.5">
                      {topics.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A7890] mb-1.5">Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="input-dark text-sm py-2.5">
                      {["EASY", "MEDIUM", "HARD"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A7890] mb-1.5">Language</label>
                    <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="input-dark text-sm py-2.5">
                      {languages.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={generateProblem} disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading && !problem ? <Loader size={16} className="animate-spin" /> : <><Zap size={16} /> Generate Problem</>}
                </button>
              </div>

              {/* Problem */}
              {problem && (
                <div className="glass p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-bold" style={{ fontFamily: "Bricolage Grotesque" }}>{problem.title}</h3>
                    <div className="flex gap-2">
                      <span className="badge text-xs" style={{
                        background: `rgba(${problem.difficulty === "EASY" ? "52,211,153" : problem.difficulty === "MEDIUM" ? "251,191,36" : "248,113,113"},0.1)`,
                        color: diffColors[problem.difficulty],
                        border: `1px solid rgba(${problem.difficulty === "EASY" ? "52,211,153" : problem.difficulty === "MEDIUM" ? "251,191,36" : "248,113,113"},0.2)`,
                      }}>{problem.difficulty}</span>
                      <span className="badge badge-purple text-xs">{problem.language}</span>
                    </div>
                  </div>
                  <p className="text-[#7A7890] text-sm mb-4 leading-relaxed">{problem.problemStatement}</p>
                  {problem.examples?.map((ex, i) => (
                    <div key={i} className="glass p-3 mb-2 font-mono text-xs">
                      <span className="text-[#3D3B52]">Input: </span><span className="text-white">{ex.input}</span><br />
                      <span className="text-[#3D3B52]">Output: </span><span className="text-white">{ex.output}</span>
                      {ex.explanation && <><br /><span className="text-[#3D3B52]">// {ex.explanation}</span></>}
                    </div>
                  ))}
                  <div className="flex gap-2 mt-3">
                    <span className="badge badge-teal">⏱ {problem.expectedTimeComplexity}</span>
                    <span className="badge badge-purple">💾 {problem.expectedSpaceComplexity}</span>
                  </div>
                </div>
              )}

              {/* Code Editor */}
              {problem && (
                <div className="glass p-5">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Code2 size={16} className="text-[#9B6DFF]" /> Your Solution
                  </h3>
                  <div className="relative rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "rgba(0,0,0,0.5)" }}>
                    <pre className="pointer-events-none absolute inset-0 m-0 p-4 font-mono text-sm overflow-hidden"
                      style={{ lineHeight: "1.6", tabSize: 2 }}>
                      <code className={`language-${langMap[form.language] || "javascript"}`}>{code || " "}</code>
                    </pre>
                    <textarea value={code} onChange={e => { setCode(e.target.value); highlightCode(); }}
                      placeholder={`// Write your ${form.language} solution here...`}
                      rows={10} spellCheck={false}
                      className="relative w-full px-4 py-4 font-mono text-sm resize-none outline-none bg-transparent caret-white"
                      style={{ lineHeight: "1.6", color: "transparent", caretColor: "white", tabSize: 2 }}
                      onKeyDown={e => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const s = e.target.selectionStart;
                          const newCode = code.substring(0, s) + "  " + code.substring(e.target.selectionEnd);
                          setCode(newCode);
                          setTimeout(() => e.target.setSelectionRange(s + 2, s + 2), 0);
                        }
                      }} />
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button onClick={getHint} disabled={loading || hintsUsed >= 3}
                      className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-40">
                      <Lightbulb size={15} className="text-yellow-400" />
                      Hint ({3 - hintsUsed} left)
                    </button>
                    <button onClick={submitCode} disabled={loading}
                      className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: "linear-gradient(135deg, #9B6DFF, #C4A3FF)", color: "white" }}>
                      {loading && !feedback ? <Loader size={15} className="animate-spin" /> : <><Send size={15} /> Submit</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Hint */}
              {hint && (
                <div className="p-5 rounded-xl border border-yellow-400/20" style={{ background: "rgba(251,191,36,0.05)" }}>
                  <p className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <Lightbulb size={15} /> Hint {hint.hintNumber} of 3
                  </p>
                  <p className="text-[#7A7890] text-sm">{hint.hint}</p>
                  {hint.encouragement && <p className="text-yellow-400/60 text-xs mt-2 italic">{hint.encouragement}</p>}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className="glass p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                      {feedback.isCorrect ? <CheckCircle size={18} className="text-[#34D399]" /> : <XCircle size={18} className="text-[#F87171]" />}
                      AI Code Review
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold" style={{
                        fontFamily: "Bricolage Grotesque",
                        color: feedback.score >= 80 ? "#34D399" : feedback.score >= 60 ? "#FBBF24" : "#F87171"
                      }}>{feedback.score}</span>
                      <span className="text-[#3D3B52] text-sm">/100</span>
                    </div>
                  </div>

                  <p className="text-[#7A7890] text-sm mb-4">{feedback.overallFeedback}</p>

                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {feedback.strengths?.length > 0 && (
                      <div className="p-4 rounded-xl border border-[#34D399]/20" style={{ background: "rgba(52,211,153,0.05)" }}>
                        <p className="text-[#34D399] font-semibold text-xs mb-2">✅ STRENGTHS</p>
                        {feedback.strengths.map((s, i) => <p key={i} className="text-[#7A7890] text-xs mb-1">• {s}</p>)}
                      </div>
                    )}
                    {feedback.improvements?.length > 0 && (
                      <div className="p-4 rounded-xl border border-[#FF8C38]/20" style={{ background: "rgba(255,140,56,0.05)" }}>
                        <p className="text-[#FF8C38] font-semibold text-xs mb-2">💡 IMPROVEMENTS</p>
                        {feedback.improvements.map((s, i) => <p key={i} className="text-[#7A7890] text-xs mb-1">• {s}</p>)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className="badge badge-teal">Your: {feedback.timeComplexity}</span>
                    <span className="badge badge-purple">Optimal: {feedback.suggestedTimeComplexity}</span>
                    <span className="badge badge-orange">Space: {feedback.spaceComplexity}</span>
                  </div>

                  {feedback.optimizedApproach && (
                    <div className="mt-4 p-4 rounded-xl border border-[#9B6DFF]/20" style={{ background: "rgba(155,109,255,0.05)" }}>
                      <p className="text-[#9B6DFF] font-semibold text-xs mb-1">🚀 OPTIMAL APPROACH</p>
                      <p className="text-[#7A7890] text-xs">{feedback.optimizedApproach}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PROBLEMS TAB */}
          {tab === "problems" && (
            <div className="glass p-5 animate-fade-up">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                <List size={16} className="text-[#9B6DFF]" /> My Problems ({problems.length})
              </h2>
              {problems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🧩</p>
                  <p className="text-white font-semibold">No problems yet</p>
                  <p className="text-[#7A7890] text-sm mt-1">Generate your first problem to start practicing</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {problems.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/7 hover:border-white/15 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: diffColors[p.difficulty] }} />
                        <div>
                          <p className="text-white font-medium text-sm">{p.title}</p>
                          <p className="text-[#3D3B52] text-xs">{p.topic} · {p.language} · {p.hintsUsed} hints</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge text-xs ${p.status === "SOLVED" ? "badge-green" : p.status === "REVIEWED" ? "badge-purple" : "badge-orange"}`}>
                          {p.status}
                        </span>
                        {(p.status === "SOLVED" || p.status === "REVIEWED") && (
                          <button onClick={() => { setTab("generate"); retryProblem(p.id); }}
                            className="text-[#3D3B52] hover:text-[#9B6DFF] text-xs transition-colors px-2 py-1 rounded-lg hover:bg-[#9B6DFF]/10">
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ROADMAP TAB */}
          {tab === "roadmap" && (
            <div className="animate-fade-up">
              {!roadmap ? (
                <div className="glass-bright p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#9B6DFF]/10 border border-[#9B6DFF]/20 flex items-center justify-center mx-auto mb-4 animate-float">
                    <Map size={26} className="text-[#9B6DFF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>DSA Roadmap</h2>
                  <p className="text-[#7A7890] text-sm mb-6">Personalized learning path for campus placements</p>
                  <button onClick={fetchRoadmap} disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #9B6DFF, #C4A3FF)" }}>
                    {loading ? <Loader size={16} className="animate-spin" /> : <><Map size={16} /> Generate My Roadmap</>}
                  </button>
                </div>
              ) : (
                <div className="glass p-5">
                  <h2 className="text-white font-bold mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>{roadmap.roadmapTitle}</h2>
                  <p className="text-[#7A7890] text-sm mb-5">⏱ {roadmap.estimatedDuration} · 🎯 {roadmap.dailyPracticeGoal}</p>

                  <div className="space-y-5">
                    {roadmap.phases?.map((phase, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[#9B6DFF]/20 border border-[#9B6DFF]/30 text-[#9B6DFF] flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {phase.phase}
                          </div>
                          {i < roadmap.phases.length - 1 && <div className="w-px flex-1 bg-white/7 mt-2" />}
                        </div>
                        <div className="pb-5">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-white font-semibold text-sm">{phase.title}</p>
                            <span className="text-[#3D3B52] text-xs">({phase.duration})</span>
                            <span className="badge badge-purple text-xs">{phase.practiceProblems} problems</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {phase.topics?.map((t, j) => (
                              <span key={j} className="glass px-2.5 py-1 text-xs text-[#7A7890] rounded-lg">{t}</span>
                            ))}
                          </div>
                          <p className="text-[#00D4C8] text-xs">✓ {phase.milestone}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {roadmap.recommendedResources?.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl border border-[#9B6DFF]/20" style={{ background: "rgba(155,109,255,0.05)" }}>
                      <p className="text-[#9B6DFF] font-semibold text-xs mb-2">📚 RESOURCES</p>
                      {roadmap.recommendedResources.map((r, i) => (
                        <p key={i} className="text-[#7A7890] text-xs mb-1">• {r}</p>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setRoadmap(null)} className="btn-ghost w-full mt-4 flex items-center justify-center gap-2 text-sm">
                    <RefreshCw size={14} /> Regenerate Roadmap
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingTutor;
