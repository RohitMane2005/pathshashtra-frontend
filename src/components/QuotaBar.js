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
    { label: "Roadmaps", used: rm.limit - rm.remaining, limit: rm.limit, color: "#FF6B00" },
    { label: "Quizzes", used: qz.limit - qz.remaining, limit: qz.limit, color: "#9B6DFF" },
    { label: "Problems", used: cg.limit - cg.remaining, limit: cg.limit, color: "#00D4C8" },
    { label: "Study Plans", used: sp.limit - sp.remaining, limit: sp.limit, color: "#34D399" },
  ];

  const allFull = items.every(i => i.used >= i.limit);

  return (
    <div className="glass p-4 mb-6 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: "Bricolage Grotesque" }}>
          <Zap size={13} className="text-[#FF8C38]" /> Today's AI Usage
        </h3>
        {allFull && <span className="badge badge-orange text-[10px]">All limits reached · Resets tomorrow</span>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const pct = Math.min((item.used / item.limit) * 100, 100);
          const remaining = item.limit - item.used;
          return (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7A7890]">{item.label}</span>
                <span style={{ color: remaining === 0 ? "#F87171" : item.color }}>
                  {remaining}/{item.limit}
                </span>
              </div>
              <div className="progress-bar" style={{ height: "3px" }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: `${pct}%`,
                  background: remaining === 0 ? "#F87171" : item.color,
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
