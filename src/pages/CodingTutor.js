import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import CodeEditor, { BOILERPLATE } from "../components/CodeEditor";
import {
  Code2, Loader, List, Map, Lightbulb, Play, RotateCcw,
  Maximize2, Minimize2, CheckCircle, Circle, X, Menu, Home
} from "lucide-react";

/* ── Generate Bar ── */
const GenBar = ({ form, setForm, generating, onGenerate }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg)", flexWrap: "wrap" }}>
    <select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className="lc-input" style={{ width: 140, padding: "6px 10px", fontSize: 13 }}>
      {["Arrays", "Strings", "LinkedList", "Trees", "Graphs", "DP", "Sorting", "Searching", "Stack", "Queue", "Recursion", "HashMap", "Greedy", "Backtracking", "Math"].map(t => <option key={t}>{t}</option>)}
    </select>
    <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="lc-input" style={{ width: 110, padding: "6px 10px", fontSize: 13 }}>
      {["Easy", "Medium", "Hard"].map(d => <option key={d}>{d}</option>)}
    </select>
    <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="lc-input" style={{ width: 120, padding: "6px 10px", fontSize: 13 }}>
      {["Java", "Python", "C++", "JavaScript", "C", "Kotlin"].map(l => <option key={l}>{l}</option>)}
    </select>
    <button onClick={onGenerate} disabled={generating} className="btn-primary" style={{ padding: "6px 14px", fontSize: 13 }}>
      {generating ? <Loader size={13} className="animate-spin" /> : "Generate"}
    </button>
  </div>
);

/* ── Left Pane: problem description ── */
const LeftPane = ({ problem, generating, leftTab, setLeftTab, hints, hintsUsed, feedback, form }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflow: "hidden" }}>
    {/* tabs */}
    <div className="lc-tabs" style={{ margin: 0, padding: "0 12px" }}>
      {["Description", "Hints", "Feedback"].map(t => (
        <button key={t} onClick={() => setLeftTab(t.toLowerCase())} className={`lc-tab ${leftTab === t.toLowerCase() ? "active" : ""}`} style={{ fontSize: 13, padding: "8px 10px" }}>
          {t} {t === "Hints" && hintsUsed > 0 && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>({hintsUsed})</span>}
        </button>
      ))}
    </div>
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      {leftTab === "description" && (
        generating ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <div><Loader size={24} className="animate-spin" style={{ color: "var(--green)", display: "block", margin: "0 auto 12px" }} /><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Generating problem...</p></div>
          </div>
        ) : problem ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className={`lc-tag lc-tag-${problem.difficulty === "EASY" || form.difficulty === "Easy" ? "green" : problem.difficulty === "MEDIUM" || form.difficulty === "Medium" ? "orange" : "red"}`}>
                {problem.difficulty || form.difficulty}
              </span>
              <span className="lc-tag">{problem.topic || form.topic}</span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{problem.title}</h2>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{problem.description}</div>
            {problem.examples && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Examples:</h4>
                <pre style={{ background: "var(--bg-secondary)", padding: 12, borderRadius: 6, fontSize: 13, whiteSpace: "pre-wrap", border: "1px solid var(--border)" }}>{typeof problem.examples === "string" ? problem.examples : JSON.stringify(problem.examples, null, 2)}</pre>
              </div>
            )}
            {problem.constraints && (
              <div style={{ marginTop: 12 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Constraints:</h4>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{problem.constraints}</p>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: 14 }}>
            Click "Generate" to create a new problem
          </div>
        )
      )}
      {leftTab === "hints" && (
        hints.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", paddingTop: 40 }}>Click the hint button in the editor to get hints</p>
        ) : hints.map((h, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, background: "var(--bg-secondary)", borderRadius: 6, border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--orange)", marginBottom: 4 }}>Hint {i + 1}</p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{h}</p>
          </div>
        ))
      )}
      {leftTab === "feedback" && (
        !feedback ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", paddingTop: 40 }}>Submit your code to see AI feedback</p>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className={`lc-tag lc-tag-${feedback.verdict === "PASS" ? "green" : feedback.verdict === "PARTIAL" ? "orange" : "red"}`}>{feedback.verdict}</span>
              {feedback.score != null && <span style={{ fontWeight: 700, fontSize: 16 }}>{feedback.score}/100</span>}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{feedback.review || feedback.explanation}</div>
          </div>
        )
      )}
    </div>
  </div>
);

/* ── Editor Pane ── */
const EditorPane = ({ form, code, setCode, submitting, fullEd, setFullEd, onReset, onHint, onSubmit }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1e1e2e" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{form.language}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={onReset} title="Reset" style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          <RotateCcw size={12} />
        </button>
        <button onClick={onHint} title="Hint" disabled={submitting} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: "rgba(255,161,22,0.8)", fontSize: 12 }}>
          <Lightbulb size={12} />
        </button>
        <button onClick={() => setFullEd(!fullEd)} title={fullEd ? "Split" : "Full"} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          {fullEd ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      </div>
    </div>
    <div style={{ flex: 1, overflow: "hidden" }}>
      <CodeEditor value={code} onChange={setCode} language={form.language} disabled={submitting} onSubmit={onSubmit} />
    </div>
    <div style={{ padding: "6px 10px", background: "#1a1a2e", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end" }}>
      <button onClick={onSubmit} disabled={submitting} style={{
        background: "var(--green)", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px",
        fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: submitting ? 0.5 : 1,
      }}>
        {submitting ? <Loader size={12} className="animate-spin" /> : <Play size={12} />} Submit
      </button>
    </div>
  </div>
);

/* ── Problems List ── */
const ProblemsView = ({ problems, onRetry, onLoad }) => (
  <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>My Problems</h2>
    {problems.length === 0 ? (
      <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", paddingTop: 40 }}>No problems yet. Generate one to start!</p>
    ) : (
      <table className="lc-table">
        <thead><tr><th>Status</th><th>Title</th><th>Difficulty</th><th>Topic</th><th>Action</th></tr></thead>
        <tbody>
          {problems.map((p, i) => (
            <tr key={i}>
              <td>{p.status === "SOLVED" ? <CheckCircle size={14} style={{ color: "var(--green)" }} /> : <Circle size={14} style={{ color: "var(--text-light)" }} />}</td>
              <td style={{ fontWeight: 500, cursor: "pointer", color: "var(--blue)" }} onClick={() => onLoad(p)}>{p.title}</td>
              <td><span className={`diff-${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span></td>
              <td><span className="lc-tag" style={{ fontSize: 11 }}>{p.topic}</span></td>
              <td><button onClick={() => onRetry(p)} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13 }}>Retry</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

/* ── Roadmap View ── */
const RoadmapView = ({ roadmap, rmLoad, onGenerate, onReset }) => (
  <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>DSA Roadmap</h2>
    {rmLoad ? (
      <div style={{ textAlign: "center", paddingTop: 40 }}><Loader size={20} className="animate-spin" style={{ color: "var(--green)" }} /></div>
    ) : !roadmap ? (
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 12 }}>Generate a personalized DSA roadmap</p>
        <button onClick={onGenerate} className="btn-primary" style={{ fontSize: 13 }}>Generate Roadmap</button>
      </div>
    ) : (
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button onClick={onReset} className="btn-secondary" style={{ fontSize: 12, padding: "4px 12px" }}><RotateCcw size={11} /> Reset</button>
        </div>
        {roadmap.phases?.map((phase, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
              {i < roadmap.phases.length - 1 && <div style={{ width: 1, flex: 1, background: "#e5e5e5", marginTop: 4 }} />}
            </div>
            <div className="lc-card" style={{ flex: 1, padding: 14, marginBottom: 4 }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{phase.title || phase.name}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{phase.description}</p>
              {phase.topics && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{phase.topics.map((t, j) => <span key={j} className="lc-tag" style={{ fontSize: 11 }}>{t}</span>)}</div>}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ── Main Coding Tutor ── */
export default function CodingTutor() {
  const [view, setView] = useState("practice");
  const [form, setForm] = useState({ topic: "Arrays", difficulty: "Medium", language: "Java" });
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(BOILERPLATE.Java);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leftTab, setLeftTab] = useState("description");
  const [hints, setHints] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [fullEd, setFullEd] = useState(false);
  const [problems, setProblems] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [rmLoad, setRmLoad] = useState(false);
  const [pct, setPct] = useState(50);
  const [navOpen, setNavOpen] = useState(false);
  const draggingRef = useRef(false);

  useEffect(() => { API.get("/coding/problems").then(r => setProblems(r.data.content || r.data)).catch(() => {}); }, []);

  const generateProblem = async () => {
    setGenerating(true);
    try {
      const res = await API.post("/coding/problem/generate", form);
      setProblem(res.data);
      setCode(res.data.starterCode || BOILERPLATE[form.language] || "");
      setLeftTab("description");
      setHints([]);
      setHintsUsed(0);
      setFeedback(null);
      setFullEd(false);
    } catch (err) { if (!err.handled) toast.error("Failed to generate problem"); }
    finally { setGenerating(false); }
  };

  const submitCode = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const res = await API.post("/coding/submit", { problemId: problem.id, code, language: form.language });
      setFeedback(res.data);
      setLeftTab("feedback");
      API.get("/coding/problems").then(r => setProblems(r.data.content || r.data)).catch(() => {});
    } catch (err) { if (!err.handled) toast.error("Submission failed"); }
    finally { setSubmitting(false); }
  };

  const getHint = async () => {
    if (!problem) return;
    try {
      const res = await API.post("/coding/hint", { problemId: problem.id, hintsUsed });
      setHints(prev => [...prev, res.data.hint]);
      setHintsUsed(prev => prev + 1);
      setLeftTab("hints");
    } catch (err) { if (!err.handled) toast.error("Failed to get hint"); }
  };

  const resetEditor = () => { setCode(problem?.starterCode || BOILERPLATE[form.language] || ""); };

  const retryProblem = async (p) => {
    try {
      const res = await API.post(`/coding/problem/${p.id}/retry`);
      setProblem(res.data);
      setCode(res.data.starterCode || BOILERPLATE[form.language] || "");
      setFeedback(null);
      setHints([]);
      setHintsUsed(0);
      setLeftTab("description");
      setView("practice");
    } catch (err) { if (!err.handled) toast.error("Failed to retry problem"); }
  };

  const loadProblem = async (p) => {
    try {
      const res = await API.get(`/coding/problem/${p.id}`);
      setProblem(res.data);
      setCode(res.data.lastSubmittedCode || res.data.starterCode || BOILERPLATE[form.language] || "");
      setFeedback(null);
      setHints([]);
      setHintsUsed(0);
      setLeftTab("description");
      setView("practice");
    } catch (err) { if (!err.handled) toast.error("Failed to load problem"); }
  };

  const fetchRoadmap = async () => {
    setRmLoad(true);
    try { const res = await API.get("/coding/roadmap"); setRoadmap(res.data); }
    catch (err) { if (!err.handled) toast.error("Failed to load roadmap"); }
    finally { setRmLoad(false); }
  };

  const onDivDown = useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    const container = document.getElementById("ct-split");
    const onMove = (ev) => { if (!draggingRef.current || !container) return; const rect = container.getBoundingClientRect(); const newPct = ((ev.clientX - rect.left) / rect.width) * 100; setPct(Math.min(80, Math.max(20, newPct))); };
    const onUp = () => { draggingRef.current = false; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const sharedEditorProps = { form, code, setCode, submitting, fullEd, setFullEd, onReset: resetEditor, onHint: getHint, onSubmit: submitCode };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-secondary)" }}>
      {/* Desktop sidebar */}
      <aside className="hide-mobile" style={{ width: 48, background: "var(--bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 4, flexShrink: 0 }}>
        <Link to="/dashboard" title="Dashboard" style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", marginBottom: 8 }}>
          <Home size={16} />
        </Link>
        {[{ id: "practice", icon: <Code2 size={16} />, tip: "Practice" }, { id: "problems", icon: <List size={16} />, tip: "My Problems" }, { id: "roadmap", icon: <Map size={16} />, tip: "Roadmap" }].map(item => (
          <button key={item.id} title={item.tip} onClick={() => setView(item.id)} style={{
            width: 32, height: 32, borderRadius: 6, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: view === item.id ? "var(--bg-secondary)" : "transparent",
            color: view === item.id ? "var(--text)" : "var(--text-muted)", transition: "all 0.15s",
          }}>{item.icon}</button>
        ))}
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Mobile top bar */}
        <div className="mobile-only" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>P</div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Coding Tutor</span>
          </Link>
          <button onClick={() => setNavOpen(o => !o)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {navOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.3)" }} onClick={() => setNavOpen(false)}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "48px 12px 12px" }} onClick={e => e.stopPropagation()}>
              {[["practice", "Practice"], ["problems", "My Problems"], ["roadmap", "Roadmap"]].map(([id, label]) => (
                <button key={id} onClick={() => { setView(id); setNavOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, background: view === id ? "var(--bg-secondary)" : "transparent", color: view === id ? "var(--text)" : "var(--text-muted)", border: "none", cursor: "pointer", marginBottom: 2 }}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Practice view */}
        {view === "practice" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <GenBar form={form} setForm={setForm} generating={generating} onGenerate={generateProblem} />
            {fullEd ? (
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <EditorPane {...sharedEditorProps} />
              </div>
            ) : (
              <div id="ct-split" style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <LeftPane problem={problem} generating={generating} leftTab={leftTab} setLeftTab={setLeftTab} hints={hints} hintsUsed={hintsUsed} feedback={feedback} form={form} />
                </div>
                <div onMouseDown={onDivDown} style={{ width: 4, flexShrink: 0, cursor: "col-resize", background: "var(--border)", position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--blue)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--border)"}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 6, height: 24, borderRadius: 3, background: "rgba(0,0,0,0.1)", pointerEvents: "none" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <EditorPane {...sharedEditorProps} />
                </div>
              </div>
            )}
          </div>
        )}

        {view === "problems" && <ProblemsView problems={problems} setView={setView} onRetry={retryProblem} onLoad={loadProblem} />}
        {view === "roadmap" && <RoadmapView roadmap={roadmap} rmLoad={rmLoad} onGenerate={fetchRoadmap} onReset={() => setRoadmap(null)} />}
      </div>

      <style>{`@media (max-width: 768px) { .mobile-only { display: flex !important; } }`}</style>
    </div>
  );
}