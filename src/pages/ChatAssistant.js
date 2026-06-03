import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Send, Plus, Trash2, Loader, Bot, User, Menu, X } from "lucide-react";

const ChatAssistant = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchSessions = async () => {
    try { const res = await API.get("/chat/sessions"); setSessions(res.data || []); } catch {}
  };

  const openSession = async (id) => {
    setActiveSession(id);
    try { const res = await API.get(`/chat/sessions/${id}`); setMessages(res.data || []); } catch { toast.error("Failed to load chat"); }
  };

  const newSession = async () => {
    try { const res = await API.post("/chat/sessions"); setSessions([res.data, ...sessions]); openSession(res.data.id); } catch { toast.error("Failed to create chat"); }
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try { await API.delete(`/chat/sessions/${id}`); setSessions(sessions.filter(s => s.id !== id)); if (activeSession === id) { setActiveSession(null); setMessages([]); } toast.success("Chat deleted"); } catch {}
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    if (!activeSession) { await newSession(); return; }
    const userMsg = { role: "USER", content: input, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setSending(true);
    try {
      const res = await API.post("/chat/send", { sessionId: activeSession, content: userMsg.content });
      setMessages(prev => [...prev, res.data]);
      fetchSessions();
    } catch (err) { if (!err.handled) toast.error("Failed to send message"); }
    finally { setSending(false); }
  };

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}><Navbar />
      <div style={{ flex: 1, display: "flex", maxWidth: 1100, margin: "0 auto", width: "100%", padding: "80px 16px 16px", gap: 12, position: "relative" }}>
        {/* Mobile sidebar toggle */}
        <button className="chat-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          display: "none", position: "absolute", top: 86, left: 20, zIndex: 30,
          background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
          padding: "6px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: 13,
          alignItems: "center", gap: 6,
        }}>{sidebarOpen ? <X size={14} /> : <Menu size={14} />} Chats</button>

        {/* Sidebar */}
        <div className={`chat-sidebar${sidebarOpen ? ' open' : ''}`} style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={newSession} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}><Plus size={14} /> New Chat</button>
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {sessions.map(s => (
              <div key={s.id} onClick={() => openSession(s.id)} style={{
                padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4,
                background: activeSession === s.id ? "var(--bg)" : "transparent", border: activeSession === s.id ? "1px solid var(--border)" : "1px solid transparent",
              }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, color: "var(--text-secondary)" }}>{s.title}</span>
                <button onClick={e => deleteSession(s.id, e)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 2, opacity: 0.5 }}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && <div className="chat-sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 19 }} />}

        {/* Chat */}
        <div className="lc-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          {!activeSession ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 40 }}>
              <Bot size={40} style={{ color: "var(--green)" }} />
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>PathShashtra AI Assistant</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 400 }}>Ask me about DSA, competitive programming, career guidance, study planning, or placement prep!</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
                {["Explain binary search", "DP roadmap for beginners", "FAANG interview tips", "Time complexity of QuickSort"].map(q => (
                  <button key={q} onClick={() => { setInput(q); newSession(); }} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, border: "1px solid var(--border)", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.15s",
                  }}>{q}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: m.role === "USER" ? "var(--blue-bg)" : "var(--green-bg)", color: m.role === "USER" ? "var(--blue)" : "var(--green)" }}>
                      {m.role === "USER" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div style={{ flex: 1, fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{m.content}</div>
                  </div>
                ))}
                {sending && <div style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--green-bg)", color: "var(--green)" }}><Bot size={14} /></div><Loader size={14} className="animate-spin" style={{ color: "var(--green)" }} /></div>}
                <div ref={messagesEnd} />
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask anything about DSA, coding, career..." className="lc-input" style={{ flex: 1 }} />
                <button onClick={sendMessage} disabled={sending || !input.trim()} className="btn-primary" style={{ padding: "8px 14px" }}><Send size={14} /></button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .chat-sidebar-toggle { display: flex !important; }
          .chat-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 260px !important;
            z-index: 20 !important;
            background: var(--bg) !important;
            border-right: 1px solid var(--border) !important;
            padding: 70px 12px 12px !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .chat-sidebar.open,
          .chat-sidebar-open .chat-sidebar {
            transform: translateX(0) !important;
          }
          .chat-sidebar-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default ChatAssistant;
