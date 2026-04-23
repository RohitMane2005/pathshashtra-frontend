import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Loader, ChevronDown, ChevronUp, RefreshCw, Clock, BookOpen, Video, Code2, Star } from "lucide-react";

const GOALS = [
  "Full Stack Developer", "Data Scientist / ML Engineer", "Backend Developer",
  "Frontend Developer", "DevOps / Cloud Engineer", "Android Developer",
  "Cybersecurity Engineer", "Campus Placement (FAANG)", "GATE CSE Preparation", "Startup Founder / Tech Lead",
];
const FOCUS_AREAS = [
  "Web Development", "Data Science & ML", "DSA & Competitive Programming",
  "Backend Engineering", "Frontend Engineering", "DevOps & Cloud",
  "Mobile Development", "System Design", "Cybersecurity", "AI/GenAI",
];

const PhaseCard = ({ phase, index }) => {
  const [open, setOpen] = useState(index === 0);
  const diffColor = { Beginner: "var(--green)", Intermediate: "var(--orange)", Advanced: "var(--red)" };
  const resourceIcon = { video: <Video size={12} />, book: <BookOpen size={12} />, practice: <Code2 size={12} />, course: <Star size={12} /> };

  return (
    <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", textAlign: "left", padding: 16, background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>{phase.phase}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{phase.title}</span>
                <span className="lc-tag" style={{ fontSize: 11, color: diffColor[phase.difficulty] }}>{phase.difficulty}</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 2, fontSize: 12, color: "var(--text-muted)" }}>
                <span><Clock size={11} style={{ marginRight: 3 }} />{phase.duration}</span>
                <span>~{phase.estimatedHours}h</span>
              </div>
            </div>
          </div>
          {open ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
        </div>
        {!open && <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, marginLeft: 40 }}>{phase.objective}</p>}
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px 56px" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{phase.objective}</p>
          {phase.topics?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Topics</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{phase.topics.map((t, i) => <span key={i} className="lc-tag" style={{ fontSize: 11 }}>{t}</span>)}</div>
            </div>
          )}
          {phase.projects?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Projects</p>
              {phase.projects.map((p, i) => <p key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>→ {p}</p>)}
            </div>
          )}
          {phase.resources?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Resources</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {phase.resources.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 6, border: "1px solid var(--border)", fontSize: 12 }}>
                    <span style={{ color: "var(--text-muted)" }}>{resourceIcon[r.type] || <BookOpen size={12} />}</span>
                    <div><p style={{ color: "var(--text)", fontWeight: 500 }}>{r.name}</p>{r.author && <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{r.author}</p>}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {phase.skills?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{phase.skills.map((s, i) => <span key={i} className="lc-tag lc-tag-green" style={{ fontSize: 11 }}>{s}</span>)}</div>
            </div>
          )}
          {phase.milestone && (
            <div style={{ padding: 10, borderRadius: 6, background: "var(--green-bg)", border: "1px solid var(--green-border)", fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "var(--green)" }}>🎯 Milestone: </span><span style={{ color: "var(--text)" }}>{phase.milestone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Roadmap = () => {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ goal: "", currentLevel: "Beginner", timeframe: "6 months", focusArea: "", currentSkills: "" });
  const [roadmap, setRoadmap] = useState(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => { fetchSavedRoadmaps(); }, []);

  const fetchSavedRoadmaps = async () => {
    setLoadingSaved(true);
    try { const res = await API.get("/roadmap/my?page=0&size=10"); setSavedRoadmaps(res.data.content || res.data); } catch {} finally { setLoadingSaved(false); }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.goal || !form.focusArea) { toast.error("Please fill in goal and focus area"); return; }
    setStep("loading");
    try { const res = await API.post("/roadmap/generate", form); setRoadmap(res.data); setStep("result"); fetchSavedRoadmaps(); toast.success("Roadmap generated!"); }
    catch (err) { if (!err.handled) toast.error("Failed to generate roadmap"); setStep("form"); }
  };

  const loadSavedRoadmap = async (id) => {
    try { const res = await API.get(`/roadmap/${id}`); setRoadmap(res.data); setStep("result"); setActiveTab("new"); }
    catch (err) { if (!err.handled) toast.error("Failed to load roadmap"); }
  };

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Roadmap Generator</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>Get a personalized learning path for your goal</p>

        {/* Tabs */}
        <div className="lc-tabs">
          {[{ id: "new", label: "Generate New" }, { id: "saved", label: `My Roadmaps (${savedRoadmaps.length})` }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`lc-tab ${activeTab === t.id ? "active" : ""}`}>{t.label}</button>
          ))}
        </div>

        {activeTab === "saved" && (
          loadingSaved ? <div style={{ textAlign: "center", padding: 40 }}><Loader size={20} className="animate-spin" style={{ color: "var(--green)" }} /></div> :
          savedRoadmaps.length === 0 ? <div className="lc-card" style={{ textAlign: "center", padding: 40 }}><p style={{ color: "var(--text-muted)" }}>No roadmaps yet</p></div> :
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedRoadmaps.map(r => (
              <button key={r.id} onClick={() => loadSavedRoadmap(r.id)} className="lc-card" style={{ width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.goal}</p><div style={{ display: "flex", gap: 6 }}><span className="lc-tag lc-tag-orange" style={{ fontSize: 11 }}>{r.focusArea}</span><span className="lc-tag lc-tag-purple" style={{ fontSize: 11 }}>{r.timeframe}</span></div></div>
                <span style={{ color: "var(--text-light)", fontSize: 13 }}>→</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "new" && (
          <>
            {step === "form" && (
              <div className="lc-card" style={{ padding: 24 }}>
                <form onSubmit={handleGenerate}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>What is your goal?</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                      {GOALS.map(g => (
                        <button key={g} type="button" onClick={() => setForm({ ...form, goal: g })} style={{
                          padding: "6px 12px", borderRadius: 6, fontSize: 12, border: `1px solid ${form.goal === g ? "var(--green)" : "var(--border)"}`,
                          background: form.goal === g ? "var(--green-bg)" : "var(--bg)", cursor: "pointer", color: form.goal === g ? "var(--green)" : "var(--text-muted)", fontWeight: 500,
                        }}>{g}</button>
                      ))}
                    </div>
                    <input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} placeholder="Or type your custom goal..." className="lc-input" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Focus Area</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {FOCUS_AREAS.map(f => (
                        <button key={f} type="button" onClick={() => setForm({ ...form, focusArea: f })} style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 12, border: `1px solid ${form.focusArea === f ? "var(--purple)" : "var(--border)"}`,
                          background: form.focusArea === f ? "var(--purple-bg)" : "var(--bg)", cursor: "pointer", color: form.focusArea === f ? "var(--purple)" : "var(--text-muted)", fontWeight: 500,
                        }}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Level</label>
                      <select value={form.currentLevel} onChange={e => setForm({ ...form, currentLevel: e.target.value })} className="lc-input">{["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}</select></div>
                    <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Timeframe</label>
                      <select value={form.timeframe} onChange={e => setForm({ ...form, timeframe: e.target.value })} className="lc-input">{["1 month", "3 months", "6 months", "1 year"].map(t => <option key={t}>{t}</option>)}</select></div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Current Skills (optional)</label>
                    <input value={form.currentSkills} onChange={e => setForm({ ...form, currentSkills: e.target.value })} placeholder="e.g. HTML, CSS, basic Python" className="lc-input" />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>Generate Roadmap</button>
                </form>
              </div>
            )}

            {step === "loading" && (
              <div className="lc-card" style={{ padding: 60, textAlign: "center" }}>
                <Loader size={28} className="animate-spin" style={{ color: "var(--green)", marginBottom: 12 }} />
                <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Generating your roadmap...</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>This may take 15-30 seconds</p>
              </div>
            )}

            {step === "result" && roadmap && (
              <div>
                <div className="lc-card" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <span className="lc-tag lc-tag-green" style={{ marginBottom: 8, display: "inline-flex" }}>AI Generated</span>
                      <h2 style={{ fontSize: 18, fontWeight: 700 }}>{roadmap.roadmapTitle}</h2>
                    </div>
                    <button onClick={() => { setStep("form"); setRoadmap(null); }} className="btn-secondary" style={{ fontSize: 12, padding: "4px 12px" }}><RefreshCw size={11} /> New</button>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>{roadmap.overview}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                    <span><Clock size={12} style={{ marginRight: 4 }} />{roadmap.timeframe}</span>
                    <span>{roadmap.totalPhases} Phases</span>
                    {roadmap.salaryRange && <span style={{ color: "var(--green)" }}>💰 {roadmap.salaryRange}</span>}
                  </div>
                </div>

                {roadmap.keySkills?.length > 0 && (
                  <div className="lc-card" style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Key Skills</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{roadmap.keySkills.map((s, i) => <span key={i} className="lc-tag lc-tag-green" style={{ fontSize: 11 }}>{s}</span>)}</div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {roadmap.phases?.map((phase, i) => <PhaseCard key={i} phase={phase} index={i} />)}
                </div>

                {roadmap.careerOutcome && (
                  <div className="lc-card" style={{ marginTop: 12, background: "var(--green-bg)", borderColor: "var(--green-border)" }}>
                    <p style={{ fontWeight: 600, color: "var(--green)", fontSize: 13, marginBottom: 4 }}>After Completion</p>
                    <p style={{ fontSize: 14 }}>{roadmap.careerOutcome}</p>
                    {roadmap.salaryRange && <p style={{ fontSize: 13, color: "var(--green)", marginTop: 4 }}>💰 Expected: {roadmap.salaryRange}</p>}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div></div>
    </div>
  );
};

export default Roadmap;
