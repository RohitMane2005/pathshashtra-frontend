import { Link } from "react-router-dom";
import { ArrowRight, Brain, BookOpen, Code2, Map, Users, Zap, Shield, Star } from "lucide-react";

export default function Landing() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background Ambient Orbs */}
      <div className="ambient-orb ambient-orb-cyan" style={{ top: "-100px", left: "50%", transform: "translateX(-50%)" }} />
      <div className="ambient-orb ambient-orb-indigo" style={{ top: "400px", right: "-100px" }} />
      <div className="ambient-orb ambient-orb-violet" style={{ top: "900px", left: "-100px" }} />

      {/* Navbar */}
      <nav className="landing-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 800, boxShadow: "0 0 16px rgba(6,182,212,0.4)" }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", letterSpacing: "-0.02em" }}>PathShashtra</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", padding: "8px 16px", borderRadius: 8, transition: "color 0.2s" }}>Sign in</Link>
          <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>Get started <ArrowRight size={14} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero animate-slide-up" style={{ textAlign: "center", padding: "90px 24px 70px", maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="animate-float-slow" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(15, 23, 42, 0.65)", border: "1px solid rgba(6, 182, 212, 0.3)", backdropFilter: "blur(12px)", fontSize: 13, color: "var(--primary)", fontWeight: 500, marginBottom: 28, boxShadow: "0 4px 20px rgba(6,182,212,0.15)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 10px #06b6d4" }} /> AI-Powered Career Guidance
        </div>
        <h1 className="landing-h1" style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.12, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.03em" }}>
          Find your path.<br /><span className="gradient-text">Build your future.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
          Career assessments, personalized study planning, and coding practice — powered by AI, built specifically for India's students.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 16, padding: "13px 32px", borderRadius: 12 }}>Start for free <ArrowRight size={16} /></Link>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: "none", fontSize: 16, padding: "13px 32px", borderRadius: 12 }}>Sign in</Link>
        </div>
        <div className="landing-trust" style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 40, fontSize: 14, color: "var(--text-muted)", flexWrap: "wrap" }}>
          {[{ icon: <Users size={15} style={{ color: "#06b6d4" }} />, t: "200+ students" }, { icon: <Zap size={15} style={{ color: "#6366f1" }} />, t: "Free to use" }, { icon: <Shield size={15} style={{ color: "#10b981" }} />, t: "No credit card" }].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(15, 23, 42, 0.4)", padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)" }}>{item.icon} {item.t}</span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 70px", position: "relative", zIndex: 1 }}>
        <div className="landing-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[{ v: "200+", l: "Students" }, { v: "4", l: "AI Tools" }, { v: "38M", l: "Students in India" }, { v: "100%", l: "Free" }].map((s, i) => (
            <div key={i} className="lc-card" style={{ padding: "24px 16px", textAlign: "center" }}>
              <p className="gradient-text-cyan" style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{s.v}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 70px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>Four tools. One platform.</h2>
        <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 36 }}>Each built around real problems Indian students face every day.</p>
        <div className="landing-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {[
            { icon: <Brain size={22} />, title: "AI Career Quiz", desc: "12 psychometric questions → personality profile, top career matches, salary insights, and action plan.", color: "#06b6d4" },
            { icon: <BookOpen size={22} />, title: "Smart Study Planner", desc: "Enter your exam date. AI builds a week-by-week schedule that adapts as you progress.", color: "#10b981" },
            { icon: <Code2 size={22} />, title: "DSA Coding Tutor", desc: "Generate coding problems, get hints, submit code, get instant AI code review.", color: "#8b5cf6" },
            { icon: <Map size={22} />, title: "Career Roadmap", desc: "Step-by-step learning path with curated resources, projects, and career milestones.", color: "#6366f1" },
          ].map((f, i) => (
            <div key={i} className="lc-card" style={{ display: "flex", gap: 18, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 16px ${f.color}20` }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 70px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 36, letterSpacing: "-0.02em" }}>What students say.</h2>
        <div className="landing-testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { q: "PathShashtra's quiz pointed me to Product Management with an 89% match — I've been preparing ever since.", n: "Priya M.", r: "B.Tech IT, Pune" },
            { q: "The study planner built a 4-week GATE schedule automatically. Followed it strictly and cleared GATE 2025.", n: "Arjun R.", r: "M.Tech, Hyderabad" },
            { q: "The roadmap generator gave me exactly what to learn. The DSA tutor is better than most paid platforms.", n: "Sneha J.", r: "Final year, BIT Mesra" },
          ].map((t, i) => (
            <div key={i} className="lc-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>{[1,2,3,4,5].map(j => <Star key={j} size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 20, fontStyle: "italic" }}>"{t.q}"</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t.n}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 650, margin: "0 auto", padding: "0 24px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="lc-card" style={{ padding: 48, border: "1px solid rgba(6, 182, 212, 0.3)", boxShadow: "0 12px 40px rgba(6, 182, 212, 0.15)" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.02em" }}>Ready to find your path?</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 28 }}>Free forever. No credit card required.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 15, padding: "12px 28px", borderRadius: 10 }}>Create free account</Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: "none", fontSize: 15, padding: "12px 28px", borderRadius: 10 }}>Sign in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 24px", position: "relative", zIndex: 1, backdropFilter: "blur(12px)", background: "rgba(7, 10, 18, 0.8)" }}>
        <div className="landing-footer-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>P</div>
            <span style={{ fontWeight: 700, color: "var(--text)" }}>PathShashtra</span>
          </div>
          <span>Built with AI for India's students</span>
        </div>
      </footer>
      <style>{`
        @media (max-width: 768px) {
          .landing-hero { padding: 40px 16px 40px !important; }
          .landing-h1 { font-size: 28px !important; }
          .landing-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .landing-features-grid { grid-template-columns: 1fr !important; }
          .landing-testimonials-grid { grid-template-columns: 1fr !important; }
          .landing-trust { gap: 12px !important; font-size: 12px !important; }
          .landing-nav { padding: 10px 14px !important; }
          .landing-footer-inner { flex-direction: column; gap: 8px; text-align: center; }
        }
        @media (max-width: 480px) {
          .landing-h1 { font-size: 24px !important; }
          .landing-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
