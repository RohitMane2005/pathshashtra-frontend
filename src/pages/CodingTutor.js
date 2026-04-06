import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Code2, Lightbulb, Map, Loader, CheckCircle, XCircle,
  List, Zap, Play, RotateCcw, Clock, HardDrive,
  Compass, Menu, X, Maximize2, Minimize2, AlignLeft, RefreshCw
} from "lucide-react";
import CodeEditor, { BOILERPLATE } from "../components/CodeEditor";

/* ─── constants ──────────────────────────────── */
const DIFF_COLOR = { EASY:"#34D399", MEDIUM:"#FBBF24", HARD:"#F87171" };
const DIFF_BG    = { EASY:"rgba(52,211,153,0.12)", MEDIUM:"rgba(251,191,36,0.12)", HARD:"rgba(248,113,113,0.12)" };
const TOPICS = [
  "Arrays","Linked Lists","Stacks","Queues","Binary Trees","BST","Graphs",
  "Dynamic Programming","Sorting","Searching","Recursion","Hashing",
  "Bit Manipulation","Strings","Two Pointers","Sliding Window",
];
const LANGS = ["Java","Python","C++","JavaScript","C","Kotlin"];

function fmtTime(s) {
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

const Badge = ({ children, color="#7A7890", bg }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", padding:"2px 10px",
    borderRadius:100, fontSize:11, fontWeight:700,
    color, background: bg || `${color}18`, border:`1px solid ${color}30`
  }}>{children}</span>
);

function useSplit(init = 42) {
  const [pct, setPct] = useState(init);
  const dragging = useRef(false);
  const onDown = useCallback(e => {
    e.preventDefault();
    dragging.current = true;
    const move = ev => {
      if (!dragging.current) return;
      const el = document.getElementById("ct-split");
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPct(Math.min(75, Math.max(25, ((ev.clientX - r.left) / r.width) * 100)));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", () => { dragging.current = false; }, { once:true });
  }, []);
  return [pct, onDown];
}

/* ══════════════════════════════════════════════
   GENERATE BAR
══════════════════════════════════════════════ */
function GenBar({ form, setForm, generating, onGenerate }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", flexWrap:"wrap", gap:8,
      padding:"10px 14px", borderBottom:"1px solid var(--border)",
      flexShrink:0, background:"var(--bg2)"
    }}>
      <select value={form.topic} onChange={e => setForm(f => ({...f, topic:e.target.value}))}
        style={{
          flex:"1 1 120px", background:"rgba(255,255,255,0.07)",
          border:"1px solid rgba(255,255,255,0.12)", borderRadius:8,
          color:"white", fontSize:12, padding:"6px 10px", outline:"none", cursor:"pointer"
        }}>
        {TOPICS.map(t => <option key={t} style={{background:"#111118"}}>{t}</option>)}
      </select>

      <div style={{display:"flex", gap:5}}>
        {["EASY","MEDIUM","HARD"].map(d => (
          <button key={d} onClick={() => setForm(f => ({...f, difficulty:d}))} style={{
            padding:"5px 11px", borderRadius:7, fontSize:11, fontWeight:700, cursor:"pointer",
            color: form.difficulty===d ? "white" : DIFF_COLOR[d],
            background: form.difficulty===d ? DIFF_BG[d] : "transparent",
            border:`1px solid ${form.difficulty===d ? DIFF_COLOR[d] : "rgba(255,255,255,0.12)"}`,
          }}>{d}</button>
        ))}
      </div>

      <select value={form.language} onChange={e => setForm(f => ({...f, language:e.target.value}))}
        style={{
          background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:8, color:"white", fontSize:12, padding:"6px 10px", outline:"none", cursor:"pointer"
        }}>
        {LANGS.map(l => <option key={l} style={{background:"#111118"}}>{l}</option>)}
      </select>

      <button onClick={onGenerate} disabled={generating} style={{
        display:"flex", alignItems:"center", gap:6, padding:"7px 18px",
        borderRadius:8, fontSize:13, fontWeight:700, border:"none", whiteSpace:"nowrap",
        background: generating ? "rgba(255,107,0,0.5)" : "linear-gradient(135deg,#FF6B00,#FF8C38)",
        color:"white", cursor: generating ? "not-allowed" : "pointer"
      }}>
        {generating
          ? <><Loader size={13} style={{animation:"spin 0.8s linear infinite"}}/> Generating...</>
          : <><Zap size={13}/> Generate Problem</>}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LEFT PANE  (Description / Hints / Feedback)
══════════════════════════════════════════════ */
function LeftPane({ problem, generating, leftTab, setLeftTab, hints, hintsUsed, feedback, form }) {
  return (
    <div style={{display:"flex", flexDirection:"column", height:"100%", overflow:"hidden"}}>

      {/* Tab bar */}
      <div style={{
        display:"flex", gap:2, padding:"8px 14px 0",
        borderBottom:"1px solid var(--border)", flexShrink:0, background:"var(--bg2)"
      }}>
        {[
          {id:"description", label:"Description",        icon:<AlignLeft size={12}/>},
          {id:"hints",       label:`Hints (${hintsUsed}/3)`, icon:<Lightbulb size={12}/>},
          {id:"feedback",    label:"Feedback",            icon:<CheckCircle size={12}/>},
        ].map(t => (
          <button key={t.id} onClick={() => setLeftTab(t.id)} style={{
            display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
            background:"transparent", border:"none",
            borderBottom: leftTab===t.id ? "2px solid #9B6DFF" : "2px solid transparent",
            borderRadius:"6px 6px 0 0", fontSize:12, fontWeight:600, cursor:"pointer",
            color: leftTab===t.id ? "#9B6DFF" : "#7A7890", transition:"color 0.15s"
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{flex:1, overflowY:"auto", padding:18}}>

        {/* ── DESCRIPTION ── */}
        {leftTab==="description" && <>
          {!problem && !generating && (
            <div style={{textAlign:"center", paddingTop:64}}>
              <div style={{
                width:64, height:64, borderRadius:16, margin:"0 auto 16px",
                background:"rgba(155,109,255,0.1)", border:"1px solid rgba(155,109,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}><Code2 size={28} style={{color:"#9B6DFF"}}/></div>
              <p style={{color:"white", fontWeight:700, fontSize:18, fontFamily:"Bricolage Grotesque", marginBottom:6}}>
                Ready to practice?
              </p>
              <p style={{color:"#7A7890", fontSize:13, lineHeight:1.6}}>
                Pick a topic and difficulty above,<br/>then hit <strong style={{color:"#FF8C38"}}>Generate Problem</strong>
              </p>
            </div>
          )}

          {generating && (
            <div style={{textAlign:"center", paddingTop:64}}>
              <Loader size={32} style={{color:"#9B6DFF", margin:"0 auto 16px", display:"block", animation:"spin 0.8s linear infinite"}}/>
              <p style={{color:"#7A7890", fontSize:14}}>AI is crafting your problem...</p>
            </div>
          )}

          {problem && !generating && (
            <div>
              <h2 style={{color:"white", fontSize:19, fontWeight:700, fontFamily:"Bricolage Grotesque", marginBottom:10}}>
                {problem.title}
              </h2>
              <div style={{display:"flex", flexWrap:"wrap", gap:7, marginBottom:16}}>
                <Badge color={DIFF_COLOR[problem.difficulty]} bg={DIFF_BG[problem.difficulty]}>{problem.difficulty}</Badge>
                <Badge color="#9B6DFF">{problem.language}</Badge>
                <Badge color="#7A7890">{problem.topic || form.topic}</Badge>
              </div>
              <p style={{color:"#B0AEC8", fontSize:14, lineHeight:1.75, marginBottom:16}}>{problem.problemStatement}</p>
              {problem.inputFormat && (
                <div style={{marginBottom:12}}>
                  <p style={{color:"white", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4}}>Input Format</p>
                  <p style={{color:"#7A7890", fontSize:13}}>{problem.inputFormat}</p>
                </div>
              )}
              {problem.outputFormat && (
                <div style={{marginBottom:12}}>
                  <p style={{color:"white", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4}}>Output Format</p>
                  <p style={{color:"#7A7890", fontSize:13}}>{problem.outputFormat}</p>
                </div>
              )}
              {problem.constraints?.length > 0 && (
                <div style={{marginBottom:14}}>
                  <p style={{color:"white", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8}}>Constraints</p>
                  {problem.constraints.map((c,i) => (
                    <div key={i} style={{display:"flex", gap:8, marginBottom:5}}>
                      <span style={{color:"#9B6DFF", flexShrink:0}}>•</span>
                      <span style={{color:"#7A7890", fontSize:13}}>{c}</span>
                    </div>
                  ))}
                </div>
              )}
              {problem.examples?.length > 0 && (
                <div style={{marginBottom:14}}>
                  <p style={{color:"white", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10}}>Examples</p>
                  {problem.examples.map((ex,i) => (
                    <div key={i} style={{
                      background:"rgba(0,0,0,0.35)", border:"1px solid var(--border)",
                      borderRadius:10, padding:"12px 14px", marginBottom:10,
                      fontFamily:"'JetBrains Mono',monospace", fontSize:13
                    }}>
                      <div style={{marginBottom:5}}>
                        <span style={{color:"#3D3B52"}}>Input: </span>
                        <span style={{color:"#E2E8F0"}}>{ex.input}</span>
                      </div>
                      <div style={{marginBottom:ex.explanation?5:0}}>
                        <span style={{color:"#3D3B52"}}>Output: </span>
                        <span style={{color:"#34D399"}}>{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div style={{color:"#7A7890", fontSize:12, marginTop:6, lineHeight:1.5}}>
                          Explanation: {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex", gap:14, flexWrap:"wrap"}}>
                {problem.expectedTimeComplexity && (
                  <span style={{color:"#00D4C8", fontSize:12, display:"flex", alignItems:"center", gap:5}}>
                    <Clock size={12}/> {problem.expectedTimeComplexity}
                  </span>
                )}
                {problem.expectedSpaceComplexity && (
                  <span style={{color:"#9B6DFF", fontSize:12, display:"flex", alignItems:"center", gap:5}}>
                    <HardDrive size={12}/> {problem.expectedSpaceComplexity}
                  </span>
                )}
              </div>
            </div>
          )}
        </>}

        {/* ── HINTS ── */}
        {leftTab==="hints" && (
          <div>
            {hints.length===0 ? (
              <div style={{textAlign:"center", paddingTop:48}}>
                <Lightbulb size={36} style={{color:"#3D3B52", margin:"0 auto 12px", display:"block"}}/>
                <p style={{color:"#7A7890", fontSize:13}}>
                  {problem ? "Click \"Hint\" below when you're stuck" : "Generate a problem first"}
                </p>
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:14}}>
                {hints.map((h,i) => (
                  <div key={i} style={{
                    background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)",
                    borderRadius:12, padding:16
                  }}>
                    <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
                      <Lightbulb size={14} style={{color:"#FBBF24"}}/>
                      <span style={{color:"#FBBF24", fontWeight:700, fontSize:13}}>Hint {i+1} of 3</span>
                    </div>
                    <p style={{color:"#B0AEC8", fontSize:13, lineHeight:1.65, margin:0}}>{h.hint}</p>
                    {h.encouragement && (
                      <p style={{color:"rgba(251,191,36,0.55)", fontSize:12, marginTop:8, fontStyle:"italic", marginBottom:0}}>
                        {h.encouragement}
                      </p>
                    )}
                  </div>
                ))}
                {hintsUsed<3 && problem && (
                  <p style={{color:"#3D3B52", fontSize:12, textAlign:"center"}}>{3-hintsUsed} hint{3-hintsUsed!==1?"s":""} remaining</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {leftTab==="feedback" && (
          <div>
            {!feedback ? (
              <div style={{textAlign:"center", paddingTop:48}}>
                <CheckCircle size={36} style={{color:"#3D3B52", margin:"0 auto 12px", display:"block"}}/>
                <p style={{color:"#7A7890", fontSize:13}}>Submit your code to see AI feedback</p>
              </div>
            ) : (
              <div>
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"14px 18px", marginBottom:18,
                  background: feedback.isCorrect?"rgba(52,211,153,0.08)":"rgba(248,113,113,0.08)",
                  border:`1px solid ${feedback.isCorrect?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.25)"}`,
                  borderRadius:12
                }}>
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    {feedback.isCorrect ? <CheckCircle size={20} style={{color:"#34D399"}}/> : <XCircle size={20} style={{color:"#F87171"}}/>}
                    <div>
                      <p style={{color:"white", fontWeight:700, fontSize:14, fontFamily:"Bricolage Grotesque", margin:0}}>
                        {feedback.isCorrect ? "Accepted ✓" : "Needs Work"}
                      </p>
                      <p style={{color:"#7A7890", fontSize:11, margin:0}}>AI Code Review</p>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{
                      fontSize:30, fontWeight:800, fontFamily:"Bricolage Grotesque",
                      color: feedback.score>=80?"#34D399":feedback.score>=60?"#FBBF24":"#F87171"
                    }}>{feedback.score}</span>
                    <span style={{color:"#3D3B52", fontSize:13}}>/100</span>
                  </div>
                </div>
                <p style={{color:"#B0AEC8", fontSize:13, lineHeight:1.7, marginBottom:16}}>{feedback.overallFeedback}</p>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:16}}>
                  {[
                    {label:"Your Time",    value:feedback.timeComplexity,          color:"#00D4C8"},
                    {label:"Optimal Time", value:feedback.suggestedTimeComplexity, color:"#34D399"},
                    {label:"Your Space",   value:feedback.spaceComplexity,         color:"#9B6DFF"},
                    {label:"Optimal Space",value:feedback.suggestedSpaceComplexity,color:"#34D399"},
                  ].map((item,i) => (
                    <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 12px"}}>
                      <p style={{color:item.color, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 4px"}}>{item.label}</p>
                      <p style={{color:"white", fontFamily:"monospace", fontSize:13, margin:0}}>{item.value}</p>
                    </div>
                  ))}
                </div>
                {feedback.strengths?.length>0 && (
                  <div style={{background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:10, padding:14, marginBottom:12}}>
                    <p style={{color:"#34D399", fontWeight:700, fontSize:12, margin:"0 0 8px"}}>✅ STRENGTHS</p>
                    {feedback.strengths.map((s,i)=><p key={i} style={{color:"#B0AEC8", fontSize:13, margin:"0 0 4px"}}>• {s}</p>)}
                  </div>
                )}
                {feedback.improvements?.length>0 && (
                  <div style={{background:"rgba(255,140,56,0.06)", border:"1px solid rgba(255,140,56,0.2)", borderRadius:10, padding:14, marginBottom:12}}>
                    <p style={{color:"#FF8C38", fontWeight:700, fontSize:12, margin:"0 0 8px"}}>💡 IMPROVEMENTS</p>
                    {feedback.improvements.map((s,i)=><p key={i} style={{color:"#B0AEC8", fontSize:13, margin:"0 0 4px"}}>• {s}</p>)}
                  </div>
                )}
                {feedback.optimizedApproach && (
                  <div style={{background:"rgba(155,109,255,0.06)", border:"1px solid rgba(155,109,255,0.2)", borderRadius:10, padding:14}}>
                    <p style={{color:"#9B6DFF", fontWeight:700, fontSize:12, margin:"0 0 8px"}}>🚀 OPTIMAL APPROACH</p>
                    <p style={{color:"#B0AEC8", fontSize:13, lineHeight:1.65, margin:0}}>{feedback.optimizedApproach}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   EDITOR PANE  — wraps CodeEditor component
══════════════════════════════════════════════ */
function EditorPane({
  form, setForm, code, setCode, problem, submitting,
  hintLoad, hintsUsed, elapsed, timerOn, setTimerOn,
  fullEd, setFullEd, onReset, onHint, onSubmit
}) {
  return (
    <div style={{display:"flex", flexDirection:"column", height:"100%", overflow:"hidden"}}>

      {/* Top bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 14px", height:46, borderBottom:"1px solid var(--border)",
        flexShrink:0, background:"var(--bg2)", gap:8
      }}>
        {/* Language switcher */}
        <select value={form.language} onChange={e => setForm(f => ({...f, language:e.target.value}))}
          style={{
            background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:7, color:"white", fontSize:12, padding:"4px 9px", outline:"none", cursor:"pointer"
          }}>
          {LANGS.map(l => <option key={l} style={{background:"#111118"}}>{l}</option>)}
        </select>

        {/* Timer */}
        {problem && (
          <div style={{display:"flex", alignItems:"center", gap:7}}>
            <span style={{fontFamily:"monospace", fontSize:12, color:elapsed>1800?"#F87171":"#7A7890", display:"flex", alignItems:"center", gap:4}}>
              <Clock size={12}/> {fmtTime(elapsed)}
            </span>
            <button onClick={()=>setTimerOn(t=>!t)} style={{
              background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
              borderRadius:5, padding:"2px 7px", color:"#7A7890", fontSize:11, cursor:"pointer"
            }}>{timerOn?"⏸":"▶"}</button>
          </div>
        )}

        {/* Controls */}
        <div style={{display:"flex", gap:5}}>
          <button onClick={onReset} disabled={!problem} title="Reset to boilerplate" style={{
            width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
            background:"transparent", border:"1px solid var(--border)",
            color:problem?"#7A7890":"#3D3B52", cursor:problem?"pointer":"not-allowed"
          }}><RotateCcw size={12}/></button>
          <button onClick={()=>setFullEd(f=>!f)} title="Toggle fullscreen" style={{
            width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
            background:"transparent", border:"1px solid var(--border)", color:"#7A7890", cursor:"pointer"
          }}>{fullEd ? <Minimize2 size={12}/> : <Maximize2 size={12}/>}</button>
        </div>
      </div>

      {/* CodeMirror editor */}
      <div style={{flex:1, overflow:"hidden", position:"relative"}}>
        <CodeEditor
          value={code}
          onChange={setCode}
          language={form.language}
          disabled={!problem}
          onSubmit={onSubmit}
          placeholder={problem
            ? `// Write your ${form.language} solution here...\n// Ctrl+Enter to submit`
            : "// Generate a problem above to start coding..."}
        />
      </div>

      {/* Bottom bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"9px 14px", borderTop:"1px solid var(--border)",
        flexShrink:0, background:"var(--bg2)", gap:10
      }}>
        <button onClick={onHint} disabled={!problem||hintsUsed>=3||hintLoad} style={{
          display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
          borderRadius:9, fontSize:13, fontWeight:600,
          background:"transparent", border:"1px solid var(--border)",
          color:(!problem||hintsUsed>=3)?"#3D3B52":"#FBBF24",
          cursor:(!problem||hintsUsed>=3)?"not-allowed":"pointer",
          opacity:(!problem||hintsUsed>=3)?0.5:1
        }}>
          {hintLoad?<Loader size={13} style={{animation:"spin 0.8s linear infinite"}}/>:<Lightbulb size={13}/>}
          Hint ({3-hintsUsed} left)
        </button>
        <button onClick={onSubmit} disabled={!problem||submitting||!code.trim()} style={{
          display:"flex", alignItems:"center", gap:7, padding:"8px 20px",
          borderRadius:9, fontSize:13, fontWeight:700, border:"none",
          background:(!problem||!code.trim())?"rgba(155,109,255,0.3)":"linear-gradient(135deg,#9B6DFF,#C4A3FF)",
          color:"white", cursor:(!problem||!code.trim())?"not-allowed":"pointer"
        }}>
          {submitting?<Loader size={13} style={{animation:"spin 0.8s linear infinite"}}/>:<Play size={13}/>}
          Submit
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PROBLEMS VIEW
══════════════════════════════════════════════ */
function ProblemsView({ problems, setView, onRetry, onLoad }) {
  const solved    = problems.filter(p=>p.status==="SOLVED").length;
  const attempted = problems.filter(p=>p.status==="ATTEMPTED"||p.status==="REVIEWED").length;
  const inProgress= problems.filter(p=>p.status==="GENERATED"||p.status==="ATTEMPTED").length;

  return (
    <div style={{flex:1, overflowY:"auto", padding:24}}>
      <div style={{maxWidth:720, margin:"0 auto"}}>
        <h2 style={{color:"white", fontFamily:"Bricolage Grotesque", fontSize:20, fontWeight:700, marginBottom:20}}>
          My Problems ({problems.length})
        </h2>

        {/* Stats */}
        {problems.length > 0 && (
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24}}>
            {[
              {label:"Solved",      count:solved,      color:"#34D399"},
              {label:"In Progress", count:inProgress,  color:"#FBBF24"},
              {label:"Attempted",   count:attempted,   color:"#9B6DFF"},
              {label:"Total",       count:problems.length, color:"#7A7890"},
            ].map((s,i) => (
              <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:12, padding:"12px 14px", textAlign:"center"}}>
                <p style={{color:s.color, fontSize:24, fontWeight:800, fontFamily:"Bricolage Grotesque", margin:0}}>{s.count}</p>
                <p style={{color:"#7A7890", fontSize:11, margin:0}}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {problems.length===0 ? (
          <div style={{textAlign:"center", padding:"60px 0"}}>
            <Code2 size={40} style={{color:"#3D3B52", margin:"0 auto 12px", display:"block"}}/>
            <p style={{color:"white", fontWeight:600, marginBottom:6}}>No problems yet</p>
            <p style={{color:"#7A7890", fontSize:13, marginBottom:20}}>Generate your first problem to get started</p>
            <button onClick={()=>setView("practice")} style={{
              padding:"8px 20px", borderRadius:10, fontSize:13, fontWeight:600,
              background:"linear-gradient(135deg,#9B6DFF,#C4A3FF)", color:"white", border:"none", cursor:"pointer"
            }}>Start Practicing</button>
          </div>
        ) : (
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {/* Header */}
            <div style={{display:"grid", gridTemplateColumns:"minmax(0,1fr) 80px 90px 100px 110px",
              padding:"6px 14px", gap:10, color:"#3D3B52", fontSize:10, fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.08em"}}>
              <span>Problem</span><span>Difficulty</span><span>Language</span><span>Status</span><span>Action</span>
            </div>

            {problems.map((p,i) => {
              const statusColor = p.status==="SOLVED"?"#34D399":p.status==="REVIEWED"?"#9B6DFF":p.status==="ATTEMPTED"?"#FBBF24":"#7A7890";
              const canResume   = p.status==="GENERATED" || p.status==="ATTEMPTED";
              const canRetry    = p.status==="SOLVED"    || p.status==="REVIEWED";

              return (
                <div key={i}
                  onClick={() => onLoad(p.id, p.language)}
                  style={{
                    display:"grid", gridTemplateColumns:"minmax(0,1fr) 80px 90px 100px 110px",
                    alignItems:"center", gap:10,
                    background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)",
                    borderRadius:11, padding:"12px 14px", cursor:"pointer", transition:"all 0.15s"
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(155,109,255,0.4)"; e.currentTarget.style.background="rgba(155,109,255,0.05)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="rgba(255,255,255,0.03)";}}>

                  {/* Title + meta */}
                  <div style={{minWidth:0}}>
                    <p style={{color:"white", fontWeight:600, fontSize:13, margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{p.title}</p>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <span style={{color:"#3D3B52", fontSize:11}}>{p.topic}</span>
                      {p.hintsUsed > 0 && <span style={{color:"#FBBF24", fontSize:10}}>💡 {p.hintsUsed} hint{p.hintsUsed!==1?"s":""} used</span>}
                    </div>
                  </div>

                  <Badge color={DIFF_COLOR[p.difficulty]} bg={DIFF_BG[p.difficulty]}>{p.difficulty}</Badge>
                  <Badge color="#7A7890">{p.language}</Badge>
                  <Badge color={statusColor}>{p.status}</Badge>

                  {/* Action button */}
                  <div onClick={e=>e.stopPropagation()} style={{display:"flex", flexDirection:"column", gap:4}}>
                    {canResume && (
                      <button onClick={() => onLoad(p.id, p.language)} style={{
                        padding:"5px 12px", borderRadius:7, fontSize:11, fontWeight:700,
                        background:"rgba(255,107,0,0.12)", border:"1px solid rgba(255,107,0,0.3)",
                        color:"#FF8C38", cursor:"pointer", whiteSpace:"nowrap", width:"100%"
                      }}>▶ Resume</button>
                    )}
                    {canRetry && (
                      <button onClick={() => onLoad(p.id, p.language)} style={{
                        padding:"5px 12px", borderRadius:7, fontSize:11, fontWeight:700,
                        background:"rgba(0,212,200,0.1)", border:"1px solid rgba(0,212,200,0.3)",
                        color:"#00D4C8", cursor:"pointer", whiteSpace:"nowrap", width:"100%"
                      }}>👁 View</button>
                    )}
                    {canRetry && (
                      <button onClick={() => onRetry(p.id, p.language)} style={{
                        padding:"5px 12px", borderRadius:7, fontSize:11, fontWeight:700,
                        background:"rgba(155,109,255,0.12)", border:"1px solid rgba(155,109,255,0.3)",
                        color:"#9B6DFF", cursor:"pointer", whiteSpace:"nowrap", width:"100%"
                      }}>↺ Retry</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROADMAP VIEW
══════════════════════════════════════════════ */
function RoadmapView({ roadmap, rmLoad, onGenerate, onReset }) {
  return (
    <div style={{flex:1, overflowY:"auto", padding:24}}>
      <div style={{maxWidth:620, margin:"0 auto"}}>
        {!roadmap ? (
          <div style={{textAlign:"center", paddingTop:64}}>
            <div style={{width:64, height:64, borderRadius:16, margin:"0 auto 16px", background:"rgba(155,109,255,0.1)", border:"1px solid rgba(155,109,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <Map size={28} style={{color:"#9B6DFF"}}/>
            </div>
            <h2 style={{color:"white", fontFamily:"Bricolage Grotesque", fontSize:22, fontWeight:700, marginBottom:8}}>DSA Roadmap</h2>
            <p style={{color:"#7A7890", fontSize:14, marginBottom:24}}>Personalized path for campus placements</p>
            <button onClick={onGenerate} disabled={rmLoad} style={{display:"inline-flex", alignItems:"center", gap:8, padding:"10px 24px", borderRadius:12, fontWeight:700, fontSize:14, border:"none", background:"linear-gradient(135deg,#9B6DFF,#C4A3FF)", color:"white", cursor:rmLoad?"not-allowed":"pointer"}}>
              {rmLoad?<Loader size={15} style={{animation:"spin 0.8s linear infinite"}}/>:<Map size={15}/>}
              {rmLoad?"Generating...":"Generate Roadmap"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{marginBottom:20}}>
              <h2 style={{color:"white", fontFamily:"Bricolage Grotesque", fontSize:20, fontWeight:700, marginBottom:4}}>{roadmap.roadmapTitle}</h2>
              <p style={{color:"#7A7890", fontSize:13}}>⏱ {roadmap.estimatedDuration} · 🎯 {roadmap.dailyPracticeGoal}</p>
            </div>
            {roadmap.phases?.map((phase,i) => (
              <div key={i} style={{display:"flex", gap:14, marginBottom:22}}>
                <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                  <div style={{width:34, height:34, borderRadius:"50%", flexShrink:0, background:"rgba(155,109,255,0.15)", border:"1px solid rgba(155,109,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"#9B6DFF", fontSize:13, fontWeight:800}}>{phase.phase}</div>
                  {i<roadmap.phases.length-1 && <div style={{width:1, flex:1, background:"rgba(155,109,255,0.2)", marginTop:8}}/>}
                </div>
                <div style={{paddingBottom:6}}>
                  <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap"}}>
                    <span style={{color:"white", fontWeight:700, fontSize:14}}>{phase.title}</span>
                    <span style={{color:"#3D3B52", fontSize:12}}>({phase.duration})</span>
                    <Badge color="#9B6DFF">{phase.practiceProblems} problems</Badge>
                  </div>
                  <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:8}}>
                    {phase.topics?.map((t,j) => (
                      <span key={j} style={{background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", borderRadius:7, padding:"3px 9px", fontSize:12, color:"#7A7890"}}>{t}</span>
                    ))}
                  </div>
                  <p style={{color:"#00D4C8", fontSize:12, margin:0}}>✓ {phase.milestone}</p>
                </div>
              </div>
            ))}
            {roadmap.recommendedResources?.length>0 && (
              <div style={{background:"rgba(155,109,255,0.06)", border:"1px solid rgba(155,109,255,0.2)", borderRadius:12, padding:16, marginBottom:16}}>
                <p style={{color:"#9B6DFF", fontWeight:700, fontSize:12, margin:"0 0 8px"}}>📚 RESOURCES</p>
                {roadmap.recommendedResources.map((r,i)=><p key={i} style={{color:"#7A7890", fontSize:13, margin:"0 0 5px"}}>• {r}</p>)}
              </div>
            )}
            <button onClick={onReset} style={{width:"100%", padding:"9px", borderRadius:10, fontSize:13, fontWeight:600, background:"transparent", border:"1px solid var(--border)", color:"#7A7890", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6}}>
              <RefreshCw size={13}/> Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function CodingTutor() {

  const [view, setView]         = useState("practice");
  const [form, setForm]         = useState({ topic:"Arrays", difficulty:"MEDIUM", language:"Java" });
  const [problem, setProblem]   = useState(null);
  const [probId, setProbId]     = useState(null);
  const [generating, setGen]    = useState(false);
  const [code, setCode]         = useState(BOILERPLATE["Java"]);
  const [submitting, setSub]    = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hints, setHints]       = useState([]);
  const [hintsUsed, setHUsed]   = useState(0);
  const [hintLoad, setHL]       = useState(false);
  const [leftTab, setLeftTab]   = useState("description");
  const [problems, setProblems] = useState([]);
  const [roadmap, setRoadmap]   = useState(null);
  const [rmLoad, setRmLoad]     = useState(false);
  const [navOpen, setNavOpen]   = useState(false);
  const [fullEd, setFullEd]     = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [timerOn, setTimerOn]   = useState(false);
  const [pct, onDivDown]        = useSplit(42);
  const timerRef = useRef(null);

  /* timer */
  useEffect(() => {
    if (timerOn) timerRef.current = setInterval(() => setElapsed(s=>s+1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  /* reset boilerplate when language changes (only if no problem loaded) */
  useEffect(() => {
    if (!problem) setCode(BOILERPLATE[form.language] || "");
  }, [form.language, problem]);

  useEffect(() => {
    if (view === "problems") fetchProblems();
  }, [view]);

  const generateProblem = async () => {
    setGen(true); setProblem(null); setFeedback(null);
    setHints([]); setHUsed(0);
    setCode(BOILERPLATE[form.language] || "");
    setElapsed(0); setTimerOn(false); setLeftTab("description");
    try {
      const res = await API.post("/coding/problem/generate", form);
      setProblem(res.data.problem); setProbId(res.data.problemId);
      setTimerOn(true); toast.success("Problem ready! 🧩");
    } catch (err) { if (!err.handled) toast.error("Failed to generate problem"); }
    finally { setGen(false); }
  };

  const getHint = async () => {
    if (hintsUsed>=3) { toast.error("Max 3 hints per problem"); return; }
    setHL(true);
    try {
      const res = await API.post("/coding/hint", { problemId:probId, currentCode:code });
      setHints(h=>[...h, res.data.hint]); setHUsed(res.data.hintsUsed);
      setLeftTab("hints"); toast.success(`Hint ${res.data.hintsUsed}/3 unlocked 💡`);
    } catch (err) { if (!err.handled) toast.error("Failed to get hint"); }
    finally { setHL(false); }
  };

  const submitCode = async () => {
    if (!code.trim()) { toast.error("Write some code first!"); return; }
    setSub(true); setTimerOn(false);
    try {
      const res = await API.post("/coding/submit", { problemId:probId, code, language:form.language });
      setFeedback(res.data); setLeftTab("feedback");
      toast.success(res.data.isCorrect ? "Correct! 🎉 +50 XP" : "Reviewed! See feedback →");
    } catch (err) { if (!err.handled) toast.error("Failed to submit"); }
    finally { setSub(false); }
  };


  const loadProblem = async (id, lang) => {
    setGen(true); setFeedback(null); setHints([]); setHUsed(0);
    setElapsed(0); setTimerOn(false); setLeftTab("description");
    try {
      const res = await API.get(`/coding/problem/${id}`);
      const d = res.data;
      const actualId = d.problemId || id;
      const actualLang = d.language || lang || form.language;

      // FIX: Gracefully handle old problems where problemJson may be null/missing in DB.
      // Backend returns parsed object under "problem" key; fall back to raw string "problemJson".
      const prob = d.problem || d.problemJson;
      if (!prob) {
        // Problem data missing in DB — show a friendly message instead of crashing
        toast.error("This problem's data could not be loaded. It may be from an older session. Try generating a new problem.");
        setView("practice");
        setGen(false);
        return;
      }

      setProblem(prob);
      setProbId(actualId);
      setCode(d.submittedCode || BOILERPLATE[actualLang] || BOILERPLATE["Java"]);
      setHUsed(d.hintsUsed || 0);
      setForm(f => ({ ...f, language: actualLang }));

      // FIX: feedbackJson is now returned as a parsed object from the backend (not a string).
      // Handle both object and string forms for backward compatibility.
      if (d.feedbackJson && typeof d.feedbackJson === "object" && d.feedbackJson.score !== undefined) {
        setFeedback(d.feedbackJson);
        setLeftTab("feedback");
      } else if (d.feedbackJson && typeof d.feedbackJson === "string" && d.feedbackJson !== "null") {
        try {
          const fb = JSON.parse(d.feedbackJson);
          if (fb && fb.score !== undefined) { setFeedback(fb); setLeftTab("feedback"); }
        } catch (e) { console.warn("Could not parse feedbackJson string:", e); }
      }

      setView("practice");
      const isDone = d.status === "SOLVED" || d.status === "REVIEWED";
      if (!isDone) setTimerOn(true);
      toast.success(isDone ? "Problem loaded — see feedback →" : "Problem loaded, resume coding ▶");
    } catch (err) {
      console.error("loadProblem error:", err);
      if (!err.handled) toast.error(err.message || "Failed to load problem");
    }
    finally { setGen(false); }
  };

  const retryProblem = async (id, lang) => {
    const useLang = lang || form.language;
    setGen(true); setFeedback(null); setHints([]); setHUsed(0);
    setCode(BOILERPLATE[useLang] || BOILERPLATE["Java"]); setElapsed(0);
    setTimerOn(false); setLeftTab("description");
    try {
      const res = await API.post(`/coding/problem/${id}/retry`);
      setProblem(res.data.problem); setProbId(res.data.problemId);
      setForm(f => ({ ...f, language: useLang }));
      setView("practice"); setTimerOn(true);
      toast.success("Problem reset — attempt it fresh! 🔄");
    } catch (err) {
      console.error("retryProblem error:", err);
      if (!err.handled) toast.error("Failed to retry problem");
    }
    finally { setGen(false); }
  };

  const fetchProblems = async () => {
    try {
      const res = await API.get("/coding/problems?page=0&size=50");
      setProblems(res.data.content || res.data);
    } catch {}
  };

  const fetchRoadmap = async () => {
    setRmLoad(true);
    try {
      const res = await API.get("/coding/roadmap?goal=Campus Placement");
      setRoadmap(res.data.roadmap);
    } catch (err) { if (!err.handled) toast.error("Failed to generate roadmap"); }
    finally { setRmLoad(false); }
  };

  const resetEditor = () => {
    setCode(BOILERPLATE[form.language] || "");
    setFeedback(null); setHints([]); setHUsed(0);
    setElapsed(0); setTimerOn(false); setLeftTab("description");
  };

  const sharedEditorProps = {
    form, setForm, code, setCode, problem, submitting,
    hintLoad, hintsUsed, elapsed, timerOn, setTimerOn,
    fullEd, setFullEd, onReset:resetEditor, onHint:getHint, onSubmit:submitCode
  };

  return (
    <div style={{display:"flex", height:"100vh", overflow:"hidden", background:"var(--bg)"}}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex" style={{
        width:56, background:"var(--bg2)", borderRight:"1px solid var(--border)",
        flexDirection:"column", alignItems:"center", paddingTop:14, gap:6, flexShrink:0
      }}>
        <Link to="/dashboard" title="Dashboard" style={{width:36, height:36, borderRadius:10, marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,107,0,0.15)"}}>
          <Compass size={18} style={{color:"#FF8C38"}}/>
        </Link>
        {[
          {id:"practice", icon:<Code2 size={18}/>, tip:"Practice"},
          {id:"problems", icon:<List  size={18}/>, tip:"My Problems"},
          {id:"roadmap",  icon:<Map   size={18}/>, tip:"Roadmap"},
        ].map(item => (
          <button key={item.id} title={item.tip} onClick={()=>setView(item.id)} style={{
            width:36, height:36, borderRadius:10, border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            background:view===item.id?"rgba(155,109,255,0.2)":"transparent",
            color:view===item.id?"#9B6DFF":"#3D3B52",
            outline:view===item.id?"1px solid rgba(155,109,255,0.4)":"none",
            transition:"all 0.15s"
          }}>{item.icon}</button>
        ))}
      </aside>

      {/* Main column */}
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0}}>

        {/* Mobile top bar */}
        <div className="md:hidden" style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 16px", background:"var(--bg2)",
          borderBottom:"1px solid var(--border)", flexShrink:0
        }}>
          <Link to="/dashboard" style={{display:"flex", alignItems:"center", gap:8}}>
            <div style={{width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#FF6B00,#FF9A3C)"}}>
              <Compass size={13} style={{color:"white"}}/>
            </div>
            <span style={{color:"white", fontWeight:700, fontSize:14, fontFamily:"Bricolage Grotesque"}}>Coding Tutor</span>
          </Link>
          <button onClick={()=>setNavOpen(o=>!o)} style={{background:"none", border:"none", color:"#7A7890", cursor:"pointer"}}>
            {navOpen?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>

        {/* Mobile nav overlay */}
        {navOpen && (
          <div style={{position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.65)"}} onClick={()=>setNavOpen(false)}>
            <div style={{position:"absolute", top:0, left:0, right:0, background:"var(--bg2)", borderBottom:"1px solid var(--border)", padding:"56px 12px 12px"}} onClick={e=>e.stopPropagation()}>
              {[["practice","🧩 Practice"],["problems","📋 My Problems"],["roadmap","🗺️ Roadmap"]].map(([id,label])=>(
                <button key={id} onClick={()=>{setView(id);setNavOpen(false);}} style={{display:"block", width:"100%", textAlign:"left", padding:"11px 14px", borderRadius:10, fontSize:14, fontWeight:600, background:view===id?"rgba(155,109,255,0.15)":"transparent", color:view===id?"#9B6DFF":"#7A7890", border:"none", cursor:"pointer", marginBottom:3}}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* PRACTICE */}
        {view==="practice" && (
          <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
            <GenBar form={form} setForm={setForm} generating={generating} onGenerate={generateProblem}/>
            {fullEd ? (
              <div style={{flex:1, overflow:"hidden", display:"flex", flexDirection:"column"}}>
                <EditorPane {...sharedEditorProps}/>
              </div>
            ) : (
              <div id="ct-split" style={{flex:1, display:"flex", overflow:"hidden"}}>
                <div style={{width:`${pct}%`, minWidth:0, display:"flex", flexDirection:"column", overflow:"hidden"}}>
                  <LeftPane problem={problem} generating={generating} leftTab={leftTab} setLeftTab={setLeftTab} hints={hints} hintsUsed={hintsUsed} feedback={feedback} form={form}/>
                </div>
                <div onMouseDown={onDivDown} style={{width:4, flexShrink:0, cursor:"col-resize", background:"var(--border)", transition:"background 0.15s", position:"relative"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#9B6DFF"}
                  onMouseLeave={e=>e.currentTarget.style.background="var(--border)"}>
                  <div style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:10, height:28, borderRadius:5, background:"rgba(255,255,255,0.1)", pointerEvents:"none"}}/>
                </div>
                <div style={{flex:1, minWidth:0, display:"flex", flexDirection:"column", overflow:"hidden"}}>
                  <EditorPane {...sharedEditorProps}/>
                </div>
              </div>
            )}
          </div>
        )}

        {view==="problems" && <ProblemsView problems={problems} setView={setView} onRetry={retryProblem} onLoad={loadProblem}/>}
        {view==="roadmap"  && <RoadmapView roadmap={roadmap} rmLoad={rmLoad} onGenerate={fetchRoadmap} onReset={()=>setRoadmap(null)}/>}
      </div>
    </div>
  );
}