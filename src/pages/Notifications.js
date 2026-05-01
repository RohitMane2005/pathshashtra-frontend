import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { Bell, Check, CheckCheck, Trophy, Users, Zap, Calendar, Loader } from "lucide-react";

const TYPE_ICONS = { STREAK: Zap, ACHIEVEMENT: Trophy, CONTEST: Calendar, SOCIAL: Users, SYSTEM: Bell };
const TYPE_COLORS = { STREAK: "var(--orange)", ACHIEVEMENT: "var(--green)", CONTEST: "var(--blue)", SOCIAL: "var(--purple, #9b59b6)", SYSTEM: "var(--text-muted)" };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    try { const res = await API.get("/notifications"); setNotifications(res.data.content || res.data || []); } catch {} finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try { await API.put(`/notifications/${id}/read`); setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n)); } catch {}
  };

  const markAllRead = async () => {
    try { await API.put("/notifications/read-all"); setNotifications(prev => prev.map(n => ({...n, read: true}))); } catch {}
  };

  const timeAgo = (d) => {
    const mins = Math.floor((Date.now() - new Date(d)) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins/60)}h ago`;
    return `${Math.floor(mins/1440)}d ago`;
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}><Navbar />
      <div className="page-content"><div className="page-inner" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div><h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Notifications</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{unread > 0 ? `${unread} unread` : "All caught up!"}</p></div>
          {unread > 0 && <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--blue)", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><CheckCheck size={14} /> Mark all read</button>}
        </div>

        {loading ? <div style={{textAlign:"center",padding:40}}><Loader size={20} className="animate-spin" style={{color:"var(--green)"}}/></div> : notifications.length === 0 ? (
          <div className="lc-card" style={{ textAlign: "center", padding: 40 }}>
            <Bell size={24} style={{ color: "var(--text-light)", marginBottom: 8 }} />
            <p style={{ fontWeight: 500 }}>No notifications</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>You'll see activity updates here</p>
          </div>
        ) : (
          <div className="lc-card" style={{ padding: 0, overflow: "hidden" }}>
            {notifications.map((n, i) => {
              const Icon = TYPE_ICONS[n.type] || Bell;
              return (
                <div key={n.id} onClick={() => !n.read && markRead(n.id)} style={{
                  display: "flex", gap: 12, padding: "12px 16px", cursor: n.read ? "default" : "pointer",
                  borderBottom: i < notifications.length - 1 ? "1px solid #f0f0f0" : "none",
                  background: n.read ? "transparent" : "var(--bg-secondary)",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${TYPE_COLORS[n.type]}15`, color: TYPE_COLORS[n.type] }}><Icon size={15} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 4 }}>{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", flexShrink: 0, marginTop: 6 }} />}
                </div>
              );
            })}
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Notifications;
