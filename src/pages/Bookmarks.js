import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Bookmark, Code2, Map, Brain, Trash2, Loader } from "lucide-react";

const typeIcon = { problem: <Code2 size={14} />, roadmap: <Map size={14} />, quiz: <Brain size={14} /> };
const typeColor = { problem: "var(--purple)", roadmap: "var(--green)", quiz: "var(--orange)" };
const typeLink = { problem: "/coding", roadmap: "/roadmap", quiz: "/quiz" };

const Bookmarks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(new Set());

  const fetchBookmarks = async () => {
    try { const res = await API.get("/bookmarks"); setItems(res.data); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const remove = async (type, refId) => {
    const key = `${type}-${refId}`;
    if (deleting.has(key)) return;
    setDeleting(prev => new Set([...prev, key]));
    try {
      await API.post("/bookmarks/toggle", { type, refId });
      setItems(prev => prev.filter(i => !(i.type === type && i.refId === refId)));
      toast.success("Bookmark removed");
    } catch (err) { if (!err.handled) toast.error("Failed to remove"); }
    finally { setDeleting(prev => { const s = new Set(prev); s.delete(key); return s; }); }
  };

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Bookmarks</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["all", "problem", "roadmap", "quiz"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, textTransform: "capitalize",
                border: `1px solid ${filter === f ? "var(--green)" : "var(--border)"}`,
                background: filter === f ? "var(--green-bg)" : "var(--bg)", cursor: "pointer",
                color: filter === f ? "var(--green)" : "var(--text-muted)",
              }}>{f}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}><Loader size={20} className="animate-spin" style={{ color: "var(--green)" }} /></div>
        ) : filtered.length === 0 ? (
          <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
            <Bookmark size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
            <p style={{ fontWeight: 500 }}>No bookmarks yet</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Save problems, roadmaps, and results</p>
          </div>
        ) : (
          <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
            {filtered.map((item, i) => (
              <div key={`${item.type}-${item.refId}`} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                borderBottom: i < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: typeColor[item.type], flexShrink: 0 }}>
                  {typeIcon[item.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label || `${item.type} #${item.refId}`}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>{item.type}</p>
                </div>
                <Link to={typeLink[item.type]} style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", padding: "4px 8px" }}>Open →</Link>
                <button onClick={() => remove(item.type, item.refId)} disabled={deleting.has(`${item.type}-${item.refId}`)} style={{
                  background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 4,
                  opacity: deleting.has(`${item.type}-${item.refId}`) ? 0.3 : 1,
                }}>
                  {deleting.has(`${item.type}-${item.refId}`) ? <div style={{ width: 12, height: 12, border: "2px solid var(--red-border)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Bookmarks;
