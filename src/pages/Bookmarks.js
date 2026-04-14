import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Bookmark, Code2, Map, Brain, Trash2, Loader } from "lucide-react";

const typeIcon = {
  problem: <Code2 size={14} className="text-violet-400" />,
  roadmap: <Map size={14} className="text-emerald-500" />,
  quiz: <Brain size={14} className="text-amber-500" />,
};
const typeColor = { problem: "#8b5cf6", roadmap: "#10b981", quiz: "#f59e0b" };
const typeLink = { problem: "/coding", roadmap: "/roadmap", quiz: "/quiz" };

const Bookmarks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(new Set()); // FIX: track per-item deleting state

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks");
      setItems(res.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const remove = async (type, refId) => {
    const key = `${type}-${refId}`;
    if (deleting.has(key)) return; // FIX: prevent double-click double-delete
    setDeleting(prev => new Set([...prev, key]));
    try {
      await API.post("/bookmarks/toggle", { type, refId });
      setItems(prev => prev.filter(i => !(i.type === type && i.refId === refId)));
      toast.success("Bookmark removed");
    } catch (err) {
      if (!err.handled) toast.error("Failed to remove");
    } finally {
      setDeleting(prev => { const s = new Set(prev); s.delete(key); return s; });
    }
  };

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div className="main-content">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center justify-between mb-6 animate-fade-up">
            <div>
              <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Saved</p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                Bookmarks
              </h1>
              <p className="text-[#71717a] text-sm mt-0.5">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
            </div>

            <div className="flex gap-2">
              {["all", "problem", "roadmap", "quiz"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "text-[#71717a] border border-white/[0.06] hover:border-white/10"
                    }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader size={24} className="animate-spin text-amber-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center animate-fade-up">
              <Bookmark size={28} className="text-[#27272a] mx-auto mb-3" />
              <p className="text-white font-medium">No bookmarks yet</p>
              <p className="text-[#71717a] text-sm mt-1">
                Save problems, roadmaps, and quiz results to access them later
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-fade-up">
              {filtered.map((item) => (
                <div key={`${item.type}-${item.refId}`} className="card p-4 flex items-center gap-3 hover:border-white/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${typeColor[item.type]}12` }}>
                    {typeIcon[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {item.label || `${item.type} #${item.refId}`}
                    </p>
                    <p className="text-[#52525b] text-xs capitalize">{item.type}</p>
                  </div>
                  <Link to={typeLink[item.type]}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.06] text-[#71717a] hover:text-white hover:border-white/10 transition-all opacity-0 group-hover:opacity-100">
                    Open →
                  </Link>
                  <button
                    onClick={() => remove(item.type, item.refId)}
                    disabled={deleting.has(`${item.type}-${item.refId}`)}
                    className="w-7 h-7 rounded-lg text-[#27272a] hover:text-rose-400 hover:bg-rose-400/5 flex items-center justify-center transition-all disabled:opacity-40">
                    {deleting.has(`${item.type}-${item.refId}`)
                      ? <div className="w-3 h-3 border border-rose-500/50 border-t-rose-500 rounded-full animate-spin" />
                      : <Trash2 size={13} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
