import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Brain, BookOpen, Code2, Map, Users, Zap, Shield, 
  Star, ChevronDown, Sparkles, Terminal, Trophy, 
  Target, MessageSquare
} from "lucide-react";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "Is PathShashtra completely free for students?",
      a: "Yes! PathShashtra is 100% free for college and school students. You get full access to AI career assessments, personalized study planning, DSA coding problems with AI feedback, and roadmap generation without any subscription or credit card."
    },
    {
      q: "How does the AI Career Assessment work?",
      a: "Our psychometric engine evaluates your skills, academic background, problem-solving style, and interests through 12 targeted questions to calculate your highest probability career matches, salary benchmarks, and actionable preparation steps."
    },
    {
      q: "Can I use PathShashtra to prepare for campus placements and GATE?",
      a: "Absolutely. The DSA Coding Tutor generates LeetCode-style questions with hints and automated test cases, while the Smart Study Planner builds structured daily schedules tailored specifically for exams like GATE, CAT, and tech company placement drives."
    },
    {
      q: "How does the DSA Coding Tutor provide AI feedback?",
      a: "When you write code in Python, Java, C++, or JavaScript, the AI evaluates your approach for time/space complexity, edge cases, and best practices. If you're stuck, you can request up to 3 progressive hints without revealing the full answer."
    },
    {
      q: "Can I customize my study roadmap as my exams get closer?",
      a: "Yes. Your study planner and roadmap dynamically adapt. You can mark completed topics, track your confidence score, and regenerate schedules if your exam dates or daily study hours change."
    }
  ];

  return (
    <div style={{ background: "var(--bg, #06080c)", minHeight: "100vh", position: "relative", overflow: "hidden", color: "var(--text, #f8fafc)" }}>
      {/* Background Neon Ambient Glows */}
      <div style={{ 
        position: "absolute", top: "-140px", left: "50%", transform: "translateX(-50%)", 
        width: "600px", height: "600px", borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(137, 233, 0, 0.12) 0%, rgba(6, 8, 12, 0) 70%)", 
        pointerEvents: "none", zIndex: 0 
      }} />
      <div style={{ 
        position: "absolute", top: "700px", right: "-120px", 
        width: "500px", height: "500px", borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(137, 233, 0, 0.08) 0%, rgba(6, 8, 12, 0) 70%)", 
        pointerEvents: "none", zIndex: 0 
      }} />

      {/* ─── Top Public Navigation ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(6, 8, 12, 0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)"
      }}>
        <nav className="landing-nav" style={{ 
          display: "flex", alignItems: "center", justifyContent: "space-between", 
          padding: "16px 32px", maxWidth: 1240, margin: "0 auto"
        }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ 
              width: 34, height: 34, borderRadius: 9, 
              background: "#89E900", display: "flex", alignItems: "center", justifyContent: "center", 
              color: "#07090e", fontSize: 18, fontWeight: 900, 
              boxShadow: "0 0 20px rgba(137, 233, 0, 0.5)" 
            }}>
              P
            </div>
            <span style={{ 
              fontWeight: 900, fontSize: 19, letterSpacing: "0.02em", 
              color: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif" 
            }}>
              PATHSHASHTRA
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="landing-center-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <button onClick={() => scrollTo('about')} className="nav-text-btn">About</button>
            <button onClick={() => scrollTo('how-it-works')} className="nav-text-btn">How It Works</button>
            <button onClick={() => scrollTo('features')} className="nav-text-btn">Features</button>
            <button onClick={() => scrollTo('reviews')} className="nav-text-btn">Reviews</button>
            <button onClick={() => scrollTo('faq')} className="nav-text-btn">FAQ</button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link to="/login" style={{ 
              fontSize: 14, fontWeight: 600, color: "var(--text-secondary, #cbd5e1)", 
              textDecoration: "none", padding: "8px 16px", borderRadius: 8, transition: "color 0.2s" 
            }}>
              Login
            </Link>
            <Link to="/register" className="btn-primary" style={{ 
              textDecoration: "none", fontSize: 14, padding: "9px 20px", borderRadius: 9,
              background: "#89E900", color: "#07090e", fontWeight: 700
            }}>
              Get Started →
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="landing-hero" style={{ 
        textAlign: "center", padding: "120px 24px 75px", maxWidth: 840, margin: "0 auto", position: "relative", zIndex: 1 
      }}>
        {/* Glow Badge */}
        <div style={{ 
          display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 24, 
          background: "rgba(137, 233, 0, 0.08)", border: "1px solid rgba(137, 233, 0, 0.35)", 
          backdropFilter: "blur(12px)", fontSize: 13, color: "#89E900", fontWeight: 700, marginBottom: 28,
          boxShadow: "0 0 24px rgba(137, 233, 0, 0.2)"
        }}>
          <Sparkles size={14} /> AI-Powered Career & Study Platform for Students
        </div>

        {/* Main Headline */}
        <h1 className="landing-h1" style={{ 
          fontSize: 58, fontWeight: 900, lineHeight: 1.1, color: "#ffffff", marginBottom: 24, letterSpacing: "-0.03em" 
        }}>
          Find your path.<br />
          <span style={{ 
            background: "linear-gradient(135deg, #ffffff 10%, #d9f99d 50%, #89E900 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Build your future.
          </span>
        </h1>

        <p style={{ 
          fontSize: 18, color: "var(--text-muted, #94a3b8)", lineHeight: 1.7, marginBottom: 38, maxWidth: 620, margin: "0 auto 38px" 
        }}>
          Psychometric career assessments, adaptive exam study planning, and placement-ready DSA coding practice — customized for students in India.
        </p>

        {/* Primary CTA Buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          <Link to="/register" className="btn-primary" style={{ 
            textDecoration: "none", fontSize: 16, padding: "14px 34px", borderRadius: 12,
            background: "#89E900", color: "#07090e", fontWeight: 800,
            boxShadow: "0 4px 25px rgba(137, 233, 0, 0.45)"
          }}>
            Get Started →
          </Link>
          <Link to="/login" style={{ 
            textDecoration: "none", fontSize: 16, padding: "14px 32px", borderRadius: 12,
            background: "rgba(255, 255, 255, 0.05)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.12)",
            fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8
          }}>
            Login
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="landing-trust" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: <Users size={15} style={{ color: "#89E900" }} />, t: "200+ Students Onboarded" },
            { icon: <Zap size={15} style={{ color: "#89E900" }} />, t: "100% Free Access" },
            { icon: <Shield size={15} style={{ color: "#89E900" }} />, t: "No Credit Card Needed" }
          ].map((item, i) => (
            <span key={i} style={{ 
              display: "flex", alignItems: "center", gap: 8, background: "rgba(11, 15, 23, 0.8)", 
              padding: "7px 16px", borderRadius: 20, border: "1px solid rgba(137, 233, 0, 0.2)",
              fontSize: 13, color: "var(--text-secondary, #cbd5e1)", fontWeight: 500
            }}>
              {item.icon} {item.t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Metrics / Stats ─── */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px", position: "relative", zIndex: 1 }}>
        <div className="landing-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { v: "200+", l: "Active Students", desc: "Across 40+ engineering colleges" },
            { v: "4-in-1", l: "AI Suite", desc: "Assessment, Study, Coding, Roadmap" },
            { v: "94%", l: "Accuracy", desc: "Top career match confidence" },
            { v: "₹0", l: "Forever Free", desc: "Open to all learners" }
          ].map((s, i) => (
            <div key={i} className="lc-card" style={{ padding: "26px 18px", textAlign: "center", background: "rgba(11, 15, 23, 0.75)" }}>
              <p style={{ fontSize: 36, fontWeight: 900, color: "#89E900", marginBottom: 4, letterSpacing: "-0.02em" }}>{s.v}</p>
              <p style={{ fontSize: 14, color: "#ffffff", fontWeight: 700, marginBottom: 4 }}>{s.l}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted, #94a3b8)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section id="about" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 90px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: "#89E900", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            About PathShashtra
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            The Career Operating System for Indian Students
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted, #94a3b8)", maxWidth: 640, margin: "12px auto 0", lineHeight: 1.6 }}>
            Millions of students navigate college with outdated advice, scattered YouTube videos, and generic syllabus notes. PathShashtra gives you personal AI guidance built specifically for your goals.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <div className="lc-card" style={{ padding: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(137, 233, 0, 0.12)", color: "#89E900", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Zero Confusion</h3>
            <p style={{ fontSize: 14, color: "var(--text-muted, #94a3b8)", lineHeight: 1.6 }}>
              Discover exact career roles (Frontend, DevOps, AI Engineer, PM) that match your aptitude and current skillset.
            </p>
          </div>

          <div className="lc-card" style={{ padding: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(137, 233, 0, 0.12)", color: "#89E900", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Dynamic Exam Plans</h3>
            <p style={{ fontSize: 14, color: "var(--text-muted, #94a3b8)", lineHeight: 1.6 }}>
              Input your semester exam or competitive test date. Get a daily syllabus breakdown with confidence tracking.
            </p>
          </div>

          <div className="lc-card" style={{ padding: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(137, 233, 0, 0.12)", color: "#89E900", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Terminal size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Placement Ready Coding</h3>
            <p style={{ fontSize: 14, color: "var(--text-muted, #94a3b8)", lineHeight: 1.6 }}>
              Write solutions in an interactive editor, ask for intelligent hints, and receive instant complexity code reviews.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How It Works Section ─── */}
      <section id="how-it-works" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 90px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ color: "#89E900", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Simple 4-Step Process
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            How PathShashtra Accelerates Your Growth
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }} className="how-it-works-grid">
          {[
            {
              step: "01",
              title: "Take Career Quiz",
              desc: "Answer 12 adaptive psychometric questions to unlock your personality profile and top 3 career tracks."
            },
            {
              step: "02",
              title: "Generate Roadmap",
              desc: "Get an end-to-end curriculum with milestones, curated project ideas, and timeline checkpoints."
            },
            {
              step: "03",
              title: "Practice & Study",
              desc: "Follow your daily study schedule and solve DSA problems with on-demand AI coaching and hints."
            },
            {
              step: "04",
              title: "Track & Win",
              desc: "Monitor your consistency streak, earn achievement badges, and ace campus placement interviews."
            }
          ].map((item, idx) => (
            <div key={idx} className="lc-card" style={{ padding: 26, position: "relative", background: "rgba(11, 15, 23, 0.85)" }}>
              <div style={{ 
                fontSize: 32, fontWeight: 900, color: "#89E900", opacity: 0.9, 
                marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" 
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted, #94a3b8)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 90px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ color: "#89E900", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Core Capabilities
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Six Intelligent Tools in One Single Hub
          </h2>
        </div>

        <div className="landing-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { 
              icon: <Brain size={22} />, 
              title: "AI Career Discovery", 
              desc: "Comprehensive psychometric evaluation that predicts your role suitability and salary potential." 
            },
            { 
              icon: <BookOpen size={22} />, 
              title: "Smart Study Planner", 
              desc: "Automated daily study breakdown based on your upcoming exams and daily time availability." 
            },
            { 
              icon: <Code2 size={22} />, 
              title: "DSA Coding Tutor", 
              desc: "Practice algorithmic problems with instant AI execution analysis, edge-case checks, and hints." 
            },
            { 
              icon: <Map size={22} />, 
              title: "Visual Career Roadmap", 
              desc: "Step-by-step learning path covering fundamentals, frameworks, databases, and portfolio projects." 
            },
            { 
              icon: <MessageSquare size={22} />, 
              title: "Discussion & Community", 
              desc: "Ask technical doubts, upvote solutions, and connect with fellow engineering peers across India." 
            },
            { 
              icon: <Trophy size={22} />, 
              title: "Weekly Growth Reports", 
              desc: "Automated streak analytics, problems solved counter, XP badges, and weekly progress summaries." 
            },
          ].map((f, i) => (
            <div key={i} className="lc-card" style={{ padding: 28 }}>
              <div style={{ 
                width: 44, height: 44, borderRadius: 12, background: "rgba(137, 233, 0, 0.12)", 
                color: "#89E900", border: "1px solid rgba(137, 233, 0, 0.3)", 
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
                boxShadow: "0 0 16px rgba(137, 233, 0, 0.15)"
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-muted, #94a3b8)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Reviews / Testimonials Section ─── */}
      <section id="reviews" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 90px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: "#89E900", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Student Feedback
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Loved by Students Across India
          </h2>
        </div>

        <div className="landing-testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { 
              q: "PathShashtra's quiz gave me clarity between Data Science and Full Stack. The roadmap saved me months of tutorial paralysis.", 
              n: "Priya Sharma", 
              r: "B.Tech CSE, Pune University" 
            },
            { 
              q: "The study planner created my GATE prep schedule automatically. Followed it strictly and scored 680+ in GATE 2025!", 
              n: "Arjun Rao", 
              r: "ECE, Osmania University" 
            },
            { 
              q: "The DSA tutor's AI hints are unbelievable. It doesn't spoonfeed you the answer, but pushes you to think like an interviewer.", 
              n: "Sneha Joshi", 
              r: "Final Year IT, BIT Mesra" 
            },
          ].map((t, i) => (
            <div key={i} className="lc-card" style={{ padding: 26 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {[1,2,3,4,5].map(j => <Star key={j} size={15} style={{ color: "#89E900", fill: "#89E900" }} />)}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary, #cbd5e1)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                "{t.q}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: "50%", background: "rgba(137, 233, 0, 0.2)", 
                  color: "#89E900", display: "flex", alignItems: "center", justifyContent: "center", 
                  fontWeight: 800, fontSize: 13 
                }}>
                  {t.n.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.n}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted, #94a3b8)" }}>{t.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section id="faq" style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px 90px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ color: "#89E900", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Got Questions? We've Got Answers.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {faqs.map((f, i) => (
            <div 
              key={i} 
              onClick={() => toggleFaq(i)}
              className="lc-card" 
              style={{ 
                padding: "20px 24px", cursor: "pointer", 
                border: openFaq === i ? "1px solid rgba(137, 233, 0, 0.45)" : "1px solid rgba(255, 255, 255, 0.08)",
                background: openFaq === i ? "rgba(137, 233, 0, 0.04)" : "rgba(11, 15, 23, 0.75)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: openFaq === i ? "#89E900" : "#ffffff", margin: 0 }}>
                  {f.q}
                </h4>
                <ChevronDown 
                  size={18} 
                  style={{ 
                    color: openFaq === i ? "#89E900" : "var(--text-muted, #94a3b8)", 
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", 
                    transition: "transform 0.25s ease",
                    flexShrink: 0
                  }} 
                />
              </div>
              {openFaq === i && (
                <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-muted, #94a3b8)", lineHeight: 1.7 }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Box ─── */}
      <section style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px 90px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="lc-card" style={{ 
          padding: "54px 36px", border: "1px solid rgba(137, 233, 0, 0.35)", 
          boxShadow: "0 12px 50px rgba(137, 233, 0, 0.15)",
          background: "radial-gradient(ellipse at top, rgba(137, 233, 0, 0.08), rgba(11, 15, 23, 0.95))"
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Ready to Take Charge of Your Career?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted, #94a3b8)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
            Join hundreds of engineering students building their career roadmaps and acing placements with PathShashtra.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-primary" style={{ 
              textDecoration: "none", fontSize: 16, padding: "14px 34px", borderRadius: 12,
              background: "#89E900", color: "#07090e", fontWeight: 800,
              boxShadow: "0 4px 25px rgba(137, 233, 0, 0.45)"
            }}>
              Get Started →
            </Link>
            <Link to="/login" style={{ 
              textDecoration: "none", fontSize: 16, padding: "14px 30px", borderRadius: 12,
              background: "rgba(255, 255, 255, 0.06)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.12)",
              fontWeight: 600
            }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ 
        borderTop: "1px solid rgba(255, 255, 255, 0.06)", padding: "32px 24px", 
        position: "relative", zIndex: 1, backdropFilter: "blur(12px)", background: "rgba(6, 8, 12, 0.9)" 
      }}>
        <div className="landing-footer-inner" style={{ 
          maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", 
          justifyContent: "space-between", fontSize: 13, color: "var(--text-muted, #94a3b8)" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ 
              width: 26, height: 26, borderRadius: 7, background: "#89E900", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "#07090e", fontSize: 13, fontWeight: 900 
            }}>
              P
            </div>
            <span style={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.02em" }}>PATHSHASHTRA</span>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <button onClick={() => scrollTo('about')} className="nav-text-btn" style={{ fontSize: 13 }}>About</button>
            <button onClick={() => scrollTo('how-it-works')} className="nav-text-btn" style={{ fontSize: 13 }}>How It Works</button>
            <button onClick={() => scrollTo('features')} className="nav-text-btn" style={{ fontSize: 13 }}>Features</button>
            <button onClick={() => scrollTo('reviews')} className="nav-text-btn" style={{ fontSize: 13 }}>Reviews</button>
            <button onClick={() => scrollTo('faq')} className="nav-text-btn" style={{ fontSize: 13 }}>FAQ</button>
          </div>

          <span>© {new Date().getFullYear()} PathShashtra • Crafted with AI for India's Students</span>
        </div>
      </footer>

      {/* Responsive Inline Styles */}
      <style>{`
        .nav-text-btn {
          background: none;
          border: none;
          color: var(--text-secondary, #cbd5e1);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 4px;
          transition: color 0.2s ease;
          font-family: inherit;
        }
        .nav-text-btn:hover {
          color: #89E900;
        }
        @media (max-width: 900px) {
          .landing-center-nav { display: none !important; }
          .landing-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .how-it-works-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .landing-testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .landing-hero { padding: 50px 16px 40px !important; }
          .landing-h1 { font-size: 34px !important; }
          .landing-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .landing-features-grid { grid-template-columns: 1fr !important; }
          .how-it-works-grid { grid-template-columns: 1fr !important; }
          .landing-footer-inner { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>
    </div>
  );
}
