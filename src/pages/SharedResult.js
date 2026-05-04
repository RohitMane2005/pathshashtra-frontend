import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Trophy, TrendingUp, Loader } from "lucide-react";
import API from "../api/axios";

const SharedResult = () => {
  const { token } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get(`/quiz/share/${token}`).then(r => setResult(r.data)).catch(() => setError(true));
  }, [token]);

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 40, marginBottom: 8 }}>🔗</p>
        <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Link not found</p>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>This result may have been removed.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: "none" }}>Go to PathShashtra</Link>
      </div>
    </div>
  );

  if (!result) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)" }}>
      <Loader size={24} className="animate-spin" style={{ color: "var(--green)" }} />
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, background: "#89E900", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontSize: 11, fontWeight: 700 }}>P</div>
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>PathShashtra</span>
        </Link>
        <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 13, padding: "6px 14px" }}>Try it free →</Link>
      </nav>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px" }}>
        {/* Header */}
        <div className="lc-card" style={{ textAlign: "center", marginBottom: 12 }}>
          <Trophy size={24} style={{ color: "var(--orange)", marginBottom: 8 }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>AI Career Report</p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{result.summary}</p>
        </div>

        {/* Career Matches */}
        <div className="lc-card" style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Trophy size={13} style={{ color: "var(--orange)" }} /> Career Matches</h3>
          {result.careerMatches?.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{c.title}</span>
                <span style={{ color: "var(--green)", fontWeight: 600 }}>{c.matchPercent}%</span>
              </div>
              <div className="lc-progress"><div className="lc-progress-fill" style={{ width: `${c.matchPercent}%` }} /></div>
            </div>
          ))}
        </div>

        {/* Salary */}
        {result.salaryInfo && (
          <div className="lc-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><TrendingUp size={13} style={{ color: "var(--green)" }} /> Salary Outlook</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[{ l: "Entry", v: result.salaryInfo.entryLevel }, { l: "Mid", v: result.salaryInfo.midLevel }, { l: "Senior", v: result.salaryInfo.seniorLevel }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: 10, background: "var(--bg-secondary)", borderRadius: 6 }}>
                  <p style={{ color: "var(--green)", fontWeight: 600, fontSize: 14 }}>{s.v}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="lc-card" style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Get your own career report</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Free AI assessment in under 5 minutes</p>
          <Link to="/register" className="btn-primary" style={{ textDecoration: "none" }}>Start free assessment →</Link>
        </div>
      </div>
    </div>
  );
};

export default SharedResult;
