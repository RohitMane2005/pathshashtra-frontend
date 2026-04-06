import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Bookmark, Code2, Map, Brain, Trash2, Loader } from "lucide-react";

const typeIcon = {
  problem: <Code2 size={14} className="text-[#9B6DFF]" />,
  roadmap: <Map size={14} className="text-[#34D399]" />,
  quiz:    <Brain size={14} className="text-[#FF6B00]" />,
};
const typeColor = { problem: "#9B6DFF", roadmap: "#34D399", quiz: "#FF6B00" };
const typeLink  = { problem: "/coding", roadmap: "/roadmap", quiz: "/quiz" };

const Bookmarks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(new Set()); // FIX: track per-item deleting state

  const fetch = async () => {
    try {
      const res = await API.get("/bookmarks");
      setItems(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

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
              <h1 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                <Bookmark size={22} className="text-[#FF8C38]" /> Bookmarks
              </h1>
              <p className="text-[#7A7890] text-sm mt-0.5">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
            </div>

            <div className="flex gap-2">
              {["all", "problem", "roadmap", "quiz"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                    filter === f
                      ? "bg-[#FF6B00]/15 text-[#FF8C38] border border-[#FF6B00]/20"
                      : "text-[#7A7890] border border-white/7 hover:border-white/15"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader size={28} className="animate-spin text-[#FF6B00]" /></div>
          ) : filtered.length === 0 ? (
            <div className="glass-bright p-12 text-center animate-fade-up">
              <Bookmark size={36} className="text-[#3D3B52] mx-auto mb-3" />
              <p className="text-white font-semibold">No bookmarks yet</p>
              <p className="text-[#7A7890] text-sm mt-1">
                Save problems, roadmaps, and quiz results using the ⭐ button
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-up">
              {filtered.map((item, i) => (
                <div key={i} className="glass p-4 flex items-center gap-3 hover:border-white/15 transition-all group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${typeColor[item.type]}15` }}>
                    {typeIcon[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {item.label || `${item.type} #${item.refId}`}
                    </p>
                    <p className="text-[#3D3B52] text-xs capitalize">{item.type}</p>
                  </div>
                  <Link to={typeLink[item.type]}
                    className="text-xs px-3 py-1.5 rounded-xl border border-white/7 text-[#7A7890] hover:text-white hover:border-white/15 transition-all opacity-0 group-hover:opacity-100">
                    Open →
                  </Link>
                  <button
                    onClick={() => remove(item.type, item.refId)}
                    disabled={deleting.has(`${item.type}-${item.refId}`)}
                    className="w-8 h-8 rounded-lg text-[#3D3B52] hover:text-[#F87171] hover:bg-[#F87171]/10 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {deleting.has(`${item.type}-${item.refId}`)
                      ? <div className="w-3 h-3 border border-[#F87171]/50 border-t-[#F87171] rounded-full animate-spin" />
                      : <Trash2 size={14} />}
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
