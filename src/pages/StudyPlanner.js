import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { BookOpen, Plus, CheckCircle, AlertTriangle, TrendingUp, Calendar, Loader, Flame, Target, RefreshCw } from "lucide-react";

const StudyPlanner = () => {
  const [step, setStep] = useState("loading");
  const [form, setForm] = useState({ planTitle: "", examDate: "", dailyHours: 4, subjects: "", examType: "GATE", currentLevel: "Intermediate" });
  const [plan, setPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [todayTopics, setTodayTopics] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [confidence, setConfidence] = useState({});

  useEffect(() => { fetchPlan(); }, []);

  const fetchPlan = async () => {
    try {
      const [planRes, progressRes, todayRes, weakRes] = await Promise.all([
        API.get("/study/plan"), API.get("/study/progress"),
        API.get("/study/today"), API.get("/study/weak-topics"),
      ]);
      setPlan(planRes.data); setProgress(progressRes.data);
      setTodayTopics(todayRes.data); setWeakTopics(weakRes.data);
      setStep("plan");
    } catch { setStep("setup"); }
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const subjectsArray = form.subjects.split(",").map(s => s.trim()).filter(Boolean);
      await API.post("/study/plan/generate", { ...form, subjects: subjectsArray, dailyHours: parseInt(form.dailyHours) });
      toast.success("Study plan generated! 🎉");
      fetchPlan();
    } catch (err) { if (!err.handled) toast.error("Failed to generate plan"); }
    finally { setGenerating(false); }
  };

  const markTopic = async (topicId, status, score = null) => {
    const finalScore = score !== null ? score : (confidence[topicId] ?? 7);
    try {
      await API.put("/study/topic/progress", { topicId, status, confidenceScore: finalScore });
      toast.success(status === "COMPLETED" ? "✅ Topic completed! +30 XP" : "⚠️ Topic flagged for revision");
      fetchPlan();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-3xl mx-auto">

          {step === "loading" && (
            <div className="flex justify-center items-center h-64">
              <Loader size={32} className="animate-spin text-[#10b981]" />
            </div>
          )}

          {/* SETUP */}
          {step === "setup" && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mx-auto mb-4 animate-float">
                  <BookOpen size={26} className="text-[#10b981]" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>Create Study Plan</h1>
                <p className="text-[#71717a]">AI will build your personalized exam schedule</p>
              </div>

              <div className="glass-bright p-6">
                <form onSubmit={generatePlan} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#71717a] mb-2">Plan Title</label>
                      <input value={form.planTitle} onChange={e => setForm({...form, planTitle: e.target.value})}
                        placeholder="GATE CSE 2026 Prep" required className="input-dark" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#71717a] mb-2">Exam Date</label>
                      <input type="date" value={form.examDate} onChange={e => setForm({...form, examDate: e.target.value})}
                        required className="input-dark" style={{ colorScheme: "dark" }} />
                    </div>
                    <div>
                      <label className="block text-sm text-[#71717a] mb-2">Exam Type</label>
                      <select value={form.examType} onChange={e => setForm({...form, examType: e.target.value})} className="input-dark">
                        {["GATE", "JEE", "University Exam", "Placement", "UPSC", "Other"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#71717a] mb-2">Current Level</label>
                      <select value={form.currentLevel} onChange={e => setForm({...form, currentLevel: e.target.value})} className="input-dark">
                        {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#71717a] mb-2">Daily Study Hours</label>
                      <input type="number" min="1" max="12" value={form.dailyHours}
                        onChange={e => setForm({...form, dailyHours: e.target.value})} className="input-dark" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#71717a] mb-2">Subjects (comma-separated)</label>
                      <input value={form.subjects} onChange={e => setForm({...form, subjects: e.target.value})}
                        placeholder="Maths, Data Structures, OS" required className="input-dark" />
                    </div>
                  </div>

                  <button type="submit" disabled={generating} className="btn-primary w-full flex items-center justify-center gap-2">
                    {generating ? <><Loader size={16} className="animate-spin" /> AI is building your plan...</> : <><Plus size={16} /> Generate My Plan</>}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PLAN VIEW */}
          {step === "plan" && (
            <div className="animate-fade-up space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{plan?.planTitle}</h1>
                  <p className="text-[#71717a] text-sm flex items-center gap-2 mt-1">
                    <Calendar size={13} /> {plan?.daysUntilExam} days until exam
                  </p>
                </div>
                <button onClick={() => setStep("setup")} className="btn-ghost flex items-center gap-2 text-sm">
                  <RefreshCw size={14} /> New Plan
                </button>
              </div>

              {/* Progress Card */}
              {progress && (
                <div className="glass-bright p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                      <TrendingUp size={16} className="text-[#10b981]" /> Overall Progress
                    </h3>
                    <span className="text-3xl font-bold text-[#10b981]" style={{ fontFamily: "Space Grotesk" }}>
                      {progress.overallPercent}%
                    </span>
                  </div>
                  <div className="progress-bar mb-3" style={{ height: "6px" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${progress.overallPercent}%`,
                      background: "linear-gradient(90deg, #10b981, #34d399)"
                    }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#71717a]">
                    <span>{progress.completedTopics}/{progress.totalTopics} topics completed</span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle size={11} className="text-yellow-400" /> {progress.weakTopicsCount} weak topics
                    </span>
                  </div>

                  {/* Subject breakdown */}
                  {progress.subjectProgress?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                      {progress.subjectProgress.map((s, i) => (
                        <div key={i} className="glass p-3 text-center">
                          <p className="text-[#10b981] font-bold text-lg">{s.percent}%</p>
                          <p className="text-[#71717a] text-xs truncate">{s.subject}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { id: "today", label: `Today's Topics`, count: todayTopics.length },
                  { id: "weak", label: "Weak Topics", count: weakTopics.length },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20"
                        : "text-[#71717a] border border-white/7 hover:border-white/15"
                    }`}>
                    {tab.label}
                    <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                      activeTab === tab.id ? "bg-[#10b981]/20 text-[#10b981]" : "bg-white/5 text-[#52525b]"}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Today */}
              {activeTab === "today" && (
                <div className="glass p-5">
                  {todayTopics.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-4xl mb-3">🎉</p>
                      <p className="text-white font-semibold">All caught up for today!</p>
                      <p className="text-[#71717a] text-sm mt-1">Come back tomorrow for new topics</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayTopics.map((topic, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          topic.status === "COMPLETED"
                            ? "border-[#34d399]/20 bg-[#34d399]/5"
                            : "border-white/7 hover:border-white/15"
                        }`}>
                          <div>
                            <p className={`font-semibold text-sm ${topic.status === "COMPLETED" ? "text-[#71717a] line-through" : "text-white"}`}>
                              {topic.topicName}
                            </p>
                            <p className="text-[#52525b] text-xs mt-0.5">{topic.subject} · Week {topic.weekNumber}</p>
                          </div>
                          {topic.status !== "COMPLETED" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 text-xs text-[#71717a]">
                                  <span>Confidence:</span>
                                  <span className="text-white font-medium w-4 text-center">{confidence[topic.id] ?? 7}</span>
                                </div>
                                <input type="range" min="1" max="10"
                                  value={confidence[topic.id] ?? 7}
                                  onChange={e => setConfidence(prev => ({...prev, [topic.id]: parseInt(e.target.value)}))}
                                  className="w-20 h-1 accent-[#34d399]" />
                              </div>
                              <button onClick={() => markTopic(topic.id, "COMPLETED")}
                                className="w-8 h-8 rounded-lg bg-[#34d399]/10 hover:bg-[#34d399]/20 text-[#34d399] flex items-center justify-center transition-all" title="Mark done">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => markTopic(topic.id, "STRUGGLING", 2)}
                                className="w-8 h-8 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 flex items-center justify-center transition-all" title="Mark struggling">
                                <AlertTriangle size={15} />
                              </button>
                            </div>
                          ) : (
                            <span className="badge badge-green">Done</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Weak */}
              {activeTab === "weak" && (
                <div className="glass p-5">
                  {weakTopics.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-4xl mb-3">💪</p>
                      <p className="text-white font-semibold">No weak topics!</p>
                      <p className="text-[#71717a] text-sm mt-1">Your understanding is solid across all subjects</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {weakTopics.map((topic, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5">
                          <div>
                            <p className="text-white font-semibold text-sm">{topic.topicName}</p>
                            <p className="text-[#71717a] text-xs mt-0.5">{topic.subject} · Confidence: {topic.confidenceScore}/10</p>
                          </div>
                          <button onClick={() => markTopic(topic.id, "COMPLETED", 8)}
                            className="w-8 h-8 rounded-lg bg-[#34d399]/10 hover:bg-[#34d399]/20 text-[#34d399] flex items-center justify-center transition-all">
                            <CheckCircle size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
