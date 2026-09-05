import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  Send, Plus, Trash2, Loader, Bot, User, Menu, X,
  Copy, Check, Sparkles, MessageSquare, Zap, Crown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ─────────────────────────────────────────────────
   Copy Button
───────────────────────────────────────────────── */
const CopyButton = ({ code, small }) => {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  return (
    <button onClick={copy} title="Copy" style={{
      background: copied ? "rgba(137,233,0,0.15)" : "rgba(255,255,255,0.07)",
      border: `1px solid ${copied ? "rgba(137,233,0,0.4)" : "rgba(255,255,255,0.12)"}`,
      borderRadius: 6, cursor: "pointer",
      padding: small ? "2px 7px" : "3px 9px",
      display: "flex", alignItems: "center", gap: 4,
      color: copied ? "#89E900" : "#8892a4", fontSize: 11,
      transition: "all 0.2s", whiteSpace: "nowrap",
    }}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

/* ─────────────────────────────────────────────────
   Markdown Components
───────────────────────────────────────────────── */
const md = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    if (!inline) {
      return (
        <div style={{ margin: "12px 0", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            background: "#0d1117", padding: "6px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <span style={{ fontSize: 11, color: "#89E900", fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.03em" }}>
              {match ? match[1] : "code"}
            </span>
            <CopyButton code={code} small />
          </div>
          <SyntaxHighlighter
            style={oneDark} language={match ? match[1] : "text"} PreTag="div"
            customStyle={{ margin: 0, borderRadius: 0, fontSize: 13, padding: "14px 16px", background: "#0d1117" }}
            {...props}
          >{code}</SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code style={{
        background: "rgba(137,233,0,0.1)", color: "#89E900",
        padding: "1px 6px", borderRadius: 4, fontSize: "0.87em",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        border: "1px solid rgba(137,233,0,0.2)",
      }} {...props}>{children}</code>
    );
  },
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "12px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: "rgba(137,233,0,0.06)" }}>{children}</thead>,
  th: ({ children }) => <th style={{ border: "1px solid rgba(255,255,255,0.07)", padding: "8px 14px", fontWeight: 600, color: "#f0f4f8", textAlign: "left", whiteSpace: "nowrap" }}>{children}</th>,
  td: ({ children }) => <td style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "7px 14px", color: "#cbd5e1", verticalAlign: "top" }}>{children}</td>,
  tr: ({ children }) => <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{children}</tr>,
  h1: ({ children }) => <h1 style={{ fontSize: 18, fontWeight: 700, margin: "18px 0 6px", color: "#f8fafc", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8 }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: 16, fontWeight: 700, margin: "14px 0 5px", color: "#f0f4f8" }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: 14, fontWeight: 600, margin: "12px 0 4px", color: "#e2e8f0" }}>{children}</h3>,
  p: ({ children }) => <p style={{ margin: "7px 0", lineHeight: 1.8 }}>{children}</p>,
  ul: ({ children }) => <ul style={{ margin: "6px 0", paddingLeft: 22, lineHeight: 1.9 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: "6px 0", paddingLeft: 22, lineHeight: 1.9 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 3 }}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: "3px solid #89E900", paddingLeft: 14, margin: "10px 0", color: "#94a3b8", fontStyle: "italic", background: "rgba(137,233,0,0.04)", borderRadius: "0 6px 6px 0", padding: "8px 14px" }}>
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong style={{ color: "#f8fafc", fontWeight: 600 }}>{children}</strong>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#89E900", textDecoration: "underline", textUnderlineOffset: 3 }}>{children}</a>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "16px 0" }} />,
};

/* ─────────────────────────────────────────────────
   Typing dots animation
───────────────────────────────────────────────── */
const TypingDots = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 6, height: 6, borderRadius: "50%", background: "#89E900",
        animation: "chatDot 1.2s infinite", animationDelay: `${i * 0.2}s`,
        opacity: 0.6,
      }} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────────
   Suggestion chips
───────────────────────────────────────────────── */
const SUGGESTIONS = [
  { icon: "💡", text: "Explain binary search" },
  { icon: "🗺️", text: "DP roadmap for beginners" },
  { icon: "🚀", text: "FAANG interview tips" },
  { icon: "⏱️", text: "Time complexity of QuickSort" },
  { icon: "🧩", text: "When to use Trie vs HashMap?" },
  { icon: "📋", text: "Top 10 system design concepts" },
];

/* ─────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────── */
const ChatAssistant = () => {
  const { user } = useAuth();
  const isPro = user?.plan === "PRO";

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatQuota, setChatQuota] = useState(null); // { used, remaining, limit }
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { fetchSessions(); fetchQuota(); }, []);
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const fetchQuota = async () => {
    try {
      const r = await API.get("/quota");
      setChatQuota(r.data.chat || null);
    } catch {}
  };

  const fetchSessions = async () => {
    try { const r = await API.get("/chat/sessions"); setSessions(r.data || []); } catch {}
  };

  const openSession = async (id) => {
    setActiveSession(id);
    setSidebarOpen(false);
    try { const r = await API.get(`/chat/sessions/${id}`); setMessages(r.data || []); }
    catch { toast.error("Failed to load chat"); }
  };

  const newSession = useCallback(async () => {
    try {
      const r = await API.post("/chat/sessions");
      setSessions(prev => [r.data, ...prev]);
      setActiveSession(r.data.id);
      setMessages([]);
      setSidebarOpen(false);
      return r.data.id;
    } catch { toast.error("Failed to create chat"); }
  }, []);

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await API.delete(`/chat/sessions/${id}`);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSession === id) { setActiveSession(null); setMessages([]); }
      toast.success("Chat deleted");
    } catch {}
  };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;
    let sessionId = activeSession;
    if (!sessionId) {
      sessionId = await newSession();
      if (!sessionId) return;
    }
    const userMsg = { role: "USER", content, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);
    inputRef.current?.focus();
    try {
      const r = await API.post("/chat/send", { sessionId, content });
      setMessages(prev => [...prev, r.data]);
      fetchSessions();
      fetchQuota(); // refresh quota count after each message
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("Daily limit reached. Upgrade to Pro for unlimited chat.");
        setChatQuota(prev => prev ? { ...prev, remaining: 0 } : prev);
      } else if (!err.handled) {
        toast.error("Failed to send message");
      }
    }
    finally { setSending(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* ─── Layout: full-viewport, sidebar fixed, chat scrolls ─── */
  return (
    <>
      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-root {
          position: fixed;
          top: var(--navbar-h, 56px);
          left: 0; right: 0; bottom: 0;
          display: flex;
          background: var(--bg);
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .chat-sidebar {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: #07090f;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          transition: width 0.25s ease;
        }
        .chat-sidebar-inner {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .chat-session-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: var(--text-muted);
          transition: background 0.15s, color 0.15s;
          border: 1px solid transparent;
        }
        .chat-session-item:hover { background: rgba(255,255,255,0.05); color: var(--text-secondary); }
        .chat-session-item.active {
          background: rgba(137,233,0,0.07);
          border-color: rgba(137,233,0,0.2);
          color: #f0f4f8;
        }
        .chat-session-item .del-btn {
          margin-left: auto; flex-shrink: 0;
          background: none; border: none; cursor: pointer;
          color: var(--text-light); opacity: 0;
          padding: 2px; transition: opacity 0.15s;
          display: flex; align-items: center;
        }
        .chat-session-item:hover .del-btn { opacity: 0.6; }
        .chat-session-item .del-btn:hover { opacity: 1; color: #f43f5e; }

        /* ── Main chat area ── */
        .chat-main {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }
        .chat-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 0 10px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .chat-msg-row {
          width: 100%;
          padding: 6px 0;
          display: flex;
          justify-content: center;
        }
        .chat-msg-inner {
          width: 100%;
          max-width: 760px;
          padding: 0 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .chat-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px; font-size: 13px;
        }
        .chat-bubble-user {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.7;
          color: #e2e8f0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .chat-bubble-ai {
          flex: 1;
          font-size: 14px;
          line-height: 1.8;
          color: #cbd5e1;
          word-break: break-word;
          padding-top: 2px;
        }
        /* Input bar — pinned at bottom, never pushed off-screen */
        .chat-input-bar {
          flex-shrink: 0;
          width: 100%;
          padding: 10px 24px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(to top, var(--bg) 85%, transparent);
          z-index: 10;
        }
        .chat-input-wrap {
          width: 100%;
          max-width: 760px;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 8px 8px 8px 16px;
          transition: border-color 0.2s;
        }
        .chat-input-wrap:focus-within {
          border-color: rgba(137,233,0,0.35);
          box-shadow: 0 0 0 3px rgba(137,233,0,0.06);
        }
        .chat-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          resize: none;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text);
          font-family: inherit;
          min-height: 22px;
          max-height: 160px;
          overflow-y: auto;
          padding: 2px 0;
        }
        .chat-textarea::placeholder { color: var(--text-light); }
        .chat-send-btn {
          width: 34px; height: 34px; border-radius: 9px;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background: #89E900;
          color: #06080c;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
        }
        .chat-send-btn:hover:not(:disabled) { background: #9ef01a; transform: scale(1.05); }
        .chat-send-btn:disabled { background: rgba(137,233,0,0.2); color: rgba(0,0,0,0.3); cursor: not-allowed; }

        /* New Chat button */
        .chat-new-btn {
          margin: 12px 12px 4px;
          padding: 8px 12px;
          border-radius: 9px;
          border: 1px solid rgba(137,233,0,0.3);
          background: rgba(137,233,0,0.06);
          color: #89E900;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .chat-new-btn:hover { background: rgba(137,233,0,0.12); border-color: rgba(137,233,0,0.5); }

        .chat-sidebar-label {
          padding: 16px 12px 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-light);
        }

        /* Suggestion chips & empty state */
        .chat-empty {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 12px;
          gap: 0;
        }
        .suggestion-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          max-width: 580px;
          width: 100%;
          margin-top: 18px;
        }
        .suggestion-chip {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 10px 14px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.35;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .suggestion-chip:hover {
          background: rgba(137,233,0,0.06);
          border-color: rgba(137,233,0,0.25);
          color: var(--text-secondary);
        }
        .suggestion-chip .chip-icon {
          font-size: 15px;
          flex-shrink: 0;
        }

        /* Mobile sidebar overlay */
        .chat-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 40;
        }
        .chat-mobile-toggle {
          display: none;
          position: absolute;
          top: 12px; left: 12px;
          z-index: 10;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: var(--text-muted);
          align-items: center; justify-content: center;
        }

        @media (max-width: 768px) {
          .chat-sidebar {
            position: fixed !important;
            top: var(--navbar-h, 56px) !important;
            left: 0 !important; bottom: 0 !important;
            z-index: 50 !important;
            width: 260px !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .chat-sidebar.open { transform: translateX(0) !important; }
          .chat-overlay { display: block; }
          .chat-mobile-toggle { display: flex; }
          .chat-msg-inner { padding: 0 16px; }
          .chat-input-bar { padding: 8px 16px 18px; }
          .suggestion-grid { grid-template-columns: 1fr; }
          .chat-empty { padding-top: 50px; }
        }
      `}</style>

      <Navbar />

      <div className="chat-root">
        {/* ── Sidebar ── */}
        <div className={`chat-sidebar${sidebarOpen ? " open" : ""}`}>
          <button className="chat-new-btn" onClick={newSession}>
            <Plus size={14} /> New chat
          </button>

          {sessions.length > 0 && (
            <div className="chat-sidebar-label">Recent</div>
          )}

          <div className="chat-sidebar-inner">
            {sessions.map(s => (
              <div
                key={s.id}
                className={`chat-session-item${activeSession === s.id ? " active" : ""}`}
                onClick={() => openSession(s.id)}
              >
                <MessageSquare size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {s.title || "New chat"}
                </span>
                <button className="del-btn" onClick={e => deleteSession(s.id, e)} title="Delete">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div className="chat-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Chat main ── */}
        <div className="chat-main">
          {/* Mobile toggle */}
          <button className="chat-mobile-toggle" onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Messages or empty state */}
          {!activeSession && messages.length === 0 ? (
            <div className="chat-empty">
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(137,233,0,0.12)", border: "1px solid rgba(137,233,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>
                <Sparkles size={20} style={{ color: "#89E900" }} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc", textAlign: "center", marginBottom: 6 }}>
                PathShashtra AI
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", maxWidth: 420, lineHeight: 1.5 }}>
                Ask me anything about DSA, system design, competitive programming, or placement prep.
              </p>
              <div className="suggestion-grid">
                {SUGGESTIONS.map(s => (
                  <button key={s.text} className="suggestion-chip" onClick={() => sendMessage(s.text)}>
                    <span className="chip-icon">{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className="chat-msg-row">
                  <div className="chat-msg-inner">
                    <div className="chat-avatar" style={{
                      background: m.role === "USER" ? "rgba(56,189,248,0.15)" : "rgba(137,233,0,0.12)",
                      color: m.role === "USER" ? "#38bdf8" : "#89E900",
                    }}>
                      {m.role === "USER" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    {m.role === "USER" ? (
                      <div className="chat-bubble-user">{m.content}</div>
                    ) : (
                      <div className="chat-bubble-ai">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="chat-msg-row">
                  <div className="chat-msg-inner">
                    <div className="chat-avatar" style={{ background: "rgba(137,233,0,0.12)", color: "#89E900" }}>
                      <Bot size={14} />
                    </div>
                    <div className="chat-bubble-ai">
                      <TypingDots />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEnd} style={{ height: 8 }} />
            </div>
          )}

          {/* ── Input bar ── */}
          <div className="chat-input-bar">
            {/* Quota warning banner */}
            {!isPro && chatQuota && chatQuota.remaining <= 3 && (
              <div style={{
                width: "100%", maxWidth: 760,
                padding: "6px 12px", marginBottom: 8, borderRadius: 10,
                background: chatQuota.remaining === 0
                  ? "rgba(244,63,94,0.1)" : "rgba(245,158,11,0.08)",
                border: `1px solid ${chatQuota.remaining === 0
                  ? "rgba(244,63,94,0.3)" : "rgba(245,158,11,0.25)"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, flexWrap: "wrap",
              }}>
                <span style={{
                  fontSize: 12, color: chatQuota.remaining === 0 ? "#f43f5e" : "#f59e0b",
                  fontWeight: 500,
                }}>
                  {chatQuota.remaining === 0
                    ? "⛔ Daily limit reached — no messages left today"
                    : `⚠️ ${chatQuota.remaining} of ${chatQuota.limit} messages left today`}
                </span>
                <Link to="/pricing" style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#89E900", color: "#06080c",
                  fontSize: 11, fontWeight: 700, padding: "4px 12px",
                  borderRadius: 8, textDecoration: "none",
                  transition: "background 0.15s",
                }}>
                  <Zap size={10} /> Upgrade to Pro
                </Link>
              </div>
            )}

            {/* Pro badge in footer */}
            {isPro && (
              <div style={{
                width: "100%", maxWidth: 760, marginBottom: 6,
                display: "flex", justifyContent: "flex-end",
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, color: "#89E900", fontWeight: 600,
                }}>
                  <Crown size={10} /> Pro — Unlimited messages
                </span>
              </div>
            )}

            <div className="chat-input-wrap">
              <textarea
                ref={inputRef}
                value={input}
                rows={1}
                onChange={e => {
                  setInput(e.target.value);
                  // Auto-grow
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onKeyDown={handleKey}
                placeholder={chatQuota?.remaining === 0 && !isPro
                  ? "Limit reached — upgrade to continue…"
                  : "Ask anything… (Enter to send, Shift+Enter for newline)"}
                className="chat-textarea"
                disabled={chatQuota?.remaining === 0 && !isPro}
              />
              <button
                onClick={() => sendMessage()}
                disabled={sending || !input.trim() || (chatQuota?.remaining === 0 && !isPro)}
                className="chat-send-btn"
              >
                {sending
                  ? <Loader size={15} style={{ animation: "spin 1s linear infinite" }} />
                  : <Send size={15} />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
