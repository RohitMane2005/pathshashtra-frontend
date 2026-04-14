import { useState, useEffect } from "react";
import API from "../api/axios";
import { Zap } from "lucide-react";

const QuotaBar = () => {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    API.get("/quota").then(res => setQuota(res.data)).catch(() => {});
  }, []);

  if (!quota) return null;

  const safe = (obj) => ({ limit: obj?.limit ?? 0, remaining: obj?.remaining ?? 0 });
  const rm = safe(quota.roadmap), qz = safe(quota.quiz), cg = safe(quota.codingGen), sp = safe(quota.studyPlan);

  const items = [
    { label: "Roadmaps", used: rm.limit - rm.remaining, limit: rm.limit, color: "#f59e0b" },
    { label: "Quizzes", used: qz.limit - qz.remaining, limit: qz.limit, color: "#8b5cf6" },
    { label: "Problems", used: cg.limit - cg.remaining, limit: cg.limit, color: "#10b981" },
    { label: "Study Plans", used: sp.limit - sp.remaining, limit: sp.limit, color: "#38bdf8" },
  ];

  const allFull = items.every(i => i.used >= i.limit);

  return (
    <div className="card p-4 mb-6 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-xs font-semibold flex items-center gap-1.5" style={{ fontFamily: "Space Grotesk" }}>
          <Zap size={12} className="text-amber-500" /> Daily Usage
        </h3>
        {allFull && <span className="badge badge-amber text-[10px]">Limits reached · Resets tomorrow</span>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const pct = Math.min((item.used / item.limit) * 100, 100);
          const remaining = item.limit - item.used;
          return (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#71717a]">{item.label}</span>
                <span style={{ color: remaining === 0 ? "#f43f5e" : item.color }} className="font-medium">
                  {remaining}/{item.limit}
                </span>
              </div>
              <div className="progress-bar">
                <div className="h-full rounded-full transition-all" style={{
                  width: `${pct}%`,
                  background: remaining === 0 ? "#f43f5e" : item.color,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuotaBar;
