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
        <p className="text-4xl mb-4">🔗</p>
        <p className="text-white font-bold text-xl mb-2">Link not found</p>
        <p className="text-[#7A7890] mb-6">This result may have been removed.</p>
        <Link to="/" className="btn-primary">Go to PathShashtra</Link>
      </div>
    </div>
  );

  if (!result) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center">
      <Loader size={28} className="animate-spin text-[#FF6B00]" />
    </div>
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Mini navbar */}
      <nav className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
            <Compass size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
        </Link>
        <Link to="/register" className="btn-primary text-sm px-4 py-2">Try it free →</Link>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="glass-bright p-6 text-center mb-4 animate-fade-up">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center mx-auto mb-3">
            <Trophy size={24} className="text-white" />
          </div>
          <p className="text-[#7A7890] text-xs uppercase tracking-wider mb-1">AI Career Report</p>
          <p className="text-white text-sm leading-relaxed">{result.summary}</p>
        </div>

        {/* Career matches */}
        <div className="glass p-5 mb-4 animate-fade-up stagger-1">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
            <Trophy size={15} className="text-[#FF8C38]" /> Career Matches
          </h3>
          {result.careerMatches?.map((c, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-white text-sm font-medium">{c.title}</span>
                <span className="text-[#FF8C38] font-bold text-sm">{c.matchPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${c.matchPercent}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Salary */}
        {result.salaryInfo && (
          <div className="glass p-5 mb-6 animate-fade-up stagger-2">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
              <TrendingUp size={15} className="text-[#00D4C8]" /> Salary Outlook
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Entry", value: result.salaryInfo.entryLevel },
                { label: "Mid", value: result.salaryInfo.midLevel },
                { label: "Senior", value: result.salaryInfo.seniorLevel },
              ].map((s, i) => (
                <div key={i} className="glass p-3 text-center">
                  <p className="text-[#00D4C8] font-bold text-sm">{s.value}</p>
                  <p className="text-[#7A7890] text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="glass-bright p-6 text-center animate-fade-up stagger-3">
          <p className="text-white font-bold mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>
            Get your own career report
          </p>
          <p className="text-[#7A7890] text-sm mb-4">Free AI career assessment in under 5 minutes</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Start free assessment →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedResult;
