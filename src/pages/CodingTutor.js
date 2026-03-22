import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Code2, Lightbulb, Send, Map, Loader, CheckCircle, XCircle,
  List, Zap, Trophy, RefreshCw, ChevronLeft, ChevronRight,
  Play, RotateCcw, BookOpen, Clock, Cpu, HardDrive,
  Compass, Menu, X, Maximize2, Minimize2, Tag, AlignLeft
} from "lucide-react";

/* ─── colour helpers ─────────────────────────────────── */
const diffColor  = { EASY: "#34D399", MEDIUM: "#FBBF24", HARD: "#F87171" };
const diffBg     = { EASY: "rgba(52,211,153,0.1)", MEDIUM: "rgba(251,191,36,0.1)", HARD: "rgba(248,113,113,0.1)" };
const langMap    = { Java:"java", Python:"python", "C++":"cpp", JavaScript:"javascript", C:"c", Kotlin:"kotlin" };
const TOPICS     = ["Arrays","Linked Lists","Stacks","Queues","Binary Trees","BST","Graphs","Dynamic Programming","Sorting","Searching","Recursion","Hashing","Bit Manipulation","Strings","Two Pointers","Sliding Window"];
const LANGUAGES  = ["Java","Python","C++","JavaScript","C","Kotlin"];

/* ─── small reusable pieces ──────────────────────────── */
const Badge = ({ children, color = "#7A7890", bg }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ color, background: bg || `${color}18`, border: `1px solid ${color}30` }}>
    {children}
  </span>
);

/* ─── draggable divider ──────────────────────────────── */
const useDrag = (initial = 42) => {
  const [pct, setPct] = useState(initial);
  const dragging = useRef(false);

  const onMouseDown = useCallback(e => {
    e.preventDefault();
    dragging.current = true;
    const onMove = ev => {
      if (!dragging.current) return;
      const container = document.getElementById("split-container");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newPct = ((ev.clientX - rect.left) / rect.width) * 100;
      setPct(Math.min(Math.max(newPct, 25), 75));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return [pct, onMouseDown];
};

/* ─── syntax-highlight trigger ──────────────────────── */
const highlight = () => { if (window.Prism) window.Prism.highlightAll(); };

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CodingTutor() {

  /* — config / problem state — */
  const [form, setForm]           = useState({ topic:"Arrays", difficulty:"MEDIUM", language:"Java" });
  const [problem, setProblem]     = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [generating, setGenerating] = useState(false);

  /* — editor state — */
  const [code, setCode]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback]   = useState(null);

  /* — hint state — */
  const [hints, setHints]         = useState([]);      // array of hint objects
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintLoading, setHintLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  /* — problems list — */
  const [problems, setProblems]   = useState([]);
  const [roadmap, setRoadmap]     = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  /* — UI state — */
  const [view, setView]           = useState("practice");   // practice | problems | roadmap
  const [leftTab, setLeftTab]     = useState("description"); // description | hints | feedback
  const [navOpen, setNavOpen]     = useState(false);
  const [fullEditor, setFullEditor] = useState(false);
  const [panePct, onDividerDown]  = useDrag(42);

  /* — timer — */
  const [elapsed, setElapsed]     = useState(0);
  const [timerOn, setTimerOn]     = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  useEffect(() => { highlight(); }, [code, problem, feedback]);
  useEffect(() => { if (view === "problems") fetchProblems(); }, [view]);

  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* — actions — */
  const generateProblem = async () => {
    setGenerating(true);
    setProblem(null); setFeedback(null);
    setHints([]); setHintsUsed(0); setCode("");
    setElapsed(0); setTimerOn(false);
    setLeftTab("description"); setShowHints(false);
    try {
      const res = await API.post("/coding/problem/generate", form);
      setProblem(res.data.problem);
      setProblemId(res.data.problemId);
      setTimerOn(true);
      toast.success("Problem ready! 🧩");
    } catch (err) { if (!err.handled) toast.error("Failed to generate"); }
    finally { setGenerating(false); }
  };

  const getHint = async () => {
    if (hintsUsed >= 3) { toast.error("Max 3 hints per problem"); return; }
    setHintLoading(true);
    try {
      const res = await API.post("/coding/hint", { problemId, currentCode: code });
      setHints(prev => [...prev, res.data.hint]);
      setHintsUsed(res.data.hintsUsed);
      setLeftTab("hints");
      setShowHints(true);
      toast.success(`Hint ${res.data.hintsUsed}/3 unlocked 💡`);
    } catch (err) { if (!err.handled) toast.error("Failed to get hint"); }
    finally { setHintLoading(false); }
  };

  const submitCode = async () => {
    if (!code.trim()) { toast.error("Write some code first!"); return; }
    setSubmitting(true); setTimerOn(false);
    try {
      const res = await API.post("/coding/submit", { problemId, code, language: form.language });
      setFeedback(res.data);
      setLeftTab("feedback");
      toast.success(res.data.isCorrect ? "Correct! 🎉 +50 XP" : "Reviewed! See feedback →");
    } catch (err) { if (!err.handled) toast.error("Failed to submit"); }
    finally { setSubmitting(false); }
  };

  const retryProblem = async id => {
    setGenerating(true); setFeedback(null);
    setHints([]); setHintsUsed(0); setCode("");
    setElapsed(0); setTimerOn(false); setLeftTab("description");
    try {
      const res = await API.post(`/coding/problem/${id}/retry`);
      setProblem(res.data.problem); setProblemId(res.data.problemId);
      setView("practice"); setTimerOn(true);
    } catch (err) { if (!err.handled) toast.error("Failed to retry"); }
    finally { setGenerating(false); }
  };

  const fetchProblems = async () => {
    try {
      const res = await API.get("/coding/problems?page=0&size=50");
      setProblems(res.data.content || res.data);
    } catch {}
  };

  const fetchRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const res = await API.get("/coding/roadmap?goal=Campus Placement");
      setRoadmap(res.data.roadmap);
    } catch (err) { if (!err.handled) toast.error("Failed to generate roadmap"); }
    finally { setRoadmapLoading(false); }
  };

  const resetEditor = () => { setCode(""); setFeedback(null); setHints([]); setHintsUsed(0); setElapsed(0); setTimerOn(false); setLeftTab("description"); };

  /* ─── SIDEBAR (desktop) ─────────────────────────────── */
  const SideNav = () => (
    <aside style={{
      width: 56, background: "var(--bg2)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      alignItems: "center", paddingTop: 16, gap: 4,
      flexShrink: 0
    }}>
      <Link to="/dashboard" title="Dashboard" style={{
        width: 36, height: 36, borderRadius: 10, display:"flex",
        alignItems:"center", justifyContent:"center",
        background: "rgba(255,107,0,0.15)", marginBottom: 12
      }}>
        <Compass size={18} style={{ color:"#FF8C38" }} />
      </Link>

      {[
        { id:"practice", icon:<Code2 size={18}/>, label:"Practice" },
        { id:"problems", icon:<List size={18}/>, label:"My Problems" },
        { id:"roadmap",  icon:<Map size={18}/>,  label:"Roadmap" },
      ].map(item => (
        <button key={item.id} title={item.label}
          onClick={() => setView(item.id)}
          style={{
            width:36, height:36, borderRadius:10,
            display:"flex", alignItems:"center", justifyContent:"center",
            background: view===item.id ? "rgba(155,109,255,0.2)" : "transparent",
            color: view===item.id ? "#9B6DFF" : "#3D3B52",
            border: view===item.id ? "1px solid rgba(155,109,255,0.3)" : "1px solid transparent",
            cursor:"pointer", transition:"all 0.15s"
          }}>
          {item.icon}
        </button>
      ))}
    </aside>
  );

  /* ─── PROBLEM DESCRIPTION pane ──────────────────────── */
  const DescriptionPane = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Sub-tabs */}
      <div style={{
        display:"flex", gap:4, padding:"10px 16px 0",
        borderBottom:"1px solid var(--border)", flexShrink:0
      }}>
        {[
          { id:"description", label:"Description", icon:<AlignLeft size={13}/> },
          { id:"hints",       label:`Hints (${hintsUsed}/3)`, icon:<Lightbulb size={13}/> },
          { id:"feedback",    label:"Feedback", icon:<CheckCircle size={13}/> },
        ].map(t => (
          <button key={t.id} onClick={() => setLeftTab(t.id)}
            style={{
              display:"flex", alignItems:"center", gap:5,
              padding:"6px 12px", borderRadius:"8px 8px 0 0",
              fontSize:12, fontWeight:600, cursor:"pointer",
              color: leftTab===t.id ? "#9B6DFF" : "#7A7890",
              background: leftTab===t.id ? "rgba(155,109,255,0.1)" : "transparent",
              border:"none",
              borderBottom: leftTab===t.id ? "2px solid #9B6DFF" : "2px solid transparent",
              transition:"all 0.15s"
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:"auto", padding:20 }}>

        {/* ── Description tab ── */}
        {leftTab === "description" && (
          <>
            {!problem && !generating && (
              <div style={{ textAlign:"center", paddingTop:60 }}>
                <div style={{
                  width:64, height:64, borderRadius:16,
                  background:"rgba(155,109,255,0.1)",
                  border:"1px solid rgba(155,109,255,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 16px"
                }}>
                  <Code2 size={28} style={{ color:"#9B6DFF" }} />
                </div>
                <p style={{ color:"white", fontWeight:700, fontSize:18, fontFamily:"Bricolage Grotesque", marginBottom:6 }}>
                  Generate a problem
                </p>
                <p style={{ color:"#7A7890", fontSize:13 }}>
                  Choose topic, difficulty & language, then click Generate
                </p>
              </div>
            )}

            {generating && (
              <div style={{ textAlign:"center", paddingTop:60 }}>
                <Loader size={32} style={{ color:"#9B6DFF", margin:"0 auto 16px", display:"block", animation:"spin 0.8s linear infinite" }} />
                <p style={{ color:"#7A7890", fontSize:14 }}>AI is generating your problem...</p>
              </div>
            )}

            {problem && !generating && (
              <>
                {/* Title + badges */}
                <div style={{ marginBottom:16 }}>
                  <h2 style={{ color:"white", fontSize:20, fontWeight:700, fontFamily:"Bricolage Grotesque", marginBottom:10 }}>
                    {problem.title}
                  </h2>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                    <Badge color={diffColor[problem.difficulty]} bg={diffBg[problem.difficulty]}>
                      {problem.difficulty}
                    </Badge>
                    <Badge color="#9B6DFF">{problem.language}</Badge>
                    <Badge color="#7A7890"><Tag size={10} style={{marginRight:3}}/>{problem.topic || form.topic}</Badge>
                  </div>
                </div>

                {/* Statement */}
                <div style={{ marginBottom:20 }}>
                  <p style={{ color:"#B0AEC8", fontSize:14, lineHeight:1.7 }}>
                    {problem.problemStatement}
                  </p>
                </div>

                {/* Input / Output format */}
                {(problem.inputFormat || problem.outputFormat) && (
                  <div style={{ marginBottom:16 }}>
                    {problem.inputFormat && (
                      <div style={{ marginBottom:8 }}>
                        <p style={{ color:"white", fontSize:12, fontWeight:700, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Input Format</p>
                        <p style={{ color:"#7A7890", fontSize:13 }}>{problem.inputFormat}</p>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div>
                        <p style={{ color:"white", fontSize:12, fontWeight:700, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Output Format</p>
                        <p style={{ color:"#7A7890", fontSize:13 }}>{problem.outputFormat}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints?.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <p style={{ color:"white", fontSize:12, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Constraints</p>
                    <ul style={{ margin:0, padding:0, listStyle:"none" }}>
                      {problem.constraints.map((c, i) => (
                        <li key={i} style={{ color:"#7A7890", fontSize:13, marginBottom:4, display:"flex", gap:8 }}>
                          <span style={{ color:"#9B6DFF", flexShrink:0 }}>•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {problem.examples?.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <p style={{ color:"white", fontSize:12, fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>Examples</p>
                    {problem.examples.map((ex, i) => (
                      <div key={i} style={{
                        background:"rgba(0,0,0,0.3)", border:"1px solid var(--border)",
                        borderRadius:10, padding:14, marginBottom:10, fontFamily:"monospace", fontSize:13
                      }}>
                        <div style={{ marginBottom:6 }}>
                          <span style={{ color:"#3D3B52" }}>Input: </span>
                          <span style={{ color:"#E2E8F0" }}>{ex.input}</span>
                        </div>
                        <div style={{ marginBottom: ex.explanation ? 6 : 0 }}>
                          <span style={{ color:"#3D3B52" }}>Output: </span>
                          <span style={{ color:"#34D399" }}>{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div style={{ color:"#7A7890", fontSize:12, marginTop:6, lineHeight:1.5 }}>
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Complexity */}
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, color:"#00D4C8", fontSize:12 }}>
                    <Clock size={13}/> Expected: {problem.expectedTimeComplexity}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, color:"#9B6DFF", fontSize:12 }}>
                    <HardDrive size={13}/> Space: {problem.expectedSpaceComplexity}
                  </div>
                </div>

                {/* Tags */}
                {problem.tags?.length > 0 && (
                  <div style={{ marginTop:16, display:"flex", flexWrap:"wrap", gap:6 }}>
                    {problem.tags.map((t,i) => <Badge key={i} color="#3D3B52">{t}</Badge>)}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Hints tab ── */}
        {leftTab === "hints" && (
          <div>
            {hints.length === 0 ? (
              <div style={{ textAlign:"center", paddingTop:40 }}>
                <Lightbulb size={36} style={{ color:"#3D3B52", margin:"0 auto 12px", display:"block" }} />
                <p style={{ color:"#7A7890", fontSize:13 }}>
                  {problem ? "Click \"Get Hint\" in the editor when you're stuck" : "Generate a problem first"}
                </p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {hints.map((h, i) => (
                  <div key={i} style={{
                    background:"rgba(251,191,36,0.06)",
                    border:"1px solid rgba(251,191,36,0.2)",
                    borderRadius:12, padding:16
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <Lightbulb size={15} style={{ color:"#FBBF24" }} />
                      <span style={{ color:"#FBBF24", fontWeight:700, fontSize:13 }}>Hint {i+1} of 3</span>
                    </div>
                    <p style={{ color:"#B0AEC8", fontSize:13, lineHeight:1.6, margin:0 }}>{h.hint}</p>
                    {h.encouragement && (
                      <p style={{ color:"rgba(251,191,36,0.6)", fontSize:12, marginTop:8, fontStyle:"italic" }}>
                        {h.encouragement}
                      </p>
                    )}
                  </div>
                ))}
                {hintsUsed < 3 && problem && (
                  <p style={{ color:"#3D3B52", fontSize:12, textAlign:"center" }}>
                    {3 - hintsUsed} hint{3 - hintsUsed !== 1 ? "s" : ""} remaining
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Feedback tab ── */}
        {leftTab === "feedback" && (
          <div>
            {!feedback ? (
              <div style={{ textAlign:"center", paddingTop:40 }}>
                <CheckCircle size={36} style={{ color:"#3D3B52", margin:"0 auto 12px", display:"block" }} />
                <p style={{ color:"#7A7890", fontSize:13 }}>Submit your code to see AI feedback</p>
              </div>
            ) : (
              <div>
                {/* Score */}
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  marginBottom:20, padding:"16px 20px",
                  background: feedback.isCorrect ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                  border: `1px solid ${feedback.isCorrect ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
                  borderRadius:12
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {feedback.isCorrect
                      ? <CheckCircle size={22} style={{ color:"#34D399" }} />
                      : <XCircle size={22} style={{ color:"#F87171" }} />}
                    <div>
                      <p style={{ color:"white", fontWeight:700, fontSize:15, fontFamily:"Bricolage Grotesque", margin:0 }}>
                        {feedback.isCorrect ? "Solution Accepted" : "Needs Improvement"}
                      </p>
                      <p style={{ color:"#7A7890", fontSize:12, margin:0 }}>AI Code Review</p>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{
                      fontSize:32, fontWeight:800, fontFamily:"Bricolage Grotesque",
                      color: feedback.score >= 80 ? "#34D399" : feedback.score >= 60 ? "#FBBF24" : "#F87171"
                    }}>{feedback.score}</span>
                    <span style={{ color:"#3D3B52", fontSize:14 }}>/100</span>
                  </div>
                </div>

                {/* Overall */}
                <p style={{ color:"#B0AEC8", fontSize:13, lineHeight:1.7, marginBottom:16 }}>
                  {feedback.overallFeedback}
                </p>

                {/* Complexity comparison */}
                <div style={{
                  display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16
                }}>
                  {[
                    { label:"Your Time", value: feedback.timeComplexity, color:"#00D4C8", icon:<Clock size={13}/> },
                    { label:"Optimal Time", value: feedback.suggestedTimeComplexity, color:"#34D399", icon:<Zap size={13}/> },
                    { label:"Your Space", value: feedback.spaceComplexity, color:"#9B6DFF", icon:<HardDrive size={13}/> },
                    { label:"Optimal Space", value: feedback.suggestedSpaceComplexity, color:"#34D399", icon:<HardDrive size={13}/> },
                  ].map((item,i) => (
                    <div key={i} style={{
                      background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)",
                      borderRadius:10, padding:12
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5, color:item.color, marginBottom:4 }}>
                        {item.icon}<span style={{ fontSize:11, fontWeight:600 }}>{item.label}</span>
                      </div>
                      <p style={{ color:"white", fontFamily:"monospace", fontSize:13, margin:0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div style={{
                    background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.2)",
                    borderRadius:10, padding:14, marginBottom:12
                  }}>
                    <p style={{ color:"#34D399", fontWeight:700, fontSize:12, marginBottom:8 }}>✅ STRENGTHS</p>
                    {feedback.strengths.map((s,i) => (
                      <p key={i} style={{ color:"#B0AEC8", fontSize:13, marginBottom:4 }}>• {s}</p>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements?.length > 0 && (
                  <div style={{
                    background:"rgba(255,140,56,0.06)", border:"1px solid rgba(255,140,56,0.2)",
                    borderRadius:10, padding:14, marginBottom:12
                  }}>
                    <p style={{ color:"#FF8C38", fontWeight:700, fontSize:12, marginBottom:8 }}>💡 IMPROVEMENTS</p>
                    {feedback.improvements.map((s,i) => (
                      <p key={i} style={{ color:"#B0AEC8", fontSize:13, marginBottom:4 }}>• {s}</p>
                    ))}
                  </div>
                )}

                {/* Optimal approach */}
                {feedback.optimizedApproach && (
                  <div style={{
                    background:"rgba(155,109,255,0.06)", border:"1px solid rgba(155,109,255,0.2)",
                    borderRadius:10, padding:14
                  }}>
                    <p style={{ color:"#9B6DFF", fontWeight:700, fontSize:12, marginBottom:8 }}>🚀 OPTIMAL APPROACH</p>
                    <p style={{ color:"#B0AEC8", fontSize:13, lineHeight:1.6, margin:0 }}>{feedback.optimizedApproach}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* ─── EDITOR pane ────────────────────────────────────── */
  const EditorPane = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* Editor top bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 16px", height:48, borderBottom:"1px solid var(--border)",
        flexShrink:0, gap:8
      }}>
        {/* Language selector */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <select value={form.language}
            onChange={e => setForm(f => ({...f, language:e.target.value}))}
            style={{
              background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)",
              borderRadius:8, color:"white", fontSize:12, padding:"4px 10px",
              cursor:"pointer", outline:"none"
            }}>
            {LANGUAGES.map(l => <option key={l} style={{ background:"#111118" }}>{l}</option>)}
          </select>
        </div>

        {/* Timer */}
        {problem && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              fontFamily:"monospace", fontSize:13, color: elapsed > 1800 ? "#F87171" : "#7A7890",
              display:"flex", alignItems:"center", gap:5
            }}>
              <Clock size={13} /> {fmtTime(elapsed)}
            </div>
            <button onClick={() => setTimerOn(t => !t)}
              style={{
                background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
                borderRadius:6, padding:"3px 8px", color:"#7A7890", fontSize:11, cursor:"pointer"
              }}>
              {timerOn ? "⏸" : "▶"}
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button onClick={resetEditor} title="Reset" disabled={!problem}
            style={{
              width:30, height:30, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center",
              background:"transparent", border:"1px solid var(--border)", color:"#7A7890",
              cursor: problem ? "pointer" : "not-allowed", opacity: problem ? 1 : 0.4
            }}>
            <RotateCcw size={13} />
          </button>
          <button onClick={() => setFullEditor(f => !f)} title="Toggle fullscreen"
            style={{
              width:30, height:30, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center",
              background:"transparent", border:"1px solid var(--border)", color:"#7A7890", cursor:"pointer"
            }}>
            {fullEditor ? <Minimize2 size={13}/> : <Maximize2 size={13}/>}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <pre className="pointer-events-none"
          style={{
            position:"absolute", inset:0, margin:0, padding:"16px",
            fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:13,
            lineHeight:1.6, overflow:"hidden", tabSize:2, whiteSpace:"pre-wrap"
          }}>
          <code className={`language-${langMap[form.language]||"javascript"}`}>{code||" "}</code>
        </pre>
        <textarea
          value={code}
          onChange={e => { setCode(e.target.value); highlight(); }}
          placeholder={problem
            ? `// Write your ${form.language} solution here...\n// Press Tab for indent, Ctrl+Enter to submit`
            : "// Generate a problem to start coding..."}
          spellCheck={false}
          disabled={!problem}
          style={{
            position:"absolute", inset:0, width:"100%", height:"100%",
            padding:"16px", resize:"none", outline:"none",
            fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:13,
            lineHeight:1.6, background:"transparent",
            color:"transparent", caretColor:"white", tabSize:2,
            border:"none"
          }}
          onKeyDown={e => {
            if (e.key === "Tab") {
              e.preventDefault();
              const s = e.target.selectionStart;
              const newCode = code.substring(0, s) + "  " + code.substring(e.target.selectionEnd);
              setCode(newCode);
              setTimeout(() => e.target.setSelectionRange(s+2, s+2), 0);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              submitCode();
            }
          }}
        />
      </div>

      {/* Bottom action bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px", borderTop:"1px solid var(--border)", flexShrink:0,
        gap:10
      }}>
        <button onClick={getHint}
          disabled={!problem || hintsUsed >= 3 || hintLoading}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"8px 14px", borderRadius:10, fontSize:13, fontWeight:600,
            background:"transparent", border:"1px solid var(--border)",
            color: hintsUsed >= 3 ? "#3D3B52" : "#FBBF24",
            cursor: !problem || hintsUsed >= 3 ? "not-allowed" : "pointer",
            opacity: !problem || hintsUsed >= 3 ? 0.5 : 1, transition:"all 0.15s"
          }}>
          {hintLoading ? <Loader size={14} style={{animation:"spin 0.8s linear infinite"}}/> : <Lightbulb size={14}/>}
          Hint ({3 - hintsUsed} left)
        </button>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={submitCode} disabled={!problem || submitting || !code.trim()}
            style={{
              display:"flex", alignItems:"center", gap:7,
              padding:"8px 20px", borderRadius:10, fontSize:13, fontWeight:700,
              background: !problem || !code.trim() ? "rgba(155,109,255,0.3)" : "linear-gradient(135deg, #9B6DFF, #C4A3FF)",
              color:"white", border:"none",
              cursor: !problem || !code.trim() ? "not-allowed" : "pointer",
              transition:"all 0.15s"
            }}>
            {submitting
              ? <Loader size={14} style={{animation:"spin 0.8s linear infinite"}}/>
              : <><Play size={14}/> Submit</>}
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── GENERATE bar ────────────────────────────────────── */
  const GenerateBar = () => (
    <div style={{
      display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
      borderBottom:"1px solid var(--border)", flexShrink:0, flexWrap:"wrap"
    }}>
      <select value={form.topic} onChange={e => setForm(f=>({...f, topic:e.target.value}))}
        style={{
          background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)",
          borderRadius:8, color:"white", fontSize:12, padding:"6px 10px",
          cursor:"pointer", outline:"none", flex:"1 1 120px"
        }}>
        {TOPICS.map(t => <option key={t} style={{background:"#111118"}}>{t}</option>)}
      </select>

      {["EASY","MEDIUM","HARD"].map(d => (
        <button key={d} onClick={() => setForm(f=>({...f, difficulty:d}))}
          style={{
            padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:700,
            cursor:"pointer", transition:"all 0.15s",
            color: form.difficulty===d ? "white" : diffColor[d],
            background: form.difficulty===d ? diffBg[d] : "transparent",
            border: `1px solid ${form.difficulty===d ? diffColor[d] : "var(--border)"}`,
          }}>
          {d}
        </button>
      ))}

      <button onClick={generateProblem} disabled={generating}
        style={{
          display:"flex", alignItems:"center", gap:7,
          padding:"6px 18px", borderRadius:8, fontSize:13, fontWeight:700,
          background:"linear-gradient(135deg, #FF6B00, #FF8C38)",
          color:"white", border:"none", cursor: generating ? "not-allowed" : "pointer",
          opacity: generating ? 0.7 : 1, whiteSpace:"nowrap"
        }}>
        {generating ? <Loader size={14} style={{animation:"spin 0.8s linear infinite"}}/> : <Zap size={14}/>}
        {generating ? "Generating..." : "Generate"}
      </button>
    </div>
  );

  /* ─── MY PROBLEMS view ───────────────────────────────── */
  const ProblemsView = () => (
    <div style={{ flex:1, overflowY:"auto", padding:24 }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <h2 style={{ color:"white", fontFamily:"Bricolage Grotesque", fontSize:20, fontWeight:700, marginBottom:20 }}>
          My Problems ({problems.length})
        </h2>

        {/* Stats strip */}
        {problems.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
            {[
              { label:"Solved", count: problems.filter(p=>p.status==="SOLVED").length, color:"#34D399" },
              { label:"Attempted", count: problems.filter(p=>p.status==="ATTEMPTED"||p.status==="REVIEWED").length, color:"#FBBF24" },
              { label:"Generated", count: problems.filter(p=>p.status==="GENERATED").length, color:"#7A7890" },
            ].map((s,i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)",
                borderRadius:12, padding:"14px 16px", textAlign:"center"
              }}>
                <p style={{ color:s.color, fontSize:24, fontWeight:800, fontFamily:"Bricolage Grotesque", margin:0 }}>{s.count}</p>
                <p style={{ color:"#7A7890", fontSize:12, margin:0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {problems.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <Code2 size={40} style={{ color:"#3D3B52", margin:"0 auto 12px", display:"block" }} />
            <p style={{ color:"white", fontWeight:600, marginBottom:6 }}>No problems yet</p>
            <p style={{ color:"#7A7890", fontSize:13 }}>Generate your first problem to get started</p>
            <button onClick={() => setView("practice")} style={{
              marginTop:16, padding:"8px 20px", borderRadius:10, fontSize:13, fontWeight:600,
              background:"linear-gradient(135deg,#9B6DFF,#C4A3FF)", color:"white", border:"none", cursor:"pointer"
            }}>Start Practicing</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {/* Header row */}
            <div style={{
              display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr auto",
              padding:"8px 16px", color:"#3D3B52", fontSize:11, fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.08em", gap:12
            }}>
              <span>Problem</span><span>Difficulty</span><span>Language</span><span>Status</span><span></span>
            </div>

            {problems.map((p,i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr auto",
                alignItems:"center", gap:12,
                background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)",
                borderRadius:12, padding:"12px 16px", transition:"all 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>

                <div>
                  <p style={{ color:"white", fontWeight:600, fontSize:14, margin:0 }}>{p.title}</p>
                  <p style={{ color:"#3D3B52", fontSize:11, margin:0 }}>{p.topic} · {p.hintsUsed} hints used</p>
                </div>

                <Badge color={diffColor[p.difficulty]} bg={diffBg[p.difficulty]}>{p.difficulty}</Badge>
                <Badge color="#7A7890">{p.language}</Badge>

                <Badge color={
                  p.status==="SOLVED" ? "#34D399" :
                  p.status==="REVIEWED" ? "#9B6DFF" :
                  p.status==="ATTEMPTED" ? "#FBBF24" : "#7A7890"
                }>{p.status}</Badge>

                {(p.status==="SOLVED"||p.status==="REVIEWED") && (
                  <button onClick={() => { setView("practice"); retryProblem(p.id); }}
                    style={{
                      padding:"5px 12px", borderRadius:8, fontSize:12, fontWeight:600,
                      background:"rgba(155,109,255,0.1)", border:"1px solid rgba(155,109,255,0.3)",
                      color:"#9B6DFF", cursor:"pointer", whiteSpace:"nowrap"
                    }}>
                    Retry
                  </button>
                )}
                {p.status==="GENERATED" && (
                  <button onClick={() => { setView("practice"); /* load existing */ }}
                    style={{
                      padding:"5px 12px", borderRadius:8, fontSize:12, fontWeight:600,
                      background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.3)",
                      color:"#FF8C38", cursor:"pointer"
                    }}>
                    Continue
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ─── ROADMAP view ───────────────────────────────────── */
  const RoadmapView = () => (
    <div style={{ flex:1, overflowY:"auto", padding:24 }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        {!roadmap ? (
          <div style={{ textAlign:"center", paddingTop:60 }}>
            <div style={{
              width:64, height:64, borderRadius:16,
              background:"rgba(155,109,255,0.1)", border:"1px solid rgba(155,109,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px"
            }}>
              <Map size={28} style={{ color:"#9B6DFF" }} />
            </div>
            <h2 style={{ color:"white", fontFamily:"Bricolage Grotesque", fontSize:22, fontWeight:700, marginBottom:8 }}>
              DSA Roadmap
            </h2>
            <p style={{ color:"#7A7890", fontSize:14, marginBottom:24 }}>
              Personalized learning path for campus placements
            </p>
            <button onClick={fetchRoadmap} disabled={roadmapLoading}
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"10px 24px", borderRadius:12, fontWeight:700, fontSize:14,
                background:"linear-gradient(135deg,#9B6DFF,#C4A3FF)",
                color:"white", border:"none", cursor: roadmapLoading ? "not-allowed" : "pointer"
              }}>
              {roadmapLoading
                ? <Loader size={16} style={{animation:"spin 0.8s linear infinite"}}/>
                : <Map size={16}/>}
              {roadmapLoading ? "Generating..." : "Generate My Roadmap"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom:24 }}>
              <h2 style={{ color:"white", fontFamily:"Bricolage Grotesque", fontSize:20, fontWeight:700, marginBottom:4 }}>
                {roadmap.roadmapTitle}
              </h2>
              <p style={{ color:"#7A7890", fontSize:13 }}>
                ⏱ {roadmap.estimatedDuration} · 🎯 {roadmap.dailyPracticeGoal}
              </p>
            </div>

            {roadmap.phases?.map((phase, i) => (
              <div key={i} style={{ display:"flex", gap:16, marginBottom:24 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{
                    width:36, height:36, borderRadius:"50%",
                    background:"rgba(155,109,255,0.15)", border:"1px solid rgba(155,109,255,0.3)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#9B6DFF", fontSize:13, fontWeight:800, flexShrink:0
                  }}>{phase.phase}</div>
                  {i < roadmap.phases.length-1 && (
                    <div style={{ width:1, flex:1, background:"rgba(155,109,255,0.2)", marginTop:8 }} />
                  )}
                </div>
                <div style={{ paddingBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                    <p style={{ color:"white", fontWeight:700, fontSize:14, margin:0 }}>{phase.title}</p>
                    <span style={{ color:"#3D3B52", fontSize:12 }}>({phase.duration})</span>
                    <Badge color="#9B6DFF">{phase.practiceProblems} problems</Badge>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                    {phase.topics?.map((t,j) => (
                      <span key={j} style={{
                        background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
                        borderRadius:8, padding:"3px 10px", fontSize:12, color:"#7A7890"
                      }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ color:"#00D4C8", fontSize:12, margin:0 }}>✓ {phase.milestone}</p>
                </div>
              </div>
            ))}

            {roadmap.recommendedResources?.length > 0 && (
              <div style={{
                background:"rgba(155,109,255,0.06)", border:"1px solid rgba(155,109,255,0.2)",
                borderRadius:12, padding:16
              }}>
                <p style={{ color:"#9B6DFF", fontWeight:700, fontSize:12, marginBottom:8 }}>📚 RESOURCES</p>
                {roadmap.recommendedResources.map((r,i) => (
                  <p key={i} style={{ color:"#7A7890", fontSize:13, marginBottom:4 }}>• {r}</p>
                ))}
              </div>
            )}

            <button onClick={() => setRoadmap(null)} style={{
              marginTop:20, width:"100%", padding:"10px", borderRadius:10, fontSize:13, fontWeight:600,
              background:"transparent", border:"1px solid var(--border)", color:"#7A7890", cursor:"pointer"
            }}>
              Regenerate Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ─── ROOT render ────────────────────────────────────── */
  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"var(--bg)" }}>

      {/* Desktop side icon nav */}
      <div className="hidden md:flex">
        <SideNav />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden" style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px", background:"rgba(10,10,15,0.95)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link to="/dashboard" style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{
            width:28, height:28, borderRadius:8,
            background:"linear-gradient(135deg,#FF6B00,#FF9A3C)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <Compass size={13} style={{ color:"white" }} />
          </div>
          <span style={{ color:"white", fontWeight:700, fontSize:14, fontFamily:"Bricolage Grotesque" }}>
            Coding Tutor
          </span>
        </Link>
        <button onClick={() => setNavOpen(o => !o)}
          style={{ background:"none", border:"none", color:"#7A7890", cursor:"pointer" }}>
          {navOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {navOpen && (
        <div style={{
          position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.6)"
        }} onClick={() => setNavOpen(false)}>
          <div style={{
            position:"absolute", top:48, left:0, right:0,
            background:"var(--bg2)", borderBottom:"1px solid var(--border)", padding:16
          }} onClick={e => e.stopPropagation()}>
            {[
              { id:"practice", label:"🧩 Practice" },
              { id:"problems", label:"📋 My Problems" },
              { id:"roadmap",  label:"🗺️ Roadmap" },
            ].map(item => (
              <button key={item.id}
                onClick={() => { setView(item.id); setNavOpen(false); }}
                style={{
                  display:"block", width:"100%", textAlign:"left",
                  padding:"12px 16px", borderRadius:10, fontSize:14, fontWeight:600,
                  background: view===item.id ? "rgba(155,109,255,0.15)" : "transparent",
                  color: view===item.id ? "#9B6DFF" : "#7A7890",
                  border:"none", cursor:"pointer", marginBottom:4
                }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", paddingTop: "env(safe-area-inset-top)" }}
        className="md:pt-0 pt-12">

        {/* PRACTICE VIEW — split pane */}
        {view === "practice" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* Generate bar */}
            <GenerateBar />

            {/* Split pane */}
            {!fullEditor ? (
              <div id="split-container"
                style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>

                {/* Left — description */}
                <div style={{ width:`${panePct}%`, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                  <DescriptionPane />
                </div>

                {/* Draggable divider */}
                <div
                  onMouseDown={onDividerDown}
                  style={{
                    width:4, background:"var(--border)", cursor:"col-resize",
                    flexShrink:0, position:"relative", transition:"background 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="#9B6DFF"}
                  onMouseLeave={e => e.currentTarget.style.background="var(--border)"}
                >
                  <div style={{
                    position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                    width:12, height:32, borderRadius:6,
                    background:"rgba(255,255,255,0.1)", pointerEvents:"none"
                  }}/>
                </div>

                {/* Right — editor */}
                <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column",
                  background:"rgba(0,0,0,0.25)" }}>
                  <EditorPane />
                </div>
              </div>
            ) : (
              /* Full-screen editor */
              <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column",
                background:"rgba(0,0,0,0.25)" }}>
                <EditorPane />
              </div>
            )}
          </div>
        )}

        {/* PROBLEMS VIEW */}
        {view === "problems" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <ProblemsView />
          </div>
        )}

        {/* ROADMAP VIEW */}
        {view === "roadmap" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <RoadmapView />
          </div>
        )}
      </div>
    </div>
  );
}