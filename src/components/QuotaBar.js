import { useState, useEffect } from "react";
import API from "../api/axios";

const QuotaBar = () => {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    API.get("/quota").then(res => setQuota(res.data)).catch(() => {});
  }, []);

  if (!quota) return null;

  const safe = (obj) => ({ limit: obj?.limit ?? 0, remaining: obj?.remaining ?? 0 });
  const rm = safe(quota.roadmap), qz = safe(quota.quiz), cg = safe(quota.codingGen), sp = safe(quota.studyPlan);

  const items = [
    { label: "Roadmaps", used: rm.limit - rm.remaining, limit: rm.limit, color: "var(--orange)" },
    { label: "Quizzes", used: qz.limit - qz.remaining, limit: qz.limit, color: "var(--purple)" },
    { label: "Problems", used: cg.limit - cg.remaining, limit: cg.limit, color: "var(--green)" },
    { label: "Study Plans", used: sp.limit - sp.remaining, limit: sp.limit, color: "var(--blue)" },
  ];

  return (
    <div className="lc-card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Daily Usage</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {items.map((item, i) => {
          const pct = Math.min((item.used / item.limit) * 100, 100);
          const remaining = item.limit - item.used;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                <span style={{ color: remaining === 0 ? "var(--red)" : item.color, fontWeight: 500 }}>
                  {remaining}/{item.limit}
                </span>
              </div>
              <div className="lc-progress">
                <div className="lc-progress-fill" style={{ width: `${pct}%`, background: remaining === 0 ? "var(--red)" : item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuotaBar;
