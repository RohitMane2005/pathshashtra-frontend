import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Users, UserPlus, UserMinus, Search, Loader, BarChart2 } from "lucide-react";

const Social = () => {
  const [tab, setTab] = useState("following");
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [comparison, setComparison] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [f1, f2] = await Promise.all([API.get("/social/following"), API.get("/social/followers")]);
      setFollowing(f1.data || []); setFollowers(f2.data || []);
    } catch {} finally { setLoading(false); }
  };

  const searchUsers = async () => {
    if (!searchQ.trim()) return;
    try { const res = await API.get(`/social/search?q=${searchQ}`); setResults(res.data || []); setTab("search"); } catch {}
  };

  const toggleFollow = async (userId) => {
    try {
      const res = await API.post(`/social/follow/${userId}`);
      toast.success(res.data.following ? "Following!" : "Unfollowed");
      loadData();
      if (tab === "search") searchUsers();
      if (profile) viewProfile(userId);
    } catch (err) { if (!err.handled) toast.error("Failed"); }
  };

  const viewProfile = async (userId) => {
    try { const res = await API.get(`/social/profile/${userId}`); setProfile(res.data); } catch {}
  };

  const compare = async (userId) => {
    try { const res = await API.get(`/social/compare/${userId}`); setComparison(res.data); } catch {}
  };

  if (profile) return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 600 }}>
        <button onClick={() => { setProfile(null); setComparison(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
        <div className="lc-card" style={{ textAlign: "center", padding: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--green-bg)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24, fontWeight: 700 }}>{profile.name?.[0]}</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{profile.name}</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>Level {profile.level} · {profile.xp} XP</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16, fontSize: 14 }}>
            <div><strong>{profile.followers}</strong><br /><span style={{ fontSize: 12, color: "var(--text-muted)" }}>Followers</span></div>
            <div><strong>{profile.following}</strong><br /><span style={{ fontSize: 12, color: "var(--text-muted)" }}>Following</span></div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={() => toggleFollow(profile.userId)} className={profile.isFollowing ? "btn-secondary" : "btn-primary"} style={{ fontSize: 13 }}>
              {profile.isFollowing ? <><UserMinus size={14} /> Unfollow</> : <><UserPlus size={14} /> Follow</>}
            </button>
            <button onClick={() => compare(profile.userId)} className="btn-secondary" style={{ fontSize: 13 }}><BarChart2 size={14} /> Compare</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 }}>
          {[{ label: "Problems", val: profile.problems }, { label: "Topics", val: profile.topics }, { label: "Quizzes", val: profile.quizzes }].map(s => (
            <div key={s.label} className="lc-card" style={{ padding: 14, textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{s.val}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {comparison && (
          <div className="lc-card" style={{ marginTop: 12, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📊 Comparison</h3>
            <table style={{ width: "100%", fontSize: 13 }}><thead><tr style={{ color: "var(--text-muted)" }}><th style={{ textAlign: "left" }}>Metric</th><th>You</th><th>{profile.name}</th></tr></thead><tbody>
              {["problems","topics","quizzes","xp"].map(k => (
                <tr key={k} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "6px 0", textTransform: "capitalize" }}>{k}</td>
                  <td style={{ textAlign: "center", fontWeight: comparison.me[k] >= comparison.them[k] ? 700 : 400, color: comparison.me[k] >= comparison.them[k] ? "var(--green)" : "var(--text-muted)" }}>{comparison.me[k]}</td>
                  <td style={{ textAlign: "center", fontWeight: comparison.them[k] >= comparison.me[k] ? 700 : 400, color: comparison.them[k] >= comparison.me[k] ? "var(--green)" : "var(--text-muted)" }}>{comparison.them[k]}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div></div>
    </div>
  );

  const renderList = (list) => list.length === 0 ? (
    <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
      <Users size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No users found</p>
    </div>
  ) : (
    <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
      {list.map((u, i) => (
        <div key={u.userId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < list.length - 1 ? "1px solid var(--border)" : "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: "var(--text-muted)" }}>{u.name?.[0]}</div>
          <div style={{ flex: 1, cursor: "pointer" }} onClick={() => viewProfile(u.userId)}><p style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</p></div>
          <button onClick={() => toggleFollow(u.userId)} style={{
            padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
            border: `1px solid ${u.isFollowing ? "var(--border)" : "var(--green)"}`,
            background: u.isFollowing ? "var(--bg)" : "var(--green-bg)", color: u.isFollowing ? "var(--text-muted)" : "var(--green)",
          }}>{u.isFollowing ? "Unfollow" : "Follow"}</button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Social</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>Connect with fellow learners</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && searchUsers()} placeholder="Search users..." className="lc-input" style={{ paddingLeft: 34 }} />
          </div>
          <button onClick={searchUsers} className="btn-primary" style={{ fontSize: 13 }}><Search size={14} /></button>
        </div>

        <div className="lc-tabs">
          {[{ id: "following", label: `Following (${following.length})` }, { id: "followers", label: `Followers (${followers.length})` }, ...(results.length ? [{ id: "search", label: "Search Results" }] : [])].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`lc-tab ${tab === t.id ? "active" : ""}`}>{t.label}</button>
          ))}
        </div>

        {loading ? <div style={{textAlign:"center",padding:40}}><Loader size={20} className="animate-spin" style={{color:"var(--green)"}}/></div> : (
          tab === "following" ? renderList(following) : tab === "followers" ? renderList(followers) : renderList(results)
        )}
      </div></div>
    </div>
  );
};

export default Social;
