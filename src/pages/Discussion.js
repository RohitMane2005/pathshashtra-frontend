import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, ThumbsUp, Send, ArrowLeft, Search, Filter, Loader, Plus, X } from "lucide-react";

const TAGS = ["all","arrays","dp","trees","graphs","strings","career","study","help","general"];

const Discussion = () => {
  const { user } = useAuth();
  const [view, setView] = useState("list");
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState("recent");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchPosts(); }, [tag, sort]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (tag !== "all") params.tag = tag;
      if (search) params.search = search;
      params.sort = sort;
      const res = await API.get("/discussions", { params });
      setPosts(res.data.content || res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error("Fill in title and content"); return; }
    setSending(true);
    try {
      await API.post("/discussions", form);
      toast.success("Post created!");
      setShowCreate(false);
      setForm({ title: "", content: "", tags: "" });
      fetchPosts();
    } catch (err) { if (!err.handled) toast.error("Failed to create post"); }
    finally { setSending(false); }
  };

  const openPost = async (id) => {
    try {
      const res = await API.get(`/discussions/${id}`);
      setPost(res.data.post);
      setReplies(res.data.replies || []);
      setView("detail");
    } catch { toast.error("Failed to load post"); }
  };

  const addReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const res = await API.post(`/discussions/${post.id}/reply`, { content: replyText });
      setReplies([...replies, res.data]);
      setReplyText("");
      toast.success("Reply added");
    } catch (err) { if (!err.handled) toast.error("Failed to reply"); }
    finally { setSending(false); }
  };

  const upvote = async (type, id) => {
    try {
      const url = type === "POST" ? `/discussions/${id}/upvote` : `/discussions/reply/${id}/upvote`;
      await API.post(url);
      if (type === "POST" && post) {
        openPost(post.id);
      }
      fetchPosts();
    } catch {}
  };

  const timeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 760 }}>

        {view === "list" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Discussions</h1>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Ask questions, share solutions, help others</p>
              </div>
              <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ fontSize: 13 }}>
                <Plus size={14} /> New Post
              </button>
            </div>

            {/* Search + Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchPosts()}
                  placeholder="Search discussions..." className="lc-input" style={{ paddingLeft: 34 }} />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="lc-input" style={{ width: 120 }}>
                <option value="recent">Recent</option>
                <option value="top">Top Voted</option>
              </select>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
              {TAGS.map(t => (
                <button key={t} onClick={() => setTag(t)} style={{
                  padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, textTransform: "capitalize",
                  border: `1px solid ${tag === t ? "var(--green)" : "var(--border)"}`,
                  background: tag === t ? "var(--green-bg)" : "var(--bg)", cursor: "pointer",
                  color: tag === t ? "var(--green)" : "var(--text-muted)",
                }}>{t}</button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}><Loader size={20} className="animate-spin" style={{ color: "var(--green)" }} /></div>
            ) : posts.length === 0 ? (
              <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
                <MessageSquare size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
                <p style={{ fontWeight: 500 }}>No discussions yet</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Be the first to start a conversation</p>
              </div>
            ) : (
              <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
                {posts.map((p, i) => (
                  <div key={p.id} style={{
                    display: "flex", gap: 12, padding: "14px 16px", cursor: "pointer",
                    borderBottom: i < posts.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background 0.15s",
                  }} onClick={() => openPost(p.id)}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 40 }}>
                      <button onClick={e => { e.stopPropagation(); upvote("POST", p.id); }} style={{
                        background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 14, padding: 2,
                      }}><ThumbsUp size={14} /></button>
                      <span style={{ fontSize: 13, fontWeight: 600, color: p.upvotes > 0 ? "var(--green)" : "var(--text-muted)" }}>{p.upvotes}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{p.title}</p>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.content}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                        {p.tags && p.tags.split(",").filter(Boolean).map(t => (
                          <span key={t} className="lc-tag" style={{ fontSize: 10 }}>{t.trim()}</span>
                        ))}
                        <span style={{ fontSize: 12, color: "var(--text-light)" }}>{p.authorName} · {timeAgo(p.createdAt)}</span>
                        <span style={{ fontSize: 12, color: "var(--text-light)", display: "flex", alignItems: "center", gap: 3 }}>
                          <MessageSquare size={10} /> {p.replyCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "detail" && post && (
          <>
            <button onClick={() => setView("list")} style={{
              background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
              display: "flex", alignItems: "center", gap: 4, fontSize: 13, marginBottom: 16, padding: 0,
            }}><ArrowLeft size={14} /> Back to discussions</button>

            <div className="lc-card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {post.tags && post.tags.split(",").filter(Boolean).map(t => (
                  <span key={t} className="lc-tag" style={{ fontSize: 11 }}>{t.trim()}</span>
                ))}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{post.title}</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 12 }}>{post.content}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--text-muted)" }}>
                <button onClick={() => upvote("POST", post.id)} style={{
                  background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                  color: "var(--text-muted)", fontSize: 13,
                }}><ThumbsUp size={14} /> {post.upvotes}</button>
                <span>{post.authorName}</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>

            {/* Replies */}
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{replies.length} Replies</h3>
            {replies.map((r, i) => (
              <div key={r.id} className="lc-card" style={{ marginBottom: 8, padding: 14 }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 8 }}>{r.content}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                  <button onClick={() => upvote("REPLY", r.id)} style={{
                    background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
                    color: "var(--text-muted)", fontSize: 12,
                  }}><ThumbsUp size={12} /> {r.upvotes}</button>
                  <span>{r.authorName}</span>
                  <span>{timeAgo(r.createdAt)}</span>
                </div>
              </div>
            ))}

            {/* Reply box */}
            <div className="lc-card" style={{ marginTop: 12, padding: 14 }}>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..."
                className="lc-input" rows={3} style={{ marginBottom: 8 }} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={addReply} disabled={sending || !replyText.trim()} className="btn-primary" style={{ fontSize: 13 }}>
                  {sending ? <Loader size={14} className="animate-spin" /> : <><Send size={14} /> Reply</>}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Create Post Modal */}
        {showCreate && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowCreate(false)}>
            <div className="lc-card" style={{ width: "100%", maxWidth: 520, padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Create Discussion</h2>
                <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={18} /></button>
              </div>
              <form onSubmit={createPost}>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="lc-input" style={{ marginBottom: 12 }} />
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="What's on your mind? Share a question, solution, or idea..." className="lc-input" rows={6} style={{ marginBottom: 12 }} />
                <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags (comma separated, e.g. arrays, dp, help)" className="lc-input" style={{ marginBottom: 16 }} />
                <button type="submit" disabled={sending} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  {sending ? <Loader size={14} className="animate-spin" /> : "Post Discussion"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div></div>
    </div>
  );
};

export default Discussion;
