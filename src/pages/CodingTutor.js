import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Code2, Lightbulb, Send, Map, Loader, CheckCircle, XCircle,
  List, Zap, Play, RotateCcw, Clock, HardDrive,
  Compass, Menu, X, Maximize2, Minimize2, AlignLeft, RefreshCw, Trophy
} from "lucide-react";

/* ── constants ── */
const DIFF_COLOR = { EASY:"#34D399", MEDIUM:"#FBBF24", HARD:"#F87171" };
const DIFF_BG    = { EASY:"rgba(52,211,153,0.12)", MEDIUM:"rgba(251,191,36,0.12)", HARD:"rgba(248,113,113,0.12)" };
const LANG_MAP   = { Java:"java", Python:"python", "C++":"cpp", JavaScript:"javascript", C:"c", Kotlin:"kotlin" };
const TOPICS     = ["Arrays","Linked Lists","Stacks","Queues","Binary Trees","BST","Graphs",
                    "Dynamic Programming","Sorting","Searching","Recursion","Hashing",
                    "Bit Manipulation","Strings","Two Pointers","Sliding Window"];
const LANGUAGES  = ["Java","Python","C++","JavaScript","C","Kotlin"];

/* ── Badge chip ── */
const Badge = ({ children, color="#7A7890", bg }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", padding:"2px 10px",
    borderRadius:100, fontSize:11, fontWeight:700,
    color, background: bg||`${color}18`, border:`1px solid ${color}30`
  }}>{children}</span>
);

/* ── draggable split ── */
function useSplit(init=42) {
  const [pct, setPct] = useState(init);
  const drag = useRef(false);
  const onDown = useCallback(e => {
    e.preventDefault(); drag.current = true;
    const move = ev => {
      if (!drag.current) return;
      const el = document.getElementById("ct-split");
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPct(Math.min(75, Math.max(25, ((ev.clientX-r.left)/r.width)*100)));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", () => { drag.current=false; }, { once:true });
  },[]);
  return [pct, onDown];
}

/* ══════════════ MAIN ══════════════ */
export default function CodingTutor() {

  /* state */
  const [view, setView]           = useState("practice");
  const [form, setForm]           = useState({ topic:"Arrays", difficulty:"MEDIUM", language:"Java" });
  const [problem, setProblem]     = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [code, setCode]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback]   = useState(null);
  const [hints, setHints]         = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintLoad, setHintLoad]   = useState(false);
  const [leftTab, setLeftTab]     = useState("description");
  const [problems, setProblems]   = useState([]);
  const [roadmap, setRoadmap]     = useState(null);
  const [rmLoad, setRmLoad]       = useState(false);
  const [navOpen, setNavOpen]     = useState(false);
  const [fullEd, setFullEd]       = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [timerOn, setTimerOn]     = useState(false);
  const [pct, onDown]             = useSplit(42);

  /* refs */
  const codeRef  = useRef(null);  // highlighted pre>code element
  const timer    = useRef(null);

  /* timer */
  useEffect(() => {
    if (timerOn) timer.current = setInterval(() => setElapsed(s=>s+1), 1000);
    else clearInterval(timer.current);
    return () => clearInterval(timer.current);
  }, [timerOn]);

  /* syntax highlight using Prism on the ref element — avoids React DOM conflict */
  const doHighlight = useCallback(() => {
    if (!codeRef.current || !window.Prism) return;
    const lang = LANG_MAP[form.language] || "javascript";
    codeRef.current.className = `language-${lang}`;
    codeRef.current.textContent = code || " ";
    window.Prism.highlightElement(codeRef.current);
  }, [code, form.language]);

  useEffect(() => { doHighlight(); }, [doHighlight]);
  useEffect(() => { if (view==="problems") fetchProblems(); }, [view]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* actions */
  const generateProblem = async () => {
    setGenerating(true); setProblem(null); setFeedback(null);
    setHints([]); setHintsUsed(0); setCode("");
    setElapsed(0); setTimerOn(false); setLeftTab("description");
    try {
      const res = await API.post("/coding/problem/generate", form);
      setProblem(res.data.problem); setProblemId(res.data.problemId);
      setTimerOn(true); toast.success("Problem ready! 🧩");
    } catch (err) { if (!err.handled) toast.error("Failed to generate"); }
    finally { setGenerating(false); }
  };

  const getHint = async () => {
    if (hintsUsed>=3) { toast.error("Max 3 hints per problem"); return; }
    setHintLoad(true);
    try {
      const res = await API.post("/coding/hint", { problemId, currentCode:code });
      setHints(p=>[...p, res.data.hint]); setHintsUsed(res.data.hintsUsed);
      setLeftTab("hints"); toast.success(`Hint ${res.data.hintsUsed}/3 unlocked 💡`);
    } catch (err) { if (!err.handled) toast.error("Failed to get hint"); }
    finally { setHintLoad(false); }
  };

  const submitCode = async () => {
    if (!code.trim()) { toast.error("Write some code first!"); return; }
    setSubmitting(true); setTimerOn(false);
    try {
      const res = await API.post("/coding/submit", { problemId, code, language:form.language });
      setFeedback(res.data); setLeftTab("feedback");
      toast.success(res.data.isCorrect ? "Correct! 🎉 +50 XP" : "Reviewed! See feedback →");
    } catch (err) { if (!err.handled) toast.error("Failed to submit"); }
    finally { setSubmitting(false); }
  };

  const retryProblem = async id => {
    setGenerating(true); setFeedback(null);
    setHints([]); setHintsUsed(0); setCode(""); setElapsed(0);
    setTimerOn(false); setLeftTab("description");
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
    setRmLoad(true);
    try {
      const res = await API.get("/coding/roadmap?goal=Campus Placement");
      setRoadmap(res.data.roadmap);
    } catch (err) { if (!err.handled) toast.error("Failed to generate roadmap"); }
    finally { setRmLoad(false); }
  };

  const resetEditor = () => {
    setCode(""); setFeedback(null); setHints([]);
    setHintsUsed(0); setElapsed(0); setTimerOn(false); setLeftTab("description");
  };

  const handleKeyDown = e => {
    if (e.key==="Tab") {
      e.preventDefault();
      const s = e.target.selectionStart;
      const n = code.substring(0,s)+"  "+code.substring(e.target.selectionEnd);
      setCode(n);
      setTimeout(()=>e.target.setSelectionRange(s+2,s+2),0);
    }
    if ((e.ctrlKey||e.metaKey)&&e.key==="Enter") { e.preventDefault(); submitCode(); }
  };

  /* ── GENERATE BAR ── */
  const GenBar = () => (
    <div style={{
      display:"flex", alignItems:"center", flexWrap:"wrap", gap:8,
      padding:"8px 14px", borderBottom:"1px solid var(--border)", flexShrink:0,
      background:"var(--bg2)", minHeight:48
    }}>
      <select value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))}
        style={{
          flex:"1 1 120px", background:"rgba(255,255,255,0.06)",
          border:"1px solid var(--border)", borderRadius:8,
          color:"white", fontSize:12, padding:"6px 10px", outline:"none", cursor:"pointer"
        }}>
        {TOPICS.map(t=><option key={t} style={{background:"#111118"}}>{t}</option>)}
      </select>

      <div style={{display:"flex",gap:5}}>
        {["EASY","MEDIUM","HARD"].map(d=>(
          <button key={d} onClick={()=>setForm(f=>({...f,difficulty:d}))} style={{
            padding:"5px 10px", borderRadius:7, fontSize:11, fontWeight:700, cursor:"pointer",
            color:form.difficulty===d?"white":DIFF_COLOR[d],
            background:form.difficulty===d?DIFF_BG[d]:"transparent",
            border:`1px solid ${form.difficulty===d?DIFF_COLOR[d]:"rgba(255,255,255,0.1)"}`,
          }}>{d}</button>
        ))}
      </div>

      <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}
        style={{
          background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)",
          borderRadius:8, color:"white", fontSize:12,
          padding:"6px 10px", outline:"none", cursor:"pointer"
        }}>
        {LANGUAGES.map(l=><option key={l} style={{background:"#111118"}}>{l}</option>)}
      </select>

      <button onClick={generateProblem} disabled={generating} style={{
        display:"flex", alignItems:"center", gap:6, padding:"7px 16px",
        borderRadius:8, fontSize:13, fontWeight:700, border:"none", whiteSpace:"nowrap",
        background:generating?"rgba(255,107,0,0.5)":"linear-gradient(135deg,#FF6B00,#FF8C38)",
        color:"white", cursor:generating?"not-allowed":"pointer"
      }}>
        {generating
          ? <><Loader size={13} className="animate-spin"/> Generating...</>
          : <><Zap size={13}/> Generate</>}
      </button>
    </div>
  );

  /* ── LEFT PANE (description / hints / feedback) ── */
  const LeftPane = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {/* tabs */}
      <div style={{
        display:"flex", gap:2, padding:"8px 14px 0",
        borderBottom:"1px solid var(--border)", flexShrink:0, background:"var(--bg2)"
      }}>
        {[
          {id:"description", label:"Description", icon:<AlignLeft size={12}/>},
          {id:"hints",       label:`Hints (${hintsUsed}/3)`, icon:<Lightbulb size={12}/>},
          {id:"feedback",    label:"Feedback", icon:<CheckCircle size={12}/>},
        ].map(t=>(
          <button key={t.id} onClick={()=>setLeftTab(t.id)} style={{
            display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
            background:"transparent", border:"none",
            borderBottom:leftTab===t.id?"2px solid #9B6DFF":"2px solid transparent",
            borderRadius:"6px 6px 0 0", fontSize:12, fontWeight:600, cursor:"pointer",
            color:leftTab===t.id?"#9B6DFF":"#7A7890", transition:"color 0.15s"
          }}>{t.icon}{t.label}</button>
        ))}
      </div>

      {/* body */}
      <div style={{flex:1, overflowY:"auto", padding:18}}>

        {/* DESCRIPTION */}
        {leftTab==="description" && (
          <>
            {!problem && !generating && (
              <div style={{textAlign:"center",paddingTop:64}}>
                <div style={{
                  width:64,height:64,borderRadius:16,margin:"0 auto 16px",
                  background:"rgba(155,109,255,0.1)",border:"1px solid rgba(155,109,255,0.2)",
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}><Code2 size={28} style={{color:"#9B6DFF"}}/></div>
                <p style={{color:"white",fontWeight:700,fontSize:18,fontFamily:"Bricolage Grotesque",marginBottom:6}}>
                  Ready to practice?
                </p>
                <p style={{color:"#7A7890",fontSize:13,lineHeight:1.6}}>
                  Pick a topic and difficulty above,<br/>then hit Generate.
                </p>
              </div>
            )}

            {generating && (
              <div style={{textAlign:"center",paddingTop:64}}>
                <Loader size={32} className="animate-spin" style={{color:"#9B6DFF",margin:"0 auto 16px",display:"block"}}/>
                <p style={{color:"#7A7890",fontSize:14}}>AI is crafting your problem...</p>
              </div>
            )}

            {problem && !generating && (
              <>
                <h2 style={{color:"white",fontSize:19,fontWeight:700,fontFamily:"Bricolage Grotesque",marginBottom:10}}>
                  {problem.title}
                </h2>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
                  <Badge color={DIFF_COLOR[problem.difficulty]} bg={DIFF_BG[problem.difficulty]}>
                    {problem.difficulty}
                  </Badge>
                  <Badge color="#9B6DFF">{problem.language}</Badge>
                  <Badge color="#7A7890">{problem.topic || form.topic}</Badge>
                </div>

                <p style={{color:"#B0AEC8",fontSize:14,lineHeight:1.75,marginBottom:16}}>
                  {problem.problemStatement}
                </p>

                {(problem.inputFormat||problem.outputFormat) && (
                  <div style={{marginBottom:16}}>
                    {problem.inputFormat && (
                      <div style={{marginBottom:10}}>
                        <p style={{color:"white",fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:4}}>Input Format</p>
                        <p style={{color:"#7A7890",fontSize:13}}>{problem.inputFormat}</p>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div>
                        <p style={{color:"white",fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:4}}>Output Format</p>
                        <p style={{color:"#7A7890",fontSize:13}}>{problem.outputFormat}</p>
                      </div>
                    )}
                  </div>
                )}

                {problem.constraints?.length>0 && (
                  <div style={{marginBottom:16}}>
                    <p style={{color:"white",fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8}}>Constraints</p>
                    {problem.constraints.map((c,i)=>(
                      <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
                        <span style={{color:"#9B6DFF",flexShrink:0}}>•</span>
                        <span style={{color:"#7A7890",fontSize:13}}>{c}</span>
                      </div>
                    ))}
                  </div>
                )}

                {problem.examples?.length>0 && (
                  <div style={{marginBottom:16}}>
                    <p style={{color:"white",fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:10}}>Examples</p>
                    {problem.examples.map((ex,i)=>(
                      <div key={i} style={{
                        background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",
                        borderRadius:10,padding:"12px 14px",marginBottom:10,
                        fontFamily:"'JetBrains Mono','Fira Code',monospace",fontSize:13
                      }}>
                        <div style={{marginBottom:5}}>
                          <span style={{color:"#3D3B52"}}>Input:&nbsp;</span>
                          <span style={{color:"#E2E8F0"}}>{ex.input}</span>
                        </div>
                        <div style={{marginBottom:ex.explanation?5:0}}>
                          <span style={{color:"#3D3B52"}}>Output:&nbsp;</span>
                          <span style={{color:"#34D399"}}>{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div style={{color:"#7A7890",fontSize:12,marginTop:6,lineHeight:1.5}}>
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,color:"#00D4C8",fontSize:12}}>
                    <Clock size={12}/> {problem.expectedTimeComplexity}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,color:"#9B6DFF",fontSize:12}}>
                    <HardDrive size={12}/> {problem.expectedSpaceComplexity}
                  </div>
                </div>

                {problem.tags?.length>0 && (
                  <div style={{marginTop:14,display:"flex",flexWrap:"wrap",gap:6}}>
                    {problem.tags.map((t,i)=><Badge key={i} color="#3D3B52">{t}</Badge>)}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* HINTS */}
        {leftTab==="hints" && (
          <div>
            {hints.length===0 ? (
              <div style={{textAlign:"center",paddingTop:48}}>
                <Lightbulb size={36} style={{color:"#3D3B52",margin:"0 auto 12px",display:"block"}}/>
                <p style={{color:"#7A7890",fontSize:13}}>
                  {problem?"Click \"Hint\" in the editor when you're stuck":"Generate a problem first"}
                </p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {hints.map((h,i)=>(
                  <div key={i} style={{
                    background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.2)",
                    borderRadius:12,padding:16
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <Lightbulb size={14} style={{color:"#FBBF24"}}/>
                      <span style={{color:"#FBBF24",fontWeight:700,fontSize:13}}>Hint {i+1} of 3</span>
                    </div>
                    <p style={{color:"#B0AEC8",fontSize:13,lineHeight:1.65,margin:0}}>{h.hint}</p>
                    {h.encouragement && (
                      <p style={{color:"rgba(251,191,36,0.55)",fontSize:12,marginTop:8,fontStyle:"italic",margin:"8px 0 0"}}>{h.encouragement}</p>
                    )}
                  </div>
                ))}
                {hintsUsed<3&&problem&&(
                  <p style={{color:"#3D3B52",fontSize:12,textAlign:"center"}}>{3-hintsUsed} hint{3-hintsUsed!==1?"s":""} remaining</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK */}
        {leftTab==="feedback" && (
          <div>
            {!feedback ? (
              <div style={{textAlign:"center",paddingTop:48}}>
                <CheckCircle size={36} style={{color:"#3D3B52",margin:"0 auto 12px",display:"block"}}/>
                <p style={{color:"#7A7890",fontSize:13}}>Submit your code to see AI feedback</p>
              </div>
            ) : (
              <>
                {/* Score banner */}
                <div style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"14px 18px",marginBottom:18,
                  background:feedback.isCorrect?"rgba(52,211,153,0.08)":"rgba(248,113,113,0.08)",
                  border:`1px solid ${feedback.isCorrect?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.25)"}`,
                  borderRadius:12
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {feedback.isCorrect
                      ?<CheckCircle size={20} style={{color:"#34D399"}}/>
                      :<XCircle    size={20} style={{color:"#F87171"}}/>}
                    <div>
                      <p style={{color:"white",fontWeight:700,fontSize:14,fontFamily:"Bricolage Grotesque",margin:0}}>
                        {feedback.isCorrect?"Accepted":"Needs Work"}
                      </p>
                      <p style={{color:"#7A7890",fontSize:11,margin:0}}>AI Code Review</p>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{
                      fontSize:30,fontWeight:800,fontFamily:"Bricolage Grotesque",
                      color:feedback.score>=80?"#34D399":feedback.score>=60?"#FBBF24":"#F87171"
                    }}>{feedback.score}</span>
                    <span style={{color:"#3D3B52",fontSize:13}}>/100</span>
                  </div>
                </div>

                <p style={{color:"#B0AEC8",fontSize:13,lineHeight:1.7,marginBottom:16}}>
                  {feedback.overallFeedback}
                </p>

                {/* Complexity grid */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
                  {[
                    {label:"Your Time",    value:feedback.timeComplexity,          color:"#00D4C8"},
                    {label:"Optimal Time", value:feedback.suggestedTimeComplexity, color:"#34D399"},
                    {label:"Your Space",   value:feedback.spaceComplexity,         color:"#9B6DFF"},
                    {label:"Optimal Space",value:feedback.suggestedSpaceComplexity,color:"#34D399"},
                  ].map((item,i)=>(
                    <div key={i} style={{
                      background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",
                      borderRadius:10,padding:"10px 12px"
                    }}>
                      <p style={{color:item.color,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 4px"}}>{item.label}</p>
                      <p style={{color:"white",fontFamily:"monospace",fontSize:13,margin:0}}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {feedback.strengths?.length>0 && (
                  <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:10,padding:14,marginBottom:12}}>
                    <p style={{color:"#34D399",fontWeight:700,fontSize:12,margin:"0 0 8px"}}>✅ STRENGTHS</p>
                    {feedback.strengths.map((s,i)=><p key={i} style={{color:"#B0AEC8",fontSize:13,margin:"0 0 4px"}}>• {s}</p>)}
                  </div>
                )}

                {feedback.improvements?.length>0 && (
                  <div style={{background:"rgba(255,140,56,0.06)",border:"1px solid rgba(255,140,56,0.2)",borderRadius:10,padding:14,marginBottom:12}}>
                    <p style={{color:"#FF8C38",fontWeight:700,fontSize:12,margin:"0 0 8px"}}>💡 IMPROVEMENTS</p>
                    {feedback.improvements.map((s,i)=><p key={i} style={{color:"#B0AEC8",fontSize:13,margin:"0 0 4px"}}>• {s}</p>)}
                  </div>
                )}

                {feedback.optimizedApproach && (
                  <div style={{background:"rgba(155,109,255,0.06)",border:"1px solid rgba(155,109,255,0.2)",borderRadius:10,padding:14}}>
                    <p style={{color:"#9B6DFF",fontWeight:700,fontSize:12,margin:"0 0 8px"}}>🚀 OPTIMAL APPROACH</p>
                    <p style={{color:"#B0AEC8",fontSize:13,lineHeight:1.65,margin:0}}>{feedback.optimizedApproach}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* ── EDITOR PANE ── */
  const EditorPane = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>

      {/* Editor top bar */}
      <div style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 14px",height:46,borderBottom:"1px solid var(--border)",
        flexShrink:0,background:"var(--bg2)",gap:8
      }}>
        {/* Language */}
        <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}
          style={{
            background:"rgba(255,255,255,0.06)",border:"1px solid var(--border)",
            borderRadius:7,color:"white",fontSize:12,padding:"4px 9px",outline:"none",cursor:"pointer"
          }}>
          {LANGUAGES.map(l=><option key={l} style={{background:"#111118"}}>{l}</option>)}
        </select>

        {/* Timer */}
        {problem && (
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{
              fontFamily:"monospace",fontSize:12,
              color:elapsed>1800?"#F87171":"#7A7890",
              display:"flex",alignItems:"center",gap:4
            }}>
              <Clock size={12}/>{fmt(elapsed)}
            </span>
            <button onClick={()=>setTimerOn(t=>!t)} style={{
              background:"rgba(255,255,255,0.05)",border:"1px solid var(--border)",
              borderRadius:5,padding:"2px 7px",color:"#7A7890",fontSize:11,cursor:"pointer"
            }}>{timerOn?"⏸":"▶"}</button>
          </div>
        )}

        {/* Controls */}
        <div style={{display:"flex",gap:5}}>
          <button onClick={resetEditor} disabled={!problem} title="Reset code"
            style={{
              width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
              background:"transparent",border:"1px solid var(--border)",
              color:problem?"#7A7890":"#3D3B52",cursor:problem?"pointer":"not-allowed"
            }}>
            <RotateCcw size={12}/>
          </button>
          <button onClick={()=>setFullEd(f=>!f)} title={fullEd?"Exit fullscreen":"Fullscreen editor"}
            style={{
              width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
              background:"transparent",border:"1px solid var(--border)",color:"#7A7890",cursor:"pointer"
            }}>
            {fullEd?<Minimize2 size={12}/>:<Maximize2 size={12}/>}
          </button>
        </div>
      </div>

      {/* Code area — Prism layer + transparent textarea overlay */}
      <div style={{flex:1,position:"relative",overflow:"hidden",background:"#1d1f21"}}>

        {/* Prism highlighted display layer */}
        <pre style={{
          position:"absolute",inset:0,margin:0,
          padding:"14px 16px",overflow:"hidden",
          fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",
          fontSize:13,lineHeight:1.65,tabSize:2,
          background:"transparent",whiteSpace:"pre-wrap",wordBreak:"break-all",
          pointerEvents:"none",userSelect:"none"
        }}>
          <code ref={codeRef}
            className={`language-${LANG_MAP[form.language]||"javascript"}`}
            style={{background:"transparent",fontSize:"inherit",fontFamily:"inherit",lineHeight:"inherit"}}>
          </code>
        </pre>

        {/* Invisible textarea — receives all typing */}
        <textarea
          value={code}
          onChange={e=>setCode(e.target.value)}
          placeholder={problem
            ?`// Write your ${form.language} solution here...\n// Tab = 2 spaces  ·  Ctrl+Enter = submit`
            :"// Generate a problem above to start coding..."}
          spellCheck={false}
          disabled={!problem}
          onKeyDown={handleKeyDown}
          style={{
            position:"absolute",inset:0,width:"100%",height:"100%",
            padding:"14px 16px",resize:"none",outline:"none",border:"none",
            fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",
            fontSize:13,lineHeight:1.65,tabSize:2,
            background:"transparent",
            color: code ? "transparent" : "#3D3B52",
            caretColor:"#fff",
            whiteSpace:"pre-wrap",wordBreak:"break-all"
          }}
        />
      </div>

      {/* Bottom bar */}
      <div style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"9px 14px",borderTop:"1px solid var(--border)",
        flexShrink:0,background:"var(--bg2)",gap:10
      }}>
        <button onClick={getHint}
          disabled={!problem||hintsUsed>=3||hintLoad}
          style={{
            display:"flex",alignItems:"center",gap:6,
            padding:"7px 14px",borderRadius:9,fontSize:13,fontWeight:600,
            background:"transparent",border:"1px solid var(--border)",
            color:(!problem||hintsUsed>=3)?"#3D3B52":"#FBBF24",
            cursor:(!problem||hintsUsed>=3)?"not-allowed":"pointer",
            opacity:(!problem||hintsUsed>=3)?0.5:1
          }}>
          {hintLoad?<Loader size={13} className="animate-spin"/>:<Lightbulb size={13}/>}
          Hint ({3-hintsUsed} left)
        </button>

        <button onClick={submitCode}
          disabled={!problem||submitting||!code.trim()}
          style={{
            display:"flex",alignItems:"center",gap:7,
            padding:"8px 20px",borderRadius:9,fontSize:13,fontWeight:700,
            background:(!problem||!code.trim())?"rgba(155,109,255,0.3)":"linear-gradient(135deg,#9B6DFF,#C4A3FF)",
            color:"white",border:"none",
            cursor:(!problem||!code.trim())?"not-allowed":"pointer"
          }}>
          {submitting?<Loader size={13} className="animate-spin"/>:<Play size={13}/>}
          Submit
        </button>
      </div>
    </div>
  );

  /* ── MY PROBLEMS VIEW ── */
  const ProblemsView = () => {
    const solved   = problems.filter(p=>p.status==="SOLVED").length;
    const attempted= problems.filter(p=>p.status==="ATTEMPTED"||p.status==="REVIEWED").length;
    const total    = problems.length;

    return (
      <div style={{flex:1,overflowY:"auto",padding:24}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <h2 style={{color:"white",fontFamily:"Bricolage Grotesque",fontSize:20,fontWeight:700,marginBottom:20}}>
            My Problems
          </h2>

          {/* Stats */}
          {total>0 && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
              {[
                {label:"Solved",   count:solved,          color:"#34D399"},
                {label:"Attempted",count:attempted,       color:"#FBBF24"},
                {label:"Total",    count:total,           color:"#9B6DFF"},
              ].map((s,i)=>(
                <div key={i} style={{
                  background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",
                  borderRadius:12,padding:"14px 16px",textAlign:"center"
                }}>
                  <p style={{color:s.color,fontSize:26,fontWeight:800,fontFamily:"Bricolage Grotesque",margin:0}}>{s.count}</p>
                  <p style={{color:"#7A7890",fontSize:12,margin:0}}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {total===0 ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <Code2 size={40} style={{color:"#3D3B52",margin:"0 auto 12px",display:"block"}}/>
              <p style={{color:"white",fontWeight:600,marginBottom:6}}>No problems yet</p>
              <p style={{color:"#7A7890",fontSize:13,marginBottom:20}}>Generate your first problem to get started</p>
              <button onClick={()=>setView("practice")} style={{
                padding:"8px 20px",borderRadius:10,fontSize:13,fontWeight:600,
                background:"linear-gradient(135deg,#9B6DFF,#C4A3FF)",
                color:"white",border:"none",cursor:"pointer"
              }}>Start Practicing</button>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div style={{
                display:"grid",gridTemplateColumns:"minmax(0,1fr) 90px 90px 90px 80px",
                padding:"6px 14px",gap:10,
                color:"#3D3B52",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"
              }}>
                <span>Problem</span><span>Difficulty</span><span>Language</span><span>Status</span><span></span>
              </div>

              {problems.map((p,i)=>(
                <div key={i} style={{
                  display:"grid",gridTemplateColumns:"minmax(0,1fr) 90px 90px 90px 80px",
                  alignItems:"center",gap:10,
                  background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",
                  borderRadius:11,padding:"11px 14px",marginBottom:8,transition:"border-color 0.15s"
                }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>

                  <div style={{minWidth:0}}>
                    <p style={{color:"white",fontWeight:600,fontSize:13,margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</p>
                    <p style={{color:"#3D3B52",fontSize:11,margin:0}}>{p.topic} · {p.hintsUsed} hints</p>
                  </div>

                  <Badge color={DIFF_COLOR[p.difficulty]} bg={DIFF_BG[p.difficulty]}>{p.difficulty}</Badge>
                  <Badge color="#7A7890">{p.language}</Badge>
                  <Badge color={
                    p.status==="SOLVED"?"#34D399":
                    p.status==="REVIEWED"?"#9B6DFF":
                    p.status==="ATTEMPTED"?"#FBBF24":"#7A7890"
                  }>{p.status}</Badge>

                  {(p.status==="SOLVED"||p.status==="REVIEWED") ? (
                    <button onClick={()=>retryProblem(p.id)} style={{
                      padding:"4px 10px",borderRadius:7,fontSize:11,fontWeight:600,
                      background:"rgba(155,109,255,0.12)",border:"1px solid rgba(155,109,255,0.3)",
                      color:"#9B6DFF",cursor:"pointer",whiteSpace:"nowrap"
                    }}>Retry</button>
                  ) : <span/>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  /* ── ROADMAP VIEW ── */
  const RoadmapView = () => (
    <div style={{flex:1,overflowY:"auto",padding:24}}>
      <div style={{maxWidth:620,margin:"0 auto"}}>
        {!roadmap ? (
          <div style={{textAlign:"center",paddingTop:64}}>
            <div style={{
              width:64,height:64,borderRadius:16,margin:"0 auto 16px",
              background:"rgba(155,109,255,0.1)",border:"1px solid rgba(155,109,255,0.2)",
              display:"flex",alignItems:"center",justifyContent:"center"
            }}><Map size={28} style={{color:"#9B6DFF"}}/></div>
            <h2 style={{color:"white",fontFamily:"Bricolage Grotesque",fontSize:22,fontWeight:700,marginBottom:8}}>DSA Roadmap</h2>
            <p style={{color:"#7A7890",fontSize:14,marginBottom:24}}>Personalized path for campus placements</p>
            <button onClick={fetchRoadmap} disabled={rmLoad} style={{
              display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",
              borderRadius:12,fontWeight:700,fontSize:14,border:"none",
              background:"linear-gradient(135deg,#9B6DFF,#C4A3FF)",
              color:"white",cursor:rmLoad?"not-allowed":"pointer"
            }}>
              {rmLoad?<Loader size={15} className="animate-spin"/>:<Map size={15}/>}
              {rmLoad?"Generating...":"Generate Roadmap"}
            </button>
          </div>
        ) : (
          <>
            <div style={{marginBottom:20}}>
              <h2 style={{color:"white",fontFamily:"Bricolage Grotesque",fontSize:20,fontWeight:700,marginBottom:4}}>{roadmap.roadmapTitle}</h2>
              <p style={{color:"#7A7890",fontSize:13}}>⏱ {roadmap.estimatedDuration} · 🎯 {roadmap.dailyPracticeGoal}</p>
            </div>

            {roadmap.phases?.map((phase,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:22}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{
                    width:34,height:34,borderRadius:"50%",flexShrink:0,
                    background:"rgba(155,109,255,0.15)",border:"1px solid rgba(155,109,255,0.3)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:"#9B6DFF",fontSize:13,fontWeight:800
                  }}>{phase.phase}</div>
                  {i<roadmap.phases.length-1&&<div style={{width:1,flex:1,background:"rgba(155,109,255,0.2)",marginTop:8}}/>}
                </div>
                <div style={{paddingBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                    <p style={{color:"white",fontWeight:700,fontSize:14,margin:0}}>{phase.title}</p>
                    <span style={{color:"#3D3B52",fontSize:12}}>({phase.duration})</span>
                    <Badge color="#9B6DFF">{phase.practiceProblems} problems</Badge>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    {phase.topics?.map((t,j)=>(
                      <span key={j} style={{
                        background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",
                        borderRadius:7,padding:"3px 9px",fontSize:12,color:"#7A7890"
                      }}>{t}</span>
                    ))}
                  </div>
                  <p style={{color:"#00D4C8",fontSize:12,margin:0}}>✓ {phase.milestone}</p>
                </div>
              </div>
            ))}

            {roadmap.recommendedResources?.length>0 && (
              <div style={{
                background:"rgba(155,109,255,0.06)",border:"1px solid rgba(155,109,255,0.2)",
                borderRadius:12,padding:16,marginBottom:16
              }}>
                <p style={{color:"#9B6DFF",fontWeight:700,fontSize:12,margin:"0 0 8px"}}>📚 RESOURCES</p>
                {roadmap.recommendedResources.map((r,i)=>(
                  <p key={i} style={{color:"#7A7890",fontSize:13,margin:"0 0 5px"}}>• {r}</p>
                ))}
              </div>
            )}

            <button onClick={()=>setRoadmap(null)} style={{
              width:"100%",padding:"9px",borderRadius:10,fontSize:13,fontWeight:600,
              background:"transparent",border:"1px solid var(--border)",color:"#7A7890",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6
            }}>
              <RefreshCw size={13}/> Regenerate
            </button>
          </>
        )}
      </div>
    </div>
  );

  /* ── ROOT RENDER ── */
  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"var(--bg)"}}>

      {/* Desktop icon sidebar */}
      <aside style={{
        width:56,background:"var(--bg2)",borderRight:"1px solid var(--border)",
        display:"flex",flexDirection:"column",alignItems:"center",
        paddingTop:14,gap:6,flexShrink:0
      }} className="hidden md:flex">
        <Link to="/dashboard" title="Dashboard" style={{
          width:36,height:36,borderRadius:10,marginBottom:10,
          display:"flex",alignItems:"center",justifyContent:"center",
          background:"rgba(255,107,0,0.15)"
        }}>
          <Compass size={18} style={{color:"#FF8C38"}}/>
        </Link>
        {[
          {id:"practice",icon:<Code2 size={18}/>,tip:"Practice"},
          {id:"problems",icon:<List size={18}/>,tip:"My Problems"},
          {id:"roadmap", icon:<Map size={18}/>, tip:"Roadmap"},
        ].map(item=>(
          <button key={item.id} title={item.tip} onClick={()=>setView(item.id)} style={{
            width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            background:view===item.id?"rgba(155,109,255,0.2)":"transparent",
            color:view===item.id?"#9B6DFF":"#3D3B52",
            outline:view===item.id?"1px solid rgba(155,109,255,0.4)":"none",
            transition:"all 0.15s"
          }}>{item.icon}</button>
        ))}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden" style={{
        position:"fixed",top:0,left:0,right:0,zIndex:50,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"10px 16px",background:"rgba(10,10,15,0.97)",
        borderBottom:"1px solid var(--border)"
      }}>
        <Link to="/dashboard" style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{
            width:28,height:28,borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center",
            background:"linear-gradient(135deg,#FF6B00,#FF9A3C)"
          }}>
            <Compass size={13} style={{color:"white"}}/>
          </div>
          <span style={{color:"white",fontWeight:700,fontSize:14,fontFamily:"Bricolage Grotesque"}}>Coding Tutor</span>
        </Link>
        <button onClick={()=>setNavOpen(o=>!o)}
          style={{background:"none",border:"none",color:"#7A7890",cursor:"pointer"}}>
          {navOpen?<X size={20}/>:<Menu size={20}/>}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {navOpen && (
        <div style={{position:"fixed",inset:0,zIndex:40,background:"rgba(0,0,0,0.6)"}}
          onClick={()=>setNavOpen(false)}>
          <div style={{
            position:"absolute",top:48,left:0,right:0,
            background:"var(--bg2)",borderBottom:"1px solid var(--border)",padding:12
          }} onClick={e=>e.stopPropagation()}>
            {[["practice","🧩 Practice"],["problems","📋 My Problems"],["roadmap","🗺️ Roadmap"]].map(([id,label])=>(
              <button key={id} onClick={()=>{setView(id);setNavOpen(false);}} style={{
                display:"block",width:"100%",textAlign:"left",
                padding:"11px 14px",borderRadius:10,fontSize:14,fontWeight:600,
                background:view===id?"rgba(155,109,255,0.15)":"transparent",
                color:view===id?"#9B6DFF":"#7A7890",border:"none",cursor:"pointer",marginBottom:3
              }}>{label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}
        className="md:pt-0 pt-12">

        {/* PRACTICE */}
        {view==="practice" && (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <GenBar/>
            {fullEd ? (
              <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",background:"#1d1f21"}}>
                <EditorPane/>
              </div>
            ) : (
              <div id="ct-split" style={{flex:1,display:"flex",overflow:"hidden"}}>
                {/* Left pane */}
                <div style={{width:`${pct}%`,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  <LeftPane/>
                </div>

                {/* Drag handle */}
                <div onMouseDown={onDown}
                  style={{
                    width:4,flexShrink:0,cursor:"col-resize",
                    background:"var(--border)",transition:"background 0.15s",position:"relative"
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="#9B6DFF"}
                  onMouseLeave={e=>e.currentTarget.style.background="var(--border)"}>
                  <div style={{
                    position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                    width:10,height:28,borderRadius:5,background:"rgba(255,255,255,0.1)",pointerEvents:"none"
                  }}/>
                </div>

                {/* Right pane */}
                <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden",background:"#1d1f21"}}>
                  <EditorPane/>
                </div>
              </div>
            )}
          </div>
        )}

        {view==="problems" && <ProblemsView/>}
        {view==="roadmap"  && <RoadmapView/>}
      </div>
    </div>
  );
}