import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Loader, CheckCircle, Circle, RefreshCw, BookOpen, AlertTriangle } from "lucide-react";

const StudyPlanner = () => {
  const [step, setStep] = useState("loading");
  const [plan, setPlan] = useState(null);
  const [todayTopics, setTodayTopics] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState("today");
  const [form, setForm] = useState({ exam: "", subjects: "", targetDate: "", hoursPerDay: "4" });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [planRes, todayRes, weakRes, progRes] = await Promise.allSettled([
        API.get("/study/plan"), API.get("/study/today"), API.get("/study/weak-topics"), API.get("/study/progress"),
      ]);
      const p = planRes.status === "fulfilled" && planRes.value.data ? planRes.value.data : null;
      setPlan(p);
      if (todayRes.status === "fulfilled") setTodayTopics(todayRes.value.data || []);
      if (weakRes.status === "fulfilled") setWeakTopics(weakRes.value.data || []);
      if (progRes.status === "fulfilled") setProgress(progRes.value.data);
      setStep(p ? "plan" : "form");
    } catch { setStep("form"); }
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    if (!form.exam.trim() || !form.subjects.trim()) { toast.error("Fill in exam and subjects"); return; }
    setGenerating(true);
    try {
      await API.post("/study/plan/generate", form);
      toast.success("Study plan created!");
      loadAll();
    } catch (err) { if (!err.handled) toast.error("Failed to generate plan"); }
    finally { setGenerating(false); }
  };

  const handleProgress = async (topicId, status) => {
    try {
      await API.put("/study/topic/progress", { topicId, status });
      setTodayTopics(prev => prev.map(t => t.id === topicId ? { ...t, status } : t));
      if (status === "COMPLETED") toast.success("Topic completed ✓");
    } catch (err) { if (!err.handled) toast.error("Failed to update"); }
  };

  if (step === "loading") return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content" style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Loader size={24} className="animate-spin" style={{ color: "var(--green)" }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content">
        <div className="page-inner" style={{ maxWidth: 700 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Study Planner</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>AI-generated week-by-week study schedule</p>

          {step === "form" && (
            <div className="lc-card" style={{ padding: 24 }}>
              <form onSubmit={generatePlan}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Exam / Goal</label>
                  <input value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} placeholder="e.g. GATE CSE 2026, Semester Finals" className="lc-input" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Subjects</label>
                  <input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} placeholder="e.g. DSA, OS, DBMS, Networks" className="lc-input" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Target Date</label>
                    <input type="date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} className="lc-input" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Hours / Day</label>
                    <select value={form.hoursPerDay} onChange={e => setForm({ ...form, hoursPerDay: e.target.value })} className="lc-input">
                      {["2", "3", "4", "5", "6", "8"].map(h => <option key={h} value={h}>{h} hours</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={generating} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
                  {generating ? <Loader size={16} className="animate-spin" /> : "Generate Study Plan"}
                </button>
              </form>
            </div>
          )}

          {step === "plan" && (
            <>
              {/* Progress bar */}
              {progress && (
                <div className="lc-card" style={{ padding: 16, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: "var(--text-muted)" }}>{plan?.exam}</span>
                    <span style={{ fontWeight: 600 }}>{progress.overallPercent}% complete</span>
                  </div>
                  <div className="lc-progress" style={{ height: 6 }}><div className="lc-progress-fill" style={{ width: `${progress.overallPercent}%` }} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                    <span>{progress.completedTopics} / {progress.totalTopics} topics</span>
                    <button onClick={() => { setStep("form"); setForm({ exam: "", subjects: "", targetDate: "", hoursPerDay: "4" }); }}
                      style={{ color: "var(--blue)", background: "none", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      <RefreshCw size={11} /> New Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="lc-tabs">
                {[
                  { id: "today", label: `Today (${todayTopics.length})`, icon: <BookOpen size={14} /> },
                  { id: "weak", label: `Weak Topics (${weakTopics.length})`, icon: <AlertTriangle size={14} /> },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`lc-tab ${tab === t.id ? "active" : ""}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {tab === "today" && (
                todayTopics.length === 0 ? (
                  <div className="lc-card" style={{ padding: 40, textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No topics scheduled for today</p>
                  </div>
                ) : (
                  <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
                    {todayTopics.map((topic, i) => (
                      <div key={topic.id || i} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", borderBottom: i < todayTopics.length - 1 ? "1px solid #f0f0f0" : "none",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                          <button onClick={() => handleProgress(topic.id, topic.status === "COMPLETED" ? "PENDING" : "COMPLETED")} style={{
                            background: "none", border: "none", cursor: "pointer", padding: 0, color: topic.status === "COMPLETED" ? "var(--green)" : "var(--text-light)",
                          }}>
                            {topic.status === "COMPLETED" ? <CheckCircle size={18} /> : <Circle size={18} />}
                          </button>
                          <div>
                            <p style={{ fontSize: 14, color: topic.status === "COMPLETED" ? "var(--text-muted)" : "var(--text)", textDecoration: topic.status === "COMPLETED" ? "line-through" : "none" }}>{topic.topicName}</p>
                            <p style={{ fontSize: 12, color: "var(--text-light)" }}>{topic.subject}</p>
                          </div>
                        </div>
                        {topic.estimatedMinutes && (
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{topic.estimatedMinutes}m</span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              {tab === "weak" && (
                weakTopics.length === 0 ? (
                  <div className="lc-card" style={{ padding: 40, textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No weak topics identified yet</p>
                  </div>
                ) : (
                  <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
                    {weakTopics.map((topic, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", borderBottom: i < weakTopics.length - 1 ? "1px solid #f0f0f0" : "none",
                      }}>
                        <div>
                          <p style={{ fontSize: 14, color: "var(--text)" }}>{topic.topicName || topic.topic}</p>
                          <p style={{ fontSize: 12, color: "var(--text-light)" }}>{topic.reason || topic.subject}</p>
                        </div>
                        <span className="lc-tag lc-tag-orange" style={{ fontSize: 11 }}>Weak</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
