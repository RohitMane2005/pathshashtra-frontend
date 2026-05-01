import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { FileText, Plus, Pin, Trash2, Search, Loader, X, Edit3 } from "lucide-react";

const CATS = ["ALL", "GENERAL", "PROBLEM", "TOPIC"];
const CAT_COLORS = { GENERAL: "var(--blue)", PROBLEM: "var(--green)", TOPIC: "var(--orange)" };

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "create" | noteObject
  const [form, setForm] = useState({ title: "", content: "", category: "GENERAL", tags: "" });

  useEffect(() => { fetchNotes(); }, [category]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== "ALL") params.category = category;
      if (search) params.search = search;
      const res = await API.get("/notes", { params });
      setNotes(res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const saveNote = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title required"); return; }
    try {
      if (modal && modal.id) {
        await API.put(`/notes/${modal.id}`, form);
        toast.success("Note updated");
      } else {
        await API.post("/notes", form);
        toast.success("Note created");
      }
      setModal(null); setForm({ title: "", content: "", category: "GENERAL", tags: "" }); fetchNotes();
    } catch (err) { if (!err.handled) toast.error("Failed to save"); }
  };

  const deleteNote = async (id) => {
    try { await API.delete(`/notes/${id}`); setNotes(notes.filter(n => n.id !== id)); toast.success("Deleted"); } catch {}
  };

  const togglePin = async (id) => {
    try { await API.put(`/notes/${id}/pin`); fetchNotes(); } catch {}
  };

  const openEdit = (note) => {
    setForm({ title: note.title, content: note.content || "", category: note.category, tags: note.tags || "" });
    setModal(note);
  };

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div><h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Notes</h1><p style={{ color: "var(--text-muted)", fontSize: 14 }}>Your personal study notebook</p></div>
          <button onClick={() => { setForm({ title: "", content: "", category: "GENERAL", tags: "" }); setModal("create"); }} className="btn-primary" style={{ fontSize: 13 }}><Plus size={14} /> New Note</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchNotes()} placeholder="Search notes..." className="lc-input" style={{ paddingLeft: 34 }} />
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                border: `1px solid ${category === c ? "var(--green)" : "var(--border)"}`,
                background: category === c ? "var(--green-bg)" : "var(--bg)",
                color: category === c ? "var(--green)" : "var(--text-muted)",
              }}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? <div style={{ textAlign: "center", padding: 40 }}><Loader size={20} className="animate-spin" style={{ color: "var(--green)" }} /></div> : notes.length === 0 ? (
          <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
            <FileText size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
            <p style={{ fontWeight: 500 }}>No notes yet</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Start taking notes to organize your learning</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
            {notes.map(n => (
              <div key={n.id} className="lc-card" style={{ padding: 14, cursor: "pointer", position: "relative", borderLeft: `3px solid ${CAT_COLORS[n.category] || "var(--border)"}` }}
                onClick={() => openEdit(n)}>
                {n.pinned && <Pin size={12} style={{ position: "absolute", top: 10, right: 10, color: "var(--orange)" }} />}
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, paddingRight: 20 }}>{n.title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", lineHeight: 1.5 }}>{n.content}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: CAT_COLORS[n.category], fontWeight: 500 }}>{n.category}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); togglePin(n.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 2 }}><Pin size={12} /></button>
                    <button onClick={e => { e.stopPropagation(); deleteNote(n.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 2 }}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setModal(null)}>
            <div className="lc-card" style={{ width: "100%", maxWidth: 500, padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{modal === "create" ? "New Note" : "Edit Note"}</h2>
                <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={18} /></button>
              </div>
              <form onSubmit={saveNote}>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Note title" className="lc-input" style={{ marginBottom: 10 }} />
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Write your notes..." className="lc-input" rows={8} style={{ marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="lc-input" style={{ width: 140 }}>
                    {["GENERAL","PROBLEM","TOPIC"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags" className="lc-input" style={{ flex: 1 }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Save Note</button>
              </form>
            </div>
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Notes;
