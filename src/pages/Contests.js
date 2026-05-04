import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Trophy, Clock, ChevronRight, Loader, Code2 } from "lucide-react";

const statusColor = { UPCOMING: "var(--blue)", ACTIVE: "var(--green)", ENDED: "var(--text-muted)" };
const statusBg = { UPCOMING: "var(--blue-bg)", ACTIVE: "var(--green-bg)", ENDED: "var(--bg-secondary)" };

const Contests = () => {
  const { user } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [detail, setDetail] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [detailTab, setDetailTab] = useState("problems");

  useEffect(() => { API.get("/contests").then(r => setContests(r.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openContest = async (id) => {
    try {
      const [res, lb] = await Promise.all([API.get(`/contests/${id}`), API.get(`/contests/${id}/leaderboard`)]);
      setDetail(res.data.contest); setProblems(res.data.problems || []); setLeaderboard(lb.data || []);
    } catch { toast.error("Failed to load contest"); }
  };

  const filtered = tab === "all" ? contests : contests.filter(c => c.status === tab.toUpperCase());

  if (detail) return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 760 }}>
        <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
        <div className="lc-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div><h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{detail.title}</h1><p style={{ fontSize: 14, color: "var(--text-muted)" }}>{detail.description}</p></div>
            <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: statusBg[detail.status], color: statusColor[detail.status] }}>{detail.status}</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {detail.duration} min</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Code2 size={12} /> {problems.length} problems</span>
          </div>
        </div>
        <div className="lc-tabs">{["problems","leaderboard"].map(t => (<button key={t} onClick={() => setDetailTab(t)} className={`lc-tab ${detailTab===t?"active":""}`} style={{textTransform:"capitalize"}}>{t}</button>))}</div>
        {detailTab === "problems" && (problems.length === 0 ? <div className="lc-card" style={{textAlign:"center",padding:40}}><p style={{color:"var(--text-muted)"}}>No problems</p></div> : <div className="lc-card" style={{padding:0,overflow:"hidden"}}>{problems.map((p,i) => (<div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:i<problems.length-1?"1px solid var(--border)":"none"}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{width:24,height:24,borderRadius:"50%",background:"var(--bg-secondary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"var(--text-muted)"}}>{i+1}</span><div><p style={{fontSize:14,fontWeight:500}}>{p.title||`Problem ${i+1}`}</p><span className={`lc-tag lc-tag-${p.difficulty==="EASY"?"green":p.difficulty==="MEDIUM"?"orange":"red"}`} style={{fontSize:10}}>{p.difficulty}</span></div></div><span style={{fontSize:13,fontWeight:600,color:"var(--green)"}}>{p.points} pts</span></div>))}</div>)}
        {detailTab === "leaderboard" && (leaderboard.length === 0 ? <div className="lc-card" style={{textAlign:"center",padding:40}}><Trophy size={24} style={{color:"var(--text-light)",marginBottom:8}} /><p style={{color:"var(--text-muted)"}}>No submissions</p></div> : <div className="lc-card" style={{padding:0,overflow:"hidden"}}>{leaderboard.map((e,i) => (<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:i<leaderboard.length-1?"1px solid var(--border)":"none",background:e.userId===user?.id?"var(--green-bg)":"transparent"}}><span style={{width:28,textAlign:"center",fontSize:i<3?16:13,fontWeight:600,color:"var(--text-muted)"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</span><div style={{flex:1}}><p style={{fontWeight:500,fontSize:14}}>{e.name}</p></div><span style={{fontWeight:700,fontSize:15}}>{e.totalScore}</span></div>))}</div>)}
      </div></div>
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Contests</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>Compete, solve, and climb the leaderboard</p>
        <div className="lc-tabs">{["all","upcoming","active","ended"].map(t => (<button key={t} onClick={() => setTab(t)} className={`lc-tab ${tab===t?"active":""}`} style={{textTransform:"capitalize"}}>{t}</button>))}</div>
        {loading ? <div style={{textAlign:"center",padding:40}}><Loader size={20} className="animate-spin" style={{color:"var(--green)"}} /></div> : filtered.length === 0 ? (
          <div className="lc-card" style={{textAlign:"center",padding:40}}><Trophy size={24} style={{color:"var(--text-light)",marginBottom:8}} /><p style={{fontWeight:500}}>No contests found</p></div>
        ) : filtered.map(c => (
          <div key={c.id} className="lc-card" style={{cursor:"pointer",marginBottom:8}} onClick={() => openContest(c.id)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><h3 style={{fontSize:16,fontWeight:600}}>{c.title}</h3><span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,background:statusBg[c.status],color:statusColor[c.status]}}>{c.status}</span></div><p style={{fontSize:13,color:"var(--text-muted)",marginBottom:8}}>{c.description}</p><div style={{display:"flex",gap:12,fontSize:12,color:"var(--text-light)"}}><span><Clock size={11} /> {c.duration} min</span></div></div>
              <ChevronRight size={16} style={{color:"var(--text-light)",flexShrink:0,marginTop:4}} />
            </div>
          </div>
        ))}
      </div></div>
    </div>
  );
};

export default Contests;
