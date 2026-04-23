import { Link } from "react-router-dom";
import { ArrowRight, Brain, BookOpen, Code2, Map, Users, Zap, Shield, Star } from "lucide-react";

export default function Landing() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#2cbb5d", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>P</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>PathShashtra</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/login" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", padding: "6px 12px" }}>Sign in</Link>
          <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>Get started <ArrowRight size={14} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: "var(--bg-secondary)", border: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} /> AI-Powered Career Platform
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, color: "var(--text)", marginBottom: 16 }}>
          Find your path.<br /><span style={{ color: "var(--green)" }}>Build your future.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
          Career assessments, study planning, and coding practice — powered by AI, built for India's students.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 16, padding: "12px 28px" }}>Start for free <ArrowRight size={16} /></Link>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: "none", fontSize: 16, padding: "12px 28px" }}>Sign in</Link>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 32, fontSize: 14, color: "var(--text-muted)" }}>
          {[{ icon: <Users size={14} />, t: "200+ students" }, { icon: <Zap size={14} />, t: "Free to use" }, { icon: <Shield size={14} />, t: "No credit card" }].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>{item.icon} {item.t}</span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
          {[{ v: "200+", l: "Students" }, { v: "4", l: "AI Tools" }, { v: "38M", l: "Students in India" }, { v: "100%", l: "Free" }].map((s, i) => (
            <div key={i} style={{ background: "var(--bg)", padding: "24px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{s.v}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Four tools. One platform.</h2>
        <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 32 }}>Each built around real problems Indian students face.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {[
            { icon: <Brain size={20} />, title: "AI Career Quiz", desc: "10 psychometric questions → top career matches, skill gaps, and roadmap.", color: "var(--orange)" },
            { icon: <BookOpen size={20} />, title: "Smart Study Planner", desc: "Enter your exam date. AI builds a week-by-week schedule that adapts.", color: "var(--green)" },
            { icon: <Code2 size={20} />, title: "DSA Coding Tutor", desc: "Generate problems, get hints, submit code, get AI review.", color: "var(--purple)" },
            { icon: <Map size={20} />, title: "Career Roadmap", desc: "Step-by-step learning path with resources and milestones.", color: "var(--blue)" },
          ].map((f, i) => (
            <div key={i} className="lc-card" style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${f.color}12`, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 32 }}>What students say.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { q: "PathShashtra's quiz pointed me to Product Management with an 89% match — I've been preparing ever since.", n: "Priya M.", r: "B.Tech IT, Pune" },
            { q: "The study planner built a 4-week GATE schedule automatically. Followed it strictly and cleared GATE 2025.", n: "Arjun R.", r: "M.Tech, Hyderabad" },
            { q: "The roadmap generator gave me exactly what to learn. The DSA tutor is better than most paid platforms.", n: "Sneha J.", r: "Final year, BIT Mesra" },
          ].map((t, i) => (
            <div key={i} className="lc-card">
              <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>{[1,2,3,4,5].map(j => <Star key={j} size={12} style={{ color: "var(--orange)", fill: "var(--orange)" }} />)}</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>"{t.q}"</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.n}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 60px", textAlign: "center" }}>
        <div className="lc-card" style={{ padding: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Ready to find your path?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Free forever. No credit card required.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: "none", fontSize: 15, padding: "10px 24px" }}>Create free account</Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: "none", fontSize: 15, padding: "10px 24px" }}>Sign in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: "#2cbb5d", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>P</div>
            <span style={{ fontWeight: 600, color: "var(--text)" }}>PathShashtra</span>
          </div>
          <span>Built for India's students</span>
        </div>
      </footer>
    </div>
  );
}
