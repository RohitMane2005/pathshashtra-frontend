import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Map, Loader, Sparkles, ChevronDown, ChevronUp,
  BookOpen, Video, Code2, Clock, Target, Trophy,
  TrendingUp, Zap, Star, ArrowRight, RefreshCw,
  Briefcase, DollarSign, Lightbulb, Calendar
} from "lucide-react";

const GOALS = [
  "Full Stack Developer",
  "Data Scientist / ML Engineer",
  "Backend Developer",
  "Frontend Developer",
  "DevOps / Cloud Engineer",
  "Android Developer",
  "Cybersecurity Engineer",
  "Campus Placement (FAANG)",
  "GATE CSE Preparation",
  "Startup Founder / Tech Lead",
];

const FOCUS_AREAS = [
  "Web Development", "Data Science & ML", "DSA & Competitive Programming",
  "Backend Engineering", "Frontend Engineering", "DevOps & Cloud",
  "Mobile Development", "System Design", "Cybersecurity", "AI/GenAI",
];

const difficultyColor = { Beginner: "#34D399", Intermediate: "#FBBF24", Advanced: "#F87171" };
const resourceIcon = { video: <Video size={13} />, book: <BookOpen size={13} />, practice: <Code2 size={13} />, course: <Star size={13} /> };

const PhaseCard = ({ phase, index, accentColor }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="relative">
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute left-6 -top-6 w-px h-6"
          style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}40)` }} />
      )}

      <div className="glass hover:border-white/15 transition-all duration-300 overflow-hidden"
        style={{ borderLeft: `3px solid ${accentColor}` }}>

        {/* Phase Header */}
        <button className="w-full text-left p-5" onClick={() => setOpen(!open)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Phase number */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
                {phase.phase}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-bold" style={{ fontFamily: "Bricolage Grotesque" }}>{phase.title}</h3>
                  <span className="badge text-xs" style={{
                    background: `rgba(${phase.difficulty === "Beginner" ? "52,211,153" : phase.difficulty === "Intermediate" ? "251,191,36" : "248,113,113"},0.1)`,
                    color: difficultyColor[phase.difficulty] || "#7A7890",
                    border: `1px solid ${difficultyColor[phase.difficulty] || "#7A7890"}33`,
                  }}>{phase.difficulty}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[#7A7890] text-xs flex items-center gap-1">
                    <Calendar size={11} /> {phase.duration}
                  </span>
                  <span className="text-[#7A7890] text-xs flex items-center gap-1">
                    <Clock size={11} /> ~{phase.estimatedHours}h
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#3D3B52] text-xs hidden md:block">{phase.topics?.length} topics</span>
              {open ? <ChevronUp size={16} className="text-[#3D3B52]" /> : <ChevronDown size={16} className="text-[#3D3B52]" />}
            </div>
          </div>

          {/* Objective */}
          {!open && (
            <p className="text-[#7A7890] text-sm mt-3 ml-14">{phase.objective}</p>
          )}
        </button>

        {/* Expanded Content */}
        {open && (
          <div className="px-5 pb-5 ml-14 space-y-5 animate-fade-in">
            <p className="text-[#7A7890] text-sm">{phase.objective}</p>

            {/* Topics */}
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Topics to Cover</p>
              <div className="flex flex-wrap gap-2">
                {phase.topics?.map((t, i) => (
                  <span key={i} className="glass px-3 py-1.5 text-xs text-[#7A7890] rounded-xl hover:text-white transition-colors">{t}</span>
                ))}
              </div>
            </div>

            {/* Projects */}
            {phase.projects?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Projects to Build</p>
                <div className="space-y-1.5">
                  {phase.projects.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span style={{ color: accentColor }}>▸</span>
                      <span className="text-white">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {phase.resources?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Resources</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {phase.resources.map((r, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl border border-white/7 hover:border-white/15 transition-all">
                      <span className="text-[#7A7890]">{resourceIcon[r.type] || <BookOpen size={13} />}</span>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium truncate">{r.name}</p>
                        {r.author && <p className="text-[#3D3B52] text-xs">by {r.author}</p>}
                        {r.url && r.url !== "url" && <p className="text-[#3D3B52] text-xs truncate">{r.url}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills + Milestone */}
            <div className="flex items-start gap-4 flex-wrap">
              {phase.skills?.length > 0 && (
                <div className="flex-1 min-w-48">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Skills You'll Gain</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.skills.map((s, i) => (
                      <span key={i} className="badge badge-teal text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-48 p-3 rounded-xl border"
                style={{ borderColor: `${accentColor}40`, background: `${accentColor}08` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                  🎯 Milestone
                </p>
                <p className="text-white text-xs">{phase.milestone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Roadmap = () => {
  const [step, setStep] = useState("form"); // form | loading | result
  const [form, setForm] = useState({
    goal: "", currentLevel: "Beginner", timeframe: "6 months",
    focusArea: "", currentSkills: "",
  });
  const [roadmap, setRoadmap] = useState(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => { fetchSavedRoadmaps(); }, []);

  const fetchSavedRoadmaps = async () => {
    setLoadingSaved(true);
    try {
      const res = await API.get("/roadmap/my?page=0&size=10");
      setSavedRoadmaps(res.data.content || res.data);
    } catch { } finally { setLoadingSaved(false); }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.goal || !form.focusArea) { toast.error("Please fill in goal and focus area"); return; }
    setStep("loading");
    try {
      const res = await API.post("/roadmap/generate", form);
      setRoadmap(res.data);
      setStep("result");
      fetchSavedRoadmaps();
      toast.success("Roadmap generated! 🗺️");
    } catch (err) {
      if (!err.handled) toast.error("Failed to generate roadmap");
      setStep("form");
    }
  };

  const loadSavedRoadmap = async (id) => {
    try {
      const res = await API.get(`/roadmap/${id}`);
      setRoadmap(res.data);
      setStep("result");
      setActiveTab("new");
    } catch (err) { if (!err.handled) toast.error("Failed to load roadmap"); }
  };

  const phaseColors = ["#FF6B00", "#00D4C8", "#9B6DFF", "#34D399"];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6 animate-fade-up">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
              AI Roadmap Generator
            </h1>
            <p className="text-[#7A7890] mt-1">Get a step-by-step learning path personalized for your goal</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "new", label: "🗺️ Generate New" },
              { id: "saved", label: `📁 My Roadmaps (${savedRoadmaps.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.id
                    ? "bg-[#FF6B00]/15 text-[#FF8C38] border border-[#FF6B00]/20"
                    : "text-[#7A7890] border border-white/7 hover:border-white/15"
                  }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* SAVED ROADMAPS TAB */}
          {activeTab === "saved" && (
            <div className="animate-fade-up">
              {loadingSaved ? (
                <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-[#FF6B00]" /></div>
              ) : savedRoadmaps.length === 0 ? (
                <div className="glass-bright p-12 text-center">
                  <p className="text-4xl mb-3">🗺️</p>
                  <p className="text-white font-semibold">No roadmaps yet</p>
                  <p className="text-[#7A7890] text-sm mt-1">Generate your first roadmap above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedRoadmaps.map((r) => (
                    <button key={r.id} onClick={() => loadSavedRoadmap(r.id)}
                      className="w-full glass hover:border-white/15 transition-all p-5 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{r.goal}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="badge badge-orange text-xs">{r.focusArea}</span>
                            <span className="badge badge-purple text-xs">{r.timeframe}</span>
                            <span className="badge text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#7A7890" }}>{r.currentLevel}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-[#3D3B52]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "new" && (
            <>
              {/* FORM */}
              {step === "form" && (
                <div className="animate-fade-up">
                  <div className="glass-bright p-6">
                    <form onSubmit={handleGenerate} className="space-y-5">

                      {/* Goal */}
                      <div>
                        <label className="block text-sm text-[#7A7890] mb-2">What is your goal?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {GOALS.map(g => (
                            <button key={g} type="button" onClick={() => setForm({ ...form, goal: g })}
                              className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${form.goal === g
                                  ? "bg-[#FF6B00]/15 text-[#FF8C38] border border-[#FF6B00]/30"
                                  : "border border-white/7 text-[#7A7890] hover:border-white/15 hover:text-white"
                                }`}>
                              {g}
                            </button>
                          ))}
                        </div>
                        <input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}
                          placeholder="Or type your custom goal..." className="input-dark text-sm" />
                      </div>

                      {/* Focus Area */}
                      <div>
                        <label className="block text-sm text-[#7A7890] mb-2">Focus Area</label>
                        <div className="flex flex-wrap gap-2">
                          {FOCUS_AREAS.map(f => (
                            <button key={f} type="button" onClick={() => setForm({ ...form, focusArea: f })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${form.focusArea === f
                                  ? "bg-[#9B6DFF]/15 text-[#9B6DFF] border border-[#9B6DFF]/30"
                                  : "border border-white/7 text-[#7A7890] hover:border-white/15"
                                }`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#7A7890] mb-2">Current Level</label>
                          <select value={form.currentLevel} onChange={e => setForm({ ...form, currentLevel: e.target.value })} className="input-dark">
                            {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-[#7A7890] mb-2">Timeframe</label>
                          <select value={form.timeframe} onChange={e => setForm({ ...form, timeframe: e.target.value })} className="input-dark">
                            {["1 month", "3 months", "6 months", "1 year"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-[#7A7890] mb-2">Current Skills (optional)</label>
                        <input value={form.currentSkills} onChange={e => setForm({ ...form, currentSkills: e.target.value })}
                          placeholder="e.g. HTML, CSS, basic Python, C programming..." className="input-dark" />
                      </div>

                      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                        <Sparkles size={18} /> Generate My Roadmap
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* LOADING */}
              {step === "loading" && (
                <div className="glass-bright p-16 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 flex items-center justify-center mx-auto mb-5 animate-float">
                    <Map size={30} className="text-[#FF8C38]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                    AI is building your roadmap...
                  </h2>
                  <p className="text-[#7A7890] text-sm mb-6">Crafting a personalized path for your goal</p>
                  <div className="flex justify-center gap-2">
                    {["Analyzing goal", "Building phases", "Adding resources", "Finalizing"].map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                        <span className="text-[#3D3B52] text-xs hidden md:block">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESULT */}
              {step === "result" && roadmap && (
                <div className="animate-fade-up space-y-5">

                  {/* Overview Card */}
                  <div className="relative overflow-hidden rounded-2xl p-6 border border-[#FF6B00]/20"
                    style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.08), rgba(155,109,255,0.05))" }}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                      style={{ background: "radial-gradient(circle, #FF6B00, transparent)", transform: "translate(20px,-20px)" }} />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                        <div>
                          <span className="badge badge-orange mb-2">AI Generated Roadmap</span>
                          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
                            {roadmap.roadmapTitle}
                          </h2>
                        </div>
                        <button onClick={() => { setStep("form"); setRoadmap(null); }} className="btn-ghost flex items-center gap-2 text-sm">
                          <RefreshCw size={14} /> New Roadmap
                        </button>
                      </div>
                      <p className="text-[#7A7890] text-sm leading-relaxed mb-4">{roadmap.overview}</p>

                      {/* Meta stats */}
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock size={14} className="text-[#FF8C38]" />
                          <span className="text-white font-medium">{roadmap.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Target size={14} className="text-[#00D4C8]" />
                          <span className="text-white font-medium">{roadmap.totalPhases} Phases</span>
                        </div>
                        {roadmap.salaryRange && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <DollarSign size={14} className="text-[#34D399]" />
                            <span className="text-white font-medium">{roadmap.salaryRange}</span>
                          </div>
                        )}
                        {roadmap.careerOutcome && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Briefcase size={14} className="text-[#9B6DFF]" />
                            <span className="text-[#7A7890] text-xs">{roadmap.careerOutcome}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Skills */}
                  {roadmap.keySkills?.length > 0 && (
                    <div className="glass p-5">
                      <h3 className="text-white font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                        <Zap size={16} className="text-[#FF8C38]" /> Key Skills You'll Master
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {roadmap.keySkills.map((s, i) => (
                          <span key={i} className="badge badge-orange">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phases */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                      <Map size={16} className="text-[#00D4C8]" /> Your Learning Path
                    </h3>
                    <div className="space-y-3">
                      {roadmap.phases?.map((phase, i) => (
                        <PhaseCard key={i} phase={phase} index={i} accentColor={phaseColors[i % phaseColors.length]} />
                      ))}
                    </div>
                  </div>

                  {/* Daily Schedule + Tips */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {roadmap.dailySchedule && (
                      <div className="glass p-5">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                          <Calendar size={16} className="text-[#9B6DFF]" /> Daily Schedule
                        </h3>
                        <div className="space-y-2">
                          <div className="p-3 rounded-xl border border-white/7">
                            <p className="text-xs text-[#7A7890] mb-1">Weekdays</p>
                            <p className="text-white text-sm">{roadmap.dailySchedule.weekday}</p>
                          </div>
                          <div className="p-3 rounded-xl border border-white/7">
                            <p className="text-xs text-[#7A7890] mb-1">Weekends</p>
                            <p className="text-white text-sm">{roadmap.dailySchedule.weekend}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {roadmap.tips?.length > 0 && (
                      <div className="glass p-5">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                          <Lightbulb size={16} className="text-yellow-400" /> Pro Tips
                        </h3>
                        <div className="space-y-2">
                          {roadmap.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-yellow-400 text-sm mt-0.5">✦</span>
                              <p className="text-[#7A7890] text-sm">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Career Outcome */}
                  {roadmap.careerOutcome && (
                    <div className="p-5 rounded-2xl border border-[#34D399]/20" style={{ background: "rgba(52,211,153,0.05)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#34D399]/15 flex items-center justify-center flex-shrink-0">
                          <Trophy size={18} className="text-[#34D399]" />
                        </div>
                        <div>
                          <p className="text-[#34D399] font-bold text-sm">After Completion</p>
                          <p className="text-white text-sm mt-0.5">{roadmap.careerOutcome}</p>
                          {roadmap.salaryRange && (
                            <p className="text-[#34D399] text-xs mt-1">💰 Expected: {roadmap.salaryRange}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
