import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Trophy, TrendingUp, Compass, Loader } from "lucide-react";
import API from "../api/axios";

const SharedResult = () => {
  const { token } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get(`/quiz/share/${token}`)
      .then(r => setResult(r.data))
      .catch(() => setError(true));
  }, [token]);

  if (error) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center mx-auto mb-4">
          <span className="text-rose-500 text-lg">!</span>
        </div>
        <p className="text-white font-semibold text-lg mb-2">Link not found</p>
        <p className="text-[#71717a] mb-6 text-sm">This result may have been removed.</p>
        <Link to="/" className="btn-primary">Go to PathShashtra</Link>
      </div>
    </div>
  );

  if (!result) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center">
      <Loader size={24} className="animate-spin text-amber-500" />
    </div>
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Mini navbar */}
      <nav className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
            <Compass size={13} className="text-black" />
          </div>
          <span className="text-white font-semibold text-sm" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
        </Link>
        <Link to="/register" className="btn-primary text-sm px-4 py-2">Try it free →</Link>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="card p-6 text-center mb-4 animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mx-auto mb-3">
            <Trophy size={20} className="text-amber-500" />
          </div>
          <p className="text-[#52525b] text-xs uppercase tracking-wider font-semibold mb-1.5">AI Career Report</p>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">{result.summary}</p>
        </div>

        {/* Career matches */}
        <div className="card p-5 mb-4 animate-fade-up stagger-1">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
            <Trophy size={13} className="text-amber-500" /> Career Matches
          </h3>
          {result.careerMatches?.map((c, i) => (
            <div key={i} className="mb-3.5 last:mb-0">
              <div className="flex justify-between mb-1.5">
                <span className="text-white text-sm font-medium">{c.title}</span>
                <span className="text-amber-500 font-semibold text-sm">{c.matchPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${c.matchPercent}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Salary */}
        {result.salaryInfo && (
          <div className="card p-5 mb-5 animate-fade-up stagger-2">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm" style={{ fontFamily: "Space Grotesk" }}>
              <TrendingUp size={13} className="text-emerald-500" /> Salary Outlook
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Entry", value: result.salaryInfo.entryLevel },
                { label: "Mid", value: result.salaryInfo.midLevel },
                { label: "Senior", value: result.salaryInfo.seniorLevel },
              ].map((s, i) => (
                <div key={i} className="p-3 text-center rounded-xl" style={{ background: "var(--bg3)" }}>
                  <p className="text-emerald-500 font-semibold text-sm">{s.value}</p>
                  <p className="text-[#52525b] text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="card p-6 text-center animate-fade-up stagger-3">
          <p className="text-white font-semibold mb-1" style={{ fontFamily: "Space Grotesk" }}>
            Get your own career report
          </p>
          <p className="text-[#71717a] text-sm mb-4">Free AI assessment in under 5 minutes</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Start free assessment →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedResult;
